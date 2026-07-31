'use client';

// src/components/herramientas/panel-fc-zonas.tsx — Client Component.
//
// Pestaña 1: FCmáx por las cinco fórmulas y las cuatro zonas en lpm.
//
// ══ LA POBLACIÓN DE LA FÓRMULA SE VE SIEMPRE ══
// No está escondida en un tooltip: aparece bajo el selector, en texto. Elegir
// Fox para una mujer de 55 años es el error que el módulo C2 enseña a evitar, y
// una calculadora que lo permite en silencio lo enseña al revés.

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  AUTORES_FCMAX,
  aNumero,
  FORMULAS_FCMAX,
  redondear,
  zonasEnLpm,
  type AutorFCmax,
} from '@/lib/calculos';
import { CampoNumero } from './campo-numero';
import { Resultado } from './resultado';

export function PanelFcZonas() {
  const [edad, setEdad] = useState('');
  const [autor, setAutor] = useState<AutorFCmax>('tanaka');

  const formula = FORMULAS_FCMAX[autor];
  const edadNum = aNumero(edad);
  // Se exige una edad plausible: con 0 o 300 la fórmula devuelve un número y
  // pintarlo sería peor que no pintar nada.
  const valida = edadNum !== null && edadNum >= 5 && edadNum <= 100;
  const fcMax = valida ? redondear(formula.calcular(edadNum)) : null;
  const zonas = fcMax !== null ? zonasEnLpm(fcMax) : [];

  return (
    <div className="space-y-4">
      <CampoNumero
        etiqueta="Edad"
        valor={edad}
        onCambio={setEdad}
        unidad="años"
        placeholder="40"
        ayuda={
          edadNum !== null && !valida ? 'Introduce una edad entre 5 y 100 años.' : undefined
        }
      />

      <div className="space-y-1.5">
        <Label htmlFor="formula-fcmax" className="text-[0.8125rem]">
          Fórmula
        </Label>
        <select
          id="formula-fcmax"
          value={autor}
          onChange={(e) => setAutor(e.target.value as AutorFCmax)}
          // [A-49] La población es el dato que evita elegir Fox para una mujer
          // de 55 años, que es el error que el módulo C2 enseña a evitar. Sin
          // este describedby, era lo único de la pantalla que no llegaba a
          // quien usa lector: se veía y no se anunciaba.
          aria-describedby="poblacion-fcmax"
          className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-base md:text-sm dark:bg-input/30"
        >
          {AUTORES_FCMAX.map((clave) => (
            <option key={clave} value={clave}>
              {FORMULAS_FCMAX[clave].etiqueta}
            </option>
          ))}
        </select>
        <p id="poblacion-fcmax" className="text-[0.75rem] leading-[1.4] text-muted-foreground">
          Validada en: {formula.poblacion}.
        </p>
      </div>

      <Resultado
        rotulo="Frecuencia cardíaca máxima"
        valor={fcMax !== null ? String(fcMax) : null}
        unidad="lpm"
        formula={
          valida
            ? `${formula.etiqueta}: ${textoFormula(autor, edadNum)} = ${fcMax} lpm`
            : `${formula.etiqueta}: ${textoFormula(autor, null)}`
        }
        modulo="c2-cardiovascular"
        tituloModulo="Sistema cardiovascular"
        nota="Es una estimación de población, no una medición. La FCmáx real solo se conoce con una prueba de esfuerzo, y no cambia con el entrenamiento."
      />

      {fcMax !== null ? (
        <section aria-labelledby="zonas-titulo" className="space-y-2">
          <h2 id="zonas-titulo" className="text-[0.9375rem] font-semibold">
            Tus zonas en latidos por minuto
          </h2>
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {zonas.map((z) => (
              <li key={z.zona} className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                <span className="min-w-0">
                  <span className="font-mono text-[0.8125rem] font-semibold">{z.zona}</span>
                  <span className="ml-2 text-[0.8125rem] text-muted-foreground">{z.etiqueta}</span>
                </span>
                <span className="shrink-0 font-mono text-[0.875rem] tabular-nums">
                  {z.desde === 0 ? `hasta ${z.hasta}` : `${z.desde}–${z.hasta}`}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[0.75rem] leading-[1.45] text-muted-foreground">
            R2 aparece como 80–90 % porque estos son porcentajes de la FCmáx. Su otro rango
            conocido, 75–85 %, está expresado en porcentaje del VO₂máx: describen la misma zona en
            escalas distintas.
          </p>
        </section>
      ) : null}
    </div>
  );
}

/** La fórmula con el número del usuario ya sustituido, o con la incógnita. */
function textoFormula(autor: AutorFCmax, edad: number | null): string {
  const e = edad === null ? 'edad' : String(edad);
  switch (autor) {
    case 'fox':
      return `220 − ${e}`;
    case 'astrand':
      return `216,6 − (0,84 × ${e})`;
    case 'tanaka':
      return `208 − (0,7 × ${e})`;
    case 'gellish':
      return `207 − (0,7 × ${e})`;
    case 'gulati':
      return `206 − (0,88 × ${e})`;
  }
}
