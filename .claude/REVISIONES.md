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
| 8 | 2026-07-30 | ✅ | ✅ 187 | ✅ 84 avisos, 0 errores | ✅ | APROBADO CON CAMBIOS | 🔴 **C5-028 mezcla escalas y sitúa en R1 un valor que la teoría del propio módulo pone en R2**: pide «el límite superior de R1 al 75 % de la FC de reserva» y su respuesta, 152,5 lpm, es el 82,4 % de la FCmáx (R1 = 120–139 lpm; R2 = 148–167 lpm). Es la ambigüedad que C5-008 existe para enseñar a evitar, en la plantilla que se replica 28 veces. Arreglo de una línea: quitar el marco de zona del enunciado; respuesta, `pasos` y explicación quedan válidos · 🟡 el JSDoc de `useEstado` (`src/hooks/usar-estado.ts:11-14`) sigue enseñando el contrato viejo («renderizar un esqueleto mientras sea null»), que es justo el bug del esqueleto permanente; COMPONENTES.md lo corrigió, el hook no, y los Pasos 9–14 leen el hook · 🟡 C5-026 atribuye a R2 un «5–10 % de grasas» que la cartilla no da (dice «casi exclusivamente hidratos»): cifra inventada en la plantilla de oro → derivado a `technical-writer` · heredado y escalado a `software-architect`: `esquemas.ts` manda al navegador los 7 esquemas de ítem + tarjetas/erratas/glosario (evidencia dura: `diceLaCartilla` está en `static/chunks/571-*.js`) donde solo se usa `esqEstadoProgreso` — **no es violación de §5**, que sanciona el import, sino coste no previsto; decidir junto con la deuda del barrel de `radix-ui` (ADR-011) en el Paso 9 |
| 9 | 2026-07-30 | ✅ | ✅ 382 | ✅ 84 avisos, 0 errores | ✅ (+ lint ✅) | APROBADO CON CAMBIOS | 🔴 **CORREGIDO EN LA REVISIÓN** — `envoltorio-item.tsx:52` montaba `<Control {...props} />` sin `key`: dos ítems consecutivos del mismo `tipo` reusaban la instancia hoja y arrastraban su estado local. En `calculo` (4 de 28 en C5) el campo mostraba el número tecleado en el ítem anterior con `valor` en `null` → **número en pantalla, ítem calificado en blanco**, sin aviso. `calculo.tsx:44-45` y `ordenar.tsx:45-47` daban el remontaje por hecho en comentario. Arreglado con `key={item.id}`; **sin test de regresión: no existe stack de test de componentes** (`environment: 'node'`, `include` solo `*.test.ts`) y añadir jsdom/@testing-library es dependencia nueva → escalado al `software-architect` · 🟡 `useSesion.terminar()` (`usar-sesion.ts:153`) no es idempotente y `cerrar()` (`controlador-sesion.tsx:150`) tampoco: hoy irreproducible porque el botón se desmonta, pero el auto-envío del Paso 11 lo pone en carrera con el clic del usuario → `intentosQuiz` doble · 🟡 `ordenar.tsx:44` escribe respuesta en un efecto sin consultar `editable(modo)`: inofensivo hoy, rellena una respuesta ya fija en cuanto exista `bloqueado` (Paso 11) · 🟡 textos que tratan `bloqueado` como editable en `emparejar.tsx:81` y `ordenar.tsx:91` · 🟡 `emparejar.tsx:101,124,227` usa `key={texto}` sin que el esquema garantice unicidad de `izquierda`/`derecha` · 💭 el banco completo (con `explicacion` y `correcta`) viaja en la carga útil RSC del HTML antes de responder — **verificado**, 73 kB en `quiz.html`; inevitable con calificación en cliente y documentado en `practica/page.tsx:11-17`, pero la página de **teoría** también lo arrastra solo para mostrar un conteo · 💭 sin `itemsRecientes`, repetir el quiz puede servir los mismos 10 ítems |
| 10 | 2026-07-30 | ✅ | ✅ 455 | ✅ 84 avisos, 0 errores | ✅ (+ lint ✅ + canario ✅) | APROBADO CON RESERVAS | 🔴 `controlador-repaso.tsx:252` — `void resolverElementos(...).then(...)` **sin `.catch()`**: si el `import()` dinámico rechaza (ChunkLoadError por red caída antes de que el SW cachee, o chunk viejo tras un redespliegue) la vista se queda en `{fase:'cargando'}` y `preparando.current` en `true`, así que **ninguna escritura posterior reintenta**. Esqueleto eterno permanente, en la ruta que se abre a diario, en una app cuyo §3 exige conectividad intermitente. Es el mismo bug que el propio test 1 del paso blinda para la rama `useEstado()===null`; falta la rama del fallo. **No lo arreglé**: el arreglo correcto necesita una quinta pantalla con texto honesto y reintento (decisión de `technical-writer`/`ui-designer`), y reciclar `ColaSinContenido` pondría en pantalla un mensaje falso («volverán a aparecer en cuanto su módulo se publique» cuando lo que pasa es que no hay red) · 🔴 **CORREGIDO EN LA REVISIÓN** — la sonda `Malondialdehído` del canario ADR-010 **nació muerta**: el minificador escapa todo carácter no ASCII de los literales (`í` → `\xed`, verificado sobre `329.df5720dcd0524074.js`, que solo contiene `\xbf \xd7 \xe1 \xe9 \xed \xf1 \xf3 \xfa` y ni un acento crudo), así que esa mitad del guardián reportaba «frontera intacta» sin comprobar nada de `content/datos-duros.ts` desde ADR-014. Sustituida por `Mioglobina` (`DD-066`, ASCII, única fuera de `src/`), más guardián que aborta ante sonda no ASCII y `scripts/__tests__/canario-frontera.test.ts` (3 casos); verificado por mutación · 🟡 `mazo-tarjetas.tsx:127-131` usa `registrarRevision` donde el docblock de §7.2 manda `encolar` («se llama con: toda tarjeta vista en la etapa Tarjetas»). El razonamiento del comentario es correcto —`encolar` haría vencer las 15 tarjetas al minuto—, pero es la **5.ª desviación del código literal del blueprint sin ADR** (las 4 previas sí lo tienen: 003, 005, 015, 017) y `registrarRevision` **no es idempotente**: reabrir el mazo el mismo día da a cada tarjeta una segunda revisión (`repeticiones` 1→2, intervalo 1→3 días) sin espaciado real; la guarda `esRepaso` solo cubre la pasada de falladas intrasesión → `software-architect` · 🟡 `controlador-repaso.tsx:234-266` — con la pestaña abierta cruzando medianoche la cola no se recalcula (deps `[montado, estado, modulos, vista.fase]`, y en `'vacia'` no cambia ninguna); se cura al navegar, y la programación sí es correcta porque `registrar` lee `fechaLocalDe` fresco por respuesta · 💭 `osteomuscular` sale también de `content/blueprint-examen.ts:66`: sigue siendo acierto verdadero (ese archivo importa `estructura` y ADR-010 le prohíbe el cliente igual), pero el mensaje de fuga nombraría el archivo equivocado · 💭 el canario no mira los 11 chunks diferidos, y ADR-010 prohíbe el import **sin matizar**: un `import('@/content/estructura')` dentro de un cliente pasaría en verde. Los estáticos —la regresión realista— sí caen en chunks ansiosos y sí se detectan |

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

