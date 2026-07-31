// src/components/sesion/repaso/repaso-sin-red.tsx
//
// Pantalla de `/repaso`: el `import()` del contenido rechazó. §3 del brief
// cuenta con conectividad intermitente, así que no es un borde exótico.
//
// Un componente exportado por archivo (CLAUDE.md §21 regla 1, redacción fijada
// el 2026-07-31). Antes los cinco estados vivían en `repaso-vacio.tsx`, que
// exportaba seis componentes. Ver ADR-022 y su enmienda.
//
// Sin directiva de cliente: lo importa un Client Component y se compila para el
// cliente igual. No es un alta a §10.3.

import { Marco } from './marco';
import { WifiOff } from 'lucide-react';

/**
 * No se pudo descargar el contenido de la cola.
 *
 * Quinta pantalla, y la única que NO es un estado vacío: aquí sí hay algo que
 * repasar y el problema es de red. Por eso no se recicla `ColaSinContenido`, que
 * diría «volverán a aparecer en cuanto su módulo se publique» — una mentira
 * cuando lo que pasa es que el bus entró en un túnel.
 *
 * El contenido de esta app se cachea con el service worker (§16), así que este
 * fallo es de la PRIMERA vez que se abre un módulo sin red. Decirlo es útil: el
 * usuario sabe que la próxima vez sí funcionará.
 */
export function RepasoSinRed({
  intento,
  onReintentar,
}: {
  intento: number;
  onReintentar: () => void;
}) {
  return (
    <Marco icono={WifiOff} titulo="No se pudo cargar el material de hoy">
      <p className="text-muted-foreground">
        Tu cola está intacta —no se ha perdido nada— pero no se pudo descargar el contenido
        que toca repasar. Suele ser la conexión.
      </p>
      <p className="text-muted-foreground">
        Los módulos que ya abriste antes quedan guardados en el dispositivo y funcionan sin
        red. Este es material que aún no habías descargado.
      </p>
      <button
        type="button"
        onClick={onReintentar}
        className="min-h-[44px] w-full rounded-md border border-border bg-card px-4 font-medium transition-colors duration-150 hover:bg-accent sm:w-auto sm:px-6"
      >
        Reintentar
      </button>
      {intento > 1 ? (
        <p className="text-[0.8125rem] text-muted-foreground" role="status">
          {intento} intentos sin conseguirlo. Si sigue igual, vuelve más tarde: la cola te
          espera.
        </p>
      ) : null}
    </Marco>
  );
}
