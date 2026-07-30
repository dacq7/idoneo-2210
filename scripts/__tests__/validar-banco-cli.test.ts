import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(__dirname, '..', '..');

/**
 * Única prueba de subproceso del proyecto. validarCatalogo() cubre la lógica;
 * esto cubre lo que ella no puede: que el CLI real —con el contenido real de
 * content/ y el readdir de content/teoria/— siga saliendo 0 e imprimiendo el
 * informe. Es la red que atrapa un error de cableado entre CLI y función pura.
 */
describe('CLI validar-banco', () => {
  it('sale 0 y dice "Todo en orden." con el contenido real del repo', async () => {
    const { stdout } = await ejecutar('npx', ['tsx', 'scripts/validar-banco.ts'], {
      cwd: RAIZ,
      timeout: 120_000,
    });
    expect(stdout).toContain('Validación del banco — Idóneo 2210');
    expect(stdout).toContain('Módulos: 29');
    expect(stdout).toContain('Todo en orden.');
  }, 130_000);
});
