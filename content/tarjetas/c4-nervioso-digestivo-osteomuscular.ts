// content/tarjetas/c4-nervioso-digestivo-osteomuscular.ts
// C4 · Sistemas nervioso, digestivo y osteomuscular. 15 tarjetas.
// El módulo no tiene datos duros propios en content/datos-duros.ts: lo que se
// pregunta aquí son clasificaciones y secuencias, no cifras. Las tarjetas
// cubren los tres propioceptores, los tres tipos de contracción, los 7 pasos
// de la contracción muscular y el reparto de funciones del aparato digestivo.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C4-T01',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'Los propioceptores y qué detecta cada uno',
    reverso:
      'Huso muscular: estiramiento y velocidad del estiramiento. Órgano tendinoso de Golgi: tensión en el tendón. Corpúsculos de Pacini: presión profunda y vibración. Ruffini: posición articular y estiramiento sostenido.',
  },
  {
    id: 'C4-T02',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: 'Reflejo miotático y reflejo miotático inverso',
    reverso:
      'Miotático: nace en el huso, responde al estiramiento CONTRAYENDO. Miotático inverso: nace en el órgano de Golgi, responde a la tensión excesiva RELAJANDO. Uno protege de estirarte demasiado; el otro, de romperte tirando.',
  },
  {
    id: 'C4-T03',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'Los tres tipos de contracción',
    reverso:
      'Isotónica concéntrica: el músculo se acorta venciendo la resistencia. Isotónica excéntrica: se alarga frenando una carga que lo supera. Isométrica: genera tensión sin cambiar de longitud. Acorta, alarga, mantiene.',
  },
  {
    id: 'C4-T04',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Por qué la excéntrica genera más tensión y más daño?',
    reverso:
      'Porque el músculo frena una carga superior reclutando MENOS unidades motoras, así que cada fibra activa soporta más tensión. Por eso se puede frenar más peso del que se puede levantar, y por eso duele al día siguiente.',
  },
  {
    id: 'C4-T05',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'Los 7 pasos de la contracción muscular',
    reverso:
      '1) El impulso llega a la placa motora y se libera acetilcolina. 2) Se despolariza el sarcolema y viaja por los túbulos T. 3) El retículo sarcoplásmico libera calcio. 4) El calcio se une a la troponina y la tropomiosina descubre la actina. 5) La miosina se une a la actina: puente cruzado. 6) Golpe de fuerza y deslizamiento. 7) Un nuevo ATP suelta el puente y el calcio vuelve al retículo.',
  },
  {
    id: 'C4-T06',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Para qué se necesita el ATP en la contracción?',
    reverso:
      'Para SOLTAR el puente cruzado, no para formarlo. Lo demuestra el rigor mortis: sin ATP los puentes quedan enganchados y el músculo se vuelve rígido. El ATP también paga la bomba que devuelve el calcio al retículo.',
  },
  {
    id: 'C4-T07',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Qué papel cumple el calcio?',
    reverso:
      'Es el interruptor: se une a la troponina, desplaza la tropomiosina y deja libres los sitios de unión de la actina. El calcio abre la puerta y el ATP paga el trabajo.',
  },
  {
    id: 'C4-T08',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'Fibras tipo I frente a fibras tipo II',
    reverso:
      'Tipo I: lentas, oxidativas, rojas, muchas mitocondrias y capilares, muy resistentes a la fatiga. Tipo II: rápidas, glucolíticas, pálidas, mucha fuerza y potencia, se fatigan pronto. Tipo I aguanta, tipo II explota.',
  },
  {
    id: 'C4-T09',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Qué es una unidad motora?',
    reverso:
      'Una motoneurona y todas las fibras que inerva. Todas sus fibras son del mismo tipo, y se activa por todo o nada. Los músculos de gestos finos tienen unidades pequeñas —menos de diez fibras en el ojo—; los de fuerza, unidades de cientos.',
  },
  {
    id: 'C4-T10',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: 'El principio del tamaño (Henneman)',
    reverso:
      'Las unidades motoras se reclutan de menor a mayor umbral: primero las pequeñas y lentas, y solo al subir la exigencia entran las grandes y rápidas. Consecuencia práctica: para reclutar tipo II hace falta intensidad alta o velocidad de ejecución alta.',
  },
  {
    id: 'C4-T11',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'División del sistema nervioso',
    reverso:
      'Central: encéfalo y médula espinal. Periférico: somático (voluntario) y autónomo, y este último en simpático y parasimpático. La jerarquía es central-periférico → somático-autónomo → simpático-parasimpático.',
  },
  {
    id: 'C4-T12',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'clasificacion',
    frente: 'El recorrido del alimento y dónde se absorbe',
    reverso:
      'Boca → esófago → estómago → intestino delgado → intestino grueso. El estómago DIGIERE, el intestino delgado ABSORBE los nutrientes y el grueso absorbe el agua. La absorción no ocurre en el estómago.',
  },
  {
    id: 'C4-T13',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Qué causa el dolor muscular tardío?',
    reverso:
      'Microdaño mecánico de la fibra, sobre todo por trabajo excéntrico. Aparece a las 24–48 h. No lo causa el lactato, que se retira en menos de una hora: por eso bajar una montaña duele más que subirla.',
  },
  {
    id: 'C4-T14',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: 'Fibra muscular y sarcómero',
    reverso:
      'La célula muscular es la fibra muscular o miocito. El sarcómero es su unidad contráctil —el tramo entre dos líneas Z—, no una célula. Una fibra contiene miles de sarcómeros en serie.',
  },
  {
    id: 'C4-T15',
    modulo: 'c4-nervioso-digestivo-osteomuscular',
    tipo: 'definicion',
    frente: '¿Qué es la propiocepción y se puede entrenar?',
    reverso:
      'Es la información sobre la posición y el movimiento del cuerpo sin necesidad de mirarlo. Sí se entrena: el trabajo de equilibrio e inestabilidad mejora la respuesta refleja, y en eso se basan los programas de prevención de esguinces.',
  },
];
