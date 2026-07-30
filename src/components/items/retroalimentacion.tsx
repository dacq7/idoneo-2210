'use client';

// src/components/items/retroalimentacion.tsx — Client Component (§10.3).
//
// Lo que se muestra DESPUÉS de responder, nunca antes. Orden fijo:
//
//   veredicto del ítem → `explicacion` → `pasos` si es cálculo → `referencia`
//
// y NADA MÁS. §13 del blueprint describe además un cuadro de contradicción entre
// cartillas: **no se monta** (ADR-014). El sistema de erratas se eliminó de la
// app, el campo `contradiccion` de `ItemBase` ya no existe y `<AlertaContradiccion>`
// tampoco. El contenido enseña el dato verdadero y punto.
//
// La `referencia` no es decorativa: es lo que permite ir a verificar el dato en
// la cartilla. Va en pequeño, pero va siempre.
//
// El anuncio a lector de pantalla NO se hace desde aquí: la región `aria-live`
// vive en el controlador de sesión y está SIEMPRE montada. Una región viva que
// aparece en el DOM al mismo tiempo que su contenido no se anuncia de forma
// fiable en varios lectores — el navegador tiene que haber visto la región vacía
// antes para detectar el cambio.

import { BookMarked, Check, CircleHelp, X } from 'lucide-react';
import type { Item } from '@/lib/tipos';
import { cn } from '@/lib/utils';

interface Props {
  item: Item;
  correcta: boolean;
  /** `false` = lo dejó en blanco. No es lo mismo que fallarlo. */
  respondida: boolean;
}

export function Retroalimentacion({ item, correcta, respondida }: Props) {
  const estado = !respondida ? 'blanco' : correcta ? 'acierto' : 'fallo';

  const Icono = estado === 'acierto' ? Check : estado === 'fallo' ? X : CircleHelp;

  const titulo =
    estado === 'acierto'
      ? 'Correcta'
      : estado === 'fallo'
        ? 'Incorrecta'
        : 'La dejaste sin responder';

  return (
    <section
      // `role="note"` y no la `region` implícita de un <section> con nombre: la
      // explicación es un aparte DENTRO del hilo de lectura, no una zona de la
      // página. Con el rol implícito, la pantalla de resumen producía OCHO
      // landmarks llamados igual —«Explicación de la respuesta»— y la lista de
      // landmarks, que es la forma rápida de moverse con lector, dejaba de
      // servir. Mismo criterio y mismo remedio que A-09 en `<Ojo>` (A-27).
      role="note"
      aria-label="Explicación de la respuesta"
      className={cn(
        'space-y-3 rounded-lg border p-4 sm:p-5',
        estado === 'acierto' && 'border-exito/40 bg-exito/8',
        estado === 'fallo' && 'border-destructive/40 bg-destructive/8',
        estado === 'blanco' && 'border-aviso/40 bg-aviso/8',
      )}
    >
      <p className="flex items-center gap-2">
        <span
          className={cn(
            'grid size-6 shrink-0 place-items-center rounded-md',
            estado === 'acierto' && 'bg-exito text-exito-foreground',
            estado === 'fallo' && 'bg-destructive text-destructive-foreground',
            estado === 'blanco' && 'bg-aviso text-aviso-foreground',
          )}
          aria-hidden="true"
        >
          <Icono className="size-4" />
        </span>
        <span className="font-titulo text-[1.125rem] font-semibold leading-[1.25]">{titulo}</span>
      </p>

      <p className="leading-[1.55]">{item.explicacion}</p>

      {item.tipo === 'calculo' ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
            Paso a paso
          </p>
          <ol className="list-decimal space-y-1 pl-5 font-mono text-[0.8125rem] leading-[1.5] marker:font-sans marker:text-muted-foreground">
            {item.pasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="flex items-start gap-1.5 text-[0.8125rem] text-muted-foreground">
        <BookMarked className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          <span className="sr-only">Dónde verificarlo: </span>
          {item.referencia}
        </span>
      </p>
    </section>
  );
}
