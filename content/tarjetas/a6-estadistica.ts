// content/tarjetas/a6-estadistica.ts
// A6 · Estadística descriptiva y calidad de pruebas. 15 tarjetas.
// El mazo carga las fórmulas —que son pocas y no cambian— junto con los dos
// pasos que se olvidan: ordenar la lista antes de buscar la mediana y dividir
// entre el valor VIEJO al calcular un porcentaje de aumento.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A6-T01',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: '¿Cómo se calcula la media aritmética?',
    reverso:
      'Media = Σx / n: la suma de todos los valores dividida entre cuántos son. Ventaja: usa toda la información disponible. Desventaja: es muy sensible a los valores extremos.',
  },
  {
    id: 'A6-T02',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: '¿Cómo se calcula la mediana?',
    reverso:
      'Primero SE ORDENA la lista. Con n impar, la mediana ocupa la posición (N+1)/2. Con n par, es el promedio de las posiciones N/2 y (N/2)+1. Ordenar es el paso que más se olvida.',
  },
  {
    id: 'A6-T03',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: 'Mediana de 12, 30, 15 y 9',
    reverso:
      'Se ordena: 9, 12, 15, 30. Son cuatro datos, así que se promedian las posiciones 2 y 3, es decir 12 y 15: la mediana es 13,5. Sin ordenar primero se obtiene un número que no significa nada.',
  },
  {
    id: 'A6-T04',
    modulo: 'a6-estadistica',
    tipo: 'definicion',
    frente: '¿Qué es la moda y qué la hace única?',
    reverso:
      'El valor que más se repite. Es la única medida de tendencia central aplicable a variables CUALITATIVAS. Su desventaja: puede no existir, o puede haber varias en el mismo conjunto.',
  },
  {
    id: 'A6-T05',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: '¿Cuándo describe mejor la mediana que la media?',
    reverso:
      'Cuando hay un valor muy alejado del resto. Si nueve corredores hacen 40 minutos y uno hace 90, la media se dispara y la mediana no se mueve: la mediana describe mejor al grupo.',
  },
  {
    id: 'A6-T06',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: 'Rango, varianza y desviación estándar',
    reverso:
      'Rango = máximo − mínimo; rapidísimo pero solo usa dos datos. Varianza = Σ(x − x̄)² / n en población, o / (n − 1) en muestra; queda en unidades al cuadrado. Desviación estándar = √varianza; vuelve a las unidades originales, y por eso es la que se usa.',
  },
  {
    id: 'A6-T07',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: '¿Por qué la varianza eleva las diferencias al cuadrado?',
    reverso:
      'Para que las diferencias negativas no cancelen a las positivas. Al restar la media a cada dato, la suma de las diferencias sin elevar sería siempre cero, y no informaría de nada.',
  },
  {
    id: 'A6-T08',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: '¿Cuándo se divide entre n y cuándo entre n − 1?',
    reverso:
      'Entre n si los datos son TODA LA POBLACIÓN que interesa —los doce jugadores de la plantilla—. Entre n − 1 si son una MUESTRA con la que se quiere estimar algo de un grupo mayor. Con muestras grandes la diferencia es despreciable; con seis datos, no.',
  },
  {
    id: 'A6-T09',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: 'Los pasos de la varianza, en orden',
    reverso:
      'Calcular la media → restar la media a cada dato → elevar al cuadrado cada diferencia → sumar los cuadrados → dividir entre n o entre n − 1. Ejemplo con 4, 6, 8, 10: media 7; cuadrados 9, 1, 1, 9; suma 20; varianza poblacional 5; desviación estándar 2,24.',
  },
  {
    id: 'A6-T10',
    modulo: 'a6-estadistica',
    tipo: 'definicion',
    frente: '¿Qué garantiza la validez de una prueba?',
    reverso:
      'Que la prueba mide lo que dice medir. Se rompe, por ejemplo, al usar un salto vertical para estimar la resistencia aeróbica: el test puede estar bien ejecutado y aun así no medir lo que se pretendía.',
  },
  {
    id: 'A6-T11',
    modulo: 'a6-estadistica',
    tipo: 'definicion',
    frente: '¿Qué garantizan la fiabilidad y la objetividad?',
    reverso:
      'Fiabilidad: que repetida en las mismas condiciones la prueba dé resultados equivalentes. Objetividad: que el resultado no dependa de quién evalúa, lo que se garantiza con procedimientos e instrumentos estandarizados.',
  },
  {
    id: 'A6-T12',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: 'La relación entre validez y fiabilidad',
    reverso:
      'Va en una sola dirección: una prueba puede ser FIABLE SIN SER VÁLIDA, pero no puede ser VÁLIDA SIN SER FIABLE. Una báscula descalibrada que siempre marca tres kilos de más repite el resultado —es fiable— y no mide el peso real.',
  },
  {
    id: 'A6-T13',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: '¿Cómo se calcula un porcentaje de aumento?',
    reverso:
      'Porcentaje de aumento = ((nuevo − viejo) / viejo) × 100. El denominador SIEMPRE es el valor de partida. Dividir entre el valor nuevo da un número que no responde a ninguna pregunta.',
  },
  {
    id: 'A6-T14',
    modulo: 'a6-estadistica',
    tipo: 'dato',
    frente: 'De 50 a 75 kg: ¿cuánto aumentó?',
    reverso:
      'El aumento es del 50 %. El valor nuevo ES el 150 % del viejo, que es otra pregunta con otra respuesta. Responder 150 % a «cuánto aumentó» es el fallo típico del módulo: la palabra aumento pide la diferencia respecto al punto de partida.',
  },
  {
    id: 'A6-T15',
    modulo: 'a6-estadistica',
    tipo: 'formula',
    frente: '¿Cómo se resuelve una regla de tres?',
    reverso:
      'Se multiplica en cruz y se divide por el que queda. Si 4 series ocupan 20 minutos, 7 series ocupan (7 × 20) / 4 = 35 minutos.',
  },
];
