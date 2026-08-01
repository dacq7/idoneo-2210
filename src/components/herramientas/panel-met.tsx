'use client';

// src/components/herramientas/panel-met.tsx — Client Component.
//
// Pestaña 4: conversión entre MET y ml/kg/min en las dos direcciones.
//
// ══ DOS CAMPOS, NO UN SELECTOR DE DIRECCIÓN ══
// Un desplegable «de MET a VO₂ / de VO₂ a MET» obliga a decidir antes de
// escribir. Con dos campos que se rellenan solos al escribir en el otro, la
// dirección la elige el usuario simplemente tocando el campo que conoce. Y se
// ve la equivalencia completa, que es lo que hay que memorizar.

import { useState } from 'react';
import { aNumero, ML_KG_MIN_POR_MET, metsDesdeVo2, redondear, vo2DesdeMets } from '@/lib/calculos';
import { CampoNumero } from './campo-numero';
import { Resultado } from './resultado';

/** Qué campo tocó el usuario por última vez: es el que manda. */
type Origen = 'met' | 'vo2';

const coma = (n: number) => n.toString().replace('.', ',');

export function PanelMet() {
  const [met, setMet] = useState('');
  const [vo2, setVo2] = useState('');
  const [origen, setOrigen] = useState<Origen>('met');

  // Un solo criterio de validez para el panel entero: positivo. Antes el campo
  // espejo se rellenaba con valores negativos («−5 MET» → «−17,5») mientras el
  // resultado se quedaba en «—», que son dos criterios sobre el mismo dato en la
  // misma pantalla. Lo levantó el code-reviewer.
  const positivo = (n: number | null): n is number => n !== null && n > 0;
  const metNum = aNumero(met);
  const vo2Num = aNumero(vo2);

  // El campo espejo se deriva; no se guarda. Guardar los dos obliga a
  // sincronizarlos en un efecto y a decidir cuál gana cuando ambos cambian.
  const metMostrado =
    origen === 'met' ? met : positivo(vo2Num) ? coma(redondear(metsDesdeVo2(vo2Num), 2)) : '';
  const vo2Mostrado =
    origen === 'vo2' ? vo2 : positivo(metNum) ? coma(redondear(vo2DesdeMets(metNum), 2)) : '';

  const valido = positivo(origen === 'met' ? metNum : vo2Num);
  const metFinal = origen === 'met' ? metNum : positivo(vo2Num) ? metsDesdeVo2(vo2Num) : null;
  const vo2Final = origen === 'vo2' ? vo2Num : positivo(metNum) ? vo2DesdeMets(metNum) : null;

  return (
    <div className="space-y-4">
      <CampoNumero
        etiqueta="Equivalentes metabólicos"
        valor={metMostrado}
        onCambio={(v) => {
          setOrigen('met');
          setMet(v);
        }}
        unidad="MET"
        placeholder="10"
      />
      <CampoNumero
        etiqueta="Consumo de oxígeno"
        valor={vo2Mostrado}
        onCambio={(v) => {
          setOrigen('vo2');
          setVo2(v);
        }}
        unidad="ml/kg/min"
        placeholder="35"
      />

      <Resultado
        rotulo="Equivale a"
        valor={
          valido && metFinal !== null && vo2Final !== null
            ? origen === 'met'
              ? coma(redondear(vo2Final, 2))
              : coma(redondear(metFinal, 2))
            : null
        }
        unidad={origen === 'met' ? 'ml/kg/min' : 'MET'}
        formula={
          valido && metFinal !== null && vo2Final !== null
            ? origen === 'met'
              ? `${coma(redondear(metFinal, 2))} MET × 3,5 = ${coma(redondear(vo2Final, 2))} ml/kg/min`
              : `${coma(redondear(vo2Final, 2))} / 3,5 = ${coma(redondear(metFinal, 2))} MET`
            : '1 MET = 3,5 ml de O₂ por kg y por minuto'
        }
        modulo="c3-respiratorio-vo2"
        tituloModulo="Sistema respiratorio y VO₂máx"
        nota={`La constante es ${coma(ML_KG_MIN_POR_MET)} y cae en el examen tal cual: 1 MET es el consumo aproximado en reposo.`}
      />
    </div>
  );
}
