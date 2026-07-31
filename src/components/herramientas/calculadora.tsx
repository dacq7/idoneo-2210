'use client';

// src/components/herramientas/calculadora.tsx — Client Component (§10.3).
//
// El armazón de las cinco pestañas. Cada panel vive en su archivo: son cinco
// formularios independientes, sin estado compartido, y juntarlos daría un
// archivo de ~500 líneas que incumple la regla 1 de §21 sin ganar nada.
//
// ══ POR QUÉ NO GUARDA NADA ══
// La calculadora **no toca `localStorage`**. No es un olvido: es una
// herramienta de consulta, y persistir los últimos valores tecleados haría que
// el segundo uso arrancara con los datos de otro deportista. Cada pestaña
// empieza vacía, siempre.
//
// ══ POR QUÉ NO ES UNA RUTA POR PESTAÑA ══
// Cinco rutas darían enlaces profundos y perderían el punto de la herramienta,
// que es tenerlo todo a un toque durante una sesión. Y a 375 px el riel de
// pestañas cabe con scroll horizontal, que es el patrón que el proyecto ya usa
// en el panel de navegación del simulacro.

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PanelAntropometria } from './panel-antropometria';
import { PanelCardio } from './panel-cardio';
import { PanelCarga } from './panel-carga';
import { PanelFcZonas } from './panel-fc-zonas';
import { PanelMet } from './panel-met';

const PESTANAS = [
  { valor: 'fc', etiqueta: 'FC y zonas' },
  { valor: 'cardio', etiqueta: 'Cardio' },
  { valor: 'carga', etiqueta: 'Carga' },
  { valor: 'met', etiqueta: 'MET y VO₂' },
  { valor: 'antropometria', etiqueta: 'Antropometría' },
] as const;

export function Calculadora() {
  return (
    <Tabs defaultValue="fc" className="space-y-5">
      {/* El riel se sale del contenedor a 375 px y desplaza en horizontal.
          `-mx-4 px-4` hace que el primer y el último elemento no queden
          pegados al borde cuando hay scroll. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList className="w-max">
          {PESTANAS.map((p) => (
            <TabsTrigger key={p.valor} value={p.valor} className="min-h-11 shrink-0">
              {p.etiqueta}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="fc">
        <PanelFcZonas />
      </TabsContent>
      <TabsContent value="cardio">
        <PanelCardio />
      </TabsContent>
      <TabsContent value="carga">
        <PanelCarga />
      </TabsContent>
      <TabsContent value="met">
        <PanelMet />
      </TabsContent>
      <TabsContent value="antropometria">
        <PanelAntropometria />
      </TabsContent>
    </Tabs>
  );
}
