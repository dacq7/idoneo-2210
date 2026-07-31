// src/app/simulacros/final/page.tsx — Server Component.
//
// El simulacro final: 100 ítems en 120 minutos con la distribución del examen
// real, auto-envío al llegar a cero.
//
// Frontera (ADR-010): la página resuelve en el SERVIDOR el blueprint, la lista
// de slugs y el **censo** —tres campos por módulo— y los pasa por prop. El
// banco NO viaja por prop: lo carga el controlador con `import()` cuando el
// usuario pulsa «Empezar». Con 29 módulos serían ~750 ítems en la carga útil
// RSC de una ruta que se abre para decidir, no para responder.
//
// NO monta `RotuloBloque`: DISENO.md §2.4 lo reserva a las pantallas con
// **exactamente un** bloque en contexto, y el final los cruza los cuatro.

import type { Metadata } from 'next';
import { FINAL } from '@/content/blueprint-examen';
import { MODULOS } from '@/content/estructura';
import { ControladorSimulacro } from '@/components/sesion/controlador-simulacro';
import { censarModulos, moduloAlternativo } from '@/lib/censo';

export const metadata: Metadata = {
  title: 'Simulacro final',
  // La app es privada de facto: solo la portada se indexa (§10.1).
  robots: { index: false },
};

export default async function PaginaSimulacroFinal() {
  const slugs = MODULOS.map((m) => m.slug);
  const [censo, alternativa] = await Promise.all([censarModulos(slugs), moduloAlternativo()]);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Simulacro final</h1>
        <p className="text-muted-foreground">
          Las mismas condiciones del examen: 100 ítems, 120 minutos y la distribución real por
          bloques. Se envía solo al llegar a cero, con lo que hayas respondido.
        </p>
      </header>

      <ControladorSimulacro
        blueprint={FINAL}
        censo={censo}
        slugs={slugs}
        tipo="final"
        ambito="global"
        bloque={null}
        alternativa={alternativa}
        volver={{ href: '/simulacros', texto: 'Volver a los simulacros' }}
      />
    </div>
  );
}
