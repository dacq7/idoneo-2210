// content/tarjetas/d6-flexibilidad.ts
// D6 · Capacidad física: flexibilidad. 15 tarjetas.
// El eje del mazo es la distinción movilidad / elasticidad / flexibilidad, que
// es donde el módulo se gana o se pierde, más los parámetros numéricos que se
// preguntan con cifra exacta: duraciones del estático, protocolo de FNP y los
// dos ceros posibles del cajón de sit and reach.
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'D6-T01',
    modulo: 'd6-flexibilidad',
    tipo: 'formula',
    frente: '¿De qué se compone la flexibilidad?',
    reverso:
      'Flexibilidad = movilidad articular + elasticidad muscular. Es el resultado de las dos: cuánta amplitud de movimiento consigue de verdad el deportista.',
  },
  {
    id: 'D6-T02',
    modulo: 'd6-flexibilidad',
    tipo: 'definicion',
    frente: '¿Qué es la movilidad articular?',
    reverso:
      'La capacidad de recorrido que permite una articulación. Depende de la articulación misma: forma de las superficies óseas, cápsula y ligamentos. No depende del músculo.',
  },
  {
    id: 'D6-T03',
    modulo: 'd6-flexibilidad',
    tipo: 'definicion',
    frente: '¿Qué es la elasticidad muscular?',
    reverso:
      'La capacidad del músculo de deformarse y RECUPERAR su forma y longitud originales al cesar la fuerza. Recuperar, no alargarse: alargarse es extensibilidad. La goma que vuelve es elástica; la plastilina que se queda estirada, no.',
  },
  {
    id: 'D6-T04',
    modulo: 'd6-flexibilidad',
    tipo: 'clasificacion',
    frente: 'Flexibilidad activa y flexibilidad pasiva',
    reverso:
      'Activa: la amplitud alcanzada por la propia contracción muscular, sin ayuda. Pasiva: la alcanzada con una fuerza externa (compañero, gravedad, aparato). La pasiva siempre es mayor que la activa.',
  },
  {
    id: 'D6-T05',
    modulo: 'd6-flexibilidad',
    tipo: 'formula',
    frente: '¿Qué es el déficit de flexibilidad y cómo se calcula?',
    reverso:
      'Déficit = flexibilidad pasiva − flexibilidad activa. Es el rango que el deportista tiene disponible pero no puede usar solo. Ejemplo: 90° pasiva − 68° activa = 22°. Se reduce con fuerza en rangos amplios, no estirando más.',
  },
  {
    id: 'D6-T06',
    modulo: 'd6-flexibilidad',
    tipo: 'clasificacion',
    frente: 'Los 4 procedimientos de estiramiento',
    reverso:
      'Estático: llegar al final del rango y mantener. Dinámico: movimientos activos controlados hasta el límite, sin rebote. Balístico: con rebotes, impulso e inercia. FNP: alternar estiramiento con contracciones del propio músculo.',
  },
  {
    id: 'D6-T07',
    modulo: 'd6-flexibilidad',
    tipo: 'dato',
    frente: 'Parámetros del estiramiento estático',
    reverso:
      '10–30 s de mantenimiento por repetición, 2 a 4 repeticiones por grupo muscular hasta acumular unos 60 s, mínimo 2–3 días por semana. Menos de 10 s no alcanza a producir efecto; más de 30 s en una sola repetición no aporta nada extra.',
  },
  {
    id: 'D6-T08',
    modulo: 'd6-flexibilidad',
    tipo: 'definicion',
    frente: '¿Por qué el estiramiento balístico es contraproducente?',
    reverso:
      'Porque el rebote es un estiramiento rápido, y la velocidad del alargamiento es justo lo que activa el reflejo miotático: el huso muscular ordena que el músculo se contraiga para defenderse. Se empuja y se frena a la vez.',
  },
  {
    id: 'D6-T09',
    modulo: 'd6-flexibilidad',
    tipo: 'clasificacion',
    frente: 'Los 4 pasos del método FNP mantener-relajar',
    reverso:
      '1) Estiramiento pasivo hasta el primer límite, unos 10 s. 2) Contracción isométrica submáxima del músculo estirado, unos 6 s. 3) Relajar 2–3 s. 4) Nuevo estiramiento pasivo más amplio, de 10 a 30 s.',
  },
  {
    id: 'D6-T10',
    modulo: 'd6-flexibilidad',
    tipo: 'definicion',
    frente: '¿Qué añade la variante contraer-relajar-contraer el antagonista?',
    reverso:
      'Que el nuevo rango no se alcanza con ayuda externa sino contrayendo activamente el músculo opuesto. Gana rango y a la vez fuerza para usarlo, que es lo que reduce el déficit de flexibilidad.',
  },
  {
    id: 'D6-T11',
    modulo: 'd6-flexibilidad',
    tipo: 'definicion',
    frente: 'Reflejo miotático y reflejo miotático inverso',
    reverso:
      'Miotático: el huso muscular detecta el estiramiento rápido y ordena contraer el propio músculo. Inverso o inhibición autógena: el órgano tendinoso de Golgi detecta la tensión alta mantenida y ordena relajarlo. El FNP se explica clásicamente por el inverso y por la inhibición recíproca.',
  },
  {
    id: 'D6-T12',
    modulo: 'd6-flexibilidad',
    tipo: 'dato',
    frente: '¿Qué estiramiento va en el calentamiento y cuál no?',
    reverso:
      'En el calentamiento van los dinámicos. El estático prolongado (más de 60 s por grupo muscular) justo antes de un esfuerzo de fuerza, potencia o velocidad baja el rendimiento de forma aguda. El estático de desarrollo va en la vuelta a la calma o en sesión aparte.',
  },
  {
    id: 'D6-T13',
    modulo: 'd6-flexibilidad',
    tipo: 'dato',
    frente: 'Factores que modifican la flexibilidad',
    reverso:
      'Edad: máxima en la infancia, se pierde desde muy temprano. Sexo: en general mayor en mujeres. Temperatura: el calor la aumenta, el frío la reduce. Hora: menor al levantarse, mayor por la tarde. Sedentarismo: la reduce.',
  },
  {
    id: 'D6-T14',
    modulo: 'd6-flexibilidad',
    tipo: 'dato',
    frente: 'Sit and reach: qué mide y dónde está el cero',
    reverso:
      'Mide sobre todo la extensibilidad de los isquiosurales. En el cajón clásico el cero está en la planta del pie: pasar de las puntas da valores positivos y no llegar, negativos. En los cajones calibrados la planta marca 23 cm y todos los valores son positivos. Hay que mirar qué cajón se usa antes de anotar.',
  },
  {
    id: 'D6-T15',
    modulo: 'd6-flexibilidad',
    tipo: 'formula',
    frente: 'Goniometría: qué mide y cómo se calcula la amplitud',
    reverso:
      'Mide la amplitud de movimiento de una articulación concreta en grados. Eje del goniómetro sobre el centro de rotación, brazo fijo en el segmento que no se mueve y brazo móvil en el que sí. ADM = ángulo final − ángulo inicial. La posición anatómica es 0°.',
  },
];
