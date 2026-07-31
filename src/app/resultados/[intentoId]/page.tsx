// src/app/resultados/[intentoId]/page.tsx — Server Component.
//
// El informe de un intento. La página aporta lo único que el servidor sabe —el
// catálogo de módulos y bloques— y delega el resto: **el intento vive en
// `localStorage`**, así que solo el cliente puede saber si existe.
//
// Frontera (ADR-010): se proyecta a `ModuloDelInforme` (slug, título, bloque) y
// `BloqueDelInforme` (id, título). Pasar `MODULOS` entero metería `objetivos`,
// `conceptosClave`, `subtitulo` y `prerequisitos` de los 29 módulos en la carga
// útil RSC de una pantalla que solo pinta títulos.
//
// NO monta `RotuloBloque`: DISENO.md §2.4 lo reserva a las pantallas con
// exactamente un bloque en contexto, y un informe puede cruzar los cuatro. El
// bloque de cada dato va escrito en su propia fila.
//
// `dynamicParams` no hace falta: sin `generateStaticParams` la ruta se sirve
// bajo demanda, que es lo correcto para un id que solo existe en el navegador.

import type { Metadata } from 'next';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { VistaInforme } from '@/components/informe/vista-informe';

export const metadata: Metadata = {
  title: 'Informe del intento',
  // La app es privada de facto: solo la portada se indexa (§10.1).
  robots: { index: false },
};

interface Props {
  /** Next 15: los params son una promesa. Ver §10.1. */
  params: Promise<{ intentoId: string }>;
}

export default async function PaginaResultados({ params }: Props) {
  const { intentoId } = await params;

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Tu informe</h1>
        <p className="text-muted-foreground">
          Qué sabes, qué no y qué estudiar hoy. Los porcentajes salen de este intento; la revisión
          de abajo dice por qué falló cada pregunta.
        </p>
      </header>

      <VistaInforme
        intentoId={intentoId}
        modulos={MODULOS.map((m) => ({ slug: m.slug, titulo: m.titulo, bloque: m.bloque }))}
        bloques={BLOQUES.map((b) => ({ id: b.id, titulo: b.titulo }))}
      />
    </div>
  );
}
