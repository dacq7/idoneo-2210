'use client';

// src/components/modulo/mazo-tarjetas.tsx — Client Component.
//
// Etapa 2 de un módulo. Una tarjeta a la vez: frente → «Ver la respuesta» →
// reverso → «La sabía» / «No la sabía».
//
// Jerarquía: la acción primaria son los BOTONES, a 52px. Este mazo se estudia
// desde el celular y el teclado es ayuda secundaria, no la vía de uso. El atajo
// existe y funciona igual de bien, pero se anuncia en una línea discreta y solo
// donde hay teclado (`any-pointer: fine`), no como la instrucción de la
// pantalla.
//
// Frontera (ADR-010): NO importa `content/tarjetas/indice`. Las tarjetas las
// carga la PÁGINA en el servidor con `cargarTarjetas(slug)` y las pasa ya
// proyectadas a `TarjetaEnMazo` (sin el campo `modulo`, que el mazo no usa).
//
// Reloj (§22 regla 6 y §10.4): `new Date().toISOString()` solo dentro del
// handler de respuesta. En el cuerpo del render no se lee el reloj.
//
// Aleatoriedad: NINGUNA (§22 regla 5). El mazo va en el orden en que el autor
// escribió las tarjetas, que es un orden pedagógico. Barajar exigiría
// `crearRng(semilla)` y una semilla que aquí no significa nada.
//
// SRS (Paso 10): además de `tarjetasVistas`, cada tarjeta respondida entra a la
// cola de repaso espaciado. Se usa `registrarRevision` y no `encolar`, y la
// diferencia importa: `encolar` crea el elemento con `proximaRevision = hoy`, de
// modo que las 15 tarjetas que el usuario acaba de ver le volverían a aparecer
// en `/repaso` un minuto después — que es justo lo contrario del espaciado.
// `registrarRevision` crea el elemento SI NO EXISTE y además lo programa: sabida
// o no, la primera revisión cae a un día, y a partir de ahí el intervalo y la
// facilidad divergen según se acierte o se falle. Es la misma función del motor,
// llamada en el punto donde el usuario de verdad emitió un juicio.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, RotateCcw, X } from 'lucide-react';
import { guardarColaRepaso, leerEstado, registrarTarjetasVistas } from '@/lib/almacenamiento';
import { registrarRevision } from '@/lib/srs';
import { fechaLocalDe } from '@/lib/fechas';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId, Tarjeta } from '@/lib/tipos';

/** Lo que el mazo necesita de una `Tarjeta`. Todo serializable. */
export interface TarjetaEnMazo {
  id: string;
  frente: string;
  reverso: string;
  tipo: Tarjeta['tipo'];
}

const NOMBRE_TIPO: Record<Tarjeta['tipo'], string> = {
  definicion: 'Definición',
  dato: 'Dato',
  clasificacion: 'Clasificación',
  formula: 'Fórmula',
};

type ObjetivoFoco = 'revelar' | 'reverso' | 'resumen' | null;

interface Props {
  slug: string;
  bloque: BloqueId;
  /** Siempre con al menos una tarjeta: el estado vacío lo resuelve la página. */
  tarjetas: readonly TarjetaEnMazo[];
}

