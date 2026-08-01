// src/app/glosario/page.tsx — Server Component.
//
// Los 123 términos del glosario, buscables. Es la ruta de consulta: se llega
// desde un ítem que usó una palabra que no se recuerda, no desde la barra.
//
// ══ POR QUÉ NO HAY ÍNDICE DE BÚSQUEDA (§2.2) ══
// Algolia o Meilisearch para 123 cadenas es infraestructura absurda: no
// funcionaría sin conexión, costaría una clave de API y añadiría una
// dependencia con su propia migración. `String.normalize('NFD')` más `includes`
// resuelve el caso, corre en el navegador y no cuesta nada.
//
// ══ FRONTERA (ADR-010) ══
// El glosario entero SÍ viaja al cliente, y es correcto: el buscador filtra en
// vivo y hacerlo en el servidor exigiría una petición por tecla, que es lo
// contrario de una app offline. Son ~40 kB de texto, el precio de esta ruta y
// solo de esta ruta. Se le añade el título del módulo para poder enlazar sin
// arrastrar `estructura.ts` completo.

import type { Metadata } from 'next';
import { GLOSARIO } from '@/content/glosario';
import { MODULOS_POR_SLUG } from '@/content/estructura';
import { BuscadorGlosario } from '@/components/glosario/buscador-glosario';

export const metadata: Metadata = {
  title: 'Glosario',
  robots: { index: false },
};

export default function PaginaGlosario() {
  const entradas = GLOSARIO.map((e) => {
    const modulo = MODULOS_POR_SLUG.get(e.modulo);
    return {
      termino: e.termino,
      definicion: e.definicion,
      sinonimos: e.sinonimos ?? [],
      modulo: e.modulo,
      tituloModulo: modulo?.titulo ?? e.modulo,
      bloque: modulo?.bloque ?? 'A',
      publicado: modulo?.estadoContenido === 'completo',
    };
  }).sort((a, b) => a.termino.localeCompare(b.termino, 'es'));

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Glosario</h1>
        <p className="text-muted-foreground">
          Los {entradas.length} conceptos clave de las cuatro cartillas, con la definición que el
          examen pregunta y el módulo donde se explica.
        </p>
      </header>

      <BuscadorGlosario entradas={entradas} />
    </div>
  );
}