---

## Paso 9 — Componentes de ítem, máquina de sesión y etapas 3 y 4 · 2026-07-30

**Alcance:** `src/components/items/` (contrato + `opcion.tsx` + los 7 tipos + envoltorio +
retroalimentación), `src/hooks/usar-sesion.ts`, `src/components/sesion/`, las dos rutas nuevas de
`/modulos/[slug]/`, `eslint.config.mjs` y los 13 archivos de `src/components/ui/` (cierre de
ADR-011). `src/lib/simulacro.ts` (ADR-015) no se re-revisó: ya lo revisó otro agente y no aparece
nada grave en el uso que hacen de él los archivos de este paso.

**Compuertas (las cinco, en verde):** typecheck ✅ · lint ✅ · vitest ✅ 382/382 · validar ✅
(84 avisos, 0 errores; todos son módulos en preparación y blueprints sin banco, que es el estado
esperado hasta el Paso 17) · build ✅.

**Aviso metodológico sobre los canarios de ADR-010.** Hay un `next dev -p 3210` corriendo sobre este
mismo proyecto y `next dev` sobrescribe `.next`: el primer canario que corrí quedó contaminado y el
`BUILD_ID` de la build de producción desapareció a media revisión. Rehíce los tres canarios sobre una
**build limpia en copia aislada** (`tar` sin `node_modules`/`.next`/`.git`, `node_modules`
enlazado). Los tres dan vacío: `osteomuscular`, `Malondialdehído` y una explicación literal de C5 no
aparecen en `.next/static/chunks/`. **ADR-010 se sostiene**, y se sostiene por construcción: ningún
Client Component importa `content/` (`encabezado.tsx` y `rotulo-bloque.tsx` sí lo importan, y los dos
son Server Components).

**Dónde acaba el banco entonces.** En la carga útil RSC, no en los chunks JS. Verificado con la build
limpia: `.next/server/app/modulos/c5-umbrales-zonas/quiz.html` pesa 73 kB y contiene la explicación
literal de un ítem. Es decir: **la respuesta correcta y su explicación están en el navegador antes de
que el usuario responda la primera pregunta.** No lo cuento como fallo y quiero dejar dicho por qué:
sin backend, `calificar()` corre en el cliente y las respuestas tienen que llegar sí o sí; ocultarlas
sería teatro. La cabecera de `practica/page.tsx:11-17` ya asume el coste por escrito, que es la forma
correcta de tomar esta decisión. Lo que sí merece una línea: `/modulos/[slug]` (la página de teoría)
llama a `cargarBancoModulo` y arrastra los 28 ítems enteros **solo para pintar `totalItems`**. Un
`.length` en el servidor no necesita que los ítems crucen la frontera.

**El bloqueante, y por qué no lo vio la suite.** `envoltorio-item.tsx` despachaba con
`<Control {...props} />` sin `key`. React solo desmonta la hoja cuando cambia el *tipo* de elemento,
así que entre dos ítems consecutivos del mismo `tipo` la instancia se reutiliza con su estado local
intacto. C5 tiene 4 `calculo`, 3 `multiple`, 3 `caso` y 2 `emparejar` en 28 ítems, y una tanda saca 8
(práctica) o 10 (quiz): la adyacencia no es un caso de laboratorio. El daño peor es silencioso —
`calculo` siembra su `useState` desde `valor`, así que el segundo campo aparece con el número del
ítem anterior mientras `valor` sigue en `null`; el usuario ve su respuesta escrita, no toca nada,
`onCambio` no se dispara y el ítem se califica **en blanco**. Dos archivos afirmaban en comentario el
remontaje que nadie implementaba (`calculo.tsx:44-45`, `ordenar.tsx:45-47`), que es la señal de que
el invariante se dio por supuesto en vez de por escrito. Arreglado con `key={item.id}` y comentario
que explica qué se rompe si alguien lo quita. `resumen-sesion.tsx` no necesita nada: su
`<li key={resultado.item.id}>` ya separa las instancias.

