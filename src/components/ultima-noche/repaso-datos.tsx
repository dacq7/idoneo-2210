'use client';

// src/components/ultima-noche/repaso-datos.tsx — Client Component.
//
// El modo «repasar uno a uno»: un dato por pantalla, valor oculto, y dos
// botones para declarar si se sabía.
//
// ══ EL CONTADOR NO SE PERSISTE, Y ESO ES LA DECISIÓN ══
// §15.2: esta pantalla no registra progreso ni alimenta el SRS. El contador
// vive en `useState` y muere al salir. Persistirlo sería empezar a construir un
// segundo sistema de repaso al lado del de `lib/srs.ts`, con sus propias reglas
// y sin sus tests, la noche antes del examen.
//
// ══ EL ORDEN ES EL DEL CATÁLOGO, NO ALEATORIO ══
// Barajar exigiría una semilla —§22 regla 5 prohíbe `Math.random()`— y no
// aporta: los datos ya vienen agrupados por categoría, y repasarlos en bloque
// temático es mejor que saltar de biomarcadores a estadística.

import { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DatoVista } from './mazo-datos-duros';

export function RepasoDatos({ datos, onSalir }: { datos: DatoVista[]; onSalir: () => void }) {
  const [indice, setIndice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [sabidos, setSabidos] = useState(0);
  const [fallados, setFallados] = useState(0);

  if (datos.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-dashed border-border p-6 text-center">
        <p className="font-medium">No hay datos en esta categoría</p>
        <Button type="button" variant="outline" onClick={onSalir}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  const terminado = indice >= datos.length;

  if (terminado) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-titulo text-xl font-semibold">Repaso terminado</h2>
        <p className="text-muted-foreground">
          Sabías {sabidos} de {datos.length}. {fallados > 0
            ? `Los ${fallados} que no, vuelve a pasarlos antes de dormir.`
            : 'Los tenías todos.'}
        </p>
        {/* Se dice otra vez aquí, que es donde alguien esperaría que se hubiera
            guardado: el resultado no se registra en ninguna parte. */}
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Este recuento no se guarda: al salir de la pantalla desaparece.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              setIndice(0);
              setVisible(false);
              setSabidos(0);
              setFallados(0);
            }}
          >
            Repasar otra vez
          </Button>
          <Button type="button" variant="outline" onClick={onSalir}>
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  const dato = datos[indice];

  const responder = (sabia: boolean) => {
    if (sabia) setSabidos((n) => n + 1);
    else setFallados((n) => n + 1);
    setVisible(false);
    setIndice((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onSalir}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Salir
        </Button>
        <Progress value={(indice / datos.length) * 100} className="grow" />
        <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-muted-foreground">
          {indice + 1}/{datos.length}
        </span>
      </div>

      <div className="min-h-[13rem] space-y-4 rounded-lg border border-border bg-card p-5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {dato.categoria}
        </p>
        <p className="font-titulo text-xl font-semibold">{dato.concepto}</p>

        {visible ? (
          // aria-live: al descubrir el valor, el lector lo anuncia sin que haya
          // que buscarlo. `break-words` para los valores largos de DD-067/070.
          <p aria-live="polite" className="break-words font-mono text-[0.9375rem] leading-[1.55]">
            {dato.valor}
          </p>
        ) : (
          <Button type="button" variant="outline" className="w-full" onClick={() => setVisible(true)}>
            Ver el valor
          </Button>
        )}
      </div>

      {visible ? (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={() => responder(false)}>
            <X className="size-4" aria-hidden="true" />
            No lo sabía
          </Button>
          <Button type="button" onClick={() => responder(true)}>
            <Check className="size-4" aria-hidden="true" />
            Lo sabía
          </Button>
        </div>
      ) : null}
    </div>
  );
}
