'use client';

// src/components/layout/nav-inferior.tsx
// Barra de navegación de móvil: h-16, cinco destinos, alcanzable con el pulgar.
// Desaparece desde lg, donde manda barra-lateral.tsx.
//
// El destino activo NO se marca con una píldora de fondo (prohibido en
// DISENO.md §4.5) sino con una lengüeta de 4px del color del bloque en
// contexto. Y el color nunca va solo: el activo lleva además aria-current,
// texto en foreground y peso 600.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bloqueDeRuta, claseAcentoBloque, cn } from '@/lib/utils';
import { DESTINOS, destinoActivo } from './destinos';

export function NavInferior() {
  const pathname = usePathname();
  const acento = claseAcentoBloque(bloqueDeRuta(pathname));

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex items-stretch">
        {DESTINOS.map(({ href, etiqueta, titulo, icono: Icono }) => {
          const activo = destinoActivo(href, pathname);
          return (
            // min-w-0 es lo que permite que las cinco celdas encojan: un ítem
            // flex conserva min-width:auto y no baja de su min-content, así que
            // sin esto "Simulacros" (63px) empuja a Ajustes fuera de pantalla al
            // 200 % de zoom — con scrollWidth intacto, o sea sin scroll con el
            // que recuperarlo. Ver A-01 en ACCESIBILIDAD.md.
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={activo ? 'page' : undefined}
                aria-label={etiqueta === titulo ? undefined : titulo}
                className={cn(
                  'relative flex h-16 flex-col items-center justify-center gap-1 transition-colors duration-150 ease-out',
                  // El contorno de foco lo pinta globals.css; aquí solo se mete
                  // hacia dentro, porque 2px por fuera se recortan contra el
                  // borde de la barra fija.
                  'focus-visible:-outline-offset-2',
                  // hover:text-foreground y no dejar el texto en
                  // muted-foreground: sobre bg-accent en tema oscuro ese par
                  // mide 4.47:1 y se queda corto de AA.
                  'hover:bg-accent hover:text-foreground',
                  activo ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 top-0 h-1 rounded-none',
                    activo ? acento : 'bg-transparent',
                  )}
                />
                <Icono className="size-5" aria-hidden="true" />
                {/* Por debajo de 22rem la etiqueta pasa a sr-only en vez de
                    recortarse: el icono queda centrado y el nombre accesible se
                    conserva íntegro para el lector de pantalla. */}
                <span className="max-w-full truncate px-0.5 text-[0.6875rem] leading-none tracking-[0.01em] max-[22rem]:sr-only">
                  {etiqueta}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
