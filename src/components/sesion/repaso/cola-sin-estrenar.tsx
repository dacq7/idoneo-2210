// src/components/sesion/repaso/cola-sin-estrenar.tsx
//
// Pantalla de `/repaso`: la cola está vacía del todo — el usuario todavía no ha
// estudiado nada, así que se explica CÓMO entran las cosas a la cola en vez de
// mostrar un vacío sin salida.
//
// Un componente exportado por archivo (CLAUDE.md §21 regla 1, redacción fijada
// el 2026-07-31). Antes los cinco estados vivían en `repaso-vacio.tsx`, que
// exportaba seis componentes. Ver ADR-022 y su enmienda.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import { Marco } from './marco';
import { Inbox } from 'lucide-react';
import { AccionSiguiente, type ModuloPublicado } from './accion-siguiente';

/** Cola completamente vacía: el usuario todavía no ha estudiado nada. */
export function ColaSinEstrenar({ siguiente }: { siguiente: ModuloPublicado | null }) {
  return (
    <Marco icono={Inbox} titulo="Todavía no hay nada que repasar">
      <p className="text-muted-foreground">
        La cola no se llena sola ni se rellena con material de relleno: aquí solo entra
        lo que ya viste y lo que ya fallaste. Cada tarjeta que respondas en la etapa
        Tarjetas de un módulo entra a la cola, y cada pregunta que falles en la práctica,
        en el quiz o en un simulacro entra también.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Empieza por estudiar un módulo y mañana esta pantalla ya tendrá trabajo."
      />
    </Marco>
  );
}
