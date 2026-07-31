// src/app/progreso/page.tsx — Server Component.
//
// El historial: módulos dominados e intentos, cada uno con enlace a su informe.
//
// Frontera (ADR-010): se proyectan tres campos por módulo. Todo lo que se
// muestra sale de `localStorage`, así que el trabajo real es del cliente; la
// página aporta el catálogo y el encabezado.

import type { Metadata } from 'next';
import { MODULOS } from '@/content/estructura';
import { PanelProgreso } from '@/components/progreso/panel-progreso';

export const metadata: Metadata = {
  title: 'Tu progreso',
  robots: { index: false },
};

export default function PaginaProgreso() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Tu progreso</h1>
        <p className="text-muted-foreground">
          Lo que llevas hecho y cómo te ha ido. Cada intento guarda su informe completo.
        </p>
      </header>

      <PanelProgreso
        modulos={MODULOS.map((m) => ({ slug: m.slug, titulo: m.titulo, bloque: m.bloque }))}
      />
    </div>
  );
}
