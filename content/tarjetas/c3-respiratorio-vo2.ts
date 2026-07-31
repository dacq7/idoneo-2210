// content/tarjetas/c3-respiratorio-vo2.ts
// C3 · Sistema respiratorio y VO₂máx. 15 tarjetas.
// Cubren los 6 datos duros del módulo: DD-030 (1 MET), DD-031 (ecuación de
// Fick), DD-032 y DD-033 (diferencia arteriovenosa en reposo y en ejercicio) y
// DD-034 y DD-035 (baremos de VO₂máx por sexo).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C3-T01',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'dato',
    frente: '¿A cuánto equivale 1 MET?',
    reverso:
      '3,5 ml de O₂ por kilogramo de peso y por minuto: el consumo aproximado en reposo. Expresa la intensidad de una actividad como múltiplo del reposo, así que 8 MET cuestan ocho veces el gasto basal.',
  },
  {
    id: 'C3-T02',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'formula',
    frente: 'La ecuación de Fick',
    reverso:
      'VO₂ = gasto cardíaco × diferencia arteriovenosa. El gasto cardíaco es el transporte y la diferencia arteriovenosa es la extracción: el consumo necesita los dos, y en ejercicio suben los dos a la vez.',
  },
  {
    id: 'C3-T03',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'dato',
    frente: 'Diferencia arteriovenosa en reposo y en ejercicio',
    reverso:
      'Reposo: 5 ml de O₂ por cada 100 ml de sangre. Ejercicio: 15–17 ml por cada 100 ml. Se triplica, y crece por el lado venoso: la sangre vuelve más pobre porque el músculo extrae más.',
  },
  {
    id: 'C3-T04',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: '¿Qué es el VO₂máx?',
    reverso:
      'El máximo volumen de oxígeno que el organismo puede captar, transportar y utilizar por unidad de tiempo. Incluye los tres pasos, no solo el respiratorio.',
  },
  {
    id: 'C3-T05',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: 'VO₂máx relativo y absoluto',
    reverso:
      'Relativo: ml/kg/min, dividido entre el peso. Absoluto: L/min, sin descontar el peso. En pruebas donde se transporta el propio cuerpo manda el relativo; en remo o natación el absoluto pesa más.',
  },
  {
    id: 'C3-T06',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'dato',
    frente: 'Baremos de VO₂máx en sedentarios de 20 a 40 años',
    reverso:
      'Hombres: 35–45 ml/kg/min. Mujeres: 30–40 ml/kg/min. Los valores femeninos van unos cinco puntos por debajo a igualdad de edad y de nivel de actividad.',
  },
  {
    id: 'C3-T07',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'clasificacion',
    frente: 'Los 3 procesos que llevan el oxígeno a la mitocondria',
    reverso:
      'Ventilación pulmonar (mueve el aire hasta el alvéolo) · difusión alveolo-capilar (pasa el O₂ a la sangre) · transporte y utilización tisular (lo lleva al músculo y lo consume). Si falla uno, el oxígeno no llega.',
  },
  {
    id: 'C3-T08',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: '¿Qué limita el VO₂máx en una persona sana?',
    reverso:
      'El transporte: el gasto cardíaco máximo alcanzable. No el pulmón — la ventilación conserva reserva incluso en esfuerzo máximo y la saturación arterial apenas cae. Se jadea por el pulmón y se limita por el corazón.',
  },
  {
    id: 'C3-T09',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'formula',
    frente: 'Test de Cooper: protocolo y fórmula',
    reverso:
      '12 minutos corriendo la máxima distancia posible. VO₂máx = (metros − 504,9) / 44,73. La distancia entra EN METROS: en kilómetros el resultado sale negativo. Restar antes de dividir.',
  },
  {
    id: 'C3-T10',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'formula',
    frente: 'Course Navette: protocolo y velocidad por palier',
    reverso:
      '20 m entre líneas. Arranca en 8,5 km/h y sube 0,5 km/h por palier de 1 min: velocidad = 8,5 + 0,5 × (palier − 1). En el palier 1 se corre a la velocidad de salida, de ahí el paréntesis.',
  },
  {
    id: 'C3-T11',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'formula',
    frente: 'Conversión entre MET y ml/kg/min',
    reverso:
      'De MET a ml/kg/min: multiplicar por 3,5. De ml/kg/min a MET: dividir entre 3,5. Un VO₂máx de 42 ml/kg/min son 12 MET; el récord humano ronda los 25 MET.',
  },
  {
    id: 'C3-T12',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'clasificacion',
    frente: 'Los volúmenes pulmonares',
    reverso:
      'Volumen corriente: el de una respiración tranquila. Reserva inspiratoria: lo que aún cabe tras una inspiración normal. Reserva espiratoria: lo que aún sale tras una espiración normal. Residual: lo que queda siempre dentro y nunca se expulsa.',
  },
  {
    id: 'C3-T13',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: '¿Dónde ocurre el intercambio de gases?',
    reverso:
      'En la membrana alveolo-capilar, donde la pared del alvéolo y la del capilar quedan separadas por una distancia mínima. El resto de la vía aérea conduce, no intercambia: por eso su volumen se llama espacio muerto.',
  },
  {
    id: 'C3-T14',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: '¿Por qué sube tanto el VO₂ del reposo al ejercicio máximo?',
    reverso:
      'Porque el VO₂ es un producto y suben sus dos factores: el gasto cardíaco pasa de unos 5 a unos 25 L/min y la extracción se triplica. Al multiplicarse, el consumo puede crecer más de quince veces.',
  },
  {
    id: 'C3-T15',
    modulo: 'c3-respiratorio-vo2',
    tipo: 'definicion',
    frente: '¿Cómo mejora el VO₂máx con el entrenamiento?',
    reverso:
      'Sobre todo elevando el gasto cardíaco máximo —más volemia y más volumen sistólico—, y también la extracción periférica por aumento de capilares y mitocondrias. La FCmáx no interviene: no cambia con el entrenamiento.',
  },
];
