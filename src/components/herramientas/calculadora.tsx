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
        {/* [A-51] `h-auto` en la lista: por defecto es `h-9` (36 px) y el
            trigger de 44 sobresalía, así que el envoltorio lo recortaba 8 px
            y con ellos el contorno de foco, que quedaba en dos barras
            verticales. Medido: clientHeight 36 contra scrollHeight 44. Con la
            lista en auto, el alto pulsable son los 44 de verdad. El `h-auto`
            va con el MISMO prefijo de variante que la clase base
            (`group-data-[orientation=horizontal]/tabs:`): sin él, tailwind-merge
            no los considera la misma propiedad y el `h-9` seguía ganando —lo
            comprobé, seguía midiendo 36—.
            [A-45] `text-muted-foreground` en vez del `text-foreground/60` que
            trae shadcn: ese par mide 4,40:1 sobre `--muted` en tema claro y se
            queda corto de AA. En oscuro pasaba solo porque shadcn añade su
            propia regla `dark:`. El par que se usa aquí ya está medido en el
            proyecto a 4,93 y 5,04. */}
        <TabsList className="group-data-[orientation=horizontal]/tabs:h-auto w-max">
          {PESTANAS.map((p) => (
            <TabsTrigger
              key={p.valor}
              value={p.valor}
              className="h-11 shrink-0 text-muted-foreground data-[state=active]:text-foreground"
            >
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
