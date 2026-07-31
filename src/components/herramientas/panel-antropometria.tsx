'use client';

// src/components/herramientas/panel-antropometria.tsx — Client Component.
//
// Pestaña 5: IMC e índice cintura-cadera.
//
// ══ LA ADVERTENCIA DEL IMC NO ES OPCIONAL ══
// La calculadora la enseña **siempre**, no solo cuando el resultado sale alto.
// Un entrenador que mide a un jugador de rugby y lee «Sobrepeso» sin más está
// recibiendo información falsa sobre su deportista, y esta herramienta existe
// para enseñar, no para etiquetar. `NOTA_IMC` vive en `lib/calculos.ts` junto a
// la función, para que nadie pinte el número sin ella.

import { useState } from 'react';
import { aNumero, categoriaIMC, imc, indiceCinturaCadera, NOTA_IMC, redondear } from '@/lib/calculos';
import { CampoNumero } from './campo-numero';
import { Resultado } from './resultado';

const coma = (n: number) => n.toString().replace('.', ',');

export function PanelAntropometria() {
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [cintura, setCintura] = useState('');
  const [cadera, setCadera] = useState('');

  const pesoNum = aNumero(peso);
  const estaturaNum = aNumero(estatura);
  // El error de unidad más común: teclear 175 en vez de 1,75. Se detecta y se
  // dice, en vez de devolver un IMC de 0,002 sin explicación.
  const estaturaEnCm = estaturaNum !== null && estaturaNum > 3;
  const imcValido = pesoNum !== null && pesoNum > 0 && estaturaNum !== null && estaturaNum > 0 && !estaturaEnCm;
  const valorImc = imcValido ? redondear(imc(pesoNum, estaturaNum), 1) : null;

  const cinturaNum = aNumero(cintura);
  const caderaNum = aNumero(cadera);
  const iccValido = cinturaNum !== null && cinturaNum > 0 && caderaNum !== null && caderaNum > 0;
  const icc = iccValido ? redondear(indiceCinturaCadera(cinturaNum, caderaNum), 2) : null;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-[0.9375rem] font-semibold">Índice de masa corporal</h3>
        <CampoNumero etiqueta="Peso" valor={peso} onCambio={setPeso} unidad="kg" placeholder="70" />
        <CampoNumero
          etiqueta="Estatura"
          valor={estatura}
          onCambio={setEstatura}
          unidad="m"
          placeholder="1,75"
          ayuda={
            estaturaEnCm
              ? 'La estatura va en METROS: escribe 1,75 y no 175.'
              : 'En metros, con coma: 1,75.'
          }
        />
        <Resultado
          rotulo="IMC"
          valor={valorImc !== null ? coma(valorImc) : null}
          unidad="kg/m²"
          formula={
            imcValido
              ? `${pesoNum} / (${coma(estaturaNum)} × ${coma(estaturaNum)}) = ${coma(valorImc as number)}`
              : 'IMC = peso / estatura²'
          }
          modulo="c7-nutricion-deportiva"
          tituloModulo="Nutrición deportiva"
          nota={valorImc !== null ? `Categoría OMS: ${categoriaIMC(valorImc)}. ${NOTA_IMC}` : NOTA_IMC}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-[0.9375rem] font-semibold">Índice cintura-cadera</h3>
        <CampoNumero
          etiqueta="Cintura"
          valor={cintura}
          onCambio={setCintura}
          unidad="cm"
          placeholder="80"
        />
        <CampoNumero
          etiqueta="Cadera"
          valor={cadera}
          onCambio={setCadera}
          unidad="cm"
          placeholder="100"
          ayuda="Las dos en las mismas unidades: el índice es un cociente y no depende de cuáles sean."
        />
        <Resultado
          rotulo="Índice cintura-cadera"
          valor={icc !== null ? coma(icc) : null}
          formula={iccValido ? `${cinturaNum} / ${caderaNum} = ${coma(icc as number)}` : 'ICC = cintura / cadera'}
          modulo="c7-nutricion-deportiva"
          tituloModulo="Nutrición deportiva"
        />
      </section>
    </div>
  );
}
