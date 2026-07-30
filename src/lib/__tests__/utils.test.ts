import { describe, expect, it } from 'vitest';
import { CLASES_BLOQUE, cn, normalizar, porcentaje } from '@/lib/utils';
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
