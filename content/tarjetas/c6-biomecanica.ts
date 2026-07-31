// content/tarjetas/c6-biomecanica.ts
// C6 · Biomecánica. 15 tarjetas.
// El módulo no tiene datos duros propios en content/datos-duros.ts: lo que cae
// aquí son clasificaciones y dos fórmulas. Las tarjetas cubren los tres géneros
// de palanca con su ejemplo, las tres leyes de Newton, el centro de gravedad y
// la relación fuerza-velocidad que explica dónde está el pico de potencia.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C6-T01',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: 'Cinética y cinemática',
    reverso:
      'Cinemática: describe el movimiento —posición, velocidad, aceleración, ángulos— sin atender a sus causas. Cinética: estudia las fuerzas que lo producen o lo modifican. Cinemática es el «qué pasa»; cinética, el «por qué pasa».',
  },
  {
    id: 'C6-T02',
    modulo: 'c6-biomecanica',
    tipo: 'clasificacion',
    frente: 'Los tres géneros de palanca',
    reverso:
      'Primer género (interapoyo): el apoyo en medio — la cabeza sobre el atlas. Segundo género (interresistencia): la resistencia en medio — ponerse de puntillas. Tercer género (interpotencia): la potencia en medio — flexión de codo con el bíceps. El nombre dice qué queda en el centro.',
  },
  {
    id: 'C6-T03',
    modulo: 'c6-biomecanica',
    tipo: 'dato',
    frente: '¿Qué género de palanca predomina en el cuerpo humano?',
    reverso:
      'El tercer género, porque los músculos se insertan muy cerca de la articulación. Pierde ventaja mecánica y gana velocidad y amplitud: el cuerpo cambió fuerza por velocidad.',
  },
  {
    id: 'C6-T04',
    modulo: 'c6-biomecanica',
    tipo: 'formula',
    frente: 'Ventaja mecánica de una palanca',
    reverso:
      'VM = brazo de potencia ÷ brazo de resistencia. El segundo género siempre tiene VM > 1 (gana fuerza); el tercero siempre VM < 1 (gana velocidad). Ej.: 12 cm ÷ 30 cm = 0,40.',
  },
  {
    id: 'C6-T05',
    modulo: 'c6-biomecanica',
    tipo: 'formula',
    frente: 'Momento de una fuerza (torque)',
    reverso:
      'Momento = fuerza × brazo de palanca, en N·m. Duplicar la distancia al eje duplica el momento sin tocar el peso: por eso una mancuerna con el brazo extendido cuesta mucho más que pegada al torso.',
  },
  {
    id: 'C6-T06',
    modulo: 'c6-biomecanica',
    tipo: 'clasificacion',
    frente: 'Las tres leyes de Newton',
    reverso:
      '1ª — Inercia: un cuerpo mantiene su estado salvo que actúe una fuerza. 2ª — F = m × a. 3ª — Acción y reacción: a toda acción le corresponde una reacción igual y de sentido contrario. La tercera explica por qué el velocista avanza empujando el suelo.',
  },
  {
    id: 'C6-T07',
    modulo: 'c6-biomecanica',
    tipo: 'dato',
    frente: '¿Dónde está el centro de gravedad en posición anatómica?',
    reverso:
      'En torno al 55 % de la estatura, a la altura de la segunda vértebra sacra. Algo más alto en hombres que en mujeres. No es el 50 %: la masa no se reparte simétricamente de arriba abajo.',
  },
  {
    id: 'C6-T08',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: '¿Puede el centro de gravedad quedar fuera del cuerpo?',
    reverso:
      'Sí, en cuanto el cuerpo cambia de forma. Es un punto teórico donde se concentraría toda la masa. En el salto Fosbury el cuerpo arqueado pasa por encima del listón mientras su centro de gravedad pasa por debajo: ahí está la ventaja del estilo.',
  },
  {
    id: 'C6-T09',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: '¿Qué es la base de sustentación?',
    reverso:
      'La superficie delimitada por los puntos de apoyo MÁS el área comprendida entre ellos. Con los pies separados la base es el rectángulo entero, no las dos plantas: cuenta el hueco, no solo el apoyo.',
  },
  {
    id: 'C6-T10',
    modulo: 'c6-biomecanica',
    tipo: 'clasificacion',
    frente: '¿Qué aumenta la estabilidad de un cuerpo?',
    reverso:
      'Base de sustentación más amplia · centro de gravedad más bajo · mayor masa · proyección del centro de gravedad lejos del borde de la base. Se pierde el equilibrio cuando esa proyección sale de la base.',
  },
  {
    id: 'C6-T11',
    modulo: 'c6-biomecanica',
    tipo: 'formula',
    frente: 'Potencia mecánica',
    reverso:
      'P = F × v, en vatios. 500 N a 1,2 m/s = 600 W. Pero 800 N a 0,4 m/s solo dan 320 W: más peso y menos potencia.',
  },
  {
    id: 'C6-T12',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: '¿Con qué carga se alcanza la potencia máxima?',
    reverso:
      'Con cargas MEDIAS, nunca con el 1RM. Fuerza y velocidad se comportan de forma inversa, así que su producto es máximo en la zona intermedia. Por eso el trabajo explosivo se prescribe por velocidad de ejecución y no por peso.',
  },
  {
    id: 'C6-T13',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: 'Cadena cinemática abierta y cerrada',
    reverso:
      'Abierta: el extremo distal se mueve libre — extensión de rodilla en máquina. Cerrada: el extremo distal está fijo contra una resistencia — sentadilla. Cerrada reparte la carga entre varias articulaciones; abierta la concentra.',
  },
  {
    id: 'C6-T14',
    modulo: 'c6-biomecanica',
    tipo: 'definicion',
    frente: '¿Qué caracteriza a un corredor eficiente?',
    reverso:
      'Poca oscilación vertical, buen aprovechamiento de la energía elástica del apoyo (ciclo de estiramiento-acortamiento) y un contacto del pie que no cae muy por delante del centro de gravedad. El corredor eficiente avanza, no sube ni frena.',
  },
  {
    id: 'C6-T15',
    modulo: 'c6-biomecanica',
    tipo: 'formula',
    frente: '¿De qué depende la velocidad de carrera?',
    reverso:
      'Velocidad = frecuencia de zancada × amplitud de zancada. Las dos se compensan entre sí: crecer en amplitud sobrepasando el centro de gravedad introduce frenado en cada apoyo, así que más amplitud no siempre es más velocidad.',
  },
];
