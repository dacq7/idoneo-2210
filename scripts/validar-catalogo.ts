// scripts/validar-catalogo.ts
// Lógica de validación del catálogo, extraída de §8 del blueprint.
// Función PURA: sin fs, sin reloj, sin process, sin console. Todo entra por
// parámetro y sale como { errores, avisos, resumen }.
//
// Vive en scripts/ y no en src/lib/ a propósito: la app nunca lo importa, y
// ponerlo en src/lib/ lo volvería importable desde un Client Component.
// `tsconfig.json` incluye **/*.ts, así que tsc y eslint lo cubren igual.
//
// Ver ADR-005: el validador se endureció más allá de §8. Las cinco
// comprobaciones añadidas van marcadas con [ADR-005].

import {
  cuotasDelBloque,
  esqDatoDuro,
  esqEntradaGlosario,
  esqItem,
  esqModulo,
  esqTarjeta,
  medirSesgoLongitud,
  UMBRAL_SESGO_AVISO,
  UMBRAL_SESGO_ERROR,
  UMBRAL_SESGO_INVERTIDO,
  verificarCuotas,
} from '../src/lib/esquemas';
import type {
  Bloque,
  BlueprintExamen,
  DatoDuro,
  EntradaGlosario,
  Item,
  Modulo,
  Tarjeta,
} from '../src/lib/tipos';

export const MIN_TARJETAS_POR_MODULO = 12;

/** Todo lo que necesita la validación. El CLI lo arma leyendo content/. */
export interface Catalogo {
  bloques: readonly Bloque[];
  modulos: readonly Modulo[];
  glosario: readonly EntradaGlosario[];
  datosDuros: readonly DatoDuro[];
  banco: Record<string, () => Promise<Item[]>>;
  tarjetas: Record<string, () => Promise<Tarjeta[]>>;
  blueprints: Record<string, BlueprintExamen>;
  /** Slugs con archivo en content/teoria/. Lo calcula el CLI con readdir. */
  slugsConTeoria: ReadonlySet<string>;
}

export interface ResumenCatalogo {
  modulos: number;
  completos: number;
  items: number;
  tarjetas: number;
  glosario: number;
}

export interface ResultadoValidacion {
  errores: string[];
  avisos: string[];
  resumen: ResumenCatalogo;
}

/**
 * 'campo: mensaje', o solo 'mensaje' cuando el issue no apunta a un campo.
 * Los refinamientos de colección (`hay opciones duplicadas`, `el índice derecho
 * 0 aparece dos veces`) tienen `path` vacío, y §8 los imprimía como
 * `C5-026 — : hay opciones duplicadas`, con dos puntos huérfanos. El ámbito ya
 * dice de qué se habla, así que el prefijo se omite en vez de inventar etiqueta.
 */
function detalle(issue: { path: readonly (string | number)[]; message: string }): string {
  return issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message;
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .trim();
}

