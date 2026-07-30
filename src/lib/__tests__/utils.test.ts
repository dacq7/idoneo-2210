import { describe, expect, it } from 'vitest';
import {
  bloqueDeRuta,
  claseAcentoBloque,
  CLASES_BLOQUE,
  cn,
  normalizar,
  porcentaje,
} from '@/lib/utils';
import { MODULOS } from '@/content/estructura';
import type { BloqueId } from '@/lib/tipos';

describe('cn', () => {
  it('une clases y resuelve el conflicto quedándose con la última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('descarta valores falsos', () => {
    expect(cn('flex', false && 'hidden', undefined, 'gap-2')).toBe('flex gap-2');
  });
});

describe('normalizar', () => {
  it('quita tildes y pasa a minúsculas', () => {
    expect(normalizar('Umbral Aeróbico')).toBe('umbral aerobico');
  });

  it('recorta espacios de los extremos', () => {
    expect(normalizar('  MLSS  ')).toBe('mlss');
  });

  it('normaliza la ñ sin borrar la letra', () => {
    expect(normalizar('Diseño')).toBe('diseno');
  });

  it('deja igual un texto que ya está normalizado', () => {
    expect(normalizar('vo2max')).toBe('vo2max');
  });

  it('permite comparar dos escrituras del mismo término', () => {
    expect(normalizar('Potencia Aeróbica')).toBe(normalizar('potencia aerobica'));
  });
});

describe('porcentaje', () => {
  it('calcula y redondea', () => {
    expect(porcentaje(1, 3)).toBe(33);
    expect(porcentaje(2, 3)).toBe(67);
  });

  it('devuelve 0 cuando el total es 0, sin dividir por cero', () => {
    expect(porcentaje(0, 0)).toBe(0);
  });

  it('devuelve 100 cuando todo está correcto', () => {
    expect(porcentaje(25, 25)).toBe(100);
  });
});

describe('claseAcentoBloque', () => {
  it('usa el color del bloque cuando hay uno en contexto', () => {
    expect(claseAcentoBloque('C')).toBe('bg-bloque-c');
  });

  it('cae al azul acero de marca cuando no hay bloque', () => {
    expect(claseAcentoBloque(null)).toBe('bg-primary');
  });

  it('devuelve siempre una clase del mapa estático', () => {
    const bloques: BloqueId[] = ['A', 'B', 'C', 'D'];
    for (const bloque of bloques) {
      expect(claseAcentoBloque(bloque)).toBe(CLASES_BLOQUE[bloque].fondo);
    }
  });
});

describe('bloqueDeRuta', () => {
  it('deriva el bloque del prefijo del slug del módulo', () => {
    expect(bloqueDeRuta('/modulos/c5-umbrales-zonas')).toBe('C');
    expect(bloqueDeRuta('/modulos/a1-celula')).toBe('A');
    expect(bloqueDeRuta('/modulos/d2-carga')).toBe('D');
  });

  it('acierta con LOS 29 módulos reales de content/estructura.ts', () => {
    // La heurística del prefijo solo es válida si los slugs la respetan: este
    // test es el que impide que un slug nuevo del Paso 15–17 rompa el riel en
    // silencio, mostrando el bloque equivocado en el encabezado.
    for (const modulo of MODULOS) {
      expect(bloqueDeRuta(`/modulos/${modulo.slug}`)).toBe(modulo.bloque);
    }
  });

  it('conserva el bloque en las subrutas de etapa del módulo', () => {
    expect(bloqueDeRuta('/modulos/c5-umbrales-zonas/tarjetas')).toBe('C');
    expect(bloqueDeRuta('/modulos/c5-umbrales-zonas/practica')).toBe('C');
    expect(bloqueDeRuta('/modulos/c5-umbrales-zonas/quiz')).toBe('C');
  });

  it('lee el id de bloque de /bloques y de /simulacros/bloque', () => {
    expect(bloqueDeRuta('/bloques/B')).toBe('B');
    expect(bloqueDeRuta('/simulacros/bloque/D')).toBe('D');
  });

  it('acepta el id en minúscula', () => {
    expect(bloqueDeRuta('/bloques/b')).toBe('B');
    expect(bloqueDeRuta('/simulacros/bloque/d')).toBe('D');
  });

  it('tolera la barra final y las barras repetidas', () => {
    expect(bloqueDeRuta('/bloques/C/')).toBe('C');
    expect(bloqueDeRuta('//modulos//c5-umbrales-zonas')).toBe('C');
  });

  it('devuelve null en las rutas sin bloque en contexto', () => {
    for (const ruta of ['/', '/repaso', '/simulacros', '/simulacros/final', '/ajustes', '/glosario', '/plan']) {
      expect(bloqueDeRuta(ruta)).toBeNull();
    }
  });

  it('devuelve null en los índices, que no tienen un bloque concreto', () => {
    expect(bloqueDeRuta('/modulos')).toBeNull();
    expect(bloqueDeRuta('/bloques')).toBeNull();
  });

  it('devuelve null ante una letra que no es un bloque', () => {
    expect(bloqueDeRuta('/bloques/E')).toBeNull();
    expect(bloqueDeRuta('/modulos/z9-inventado')).toBeNull();
    expect(bloqueDeRuta('/simulacros/bloque/9')).toBeNull();
  });

  it('no confunde /simulacros/final con un id de bloque', () => {
    // 'final' empieza por f, pero además el segundo segmento no es 'bloque':
    // ninguna de las dos vías debe dar un bloque.
    expect(bloqueDeRuta('/simulacros/final')).toBeNull();
    expect(bloqueDeRuta('/simulacros/bloque')).toBeNull();
  });

  it('no revienta con una cadena vacía', () => {
    expect(bloqueDeRuta('')).toBeNull();
  });
});

describe('CLASES_BLOQUE', () => {
  const bloques: BloqueId[] = ['A', 'B', 'C', 'D'];

  it('tiene una entrada por bloque', () => {
    expect(Object.keys(CLASES_BLOQUE).sort()).toEqual(bloques);
  });

  it('usa clases estáticas y completas, no interpoladas', () => {
    // Tailwind necesita ver la clase entera en el código fuente: si alguna vez
    // alguien la construye con plantilla, el color del bloque deja de existir.
    for (const bloque of bloques) {
      const sufijo = bloque.toLowerCase();
      expect(CLASES_BLOQUE[bloque].fondo).toBe(`bg-bloque-${sufijo}`);
      expect(CLASES_BLOQUE[bloque].texto).toBe(`text-bloque-${sufijo}`);
      expect(CLASES_BLOQUE[bloque].borde).toBe(`border-bloque-${sufijo}`);
      expect(CLASES_BLOQUE[bloque].suave).toBe(`bg-bloque-${sufijo}-suave`);
    }
  });
});
