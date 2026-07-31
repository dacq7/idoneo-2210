'use client';

// src/components/sesion/controlador-simulacro.tsx — Client Component (§10.3).
//
// Orquesta un simulacro cronometrado: viabilidad → carga del banco →
// reanudación → tanda → cierre.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ ES UN CONTROLADOR APARTE Y NO `ControladorSesion` AMPLIADO
// ══════════════════════════════════════════════════════════════════════════
//
// §10.1 asigna un solo `ControladorSesion` a las cinco sesiones del producto, y
// aquí se abre en dos. Dos razones medidas, no de gusto (ADR-020):
//
//  · **El controlador de práctica y quiz ya tiene 391 líneas.** Añadirle
//    cronómetro, persistencia por respuesta, reanudación, panel de navegación,
//    auto-envío y carga diferida lo llevaría muy por encima de las 300 que fija
//    la regla de código 1.
//  · **Las responsabilidades divergen de verdad.** Práctica y quiz reciben su
//    banco por prop desde el servidor y no persisten nada hasta el final; el
//    simulacro carga el banco bajo interacción y escribe tras cada respuesta.
//    No es el mismo componente con un `if`.
//
// **Lo que sí se comparte es lo que importa**: `useSesion` (la máquina de
// estado), `EnvoltorioItem`, `Boton` y `ResumenSesion`. No hay una segunda
// implementación de la tanda.
//
// ══════════════════════════════════════════════════════════════════════════
// FRONTERA (ADR-010): EL BANCO ENTRA CON `import()`, NO POR PROP
// ══════════════════════════════════════════════════════════════════════════
//
// `/practica` y `/quiz` reciben su banco por prop porque conocen su slug y son
// 28 ítems. Aquí no vale: el simulacro final necesita **los 29 módulos**, y
// mandarlos por prop metería ~750 ítems en la carga útil RSC de una ruta que el
// usuario abre para *decidir* si hacerlo. Ya se midió el aviso: `/practica`
// pesa 17.1 kB gz de HTML con un solo módulo.
//
// La salida es la que §2.2 prescribe y ADR-010 declara permitida
// explícitamente: **`import()` dinámico bajo interacción del usuario**. El
// bundle inicial de la ruta no lleva ni un ítem; el banco se descarga al pulsar
// «Empezar». Es el mismo patrón que `/repaso` estrenó en el Paso 10.
//
// Lo que sigue entrando por prop es el **censo** —slug, bloque y un conteo por
// módulo— porque la portada necesita saber si el banco alcanza ANTES de
// descargar nada. Son ~90 valores.

import { useCallback, useEffect, useRef, useState } from 'react';
import { encolar } from '@/lib/srs';
import { fechaLocalDe } from '@/lib/fechas';
import {
  borrarSesion,
  guardarColaRepaso,
  guardarIntento,
  guardarSesion,
  leerEstado,
  leerSesion,
} from '@/lib/almacenamiento';
import { construirIntento } from '@/lib/informe';
import { inicioCoherente, restantes } from '@/lib/cronometro';
import {
  armarSimulacro,
  diagnosticarViabilidad,
  itemsDeIntentosRecientes,
  presentarTanda,
  type CensoModulo,
} from '@/lib/simulacro';
import type { ResumenSesion as DatosResumen } from '@/hooks/usar-sesion';
import type {
  BlueprintExamen,
  BloqueId,
  Item,
  SesionCronometro,
  TipoIntento,
} from '@/lib/tipos';
import { DialogoReanudar } from './dialogo-reanudar';
import { PortadaSimulacro } from './portada-simulacro';
import { ResumenSesion } from './resumen-sesion';
import { SimulacroEnCurso } from './simulacro-en-curso';
import { SimulacroSinRed } from './simulacro-sin-red';

interface Props {
  blueprint: BlueprintExamen;
  /** Conteos por módulo. NO el banco: ver la cabecera. */
  censo: readonly CensoModulo[];
  /** Módulos cuyo banco hay que cargar para este ámbito. */
  slugs: readonly string[];
  tipo: TipoIntento;
  /** Slug de módulo, id de bloque o 'global'. Identifica el intento. */
  ambito: string;
  /** `null` en el simulacro final. */
  bloque: BloqueId | null;
  alternativa: { slug: string; titulo: string } | null;
  volver: { href: string; texto: string };
  /**
   * A dónde lleva la acción principal del cierre. Por defecto, al informe del
   * intento. El **diagnóstico** lo cambia por `/plan`: ahí el informe existe y
   * es accesible, pero lo que el usuario acaba de ganar es un plan de estudio,
   * y mandarlo primero a los porcentajes sería enterrar el resultado útil bajo
   * el diagnóstico.
   *
   * Es un OBJETO y no una función a propósito: lo pasa una página, que es
   * Server Component, y **las funciones no cruzan la frontera** — Next lo
   * rechaza al prerenderizar («Functions cannot be passed directly to Client
   * Components»). El destino por defecto necesita el `intentoId`, que solo se
   * conoce en cliente, así que ese caso se resuelve aquí dentro en vez de
   * pedirle al servidor una función que lo construya.
   */
  destinoCierre?: { href: string; texto: string };
}

