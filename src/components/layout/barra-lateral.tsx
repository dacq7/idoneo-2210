'use client';

// src/components/layout/barra-lateral.tsx
// Navegación de escritorio: 240px, visible desde lg. Los mismos cinco destinos
// que la barra inferior, con el mismo nombre y el mismo orden — una acción no
// cambia de nombre según el tamaño de pantalla.
//
// Solo una de las dos barras existe a la vez: la otra está en display:none, así
// que el lector de pantalla ve una sola «Navegación principal».

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bloqueDeRuta, claseAcentoBloque, cn } from '@/lib/utils';
import { DESTINOS, destinoActivo } from './destinos';

export function BarraLateral() {
  const pathname = usePathname();
  const acento = claseAcentoBloque(bloqueDeRuta(pathname));

  return (
    // --alto-encabezado lo declara globals.css: es lo que mide el encabezado
    // pegajoso, y la barra tiene que empezar justo debajo para no quedar tapada.
    <aside className="hidden w-60 shrink-0 border-r border-border lg:sticky lg:top-[var(--alto-encabezado)] lg:block lg:h-[calc(100dvh-var(--alto-encabezado))]">
      <nav aria-label="Navegación principal" className="p-3">
        <ul className="space-y-1">
          {DESTINOS.map(({ href, etiqueta, titulo, icono: Icono }) => {
            const activo = destinoActivo(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={activo ? 'page' : undefined}
                  aria-label={etiqueta === titulo ? undefined : titulo}
                  className={cn(
                    'relative flex items-center gap-3 rounded-md py-2 pl-4 pr-3 transition-colors duration-150 ease-out',
                    'hover:bg-accent hover:text-foreground',
                    activo
                      ? 'bg-accent/60 font-semibold text-foreground'
                      : 'font-medium text-muted-foreground',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-y-1 left-0 w-1 rounded-none',
                      activo ? acento : 'bg-transparent',
                    )}
                  />
                  <Icono className="size-5 shrink-0" aria-hidden="true" />
                  <span>{etiqueta}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