**Lo que no pude hacer y no es mío decidir.** El arreglo es de una línea; su test de regresión no.
`vitest.config.ts` corre con `environment: 'node'` e `include` solo de `*.test.ts`: no hay forma de
montar un componente. Añadir jsdom y `@testing-library/react` es una dependencia nueva y una decisión
de arquitectura — **escalado al `software-architect`**. Mientras no exista, este bloqueante puede
volver sin que ninguna compuerta se ponga roja, y es el tipo de fallo que no se nota mirando la
pantalla.

**Idempotencia, que es la deuda que detona en el Paso 11.** `terminar()` no comprueba `terminada` y
`cerrar()` no comprueba nada: dos llamadas suman `intentosQuiz` dos veces y registran el puntaje dos
veces. Hoy no es alcanzable —el botón se desmonta con el primer clic, `Enter` está deliberadamente
excluido de cerrar la tanda (`controlador-sesion.tsx:173-179`) y StrictMode duplica efectos, no
handlers—, así que no lo bloqueo. Pero el Paso 11 mete un auto-envío por temporizador que compite con
el clic del usuario, y ahí sí. Una guarda `if (terminada) return resumen ?? …` al entrar en
`terminar()` cierra la clase entera.

**Lo que está bien resuelto y conviene que no se pierda.** La calificación está centralizada de
verdad: el único `calificar()` de la interfaz está en `controlador-sesion.tsx:220`, y las
comparaciones que hacen `emparejar` y `ordenar` son estrictamente de pintado por fila. Ningún
componente de ítem menciona `explicacion`, `referencia`, `pasos` ni `item.respuesta` — verificado por
grep sobre los ocho archivos —, así que la fuga de la respuesta antes de responder no existe. Cero
arrastrar y soltar: `emparejar` va por selección en dos columnas y `ordenar` por flechas de 44 px, y
el comentario de cabecera explica que es el mecanismo completo y no una concesión. `calculo` acepta
coma y punto, no manda `NaN` (manda `null`, que es lo que `sinResponder()` entiende) y **no compara
nada contra `item.respuesta`**: la tolerancia solo se muestra, la aplica el motor. El `switch` del
envoltorio se cierra con `props.item satisfies never`. Los estados vacíos de práctica y quiz para un
módulo en preparación tienen mensaje, explican que no se perdió progreso y ofrecen dos salidas: §22
regla 11 cumplida.

**Derivado al `accessibility-auditor`** (no lo audité, es su paso): el patrón de `aria-disabled` +
guarda en el handler en vez de `disabled` (`boton.tsx:44-50`), la región `aria-live` siempre montada
del controlador y el `tabIndex={-1}` del titular del resumen son decisiones deliberadas y
documentadas; conviene que las valide quien sí audita.

**No comiteé nada.** El único cambio de código que apliqué es la línea de `key` en
`envoltorio-item.tsx` más su comentario; las cinco compuertas se repitieron en verde después.

---

## Paso 10 — Motor SRS y `/repaso` · 2026-07-30

**Alcance.** El diff completo del paso salvo `src/lib/srs.ts` y `src/lib/__tests__/srs.test.ts`,
ya revisados por otro agente (mirados solo para verificar el contrato de idempotencia de
`encolar`, que se cumple: `if (!siguiente[id])`). Revisado: `app/repaso/page.tsx`,
`sesion/controlador-repaso.tsx`, `sesion/repaso-vacio.tsx`,
`sesion/__tests__/controlador-repaso.test.tsx`, los dos enganches (`mazo-tarjetas.tsx`,
`controlador-sesion.tsx`), `lib/fechas.ts#fechaLocalDe` y `scripts/canario-frontera.ts`.

**Compuertas, las seis, tras aplicar la corrección del canario:** typecheck ✅ (exit 0) ·
lint ✅ (exit 0) · `npx vitest run` ✅ **455** en 12 archivos · validar ✅ 0 errores / 84 avisos
(los 84 son módulos en preparación y cuotas de blueprint sin banco: transitorios esperados de
§8) · build ✅ · canario ✅ (23 chunks ansiosos, 2 sondas).

> La consigna esperaba **448** tests y hay **455**. No falta ninguno: son los 4 de
> `fechaLocalDe` (que la consigna sí menciona) y los 3 del canario añadidos en esta revisión.

**Invariantes verificados con comando, no de memoria.**

| Invariante | Comando | Resultado |
|---|---|---|
| Cero `Math.random()` | `grep -rn "Math.random" src/ content/ scripts/` | 3 hits, **los 3 en comentarios** que prohíben usarlo |
| Reloj solo en efectos y handlers | `grep -rn "Date.now()\|new Date()" src/` | 8 hits de código: `marcador-lectura.tsx:40` (efecto), `controlador-sesion.tsx:80,168` (handlers), `controlador-repaso.tsx:240` (efecto de preparación) y `:344` (handler `registrar`), `mazo-tarjetas.tsx:122` (handler), `usar-sesion.ts:102,109`. **Ninguno en el cuerpo de un render** |
| Ningún motor conoce el reloj | `grep -rn "Date.now()\|new Date()" src/lib/` | solo comentarios de `fechas.ts`. `fechaLocalDe` **recibe** el `Date`, no lo construye |
| `localStorage` solo tras el wrapper | `grep -rn "localStorage" src/ --include=*.ts{,x} \| grep -v almacenamiento.ts` | solo comentarios y tests |
| Cero sistema de erratas (ADR-014) | `ls content/erratas.ts src/app/erratas` | no existen ✅ |
| `"use client"` = §10.3 | `grep -rlE "^[\"']use client[\"']" src/` | **22** fuera de `ui/` (shadcn) = §10.3 + las 2 altas de ADR-010 (`riel-bloques`, `app/error`) + `controlador-repaso` (alta declarada en este paso). Sin desvíos |
| Teoría server-only | `grep -rn "lib/contenido" src/components/` | vacío |
| Banco en diferido | `grep -rn "from '@/content/banco/" src/` | solo páginas servidor + un test. En cliente, `import()` dinámico |
| ADR-010 | `npm run build && npm run canario` | verde (tras corregir la sonda) |