type Vista =
  | { fase: 'comprobando' }
  | { fase: 'portada' }
  | { fase: 'reanudar'; sesion: SesionCronometro }
  | { fase: 'cargando' }
  | { fase: 'error'; intento: number }
  | { fase: 'sesion'; sesion: SesionCronometro; items: Item[] }
  | { fase: 'cerrada'; resumen: DatosResumen; intentoId: string };

/** Carga el banco de los módulos del ámbito. `import()` bajo interacción. */
async function cargarBanco(slugs: readonly string[]): Promise<Item[]> {
  const indice = await import('@/content/banco/indice');
  const tandas = await Promise.all(slugs.map((slug) => indice.cargarBancoModulo(slug)));
  return tandas.flat();
}

export function ControladorSimulacro({
  blueprint,
  censo,
  slugs,
  tipo,
  ambito,
  bloque,
  alternativa,
  volver,
  destinoCierre,
}: Props) {
  const [vista, setVista] = useState<Vista>({ fase: 'comprobando' });
  const viabilidad = diagnosticarViabilidad(blueprint, censo);

  // ── ¿Hay un simulacro a medias de ESTE ámbito? ──
  //
  // `leerSesion()` NO es libre de efectos —se autolimpia si el payload es
  // ilegible— así que se llama desde un efecto, nunca en render.
  useEffect(() => {
    if (vista.fase !== 'comprobando') return;
    const guardada = leerSesion();
    // Una sesión de otro ámbito no se toca ni se borra: el usuario puede tener
    // el simulacro del bloque C a medias y estar mirando la portada del final.
    if (guardada !== null && guardada.tipo === tipo && guardada.ambito === ambito) {
      setVista({ fase: 'reanudar', sesion: guardada });
      return;
    }
    setVista({ fase: 'portada' });
  }, [vista.fase, tipo, ambito]);

  const empezar = useCallback(() => {
    // [M2 y R2 del `code-reviewer`] La guarda vive también AQUÍ y no solo en el
    // render de la portada: `descartarYEmpezar` llama a esta función directo
    // desde el diálogo de reanudar, que es alcanzable con una sesión vieja de
    // un blueprint que entretanto dejó de ser viable.
    //
    // `exacto === false` también bloquea, y esa parte no es defensiva sino
    // preventiva: cuando un blueprint filtra por tipo o dificultad, el censo
    // cuenta ítems publicados y no ELEGIBLES, así que `viable` es una cota
    // superior — puede decir que sí y no serlo. Hoy no lo activa nadie; el
    // primero será el diagnóstico del Paso 13, y más vale que se encuentre una
    // puerta cerrada que un examen corto presentado como completo.
    if (!viabilidad.viable || !viabilidad.exacto) return;
    setVista({ fase: 'cargando' });
    void cargarBanco(slugs)
      .then((banco) => {
        // Handler de interacción: aquí SÍ se lee el reloj (§10.4). La semilla es
        // el instante de arranque, y de ella salen las dos cosas aleatorias del
        // intento: qué ítems entran y en qué orden se presentan sus opciones.
        const semilla = Date.now();
        // Los ítems de los dos últimos intentos se penalizan —no se prohíben—
        // para que un segundo simulacro no sea el mismo examen. Se cableó en el
        // Paso 11 apuntando a una lista vacía, y desde el Paso 12 hay intentos
        // persistidos que lo alimentan: medido, dos simulacros seguidos de 10
        // ítems sobre C5 pasaron de repetir 5 a repetir 0.
        const recientes = itemsDeIntentosRecientes(leerEstado(new Date().toISOString()).intentos);
        const elegidos = armarSimulacro(blueprint, banco, semilla, recientes);
        const items = presentarTanda(elegidos, semilla);
        const nueva: SesionCronometro = {
          intentoId: String(semilla),
          tipo,
          ambito,
          semilla,
          iniciadoEnMs: semilla,
          duracionSegundos: blueprint.minutos === null ? null : blueprint.minutos * 60,
          itemIds: items.map((it) => it.id),
          respuestas: {},
          avisosVistos: [],
        };
        // Se persiste ANTES de pintar la tanda: si el navegador se cierra entre
        // el arranque y la primera respuesta, el intento existe y su cronómetro
        // ya corre. Escribir después dejaría una ventana en la que el usuario
        // cree haber empezado y la app no.
        guardarSesion(nueva);
        setVista({ fase: 'sesion', sesion: nueva, items });
      })
      .catch(() => {
        setVista((previa) => ({
          fase: 'error',
          intento: previa.fase === 'error' ? previa.intento + 1 : 1,
        }));
      });
  }, [slugs, blueprint, tipo, ambito, viabilidad]);

  const continuar = useCallback((sesion: SesionCronometro) => {
    setVista({ fase: 'cargando' });
    void cargarBanco(slugs)
      .then((banco) => {
        // Reconstrucción fiel, no re-muestreo: `itemIds` guarda el orden exacto
        // y `semilla` reproduce el barajado de opciones. Re-muestrear daría la
        // misma tanda solo si el banco no cambió, y el banco cambia entre los
        // pasos 15 y 17.
        const porId = new Map(banco.map((it) => [it.id, it]));
        const originales = sesion.itemIds.map((id) => porId.get(id));
        if (originales.some((it) => it === undefined)) {
          // No debería llegar aquí: la fase 'reanudar' ya lo comprueba y no
          // ofrece continuar. Guarda de todos modos — antes que calificar una
          // tanda distinta de la que el usuario respondió, se descarta.
          borrarSesion();
          setVista({ fase: 'portada' });
          return;
        }
        const items = presentarTanda(originales as Item[], sesion.semilla);
        setVista({ fase: 'sesion', sesion, items });
      })
      .catch(() => {
        setVista((previa) => ({
          fase: 'error',
          intento: previa.fase === 'error' ? previa.intento + 1 : 1,
        }));
      });
  }, [slugs]);

  const cerrar = useCallback(
    (resumen: DatosResumen, sesion: SesionCronometro) => {
      // La sesión persistida deja de existir en cuanto el intento se cierra: si
      // se quedara, la próxima visita ofrecería reanudar un simulacro terminado.
      borrarSesion();

      // Handler: el reloj se lee aquí (§10.4).
      const momento = new Date();
      const ahora = momento.toISOString();

      // ── El intento se PERSISTE (Paso 12) ──
      //
      // El Paso 11 lo dejó declarado como aplazamiento: `desglose` exige
      // `calcularDesglose`, que nace en `informe.ts` y no existía. Ahora sí.
      //
      // Lo arma `construirIntento`, que es función pura de `informe.ts` y tiene
      // test propio: si lo que produce dejara de satisfacer `esqIntento`, el
      // estado ENTERO iría a cuarentena (ADR-008, ADR-023) y el usuario
      // perdería de vista su historial, no un intento.
      const intento = construirIntento(
        sesion,
        resumen.detalle,
        resumen.total,
        momento.getTime(),
      );
      guardarIntento(intento, ahora);

      // SRS: todo ítem fallado entra en la cola, y también los que quedaron en
      // blanco —`correcta` ya es `false`—, porque no responder tampoco es saberlo.
      // Es el mismo enganche que práctica y quiz, con `encolar` y no
      // `registrarRevision`: fallar un ítem no es una revisión, es el motivo por
      // el que el elemento entra en la cola (ADR-018).
      //
      // Va DESPUÉS de `guardarIntento` a propósito: las dos escrituras pasan
      // por `actualizarEstado`, y la cola tiene que salir del estado que ya
      // incluye el intento recién guardado.
      const fallados = resumen.detalle.filter((d) => !d.correcta).map((d) => d.item.id);
      if (fallados.length > 0) {
        const cola = leerEstado(ahora).colaRepaso;
        guardarColaRepaso(encolar(cola, fallados, fechaLocalDe(momento)), ahora);
      }

      setVista({ fase: 'cerrada', resumen, intentoId: intento.id });
    },
    [],
  );

  const descartarYEmpezar = useCallback(() => {
    borrarSesion();
    empezar();
  }, [empezar]);

  // ── Render por fase ──

  if (vista.fase === 'comprobando') return <Esqueleto />;

  if (vista.fase === 'error') {
    return <SimulacroSinRed intento={vista.intento} onReintentar={() => setVista({ fase: 'portada' })} />;
  }

  if (vista.fase === 'reanudar') {
    return (
      <ReanudarConBanco
        sesion={vista.sesion}
        slugs={slugs}
        onContinuar={() => continuar(vista.sesion)}
        onEmpezarDeNuevo={descartarYEmpezar}
      />
    );
  }

  if (vista.fase === 'sesion') {
    return (
      <SimulacroEnCurso
        // `key` con el intento: empezar otro remonta la tanda entera y no deja
        // ni una respuesta ni un cronómetro del anterior.
        key={vista.sesion.intentoId}
        items={vista.items}
        sesion={vista.sesion}
        bloque={bloque}
        volver={volver}
        onCerrar={(resumen) => cerrar(resumen, vista.sesion)}
      />
    );
  }

  if (vista.fase === 'cerrada') {
    return (
      <CierreSimulacro
        resumen={vista.resumen}
        siguiente={
          destinoCierre ?? {
            href: `/resultados/${vista.intentoId}`,
            texto: 'Ver el informe completo',
          }
        }
        volver={volver}
        onRepetir={() => setVista({ fase: 'portada' })}
      />
    );
  }

  return (
    <PortadaSimulacro
      blueprint={blueprint}
      viabilidad={viabilidad}
      alternativa={alternativa}
      cargando={vista.fase === 'cargando'}
      onEmpezar={empezar}
    />
  );
}

