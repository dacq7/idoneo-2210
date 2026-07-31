'use client';

// src/components/sesion/controlador-sesion.tsx — Client Component (§10.3).
//
// Un solo controlador para las cuatro sesiones del producto: práctica, quiz,
// diagnóstico y los dos simulacros. Lo que cambia entre ellas viaja en el
// blueprint —cuántos ítems, de dónde, con cronómetro o sin él, con
// retroalimentación inmediata o al final— y en `registro`, que dice qué se
// escribe en el progreso al terminar.
//
// ══ FRONTERA (ADR-010) ══
// NO importa `content/`. Ni el blueprint ni el banco: los dos llegan por prop
// desde la página, que es Server Component y los carga allí con
// `cargarBancoModulo(slug)`. Un `import` de `content/banco/indice` desde aquí
// metería el banco en el bundle de la ruta.
//
// ══ ALEATORIEDAD Y RELOJ (§22 reglas 5 y 6) ══
// Cero `Math.random()`. La semilla se genera con `Date.now()` DENTRO del handler
// de «Empezar» —nunca en el cuerpo de un render— y de ella salen las dos cosas
// aleatorias de una tanda: qué ítems entran (`armarSimulacro`) y en qué orden se
// presentan sus opciones (`presentarTanda`). Misma semilla ⇒ misma tanda, que es
// lo que permitirá reproducir un intento en el Paso 12.
//
// ══ LO QUE TODAVÍA NO HACE ══
// No hay cronómetro ni sesión persistida: `blueprint.minutos` es `null` en
// práctica y quiz, que son las dos sesiones que existen hoy. El cronómetro, el
// diálogo de reanudar y la escritura de `SesionCronometro` llegan con el Paso 11
// y entran por aquí sin cambiar el contrato.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { Retroalimentacion } from '@/components/items/retroalimentacion';
import { useSesion } from '@/hooks/usar-sesion';
import {
  guardarColaRepaso,
  leerEstado,
  marcarPracticaCompletada,
  registrarQuiz,
} from '@/lib/almacenamiento';
import { armarSimulacro, calificar, presentarTanda } from '@/lib/simulacro';
import { encolar } from '@/lib/srs';
import type { BlueprintExamen, BloqueId, Item } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import { Boton } from './boton';
import { fechaLocalDe } from '@/lib/fechas';
import { ResumenSesion } from './resumen-sesion';

/** Qué se escribe en el progreso cuando la tanda se cierra. */
export type RegistroSesion =
  | { clase: 'practica'; slug: string }
  | { clase: 'quiz'; slug: string }
  /** Sesión que no toca el progreso. La usarán el diagnóstico y los simulacros
   *  del Paso 11, que guardan un `IntentoSimulacro` por otra vía. */
  | { clase: 'suelta' };

interface Props {
  blueprint: BlueprintExamen;
  /** El banco del módulo o del ámbito, cargado en el servidor. */
  banco: readonly Item[];
  registro: RegistroSesion;
  bloque: BloqueId;
  volver: { href: string; texto: string };
  siguiente?: { href: string; texto: string } | null;
}

export function ControladorSesion({
  blueprint,
  banco,
  registro,
  bloque,
  volver,
  siguiente,
}: Props) {
  const [tanda, setTanda] = useState<{ semilla: number; items: Item[] } | null>(null);

  const empezar = useCallback(() => {
    // Handler de evento: aquí SÍ se puede leer el reloj (§10.4).
    const semilla = Date.now();
    const elegidos = armarSimulacro(blueprint, banco, semilla);
    setTanda({ semilla, items: presentarTanda(elegidos, semilla) });
  }, [blueprint, banco]);

  if (tanda === null) {
    return <Portada blueprint={blueprint} disponibles={banco.length} onEmpezar={empezar} />;
  }

  return (
    // `key` con la semilla: repetir la tanda genera una semilla nueva y remonta
    // la sesión entera. Es lo que garantiza que no quede ni una respuesta, ni un
    // cronómetro de ítem, ni un foco del intento anterior.
    <SesionEnCurso
      key={tanda.semilla}
      items={tanda.items}
      blueprint={blueprint}
      registro={registro}
      bloque={bloque}
      volver={volver}
      siguiente={siguiente}
      onRepetir={empezar}
    />
  );
}

function Portada({
  blueprint,
  disponibles,
  onEmpezar,
}: {
  blueprint: BlueprintExamen;
  disponibles: number;
  onEmpezar: () => void;
}) {
  const cortos = disponibles < blueprint.totalItems;

  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2>{blueprint.titulo}</h2>
      <p className="text-muted-foreground">{blueprint.descripcion}</p>

      {cortos ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          Este módulo tiene {disponibles} {disponibles === 1 ? 'ítem publicado' : 'ítems publicados'},
          así que la tanda va a ser de {disponibles} y no de {blueprint.totalItems}.
        </p>
      ) : null}

      <Boton onClick={onEmpezar} className="min-h-[52px] w-full text-[0.9375rem]">
        Empezar
      </Boton>
    </section>
  );
}