**Calificación y programación centralizadas.** Verificado: el controlador no decide nada por su
cuenta. La corrección es `calificar()` de `lib/simulacro.ts` (`controlador-repaso.tsx:409,424,531`),
la programación es `registrarRevision`/`programarSiguiente` de `lib/srs.ts`, la selección es
`colaDelDia` y el resumen `resumirRepaso`. Cero reimplementación.

**Sobre el canario, que la consigna pidió auditar explícitamente.** Las dos preguntas tenían
respuestas opuestas.

*Su arquitectura es correcta y la premisa que la justifica es cierta.* Comprobado: el contenido
de C5 sí está ahora en `.next/static/chunks/` —`329.*`, `886.*`, `160.*`, `601.*`, los cuatro
**diferidos**— así que un `grep -rl` sobre esa carpeta daría desde hoy el falso positivo que el
script existe para evitar. La exclusión de los diferidos hace trabajo real: 34 js bajo `static`,
23 ansiosos, 11 diferidos. Y el script lee archivos de verdad, no falla en abierto: la cadena
`Nada que repasar hoy` aparece en el chunk ansioso `app/repaso/page-*.js`.

*Y una de sus dos sondas estaba muerta.* `Malondialdehído` no puede casar jamás, porque el
minificador escapa los no-ASCII en los literales de cadena. Evidencia dura: en
`329.df5720dcd0524074.js` no hay **ni un** acento crudo y sí `\xbf \xd7 \xe1 \xe9 \xed \xf1 \xf3
\xfa`; `í` es `\xed`. El canario llevaba desde ADR-014 reportando «frontera intacta» sin haber
comprobado una sola cadena de `content/datos-duros.ts`. La nota de ADR-010 dice «verificado por
mutación», y lo fue —pero solo para `osteomuscular`, que es ASCII y sí funciona.

Corregido en la revisión: sonda `Mioglobina` (`DD-066`; ASCII, ausente de `src/`), guardián que
aborta el CLI ante cualquier sonda no ASCII, `SONDAS` exportada y `main()` bajo guarda de argv
para poder testearla. `scripts/__tests__/canario-frontera.test.ts` fija las tres propiedades:
ASCII, presencia en el archivo que dice vigilar, y ausencia de `src/` (que es el falso positivo
que quemó a `conceptosClave` en el Paso 8). **Verificado por mutación:** devuelta la sonda a
`Malondialdehído`, cae el primer caso y el CLI se niega a correr; restaurada, verde.

**La asimetría de los dos enganches: uno está bien y el otro necesita ADR.**

El del cierre de sesión (`controlador-sesion.tsx:186-191`) es correcto y es el difícil. `encolar`
es idempotente por contrato y `srs.ts` lo cumple, así que volver a fallar un ítem que ya estaba
en la cola **no reinicia su progreso** (§22 regla 12). Además no depende de `registro.clase`, con
lo que el diagnóstico y los simulacros del Paso 11 lo heredan sin tocar nada.

El del mazo no. `registrarRevision` es la función correcta *pedagógicamente* —el comentario tiene
razón en que `encolar` haría vencer las 15 tarjetas al minuto de verlas— pero no es idempotente,
y ahí está el agujero que el comentario no cubre: la guarda `esRepaso` protege la pasada de
falladas dentro de la sesión, no una **segunda visita a la ruta el mismo día**. Estudiar el mazo
a las 8 y repetirlo a las 9 da a cada tarjeta dos revisiones sin espaciado real: `repeticiones`
1→2 y el intervalo 1→3 días. Con `encolar` eso no pasa. Y sea cual sea la decisión, es la 5.ª
desviación del código literal del blueprint y las cuatro anteriores tienen ADR. → `software-architect`.

**Lo que está bien resuelto y conviene que no se pierda.** `fechaLocalDe` no es cosmética: con
`soloFecha(new Date().toISOString())` la cola se adelanta cinco horas cada tarde justo en la
franja en que este usuario estudia, y el SM-2 pierde un día de intervalo de forma sistemática y
**silenciosa**. Está en `lib/`, recibe el `Date` en vez de construirlo, y se calcula a mano en
vez de con `toLocaleDateString('en-CA')` para no depender de qué ICU traiga el navegador. Los
ids huérfanos se omiten pero **no se purgan**, con su propia pantalla y su propio test: es §22
regla 12 aplicada donde de verdad se podía perder progreso. Las cuatro pantallas vacías dicen
cosas distintas porque el consejo correcto es distinto, y ninguna rellena la cola (brief §6.1).
Y `repaso-vacio.tsx` sin directiva de cliente para no inflar §10.3 es la lectura fina correcta
de la regla.

**Derivado al `accessibility-auditor`** (no es mi paso): la `aria-live` siempre montada, el
`role="status"` del contador de elementos, el `tabIndex={-1}` del titular de cierre y el
enrutado explícito de foco por `objetivoFoco` son deliberados y están documentados; y los atajos
`1`/`2`/`Enter` se anuncian solo bajo `@media(any-pointer:fine)`, lo que conviene que valide
quien sí audita.

