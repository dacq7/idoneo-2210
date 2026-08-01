// src/lib/__tests__/calculos.test.ts
// §19 pide: las 5 fórmulas de FCmáx · densidad · MET · IMC · conversión de pulso.
//
// Lo que estas pruebas cuidan no es que la aritmética funcione —eso lo hace
// JavaScript— sino que **las constantes sean las correctas**. Un 220 que se
// convierte en 210, o un 3,5 en 3,0, no rompe ningún tipo, no falla ningún
// build y enseña mal a alguien que se está examinando. Por eso cada caso
// compara contra el valor que el propio banco de ítems usa.

import { describe, expect, it } from 'vitest';
import {
  aNumero,
  categoriaIMC,
  densidad,
  fcReserva,
  FORMULAS_FCMAX,
  gastoCardiaco,
  imc,
  indiceCinturaCadera,
  karvonen,
  metsDesdeVo2,
  ML_KG_MIN_POR_MET,
  pulsoALpm,
  redondear,
  vo2DesdeMets,
  zonasEnLpm,
} from '../calculos';

describe('FORMULAS_FCMAX — las cinco, con su población', () => {
  // Los valores esperados salen de los ítems C5-011 (Fox, 40 años → 180) y
  // C5-017 (Tanaka, 28 años → 188,4). Si una constante cambia, el banco y la
  // calculadora dejan de decir lo mismo y el usuario ve dos verdades.
  it('Fox: 220 − edad', () => {
    expect(FORMULAS_FCMAX.fox.calcular(40)).toBe(180);
    expect(FORMULAS_FCMAX.fox.calcular(28)).toBe(192);
  });

  it('Astrand: 216,6 − 0,84 × edad', () => {
    expect(FORMULAS_FCMAX.astrand.calcular(40)).toBeCloseTo(183, 1);
  });

  it('Tanaka: 208 − 0,7 × edad', () => {
    expect(FORMULAS_FCMAX.tanaka.calcular(28)).toBeCloseTo(188.4, 1);
    expect(FORMULAS_FCMAX.tanaka.calcular(40)).toBeCloseTo(180, 1);
  });

  it('Gellish: 207 − 0,7 × edad', () => {
    expect(FORMULAS_FCMAX.gellish.calcular(40)).toBeCloseTo(179, 1);
  });

  it('Gulati: 206 − 0,88 × edad', () => {
    expect(FORMULAS_FCMAX.gulati.calcular(50)).toBeCloseTo(162, 1);
  });

  it('cada fórmula declara para qué población se validó', () => {
    // No es decoración: elegir Fox para una mujer de 55 años es el error que
    // C2 enseña a evitar, y la calculadora solo puede avisarlo si el dato está.
    for (const formula of Object.values(FORMULAS_FCMAX)) {
      expect(formula.poblacion.length).toBeGreaterThan(3);
      expect(formula.etiqueta).toMatch(/\(\d{4}\)/);
    }
  });

  it('Gulati da valores más bajos que Fox en la misma edad', () => {
    // La razón de que exista una fórmula para mujeres: Fox sobreestima.
    expect(FORMULAS_FCMAX.gulati.calcular(55)).toBeLessThan(
      FORMULAS_FCMAX.fox.calcular(55),
    );
  });
});

describe('fcReserva y karvonen', () => {
  it('la reserva es la diferencia entre máxima y reposo', () => {
    expect(fcReserva(180, 60)).toBe(120);
  });

  it('Karvonen aplica la intensidad sobre la RESERVA, no sobre la máxima', () => {
    // 60 + (120 × 0,70) = 144. El porcentaje simple de FCmáx daría 126, y
    // confundirlos es exactamente lo que el ítem C5-011 penaliza.
    expect(karvonen(180, 60, 0.7)).toBe(144);
    expect(karvonen(180, 60, 0.7)).not.toBe(180 * 0.7);
  });

  it('al 100 % Karvonen devuelve la frecuencia máxima', () => {
    expect(karvonen(180, 60, 1)).toBe(180);
  });
});

describe('zonasEnLpm', () => {
  const zonas = zonasEnLpm(180);

  it('devuelve las cuatro zonas en orden', () => {
    expect(zonas.map((z) => z.zona)).toEqual(['R0', 'R1', 'R2', 'R3']);
  });

  it('R1 empieza en el 65 % de la FCmáx', () => {
    // 180 × 0,65 = 117, que es la respuesta del ítem C5-011.
    expect(zonas[1].desde).toBe(117);
    expect(zonas[1].hasta).toBe(135);
  });

  it('R2 usa 80–90 % de FCmáx, no 75–85 % de VO₂máx', () => {
    // Los dos rangos describen la misma zona en escalas distintas. Una
    // calculadora que devuelve lpm tiene que usar el de frecuencia cardíaca.
    expect(zonas[2].desde).toBe(144);
    expect(zonas[2].hasta).toBe(162);
  });

  it('R3 llega al 95 % y no al 100 %', () => {
    expect(zonas[3].hasta).toBe(171);
  });

  it('las zonas no se solapan y R1 termina antes de que empiece R2', () => {
    expect(zonas[1].hasta).toBeLessThan(zonas[2].desde);
  });

  it('cada zona apunta al módulo que la explica', () => {
    for (const z of zonas) expect(z.modulo).toBe('c5-umbrales-zonas');
  });
});

