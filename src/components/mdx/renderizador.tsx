// src/components/mdx/renderizador.tsx — Server Component async. SIN "use client".
//
// §12.1 literal. `next-mdx-remote/rsc` compila el MDX en el servidor: nada de
// esto —ni el compilador, ni la fuente, ni los cinco componentes— llega al
// bundle del navegador.
//
// `remark-gfm` no es opcional: las cartillas son tablas, y sin GFM no hay tabla.

import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { componentesMdx } from './componentes';

export async function RenderizadorMdx({ fuente }: { fuente: string }) {
  return (
    <div className="prose-idoneo">
      <MDXRemote
        source={fuente}
        components={componentesMdx}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
