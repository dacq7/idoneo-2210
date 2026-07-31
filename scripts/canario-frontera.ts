// scripts/canario-frontera.ts
// Guardián de ADR-010: ningún Client Component importa `content/estructura`.
//
// Se ejecuta con `npx tsx scripts/canario-frontera.ts` DESPUÉS de `npm run build`.
// Salida: 0 (frontera intacta) o 1 (hay fuga).
//
// ══ POR QUÉ DEJÓ DE VALER EL `grep` ══
//
// Hasta el Paso 9 el canario era `grep -rl "osteomuscular" .next/static/chunks/`,
// y bastaba porque NINGÚN contenido llegaba a un chunk de cliente. El Paso 10 lo
// cambió: `/repaso` carga las tarjetas y los ítems que su cola menciona con
// `import()` dinámico, que es exactamente para lo que §2.2 y §10.2 regla 4
// hicieron `content/banco/` y `content/tarjetas/` client-safe. Desde entonces hay
// contenido en `.next/static/chunks/` **a propósito**, y un grep a secas sobre esa
// carpeta da un falso positivo.
//
// La distinción que importa no es «¿está en un chunk?» sino **«¿lo descarga el
// usuario sin pedirlo?»**. Un chunk diferido solo viaja cuando el usuario abre la
// ruta que lo necesita; uno del manifiesto viaja siempre.
//
// Así que el canario mira solo los chunks que `app-build-manifest.json` declara
// para cada ruta —los de carga ansiosa— y deja fuera los que Next parte por un
// `import()`. Lo que se busca ahí es contenido que NO debería viajar nunca:
//
//   - `content/estructura.ts` — los 29 módulos con objetivos y conceptos clave.
//     Es lo que ADR-010 prohíbe, y lo que ya se coló una vez por `riel-bloques`.
//   - `content/datos-duros.ts` — 70 entradas que solo consume `/ultima-noche`.
//
// NO se buscan cadenas de `banco/` ni de `tarjetas/`: esas viajan al cliente por
// diseño desde el Paso 10, y buscarlas volvería a dar el falso positivo que este
// archivo existe para evitar.

import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), '.next');

/**
 * Sondas: valores únicos en todo el repo, no nombres de campo.
 *
 * **Toda sonda debe ser ASCII puro, y el guardián de abajo lo obliga.** El
 * minificador escapa cada carácter no ASCII de los literales de cadena
 * (`í` → `\xed`, `ó` → `\xf3`), así que una sonda acentuada NO aparece nunca
 * literal en un chunk y el canario daría verde con la frontera rota. Es lo que
 * le pasó a `Malondialdehído`, la sonda de `content/datos-duros.ts` que
 * introdujo ADR-014: nació muerta y la sustituye `Mioglobina` (`DD-066`), que
 * cumple los mismos tres criterios —es un valor y no un nombre de campo, sale
 * de un archivo que ningún Client Component puede importar y es única en el
 * repo— y además es ASCII.
 */
export const SONDAS = [
  {
    aguja: 'osteomuscular',
    fuente: 'content/estructura.ts',
    // Un nombre de campo (`conceptosClave`) NO sirve de sonda: viaja legítimamente
    // dentro de los esquemas de Zod. Ya quemó un canario en el Paso 8.
    porque: 'los 29 módulos con sus objetivos y conceptos clave',
  },
  {
    aguja: 'Mioglobina',
    fuente: 'content/datos-duros.ts',
    porque: 'las 70 entradas del modo Última noche',
  },
] as const;

/** Una sonda no ASCII es una sonda muerta: mejor romper que mentir en verde. */
const NO_ASCII = SONDAS.filter((s) => !/^[\x20-\x7E]+$/.test(s.aguja));

interface Manifest {
  pages: Record<string, string[]>;
}

export function main(): void {
  if (NO_ASCII.length > 0) {
    console.error('  Sonda inválida: no es ASCII y por tanto nunca casaría en un chunk minificado:');
    for (const s of NO_ASCII) console.error(`    ✗ "${s.aguja}" (${s.fuente})`);
    process.exit(1);
  }

  const rutaManifest = path.join(DIR, 'app-build-manifest.json');
  if (!fs.existsSync(rutaManifest)) {
    console.error('  No hay build. Corre `npm run build` antes que esto.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(rutaManifest, 'utf8')) as Manifest;

  // Unión de los chunks JS de carga ansiosa de TODAS las rutas.
  const ansiosos = new Set<string>();
  for (const archivos of Object.values(manifest.pages)) {
    for (const archivo of archivos) if (archivo.endsWith('.js')) ansiosos.add(archivo);
  }

  const fugas: string[] = [];
  for (const archivo of ansiosos) {
    const contenido = fs.readFileSync(path.join(DIR, archivo), 'utf8');
    for (const sonda of SONDAS) {
      if (contenido.includes(sonda.aguja)) {
        fugas.push(`${archivo} contiene "${sonda.aguja}" — ${sonda.fuente}: ${sonda.porque}`);
      }
    }
  }

  console.log('');
  console.log('  Canario de frontera — ADR-010');
  console.log(`  Chunks de carga ansiosa revisados: ${ansiosos.size} · sondas: ${SONDAS.length}`);
  console.log('');

  if (fugas.length > 0) {
    console.error(`  ${fugas.length} FUGA(S) — un Client Component está importando contenido:`);
    for (const fuga of fugas) console.error(`    ✗ ${fuga}`);
    console.error('');
    console.error('  Arreglo: que la PÁGINA (servidor) lea el contenido y le pase al');
    console.error('  componente solo lo que necesita, proyectado. Ver ADR-010.');
    console.error('');
    process.exit(1);
  }

  console.log('  Frontera intacta: ningún chunk de carga ansiosa lleva contenido.');
  console.log('');
}

// Solo cuando se invoca como CLI (`npm run canario`). Importarlo desde un test
// no debe disparar un `process.exit`.
if (process.argv[1]?.includes('canario-frontera')) main();
