'use client';

import { useSyncExternalStore } from 'react';
import {
  obtenerSnapshot,
  obtenerSnapshotServidor,
  suscribir,
} from '@/lib/almacenamiento';
import type { EstadoProgreso } from '@/lib/tipos';

/**
 * Devuelve null en el primer render (servidor e hidratación) y el estado real
 * a partir del segundo. Todo componente que lo use DEBE renderizar un esqueleto
 * mientras sea null — nunca un valor por defecto que luego "salte".
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
