import { describe, expect, it } from 'vitest';
import {
  diasEntre,
  etiquetaCorta,
  formatearDuracion,
  soloFecha,
  sumarDias,
} from '@/lib/fechas';

describe('soloFecha', () => {
  it('recorta un ISO completo a YYYY-MM-DD', () => {
    expect(soloFecha('2026-07-29T20:45:12.345Z')).toBe('2026-07-29');
  });

  it('deja intacta una fecha que ya viene sin hora', () => {
    expect(soloFecha('2026-07-29')).toBe('2026-07-29');
  });
});

describe('diasEntre', () => {
  it('el mismo día son 0 días', () => {
    expect(diasEntre('2026-07-29', '2026-07-29')).toBe(0);
  });

  it('cuenta hacia adelante', () => {
    expect(diasEntre('2026-07-29', '2026-08-05')).toBe(7);
  });

  it('es negativo cuando la fecha final es anterior', () => {
    expect(diasEntre('2026-08-05', '2026-07-29')).toBe(-7);
  });

  it('cruza el fin de año', () => {
    expect(diasEntre('2026-12-30', '2027-01-02')).toBe(3);
  });

  it('cuenta el 29 de febrero en año bisiesto', () => {
    expect(diasEntre('2028-02-28', '2028-03-01')).toBe(2);
  });

  it('acepta un ISO completo y usa solo la fecha', () => {
    expect(diasEntre('2026-07-29T23:59:00Z', '2026-07-30T00:01:00Z')).toBe(1);
  });
});

describe('sumarDias', () => {
  it('cruza el fin de mes', () => {
    expect(sumarDias('2026-07-30', 3)).toBe('2026-08-02');
  });

  it('cruza el fin de año', () => {
    expect(sumarDias('2026-12-30', 5)).toBe('2027-01-04');
  });

  it('resta con días negativos', () => {
    expect(sumarDias('2026-01-02', -3)).toBe('2025-12-30');
  });

  it('sumar 0 días devuelve la misma fecha', () => {
    expect(sumarDias('2026-07-29', 0)).toBe('2026-07-29');
  });

  it('es inverso de diasEntre', () => {
    const desde = '2026-07-29';
    const dias = diasEntre(desde, '2026-09-15');
    expect(sumarDias(desde, dias)).toBe('2026-09-15');
  });
});

describe('etiquetaCorta', () => {
  it('incluye el día del mes y un mes abreviado, sin punto final', () => {
    const etiqueta = etiquetaCorta('2026-08-02');
    expect(etiqueta).toContain('2');
    expect(etiqueta).toMatch(/ago/i);
    expect(etiqueta.endsWith('.')).toBe(false);
  });

  it('no se desplaza de día por zona horaria', () => {
    // Se fija al mediodía UTC justamente para que ningún huso lo corra un día.
    expect(etiquetaCorta('2026-01-01')).toMatch(/\b1\b/);
  });
});

describe('formatearDuracion', () => {
  it('formatea por debajo del minuto', () => {
    expect(formatearDuracion(59)).toBe('00:59');
  });

  it('formatea minutos y segundos', () => {
    expect(formatearDuracion(125)).toBe('02:05');
  });

  it('cambia a H:MM:SS al llegar a la hora', () => {
    expect(formatearDuracion(3600)).toBe('1:00:00');
  });

  it('formatea los 120 minutos del simulacro final', () => {
    expect(formatearDuracion(7200)).toBe('2:00:00');
  });

  it('trunca los segundos fraccionarios', () => {
    expect(formatearDuracion(59.9)).toBe('00:59');
  });

  it('nunca devuelve negativos', () => {
    expect(formatearDuracion(-5)).toBe('00:00');
  });
});