**No comiteé nada.** El único cambio de código que apliqué está en `scripts/canario-frontera.ts`
(sonda + guardián + export) más `scripts/__tests__/canario-frontera.test.ts`. Las seis compuertas
se repitieron en verde después.

---

## Paso 11 — Cronómetro, sesión persistente y simulacros — 2026-07-30

**Veredicto del `code-reviewer`: APROBADO CON RESERVAS.** Sin bloqueantes. Compuertas re-ejecutadas por él sobre el árbol final: typecheck · lint · 529 tests · build · canario, las cinco en verde.

**Aviso de proceso que dejó anotado, y es justo:** revisó índice + árbol de trabajo porque la rama no tenía commits, y `simulacro-en-curso.tsx` cambió a mitad de su revisión —yo estaba derivando el índice de reanudación, que era justo un hueco que iba a reportar—. Volvió a correr las cinco compuertas después. Lección para el próximo paso: **comitear antes de pedir revisión**, o el revisor audita un objetivo móvil.

**Los 7 invariantes, verificados por él con sonda ejecutada.** Los tres que más importaban:

- **Auto-envío**: probado en el peor caso —hijo sin desmontar, `onCerrar` replicando el `borrarSesion()` del controlador— `onCerrar` se llama **una** vez y tras 10 s más de ticks sigue en una. Confirmó además que **el efecto de persistencia no resucita la sesión** tras el cierre, que era el riesgo real de tener las dos cosas en el mismo componente.
- **Examen mentiroso bloqueado**: midió que `armarSimulacro(FINAL)` **devolvería 28 ítems para un examen de 100** si nadie lo impidiera, y que los cinco simulacros se declaran inviables.
- **Pie**: `grep -rl COLEF .next/static/chunks/` → **vacío**. La atribución de ADR-001 no entra al bundle cliente, que era el punto del envoltorio.

### Qué se arregló a raíz de la revisión

| # | Hallazgo | Arreglo |
|---|---|---|
| **R1** | **Un reloj hacia atrás o un `iniciadoEnMs` futuro congelan el auto-envío.** Medido: reloj atrasado 3 h → `restantes()` devuelve la duración **completa**; y una sesión con inicio en el futuro **pasa Zod** y `seAcabo()` da `false` en 2030 | `inicioCoherente()` en `cronometro.ts`, aplicada en la reanudación (que es donde ya se lee el reloj). Una sesión con inicio futuro se trata como **no reconstruible**, igual que si le faltaran ítems |
| **R2** | `Viabilidad.exacto` se calculaba y **no lo consumía nadie**. Inerte hoy; el primer afectado sería el diagnóstico del Paso 13, que recibiría un «viable» falso en silencio | La portada **no ofrece empezar** con `exacto === false` y explica por qué; `empezar()` lo revalida; y 3 tests fijan el contrato **hoy**, en vez de confiar en que alguien relea un comentario dentro de dos pasos |
| **R3** | **Dos simulacros seguidos repetían ítems: 5 de 10.** `armarSimulacro` acepta `itemsRecientes` y `itemsDeIntentosRecientes` existía, pero no los llamaba nadie | Cableado ya. Hoy la lista sale vacía porque los intentos no se persisten hasta el Paso 12; en cuanto `guardarIntento` escriba, funciona sin tocar una línea |
| **M2** | `empezar()` no revalidaba la viabilidad; alcanzable desde `descartarYEmpezar` con una sesión vieja de un blueprint que dejó de ser viable | Guarda al principio de `empezar()` |

**Mutación de los arreglos:** `inicioCoherente` devolviendo siempre `true` mata 1 test; `exacto` fijado a `true` mata 3.

### Lo que NO se arregló, y por qué

- **M1 · `controlador-simulacro.tsx` tiene 368 líneas frente a la regla de 300** — y el revisor señala con razón que **ADR-020 justifica la partición precisamente con esa regla**. Contadas sin comentarios son 251. Hay precedente aprobado en los pasos 9 y 10 (`controlador-sesion` 390, `controlador-repaso` 594), así que la práctica del proyecto es consistente y la regla escrita no. **No lo decido yo: queda para el `software-architect`**, que tiene que elegir entre contar líneas de código o enmendar la regla. Anotado en `PENDIENTES.md`.
- **M3 · un simulacro terminado se pierde al recargar.** Es el aplazamiento ya declarado: `IntentoSimulacro.desglose` exige `calcularDesglose` de `informe.ts`, que nace en el Paso 12. El revisor lo deja anotado «para que nadie lo dé por hecho», y tiene razón: hoy se pueden hacer 120 minutos y perder el resultado con F5 en la pantalla de resumen. Sigue siendo preferible a escribir intentos que el Paso 12 tendría que migrar.

**Lo que confirmó bien resuelto:** el 🔴 del Paso 10 —`import()` sin `.catch()` dejando esqueleto eterno— se aplicó aquí en las tres cadenas de `cargarBanco`, con reintento. Y la partición de ADR-021 no es cosmética: verificó que ningún chunk de cliente lleva `COLEF` y que el canario sigue con la frontera intacta.

---

## Paso 12 — Informe diagnóstico — 2026-07-31

**Veredicto del `code-reviewer`: APROBADO CON CAMBIOS.** Un bloqueante, cuatro relevantes, tres menores. Los ocho se atendieron.

Compuertas repetidas por él en árbol limpio: typecheck · lint · 579 tests · build · canario.

> **Nota de entorno que dejó anotada:** hay **dos `next start` de una sesión previa** (PIDs 3713748 / 3920890 / 3920902) con cwd en el proyecto sujetando `.next`, y por eso `rm -rf .next` fallaba con «directorio no vacío». No los mató; construyó en un worktree aislado. **Conviene cerrarlos.**

### 🔴 El bloqueante

