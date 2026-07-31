// content/tarjetas/d2-carga.ts
// Bloque D · Módulo 2. 15 tarjetas.
// Cubren los datos duros del módulo: DD-090 (fórmula de densidad),
// DD-091 (el ejemplo numérico de densidad) y DD-092 (escala de Borg).
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D2-T01',
    modulo: 'd2-carga',
    tipo: 'definicion',
    frente: '¿Qué es la carga de entrenamiento?',
    reverso:
      'El estímulo de trabajo que se aplica al deportista para provocar una adaptación. No es lo que hizo, sino lo que le exigió hacerlo.',
  },
  {
    id: 'D2-T02',
    modulo: 'd2-carga',
    tipo: 'clasificacion',
    frente: 'Los 5 componentes de la carga',
    reverso:
      'Volumen, intensidad, densidad, frecuencia y duración. Volumen e intensidad definen la magnitud de la carga; los otros tres deciden cómo se reparte en el tiempo.',
  },
  {
    id: 'D2-T03',
    modulo: 'd2-carga',
    tipo: 'definicion',
    frente: 'Volumen e intensidad: ¿qué mide cada uno?',
    reverso:
      'El volumen es la cantidad total de trabajo (km, kg, series × reps, minutos). La intensidad es el grado de exigencia de ese trabajo (% 1RM, % FCmáx, velocidad, RPE).',
  },
  {
    id: 'D2-T04',
    modulo: 'd2-carga',
    tipo: 'dato',
    frente: '¿Qué dice la relación inversa entre volumen e intensidad?',
    reverso:
      'A mayor intensidad, menor volumen tolerable; a mayor volumen, menor intensidad sostenible. Subir los dos a la vez no produce más adaptación: produce fatiga sin estímulo claro.',
  },
  {
    id: 'D2-T05',
    modulo: 'd2-carga',
    tipo: 'formula',
    frente: '¿Cómo se calcula la densidad?',
    reverso:
      'Densidad = tiempo de trabajo ÷ tiempo total, donde el tiempo total es trabajo + descanso. Se expresa como fracción o como porcentaje.',
  },
  {
    id: 'D2-T06',
    modulo: 'd2-carga',
    tipo: 'formula',
    frente: 'Densidad de una serie de 30 s de trabajo con 60 s de descanso',
    reverso: 'Tiempo total = 30 + 60 = 90 s. Densidad = 30 ÷ 90 = 0,33, es decir 33 %.',
  },
  {
    id: 'D2-T07',
    modulo: 'd2-carga',
    tipo: 'formula',
    frente: 'Densidad de una serie de 30 s de trabajo con 30 s de descanso',
    reverso:
      'Tiempo total = 30 + 30 = 60 s. Densidad = 30 ÷ 60 = 0,50, es decir 50 %. Recortar el descanso sube la densidad sin tocar peso ni repeticiones.',
  },
  {
    id: 'D2-T08',
    modulo: 'd2-carga',
    tipo: 'formula',
    frente: 'Relación trabajo : descanso de 1 : n — ¿qué densidad da?',
    reverso:
      'Densidad = 1 ÷ (1 + n). Así, 1:1 = 0,50 (50 %), 1:2 = 0,33 (33 %), 1:3 = 0,25 (25 %). El error frecuente es olvidar sumar el 1 del trabajo.',
  },
  {
    id: 'D2-T09',
    modulo: 'd2-carga',
    tipo: 'definicion',
    frente: '¿Qué es la carga externa?',
    reverso:
      'El trabajo prescrito y ejecutado, medido fuera del organismo: kilos, kilómetros, series, repeticiones, velocidad. Es lo que el entrenador escribe en la planilla.',
  },
  {
    id: 'D2-T10',
    modulo: 'd2-carga',
    tipo: 'definicion',
    frente: '¿Qué es la carga interna?',
    reverso:
      'La respuesta del organismo a la carga externa: frecuencia cardíaca, lactato, esfuerzo percibido, tiempo de recuperación. Es lo que el cuerpo pagó por hacer el trabajo.',
  },
  {
    id: 'D2-T11',
    modulo: 'd2-carga',
    tipo: 'dato',
    frente: '¿Por qué la misma carga externa da cargas internas distintas?',
    reverso:
      'Porque la respuesta depende del estado del deportista: sueño, enfermedad, nivel de entrenamiento, calor y altitud. La carga externa se planifica; la interna se controla.',
  },
  {
    id: 'D2-T12',
    modulo: 'd2-carga',
    tipo: 'dato',
    frente: '¿Cuál es el rango de la escala original de Borg?',
    reverso:
      'De 6 a 20. Arranca en 6 porque se diseñó para que el valor multiplicado por diez se aproximara a la frecuencia cardíaca de un adulto joven sano: 6 es reposo y 20 es esfuerzo máximo.',
  },
  {
    id: 'D2-T13',
    modulo: 'd2-carga',
    tipo: 'dato',
    frente: '¿Cuál es el rango de la escala CR-10 de Borg y para qué se usa?',
    reverso:
      'De 0 a 10. Es más fácil de explicar al deportista y es la que se usa para calcular la carga de sesión en unidades arbitrarias.',
  },
  {
    id: 'D2-T14',
    modulo: 'd2-carga',
    tipo: 'formula',
    frente: '¿Cómo se calcula la carga de una sesión con el esfuerzo percibido?',
    reverso:
      'Carga de sesión (UA) = RPE de 0 a 10 × duración en minutos. Ejemplo: RPE 7 en una sesión de 75 min = 525 unidades arbitrarias.',
  },
  {
    id: 'D2-T15',
    modulo: 'd2-carga',
    tipo: 'clasificacion',
    frente: 'Cómo se mueven intensidad, volumen y descanso según el objetivo de fuerza',
    reverso:
      'Fuerza máxima: > 85 % 1RM, menos de 6 reps, 2–5 min de descanso. Hipertrofia: 70–85 % 1RM, 6–12 reps, 30 s–1 min 30 s. Resistencia muscular: < 70 % 1RM, 15 reps o más, hasta 30 s.',
  },
];