export async function validarCatalogo(catalogo: Catalogo): Promise<ResultadoValidacion> {
  const {
    bloques: BLOQUES,
    modulos: MODULOS,
    glosario: GLOSARIO,
    datosDuros: DATOS_DUROS,
    banco: BANCO,
    tarjetas: TARJETAS,
    blueprints: BLUEPRINTS,
    slugsConTeoria,
  } = catalogo;

  const errores: string[] = [];
  const avisos: string[] = [];

  const err = (ambito: string, mensaje: string) => errores.push(`${ambito} — ${mensaje}`);
  const avi = (ambito: string, mensaje: string) => avisos.push(`${ambito} — ${mensaje}`);

  /* ── 1. Estructura ─────────────────────────────────────────────── */

  const slugs = new Set<string>();
  for (const modulo of MODULOS) {
    const r = esqModulo.safeParse(modulo);
    if (!r.success) {
      for (const i of r.error.issues) err(`estructura/${modulo.slug}`, detalle(i));
      continue;
    }
    if (slugs.has(modulo.slug)) err('estructura', `slug duplicado: ${modulo.slug}`);
    slugs.add(modulo.slug);
  }

  if (MODULOS.length !== 29) {
    err('estructura', `hay ${MODULOS.length} módulos declarados, deben ser 29`);
  }

  const sumaPesos = BLOQUES.reduce((s, b) => s + b.pesoExamen, 0);
  if (Math.abs(sumaPesos - 1) > 0.001) {
    err('estructura', `los pesos de los bloques suman ${sumaPesos}, deben sumar 1`);
  }

  for (const bloque of BLOQUES) {
    for (const slug of bloque.modulos) {
      if (!slugs.has(slug)) err(`bloque ${bloque.id}`, `referencia al módulo inexistente "${slug}"`);
    }
  }

  for (const modulo of MODULOS) {
    for (const pre of modulo.prerequisitos) {
      if (!slugs.has(pre)) err(`estructura/${modulo.slug}`, `prerequisito inexistente "${pre}"`);
    }
  }

  /* ── 2. Glosario y datos duros ─────────────────────────────────── */

  const terminosGlosario = new Set<string>();
  for (const g of GLOSARIO) {
    const r = esqEntradaGlosario.safeParse(g);
    if (!r.success) {
      for (const i of r.error.issues) err(`glosario/${g.termino}`, detalle(i));
      continue;
    }
    const clave = normalizar(g.termino);
    if (terminosGlosario.has(clave)) err('glosario', `término duplicado: ${g.termino}`);
    terminosGlosario.add(clave);
    if (!slugs.has(g.modulo)) err(`glosario/${g.termino}`, `módulo inexistente "${g.modulo}"`);
  }

  for (const d of DATOS_DUROS) {
    const r = esqDatoDuro.safeParse(d);
    if (!r.success) {
      for (const i of r.error.issues) err(`datos-duros/${d.id}`, detalle(i));
      continue;
    }
    if (!slugs.has(d.modulo)) err(`datos-duros/${d.id}`, `módulo inexistente "${d.modulo}"`);
  }

  /* ── 3. Banco de ítems ─────────────────────────────────────────── */

  const idsGlobales = new Set<string>();
  const conteoPorModulo = new Map<string, number>();

  for (const modulo of MODULOS) {
    const cargar = BANCO[modulo.slug];
    const completo = modulo.estadoContenido === 'completo';

    if (!cargar) {
      if (completo) err(`banco/${modulo.slug}`, 'módulo marcado "completo" pero no tiene banco');
      else avi(`banco/${modulo.slug}`, 'en preparación, sin banco todavía');
      continue;
    }

    let items: Item[];
    try {
      items = await cargar();
    } catch (e) {
      err(`banco/${modulo.slug}`, `no se pudo cargar: ${(e as Error).message}`);
      continue;
    }

    conteoPorModulo.set(modulo.slug, items.length);
    const validos: Item[] = [];

    for (const item of items) {
      const r = esqItem.safeParse(item);
      if (!r.success) {
        for (const i of r.error.issues) {
          err(`banco/${modulo.slug}/${item?.id ?? '??'}`, detalle(i));
        }
        continue;
      }

      if (idsGlobales.has(item.id)) err('banco', `id de ítem duplicado: ${item.id}`);
      idsGlobales.add(item.id);

      if (item.modulo !== modulo.slug) {
        err(`banco/${modulo.slug}/${item.id}`, `campo modulo dice "${item.modulo}"`);
      }
      if (item.bloque !== modulo.bloque) {
        err(`banco/${modulo.slug}/${item.id}`, `campo bloque dice "${item.bloque}", debe ser "${modulo.bloque}"`);
      }
      const prefijo = item.id.split('-')[0].toLowerCase();
      if (!modulo.slug.startsWith(`${prefijo}-`)) {
        err(`banco/${modulo.slug}/${item.id}`, `el prefijo del id no corresponde al módulo`);
      }
      const cartilla = Number(item.referencia.match(/^Cartilla (\d)/)?.[1]);
      const cartillaEsperada = BLOQUES.find((b) => b.id === item.bloque)?.numeroCartilla;
      if (cartilla && cartillaEsperada && cartilla !== cartillaEsperada) {
        avi(
          `banco/${modulo.slug}/${item.id}`,
          `referencia a la Cartilla ${cartilla} desde el bloque ${item.bloque} (esperada: ${cartillaEsperada}). Correcto si es intencional.`,
        );
      }

      validos.push(item);
    }

    if (completo) {
      // [ADR-005, hueco 5] La cuota mínima depende del bloque: 28 en C, 25 en
      // el resto. §14.4 y el entregable del paso 16 lo piden; CUOTAS es global.
      for (const fallo of verificarCuotas(validos, cuotasDelBloque(modulo.bloque))) {
        err(`banco/${modulo.slug}`, `cuota incumplida: ${fallo}`);
      }

      // ── Sesgo de longitud de la opción correcta ──
      //
      // §14.4 pedía «longitud pareja» desde el primer módulo y el banco llegó
      // igualmente al 66 %, con C5 —la plantilla de oro— en el 80 %, frente al
      // 28,2 % que da el azar. Una regla escrita que nadie mide no se cumple, y
      // esta se cobra en el producto: a 750 ítems se aprende a marcar la más
      // larga sin leer el enunciado.
      //
      // El umbral sale de los datos, no del gusto: con ~18 ítems con opciones
      // por módulo, el azar llega al 49 % a dos desviaciones estándar, así que
      // por encima del 50 % es sesgo sistemático.
      const sesgo = medirSesgoLongitud(validos);
      if (sesgo.conOpciones > 0) {
        const pct = Math.round(sesgo.proporcion * 100);
        const detalle =
          `la correcta es la más larga en ${sesgo.correctaMasLarga}/${sesgo.conOpciones} ítems (${pct} %), ` +
          `azar ≈ 28 % · largo medio ${sesgo.largoMedioCorrecta} vs ${sesgo.largoMedioDistractor}`;
        if (sesgo.proporcion > UMBRAL_SESGO_ERROR) {
          err(
            `banco/${modulo.slug}`,
            `sesgo de longitud: ${detalle}. Engorda los distractores —no acortes la correcta—: ` +
              sesgo.ids.slice(0, 6).join(', ') +
              (sesgo.ids.length > 6 ? `, +${sesgo.ids.length - 6} más` : ''),
          );
        } else if (sesgo.proporcion > UMBRAL_SESGO_AVISO) {
          avi(`banco/${modulo.slug}`, `sesgo de longitud al límite: ${detalle}`);
        } else if (sesgo.proporcion < UMBRAL_SESGO_INVERTIDO) {
          // El sesgo INVERTIDO es el mismo exploit del revés: si la correcta
          // casi nunca es la más larga, «descartar la más larga» se vuelve una
          // heurística ganadora. El objetivo es parecerse al azar (~28 %), no
          // minimizar la cifra.
          avi(
            `banco/${modulo.slug}`,
            `sesgo de longitud INVERTIDO: ${detalle}. Los distractores quedaron sistemáticamente ` +
              'más largos que la correcta, que es la misma pista al revés.',
          );
        }
      }
    }
  }

  // [ADR-005, hueco 1] Recorrido INVERSO del índice. Sin esto, una clave con un
  // typo ('c5-umbrales-zona') deja el archivo entero sin validar y el validador
  // sale verde afirmando que el módulo no tiene banco. Es el peor falso
  // negativo del validador: no calla, desinforma.
  for (const clave of Object.keys(BANCO)) {
    if (!slugs.has(clave)) {
      err('banco', `la clave "${clave}" del índice no corresponde a ningún módulo`);
    }
  }

  /* ── 4. Tarjetas ───────────────────────────────────────────────── */

  const idsTarjeta = new Set<string>();
  for (const modulo of MODULOS) {
    const cargar = TARJETAS[modulo.slug];
    const completo = modulo.estadoContenido === 'completo';

    if (!cargar) {
      if (completo) err(`tarjetas/${modulo.slug}`, 'módulo "completo" sin tarjetas');
      continue;
    }

    let tarjetas: Tarjeta[];
    try {
      tarjetas = await cargar();
    } catch (e) {
      err(`tarjetas/${modulo.slug}`, `no se pudo cargar: ${(e as Error).message}`);
      continue;
    }

    for (const t of tarjetas) {
      const r = esqTarjeta.safeParse(t);
      if (!r.success) {
        for (const i of r.error.issues) err(`tarjetas/${modulo.slug}/${t?.id ?? '??'}`, detalle(i));
        continue;
      }
      if (idsTarjeta.has(t.id)) err('tarjetas', `id duplicado: ${t.id}`);
      idsTarjeta.add(t.id);
      if (t.modulo !== modulo.slug) err(`tarjetas/${modulo.slug}/${t.id}`, `campo modulo dice "${t.modulo}"`);
    }

    if (completo && tarjetas.length < MIN_TARJETAS_POR_MODULO) {
      err(`tarjetas/${modulo.slug}`, `${tarjetas.length} tarjetas, el mínimo es ${MIN_TARJETAS_POR_MODULO}`);
    }
  }

  // [ADR-005, hueco 1] Mismo recorrido inverso para el índice de tarjetas.
  for (const clave of Object.keys(TARJETAS)) {
    if (!slugs.has(clave)) {
      err('tarjetas', `la clave "${clave}" del índice no corresponde a ningún módulo`);
    }
  }

  /* ── 5. Teoría y conceptos clave ↔ glosario ────────────────────── */

  for (const modulo of MODULOS) {
    if (modulo.estadoContenido !== 'completo') continue;

    // [ADR-005, hueco 2] §22 regla 8 define 'completo' como teoría + ≥12
    // tarjetas + ≥25 ítems. §8 exigía las dos últimas y no la primera: un
    // módulo podía quedar 'completo' sin .mdx y mostrar una pantalla vacía.
    if (!slugsConTeoria.has(modulo.slug)) {
      err(
        `teoria/${modulo.slug}`,
        `módulo "completo" sin teoría: falta content/teoria/${modulo.slug}.mdx`,
      );
    }

    for (const concepto of modulo.conceptosClave) {
      if (!terminosGlosario.has(normalizar(concepto))) {
        err(`glosario/${modulo.slug}`, `el concepto clave "${concepto}" no tiene entrada en el glosario`);
      }
    }
  }

  // [ADR-005] El gemelo del hueco 1 en la carpeta de teoría: un .mdx cuyo
  // nombre no corresponde a ningún módulo ('d2-cargas.mdx' con una s de más).
  // Es AVISO, no error: a diferencia de una clave huérfana en el índice, este
  // archivo es inerte — no esconde contenido sin validar, solo no se lee.
  for (const slug of slugsConTeoria) {
    if (!slugs.has(slug)) {
      avi('teoria', `content/teoria/${slug}.mdx no corresponde a ningún módulo`);
    }
  }

  /* ── 6. Viabilidad de los blueprints ───────────────────────────── */

  for (const bp of Object.values(BLUEPRINTS)) {
    const cuotas = bp.reparto.cuotas as Record<string, number>;
    const suma = Object.values(cuotas).reduce((s, n) => s + n, 0);
    if (suma !== bp.totalItems) {
      err(`blueprint/${bp.id}`, `el reparto suma ${suma} y totalItems es ${bp.totalItems}`);
    }
    const sumaNivel = Object.values(bp.porNivel).reduce((s, n) => s + n, 0);
    if (sumaNivel !== bp.totalItems) {
      err(`blueprint/${bp.id}`, `las cuotas por nivel suman ${sumaNivel} y totalItems es ${bp.totalItems}`);
    }
    if (bp.porTipo) {
      const sumaTipo = Object.values(bp.porTipo).reduce((s, n) => s + (n ?? 0), 0);
      if (sumaTipo !== bp.totalItems) {
        err(`blueprint/${bp.id}`, `las cuotas por tipo suman ${sumaTipo} y totalItems es ${bp.totalItems}`);
      }
    }

    if (bp.reparto.tipo === 'modulo') {
      for (const [slug, cuota] of Object.entries(cuotas)) {
        if (!slugs.has(slug)) {
          err(`blueprint/${bp.id}`, `módulo inexistente "${slug}"`);
          continue;
        }
        const disponibles = conteoPorModulo.get(slug) ?? 0;
        if (disponibles < cuota) {
          avi(
            `blueprint/${bp.id}`,
            `${slug} necesita ${cuota} ítems y hay ${disponibles} (se rellenará desde otros módulos hasta que el contenido esté listo)`,
          );
        }
      }
    }
  }

  const totalItems = [...conteoPorModulo.values()].reduce((s, n) => s + n, 0);
  const completos = MODULOS.filter((m) => m.estadoContenido === 'completo').length;

  return {
    errores,
    avisos,
    resumen: {
      modulos: MODULOS.length,
      completos,
      items: totalItems,
      tarjetas: idsTarjeta.size,
      glosario: terminosGlosario.size,
    },
  };
}
