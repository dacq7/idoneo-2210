// src/lib/contenido.ts — §9.7 del blueprint, literal.
//
// Loaders de la teoría MDX. `server-only` no es decorativo: es el guardián de la
// regla no negociable 6 de CLAUDE.md. Si un Client Component importa este
// archivo, el build falla con un mensaje explícito en vez de arrastrar `node:fs`
// al navegador.
//
// La asimetría con `content/banco/` y `content/tarjetas/` es intencional (§2.2):
// aquellos son módulos TS importables desde el cliente con `import()` dinámico;
// la teoría se lee del disco y es solo de servidor.

import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

const DIR_TEORIA = path.join(process.cwd(), 'content', 'teoria');

/**
 * Devuelve el MDX crudo, o `null` si el módulo aún no tiene teoría escrita.
 *
 * `null` **no es un error**: es el estado normal de un módulo en preparación, y
 * hoy lo es de los 29. La página lo traduce a un estado vacío honesto, nunca a
 * una pantalla en blanco (§22, regla 11).
 */
export async function leerTeoria(slug: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(DIR_TEORIA, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }
}

export async function existeTeoria(slug: string): Promise<boolean> {
  return (await leerTeoria(slug)) !== null;
}
