// src/components/informe/dominio-modulo.tsx
//
// Sin directiva de cliente: lo importa `vista-informe.tsx`. No es un alta a §10.3.
//
// Dominio por módulo, de peor a mejor. **No es una gráfica y no debe serlo**:
// son hasta 29 categorías, y 29 barras a 375 px no se leen. Una lista ordenada
// da el mismo dato, se lee de un vistazo y el orden ya es el orden en que hay
// que actuar.
//
// Se distingue del top-5 de `TemasPrioritarios` en que aquí está TODO lo que el
// intento evaluó, incluidos los módulos con 1 o 2 ítems que el top-5 descarta
// por falta de evidencia. Aquí se pueden mostrar porque no se pide actuar sobre
// ellos: se informa, y la cifra de ítems evaluados va al lado para que el
// usuario pese la muestra él mismo.

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Fila {
  modulo: string;
  titulo: string;
  porcentaje: number;
  total: number;
}

export function DominioPorModulo({ modulos }: { modulos: readonly Fila[] }) {
  if (modulos.length === 0) return null;

  return (
    <section aria-labelledby="titulo-modulos" className="space-y-3">
      <h2 id="titulo-modulos">Dominio por módulo</h2>
      <p className="text-muted-foreground">
        Todo lo que evaluó este intento, de peor a mejor. La cifra entre paréntesis son las
        preguntas que salieron de ese módulo: con dos o tres, tómatelo como un indicio.
      </p>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {modulos.map((m) => (
          <li key={m.modulo}>
            <Link
              href={`/modulos/${m.modulo}`}
              className="flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground"
            >
              <span className="min-w-0 grow text-[0.9375rem]">{m.titulo}</span>
              <span className="shrink-0 text-[0.8125rem] text-muted-foreground">
                ({m.total})
              </span>
              <span
                className={cn(
                  'w-12 shrink-0 text-right font-mono font-semibold tabular-nums',
                  // El umbral de dominio del proyecto son 80 (UMBRAL_DOMINIO).
                  // El color acompaña a la cifra, que es la que informa.
                  m.porcentaje >= 80 && 'text-exito',
                  m.porcentaje < 50 && 'text-destructive',
                )}
              >
                {m.porcentaje}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
