'use client';

// src/hooks/usar-sesion.ts — máquina de estado de una tanda de ítems.
//
// Se exporta como `useSesion` y el archivo conserva su nombre en español
// (ADR-007): el prefijo `use` no es vocabulario de dominio, es el marcador que
// consumen `react-hooks/rules-of-hooks`, las DevTools y el compilador de React.
// Sin él, el linter deja de auditar el interior del hook — justo aquí, que es
// donde vive el avance de la sesión.
//
// Qué NO hace este hook, a propósito:
//
//  · No baraja ni muestrea. La tanda le llega ya armada y ya presentada, porque
//    la semilla nace de `Date.now()` en el handler de «Empezar» (§22 reglas 5
//    y 6) y eso es responsabilidad del controlador.
//  · No persiste nada. Quién escribe en `localStorage`, y qué escribe, depende
//    de para qué es la sesión (práctica, quiz, simulacro): lo decide el
//    controlador.
//  · No decide si una respuesta es correcta. Eso es `calificar()` de
//    `src/lib/simulacro.ts`.
//
// Reloj (§22 regla 6): `Date.now()` aparece dos veces, en un efecto y en los
// handlers. Nunca en el cuerpo del render.

import { useCallback, useEffect, useRef, useState } from 'react';
import { calcularPuntaje } from '@/lib/informe';
import { calificar, sinResponder } from '@/lib/simulacro';
import type { Item } from '@/lib/tipos';

export interface RespuestaEnSesion {
  valor: unknown;
  /** Segundos acumulados en este ítem. Se cierra al salir de él. */
  segundos: number;
  /** «Revisar después». */
  marcada: boolean;
}

export interface ResultadoItem {
  item: Item;
  valor: unknown;
  correcta: boolean;
  /** `false` = lo dejó en blanco. Distinto de fallarlo. */
  respondida: boolean;
  segundos: number;
  marcada: boolean;
}

export interface ResumenSesion {
  total: number;
  correctas: number;
  sinResponder: number;
  /** 0–100, redondeado. */
  puntaje: number;
  segundos: number;
  detalle: ResultadoItem[];
}

const RESPUESTA_VACIA: RespuestaEnSesion = { valor: null, segundos: 0, marcada: false };

export interface Sesion {
  indice: number;
  total: number;
  item: Item | undefined;
  /** Respuesta del ítem en pantalla. `null` = sin responder. */
  valor: unknown;
  marcada: boolean;
  /** Solo con retroalimentación inmediata: el usuario ya pidió el veredicto. */
  comprobado: boolean;
  /** El ítem en pantalla está respondido (no en blanco). */
  respondido: boolean;
  esUltimo: boolean;
  terminada: boolean;
  resumen: ResumenSesion | null;
  respuestas: Record<string, RespuestaEnSesion>;
  responder: (valor: unknown) => void;
  alternarMarca: () => void;
  comprobar: () => void;
  avanzar: () => void;
  retroceder: () => void;
  /** Salta a un ítem por índice. Lo usa el panel de navegación del simulacro. */
  irA: (indice: number) => void;
  /** Cierra la sesión y devuelve el resumen para que el controlador lo persista. */
  terminar: () => ResumenSesion;
}

/**
 * Estado con el que arranca una sesión **reanudada**. Lo aporta el Paso 11:
 * un simulacro cronometrado que se recupera de `localStorage` tras cerrar la
 * pestaña vuelve con sus respuestas y en el ítem donde se quedó.
 *
 * Se lee **una sola vez, al montar**. Después la sesión es dueña de su estado:
 * volver a mirarlo en cada render haría que cada escritura en `localStorage`
 * reinyectara el valor guardado y machacara lo que el usuario está tecleando.
 */
export interface SesionInicial {
  indice: number;
  respuestas: Record<string, RespuestaEnSesion>;
}

