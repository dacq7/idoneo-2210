'use client';

// src/components/inicio/resumen-inicio.tsx — Client Component (§10.3).
//
// Dónde estás: módulos dominados, cola de repaso y simulacros hechos. Tres
// cifras, no un panel.
//
// ══ POR QUÉ TRES Y NO SIETE ══
// La portada responde «¿qué hago ahora?», y eso ya lo hace la tarjeta de
// arriba. Esto es el contexto que justifica esa recomendación, así que cada
// cifra de más compite con la acción principal. El detalle completo vive en
// `/progreso`, que es la pantalla que existe para eso — y aquí se enlaza.
//
// ══ CADA CIFRA LLEVA SU DENOMINADOR ══
// «3 módulos dominados» no dice nada; «3 de 29» sí. Y con 28 módulos en
// preparación importa más todavía: el denominador honesto no es 29, es **lo que
// hay publicado**, porque nadie puede dominar lo que no existe. Mostrar 1/29
// haría creer al usuario que va tarde cuando va al día.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface DatosResumen {
  /** Módulos con quiz ≥ 80. */
  dominados: number;
  /** Módulos con contenido publicado hoy. El denominador honesto. */
  publicados: number;
  /** Total de módulos de la ruta, publicados o no. */
  totales: number;
  /** Elementos de la cola de repaso vencidos hoy. */
  repasoPendiente: number;
  /** Simulacros y diagnósticos terminados. */
  intentos: number;
}

export function ResumenInicio({ datos }: { datos: DatosResumen }) {
  const { dominados, publicados, totales, repasoPendiente, intentos } = datos;

  return (
    <section aria-labelledby="titulo-resumen" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id="titulo-resumen">Dónde estás</h2>
        <Link
          href="/progreso"
          className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-primary underline underline-offset-2"
        >
          Ver todo tu progreso
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <Cifra
          valor={`${dominados}/${publicados}`}
          rotulo={publicados === 1 ? 'módulo dominado' : 'módulos dominados'}
        />
        <Cifra valor={repasoPendiente} rotulo="por repasar hoy" />
        <Cifra valor={intentos} rotulo={intentos === 1 ? 'simulacro hecho' : 'simulacros hechos'} />
      </dl>

      {publicados < totales ? (
        // El dato que evita que el usuario crea que va tarde: el denominador de
        // arriba son los publicados, no los 29 de la ruta.
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Hay {publicados} de {totales} módulos publicados. El resto se irá subiendo, y tu progreso
          en los que ya están no se pierde.
        </p>
      ) : null}
    </section>
  );
}

function Cifra({ valor, rotulo }: { valor: string | number; rotulo: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      {/* `dd` antes que `dt` en el orden visual, pero el par sigue siendo
          correcto: en una `dl` el navegador los asocia por posición, no por
          orden de lectura visual. */}
      <dt className="sr-only">{rotulo}</dt>
      <dd className="space-y-0.5">
        <span className="block font-mono text-2xl font-semibold leading-none tabular-nums">
          {valor}
        </span>
        <span aria-hidden="true" className="block text-[0.75rem] leading-[1.3] text-muted-foreground">
          {rotulo}
        </span>
      </dd>
    </div>
  );
}
