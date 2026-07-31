'use client';

// src/components/herramientas/panel-carga.tsx — Client Component.
//
// Pestaña 3: densidad de una serie o una sesión.
//
// ══ POR QUÉ SE PINTAN LAS DOS FORMAS ══
// El cociente (0,75) y el porcentaje (75 %) son la misma cifra, y los ítems del
// banco piden a veces una y a veces la otra —B4-014 pide porcentaje, D2 usa
// cociente—. Enseñar solo una obliga a convertir de cabeza justo cuando el
// enunciado ya está pidiendo otra cosa.

import { useState } from 'react';
import { aNumero, densidad, redondear } from '@/lib/calculos';
import { CampoNumero } from './campo-numero';
import { Resultado } from './resultado';

export function PanelCarga() {
  const [trabajo, setTrabajo] = useState('');
  const [pausa, setPausa] = useState('');

  const t = aNumero(trabajo);
  const p = aNumero(pausa);
  // La pausa 0 es legítima —trabajo continuo, densidad 1— así que solo se exige
  // que el trabajo exista y sea positivo.
  const valido = t !== null && t > 0 && p !== null && p >= 0;
  const d = valido ? densidad(t, p) : null;
  const total = valido ? t + p : null;

  return (
    <div className="space-y-4">
      <CampoNumero
        etiqueta="Tiempo de trabajo"
        valor={trabajo}
        onCambio={setTrabajo}
        unidad="s"
        placeholder="45"
      />
      <CampoNumero
        etiqueta="Tiempo de pausa"
        valor={pausa}
        onCambio={setPausa}
        unidad="s"
        placeholder="15"
        ayuda="Sin pausa la densidad es 1, es decir el 100 %."
      />

      <Resultado
        rotulo="Densidad"
        valor={d !== null ? `${redondear(d * 100, 1).toString().replace('.', ',')} %` : null}
        formula={
          valido
            ? `${t} / (${t} + ${p}) = ${t} / ${total} = ${redondear(d as number, 3).toString().replace('.', ',')}`
            : 'densidad = trabajo / (trabajo + pausa)'
        }
        modulo="d2-carga"
        tituloModulo="La carga y sus componentes"
        nota={
          d !== null
            ? `Como cociente: ${redondear(d, 3).toString().replace('.', ',')}. Recortar la pausa sube la densidad y con ella la exigencia, sin tocar el peso ni el número de repeticiones.`
            : undefined
        }
      />

      {/* El denominador es el error que el ítem B4-014 penaliza: dividir entre
          la pausa en vez de entre el total da un número mayor que 1, que como
          densidad no significa nada. Se dice aquí porque es donde se teclea. */}
      <p className="rounded-lg border border-border bg-muted/40 p-3 text-[0.8125rem] leading-[1.5] text-muted-foreground">
        El denominador es el <strong className="font-semibold text-foreground">tiempo total</strong>,
        no la pausa. Dividir 40 entre 20 daría 2, y una densidad nunca pasa de 1.
      </p>
    </div>
  );
}
