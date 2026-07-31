// src/components/sesion/repaso/marco.tsx
//
// El envoltorio visual que comparten los estados de `/repaso`: tarjeta con
// icono, titular y contenido. Vive aparte porque lo usan cuatro pantallas que
// ahora son cuatro archivos.
//
// El `<h2 id="estado-repaso">` es el nombre accesible de la sección. Solo se
// monta una de estas pantallas a la vez, así que el id no colisiona.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import type { LucideIcon } from 'lucide-react';

export function Marco({
  icono: Icono,
  titulo,
  children,
}: {
  icono: LucideIcon;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby="estado-repaso"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Icono className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <h2 id="estado-repaso" className="min-w-0 flex-1">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}
