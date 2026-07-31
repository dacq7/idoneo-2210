// src/components/sesion/repaso/nada-pendiente-hoy.tsx
//
// Pantalla de `/repaso`: va al día. Se dice en cuántos días vuelve a tocar, que
// es la información que convierte un vacío en una cita.
//
// Un componente exportado por archivo (CLAUDE.md §21 regla 1, redacción fijada
// el 2026-07-31). Antes los cinco estados vivían en `repaso-vacio.tsx`, que
// exportaba seis componentes. Ver ADR-022 y su enmienda.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import { Marco } from './marco';
import { CalendarCheck } from 'lucide-react';
import { AccionSiguiente, type ModuloPublicado } from './accion-siguiente';

/** Hay cola, pero hoy no vence nada. El caso bueno. */
export function NadaPendienteHoy({
  totalEnCola,
  proximoEnDias,
  siguiente,
}: {
  totalEnCola: number;
  proximoEnDias: number | null;
  siguiente: ModuloPublicado | null;
}) {
  return (
    <Marco icono={CalendarCheck} titulo="Nada que repasar hoy — tu memoria va al día">
      <p className="text-muted-foreground">
        Tienes {totalEnCola === 1 ? '1 elemento' : `${totalEnCola} elementos`} en la cola y
        ninguno vence hoy.{' '}
        {proximoEnDias === null
          ? 'Todos están al día.'
          : proximoEnDias <= 1
            ? 'El siguiente te toca mañana.'
            : `El siguiente te toca dentro de ${proximoEnDias} días.`}{' '}
        Adelantar un repaso no lo refuerza más: el espaciado funciona porque cuesta
        recordar, y si respondes hoy lo que te toca el jueves, el jueves ya no te costará.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Hoy el tiempo rinde más en material nuevo."
      />
    </Marco>
  );
}
