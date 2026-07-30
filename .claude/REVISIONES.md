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
| 3 | 2026-07-29 | ✅ | ✅ 75 | ✅ 29 avisos | ✅ | APROBADO CON CAMBIOS | Una clave huérfana en `BANCO`/`TARJETAS` deja un archivo entero sin validar en silencio, con un aviso que apunta al lado contrario (58 claves a mano en los pasos 15–17; la primera en el Paso 8) · `multiple` no hereda el refinamiento de opciones duplicadas de `unica`/`caso` · `emparejar` solo vigila el índice izquierdo repetido en `pares`, no el derecho · la teoría no se verifica nunca, aunque define `'completo'` (regla 8) · el mínimo de 28 ítems del bloque C que pide §14.4 y el Paso 16 no está enforced (`minimoItems` es global) · `tolerancia` de `calculo` sin cota de cordura · tarjetas sin el cruce prefijo↔módulo que sí tienen los ítems · `DATOS_DUROS` sin cruce con tarjetas ni banco · Pasos 1–3 siguen sin comitear |

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

### Paso 3 — Validador de banco

Primer paso con las **cuatro** compuertas aplicables, y las cuatro en verde: `typecheck` exit 0,
75/75 tests, `validar` exit 0 con 29 avisos y 0 errores, `build` exit 0 con la cadena
`prebuild → validar → next build` visible en el log.

Fidelidad por diff mecánico contra `CLAUDE.md`: `scripts/validar-banco.ts` es **byte-idéntico** a
§8 (300 líneas, `diff -u` vacío). `content/estructura.ts` difiere de §9.1 en **6 líneas, ninguna de
datos**: 4+2 de comentario y el `estadoContenido` de C5 — exactamente la desviación que ADR-004
admite. La estructura se verificó además ejecutándola: pesos con suma exacta 1, `BLOQUES[].modulos`
coincide con `MODULOS` en contenido y orden en los cuatro bloques y también en la dirección
inversa, `orden` consecutivo, 0 prerequisitos inexistentes y **0 ciclos**, y los 4 helpers correctos
en sus bordes.

Los tres requisitos que subrayó el usuario se repitieron con sondas propias, sin fiarse de las
transcripciones: **(a)** sale el id del ítem y el mensaje literal de la regla; **(b)** las seis
cuotas por módulo disparan (conteo, dos niveles, dos dificultades, tipos distintos), más
explicación 200+, referencia bien formada, conceptos clave y tarjetas; **(c)** 23 errores y exit 1
con ocho defectos sembrados. Y `prebuild` **aborta de verdad**: con el validador rojo el log no
contiene `Creating an optimized production build`.

**Lo que aporta esta revisión por encima de la bitácora: la caza de falsos negativos.** Cinco
defectos de contenido realistas pasan hoy en silencio, y el más grave es estructural — una clave
mal escrita en `content/banco/indice.ts` deja un archivo de 25 ítems **completamente sin validar**,
con salida `exit 0` / "Todo en orden." y un aviso que afirma que el módulo *no tiene banco*. Con 58
claves escritas a mano en los pasos 15–17 y la primera en el Paso 8, es el hueco que más conviene
tapar antes de producir contenido.

Los cinco 🟡 son huecos del **propio §8/§5 del blueprint**, no defectos de ejecución: el validador
es fiel al texto y §22 reglas 2 y 9 prohíben "mejorarlo" en este paso. Por eso el veredicto es
APROBADO CON CAMBIOS y no RECHAZADO, y por eso la deuda se escala al `software-architect` para ADR
en vez de arreglarse aquí. No apliqué ningún cambio: el árbol quedó verificado idéntico al de
partida (12 md5 iguales, `diff -r` vacío, `git status` sin novedades, cuatro compuertas repetidas
en verde).

ADR-004 merece mención aparte: verifiqué su premisa y se sostiene. Con `MODULOS = []` el bucle del
banco nunca corre, así que la prueba de fuego del propio Paso 3 sería indemostrable. Adelantar
§9.1 no es comodidad, es la condición para que el paso pueda probar su entregable.
