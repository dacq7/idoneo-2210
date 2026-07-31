// src/components/sesion/repaso/cola-sin-contenido.tsx
//
// Pantalla de `/repaso`: la cola apunta a módulos que ya no están publicados.
// Caso raro, pero deja la cola en un limbo y hay que decirlo en vez de mostrar
// una pantalla en blanco.
//
// Un componente exportado por archivo (CLAUDE.md §21 regla 1, redacción fijada
// el 2026-07-31). Antes los cinco estados vivían en `repaso-vacio.tsx`, que
// exportaba seis componentes. Ver ADR-022 y su enmienda.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import { Marco } from './marco';
import { TriangleAlert } from 'lucide-react';
import { AccionSiguiente, type ModuloPublicado } from './accion-siguiente';

/** La cola apunta a contenido que ya no está publicado. */
export function ColaSinContenido({
  pendientes,
  siguiente,
}: {
  pendientes: number;
  siguiente: ModuloPublicado | null;
}) {
  return (
    <Marco icono={TriangleAlert} titulo="Tu cola apunta a contenido que ya no está">
      <p className="text-muted-foreground">
        Hay {pendientes === 1 ? '1 elemento pendiente' : `${pendientes} elementos pendientes`}{' '}
        de hoy, pero pertenecen a módulos cuyo contenido no está publicado en esta versión
        de la app. No se ha perdido tu progreso: esos elementos siguen guardados y volverán
        a aparecer en cuanto su módulo se publique.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Mientras tanto, esto sí está listo para estudiar."
      />
    </Marco>
  );
}
