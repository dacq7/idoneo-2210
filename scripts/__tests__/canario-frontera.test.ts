// scripts/__tests__/canario-frontera.test.ts
// Proyecto `motores`, entorno node.
//
// El canario de ADR-010 solo sirve si sus sondas pueden CASAR. Este test
// protege la propiedad que hace que casen, y que no es evidente al leer el
// script: **una sonda con un carácter no ASCII nunca aparece literal en un
// chunk**, porque el minificador escapa esos caracteres en los literales de
// cadena (`í` → `\xed`, `ó` → `\xf3`). Una sonda acentuada da verde con la
// frontera rota, que es el peor fallo posible en un guardián.
//
// Es exactamente lo que le pasó a `Malondialdehído` —la sonda que ADR-014
// puso para `content/datos-duros.ts`— hasta el cierre del Paso 10: nació
// muerta y el canario reportó «frontera intacta» sin haber comprobado nada
// de ese archivo.
//
// Verificado por mutación: devolviendo la sonda a `Malondialdehído`, el
// primer caso falla; con `Mioglobina`, verde.

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SONDAS } from '../canario-frontera';

const RAIZ = process.cwd();

describe('sondas del canario de frontera (ADR-010)', () => {
  it('son ASCII imprimible: si no, no casarían nunca en un chunk minificado', () => {
    for (const sonda of SONDAS) {
      expect(
        /^[\x20-\x7E]+$/.test(sonda.aguja),
        `la sonda "${sonda.aguja}" tiene caracteres no ASCII: el minificador los escapa ` +
          `y el canario daría verde aunque ${sonda.fuente} se filtrara al cliente`,
      ).toBe(true);
    }
  });

  it('aparecen de verdad en el archivo de contenido que dicen vigilar', () => {
    for (const sonda of SONDAS) {
      const fuente = fs.readFileSync(path.join(RAIZ, sonda.fuente), 'utf8');
      expect(
        fuente.includes(sonda.aguja),
        `"${sonda.aguja}" ya no está en ${sonda.fuente}: la sonda quedó sin objeto`,
      ).toBe(true);
    }
  });

  // La otra forma de matar un canario es el falso POSITIVO: que la sonda salga
  // también de un archivo que sí llega al cliente legítimamente. Es lo que
  // quemó a `conceptosClave` en el Paso 8, que además es campo de `esqModulo` y
  // viaja dentro de `src/lib/esquemas.ts`.
  //
  // La condición correcta no es «única en el repo» —`osteomuscular` sale también
  // de `content/blueprint-examen.ts`, y ahí da igual: ADR-010 le prohíbe el
  // cliente a ese archivo igual que a `estructura.ts`, y además lo importa, así
  // que un acierto seguiría siendo una fuga real—. La condición es que la sonda
  // NO exista en `src/`, que es de donde salen los chunks legítimos.
  it('no salen de ningún archivo de src/: ahí nacería el falso positivo', () => {
    const archivos: string[] = [];
    (function recorrer(d: string) {
      for (const entrada of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entrada.name);
        if (entrada.isDirectory()) recorrer(p);
        else if (/\.(ts|tsx)$/.test(entrada.name)) archivos.push(p);
      }
    })(path.join(RAIZ, 'src'));

    for (const sonda of SONDAS) {
      // El comentario de `controlador-repaso.tsx` nombra las dos sondas al
      // explicar por qué siguen sirviendo. Es prosa, no dato: no cuenta.
      const conLaSonda = archivos
        .filter(
          (a) =>
            !a.endsWith('controlador-repaso.tsx') &&
            fs.readFileSync(a, 'utf8').includes(sonda.aguja),
        )
        .map((a) => path.relative(RAIZ, a));

      expect(
        conLaSonda,
        `"${sonda.aguja}" aparece en src/: el canario daría fuga sin que haya fuga`,
      ).toEqual([]);
    }
  });
});