/**
 * Comprueba si la tanda guardada se puede reconstruir con el banco publicado
 * antes de ofrecer «Continuar». Necesita el banco, así que carga el índice; el
 * usuario ya expresó interés al abrir la ruta con un intento a medias.
 */
function ReanudarConBanco({
  sesion,
  slugs,
  onContinuar,
  onEmpezarDeNuevo,
}: {
  sesion: SesionCronometro;
  slugs: readonly string[];
  onContinuar: () => void;
  onEmpezarDeNuevo: () => void;
}) {
  const [reconstruible, setReconstruible] = useState<boolean | null>(null);
  const [restantesSeg, setRestantesSeg] = useState<number | null>(null);

  useEffect(() => {
    let vivo = true;
    // Efecto: el reloj se lee aquí (§10.4). Es el tiempo REAL, no el que
    // quedaba al cerrar la pestaña.
    const ahora = Date.now();
    setRestantesSeg(restantes(sesion, ahora));

    // [R1 del `code-reviewer`] Una sesión que dice haber empezado en el FUTURO
    // no se ofrece para continuar: su cronómetro no llegaría nunca a cero y el
    // intento no se auto-enviaría jamás. Pasa de verdad cuando un dispositivo
    // arranca con el reloj desincronizado y NTP lo corrige después. Se trata
    // como no reconstruible, igual que si le faltaran ítems: antes que un
    // examen que no termina, se empieza uno nuevo.
    if (!inicioCoherente(sesion, ahora)) {
      setReconstruible(false);
      return;
    }

    void cargarBanco(slugs)
      .then((banco) => {
        if (!vivo) return;
        const ids = new Set(banco.map((it) => it.id));
        setReconstruible(sesion.itemIds.every((id) => ids.has(id)));
      })
      .catch(() => {
        // Sin banco no se puede prometer reconstrucción: se ofrece empezar de
        // nuevo, que es lo único que sí se puede cumplir.
        if (vivo) setReconstruible(false);
      });
    return () => {
      vivo = false;
    };
  }, [sesion, slugs]);

  if (reconstruible === null) return <Esqueleto />;

  return (
    <DialogoReanudar
      sesion={sesion}
      restantesSeg={restantesSeg}
      reconstruible={reconstruible}
      onContinuar={onContinuar}
      onEmpezarDeNuevo={onEmpezarDeNuevo}
    />
  );
}

