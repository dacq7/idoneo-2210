// src/components/items/opcion.tsx — pieza compartida de los ítems de opciones
// (`unica`, `caso`, `multiple`, `vf`).
//
// NO lleva la directiva de cliente y eso NO es un descuido: §10.3 lista los
// archivos que la llevan, y un módulo importado desde un Client Component ya se
// compila para el cliente sin declararla. Este archivo no es un alta a esa
// lista; es la pieza que evita cuatro copias del mismo botón.
//
// Reglas que implementa, todas de DISENO.md:
//   §3    · opción de ítem a `min-h-[52px]`.
//   §2.3  · texto de opción 15px/1.4; la letra (A/B/C/D) en JetBrains Mono.
//   §1.2  · el color NUNCA es el único portador: en revisión cada opción lleva
//           icono (visual) y texto solo para lector de pantalla (no visual).
//   §5.2  · `transition-colors`, jamás `transition-all`.

import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { editable, enRevision, type ModoItem } from './contrato';

export const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;

/** Qué marca lleva la opción cuando ya hay veredicto en pantalla. */
export type MarcaOpcion =
  /** No es correcta y el usuario no la eligió. */
  | 'ninguna'
  /** Es correcta (la haya elegido o no). */
  | 'correcta'
  /** El usuario la eligió y no es correcta. */
  | 'fallo';

interface PropsBotonOpcion {
  /** Texto del chip. Letra en las opciones, «V»/«F» en verdadero-falso. */
  rotulo: string;
  texto: string;
  elegida: boolean;
  marca: MarcaOpcion;
  modo: ModoItem;
  onElegir: () => void;
  /** `true` en múltiple: el control es de marcar y desmarcar, no de elegir uno. */
  varias?: boolean;
}

export function BotonOpcion({
  rotulo,
  texto,
  elegida,
  marca,
  modo,
  onElegir,
  varias = false,
}: PropsBotonOpcion) {
  const revision = enRevision(modo);
  const puedeElegir = editable(modo);

  const acertada = revision && marca === 'correcta';
  const fallada = revision && marca === 'fallo';
  const apagada = revision && !acertada && !fallada;

  return (
    <button
      type="button"
      // `aria-disabled` y no `disabled`: un botón deshabilitado sale del orden
      // de tabulación, y en revisión el usuario de lector de pantalla tiene que
      // poder recorrer las opciones para leer cuál era la correcta. El clic se
      // ignora en el handler.
      aria-disabled={puedeElegir ? undefined : true}
      aria-pressed={elegida}
      onClick={() => {
        if (puedeElegir) onElegir();
      }}
      className={cn(
        'flex w-full min-h-[52px] items-center gap-3 rounded-md border px-3 py-2.5 text-left',
        'text-[0.95rem] leading-[1.4] transition-colors duration-150 ease-out',
        elegida && !revision && 'border-primary bg-primary/10',
        !elegida && !revision && 'border-border bg-card',
        // El hover solo donde hay algo que elegir.
        puedeElegir && !elegida && 'hover:bg-accent hover:text-accent-foreground',
        acertada && 'border-exito bg-exito/12',
        fallada && 'border-destructive bg-destructive/12',
        // Se apaga lo que no es noticia, pero se apaga POCO: en `bloqueado` y en
        // revisión el usuario tiene que poder releer su respuesta (§13).
        apagada && 'border-border opacity-80',
      )}
    >
      <span
        className={cn(
          'grid size-7 shrink-0 place-items-center font-mono text-xs font-semibold',
          varias ? 'rounded' : 'rounded-md',
          elegida && !revision
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground',
          acertada && 'bg-exito text-exito-foreground',
          fallada && 'bg-destructive text-destructive-foreground',
        )}
        aria-hidden="true"
      >
        {acertada ? <Check className="size-4" /> : fallada ? <X className="size-4" /> : rotulo}
      </span>

      <span className="min-w-0 flex-1">
        {texto}
        {/* Portador no cromático para lector de pantalla. El icono cubre al
            usuario vidente; este texto cubre a quien no ve el color ni el icono. */}
        {revision ? (
          <span className="sr-only">
            {acertada && elegida
              ? '. Correcta, y es la que elegiste.'
              : acertada
                ? '. Esta era la correcta.'
                : fallada
                  ? '. Incorrecta, y es la que elegiste.'
                  : ''}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/**
 * Atajo de teclado 1–N sobre un grupo de opciones.
 *
 * El teclado es AYUDA SECUNDARIA, no la vía de uso: la acción primaria son los
 * botones de 52 px. Es la misma corrección que se aplicó al mazo de tarjetas —
 * esta app se estudia desde el celular, que es restricción dura del brief.
 *
 * Escucha en `window` y no en un contenedor, por el fallo que el mazo tenía: un
 * `<div onKeyDown>` sin `tabIndex` no recibe teclado, así que las teclas solo
 * respondían mientras el foco siguiera dentro por casualidad.
 *
 * No toca `Enter`: avanzar es responsabilidad del controlador de sesión, y la
 * activación del botón enfocado ya es nativa.
 */
export function useAtajoNumerico(
  activo: boolean,
  cantidad: number,
  onElegir: (indice: number) => void,
) {
  useEffect(() => {
    if (!activo) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;

      // Un atajo global que se coma el «1» de un campo de texto es un bug
      // carísimo de encontrar. El ítem de cálculo tiene uno.
      const foco = document.activeElement;
      if (
        foco instanceof HTMLElement &&
        (foco.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(foco.tagName))
      ) {
        return;
      }

      const indice = Number(evento.key) - 1;
      if (!Number.isInteger(indice) || indice < 0 || indice >= cantidad) return;

      evento.preventDefault();
      onElegir(indice);
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [activo, cantidad, onElegir]);
}