**`/progreso` pintaba el veredicto y nunca mostraba `NOTA_VEREDICTO`.** Medido: la página renderiza «Sólido», «Listo» —hasta 30 filas— y `grep` daba un solo consumidor de la nota, en `veredicto-informe.tsx`.

Importa porque **`/progreso` está en la barra de navegación**: se llega sin pasar por ningún informe. §22 regla 11 dice que la nota se muestra *siempre*, y §1 de la licencia lo respalda («sus veredictos no representan el puntaje oficial»). El revisor ofreció el contraargumento honesto —la fila solo muestra el título, no el mensaje asertivo, y cada fila enlaza al informe— y aun así concluyó que la regla no admite grados. De acuerdo: **una línea bajo el titular de la sección**, no repetida por fila, que sería ruido.

### 🟡 Los relevantes

| # | Hallazgo | Arreglo |
|---|---|---|
| **2** | **La revisión ítem por ítem MENTÍA con la tanda incompleta.** `presentarTanda` avanza un solo rng y cada tipo consume distinto número de llamadas, así que un ítem ausente rebaraja **todo lo que venía después**. Medido sobre C5 quitando uno de seis: **2 de 5** señalaban una opción que el usuario no marcó, con el check verde en una tercera. La pantalla se contradecía sola | En esa rama se **degrada a propósito**: opciones en orden canónico, **sin señalar la elegida** —ese índice ya no significa nada— y dicho en pantalla. Se conserva lo que sigue siendo verdad: acertó o no, explicación y referencia |
| **3** | `RevisionItems` sin un solo test, siendo el componente con más lógica del paso | 5 tests de componente (jsdom), uno por fase. El del caso incompleto fija exactamente el defecto |
| **4** | La persistencia del intento sin guardián, y su radio de daño es el **estado entero** (ADR-008 + ADR-023) | Extraída a `construirIntento`, función **pura** en `informe.ts`, con 9 tests — incluido el viaje completo por `JSON.stringify`, que es como se guarda de verdad |
| **5** | `loading: () => null` **no reservaba** el hueco que ADR-024 dice reservar: la altura vivía dentro del componente diferido, así que la tabla saltaba ~200 px al llegar recharts | La altura pasa al contenedor. Sigue siendo espacio en blanco y no esqueleto: reservar el sitio no es prometer que se llenará, es no mover lo que ya se está leyendo |
| 13 | 2026-07-31 | ✅ | ✅ 636 | ✅ 87 avisos, 0 errores | ✅ (+ lint ✅ · canario ✅) | APROBADO CON CAMBIOS | 🔴 **`/plan` manda los 29 `Modulo` completos al cliente**, contra la mitad «reducidos al subconjunto serializable» de la decisión de ADR-010, y con una justificación que la medición contradice: proyectar a los 6 campos que `generarPlan` usa baja la carga útil de **19 054 → 4 674 B raw / 5 583 → 1 126 B gz (−75 %)**, no «poco». Viajan `objetivos`, `conceptosClave`, `subtitulo` y `estadoContenido`, que el motor no lee (verificado: `grep "Prescribir la zona correcta" .next/server/app/plan.rsc` acierta). La mitad dura de ADR-010 —import estático desde cliente— sí se respeta y el canario está verde. Sin ADR: solo comentario de cabecera y nota de bitácora → **escalado al `software-architect`** · 🟡 **3 mutantes vivos con la suite entera en verde**: (a) `censarModulosPara` contando publicados en vez de elegibles —la regresión exacta que ADR-025 existe para impedir, y con el contenido real cambia las cifras: 28 en vez de 14 disponibles, `faltan` 2 en vez de 16—; (b) `filtradoPara` sin poner → `exacto` falso siempre → diagnóstico bloqueado para siempre justo cuando los pasos 15–17 lo hagan armable; (c) `destinoCierre` ignorado → el diagnóstico cierra a `/resultados` y el paso pierde su razón de ser. Causa común: **`censarModulosPara` no tiene ni un test directo** (los 7 tests de ADR-025 construyen `CensoModulo[]` a mano y solo ejercitan `diagnosticarViabilidad`) y **nadie monta `ControladorSimulacro`** · 🟡 **el remedio principal de «te falta la fecha» es un enlace roto**: la advertencia dice «Ponla en Ajustes» y el CTA «Ir a Ajustes» apunta a `/ajustes`, que **devuelve 404** (`curl` sobre `next start`); `/plan` no tiene ningún campo de entrada (0 `input`/`select` medidos), así que el blueprint 13.3 «pide la fecha de examen si falta» queda sin cumplir. El 404 es anterior al paso (`pie.tsx` y la nav inferior ya enlazaban), pero este paso lo asciende a acción principal de una función requerida · 🟡 **el paso 13.4 del blueprint no se hizo ni se declaró aplazado**: `tareasDeHoy` no se conectó a «Continuar donde ibas» y hoy no tiene ningún consumidor fuera de los tests; `PENDIENTES.md` sí asigna la portada al 14.4, pero la bitácora del paso no lo dice · 🟡 **`/plan` y `/diagnostico` no son alcanzables desde el armazón**: no están en `DESTINOS` ni en la portada provisional, y el único camino a `/diagnostico` es el enlace que vive dentro de `/plan`. Lo cierra el 14.4 · 💭 `plan.test.ts` son **31** tests, no 32 (bitácora y entregable) · 💭 con `fechaExamen` a 1 día la advertencia promete «deja solo el último día para el simulacro» y no hay día de simulacro · 💭 `vista-plan.tsx:121` decide si enlazar a Ajustes con `a.includes('fecha del examen')`, y la advertencia de ritmo contiene la misma frase; latente hoy (haría falta >5 850 min de módulos y `esqModulo` topa `minutosEstimados` en 90) · 💭 `Plan` no lleva bandera de «sin fecha»: `fechaExamen` viene sintetizada e indistinguible de una real, y la vista solo puede saberlo leyendo la prosa · 💭 `censo.ts` no declara `import 'server-only'`; el canario lo cubriría, pero la barrera mecánica es más barata que la detección |

