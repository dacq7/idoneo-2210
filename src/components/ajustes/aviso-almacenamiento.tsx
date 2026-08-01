'use client';

// src/components/ajustes/aviso-almacenamiento.tsx — Client Component.
//
// El aviso de que `localStorage` no está disponible y todo vive en memoria:
// modo incógnito de Safari, disco lleno, permisos bloqueados.
//
// ══ POR QUÉ ES IMPORTANTE DECIRLO ══
// En ese estado la app **funciona** —`almacenamiento-crudo.ts` degrada a un Map
// en memoria a propósito, para que una sesión de simulacro no se caiga a la
// mitad— pero el progreso **no sobrevive a un recargue**. Un entrenador que
// estudia dos horas en modo incógnito y cierra la pestaña pierde todo sin
// haberse enterado de nada. Es la única situación en la que la app puede
// perder datos en silencio, y por eso se avisa.
//
// El aviso vive solo en /ajustes y no en un banner global: aparecer en las 20
// rutas sería alarmante y no accionable, y aquí es donde está el botón de
// exportar, que es lo único que se puede hacer al respecto.

import { AlertTriangle } from 'lucide-react';

export function AvisoAlmacenamiento() {
  return (
    <section
      aria-labelledby="almacenamiento-titulo"
      className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="min-w-0 space-y-2">
        <h2 id="almacenamiento-titulo" className="font-titulo text-lg font-semibold">
          Tu progreso no se está guardando
        </h2>
        <p className="text-[0.875rem] leading-[1.55]">
          Este navegador no nos deja escribir en su almacenamiento. Suele pasar en modo incógnito o
          privado, con el disco lleno, o si tienes bloqueado el almacenamiento para este sitio.
        </p>
        <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
          La app sigue funcionando y tu sesión de ahora está a salvo, pero{' '}
          <strong className="font-semibold text-foreground">
            todo se perderá al cerrar o recargar la pestaña
          </strong>
          . Si estás en medio de algo, exporta tu progreso desde aquí abajo antes de cerrar. Para
          arreglarlo de verdad, abre la app en una ventana normal.
        </p>
      </div>
    </section>
  );
}
