// scripts/validar-banco.ts
// Se ejecuta con `tsx scripts/validar-banco.ts` desde el hook prebuild.
// Salida: código 0 (pasa) o 1 (falla el build).
//
// CLI delgado: lee el contenido real y el directorio de teoría, delega en
// validarCatalogo() —que es puro y testeable— e imprime. Ver ADR-005.

import fs from 'node:fs';
import path from 'node:path';

import { BLOQUES, MODULOS } from '../content/estructura';
import { BLUEPRINTS } from '../content/blueprint-examen';
import { ERRATAS } from '../content/erratas';
import { DATOS_DUROS } from '../content/datos-duros';
import { GLOSARIO } from '../content/glosario';
import { BANCO } from '../content/banco/indice';
import { TARJETAS } from '../content/tarjetas/indice';
import { validarCatalogo } from './validar-catalogo';

const DIR_TEORIA = path.join(process.cwd(), 'content', 'teoria');

/** Slugs con archivo de teoría. Devuelve un Set vacío si el directorio no existe. */
function leerSlugsConTeoria(): Set<string> {
  try {
    return new Set(
      fs
        .readdirSync(DIR_TEORIA)
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => f.slice(0, -'.mdx'.length)),
    );
  } catch {
    return new Set();
  }
}

async function main(): Promise<void> {
  const { errores, avisos, resumen } = await validarCatalogo({
    bloques: BLOQUES,
    modulos: MODULOS,
    erratas: ERRATAS,
    glosario: GLOSARIO,
    datosDuros: DATOS_DUROS,
    banco: BANCO,
    tarjetas: TARJETAS,
    blueprints: BLUEPRINTS,
    slugsConTeoria: leerSlugsConTeoria(),
  });

  console.log('');
  console.log('  Validación del banco — Idóneo 2210');
  console.log(
    `  Módulos: ${resumen.modulos} (${resumen.completos} completos, ${resumen.modulos - resumen.completos} en preparación)`,
  );
  console.log(
    `  Ítems: ${resumen.items} · Tarjetas: ${resumen.tarjetas} · Erratas: ${resumen.erratas} · Glosario: ${resumen.glosario}`,
  );
  console.log('');

  if (avisos.length > 0) {
    console.log(`  ${avisos.length} aviso(s):`);
    for (const a of avisos) console.log(`    · ${a}`);
    console.log('');
  }

  if (errores.length > 0) {
    console.error(`  ${errores.length} ERROR(ES) — el build se detiene:`);
    for (const e of errores) console.error(`    ✗ ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log('  Todo en orden.');
  console.log('');
}

main().catch((e) => {
  console.error('  El validador reventó:', e);
  process.exit(1);
});