### 💭 Los menores

- **`controlador-simulacro.tsx` estaba en 300/300, margen cero** — una línea más y la compuerta salta sin aviso. Extraer `construirIntento` lo dejó en **280**, así que el arreglo del punto 4 resolvió este de paso.
- **Comentario obsoleto**: seguía diciendo «los intentos no se persisten hasta el Paso 12». Actualizado con la medición real.
- **`slugs` se recreaba en cada render** y es dependencia del efecto de carga del banco. `useMemo`, colocado **antes** de los returns condicionales — ponerlo donde estaba habría sido un hook después de un `return`.

**Mutación de los arreglos: 3 mutantes, 3 muertos** (volver a señalar la opción con tanda incompleta, aliasar `itemIds`, permitir segundos negativos).

### Lo que verificó y está bien

- **`itemsRecientes` funciona de verdad, medido por la UI real**: dos simulacros seguidos de 10 ítems sobre C5 pasaron de **5/10 repetidos a 0/10**. El cableado del Paso 11 estaba bien y solo le faltaba que alguien escribiera intentos.
- **El intento sobrevive a su propio esquema y al round-trip por `localStorage`**: `esqIntento` OK, `esqEstadoProgreso` OK. No va a cuarentena.
- **ADR-023 por las dos mitades**: el esquema rechaza los cinco campos ausentes, y `construirInforme` con ese mismo desglose cojo **no lanza**.
- **La compuerta `max-lines` tiene dientes** (mutante de +320 líneas → único `error` del lint), **81 archivos en alcance, 0 incumplidores**, y la regla 1 completa se cumple: ningún archivo exporta más de un componente.
- **recharts diferido**: de los 10 chunks ansiosos de `/resultados`, ninguno lo contiene, y la tabla se renderiza en el primer pintado sin él.

---

## Paso 14 — Punto de corte usable — 2026-07-31

**Veredicto del `code-reviewer`: RECHAZADO**, dos bloqueantes. Las seis compuertas estaban en verde; lo que falló fue **el criterio del paso**: la portada daba un consejo falso en dos combinaciones de estado alcanzables, y una de ellas era el día del examen.

Es la lección del paso y conviene dejarla escrita: **una pantalla que decide qué hacer no se valida con compuertas**. Typecheck, lint, 663 tests, build, canario y validar no detectan que el consejo sea equivocado — solo que el código compila y no revienta.

### 🔴 B1 · Una sesión vencida secuestraba la portada

El escalón 1 comprobaba `sesionViva !== null` y **nunca miraba el reloj**. Con una sesión de hace tres días afirmaba «el cronómetro sigue corriendo desde que lo empezaste», que es falso (§22 regla 10), y como nada limpia esa clave salvo visitar la ruta del simulacro, **la portada se quedaba clavada ahí indefinidamente**: los escalones 2 a 7 quedaban inalcanzables.

Arreglado con `restantes()` —que ya existía, puro y con el reloj inyectado—: con el tiempo agotado cambian el titular, el motivo y la acción («Ver cómo quedó» en vez de «Retomarlo ahora»).

### 🔴 B2 · El día del examen contradecía a `/plan`

Misma fecha, mismo estado, dos pantallas:

- **`/plan`**: «Modo Última noche: solo los datos duros. **Nada de teoría nueva.**»
- **La portada**: «Umbrales y zonas de entrenamiento · El siguiente que te falta por dominar · **45 min**».

`generarPlan` degenera a propósito cuando no quedan días y devuelve un único día sin tareas de módulo, así que la portada caía hasta el escalón «siguiente sin dominar». Con el examen ya pasado decía exactamente lo mismo, y en ningún momento mencionaba la fecha.

Arreglado con un escalón nuevo en segunda posición, que distingue «hoy» de «ya pasó».

### 🟡 Los cinco relevantes, todos aplicados

| # | Hallazgo | Arreglo |
|---|---|---|
| R1 | **Un test que no comprobaba lo que su nombre decía**: renderizaba antes de sembrar y afirmaba el escalón 2, así que pasaba igual quitándole el `publicado: false`. Lo cazó con un mutante | Reescrito: siembra primero y comprueba el escalón 7 de verdad |
| R2 | El escalón «siguiente sin dominar» **sin test**, y era justo el que emitía el copy de B2 | Cubierto |
| R3 | `dominados` no se cruzaba con `publicados` → **«3/1 módulos dominados»**, numerador mayor que denominador. Vía real: importar un respaldo en el 18.5. Y la pluralización miraba el denominador, de ahí «3/1 módulo dominado» en singular | Cruce añadido y concordancia corregida |
| R4 | **`/ajustes` es el quinto destino de la barra y devolvía 404** en las 18 rutas, en el paso que declara la app compartible | Anticipo honesto de la pantalla. Ver abajo |
| R5 | El comentario que documenta la prioridad **defendía un orden que el código no tenía** («el repaso va antes que materia nueva» — está después) | Reescrito diciendo el orden real y por qué |

**Sobre R4, que era una decisión y no un arreglo mecánico.** Las tres salidas eran: dejar el 404, retirar «Ajustes» de la barra hasta el 18.5, o adelantar una pantalla. Se eligió la tercera. Retirarlo deja la barra en cuatro destinos y obliga a devolverlo después, moviendo la navegación bajo los pies de quien ya se acostumbró —y el pie seguiría enlazando ahí—. Dejar el 404 es decirle al usuario que se equivocó él. La pantalla que hay dice qué habrá, qué se puede hacer mientras tanto, y **avisa de que sin respaldo el progreso se pierde al borrar los datos del navegador**, que es información que hoy no estaba en ninguna parte.