function CierreSimulacro({
  resumen,
  siguiente,
  volver,
  onRepetir,
}: {
  resumen: DatosResumen;
  siguiente: { href: string; texto: string };
  volver: { href: string; texto: string };
  onRepetir: () => void;
}) {
  const refTitulo = useRef<HTMLHeadingElement>(null);

  // El foco salta al titular: el botón que se pulsó desaparece del DOM y sin
  // esto el foco caería al <body>. Y en el auto-envío no hubo clic ninguno.
  useEffect(() => {
    refTitulo.current?.focus();
  }, []);

  return (
    <ResumenSesion
      ref={refTitulo}
      resumen={resumen}
      clase="suelta"
      volver={volver}
      // El informe completo —desglose, temas prioritarios, patrones y revisión
      // ítem por ítem— vive en su propia ruta y es lo primero que se ofrece:
      // esta pantalla da el titular, el informe da el diagnóstico. El
      // diagnóstico inicial lo redirige a `/plan`, que es lo que él produce.
      siguiente={siguiente}
      onRepetir={onRepetir}
    />
  );
}

function Esqueleto() {
  return (
    <div className="space-y-4">
      <span className="sr-only">Cargando el simulacro</span>
      <span className="block h-1 w-full bg-secondary" aria-hidden="true" />
      <span className="block h-40 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
    </div>
  );
}
