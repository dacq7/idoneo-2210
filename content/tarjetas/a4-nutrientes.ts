// content/tarjetas/a4-nutrientes.ts
// A4 · Macronutrientes y micronutrientes. 15 tarjetas.
// Cuatro bloques: los aportes energéticos por gramo, la clasificación de los
// carbohidratos con la composición de los disacáridos, el valor biológico de la
// proteína con la complementación, y los cuatro tipos de grasa por su efecto.
// Cierra con las vitaminas, donde está el punto verificado del módulo: la B2 se
// inactiva con la luz y los vegetales de hoja verde son el sello del folato.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A4-T01',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿Cuánta energía aporta cada gramo de macronutriente?',
    reverso:
      'Carbohidratos: 4 kcal/g. Proteínas: 4 kcal/g. Grasas: 9 kcal/g. Que la grasa aporte más del doble explica por qué es el sustrato de reserva: almacenar energía como grasa ocupa menos que como glucógeno.',
  },
  {
    id: 'A4-T02',
    modulo: 'a4-nutrientes',
    tipo: 'clasificacion',
    frente: 'Mono, di y polisacáridos',
    reverso:
      'Monosacárido: una sola unidad — glucosa, fructosa, galactosa. Disacárido: dos unidades — sacarosa, lactosa, maltosa. Polisacárido: muchas unidades encadenadas — almidón, glucógeno, celulosa.',
  },
  {
    id: 'A4-T03',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: 'La composición de los tres disacáridos',
    reverso:
      'Sacarosa = glucosa + fructosa (azúcar de mesa). Lactosa = glucosa + galactosa (azúcar de la leche). Maltosa = glucosa + glucosa.',
  },
  {
    id: 'A4-T04',
    modulo: 'a4-nutrientes',
    tipo: 'clasificacion',
    frente: 'Almidón, glucógeno y celulosa',
    reverso:
      'Almidón: reserva VEGETAL, lo aportan cereales, tubérculos y legumbres. Glucógeno: reserva ANIMAL, se almacena en hígado y músculo. Celulosa: estructural en las plantas y el ser humano NO la digiere — es fibra.',
  },
  {
    id: 'A4-T05',
    modulo: 'a4-nutrientes',
    tipo: 'definicion',
    frente: '¿Qué es un aminoácido esencial y cuántos hay?',
    reverso:
      'Un aminoácido que el organismo no puede fabricar y tiene que llegar con la dieta. De los veinte que intervienen en las proteínas, NUEVE son esenciales.',
  },
  {
    id: 'A4-T06',
    modulo: 'a4-nutrientes',
    tipo: 'definicion',
    frente: '¿Qué mide el valor biológico de una proteína?',
    reverso:
      'Su calidad: cuántos aminoácidos esenciales aporta, en qué proporción y con qué digestibilidad. Alto valor biológico: huevo, leche, carne, pescado. Bajo: legumbres y cereales.',
  },
  {
    id: 'A4-T07',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿Qué es la complementación proteica?',
    reverso:
      'Combinar dos proteínas incompletas para obtener una completa. A la LEGUMBRE le falta metionina y al CEREAL le falta lisina, así que legumbre + cereal da proteína completa: arroz con lentejas, garbanzos con pan, frijoles con maíz.',
  },
  {
    id: 'A4-T08',
    modulo: 'a4-nutrientes',
    tipo: 'clasificacion',
    frente: 'Los cuatro tipos de grasa por su estructura',
    reverso:
      'Saturada: sin dobles enlaces, sólida a temperatura ambiente. Monoinsaturada: un doble enlace. Poliinsaturada: dos o más. Trans: dobles enlaces en configuración trans, sobre todo de origen industrial por hidrogenación parcial.',
  },
  {
    id: 'A4-T09',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿Por qué la grasa trans es la peor del grupo?',
    reverso:
      'Porque hace las dos cosas malas a la vez: SUBE el colesterol LDL y además BAJA el HDL. Es la única de la que se recomienda consumo lo más bajo posible: las saturadas se moderan, las trans se evitan.',
  },
  {
    id: 'A4-T10',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿Qué grasas son esenciales y dónde están?',
    reverso:
      'Los ácidos grasos poliinsaturados omega-3 y omega-6. Se llaman esenciales por la misma razón que los aminoácidos: el organismo no los sintetiza. Omega-3 en pescado azul, lino y nueces; omega-6 en aceites de semillas.',
  },
  {
    id: 'A4-T11',
    modulo: 'a4-nutrientes',
    tipo: 'clasificacion',
    frente: 'Vitaminas liposolubles e hidrosolubles',
    reverso:
      'Liposolubles: A, D, E y K. Se disuelven en grasa y SE ACUMULAN, así que un exceso puede ser tóxico. Hidrosolubles: complejo B y vitamina C. Se eliminan por la orina y hay que reponerlas con regularidad.',
  },
  {
    id: 'A4-T12',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: 'Vitamina B2 (riboflavina): función, fuentes y su sello',
    reverso:
      'Interviene en el metabolismo energético. Fuentes: lácteos, huevos, carne magra, almendras e hígado. Su sello exclusivo es que SE INACTIVA CON LA LUZ, y por eso la leche se envasa en recipientes opacos.',
  },
  {
    id: 'A4-T13',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿De qué vitamina son característicos los vegetales de hoja verde?',
    reverso:
      'Del FOLATO (B9), que interviene en la síntesis de ADN. Su propio nombre viene del latín folium, hoja. Si una pregunta ofrece «vegetales de hoja verde» como fuente característica, apunta al folato.',
  },
  {
    id: 'A4-T14',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: '¿Qué tiene de particular la vitamina B12?',
    reverso:
      'Que solo está presente en alimentos de ORIGEN ANIMAL, así que una dieta vegana estricta necesita suplementarla. Interviene en la formación de glóbulos rojos y en el sistema nervioso.',
  },
  {
    id: 'A4-T15',
    modulo: 'a4-nutrientes',
    tipo: 'dato',
    frente: 'Hierro hemo y no hemo',
    reverso:
      'El hierro HEMO, de origen animal, se absorbe mucho mejor que el NO HEMO, de origen vegetal. La absorción del no hemo mejora si se acompaña de vitamina C en la misma comida: lentejas con pimiento o con un cítrico de postre.',
  },
];
