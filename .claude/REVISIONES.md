# Registro de revisiones — Idóneo 2210

Una fila por paso revisado. Lo mantiene el `code-reviewer`. Es lo que permite ver de un
vistazo qué pasos están realmente cerrados y con qué deuda.

Si un paso se re-revisa, se añade una **fila nueva**. No se edita la anterior: el historial
de rechazos es información útil.

Convención de las columnas de compuerta: ✅ pasa · ❌ falla · **n/a** no aplica todavía a ese
paso (con la razón en Deuda abierta o en la bitácora). Un ❌ en cualquier compuerta aplicable
obliga a RECHAZADO.

| Paso | Fecha | typecheck | test | validar | build | Veredicto | Deuda abierta |
|---|---|---|---|---|---|---|---|
| 1 | 2026-07-29 | ✅ | n/a | n/a | n/a | APROBADO CON CAMBIOS | Andamiaje sin comitear (rama con 0 commits; los `.gitkeep` inertes hasta entonces) · Pendiente incompleta: falta `layout.tsx` (`lang="en"`, metadata de CNA → paso 5), `page.tsx` y los 5 SVG de CNA en `public/` (→ paso 14.4, borrar antes del precache de Serwist) · `"prebuild": "npm run validar"` aplazado al paso 3 por decisión documentada: es condición de cierre de ese paso |
| 2 | 2026-07-29 | ✅ | ✅ 66 | n/a | n/a | APROBADO CON CAMBIOS | Los tests no protegen las dos garantías centrales de ADR-003: 4 de los 5 exports refinados pueden perder su refinamiento con la suite en verde, y ningún test afirma el texto de un mensaje · 2 de las 10 reglas de `emparejar` sin test (par por elemento, par fuera de rango) · `.claude/settings.json` perdió `Bash(mkdir:*)`, fuera del recorte pedido · Pasos 1 y 2 siguen sin comitear y mezclados en el árbol · Conteo "nueve reglas" de ADR-003: son 10 reglas / 9 mensajes |

## Notas por paso

### Paso 1 — Andamiaje

Compuertas reales del paso: `npm run typecheck` y `npm run dev`. Ambas en verde
(`tsc --noEmit` exit 0; `next dev` compiló y sirvió `/` con 200). `npm run lint` también
pasa limpio.

Las tres columnas en **n/a** no son fallos del paso:

- **test** — no existen `vitest.config.ts` ni archivos de prueba hasta el paso 2. Vitest sale
  con código 1 por "No test files found", que es el comportamiento esperado con 0 tests.
- **validar** — `scripts/validar-banco.ts` nace en el paso 3.
- **build** — depende de `validar`. El enganche `"prebuild"` se aplazó a propósito al paso 3
  para que ningún paso intermedio quede con el build rojo (ajuste 3 de la bitácora). El script
  `validar` sí está declarado en `package.json`.

Sin hallazgos bloqueantes. Tailwind v4 puro, versiones del stack pineadas conforme a ADR-002,
los 18 componentes de shadcn sin ninguno de más, licencia completa con ADR-001, y `CLAUDE.md`,
`.claude/agents/` y la ascendencia de `995505d` intactos.

### Paso 2 — Tipos y esquemas

Compuertas aplicables: `npm run typecheck` (exit 0) y `npm test` (66/66). `validar` y `build`
siguen en **n/a**: `scripts/validar-banco.ts` nace en el Paso 3 y `prebuild` se engancha allí.

Fidelidad comprobada por diff mecánico contra `CLAUDE.md`, no de memoria: `tipos.ts` y
`fechas.ts` son **byte-idénticos** a §4 y §7.1; `utils.ts` solo cambia el encabezado; en
`esquemas.ts` el diff contra §5 **se limita al bloque de `esqItem`** — de `CUOTAS` al final,
regex incluidas, no hay una línea distinta.

**ADR-003 verificado ejecutándolo, no leyéndolo.** (a) La premisa se confirma: el §5 literal
lanza `TypeError` al *construir* el esquema, o sea al importar el módulo. (b) La corrección es
equivalente en comportamiento: 25/25 casos con huella de issues idéntica (`code`+`path`+`message`)
frente a los exports individuales, incluidos 4 casos que fallan a la vez en objeto y en
refinamiento. (c) `Item` y `z.infer<typeof esqItem>` son mutuamente asignables, el estrechamiento
por `tipo` funciona y `pares` sigue siendo `[number, number][]`. **La desviación es correcta.**

La deuda es de la **suite**, no del código. Mutando una a una las 10 reglas de refinamiento y 7
regresiones más: 8/10 reglas detectadas y 6 de 7 regresiones **sobreviven** en verde. Lo que
justifica la desviación (que `esqItemUnica`…`esqItemCaso` conserven su refinamiento sueltos, y
que los mensajes sigan siendo los de §5) es precisamente lo que la suite no protege.
