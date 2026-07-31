// src/components/informe/veredicto-informe.tsx
//
// Sin directiva de cliente: lo importa `vista-informe.tsx`. No es un alta a §10.3.
//
// El titular del informe: puntaje, veredicto y —siempre, sin excepción— la nota
// de que los cortes son criterio interno de la app.
//
// ══ POR QUÉ `NOTA_VEREDICTO` NO ES LETRA PEQUEÑA ══
// Es requisito de §22 regla 11 y de la licencia (§1: «sus veredictos no
// representan el puntaje oficial de aprobación»). La app **no conoce** el corte
// real del examen de COLEF, así que un «Listo · pasarías» sin esa aclaración
// sería una afirmación que no puede sostener, sobre la decisión más cara que va
// a tomar el usuario: presentarse o no.
//
// Por eso va pegada al veredicto y no en un pie: quien lee «Sólido» tiene que
// leer en el mismo bloque qué significa y qué no.
//
// ══ SIN INSTRUMENTOS PROHIBIDOS (DISENO.md §4.5) ══
// Cero barras de progreso redondeadas y cero anillos con el porcentaje en el
// centro. El puntaje es una cifra grande en `font-mono`, y la escala de umbral
// de §4.4 se dibuja como banda recta con la marca donde cayó el intento.

import { NOTA_VEREDICTO } from '@/lib/informe';
import type { Informe } from '@/lib/tipos';
import { cn } from '@/lib/utils';

/** Los cuatro cortes de `calcularVeredicto`, para dibujar la escala. */
const CORTES = [60, 75, 85] as const;

const CLASE_COLOR: Record<string, { texto: string; fondo: string; borde: string }> = {
  exito: { texto: 'text-exito', fondo: 'bg-exito', borde: 'border-exito' },
  primary: { texto: 'text-primary', fondo: 'bg-primary', borde: 'border-primary' },
  aviso: { texto: 'text-aviso', fondo: 'bg-aviso', borde: 'border-aviso' },
  destructive: { texto: 'text-destructive', fondo: 'bg-destructive', borde: 'border-destructive' },
};

export function VeredictoInforme({
  informe,
  ref,
}: {
  informe: Informe;
  ref?: React.Ref<HTMLHeadingElement>;
}) {
  const { puntaje, veredicto, sinResponder } = informe;
  const color = CLASE_COLOR[veredicto.color] ?? CLASE_COLOR.primary;

  return (
    <section
      aria-labelledby="titulo-veredicto"
      className={cn('space-y-4 rounded-lg border-l-4 bg-card p-4 shadow-sm sm:p-6', color.borde)}
    >
      {/* tabIndex -1: recibe el foco al llegar desde el cierre del simulacro. */}
      <h2 id="titulo-veredicto" ref={ref} tabIndex={-1} className="sr-only">
        Resultado: {puntaje} de 100, {veredicto.titulo}
      </h2>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className={cn('font-mono text-5xl font-semibold leading-none tabular-nums', color.texto)}>
          {puntaje}
        </p>
        <p className="text-muted-foreground">de 100</p>
        <p className={cn('ml-auto font-titulo text-xl font-semibold', color.texto)}>
          {veredicto.titulo}
        </p>
      </div>

      <EscalaUmbral puntaje={puntaje} fondo={color.fondo} />

      <p className="text-[0.9375rem] leading-[1.5]">{veredicto.mensaje}</p>

      {sinResponder > 0 ? (
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          {sinResponder === 1
            ? 'Dejaste 1 ítem sin responder y cuenta como fallo.'
            : `Dejaste ${sinResponder} ítems sin responder y cuentan como fallo.`}{' '}
          En el examen real no hay penalización por marcar mal: si te vuelve a pasar, responde
          aunque dudes.
        </p>
      ) : null}

      {/* La nota va SIEMPRE y va aquí, no en un pie. Ver la cabecera. */}
      <p className="border-t border-border pt-3 text-[0.8125rem] leading-[1.45] text-muted-foreground">
        {NOTA_VEREDICTO}
      </p>
    </section>
  );
}

/**
 * Escala de umbral (DISENO.md §4.4): banda recta con los tres cortes y una
 * marca donde cayó el intento. `aria-hidden` — el dato ya está dicho en cifras
 * arriba, y una escala leída por un lector es ruido.
 */
function EscalaUmbral({ puntaje, fondo }: { puntaje: number; fondo: string }) {
  return (
    <div aria-hidden="true" className="space-y-1">
      <div className="relative h-2 w-full bg-secondary">
        <div className={cn('h-full', fondo)} style={{ width: `${puntaje}%` }} />
        {CORTES.map((corte) => (
          <span
            key={corte}
            className="absolute top-0 h-2 w-px bg-background"
            style={{ left: `${corte}%` }}
          />
        ))}
      </div>
      <div className="relative h-3 text-[0.6875rem] text-muted-foreground">
        {CORTES.map((corte) => (
          <span
            key={corte}
            className="absolute -translate-x-1/2 font-mono tabular-nums"
            style={{ left: `${corte}%` }}
          >
            {corte}
          </span>
        ))}
      </div>
    </div>
  );
}
