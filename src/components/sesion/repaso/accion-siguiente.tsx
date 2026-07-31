// src/components/sesion/repaso/accion-siguiente.tsx
//
// El bloque de acción que comparten las cinco pantallas de `/repaso`: «lo que
// sí tiene sentido hacer hoy».
//
// Convive con `siguienteSinDominar` y con el tipo `ModuloPublicado` porque un
// HELPER no es un componente: la regla 1 cuenta componentes exportados, y aquí
// hay uno. Separarlos en tres archivos sería obedecer la letra contra el
// sentido — la función y el componente que la consume se leen juntos.
//
// Sin directiva de cliente: lo importa un Client Component. No es un alta a §10.3.

import Link from 'next/link';
import type { BloqueId } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

/** Lo mínimo que el repaso necesita saber de un módulo publicado. Serializable.
 *  Llega por prop desde la página, que es Server Component (ADR-010). */
export interface ModuloPublicado {
  slug: string;
  titulo: string;
  bloque: BloqueId;
}

/**
 * El primer módulo publicado que el usuario todavía no domina, en orden de
 * estudio. `null` si no hay ninguno —o porque no hay contenido publicado, o
 * porque los domina todos—, y las dos situaciones se resuelven con un enlace al
 * índice: no se inventa un módulo para tener algo que ofrecer.
 */
export function siguienteSinDominar(
  modulos: readonly ModuloPublicado[],
  dominados: ReadonlySet<string>,
): ModuloPublicado | null {
  return modulos.find((m) => !dominados.has(m.slug)) ?? null;
}

/** Bloque de acción compartido por las cuatro pantallas. */
export function AccionSiguiente({
  modulo,
  encabezado,
}: {
  modulo: ModuloPublicado | null;
  encabezado: string;
}) {
  if (modulo === null) {
    return (
      <p className="text-muted-foreground">
        {encabezado}{' '}
        <Link
          href="/modulos"
          className="font-medium text-primary underline underline-offset-2"
        >
          Mira el índice de módulos
        </Link>{' '}
        para elegir por dónde seguir.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground">{encabezado}</p>
      <Link
        href={`/modulos/${modulo.slug}`}
        className={cn(
          'flex min-h-11 items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5',
          'transition-colors duration-150 hover:bg-accent sm:px-6',
        )}
      >
        {/* Banda de color de bloque: relleno puro y `aria-hidden`, porque el
            texto de al lado ya nombra el bloque (DISENO.md §1.2). */}
        <span
          className={cn('h-5 w-1 shrink-0', CLASES_BLOQUE[modulo.bloque].fondo)}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
            Bloque {modulo.bloque} · siguiente sin dominar
          </span>
          <span className="mt-0.5 block font-medium">{modulo.titulo}</span>
        </span>
      </Link>
    </div>
  );
}
