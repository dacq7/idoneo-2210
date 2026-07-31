// src/components/sesion/repaso/cierre-repaso.tsx
//
// Pantalla de `/repaso`: terminó la sesión. Cuántos supo y cuántos no, sin
// felicitación vacía — el mensaje de «lo supe todo» es el más severo del
// conjunto, por la misma razón que en el mazo de tarjetas (§22 regla 10).
//
// Un componente exportado por archivo (CLAUDE.md §21 regla 1, redacción fijada
// el 2026-07-31). Antes los cinco estados vivían en `repaso-vacio.tsx`, que
// exportaba seis componentes. Ver ADR-022 y su enmienda.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import { AccionSiguiente, type ModuloPublicado } from './accion-siguiente';

/** Terminó la sesión del día. */
export function CierreRepaso({
  ref,
  total,
  acertadas,
  siguiente,
}: {
  ref: React.Ref<HTMLHeadingElement>;
  total: number;
  acertadas: number;
  siguiente: ModuloPublicado | null;
}) {
  const fallos = total - acertadas;

  return (
    <section
      aria-labelledby="cierre-repaso"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      {/* tabIndex -1: recibe el foco al cerrar la sesión, para que el cambio de
          pantalla se anuncie y no haya que buscar dónde quedó el hilo. */}
      <h2 id="cierre-repaso" ref={ref} tabIndex={-1}>
        Terminaste el repaso de hoy
      </h2>

      <p className="text-[0.9375rem]">
        Repasaste {total === 1 ? '1 elemento' : `${total} elementos`}. Acertaste{' '}
        <strong className="font-semibold">{acertadas}</strong> y fallaste{' '}
        <strong className="font-semibold">{fallos}</strong>.
      </p>

      <p className="text-muted-foreground">
        {fallos === 0
          ? 'Los que acertaste se alejan en el calendario y no vuelven mañana. Ojo con leer esto como que ya te los sabes: acertar hoy lo que viste hace dos días es lo mínimo que el espaciado espera, y la prueba real es acertarlo dentro de tres semanas.'
          : fallos >= total / 2
            ? 'Los que fallaste vuelven mañana, y eso es exactamente lo que tiene que pasar: el intervalo se reinicia hasta que dejen de fallarse. Si un módulo entero se te está cayendo aquí, el problema no es la cola, es que ese módulo hay que releerlo.'
            : 'Los que fallaste vuelven mañana; los que acertaste se alejan. Así es como la cola se va vaciando sola sin que tengas que decidir qué repasar.'}
      </p>

      <AccionSiguiente
        modulo={siguiente}
        encabezado="Ya no queda cola para hoy. Si te sobra tiempo, rinde en material nuevo."
      />
    </section>
  );
}
