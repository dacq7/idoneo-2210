// src/components/inicio/enlace-destino.tsx — Server Component: no lleva
// directiva de cliente y no la necesita. Se renderiza dentro de árboles cliente
// (`panel-inicio`) y de árboles servidor por igual.
//
// ══ POR QUÉ TIENE ARCHIVO PROPIO ══
// Nació como auxiliar local de `panel-inicio.tsx`. Al añadir la sección de
// consulta rápida del Paso 18 pasó a tener un segundo consumidor, y el criterio
// que fijó el Paso 12 dice qué hacer entonces: *un componente con consumidor
// fuera de su archivo es público y le toca archivo propio; uno que solo usa el
// archivo que lo define es un auxiliar y puede convivir.*
//
// Duplicarlo habría sido peor que moverlo: el `group-hover` de abajo es la
// corrección de A-41, y una copia se queda sin ella en cuanto alguien la toca.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function EnlaceDestino({
  href,
  titulo,
  detalle,
}: {
  href: string;
  titulo: string;
  detalle: string;
}) {
  return (
    // [A-41 · 1.4.3] `group` + `group-hover` en el detalle. El `hover:text-foreground`
    // del enlace no llegaba a este `<span>`, que declara su propio
    // `text-muted-foreground` y gana sobre el color heredado: sobre `--accent`
    // en tema oscuro el par mide **4,44:1** y se queda corto de AA.
    //
    // Es el mismo fallo que `nav-inferior.tsx` ya documentó y esquivó; allí
    // bastaba con subir el color del enlace porque no había hijo con color
    // propio.
    <Link
      href={href}
      className="group flex min-h-11 items-center gap-3 px-3 py-3 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
    >
      <span className="min-w-0 grow space-y-0.5">
        <span className="block font-medium">{titulo}</span>
        <span className="block text-[0.8125rem] text-muted-foreground group-hover:text-foreground">
          {detalle}
        </span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}
