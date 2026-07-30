// content/glosario.ts
// Unión de las "cajas de conceptos clave" de las cuatro cartillas.
// REGLA: todo conceptoClave de un módulo marcado 'completo' debe tener entrada
// aquí, o el build falla. Al terminar un módulo, se añaden sus términos.

import type { EntradaGlosario } from '@/lib/tipos';

export const GLOSARIO: EntradaGlosario[] = [
  /* ── C5 · Umbrales y zonas (módulo piloto) ── */
  {
    termino: 'Umbral aeróbico (VT1)',
    definicion:
      'Primer umbral ventilatorio. Intensidad, en torno al 65–75 % de la FCmáx, a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Marca el techo del trabajo puramente aeróbico y la zona de máxima oxidación de grasas.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT1', 'Primer umbral ventilatorio'],
  },
  {
    termino: 'Umbral anaeróbico (VT2)',
    definicion:
      'Segundo umbral ventilatorio, entre el 75–85 % del VO₂máx (80–90 % de la FCmáx). Por encima de él el lactato se acumula más rápido de lo que se elimina y el esfuerzo deja de ser sostenible. Contiene el MLSS.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT2', 'Segundo umbral ventilatorio', 'Umbral láctico'],
  },
  {
    termino: 'MLSS',
    definicion:
      'Máximo estado estable de lactato: la intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo. Es el punto de referencia práctico del umbral anaeróbico y define el techo del trabajo continuo prolongado.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Máximo estado estable de lactato'],
  },
  {
    termino: 'IMTG',
    definicion:
      'Triglicéridos intramusculares: depósitos de grasa almacenados dentro de la fibra muscular. El entrenamiento continuo en R1 los aumenta, lo que mejora la disponibilidad de sustrato lipídico en esfuerzos largos.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Triglicéridos intramusculares'],
  },
  {
    termino: 'VAM',
    definicion:
      'Velocidad aeróbica máxima: la velocidad de desplazamiento más baja a la que se alcanza el VO₂máx. Sirve para prescribir intervalos en porcentaje de VAM en vez de en porcentaje de frecuencia cardíaca.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Velocidad aeróbica máxima'],
  },
  {
    termino: 'Potencia aeróbica',
    definicion:
      'Capacidad de trabajar cerca del VO₂máx. Se entrena en R3 (90–95 %) y produce aumento de densidad capilar, densidad mitocondrial y actividad de las enzimas oxidativas.',
    modulo: 'c5-umbrales-zonas',
  },
  {
    termino: 'Entrenamiento polarizado',
    definicion:
      'Modelo de distribución de la intensidad que concentra el volumen por debajo del VT1 y el resto por encima del VT2, evitando deliberadamente la zona intermedia (R2). Busca alto estímulo con baja fatiga acumulada.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Modelo polarizado'],
  },
  {
    termino: 'HIIT',
    definicion:
      'Entrenamiento interválico de alta intensidad: series submáximas cercanas al VO₂máx con recuperaciones incompletas. Se ubica en R3/R3+.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Entrenamiento interválico de alta intensidad'],
  },
  {
    termino: 'SIT',
    definicion:
      'Sprint interval training: repeticiones de muy corta duración a intensidad máxima o supramáxima con recuperaciones largas. Aunque el esfuerzo es de sprint, su objetivo adaptativo se ubica en el trabajo de potencia aeróbica (R3+).',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Sprint interval training'],
  },

  /* ── Términos transversales de alto rendimiento en el examen ── */
  {
    termino: 'MET',
    definicion:
      'Equivalente metabólico. 1 MET equivale a 3,5 ml de O₂ por kilogramo de peso por minuto: el consumo aproximado en reposo. Se usa para expresar la intensidad de una actividad como múltiplo del reposo.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'VO₂máx',
    definicion:
      'Máximo volumen de oxígeno que el organismo puede captar, transportar y utilizar por unidad de tiempo. Se calcula como gasto cardíaco por diferencia arteriovenosa y se expresa en ml/kg/min.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'Frecuencia cardíaca de reserva',
    definicion:
      'Diferencia entre la frecuencia cardíaca máxima y la de reposo. Representa el margen de trabajo cardíaco disponible y es la base del método de Karvonen para prescribir intensidades.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Gasto cardíaco',
    definicion:
      'Volumen de sangre que el corazón expulsa por minuto. Es el producto de la frecuencia cardíaca por el volumen sistólico.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Densidad',
    definicion:
      'Relación entre el tiempo de trabajo activo y el tiempo total de la sesión o serie. Reducir el descanso sube la densidad y aumenta la exigencia sin tocar el peso ni el volumen.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Escala de Borg (RPE)',
    definicion:
      'Escala de esfuerzo percibido con la que el deportista califica subjetivamente la intensidad. Es el instrumento estándar para estimar la carga interna cuando no hay medición objetiva.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Multilateralidad',
    definicion:
      'Principio biológico que defiende una preparación multifacética, con variedad de conductas motrices, técnicas y métodos. Es especialmente pertinente en las primeras etapas de la vida deportiva.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Especificidad',
    definicion:
      'Principio biológico según el cual las adaptaciones responden a las características concretas del estímulo aplicado. Se aplica después de haber desarrollado las cualidades básicas.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Supercompensación',
    definicion:
      'Restablecimiento del organismo por encima del nivel inicial tras el agotamiento provocado por una carga y su recuperación. Es el mecanismo que explica la mejora del rendimiento.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Objetividad',
    definicion:
      'Grado en que los resultados de una prueba están libres de sesgos o influencias ajenas al atributo medido. Se garantiza con procedimientos e instrumentos estandarizados.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Fiabilidad',
    definicion:
      'Consistencia de una prueba: si se repite en las mismas condiciones, arroja resultados equivalentes. Una prueba puede ser fiable sin ser válida.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Validez',
    definicion:
      'Grado en que una prueba mide efectivamente lo que dice medir. Sin validez, la precisión y la consistencia no sirven de nada.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Responsabilidad estricta',
    definicion:
      'Principio del Artículo 2.1 del Código Mundial Antidopaje: el deportista responde por cualquier sustancia prohibida hallada en su muestra, sin que sea necesario demostrar intención. La intención puede influir en la sanción, no en la existencia de la infracción.',
    modulo: 'c9-dopaje',
  },
];

/** Filtro del glosario en cliente. <400 entradas: no necesita índice. */
export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buscarGlosario(consulta: string): EntradaGlosario[] {
  const q = normalizarBusqueda(consulta);
  if (q.length === 0) return GLOSARIO;
  return GLOSARIO.filter((e) => {
    const campos = [e.termino, e.definicion, ...(e.sinonimos ?? [])];
    return campos.some((c) => normalizarBusqueda(c).includes(q));
  });
}