export function MazoTarjetas({ slug, bloque, tarjetas }: Props) {
  /** El mazo de la pasada actual. Puede ser el completo o solo las falladas. */
  const [mazo, setMazo] = useState<readonly TarjetaEnMazo[]>(tarjetas);
  const [esRepaso, setEsRepaso] = useState(false);
  const [indice, setIndice] = useState(0);
  const [revelada, setRevelada] = useState(false);
  const [falladas, setFalladas] = useState<readonly TarjetaEnMazo[]>([]);
  const [acertadas, setAcertadas] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const refRevelar = useRef<HTMLButtonElement>(null);
  const refReverso = useRef<HTMLDivElement>(null);
  const refResumen = useRef<HTMLParagraphElement>(null);
  const objetivoFoco = useRef<ObjetivoFoco>(null);

  // Foco explícito: al revelar y al avanzar, el botón que tenía el foco
  // desaparece del DOM. Sin esto el foco cae al <body> y quien navega con
  // teclado o lector de pantalla pierde el hilo a mitad del mazo.
  useEffect(() => {
    const objetivo = objetivoFoco.current;
    if (objetivo === null) return;
    objetivoFoco.current = null;

    if (objetivo === 'revelar') refRevelar.current?.focus();
    else if (objetivo === 'reverso') refReverso.current?.focus();
    else refResumen.current?.focus();
  });

  const tarjeta = mazo[indice];
  const total = mazo.length;

  function revelar() {
    objetivoFoco.current = 'reverso';
    setRevelada(true);
  }

  function responder(sabia: boolean) {
    if (!revelada || tarjeta === undefined) return;

    if (sabia) setAcertadas((n) => n + 1);
    else setFalladas((lista) => [...lista, tarjeta]);

    // Solo la pasada completa cuenta como «tarjetas vistas» del módulo. En una
    // pasada de repaso el mazo es un subconjunto y el número sería menor;
    // `registrarTarjetasVistas` aplica Math.max, así que no bajaría el valor
    // guardado, pero la escritura no aportaría nada.
    //
    // La cola de repaso se escribe con el mismo criterio, y por una razón más
    // fuerte: registrar dos revisiones del mismo elemento con un minuto de
    // diferencia infla `repeticiones` y alarga el intervalo sin que haya habido
    // espaciado real. La pasada de falladas es un repaso inmediato, no una
    // revisión del día siguiente.
    if (!esRepaso) {
      // Handler: aquí sí se puede leer el reloj (§10.4).
      const ahora = new Date();
      const ahoraISO = ahora.toISOString();
      registrarTarjetasVistas(slug, indice + 1, ahoraISO);
      // `leerEstado` y no un snapshot de render: la cola es acumulativa y esta
      // escritura ocurre una vez por tarjeta.
      const cola = leerEstado(ahoraISO).colaRepaso;
      const hoy = fechaLocalDe(ahora);
      // Solo se programa lo que de verdad TOCA hoy: una tarjeta ya programada
      // para el futuro no se re-registra. Sin esta guarda, estudiar el mazo a
      // las 8 y repetirlo a las 9 cuenta dos revisiones sin espaciado real
      // (`repeticiones` 1→2, intervalo 1→3 días) y el SM-2 empieza a mentir
      // sobre lo que el usuario recuerda. `esRepaso` cubría la pasada de
      // falladas DENTRO de la sesión; esto cubre la segunda visita a la ruta.
      const yaProgramada = cola[tarjeta.id];
      if (yaProgramada === undefined || yaProgramada.proximaRevision <= hoy) {
        guardarColaRepaso(registrarRevision(cola, tarjeta.id, sabia, hoy), ahoraISO);
      }
    }

    if (indice + 1 >= total) {
      objetivoFoco.current = 'resumen';
      setTerminado(true);
      return;
    }

    objetivoFoco.current = 'revelar';
    setRevelada(false);
    setIndice((i) => i + 1);
  }

  function empezar(nuevoMazo: readonly TarjetaEnMazo[], repaso: boolean) {
    objetivoFoco.current = 'revelar';
    setMazo(nuevoMazo);
    setEsRepaso(repaso);
    setIndice(0);
    setRevelada(false);
    setFalladas([]);
    setAcertadas(0);
    setTerminado(false);
  }

  // Los atajos escuchan en `window`, no en un contenedor. Antes vivían en un
  // `<div onKeyDown>` SIN `tabIndex`: un div no enfocable no recibe teclado, así
  // que las teclas solo funcionaban mientras el foco siguiera dentro por
  // casualidad —y bastaba pulsar una zona neutra, que manda el foco al <body>,
  // para que el mazo dejara de responder. Es el patrón de §13 del blueprint
  // (`opcion-unica.tsx`) y aquí resuelve además que el atajo funcione desde el
  // primer momento, sin haber tenido que hacer clic en nada.
  //
  // El teclado es AYUDA, no la vía: los botones son la acción primaria y
  // funcionan solos. Por eso el efecto no toca `Enter` — la activación del botón
  // enfocado ya es nativa, y duplicarla aquí dispararía dos veces.
  useEffect(() => {
    if (terminado || !revelada) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      // Defensivo: hoy el mazo no tiene campos de texto, pero un atajo global
      // que se coma el «1» de un input sería un bug muy caro de encontrar.
      const foco = document.activeElement;
      if (foco instanceof HTMLElement && (foco.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(foco.tagName))) {
        return;
      }
      if (evento.key !== '1' && evento.key !== '2') return;
      evento.preventDefault();
      responder(evento.key === '1');
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  });

  if (terminado) {
    return (
      <Resumen
        ref={refResumen}
        slug={slug}
        total={total}
        acertadas={acertadas}
        falladas={falladas}
        esRepaso={esRepaso}
        onRepasarFalladas={() => empezar(falladas, true)}
        onEmpezarDeNuevo={() => empezar(tarjetas, false)}
      />
    );
  }

  if (tarjeta === undefined) return null;

  const avance = ((indice + 1) / total) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {/* El contador es el portador accesible del avance; la banda solo lo
            refuerza. role="status" lo anuncia al pasar de tarjeta sin robar el
            foco, que en ese momento va al botón «Ver la respuesta». */}
        <p role="status" className="text-[0.8125rem] text-muted-foreground">
          Tarjeta {indice + 1} de {total}
          {esRepaso ? ' · repaso de las que no sabías' : null}
        </p>

        {/* Banda del instrumento (DISENO.md §4): relleno puro, rounded-none,
            sin tipografía encima y sin barra redondeada de progreso. */}
        <div className="h-1 w-full bg-secondary" aria-hidden="true">
          <div
            // Sin transición: `width` es una propiedad de layout y DISENO.md §3
            // restringe las transiciones a color, fondo, borde, opacidad y
            // transform. §4.2 regla 6 remata: movimiento, uno o ninguno.
            className={cn('h-full', CLASES_BLOQUE[bloque].fondo)}
            style={{ width: `${avance}%` }}
          />
        </div>
      </div>

      <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          {NOMBRE_TIPO[tarjeta.tipo]}
        </p>

        <p className="mt-2 text-[1.0625rem] font-medium leading-[1.45]">{tarjeta.frente}</p>

        {revelada ? (
          <div
            ref={refReverso}
            // tabIndex -1 para poder darle el foco al revelar: así el lector de
            // pantalla lee la respuesta y los dos botones quedan justo después
            // en el orden de tabulación.
            tabIndex={-1}
            className="mt-4 border-t border-border pt-4"
          >
            <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
              Respuesta
            </p>
            <p className="mt-1.5 leading-[1.5]">{tarjeta.reverso}</p>
          </div>
        ) : null}
      </article>

      {/* Acción primaria. Este mazo se estudia en el celular —restricción dura
          del brief—, así que lo que manda es el objetivo táctil: 52px, la
          medida que §3 de DISENO.md reserva para las opciones de ítem, porque
          esto es exactamente eso, la respuesta a la tarjeta. */}
      {revelada ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Boton
            onClick={() => responder(true)}
            variante="contorno"
            className="min-h-[52px] flex-1 text-[0.9375rem]"
          >
            <Check className="size-4" aria-hidden="true" />
            La sabía
          </Boton>
          <Boton
            onClick={() => responder(false)}
            variante="contorno"
            className="min-h-[52px] flex-1 text-[0.9375rem]"
          >
            <X className="size-4" aria-hidden="true" />
            No la sabía
          </Boton>
        </div>
      ) : (
        <Boton
          ref={refRevelar}
          onClick={revelar}
          variante="principal"
          className="min-h-[52px] w-full text-[0.9375rem]"
        >
          Ver la respuesta
        </Boton>
      )}

      {/* Ayuda secundaria, no la instrucción de uso. Se muestra por MODALIDAD y
          no por ancho: `any-pointer: fine` es la señal de que hay ratón o
          teclado detrás. `sm:` era un proxy de ancho para una pregunta de
          entrada, y se equivocaba en los dos sentidos — la escondía en un
          teléfono con teclado y la mostraba en una tableta táctil de 700px. */}
      <p className="hidden text-[0.8125rem] leading-[1.45] text-muted-foreground [@media(any-pointer:fine)]:block">
        Atajos: <Tecla>1</Tecla> si la sabías, <Tecla>2</Tecla> si no.
      </p>
    </div>
  );
}

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-input bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  );
}