**Menores aplicados:** una sesión `tipo: 'quiz'` producía `/simulacros/bloque/<slug-de-módulo>`, un 404 silencioso; el escalón «siguiente sin dominar» ordenaba por el array del catálogo mientras el escalón del plan presumía que «el plan ya resolvió el orden» —dos escalones de la misma pantalla con criterios distintos—; y `orden-publicacion.tsx` afirmaba «es el que se está escribiendo ahora», que solo sería cierto durante el Paso 15.

**Mutación de los arreglos: 4 mutantes, 4 muertos.**

**Lo que confirmó bien:** **116 de 116 rutas de módulo** (29 × 4) responden 200 con contenido real —no esqueleto—, la proyección de siete campos mantiene el canario verde, y el estado corrupto no produce ninguna pantalla en blanco: versión futura → cuarentena, JSON basura → renderiza, sesión ilegible → se autolimpia.

---

## Paso 15 — Contenido del bloque D — 2026-07-31

| Paso | Fecha | typecheck | test | validar | build | Veredicto | Deuda abierta |
|---|---|---|---|---|---|---|---|
| 15 | 2026-07-31 | ✅ | ✅ 676 | ✅ 0 err | ❌ | RECHAZADO | 🔴 `max-lines` en `panel-inicio.test.tsx` (306/300) rompe lint y build — regresión, `main` pasa limpio · 🟡 sesgo de longitud: la correcta es la opción más larga en 80/128 (62 %) frente al 25 % de azar; deuda heredada de C5 (76 %), no introducida aquí |

---

## Paso 18 — Salida (PWA · glosario · herramientas · última noche · ajustes · SEO · README) — 2026-07-31

| Paso | Fecha | typecheck | test | validar | build | Veredicto | Deuda abierta |
|---|---|---|---|---|---|---|---|
| 18 | 2026-07-31 | ✅ | ✅ 724 | ✅ 0 err · 0 avisos | ✅ | APROBADO CON CAMBIOS | 🔴 `new Date()` en cuerpo de render (`respaldo.tsx:79`) · 🔴 el código cita **ADR-030**, que no existe, para amparar un cambio de firma y comportamiento en código copiado de §6 · 🟡 `/layout` js gz 133.6 → **135.3 kB** (+1.7 en las 20 rutas, Serwist) sin registrar en `COMPONENTES.md`, que es lo que ADR-021 obliga a declarar |

Compuertas corridas por código de salida, todas 0: `validar` (29 módulos, 752 ítems, 435 tarjetas,
123 términos, sin avisos) · `typecheck` · `lint` · `test` (23 archivos, 724 pruebas) · `build` ·
`canario` (41 chunks de carga ansiosa, 2 sondas, frontera intacta).

**Invariantes verificados con comando, no de memoria.** `Math.random()`: 4 hits, los 4 en
comentarios que explican por qué no se usa. `localStorage` fuera del wrapper: 0 (todos los hits
son prosa). Reloj en `src/lib/`: solo `new Date(iso)` en `fechas.ts` e `informe.ts`, determinista.
`tailwind.config.*`: no existe · `@tailwind ` en `globals.css`: 0 · `components.json` con
`"config": ""`. ADR-022: los 31 archivos del alcance por debajo de 300 líneas de código (el mayor,
`panel-inicio.tsx`, 266) y **un solo componente exportado en cada uno**.

**La frontera de ADR-010/ADR-021 aguanta.** `/glosario` y `/ultima-noche` importan `content/` en la
**página servidor**, proyectan a un subconjunto serializable y lo pasan por prop; ningún Client
Component nuevo importa `content/`. El canario lo confirma. `/glosario` documenta además que los
~40 kB del glosario **sí** viajan al cliente y por qué: filtrar en servidor sería una petición por
tecla en una app que debe funcionar sin red.

**Medición del armazón, con dos builds reales** (worktree de `main` + rama, mismo comando de
`COMPONENTES.md`):

| | `/layout` js gz | chunks |
|---|---|---|
| `main` | 133.6 kB | 8 |
| `paso-18-salida` | **135.3 kB** | **9** |

Causa identificada y legítima: el registro del service worker de Serwist
(`grep -rl serwist .next/static/chunks/` lo encuentra en `2804-*.js`, chunk del layout, y en
`main-*.js`). No es fuga de contenido. Es el precio de la PWA y hay que escribirlo, que es
exactamente la consecuencia que ADR-021 dejó por escrito.

**Lo que confirmó bien.** El flujo de importar respaldo **no tiene ningún camino que escriba antes
de confirmar**: `elegirArchivo` valida con Zod y solo llena `pendiente`; la única escritura,
`guardarEstado`, vive detrás del botón del paso 3. La cuarentena de ADR-008 cumple las tres
obligaciones de `PENDIENTES.md` —avisar con el motivo traducido (`version-futura` → «viene de una
versión más nueva», no «corrupto»), descargar y descartar con confirmación— y `leerIlegible()` se
llama desde el efecto de montaje, no en render. Y **las diez fórmulas de `calculos.ts` cuadran con
el banco**: cinco de FCmáx, reserva, Karvonen, gasto cardíaco, pulso→lpm, MET, densidad, IMC e ICC,
contrastadas contra `datos-duros.ts` (DD-021…028, DD-030, DD-090) y `banco/c2-cardiovascular.ts`.
Cero discrepancias.
