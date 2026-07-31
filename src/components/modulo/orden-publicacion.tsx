// src/components/modulo/orden-publicacion.tsx
//
// «¿Cuándo llega el contenido de este módulo?»
//
// Sin directiva de cliente: lo importa `etapas-modulo.tsx`, que sí la lleva.
// No es un alta a §10.3.
//
// ══ SE DA EL ORDEN, NO UNA FECHA ══
// No hay fecha comprometida y **inventar una sería mentir** en la pantalla que
// existe para ser honesta sobre lo que falta. Lo que sí está decidido —y escrito
// en el blueprint §14.4— es el ORDEN de publicación, elegido por densidad de
// retorno y no alfabéticamente:
//
//     C5 → bloque D → resto del bloque C → bloque B → bloque A
//
// Eso es información real y accionable: quien mira un módulo del bloque D sabe
// que el suyo es lo siguiente, y quien mira uno del A sabe que va al final y
// puede planificar en consecuencia. Es más útil que un «pronto» y más honesto
// que una fecha.

import type { BloqueId } from '@/lib/tipos';

/** Posición de cada bloque en la cola de producción (§14.4 del blueprint). */
const TURNO: Record<BloqueId, number> = { D: 1, C: 2, B: 3, A: 4 };

const NOMBRE: Record<BloqueId, string> = {
  A: 'Ciencias Básicas',
  B: 'Pedagogía y Didáctica',
  C: 'Ciencias Aplicadas',
  D: 'Entrenamiento Deportivo',
};

const ORDINAL: Record<number, string> = {
  1: 'el primero',
  2: 'el segundo',
  3: 'el tercero',
  4: 'el último',
};

export function OrdenPublicacion({ bloque }: { bloque: BloqueId }) {
  const turno = TURNO[bloque];

  return (
    <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
      El contenido se escribe por bloques, no módulo suelto. El bloque {bloque} —{' '}
      {NOMBRE[bloque]} — es <strong className="font-semibold text-foreground">{ORDINAL[turno]}</strong>{' '}
      de los cuatro en la cola.{' '}
      {/* Ni siquiera del primero se afirma que «se está escribiendo ahora»: eso
          solo sería cierto durante el paso que lo escribe, y esta pantalla
          existe para no adelantar nada. */}
      {turno === 1
        ? 'Es el siguiente en escribirse.'
        : 'No hay fecha comprometida y no nos la inventamos: cuando esté, aparecerá aquí sin que tengas que hacer nada.'}
    </p>
  );
}
