'use client';

import { useSyncExternalStore } from 'react';
import {
  obtenerSnapshot,
  obtenerSnapshotServidor,
  suscribir,
} from '@/lib/almacenamiento';
import type { EstadoProgreso } from '@/lib/tipos';

/**
 * Devuelve `null` en DOS situaciones distintas, y confundirlas es un error con
 * consecuencias:
 *
 *  1. **Primer render** (servidor e hidratación). Transitorio: el estado real
 *     llega en el render siguiente.
 *  2. **El usuario no tiene nada guardado.** PERMANENTE hasta que algo escriba:
 *     `obtenerSnapshot` lee `localStorage` y no escribe, así que un usuario nuevo
 *     recibe `null` indefinidamente.
 *
 * Por eso **NO basta con «renderiza un esqueleto mientras sea null»**: ese patrón
 * deja el esqueleto puesto PARA SIEMPRE en todo usuario nuevo, que es justo el
 * caso de la primera visita. Hay que distinguir «aún no monté» de «no hay datos»
 * — con una bandera de montaje en un efecto, como hace `etapas-modulo.tsx` — y
 * tratar el segundo caso como estado vacío legítimo, con sus valores por defecto.
 *
 * Nunca un valor por defecto durante el primer render: eso sí produce un salto
 * visible al hidratar.
 *
 * Contrato completo y ejemplo en `.claude/COMPONENTES.md`. Descubierto en el
 * Paso 8 y verificado por el `code-reviewer`.
 *
 * Se llama `useEstado` y no `usarEstado` a propósito, y el archivo conserva su
 * nombre en español. El prefijo `use` no es vocabulario de dominio: es un
 * marcador de protocolo que consumen `react-hooks/rules-of-hooks`, React
 * DevTools y el compilador de React. Sin él, el linter no reconoce la función
 * como hook y deja de auditar su interior. Ver ADR-007.
 */
export function useEstado(): EstadoProgreso | null {
  return useSyncExternalStore(suscribir, obtenerSnapshot, obtenerSnapshotServidor);
}
