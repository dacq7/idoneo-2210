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
| 4 | 2026-07-29 | ✅ | ✅ 159 | ✅ 29 avisos | ✅ | APROBADO CON CAMBIOS | 10 tests ausentes, verificados por mutación (64 mutantes, 16 supervivientes, **todos huecos de test y no defectos**): `guardarEstado` no prueba `notificar()` —el único cable escritura→UI en la misma pestaña, del que dependen los pasos 8–13— · `obtenerIntento` solo prueba el caso negativo, y devolver `intentos[0]` pasa la suite (Paso 12) · `borrarSesion`, `guardarColaRepaso` y `guardarDatosPersonales` sin ningún test (pasos 10, 11, 13) · `marcarTeoriaLeida` nunca verifica su bandera · `importarJSON` sin test de pureza en el éxito (regla 12 vía §18.5) · `necesitaRespaldo` "sin intentos" pasa por la razón equivocada y su frontera `<=` no se ejerce · `desuscribir` afirma sobre el registro de listeners de `window`, nunca sobre el Set interno · `CLAUDE.md` sigue diciendo `usarEstado` (líneas 1437, 6298, 6640) y rompería el Paso 8 · ADR-008 pendiente de ratificación del `software-architect` (tercera clave donde §6 dice "dos") · heredado al Paso 11: `leerSesion` castea sin validar y no hay `esqSesionCronometro` |

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

### Paso 4 — Almacenamiento

**Fidelidad verificada mecánicamente, no de palabra.** Extraje §6 y §6.1 del blueprint a un archivo
y los diffeé contra la implementación. El resultado es limpio: las únicas diferencias son las cuatro
que documenta la bitácora más el rename de ADR-007. Los 12 mutadores de dominio, `conModulo`,
`necesitaRespaldo`, `importarJSON`, `exportarJSON` y el bloque de sesión están **literales**, sin una
línea alterada.

**La cuarentena de ADR-008 no rompe la regla 6.** `apartarIlegible` se llama desde un único sitio,
`leerEstado` (línea 268), que es camino de efecto o handler. El camino de render —`obtenerSnapshot`
→ `leerCrudo` + `intentarMigrar`— no escribe, y lo confirmé con una sonda: cinco rondas sobre un
payload ilegible dejan el almacén byte a byte igual. Mover la cuarentena a `obtenerSnapshot` mata 5
tests, así que la trampa obvia tiene presión de regresión encima.

**Lo que aporta esta revisión por encima de la bitácora: la campaña de mutación.** 64 mutantes, 48
muertos, 16 supervivientes. El dato que importa no es el número sino la triage: escribí 28 sondas
propias y **en los 16 casos el código es correcto**. Son tests ausentes, no defectos — y eso cambia
el veredicto, porque una función correcta sin test se rompe en el paso siguiente sin que nadie se
entere.

Los tres puntos que el usuario pidió mirar con lupa **aguantaron**: la clasificación de
`MotivoIlegible` sí discrimina (intercambiar `sin-version`↔`invalido` mata 3 tests, colapsar los
cuatro mata 4, truncar el `payload` mata 6, falsear `guardadoEn` mata 7); "la primera cuarentena
gana" está cubierta; y el modo `cuota` del doble de `window` **no miente** — la sonda de 1 byte pasa
y la escritura real lanza, que es exactamente el fallo que ADR-008 corrige.

**Dónde sí hay hueco, ordenado por lo que va a doler:** `guardarEstado` no tiene test de
`notificar()`. Es el único cable entre una escritura y la UI en la **misma** pestaña; los tests de
`suscribir` solo ejercen la vía `storage`, que es entre pestañas. Un `guardarEstado` que no notifica
deja la suite entera en verde y la app sin actualizarse en los pasos 8–13. Después:
`obtenerIntento` solo prueba `'no-existe'`, así que devolver `intentos[0]` pasa — y el informe del
Paso 12 se apoya entero en esa búsqueda. Y `borrarSesion` sin test significa que, si algún día no
borra, el `dialogo-reanudar` del Paso 11 ofrece reanudar un simulacro ya cerrado.

