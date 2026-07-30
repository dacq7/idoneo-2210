// content/tarjetas/c5-umbrales-zonas.ts
// Módulo piloto C5. Transcripción literal de §14.2 del blueprint.
// 15 tarjetas que cubren los 5 datos duros del módulo (DD-040 … DD-044).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C5-T01',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es un umbral en el entrenamiento de resistencia?',
    reverso:
      'Una intensidad de referencia a partir de la cual cambia el comportamiento fisiológico del organismo. Los dos que se usan para zonificar son VT1 (umbral aeróbico) y VT2 (umbral anaeróbico).',
  },
  {
    id: 'C5-T02',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R0: porcentaje y objetivo',
    reverso:
      'Por debajo del 65 %. Calentamiento, recuperación activa y eliminación de desechos metabólicos. No busca adaptación, busca recuperación.',
  },
  {
    id: 'C5-T03',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R1 (VT1): porcentaje, objetivo y sustrato',
    reverso:
      '65–75 %. Eficiencia aeróbica y máxima oxidación de lípidos; aumenta los IMTG. Participación 99 % aeróbica / 1 % anaeróbica. Sustrato: 20–40 % grasas y 60–80 % hidratos.',
  },
  {
    id: 'C5-T04',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R2 (VT2): porcentaje, objetivo y sustrato',
    reverso:
      '75–85 % del VO₂máx · 80–90 % de la FCmáx. Oxidación del glucógeno; aumenta volemia, volumen sistólico y gasto cardíaco máximo. Contiene el MLSS. Participación 95 % / 5 %. Sustrato: casi exclusivamente hidratos.',
  },
  {
    id: 'C5-T05',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R3 / R3+: porcentaje, objetivo y sustrato',
    reverso:
      '90–95 %. Potencia aeróbica; aumenta densidad capilar, densidad mitocondrial y enzimas oxidativas. Participación 65 % aeróbica / 35 % anaeróbica. Sustrato: glucógeno. Aquí van HIIT y SIT.',
  },
  {
    id: 'C5-T06',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué marca el VT1 (umbral aeróbico)?',
    reverso:
      'La intensidad a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Por debajo, el lactato se mantiene en valores de reposo.',
  },
  {
    id: 'C5-T07',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué marca el VT2 (umbral anaeróbico)?',
    reverso:
      'La intensidad por encima de la cual el lactato se acumula más rápido de lo que se elimina. Es el techo del esfuerzo sostenible en el tiempo.',
  },
  {
    id: 'C5-T08',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es el MLSS y en qué zona está?',
    reverso:
      'Máximo estado estable de lactato: la intensidad más alta a la que el lactato en sangre se mantiene constante en el tiempo. Está en R2, en el entorno del VT2 — nunca en R1.',
  },
  {
    id: 'C5-T09',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'Sustrato dominante por zona',
    reverso:
      'R1 → mezcla con máxima participación de grasas (20–40 %). R2 → casi exclusivamente hidratos de carbono. R3 → glucógeno. A más intensidad, más peso del hidrato.',
  },
  {
    id: 'C5-T10',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Participación aeróbica / anaeróbica por zona',
    reverso: 'R1: 99 % / 1 %. R2: 95 % / 5 %. R3: 65 % / 35 %.',
  },
  {
    id: 'C5-T11',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué son los IMTG y qué zona los aumenta?',
    reverso:
      'Triglicéridos intramusculares: depósitos de grasa dentro de la fibra muscular. El trabajo continuo en R1 los aumenta y mejora la disponibilidad de sustrato lipídico en esfuerzos largos.',
  },
  {
    id: 'C5-T12',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es la VAM?',
    reverso:
      'Velocidad aeróbica máxima: la velocidad más baja a la que ya se alcanza el VO₂máx. Permite prescribir intervalos en porcentaje de velocidad en vez de porcentaje de frecuencia cardíaca.',
  },
  {
    id: 'C5-T13',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'Los 4 modelos de distribución de la intensidad',
    reverso:
      '1) Baja intensidad / alto volumen: ~90 % por debajo de VT1. 2) Alta intensidad / bajo volumen: prioriza por encima de VT2. 3) Entre umbrales: concentra en la zona intermedia (tempo). 4) Polarizado: mucho por debajo de VT1 y el resto por encima de VT2, EVITANDO la zona intermedia.',
  },
  {
    id: 'C5-T14',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'HIIT y SIT: qué son y dónde se ubican',
    reverso:
      'HIIT: series submáximas cerca del VO₂máx con recuperación incompleta. SIT: repeticiones muy cortas a intensidad máxima con recuperación larga. Los dos se ubican en R3/R3+ porque su objetivo adaptativo es la potencia aeróbica.',
  },
  {
    id: 'C5-T15',
    modulo: 'c5-umbrales-zonas',
    tipo: 'formula',
    frente: '¿Cómo se calcula la frecuencia objetivo de una zona?',
    reverso:
      'FC objetivo = FCmáx × % de la zona. Ejemplo con Fox a los 40 años: FCmáx = 220 − 40 = 180 lpm; límite inferior de R1 (65 %) = 180 × 0,65 = 117 lpm.',
  },
];