function SesionEnCurso({
  items,
  blueprint,
  registro,
  bloque,
  volver,
  siguiente,
  onRepetir,
}: {
  items: Item[];
  blueprint: BlueprintExamen;
  registro: RegistroSesion;
  bloque: BloqueId;
  volver: { href: string; texto: string };
  siguiente?: { href: string; texto: string } | null;
  onRepetir: () => void;
}) {
  const sesion = useSesion(items);
  const inmediato = blueprint.feedbackInmediato;
  const refResumen = useRef<HTMLHeadingElement>(null);

  // Guarda de persistencia. `sesion.terminar()` ya es idempotente, pero eso solo
  // evita recalcular: sin esta ref, dos cierres escribirían DOS veces en
  // localStorage y `registrarQuiz` sumaría `intentosQuiz` dos veces. Ref y no
  // estado: el guardado ocurre dentro del mismo tick que la llamada.
  const yaPersistido = useRef(false);

  const cerrar = useCallback(() => {
    if (yaPersistido.current) return;
    yaPersistido.current = true;
    const resumen = sesion.terminar();
    // Handler: el reloj se lee aquí, no en el render (§10.4).
    const momento = new Date();
    const ahora = momento.toISOString();
    if (registro.clase === 'practica') marcarPracticaCompletada(registro.slug, ahora);
    if (registro.clase === 'quiz') registrarQuiz(registro.slug, resumen.puntaje, ahora);

    // SRS (Paso 10): todo ítem fallado entra a la cola de repaso, y también los
    // que se dejaron en blanco —`correcta` ya es `false` en ese caso—, porque no
    // responder tampoco es saberlo. Los acertados NO entran: la cola es lo que
    // fallaste, no lo que ya dominas (brief §6.1).
    //
    // Aquí sí es `encolar` y no `registrarRevision`: §7.2 lo dice expresamente
    // para los ítems fallados, y su efecto es el correcto — el elemento nace con
    // `proximaRevision = hoy`, así que fallar en la práctica pone el ítem en la
    // cola de HOY mismo. Y si ya estaba en la cola no se toca: fallarlo otra vez
    // no reinicia el progreso que llevaba.
    //
    // El encolado no depende de `registro.clase`, así que el diagnóstico y los
    // simulacros del Paso 11 —que entran como `'suelta'`— lo heredan sin tocar
    // nada, que es lo que §7.2 pide.
    const fallados = resumen.detalle.filter((d) => !d.correcta).map((d) => d.item.id);
    if (fallados.length > 0) {
      // `leerEstado` y no un snapshot de render: las dos escrituras de arriba ya
      // movieron el estado y la cola tiene que salir del valor fresco.
      const cola = leerEstado(ahora).colaRepaso;
      guardarColaRepaso(encolar(cola, fallados, fechaLocalDe(momento)), ahora);
    }
  }, [sesion, registro]);

  // El foco salta al titular del resumen: el botón que se pulsó desaparece del
  // DOM y sin esto el foco caería al <body>.
  useEffect(() => {
    if (sesion.terminada) refResumen.current?.focus();
  }, [sesion.terminada]);

  const { item, indice, total, valor, esUltimo, comprobado, respondido } = sesion;

  // La acción primaria del teclado. `Enter` NO cierra la tanda: terminar es
  // irreversible dentro del intento y merece un clic deliberado sobre su botón.
  //
  // Asimetría deliberada con el botón «Comprobar», que sí funciona sin
  // respuesta: `Enter` es una tecla de flujo rápido y se pulsa por inercia. Que
  // exija haber respondido evita quemar un ítem por apoyarse en el teclado; el
  // que de verdad quiere rendirse tiene el botón a un toque.
  const accionPrimaria = useCallback(() => {
    if (inmediato && !comprobado) {
      if (respondido) sesion.comprobar();
      return;
    }
    if (!esUltimo) sesion.avanzar();
  }, [inmediato, comprobado, respondido, esUltimo, sesion]);

  useEffect(() => {
    if (sesion.terminada) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key !== 'Enter') return;
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;

      const foco = document.activeElement;
      if (foco instanceof HTMLElement) {
        // Sobre un botón o un enlace, `Enter` ya activa lo que está enfocado:
        // interceptarlo dispararía dos cosas a la vez. Sobre el campo del ítem
        // de cálculo sí se intercepta, porque ahí `Enter` no escribe nada y lo
        // que el usuario espera es «confirmar y seguir».
        if (/^(BUTTON|A|TEXTAREA|SELECT)$/.test(foco.tagName) || foco.isContentEditable) return;
      }

      evento.preventDefault();
      accionPrimaria();
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [accionPrimaria, sesion.terminada]);

  if (sesion.terminada && sesion.resumen !== null) {
    return (
      <ResumenSesion
        ref={refResumen}
        resumen={sesion.resumen}
        clase={registro.clase === 'quiz' ? 'quiz' : registro.clase === 'practica' ? 'practica' : 'suelta'}
        volver={volver}
        siguiente={siguiente}
        onRepetir={onRepetir}
      />
    );
  }

  if (item === undefined) return null;

  const veredicto = comprobado ? calificar(item, valor) : false;
  const avance = ((indice + 1) / total) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p role="status" className="text-[0.8125rem] text-muted-foreground">
          Ítem {indice + 1} de {total}
        </p>
        {/* Banda del instrumento (DISENO.md §4.2): relleno puro, esquinas
            rectas, sin tipografía encima y sin transición — `width` es
            propiedad de layout y §3 no la admite. */}
        <div className="h-1 w-full bg-secondary" aria-hidden="true">
          <div className={cn('h-full', CLASES_BLOQUE[bloque].fondo)} style={{ width: `${avance}%` }} />
        </div>
      </div>

      <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        <EnvoltorioItem
          item={item}
          valor={valor}
          modo={
            comprobado ? (veredicto ? 'revision-correcta' : 'revision-incorrecta') : 'respondiendo'
          }
          onCambio={sesion.responder}
          numero={indice + 1}
          total={total}
        />
      </article>

      {/* La región viva está SIEMPRE montada, aunque esté vacía: un contenedor
          `aria-live` que aparece junto con su contenido no se anuncia de forma
          fiable, porque el lector necesita haber visto la región antes para
          detectar el cambio. */}
      <div aria-live="polite">
        {comprobado ? (
          <Retroalimentacion item={item} correcta={veredicto} respondida={respondido} />
        ) : null}
      </div>

      <nav aria-label="Avanzar por la tanda" className="flex flex-wrap items-center gap-2">
        <Boton
          onClick={sesion.retroceder}
          variante="contorno"
          inactivo={indice === 0}
          className="min-h-11"
          aria-label="Ítem anterior"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Anterior
        </Boton>

        {!inmediato ? (
          <Boton
            onClick={sesion.alternarMarca}
            variante={sesion.marcada ? 'contorno' : 'silencioso'}
            className="min-h-11"
            aria-pressed={sesion.marcada}
          >
            <Flag className={cn('size-4', sesion.marcada && 'text-aviso')} aria-hidden="true" />
            {sesion.marcada ? 'Marcada' : 'Marcar'}
          </Boton>
        ) : null}

        <span className="flex-1" />

        {inmediato && !comprobado ? (
          // Sin `inactivo`, y es deliberado: comprobar sin haber respondido es
          // «no sé esta, muéstrame la respuesta», que en la etapa donde se
          // aprende es una acción legítima. Bloquearlo dejaba al usuario
          // atrapado en un ítem que no sabe, obligándolo a adivinar para poder
          // pasar. La retroalimentación distingue el caso y lo dice: «La
          // dejaste sin responder».
          <Boton onClick={sesion.comprobar} className="min-h-11 min-w-[8rem]">
            Comprobar
          </Boton>
        ) : esUltimo ? (
          <Boton onClick={cerrar} className="min-h-11 min-w-[8rem]">
            {registro.clase === 'quiz' ? 'Terminar el quiz' : 'Terminar la práctica'}
          </Boton>
        ) : (
          <Boton onClick={sesion.avanzar} className="min-h-11 min-w-[8rem]">
            Siguiente
            <ArrowRight className="size-4" aria-hidden="true" />
          </Boton>
        )}
      </nav>

      {/* Ayuda secundaria, no la instrucción de uso: la vía primaria son los
          botones de 52 px. Se muestra por MODALIDAD (`any-pointer: fine`), no
          por ancho de pantalla. */}
      <p className="hidden text-[0.8125rem] leading-[1.45] text-muted-foreground [@media(any-pointer:fine)]:block">
        {atajosDe(item)} <Tecla>Enter</Tecla> {inmediato ? 'comprueba y avanza' : 'avanza'}.
      </p>

      {/* `inline-flex`: el enlace es el único contenido de su párrafo, así que
          NO le vale la excepción de 2.5.8 para enlaces dentro de una frase. En
          `display: inline` el `min-height: 44px` de @layer base es inerte y el
          objetivo se quedaba en 16 px de alto (A-24). Es el mismo remedio que ya
          usan los enlaces de los estados vacíos de las páginas de etapa. */}
      <p className="text-[0.8125rem]">
        <Link
          href={volver.href}
          className="inline-flex items-center text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Salir sin terminar
        </Link>
      </p>
    </div>
  );
}

function atajosDe(item: Item): React.ReactNode {
  switch (item.tipo) {
    case 'unica':
    case 'caso':
      return <>Atajos: <Tecla>1</Tecla>–<Tecla>4</Tecla> eligen opción.</>;
    case 'multiple':
      return <>Atajos: <Tecla>1</Tecla>–<Tecla>5</Tecla> marcan y desmarcan.</>;
    case 'vf':
      return <>Atajos: <Tecla>1</Tecla> verdadero, <Tecla>2</Tecla> falso.</>;
    default:
      return <>Atajos:</>;
  }
}

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-input bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  );
}