**Dos tests que pasan por la razón equivocada,** además del que el propio Paso 4 ya había encontrado
y corregido: "necesitaRespaldo es false sin intentos" usa `racha.dias: 5`, así que la segunda rama
devuelve `false` igual y la guarda no se ejerce; y "un estado válido nunca entra en cuarentena" llega
por `leerEstado`, que corta antes en `obtenerSnapshot`, de modo que la rama `if (!motivo) return null`
de `apartarIlegible` nunca se ejecuta. Los guards de versión en `intentarMigrar` son la variante
benigna del mismo fenómeno: son **redundantes hoy** porque `esqEstadoProgreso.version` es
`z.literal(1)` y Zod ya rechaza los dos casos; su valor real está en `clasificarIlegible`, que sí
está probado. Cuando llegue la v2 y el esquema sea una unión, pasan a ser portantes y necesitan test
propio.

**Sobre el doble de `window` (¿miente respecto a un navegador real?).** Es honesto en lo que importa,
con un matiz de etiqueta: el modo `privado` hace que `setItem` lance **siempre**, y el Safari privado
moderno (≥11) ya no hace eso — da un `localStorage` funcional con cuota pequeña que se borra al
cerrar. El escenario que el modo reproduce de verdad es "localStorage inutilizable" (cookies
bloqueadas, iframe de terceros, Firefox estricto), igual de real; la etiqueta es imprecisa, el
escenario no. El modo `cuota` sí es fiel a WebKit y Blink, que lanzan según el tamaño del payload.
El `StorageEvent` sintético solo expone `key`, que es lo único que el handler lee, y el `key: null`
de `clear()` está bien reproducido. **Lo que el doble no puede contarte** es que los navegadores
reales **no** emiten `storage` en la pestaña que escribió: por eso la actualización de la misma
pestaña depende exclusivamente de `notificar()`, que es justo la garantía sin test. El doble no
miente; señala el hueco.

**Verificado además:** un `clear()` de otra pestaña (evento con `key: null`) deja a esta sirviendo
estado fantasma desde el caché. `reiniciarTodo` usa `removeItem` por clave, así que la app nunca lo
provoca — solo devtools o un borrado de datos del sitio. Coste bajo, pero es el único evento real
que el handler ignora.

**ADR-007 y ADR-008 se sostienen en el fondo.** ADR-007 es correcto y la alternativa del
`eslint-disable` habría sido peor: cambia una compuerta roja por un agujero silencioso justo en
`useSesion` y `useCronometro`. Lo que quedó sin hacer es la consecuencia: `CLAUDE.md` sigue definiendo
`usarEstado` en la 1437 e instruyendo a consumirlo en la 6298 y la 6640, así que el Paso 8 se
escribiría contra un símbolo inexistente. ADR-008 corrige un defecto real —§6 destruye el progreso en
`leerEstado`, no de forma diferida— y su honestidad sobre el alcance ("la cuarentena no restaura, hace
recuperable") es exactamente el registro correcto. Aun así añade una tercera clave donde §6 dice "dos
claves, deliberadamente separadas" y amplía la API pública del wrapper: es un desvío de una decisión
cerrada y lo escalo al `software-architect` para ratificación. No lo bloqueo, porque restaura un
invariante en vez de romperlo.

**Deuda que detona en el Paso 11 y ya se ve hoy:** `leerSesion` hace
`JSON.parse(crudo) as SesionCronometro` **sin validar**, y no existe `esqSesionCronometro` en
`esquemas.ts`. Con `{"foo":1}` guardado devuelve un objeto sin `itemIds` ni `duracionSegundos`;
recorrer `sesion.itemIds` lanza `TypeError` y `restantes()` daría `NaN`, porque `undefined !== null`
no entra por la rama de "sin límite". Es §6 literal, así que no es desvío de este paso: es lo que el
cronómetro hereda. Relacionado: `leerIlegible` y `leerSesion` **no** son libres de efectos (hacen
`borrarCrudo` al autolimpiarse), así que 18.5 y el `dialogo-reanudar` deben llamarlas en un efecto,
nunca en el cuerpo del render.

No apliqué ningún cambio. El árbol quedó verificado idéntico al de partida: 3 sumas `sha256sum -c`
coincidentes, `diff` contra copias pristinas vacío, `git status --porcelain` con los mismos 5
renglones del inicio, y las cinco compuertas repetidas en verde tras restaurar.
