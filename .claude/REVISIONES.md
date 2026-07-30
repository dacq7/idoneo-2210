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