function Resumen({
  ref,
  slug,
  total,
  acertadas,
  falladas,
  esRepaso,
  onRepasarFalladas,
  onEmpezarDeNuevo,
}: {
  ref: React.Ref<HTMLParagraphElement>;
  slug: string;
  total: number;
  acertadas: number;
  falladas: readonly TarjetaEnMazo[];
  esRepaso: boolean;
  onRepasarFalladas: () => void;
  onEmpezarDeNuevo: () => void;
}) {
  const fallos = falladas.length;

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* tabIndex -1: recibe el foco al terminar el mazo, para que el cambio de
          pantalla se anuncie y no haya que buscar dónde quedó el hilo. */}
      <p ref={ref} tabIndex={-1} className="font-titulo text-[1.375rem] font-semibold leading-[1.15]">
        {esRepaso ? 'Terminaste el repaso' : 'Terminaste el mazo'}
      </p>

      <p>
        Viste {total === 1 ? 'una tarjeta' : `las ${total} tarjetas`}. Dijiste que sabías{' '}
        <strong className="font-semibold">{acertadas}</strong> y que no sabías{' '}
        <strong className="font-semibold">{fallos}</strong>.
      </p>

      {/* Retroalimentación honesta (§22 regla 10): ni felicitación vacía cuando
          sale todo bien, ni consuelo cuando sale mal. */}
      <p className="text-muted-foreground">
        {fallos === 0
          ? 'No te confíes con esto: reconocer una respuesta al verla es mucho más fácil que producirla en el examen. La prueba de verdad es el quiz del módulo.'
          : fallos >= total / 2
            ? 'Es normal en la primera pasada y no dice nada malo de ti: estas tarjetas son datos exactos y los datos exactos se aprenden repitiéndolos, no entendiéndolos una vez.'
            : 'Esas son las que rinden ahora. Repasar el mazo entero otra vez es gastar tiempo en lo que ya sabías.'}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        {fallos > 0 ? (
          <Boton onClick={onRepasarFalladas} variante="principal" className="flex-1">
            <RotateCcw className="size-4" aria-hidden="true" />
            Repasar {fallos === 1 ? 'la que no sabía' : `las ${fallos} que no sabía`}
          </Boton>
        ) : null}
        <Boton onClick={onEmpezarDeNuevo} variante="contorno" className="flex-1">
          Empezar el mazo de nuevo
        </Boton>
      </div>

      <p>
        <Link
          href={`/modulos/${slug}`}
          className="font-medium text-primary underline underline-offset-2"
        >
          Volver al módulo
        </Link>
      </p>
    </div>
  );
}

/**
 * Botón con marcado propio, no el `Button` de shadcn.
 *
 * `src/components/ui/button.tsx` hace `import { Slot } from "radix-ui"` —el
 * paquete paraguas— y eso mete el barrel entero (77.5 kB gz, ADR-011) en el
 * bundle de la ruta. Es exactamente la decisión que ya tomó el Paso 6 con la
 * insignia «En preparación», y esta es una ruta de estudio: se usa a diario y
 * desde el celular. Las clases son las de `buttonVariants`, menos el
 * `transition-all` que DISENO.md §5.2 prohíbe.
 */
function Boton({
  ref,
  variante,
  className,
  children,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  variante: 'principal' | 'contorno';
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium',
        'transition-colors duration-150 ease-out',
        variante === 'principal'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
