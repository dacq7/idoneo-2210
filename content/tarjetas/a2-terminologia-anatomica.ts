// content/tarjetas/a2-terminologia-anatomica.ts
// A2 · Terminología anatómica y planos. 15 tarjetas.
// El mazo carga la posición anatómica de referencia, los tres planos con su eje
// perpendicular —que es la trampa del módulo— y los movimientos articulares.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'A2-T01',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: '¿Cuál es la posición anatómica de referencia?',
    reverso:
      'De pie y erguido, mirada al frente horizontal, brazos extendidos a los lados del cuerpo, PALMAS HACIA ADELANTE, pies juntos y paralelos apuntando al frente. No es la postura natural: es un convenio, y todos los términos se definen desde ella.',
  },
  {
    id: 'A2-T02',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'dato',
    frente: '¿Por qué importa que las palmas miren hacia adelante?',
    reverso:
      'Porque con la palma hacia el muslo el radio y el cúbito quedan cruzados, y entonces «medial» y «lateral» del antebrazo cambian de sitio. Sin ese detalle, la mitad de las descripciones del miembro superior salen invertidas.',
  },
  {
    id: 'A2-T03',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Plano sagital: qué divide y qué movimientos ocurren en él',
    reverso:
      'Divide el cuerpo en mitad derecha y mitad izquierda. En él ocurren la flexión y la extensión. Su eje perpendicular es el TRANSVERSAL o latero-lateral.',
  },
  {
    id: 'A2-T04',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Plano frontal: qué divide y qué movimientos ocurren en él',
    reverso:
      'Divide el cuerpo en parte anterior y parte posterior. En él ocurren la abducción, la aducción y la flexión lateral. Su eje perpendicular es el SAGITAL o anteroposterior. También se le llama coronal.',
  },
  {
    id: 'A2-T05',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Plano transversal: qué divide y qué movimientos ocurren en él',
    reverso:
      'Divide el cuerpo en parte superior y parte inferior. En él ocurren las rotaciones interna y externa. Su eje perpendicular es el LONGITUDINAL o vertical. También se le llama horizontal o axial.',
  },
  {
    id: 'A2-T06',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'dato',
    frente: 'La trampa de los ejes',
    reverso:
      'EL EJE ES PERPENDICULAR AL PLANO, no paralelo. Sagital → eje transversal. Frontal → eje sagital. Transversal → eje longitudinal. Imagina el eje como el clavo alrededor del que gira el segmento: para flexionar el codo, el clavo lo atraviesa de lado a lado.',
  },
  {
    id: 'A2-T07',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'clasificacion',
    frente: 'Superior/inferior y anterior/posterior',
    reverso:
      'Superior o craneal: hacia la cabeza. Inferior o caudal: hacia los pies. Anterior o ventral: hacia el frente. Posterior o dorsal: hacia la espalda.',
  },
  {
    id: 'A2-T08',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'clasificacion',
    frente: 'Medial/lateral y proximal/distal',
    reverso:
      'Medial: más cerca de la línea media del cuerpo. Lateral: más lejos de ella. Proximal: más cerca del punto donde el miembro se une al tronco. Distal: más lejos de ese punto.',
  },
  {
    id: 'A2-T09',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'dato',
    frente: '¿Qué limitación tienen «proximal» y «distal»?',
    reverso:
      'Solo se usan en los miembros y son RELATIVOS: el codo es proximal respecto a la muñeca y distal respecto al hombro. Una pregunta que diga «el codo es distal» sin decir respecto a qué está mal formulada.',
  },
  {
    id: 'A2-T10',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Flexión y extensión',
    reverso:
      'Flexión: disminuye el ángulo entre dos segmentos. Extensión: lo aumenta, hasta devolverlo a la posición anatómica. Las dos ocurren en el plano sagital, sobre el eje transversal.',
  },
  {
    id: 'A2-T11',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Abducción y aducción, y cómo no confundirlas',
    reverso:
      'Abducción: aleja el segmento de la línea media. Aducción: lo acerca. El truco es la d: a-D-ucción aDDiciona, suma, acerca al cuerpo. Separar los brazos en cruz es abducción de hombro; bajarlos al costado, aducción. Plano frontal.',
  },
  {
    id: 'A2-T12',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: '¿Qué es la circunducción?',
    reverso:
      'La combinación encadenada de flexión, abducción, extensión y aducción: el segmento describe un cono. El brazo haciendo círculos. No es un movimiento simple, es una secuencia de cuatro.',
  },
  {
    id: 'A2-T13',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'definicion',
    frente: 'Pronación y supinación',
    reverso:
      'Giro del antebrazo. En SUPINACIÓN la palma mira hacia arriba; en PRONACIÓN, hacia abajo. Se recuerda con la sopa: su-pinación es la mano que sostiene el plato de sopa.',
  },
  {
    id: 'A2-T14',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'clasificacion',
    frente: 'Movimientos propios del tobillo y del pie',
    reverso:
      'Flexión dorsal: sube la punta del pie hacia la tibia. Flexión plantar: la aleja, como al ponerse de puntillas. Inversión: la planta mira hacia dentro. Eversión: la planta mira hacia fuera.',
  },
  {
    id: 'A2-T15',
    modulo: 'a2-terminologia-anatomica',
    tipo: 'dato',
    frente: '«Sube el brazo»: ¿por qué es una instrucción ambigua?',
    reverso:
      'Porque puede ser flexión de hombro —el brazo sube por delante, plano sagital— o abducción —sube por el lado, plano frontal—. Son dos ejercicios distintos, con músculos distintos y con implicaciones distintas para un hombro lesionado.',
  },
];