describe('gastoCardiaco', () => {
  it('devuelve litros por minuto con el volumen sistólico en mL', () => {
    // 70 lpm × 70 mL = 4900 mL/min = 4,9 L/min.
    expect(gastoCardiaco(70, 70)).toBeCloseTo(4.9, 2);
  });
});

describe('pulsoALpm', () => {
  it('multiplica por 4, 6 y 10 según la ventana de conteo', () => {
    // Los tres factores del dato duro DD-028.
    expect(pulsoALpm(30, 15)).toBe(120);
    expect(pulsoALpm(20, 10)).toBe(120);
    expect(pulsoALpm(12, 6)).toBe(120);
    expect(pulsoALpm(60, 30)).toBe(120);
  });
});

describe('densidad', () => {
  it('45 s de trabajo con 15 s de pausa dan 75 %', () => {
    // El caso que pide §18.3 explícitamente.
    expect(densidad(45, 15)).toBeCloseTo(0.75, 4);
  });

  it('divide entre el TOTAL, no entre la pausa', () => {
    // 40/20 = 2 sería el error; el cociente nunca puede pasar de 1.
    expect(densidad(40, 20)).toBeCloseTo(0.667, 3);
    expect(densidad(40, 20)).toBeLessThanOrEqual(1);
  });

  it('sin pausa la densidad es 1', () => {
    expect(densidad(30, 0)).toBe(1);
  });

  it('con los dos campos vacíos devuelve 0 y no NaN', () => {
    // La calculadora arranca sin valores: un NaN en pantalla parece un fallo.
    expect(densidad(0, 0)).toBe(0);
    expect(Number.isNaN(densidad(0, 0))).toBe(false);
  });
});

describe('MET y VO₂', () => {
  it('1 MET son 3,5 ml/kg/min', () => {
    expect(ML_KG_MIN_POR_MET).toBe(3.5);
    expect(vo2DesdeMets(1)).toBe(3.5);
  });

  it('convierte en las dos direcciones sin perder el valor', () => {
    expect(metsDesdeVo2(35)).toBeCloseTo(10, 4);
    expect(vo2DesdeMets(10)).toBeCloseTo(35, 4);
    expect(metsDesdeVo2(vo2DesdeMets(7.3))).toBeCloseTo(7.3, 6);
  });
});

describe('imc y antropometría', () => {
  it('usa la estatura en METROS', () => {
    // 70 / 1,75² = 22,86. Con la estatura en cm el resultado sería absurdo.
    expect(imc(70, 1.75)).toBeCloseTo(22.86, 2);
  });

  it('con estatura 0 devuelve 0 y no infinito', () => {
    expect(imc(70, 0)).toBe(0);
    expect(Number.isFinite(imc(70, 0))).toBe(true);
  });

  it('categoriaIMC respeta los cortes de la OMS', () => {
    expect(categoriaIMC(17)).toBe('Bajo peso');
    expect(categoriaIMC(22)).toBe('Normopeso');
    expect(categoriaIMC(27)).toBe('Sobrepeso');
    expect(categoriaIMC(32)).toBe('Obesidad');
  });

  it('categoriaIMC trata los límites por abajo', () => {
    // 18,5 ya es normopeso y 25 ya es sobrepeso: el corte pertenece al tramo
    // superior, como en los baremos de la OMS.
    expect(categoriaIMC(18.5)).toBe('Normopeso');
    expect(categoriaIMC(25)).toBe('Sobrepeso');
    expect(categoriaIMC(30)).toBe('Obesidad');
  });

  it('sin datos devuelve un guion en vez de una categoría', () => {
    expect(categoriaIMC(0)).toBe('—');
  });

  it('indiceCinturaCadera divide cintura entre cadera', () => {
    expect(indiceCinturaCadera(80, 100)).toBeCloseTo(0.8, 4);
    expect(indiceCinturaCadera(80, 0)).toBe(0);
  });
});

describe('aNumero — la coma decimal', () => {
  it('acepta coma, que es como escribe la gente', () => {
    // §13 regla 1. Sin esto, Number('126,2') es NaN y el campo parece roto.
    expect(aNumero('126,2')).toBeCloseTo(126.2, 4);
    expect(aNumero('126.2')).toBeCloseTo(126.2, 4);
  });

  it('devuelve null con el campo vacío o con basura', () => {
    expect(aNumero('')).toBeNull();
    expect(aNumero('   ')).toBeNull();
    expect(aNumero('abc')).toBeNull();
    expect(aNumero('12,3,4')).toBeNull();
  });

  it('acepta el cero y los negativos sin confundirlos con vacío', () => {
    expect(aNumero('0')).toBe(0);
    expect(aNumero('-3')).toBe(-3);
  });

  it('rechaza Infinity, que colaría como número finito falso', () => {
    expect(aNumero('Infinity')).toBeNull();
  });
});

describe('redondear', () => {
  it('redondea a un decimal por defecto', () => {
    expect(redondear(169.56)).toBe(169.6);
    expect(redondear(22.857, 2)).toBe(22.86);
  });

  it('con cero decimales devuelve entero', () => {
    expect(redondear(117.4, 0)).toBe(117);
  });
});
