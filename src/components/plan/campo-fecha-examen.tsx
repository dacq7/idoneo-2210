'use client';

// src/components/plan/campo-fecha-examen.tsx — Client Component (§10.3).
//
// «¿Cuándo es tu examen?», aquí mismo, en el plan.
//
// ══════════════════════════════════════════════════════════════════════════
// POR QUÉ EL CAMPO VIVE EN /plan Y NO SOLO EN /ajustes
// ══════════════════════════════════════════════════════════════════════════
//
// Por dos razones, y la segunda la encontró el `code-reviewer` midiendo:
//
//  1. **Lo pide el blueprint** (§17, paso 13.3): la vista del plan «pide la
//     fecha de examen si falta». El plan sin fecha funciona —asume seis semanas
//     y lo dice—, pero pedirla donde se nota su ausencia es lo que convierte
//     una advertencia en algo que el usuario puede resolver.
//
//  2. **Porque el remedio que había era un enlace roto.** La advertencia decía
//     «Ponla en Ajustes» y enlazaba a `/ajustes`, que **devuelve 404**: esa
//     ruta se construye en el paso 18.5. Es decir, el requisito «sin fecha el
//     plan sigue siendo útil» se cerraba mandando al usuario a una página que
//     no existe. Un test incluso lo fijaba.
//
// `/ajustes` seguirá teniendo el campo cuando exista —ahí vive junto al nombre,
// el tema y el respaldo—, y los dos escriben en el mismo sitio a través de
// `guardarDatosPersonales`. Tener el control donde duele el problema no es
// duplicar: es lo que separa un formulario de una queja.
//
// ══ RELOJ (§22 regla 6) ══
// El mínimo del campo es hoy, y se calcula en un efecto. El `input type="date"`
// nativo es deliberado: trae el calendario del sistema, el teclado correcto en
// móvil y la accesibilidad hecha. Un selector propio sería peor en las tres.

import { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { guardarDatosPersonales } from '@/lib/almacenamiento';
import { fechaLocalDe } from '@/lib/fechas';

export function CampoFechaExamen({ fechaActual }: { fechaActual?: string }) {
  const [valor, setValor] = useState(fechaActual ?? '');
  const [hoy, setHoy] = useState<string | null>(null);
  const [guardada, setGuardada] = useState(false);

  useEffect(() => {
    setHoy(fechaLocalDe(new Date()));
  }, []);

  const guardar = () => {
    if (valor === '') return;
    // Handler: aquí sí se lee el reloj (§10.4).
    guardarDatosPersonales({ fechaExamen: valor }, new Date().toISOString());
    setGuardada(true);
  };

  return (
    <section
      aria-labelledby="titulo-fecha"
      className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 id="titulo-fecha" className="flex items-center gap-2">
        <CalendarPlus className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        ¿Cuándo es tu examen?
      </h2>

      <p className="text-muted-foreground">
        {fechaActual
          ? 'Puedes cambiarla cuando quieras: el plan se recalcula solo.'
          : 'Sin fecha, el plan de abajo asume seis semanas. Con ella, reparte tus días reales y reserva los tres últimos para el simulacro y el repaso.'}
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="grow space-y-1.5">
          <label htmlFor="fecha-examen" className="block text-[0.8125rem] font-medium">
            Fecha del examen
          </label>
          <input
            id="fecha-examen"
            type="date"
            value={valor}
            min={hoy ?? undefined}
            onChange={(e) => {
              setValor(e.target.value);
              setGuardada(false);
            }}
            className="w-full rounded-md border border-input bg-background px-3 text-[0.9375rem]"
          />
        </div>

        <button
          type="button"
          onClick={guardar}
          // `aria-disabled` y no `disabled`: un botón deshabilitado sale del
          // orden de tabulación y desaparece para quien navega con teclado.
          aria-disabled={valor === '' ? true : undefined}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90 aria-disabled:opacity-50"
        >
          Guardar
        </button>
      </div>

      {/* Región viva SIEMPRE montada, aunque esté vacía: un `aria-live` que
          aparece junto con su contenido no se anuncia de forma fiable. Es el
          mismo patrón que la retroalimentación de los ítems. */}
      <p role="status" className="min-h-0 text-[0.8125rem] text-exito">
        {guardada ? 'Fecha guardada. El plan de abajo ya está recalculado.' : ''}
      </p>
    </section>
  );
}
