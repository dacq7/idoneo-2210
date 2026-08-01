'use client';

// src/components/herramientas/panel-cardio.tsx — Client Component.
//
// Pestaña 2: pulso a lpm, frecuencia de reserva con Karvonen, y gasto cardíaco.
//
// ══ KARVONEN Y EL PORCENTAJE SIMPLE, JUNTOS ══
// El panel enseña los DOS resultados a la vez, y esa es su razón de ser. El
// error que el ítem C5-011 penaliza es aplicar el porcentaje sobre la reserva
// creyendo que se aplica sobre la máxima; verlos uno al lado del otro con los
// mismos datos hace visible que no son lo mismo.

import { useState } from 'react';
import { aNumero, gastoCardiaco, karvonen, pulsoALpm, redondear } from '@/lib/calculos';
import { Label } from '@/components/ui/label';
import { CampoNumero } from './campo-numero';
import { Resultado } from './resultado';

const VENTANAS = [6, 10, 15, 30] as const;
type Ventana = (typeof VENTANAS)[number];

export function PanelCardio() {
  const [latidos, setLatidos] = useState('');
  const [ventana, setVentana] = useState<Ventana>(15);
  const [fcMax, setFcMax] = useState('');
  const [fcReposo, setFcReposo] = useState('');
  const [intensidad, setIntensidad] = useState('70');
  const [volumen, setVolumen] = useState('');

  const latidosNum = aNumero(latidos);
  const lpm = latidosNum !== null && latidosNum > 0 ? redondear(pulsoALpm(latidosNum, ventana), 0) : null;

  const maxNum = aNumero(fcMax);
  const reposoNum = aNumero(fcReposo);
  const intNum = aNumero(intensidad);
  // Karvonen exige que la reposo sea menor que la máxima: al revés devuelve un
  // número negativo con toda naturalidad, y eso no es un objetivo de nada.
  const karvonenValido =
    maxNum !== null &&
    reposoNum !== null &&
    intNum !== null &&
    maxNum > reposoNum &&
    intNum > 0 &&
    intNum <= 100;
  const objetivo = karvonenValido ? redondear(karvonen(maxNum, reposoNum, intNum / 100), 0) : null;
  const porcentajeSimple = maxNum !== null && intNum !== null ? redondear(maxNum * (intNum / 100), 0) : null;

  const volNum = aNumero(volumen);
  const gasto =
    lpmValido(maxNum) && volNum !== null && volNum > 0
      ? redondear(gastoCardiaco(maxNum, volNum), 2)
      : null;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-[0.9375rem] font-semibold">Tomar el pulso</h2>
        <CampoNumero
          etiqueta="Latidos contados"
          valor={latidos}
          onCambio={setLatidos}
          unidad="latidos"
          placeholder="30"
        />
        <div className="space-y-1.5">
          <Label htmlFor="ventana-pulso" className="text-[0.8125rem]">
            Durante
          </Label>
          <select
            id="ventana-pulso"
            value={ventana}
            onChange={(e) => setVentana(Number(e.target.value) as Ventana)}
            className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-base md:text-sm dark:bg-input/30"
          >
            {VENTANAS.map((v) => (
              <option key={v} value={v}>
                {v} segundos
              </option>
            ))}
          </select>
        </div>
        <Resultado
          rotulo="Frecuencia cardíaca"
          valor={lpm !== null ? String(lpm) : null}
          unidad="lpm"
          formula={`${latidosNum ?? 'latidos'} × (60 / ${ventana}) = ${lpm ?? '—'} lpm`}
          modulo="c2-cardiovascular"
          tituloModulo="Sistema cardiovascular"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-[0.9375rem] font-semibold">Intensidad objetivo</h2>
        <CampoNumero etiqueta="FC máxima" valor={fcMax} onCambio={setFcMax} unidad="lpm" placeholder="180" />
        <CampoNumero
          etiqueta="FC en reposo"
          valor={fcReposo}
          onCambio={setFcReposo}
          unidad="lpm"
          placeholder="60"
          ayuda={
            maxNum !== null && reposoNum !== null && reposoNum >= maxNum
              ? 'La frecuencia en reposo tiene que ser menor que la máxima.'
              : 'Tomada al despertar, antes de levantarte.'
          }
        />
        <CampoNumero
          etiqueta="Intensidad"
          valor={intensidad}
          onCambio={setIntensidad}
          unidad="%"
          placeholder="70"
        />

        <Resultado
          rotulo="Método de Karvonen"
          valor={objetivo !== null ? String(objetivo) : null}
          unidad="lpm"
          formula={
            karvonenValido
              ? `${reposoNum} + ((${maxNum} − ${reposoNum}) × ${redondear(intNum / 100, 2)}) = ${objetivo} lpm`
              : 'FCreposo + ((FCmáx − FCreposo) × intensidad)'
          }
          modulo="c2-cardiovascular"
          tituloModulo="Sistema cardiovascular"
          nota={
            objetivo !== null && porcentajeSimple !== null
              ? `El porcentaje simple de la FCmáx daría ${porcentajeSimple} lpm. No son lo mismo: Karvonen aplica la intensidad sobre la frecuencia de RESERVA y da valores más altos. Cuando un enunciado dice «% de la FCmáx», pide el porcentaje simple —los ${porcentajeSimple} lpm—, no Karvonen.`
              : undefined
          }
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-[0.9375rem] font-semibold">Gasto cardíaco</h2>
        <CampoNumero
          etiqueta="Volumen sistólico"
          valor={volumen}
          onCambio={setVolumen}
          unidad="mL"
          placeholder="70"
          ayuda="Usa la FC máxima de arriba como frecuencia."
        />
        <Resultado
          rotulo="Gasto cardíaco"
          valor={gasto !== null ? gasto.toFixed(2).replace('.', ',') : null}
          unidad="L/min"
          formula={
            gasto !== null
              ? `(${maxNum} × ${volNum}) / 1000 = ${gasto.toFixed(2).replace('.', ',')} L/min`
              : 'GC = FC × volumen sistólico'
          }
          modulo="c2-cardiovascular"
          tituloModulo="Sistema cardiovascular"
        />
      </section>
    </div>
  );
}

/** Predicado de tipo, no booleano: sin el `v is number`, el consumidor necesita
 *  un `as number` que afirma lo que esta función acaba de comprobar. */
function lpmValido(v: number | null): v is number {
  return v !== null && v > 0;
}