export function useSesion(items: readonly Item[], inicial?: SesionInicial): Sesion {
  // `useState(() => …)`: el inicializador perezoso corre solo en el primer
  // render. Es lo que fija «se lee una vez al montar» en el idioma de React, en
  // lugar de confiarlo a un efecto que llegaría un render tarde — y en ese
  // render el usuario ya vería la tanda en blanco antes de que aparecieran sus
  // respuestas.
  const [indice, setIndice] = useState(() =>
    inicial === undefined ? 0 : Math.min(Math.max(inicial.indice, 0), Math.max(items.length - 1, 0)),
  );
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaEnSesion>>(
    () => inicial?.respuestas ?? {},
  );
  const [comprobados, setComprobados] = useState<readonly string[]>([]);
  const [terminada, setTerminada] = useState(false);
  const [resumen, setResumen] = useState<ResumenSesion | null>(null);
  // Espejo en ref del resumen: `terminar` tiene que ser idempotente y el estado
  // no sirve para eso, porque dentro de un mismo tick la clausura todavía ve el
  // valor viejo. Ver más abajo.
  const resumenCerrado = useRef<ResumenSesion | null>(null);

  const item = items[indice];
  const total = items.length;

  /** Momento en que empezó a verse el ítem actual. Se toca en efectos y handlers. */
  const desdeMs = useRef<number | null>(null);

  useEffect(() => {
    if (terminada) return;
    desdeMs.current = Date.now();
  }, [indice, terminada]);

  /** Cierra el cronómetro del ítem actual y devuelve los segundos que sumó. */
  const cerrarTiempo = useCallback((): number => {
    const desde = desdeMs.current;
    if (desde === null) return 0;
    const ahora = Date.now();
    desdeMs.current = ahora;
    return Math.max(0, Math.round((ahora - desde) / 1000));
  }, []);

  const acumularEn = useCallback((itemId: string, segundos: number) => {
    if (segundos === 0) return;
    setRespuestas((previas) => {
      const actual = previas[itemId] ?? RESPUESTA_VACIA;
      return { ...previas, [itemId]: { ...actual, segundos: actual.segundos + segundos } };
    });
  }, []);

  const responder = useCallback(
    (valor: unknown) => {
      if (item === undefined || terminada) return;
      setRespuestas((previas) => {
        const actual = previas[item.id] ?? RESPUESTA_VACIA;
        return { ...previas, [item.id]: { ...actual, valor } };
      });
    },
    [item, terminada],
  );

  const alternarMarca = useCallback(() => {
    if (item === undefined) return;
    setRespuestas((previas) => {
      const actual = previas[item.id] ?? RESPUESTA_VACIA;
      return { ...previas, [item.id]: { ...actual, marcada: !actual.marcada } };
    });
  }, [item]);

  const comprobar = useCallback(() => {
    if (item === undefined) return;
    setComprobados((previos) => (previos.includes(item.id) ? previos : [...previos, item.id]));
  }, [item]);

  const mover = useCallback(
    (destino: number) => {
      if (item !== undefined) acumularEn(item.id, cerrarTiempo());
      setIndice(Math.min(Math.max(destino, 0), Math.max(total - 1, 0)));
    },
    [item, acumularEn, cerrarTiempo, total],
  );

  const avanzar = useCallback(() => mover(indice + 1), [mover, indice]);
  const retroceder = useCallback(() => mover(indice - 1), [mover, indice]);
  // `mover` ya acota el destino al rango válido, así que un índice fuera de
  // rango del panel de navegación no puede dejar la sesión sin ítem.
  const irA = useCallback((destino: number) => mover(destino), [mover]);

  const terminar = useCallback((): ResumenSesion => {
    // Idempotente: la segunda llamada devuelve el mismo resumen sin recalcular.
    // Hoy no es alcanzable —el botón se desmonta al primer clic y `Enter` está
    // excluido a propósito de cerrar la tanda—, y se cierra ahora porque el
    // Paso 11 mete auto-envío por temporizador compitiendo con el clic del
    // usuario: ahí sí lo es, y el síntoma sería un `intentosQuiz` inflado, que
    // es un dato que el informe del Paso 12 lee.
    if (resumenCerrado.current !== null) return resumenCerrado.current;

    const ultimosSegundos = cerrarTiempo();
    const cerradas: Record<string, RespuestaEnSesion> = { ...respuestas };
    if (item !== undefined && ultimosSegundos > 0) {
      const actual = cerradas[item.id] ?? RESPUESTA_VACIA;
      cerradas[item.id] = { ...actual, segundos: actual.segundos + ultimosSegundos };
    }

    const detalle: ResultadoItem[] = items.map((it) => {
      const respuesta = cerradas[it.id] ?? RESPUESTA_VACIA;
      const respondida = !sinResponder(respuesta.valor);
      return {
        item: it,
        valor: respuesta.valor,
        // La calificación la hace el motor, siempre. Un valor malformado
        // devuelve `false` sin lanzar (§7.3).
        correcta: respondida && calificar(it, respuesta.valor),
        respondida,
        segundos: respuesta.segundos,
        marcada: respuesta.marcada,
      };
    });

    const correctas = detalle.filter((d) => d.correcta).length;
    const nuevo: ResumenSesion = {
      total: detalle.length,
      correctas,
      sinResponder: detalle.filter((d) => !d.respondida).length,
      // [Paso 12] Ya no hay copia de la fórmula: `informe.ts` es su dueño.
      // Estaba marcado aquí desde el Paso 9, con el aviso de que la línea se
      // sustituiría por la llamada en cuanto el motor existiera.
      puntaje: calcularPuntaje(
        detalle.map((d) => ({
          itemId: d.item.id,
          respuesta: d.valor,
          correcta: d.correcta,
          segundos: d.segundos,
          marcada: d.marcada,
        })),
        detalle.length,
      ),
      segundos: detalle.reduce((suma, d) => suma + d.segundos, 0),
      detalle,
    };

    resumenCerrado.current = nuevo;
    setRespuestas(cerradas);
    setResumen(nuevo);
    setTerminada(true);
    return nuevo;
  }, [cerrarTiempo, respuestas, item, items]);

  const respuestaActual = item === undefined ? RESPUESTA_VACIA : (respuestas[item.id] ?? RESPUESTA_VACIA);

  return {
    indice,
    total,
    item,
    valor: respuestaActual.valor,
    marcada: respuestaActual.marcada,
    comprobado: item !== undefined && comprobados.includes(item.id),
    respondido: !sinResponder(respuestaActual.valor),
    esUltimo: indice >= total - 1,
    terminada,
    resumen,
    respuestas,
    responder,
    alternarMarca,
    comprobar,
    avanzar,
    retroceder,
    irA,
    terminar,
  };
}
