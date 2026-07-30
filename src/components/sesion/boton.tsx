// src/components/sesion/boton.tsx — pieza compartida de la sesión.
//
// Sin directiva de cliente: lo importa un Client Component, así que se compila
// para el cliente igual. No es un alta a la lista de §10.3.
//
// Por qué NO es el `Button` de shadcn: sus variantes traen `transition-all`,
// que DISENO.md §5.2 prohíbe (anima propiedades de layout y produce tirones en
// el gama media que es el dispositivo objetivo). Es la misma decisión que ya
// tomaron la insignia del Paso 6 y el mazo de tarjetas del Paso 8.
//
// DEUDA, dicha en voz alta: este es el SEGUNDO botón propio del proyecto — el
// otro vive dentro de `mazo-tarjetas.tsx`. Dos copias de veinte líneas se
// aguantan; tres no. Cuando el Paso 11 necesite la tercera, toca extraerlo a un
// único componente compartido y hacer que el mazo lo use.

import { cn } from '@/lib/utils';

export type VarianteBoton = 'principal' | 'contorno' | 'silencioso';

interface Props {
  ref?: React.Ref<HTMLButtonElement>;
  variante?: VarianteBoton;
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  inactivo?: boolean;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

export function Boton({
  ref,
  variante = 'principal',
  className,
  children,
  onClick,
  inactivo = false,
  ...aria
}: Props) {
  return (
    <button
      ref={ref}
      type="button"
      // `aria-disabled` + handler con guarda, no `disabled`: un botón
      // deshabilitado sale del orden de tabulación y desaparece para quien
      // navega con teclado, que se queda sin saber que la acción existe.
      aria-disabled={inactivo ? true : undefined}
      onClick={() => {
        if (!inactivo) onClick();
      }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium',
        'transition-colors duration-150 ease-out',
        variante === 'principal' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variante === 'contorno' &&
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        variante === 'silencioso' && 'text-foreground hover:bg-accent hover:text-accent-foreground',
        inactivo && 'opacity-50',
        className,
      )}
      {...aria}
    >
      {children}
    </button>
  );
}
