# Decisiones de arquitectura — Idóneo 2210

Solo decisiones **no obvias** y su razón. Si algo ya lo dice `CLAUDE.md`, no se repite aquí.
Formato: ADR corto. Los escribe el `software-architect`; cualquier agente puede proponer uno.

---

## Decisiones heredadas del blueprint (§2.2)

Copiadas del blueprint en el Paso 1. Son el punto de partida, no discutibles sin aprobación explícita.

| Decisión | Razón |
|---|---|
| **Teoría en MDX, banco de ítems en TypeScript** (no MDX, no JSON suelto) | La teoría necesita formato rico y componentes. Los ítems necesitan tipado y validación en build. Un ítem malformado debe romper el build, no la app. |
| **Banco en módulos TS importables desde el cliente; teoría en archivos leídos con `fs`** | El banco se puede `import()` dinámicamente desde un Client Component (code splitting real: el simulacro final carga los ítems bajo interacción del usuario). La teoría es server-only. La asimetría es intencional. |
| **Zod en `prebuild`** (`scripts/validar-banco.ts`) | Con ~750 ítems escritos a mano en semanas distintas, el error humano es certeza, no riesgo. |
| **`localStorage` siempre detrás de `lib/almacenamiento.ts`** con esquema versionado y migraciones | El acceso directo rompe en Server Components y hace imposible migrar el esquema sin borrar el progreso de la gente. |
| **Los motores no conocen el reloj.** Toda función que necesita "ahora" lo recibe como parámetro (`ahoraISO: string` o `ahoraMs: number`) | Hace los cinco motores puros y testeables sin mocks, y elimina de raíz los errores de hidratación de Next 15. El único código que llama a `Date.now()` es un puñado de handlers y efectos, listados en §10.3 del blueprint. |
| **Semilla determinística por intento** (`semilla = timestamp del inicio`) | Permite reproducir el barajado de opciones de un intento exacto al revisarlo. |
| **Fechas como ISO string, nunca objetos `Date` en `localStorage`** | Serialización predecible entre versiones del esquema. |
| **Módulos con `estadoContenido: 'en-preparacion'`** | Los pasos 14–17 producen contenido durante semanas. El validador solo exige las cuotas a los módulos `'completo'`, así que la app puede desplegarse con 1 módulo terminado y 28 en preparación sin romper el build. Sin esto, el plan de 18 pasos es imposible. |
| **Búsqueda del glosario a mano** (filtro en cliente sobre <400 entradas) | Algolia/Meilisearch para 400 strings es infraestructura absurda. `String.normalize('NFD')` + `includes` resuelve el caso, funciona offline y no cuesta nada. |
| **SEO solo en la portada** | El resto de la app es privada de facto: no hay contenido público que indexar. Sin sitemap de contenido, sin RSS, sin JSON-LD de artículo. |

---

## ADR-001 · La app no puede monetizarse nunca

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 1

**Contexto:** El material fuente son las cuatro cartillas de la *Guía básica del entrenador deportivo* (COLEF Colombia y COCED, 2025), publicadas bajo **CC BY-NC-SA 4.0**. Idóneo 2210 destila ese material en teoría, tarjetas e ítems: es una **obra derivada**.

**Decisión:** La app se distribuye bajo la misma licencia CC BY-NC-SA 4.0 y **no se monetiza**: sin pagos, sin suscripciones, sin publicidad, sin patrocinios, sin muros de pago. `LICENSE` en la raíz con el texto legal completo, `"license": "CC-BY-NC-SA-4.0"` y `"private": true` en `package.json`, y atribución visible a COLEF y COCED en el pie de todas las rutas (Paso 5) y en el `README.md` (Paso 18.9).

**Alternativas descartadas:** Un plan premium o publicidad en v2. La cláusula **NC** lo prohíbe legalmente, no es una preferencia de producto. La cláusula **SA** obliga además a licenciar el derivado igual.

**Consecuencias:** La ausencia de pagos en §24 del blueprint deja de ser una decisión de alcance y pasa a ser una restricción de licencia: reabrir esa puerta exige reescribir todo el contenido desde fuentes propias o un permiso expreso de COLEF y COCED. A cambio, el proyecto se simplifica: sin cuentas, sin pasarela, sin backend.

---

## ADR-002 · Se pinean las versiones del stack contra la deriva de `@latest`

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 1

**Contexto:** El blueprint fue escrito contra versiones concretas y trae **código final copiable** (los cinco motores, los esquemas Zod, los componentes). Instalar con `@latest` hoy produce mayores nuevas cuyas APIs ya no corresponden a ese código. Cuatro casos detectados al ejecutar el Paso 1:

- `create-next-app@latest` instala **Next 16**; el blueprint cierra el stack en **Next 15** y `@serwist/next ^9` (Paso 18) no declara soporte de 16.
- `zod@latest` es **4.x**; §5 está escrito contra Zod 3 (`superRefine`, `z.record` de un argumento) y es el guardián de ~750 ítems.
- `recharts@latest` es **3.x** con API distinta; el Paso 12 está escrito contra 2.x.
- El CLI `shadcn@latest` es **4.x**: cambió de librería de componentes, eliminó `--style`/`--base-color` y genera un `components.json` con otra forma. El `components.json` de §11.6 corresponde a la línea **2.x**.

**Decisión:** Pinear: `next` 15.5.x · `zod ^3.25` · `recharts ^2.15` · `next-mdx-remote ^5` · `vitest ^3` · CLI `shadcn@2` para generar componentes. Las utilidades sin código dependiente en el blueprint (`lucide-react`, `next-themes`, `clsx`, `tailwind-merge`, `class-variance-authority`) van en su versión actual: la tabla de §18 es piso, no techo.

**Alternativas descartadas:** Construir sobre Next 16 y shadcn 4.x y adaptar el código del blueprint sobre la marcha. Se descarta porque convierte cada paso de build en una migración, y el valor del blueprint es justamente que su código se copia sin reinterpretarlo.

**Consecuencias:** El proyecto arranca deliberadamente por detrás del filo. Actualizar mayores queda como decisión explícita y aislada, no como efecto colateral de un `npm i`. `npm audit` reporta 12 avisos altos heredados de la cadena de build (`brace-expansion` vía eslint, `postcss` anidado en next, `sharp` del optimizador de imágenes); el "arreglo" que propone npm degrada Next a 9.3.3, así que no se aplica. Ninguno tiene superficie de ataque en una app sin backend cuyo build corre en local y en Vercel.

---

## ADR-003 · Los refinamientos de `esqItem` viven en funciones nombradas

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 2

**Contexto:** El §5 del blueprint construye `esqItem` así: cada miembro de la unión se define como `z.object({...}).superRefine(...)` y luego los siete se pasan a `z.discriminatedUnion('tipo', [...])`. En Zod 3 eso **no funciona**, y no es un problema de versión sino un defecto del código:

- `.superRefine()` devuelve un `ZodEffects`, no un `ZodObject`.
- `ZodDiscriminatedUnion.create` hace `getDiscriminator(type.shape[discriminator])` (`node_modules/zod/src/v3/types.ts:3196`). Un `ZodEffects` no tiene `.shape`, así que evalúa `undefined['tipo']`.
- Resultado: **`TypeError: Cannot read properties of undefined (reading 'tipo')` al construir el esquema**, es decir, al importar el módulo. Reventaría el validador del Paso 3, `almacenamiento.ts` del Paso 4 y la app entera.
- El tipo también falla: `ZodDiscriminatedUnionOption<D>` solo admite `ZodObject` (`v3/types.d.ts:602`). Con §5 literal, `tsc` reporta un único error, exactamente ahí.

**Decisión:** Cada refinamiento pasa a una función nombrada (`refItemUnica`, `refItemMultiple`, `refItemEmparejar`, `refItemOrdenar`, `refItemCaso`) que se aplica **dos veces**: al esquema por tipo, para que `esqItemUnica` y compañía conserven su comportamiento al usarse sueltos, y a la unión, con un `switch` sobre `it.tipo` ya estrechado. `discriminatedUnion` recibe los objetos planos. Las **10 reglas** (que producen **9 mensajes distintos**: `'hay opciones duplicadas'` lo comparten `unica` y `caso`) y las rutas de los issues quedan idénticas a §5. El `code-reviewer` lo comprobó ejecutando ambas versiones sobre 25 casos —los 7 válidos, 10 fallos de refinamiento, 4 de objeto y 4 que fallan a la vez en objeto y refinamiento— con huella `code`+`path`+`message` idéntica en los 25.

**Alternativas descartadas:**

- **`z.union` en vez de `discriminatedUnion`.** Compila, pero degrada los mensajes: Zod 3 escoge la opción "con menos issues" entre las 7, así que un ítem `unica` al que le falta `opciones` reporta `raíz: Invalid input` en vez de `opciones: Required`. Inservible para localizar un ítem malo entre 750, que es justamente para lo que existe el validador. Hay un test que falla ruidosamente si alguien intenta este camino.
- **Un solo `superRefine` en la unión, sin funciones nombradas.** Compila y da buenos mensajes, pero deja `esqItemUnica`…`esqItemCaso` exportados **sin** sus refinamientos: quien los use sueltos pierde la validación en silencio, y las reglas quedan duplicadas en dos sitios.

**Consecuencias:** `esqItem` pasa de `ZodDiscriminatedUnion` a `ZodEffects<ZodDiscriminatedUnion>`, así que pierde los accesores `.options` y `.discriminator`. Nadie los usa en el blueprint. `z.infer<typeof esqItem>` sigue siendo asignable a `Item` y sigue estrechando por `tipo`. Es la primera desviación del código literal del blueprint (§22, regla 2, manda copiarlo tal cual): no se edita `CLAUDE.md` porque el Paso 1 fijó `git diff CLAUDE.md` vacío como invariante de integridad, así que la desviación vive aquí y en la bitácora. Si algún día se migra a Zod 4, revisar esto primero: allí `discriminatedUnion` sí admite miembros refinados y la corrección deja de ser necesaria.

---

## ADR-004 · `content/estructura.ts` se adelanta del Paso 6 al Paso 3

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 3

**Contexto:** §17 reparte el trabajo así: el Paso 3 crea `scripts/validar-banco.ts` y los `content/*.ts` **vacíos pero con la forma correcta**, y el Paso 6 los llena. Ese reparto no funciona, por dos razones verificadas en ejecución:

1. **El validador queda rojo tres pasos.** Con `MODULOS = []`, §8 reporta dos errores legítimos: `hay 0 módulos declarados, deben ser 29` y `los pesos de los bloques suman 0, deben sumar 1`. Enganchar `prebuild` con eso deja `npm run build` rojo desde el Paso 3 hasta el Paso 6 — y `prebuild` con exit 1 **aborta antes de `next build`**, así que ciega el build precisamente en el Paso 5, donde rompen `@theme inline` de Tailwind v4, `next/font` y shadcn: fallos que solo aparecen en `next build`.
2. **La prueba de fuego del Paso 3 es imposible.** El bucle del banco es `for (const modulo of MODULOS)`: con la lista vacía **nunca corre**, así que un ítem malformado es invisible. Comprobado: registrar un ítem con explicación de 48 caracteres produce una salida byte a byte idéntica a la de `content/` vacío. El entregable declarado del Paso 3 ("el build falla ante un ítem inválido") no se puede demostrar.

**Decisión:** `content/estructura.ts` (§9.1 completo: 4 bloques y 29 módulos) se escribe en el **Paso 3**. Los otros seis archivos de `content/` quedan vacíos con su forma: `ERRATAS = []`, `GLOSARIO = []`, `DATOS_DUROS = []`, `BLUEPRINTS = {}`, `BANCO = {}`, `TARJETAS = {}`. `prebuild` se engancha en este paso, con el validador ya en verde.

**Corrección adicional al copiar §9.1:** el blueprint muestra `c5-umbrales-zonas` con `estadoContenido: 'completo'`, pero §17 paso 8 (viñeta 5) dice que es el Paso 8 el que lo cambia. Copiarlo literal produce **11 errores** (banco inexistente, tarjetas inexistentes y los 9 conceptos clave sin entrada en el glosario) y rompería también el entregable del Paso 6 tal como está escrito. §17 es la fuente de verdad del orden de trabajo por encima de la instantánea de §9.1: **C5 se escribe en `'en-preparacion'` y el Paso 8 lo voltea.**

**Alternativas descartadas:**

- **Enganchar `prebuild` y aceptar el build rojo hasta el Paso 6.** Cambia tres pasos de ceguera en el build por una nota en la bitácora, y deja la prueba de fuego sin demostrar.
- **Aplazar `prebuild` al Paso 6.** No arregla que `validar` esté rojo, y tampoco permite la prueba de fuego. Estrictamente peor.
- **Que los chequeos de totales distingan "contenido no escrito" de "contenido mal escrito".** Se cierra sobre sí misma: hay que excepcionar los 29 módulos **y** la suma de pesos, y con las dos excepciones un `content/` completamente vacío pasa en verde, lo que obliga a un tercer chequeo que vuelve a poner rojo. Además viola §22 reglas 2 y 9.

**Consecuencias:** El Paso 3 crece en un archivo de datos puros, copiado literal. El Paso 6 pierde su viñeta 1 (`estructura.ts`) y conserva las demás: §9.2 (blueprints), §9.3 (erratas), §9.4 (datos duros), §9.5 (glosario) y las rutas `/bloques` y `/modulos`. **§9.2 no se adelantó a propósito:** con la estructura ya poblada saldría verde, pero no hay razón para moverlo, y con estructura vacía dispara 35 errores. Cada paso del build vuelve a cerrar con `npm run build` en verde.

---

## ADR-005 · El validador se endureció más allá de §8

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** software-architect

**Contexto:** `scripts/validar-banco.ts` quedó byte-idéntico a §8 y las cuatro compuertas del Paso 3 en verde. Aun así, el `code-reviewer` verificó con sondas ejecutadas **cinco defectos de contenido realistas que el validador declara "Todo en orden."**:

1. **Clave huérfana en `BANCO`/`TARJETAS`.** El bucle es `for (const modulo of MODULOS)` y busca la clave en el índice; nunca recorre el índice en dirección contraria. Registrar `'c5-umbrales-zona'` (sin la `s`) apuntando a un archivo con un ítem que viola ocho reglas a la vez da **exit 0, "Todo en orden.", `Ítems: 0`**, y el único rastro dice `banco/c5-umbrales-zonas — en preparación, sin banco todavía`: un mensaje que **apunta al lado contrario del problema**. Son 58 claves escritas a mano en los pasos 15–17, y la primera se escribe en el Paso 8.
2. **La teoría MDX no se verifica nunca.** Cero `fs` y cero referencias a `content/teoria/` en §8, aunque la regla 8 de `CLAUDE.md` y la checklist de §14.4 definen `'completo'` como teoría **+** ≥12 tarjetas **+** ≥25 ítems. El validador exige las dos últimas y no la primera: un módulo puede quedar `'completo'` sin su `.mdx` y mostrarle al usuario una pantalla vacía con el build en verde.
3. **`multiple` no detecta opciones duplicadas**, refinamiento que sí tienen `unica` y `caso`. El ítem resultante es irresoluble: la opción correcta aparece dos veces y solo un índice cuenta.
4. **`emparejar` vigila el índice izquierdo repetido en `pares`, no el derecho.** `pares: [[0,0],[1,0],[2,2],[3,3]]` pasa: el derecho 0 se usa dos veces, el 1 queda huérfano y la relación deja de ser biyectiva.
5. **El mínimo de 28 ítems del bloque C no está enforced.** `CUOTAS.minimoItems` es global (25), pero §14.4 pide "28 en el bloque C" y el entregable del Paso 16 dice "≥28 cada uno". Hoy el Paso 16 se puede declarar cumplido con 25: es una cuota escrita en el plan que ningún comando comprueba.

**Por qué un falso negativo es peor que no validar.** Un validador falla de dos maneras y no cuestan lo mismo. Si falla **ruidoso** —marca como malo algo que está bien— el costo es una interrupción: alguien lee el mensaje, comprueba el ítem y afloja la regla. Se paga una vez, en el momento, y con la información a la vista. Si falla **en silencio** —declara bueno algo que está mal— el costo no es una interrupción sino una creencia: *"el banco está validado"*. Y esa creencia es exactamente lo que reemplaza la revisión manual.

Ahí está la asimetría: **sin validador, un humano desconfía y revisa; con un validador que dice "Todo en orden" falsamente, nadie vuelve a mirar.** El falso negativo no solo deja de proteger, retira la protección que existía antes, que era la desconfianza. El hueco 1 es el caso extremo: no calla, **desinforma** — afirma que el módulo no tiene banco cuando hay 25 ítems registrados sin revisar, así que dirige a quien investigue hacia el lado contrario.

El contexto multiplica el daño. Son ~750 ítems escritos a mano por una sola persona en semanas distintas, y el validador es el único guardián: no hay revisión por pares, ni QA, ni tests de contenido. Los defectos no se descubren en el build, se descubren en un simulacro de 120 minutos, y lo que se rompe es la confianza en el banco entero — no en el ítem. De ahí el estándar que se adopta aquí: **el criterio no es "el validador atrapa lo que §8 dice que atrape", sino "lo que el validador declara en verde está realmente en verde".** Un hueco conocido y no tapado es deuda que se cobra con interés en los pasos 15–17.

**Decisión:** los cinco huecos se cierran **antes de comitear el Paso 3**, con test que falla antes del arreglo y pasa después. Los cinco son **error**, ninguno aviso: los cinco son defectos que un humano arregla ya y que degradarían la app, y ninguno es un estado transitorio esperado de los pasos 14–17 (los huecos 2 y 5 solo se evalúan en módulos `'completo'`, así que los 28 en preparación siguen callados).

Para que 1, 2 y 5 sean testeables, la lógica se extrae a una **función pura** `validarCatalogo(catalogo) → Promise<{ errores, avisos }>` en `scripts/validar-catalogo.ts`, y `scripts/validar-banco.ts` queda como **CLI delgado**: importa el contenido real, llama a la función, imprime el informe y hace `process.exit`. La función no toca disco ni reloj ni `process`: recibe todo por parámetro, incluida la existencia de teoría como `slugsConTeoria: ReadonlySet<string>` que el CLI calcula con un `readdirSync` sobre `content/teoria/`. `vitest.config.ts` amplía su `include` a `scripts/**/*.test.ts`; `tsc` y ESLint ya cubren `scripts/` sin tocar nada (verificado con `tsc --listFiles`).

El hueco 5 se declara en `esquemas.ts` como `cuotasDelBloque(bloque)`, que devuelve `{ ...CUOTAS, minimoItems: 28 }` para C y `CUOTAS` para el resto. **`CUOTAS` no se modifica:** subirlo a 28 rompería los otros tres bloques y los 42 tests de `esquemas.test.ts`.

**Alternativas descartadas:**

- **Dejar los cinco huecos como deuda documentada y respetar §8 literal.** Es lo que §22 regla 2 pide al pie de la letra, y es la razón por la que el Paso 3 se cerró sin tocarlos. Se descarta porque la regla 2 protege los *invariantes* del código copiado (determinismo, ausencia de reloj), no sus omisiones, y la regla 9 —"el validador nunca se relaja"— apunta en la dirección contraria: un validador que aprueba en falso ya está relajado. El costo de esperar es asimétrico: cada clave de índice escrita sin la comprobación es un archivo que puede quedar sin validar para siempre.
- **Tests de integración por subproceso** (`tsx scripts/validar-banco.ts` contra contenido de prueba, afirmando sobre stdout y exit code) **en lugar** del refactor. El validador importa rutas fijas `../content/*`, así que habría que sustituir contenido real: escribir fixtures dentro de `content/` y borrarlos —que es lo que el `code-reviewer` tuvo que hacer a mano con respaldos, y deja el árbol sucio si un test falla—, o montar un directorio temporal con `node_modules` resoluble, o indirectar los imports por variable de entorno. Además cada caso paga el arranque de `tsx` y la transpilación del grafo de contenido. Se conserva **una sola** prueba de subproceso, la que el refactor no puede cubrir: que el CLI real, sin fixtures, siga saliendo 0 e imprimiendo "Todo en orden.".
- **`validarCatalogo` en `src/lib/`.** Ahorra la línea de `vitest.config.ts`, y §3 dice que la lógica vive en `src/lib/`. Se descarta porque sería el primer módulo de `src/lib/` que la app no importa nunca, e importable desde un Client Component sin que `server-only` sea aplicable (la función es pura, así que la guarda sería mentira). §3 ya le da a las herramientas de build su propia carpeta: `scripts/`.
- **Un predicado `existeTeoria(slug) => boolean` inyectado** en vez del `Set`. Equivalente para el hueco 2, pero solo responde en una dirección: no permite detectar un `.mdx` huérfano —un `d2-cargas.mdx` con la `s` de más—, que es el mismo error humano del hueco 1 en la otra carpeta. El `readdirSync` da las dos direcciones al mismo precio.
- **Reutilizar `src/lib/contenido.ts` para leer la teoría.** No existe hasta el Paso 7 y nacerá `server-only`: importarlo desde un script de build sería exactamente el acoplamiento que esa marca previene. El CLI duplica el `path.join` de tres líneas; es más barato que el acoplamiento.

**Consecuencias:** `scripts/validar-banco.ts` **deja de ser byte-idéntico a §8**, así que el proyecto pierde ese diff mecánico como prueba de integridad para este archivo — segunda desviación del código literal del blueprint, después de ADR-003. La compensación es que las ~29 comprobaciones de §8 pasan a tener, por primera vez, una superficie testeable: hoy ninguna tiene test de regresión y su única evidencia son transcripciones de la bitácora. Para que la desviación no introduzca cambios de comportamiento a escondidas, el refactor **mueve código, no lo reescribe**, y se acepta con la misma condición que ADR-003: demostrar equivalencia ejecutando la versión vieja y la nueva sobre los mismos datos, con la misma huella de errores y avisos.

**El hueco 5 choca con el Paso 8 y hay que resolverlo allí.** El módulo piloto C5 es del bloque C y §14.3 le da exactamente **25** ítems, mientras §14.4 y el Paso 16 exigen 28 para ese bloque: el blueprint se contradice consigo mismo. Como la cuota solo se evalúa en módulos `'completo'` y el Paso 8 es el que voltea C5, el choque es seguro. Se resuelve **subiendo C5 a 28 ítems** en el Paso 8, no bajando la regla: convertir el mínimo del bloque C en aviso reintroduciría precisamente la clase de falso negativo que este ADR condena. Queda anotado como desviación de §14.3 a registrar en la bitácora del Paso 8.

Aparece un mensaje de refinamiento nuevo (`el índice derecho N aparece dos veces`) y uno reutilizado (`hay opciones duplicadas`, que ahora comparten tres tipos): el tripwire de `esquemas.test.ts` pasa de 10 reglas / 9 mensajes a **12 / 10**, y las dos entradas nuevas de `REGLAS` van **al final del array**, porque el bloque de tests de ADR-003 lo indexa por posición. Con `cuotasDelBloque`, `verificarCuotas` conserva su firma y su mensaje (`el mínimo es 28` sale del propio parámetro). El validador empieza a depender del sistema de archivos, que es la razón por la que la dependencia entra por parámetro y no por `import`.

---

## ADR-006 · C5 lleva 28 ítems: §14.3 del blueprint queda corregido

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** software-architect

**Contexto:** El blueprint se contradice consigo mismo sobre cuántos ítems lleva el módulo piloto **C5 (`c5-umbrales-zonas`)**, que es del bloque C:

- **§14.3** le da exactamente **25** ítems, y su tabla de verificación de cuotas los declara conformes.
- **§14.4** ("Cómo replicar esto en los otros 28 módulos"), viñeta 3, pide "≥25 ítems (**28 en el bloque C**)".
- El **entregable del Paso 16** dice "bloque C completo (9/9 módulos, **≥28 ítems** cada uno)".

Hasta ahora el choque era latente: `CUOTAS.minimoItems` era global (25) y el 28 del bloque C era una cuota escrita en el plan que ningún comando comprobaba. **ADR-005 cerró ese hueco** (hueco 5: `CUOTAS_BLOQUE_C` + `cuotasDelBloque`), y con eso el conflicto pasa de latente a bloqueante: como la cuota solo se evalúa en módulos `'completo'` y el Paso 8 es el que voltea C5 a `'completo'` (ADR-004), el build **rompe en el Paso 8** con `banco/c5-umbrales-zonas — cuota incumplida: tiene 25 ítems, el mínimo es 28`.

**Decisión:** **C5 lleva 28 ítems, no 25.** El Paso 8 escribe tres ítems adicionales sobre los 25 de §14.3. La regla del bloque C no se toca.

La razón es de estándar, no de aritmética: **el bloque C es el 33 % del examen y C5 es la plantilla de oro que copian los otros 28 módulos.** §22 regla 10 dice que un módulo que no se le parezca "en profundidad, tono y calidad" está mal hecho, y §14.4 lo convierte en checklist ejecutable. Si el piloto nace incumpliendo su propia cuota, no queda un defecto aislado en un módulo: queda **un ejemplo que enseña a incumplirla**, replicado 28 veces por un agente que copia la forma del piloto antes que la letra de la regla.

**§14.3 del blueprint queda corregido: donde dice 25 ítems, son 28.** La corrección vive **aquí**, no en `CLAUDE.md`: el Paso 1 fijó `git diff CLAUDE.md` vacío como invariante de integridad, así que el blueprint es de solo lectura y sus correcciones se registran en los ADR. Quien vaya a construir el Paso 8 debe leer §14.3 con este ADR al lado — igual que ADR-003 corrige §5 y ADR-004 corrige la instantánea de §9.1.

**Alternativas descartadas:**

- **Bajar la regla del bloque C a aviso.** Los avisos no rompen el build (§8: son estados transitorios esperados de los pasos 14–17). Convertir el 28 en aviso deja el Paso 16 declarable como cumplido con 25 ítems por módulo y un validador que imprime "Todo en orden.": es **exactamente la clase de falso negativo que ADR-005 condena**, y encima reabre a mano el hueco que ese ADR acababa de tapar con test. Ese ADR ya dejó la resolución anticipada por escrito ("se resuelve subiendo C5 a 28 ítems en el Paso 8, no bajando la regla"); este la formaliza.
- **Volver `CUOTAS.minimoItems` a 25 global y borrar `cuotasDelBloque`.** Peor que la anterior: no solo silencia el bloque C, sino que borra del código la única constancia de que el mínimo del bloque más pesado del examen es distinto. La cuota volvería a existir únicamente como frase en el plan, que es el estado que ADR-005 diagnosticó como hueco 5.
- **Aplazarlo: dejar C5 en `'en-preparacion'` y voltearlo en el Paso 16 con los otros 8.** Vacía el Paso 8, cuyo entregable es precisamente "C5 jugable de punta a punta", y con él el punto de corte usable del Paso 14 ("la app es usable de punta a punta con C5"). Cambia un ítem y medio de trabajo por perder el único módulo demostrable durante nueve pasos.

**Consecuencias — qué hereda el Paso 8 en concreto:**

Tres ítems nuevos (`C5-026`, `C5-027`, `C5-028`) sobre los 25 de §14.3, escritos con el mismo estándar: explicación ≥200 caracteres con la estructura *por qué la correcta lo es → por qué falla el distractor más tentador → dato para recordar*, `referencia` a Cartilla 3, y distractores del mismo campo semántico.

**Dos de los tres están forzados por las cuotas de nivel**, porque `verificarCuotas` compara `porNivel[nivel] / n` contra la fracción mínima y al subir `n` de 25 a 28 los umbrales se mueven:

| Nivel | Mínimo | Umbral con n=28 | §14.3 tiene | Con n=28 daría | Veredicto | Hace falta |
|---|---|---|---|---|---|---|
| recuerdo | ≥40 % | 11,2 → **12** ítems | 11 | 11/28 = 39,3 % | **incumple** | **+1** |
| comprensión | ≥30 % | 8,4 → **9** ítems | 8 | 8/28 = 28,6 % | **incumple** | **+1** |
| aplicación | ≥20 % | 5,6 → **6** ítems | 6 | 6/28 = 21,4 % | cumple, sin margen | libre |

La suma de mínimos es 27, así que el tercer ítem es libre de nivel. **Va a aplicación**, para que los tres niveles queden con holgura en vez de dejar aplicación pegada al umbral (6 contra 5,6 es margen de 0,4 ítems; 7 contra 5,6 es de 1,4): reparto final **12 recuerdo · 9 comprensión · 7 aplicación** = 42,9 % / 32,1 % / 25,0 %.

Las otras dos cuotas **ya sobran y no condicionan nada**: dificultad va 7 · 11 · 7 contra un mínimo de 3 por nivel, y hay 7 tipos distintos contra un mínimo de 4. Los tipos se eligen entonces por criterio pedagógico, no por obligación. Recomendado: **una `unica`** (el tipo dominante del examen, 65 % del blueprint FINAL, y hoy C5 va en 52 %), **una `multiple`** (sube de 2 a 3; es el tipo que mejor discrimina comprensión, evaluando afirmaciones una a una como ya hace `C5-022`) y **una `calculo`** (sube de 3 a 4; coherente con que el bloque C es el que concentra las fórmulas y con que el tercer ítem sea de aplicación). Reparto final de tipos: 14 única · 4 cálculo · 3 caso · 3 múltiple · 2 emparejar · 1 ordenar · 1 V/F.

Nada más del módulo se mueve: las **15 tarjetas** siguen sobre el mínimo de 12 y los **9 conceptos clave** ya están en el glosario, así que la checklist de §14.4 se cierra igual. La cuota de C5 en el blueprint FINAL son 4 ítems sobre 100: 28 sigue dando de sobra para cuatro simulacros sin repetición notoria.

**Los otros 8 módulos del bloque C heredan el mismo mínimo de 28** — C1, C2, C3, C4, C6, C7, C8 y C9 — y lo hacen en el **Paso 16**, donde ya estaba declarado como entregable. Con `cuotasDelBloque` enforzándolo, ese entregable pasa de promesa a compuerta: los nueve módulos del bloque de mayor peso del examen se declaran completos solo cuando `npm run validar` lo confirma. Para los tres bloques restantes el mínimo sigue siendo 25.

Tercera desviación del código literal del blueprint, después de ADR-003 (§5) y ADR-005 (§8), y la primera que toca **contenido** en vez de código. Se registra en la bitácora del Paso 8 al escribir los tres ítems.

### Enmienda — 2026-07-29: se editó `CLAUDE.md`

Mismo criterio que la enmienda de ADR-007: **el blueprint se corrige cuando su instrucción literal rompe el build y no deja rastro que apunte al ADR.** Cuatro líneas, todas sobre C5:

| Línea | Qué decía | Ahora |
|---|---|---|
| 176 | árbol de directorios: "25 ítems del módulo piloto" | 28 |
| 5350 | título de §14.3: "— 25 ítems, los 7 tipos" | "— 28 ítems", más una nota con los 3 ítems que faltan y su nivel forzado |
| 6295 | Paso 8, viñeta 3: "copiar §14.3 (25 ítems)" | "copiar §14.3 y **escribir 3 ítems más hasta 28**", con el reparto 12/9/7 y el puntero a este ADR |
| 6319 | Paso 8, entregable: "`validar` en verde con 25 ítems" | 28 — con 25 el validador **no** estaría verde |

**Por qué era urgente y no bastaba con el ADR.** El Paso 8 lee su propia viñeta 3, copia los 25 ítems de §14.3, voltea C5 a `'completo'` y **entonces** el validador rompe por la cuota del bloque C — con todo el trabajo de redacción ya hecho, y dejando al ejecutor entre dos fuentes que se contradicen: el blueprint dice 25, el ADR dice 28. El ADR solo no lo evita, porque nada en el camino del Paso 8 obliga a leerlo.

**El título de §14.3 no se cambió a secas.** Esa sección **contiene** 25 objetos de ítem: poner "28 ítems" sin más habría creado una inconsistencia nueva — un título que promete lo que el código no trae. La nota dice explícitamente que el código trae 25 y que faltan 3, y la tabla de verificación que sigue quedó rotulada como "los **25 ítems escritos abajo**", que es lo que verifica de verdad.

**Cinco referencias a `≥25` se dejaron intactas a propósito** (líneas 51, 2940, 5913, 6684 y 6771): son el **mínimo global**, correcto para los bloques A, B y D, y no contradicen nada para C porque 28 ≥ 25. La de §14.4 ya decía "≥25 ítems (28 en el bloque C)", que es justamente la regla que este ADR hizo valer.

---

## ADR-007 · Los hooks se exportan con prefijo `use`, los archivos siguen en español

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 4

**Contexto:** §6.1 del blueprint exporta el hook como `usarEstado`, coherente con la regla 5 de `CLAUDE.md` ("nombres en español, igual que el dominio"). Con ese nombre, `npm run lint` queda **rojo**:

```
error  React Hook "useSyncExternalStore" is called in function "usarEstado" that is
neither a React function component nor a custom React Hook function
react-hooks/rules-of-hooks
```

`eslint-plugin-react-hooks` tiene el prefijo hardcodeado (`isHookName`: `s === 'use' || /^use[A-Z0-9]/`), y `additionalHooks` solo afecta a `exhaustive-deps`, no a `rules-of-hooks`. No hay configuración que lo resuelva.

Y el costo mayor no es el error, es lo que se pierde: **al no reconocer la función como hook, la regla deja de auditar su interior.** Un `if (x) useEffect(...)` dentro de `usarSesion` (Paso 9) o `usarCronometro` (Paso 11) pasaría inadvertido — y esos dos son el código más delicado del proyecto, el que maneja el cronómetro y el auto-envío de un simulacro de 120 minutos.

**Decisión:** La **función exportada** lleva prefijo `use`: `useEstado`, `useCronometro`, `useSesion`. Los **nombres de archivo no cambian**: `src/hooks/usar-estado.ts`, `usar-cronometro.ts`, `usar-sesion.ts`, así §10.3 del blueprint sigue siendo correcto letra por letra.

La regla 5 no se viola: gobierna el **vocabulario de dominio** (`armarSimulacro`, `colaDelDia`, `verificarCuotas`), y `use` no es vocabulario sino un **marcador de protocolo** que consumen el linter, React DevTools y el compilador de React — del mismo orden que el `_` de un campo privado o el sufijo `.test.ts`.

**Alternativas descartadas:**

- **`// eslint-disable-next-line react-hooks/rules-of-hooks`.** Silencia el error pero conserva exactamente el problema que importa: el interior de la función sigue sin auditarse. Cambia una compuerta roja por un agujero silencioso, que es peor.
- **Renombrar también los archivos a `use-estado.ts`.** Obligaría a corregir §10.3 del blueprint y las 3 rutas de import que ya menciona. Cambio innecesario: el linter mira el nombre de la función, no el del archivo.

**Consecuencias:** Verificado: con `usarEstado` hay 1 error de lint; con `useEstado`, 0. Los pasos 9 y 11 heredan la convención, y con ella el chequeo interno de hooks. Al importar se lee `import { useEstado } from '@/hooks/usar-estado'`, que mezcla los dos idiomas en una línea; es el precio, y es visible en 3 archivos.

### Enmienda — 2026-07-29: se editó `CLAUDE.md`

**Es la primera vez que se toca el blueprint**, y rompe a propósito el invariante que fijó el Paso 1 (`git diff CLAUDE.md` vacío). Tres líneas, `usarEstado` → `useEstado`:

| Línea | Qué era |
|---|---|
| 1437 | `export function usarEstado(): EstadoProgreso \| null {` — el código de §6.1 |
| 6298 | Paso 8, viñeta 6: "las 4 etapas con su estado leído de `usarEstado()`" |
| 6640 | §21, el `CLAUDE.md` del proyecto destino: "`usarEstado()` devuelve `null` en el primer render" |

**Por qué esta corrección sí justifica editar el blueprint, y las cuatro anteriores no.** ADR-003 (§5), ADR-004 (§9.1), ADR-005 (§8) y ADR-006 (§14.3) corrigen cosas que **se descubren solas**: rompen el `tsc`, el validador o el build, así que quien las tropiece va a buscar la razón y la va a encontrar en el ADR. Esta no. Un ejecutor del Paso 8 que siga el blueprint literal escribiría `import { usarEstado } from '@/hooks/usar-estado'`, y eso falla como un import que no resuelve o un `TypeError` en runtime, sin ninguna señal que apunte al ADR.

Y el fondo no es de nomenclatura: **con `usarEstado`, `react-hooks/rules-of-hooks` deja de auditar el interior del hook.** Eso apagaría la verificación en `usarSesion` (Paso 9) y `usarCronometro` (Paso 11), que son el controlador de sesión y el cronómetro con auto-envío — el código más delicado del proyecto. El invariante de "blueprint de solo lectura" existe para proteger la integridad de la fuente, no para conservar un error que rompe el build y apaga una compuerta.

**Alcance de la edición:** exactamente 3 líneas (`git diff --stat` → `3 insertions(+), 3 deletions(-)`), y cero referencias a `usarEstado` restantes en `CLAUDE.md`. La única mención que sobrevive en el repo está en el docstring de `src/hooks/usar-estado.ts`, donde es deliberada: explica la decisión a quien lea el archivo. Los nombres de archivo siguen intactos, así que §10.3 no cambió.

---

## ADR-008 · El estado ilegible se aparta en cuarentena, no se descarta

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 4

**Contexto:** §22 regla 12 dice: *"Nunca destruir el progreso del usuario. Ni al migrar el esquema, ni al importar un JSON inválido, ni al reiniciar sin doble confirmación."* El propio §6 lo repite en un comentario: *"NUNCA borrar el progreso del usuario por un cambio de esquema."*

Pero el código de §6 hace lo contrario, y no de forma diferida: **`leerEstado` destruye el progreso en el acto**, en la primera lectura de cualquier componente.

```ts
const actual = obtenerSnapshot();
if (actual) return actual;
const nuevo = crearEstadoInicial(ahoraISO);
guardarEstado(nuevo);        // ← pisa la clave aquí mismo
```

Cualquier fallo de `esqEstadoProgreso.safeParse` —versión desconocida, campo faltante, JSON truncado— hace que `intentarMigrar` devuelva `null`, y a partir de ahí el payload original desaparece. Verificado: con `{version: 2, racha: {dias: 5}}` guardado, tras un `leerEstado` ya no existe en `localStorage`.

**Decisión:** Antes de sobrescribir, el payload ilegible se **aparta** bajo una tercera clave, `idoneo2210:estado-ilegible`, con su motivo y la fecha. API nueva de tres funciones y un tipo, sin cambiar ninguna firma existente:

```ts
export type MotivoIlegible = 'no-json' | 'sin-version' | 'version-futura' | 'invalido';
export interface EstadoIlegible { motivo: MotivoIlegible; guardadoEn: string; payload: string }
export function apartarIlegible(ahoraISO: string): EstadoIlegible | null
export function leerIlegible(): EstadoIlegible | null
export function descartarIlegible(): void
```

Tres decisiones de diseño que importan:

1. **`intentarMigrar` no se toca y sigue sin efectos secundarios.** Se llama desde el snapshot de React, es decir durante el render (§22 regla 6). La escritura de cuarentena vive en `leerEstado`, que es camino de efecto o handler. Poner la cuarentena en `obtenerSnapshot` es la trampa obvia y rompería la regla 6.
2. **La primera cuarentena gana**, nunca se pisa: si no, un segundo fallo posterior borraría el payload bueno que ya estaba apartado.
3. **`reiniciarTodo` sí la borra.** "Reiniciar todo con doble confirmación" significa todo.

Se añade también el guard `if (candidato.version > VERSION_ESQUEMA) return null;` para que una v2 futura no se "migre hacia abajo" por accidente, y el motivo `version-futura` para que /ajustes pueda decir *"tu progreso viene de una versión más nueva de la app"* en vez de *"el archivo estaba corrupto"*. Mismo comportamiento, distinta etiqueta.

**Honestidad sobre el alcance:** la cuarentena **no restaura** el progreso. Un payload que no parsea es irrecuperable en el caso general. Lo que hace es volverlo **inspeccionable, exportable y recuperable a mano**, en vez de silenciosamente permanente. Eso es lo máximo que la regla 12 puede significar aquí, y así debe comunicárselo /ajustes al usuario en el Paso 18.5.

**Segundo cambio, de una línea, por la misma razón:** en el `catch` de `escribirCrudo` se añade `localStorageUsable = false`. La sonda de 1 byte de `hayLocalStorage()` **pasa** con el disco casi lleno, así que sin esa línea la bandera se queda en `true` y `leerCrudo` sigue leyendo de `localStorage` — devolviendo el valor **viejo** mientras el nuevo está en `memoria`. Para el estado el daño lo tapa el caché de `snapshot`, pero **`leerSesion()` no tiene caché**: verificado que devolvía la sesión *vieja*, con cero respuestas, después de guardar la nueva. En un simulacro final eso es reanudar perdiendo respuestas, justo lo que el Paso 11 promete blindar. El precio es perder la sincronización entre pestañas a partir del fallo, que con el disco lleno ya estaba rota.

**Alternativas descartadas:**

- **Recuperación parcial**, quedándose con los campos que sí validan. Es una feature con superficie de test propia (validar entrada por entrada de `modulos`, `colaRepaso`, `intentos`), inventa política que el blueprint no tiene, y produce una pérdida **más silenciosa** que la cuarentena: un estado que parece sano al que le faltan intentos. El caso realista que la motivaría —v2 añade un campo requerido— es justo para lo que existe el gancho `if (candidato.version === 1)`. Escalera de migración para lo previsible, cuarentena para lo imprevisible.
- **Dejar §6 tal cual**, entendiendo que "no perder progreso" solo aplica al import de /ajustes. La regla 12 dice explícitamente "ni al migrar el esquema".
- **Trato asimétrico real para `version-futura`** (no sobrescribir nunca, dejar el payload v2 intacto). Suena correcto para un rollback de deploy, pero exigiría que `leerEstado` devuelva un estado sin persistirlo **y** que `guardarEstado` respete un modo solo-lectura en toda la capa. Es una feature, no un mínimo. Con cuarentena el dato v2 sobrevive igual: recuperable, no automático.

**Consecuencias:** §6 crece ~70 líneas, la mitad comentarios, y `localStorage` pasa de dos claves a tres — §6 dice "dos claves, deliberadamente separadas", y esta tercera se justifica por la regla 12. El Paso 18.5 hereda una obligación concreta: **la UI de /ajustes debe exponer la cuarentena** (avisar de que hay un progreso apartado, permitir descargarlo y descartarlo), o el mecanismo existe sin que nadie pueda usarlo. Queda anotado en la bitácora del Paso 4.

**Riesgo latente registrado aquí, que detona en el Paso 12 y NO se arregla en este paso:** `esqIntento.desglose.porBloque` es `z.record(esqConteo)`, así que un intento **sin** los bloques B/C/D pasa Zod, pero el cast afirma `Record<BloqueId, …>` con las cuatro claves. `construirInforme` de §7.5 hace `porBloque[b.id].total` y **revienta** con `Cannot read properties of undefined`. Vía de entrada: un respaldo así se acepta como válido en `importarJSON`. El arreglo toca `src/lib/esquemas.ts` (archivo del Paso 2) y el sitio del crash es el Paso 12: se decide allí.

---

## ADR-009 · El sistema de diseño se desvía de §11.2 y §11.3 para cumplir AA

**Estado:** Aceptada
**Fecha:** 2026-07-29 · **Autor:** Paso 5 (propuesto por `ui-designer`, aprobado por el usuario)

**Contexto:** §11.3 del blueprint entrega el `globals.css` completo con la paleta en `oklch()`, y §11.2 fija las tres fuentes. El Paso 5 instruye "copiar §11.3 **entero**". Al medirlo —convirtiendo cada `oklch()` a sRGB y calculando WCAG 2.1 sobre 59 pares en los dos temas— el tema oscuro sale **impecable, 0 fallos en 29 pares**, pero el tema claro tiene **seis violaciones AA reales**:

| Par | §11.3 | Mínimo |
|---|---|---|
| `--aviso` como texto sobre el fondo | **3.11** | 4.5 |
| `--bloque-a` como texto | **3.94** | 4.5 |
| `--bloque-a` sobre su `-suave` | **3.54** | 4.5 |
| `--bloque-c` sobre su `-suave` | **4.42** | 4.5 |
| `--bloque-d` sobre su `-suave` | **4.47** | 4.5 |
| `--input`, borde que identifica un control (WCAG 1.4.11) | **1.30** | 3.0 |

Ninguna es teórica: `text-aviso` se usa en el `<Ojo>` de §12.3 y en el cronómetro cuando quedan 10 minutos —un aviso ilegible en un simulacro cronometrado es el peor sitio posible—; el panel tintado con el color del bloque es el patrón principal de una pantalla de módulo; y `--input` toca el campo del ítem de cálculo, `/ajustes` y `/herramientas`. Verificado de forma independiente por el hilo principal antes de aprobarse.

**Decisión:** ocho desviaciones aprobadas, todas de **valor**, ninguna de **nombre**.

| # | Qué | De | A |
|---|---|---|---|
| D-1 | `--aviso` claro | `0.66 0.145 72` | `0.560 0.120 72` → 4.65 |
| D-2 | `--aviso-foreground` claro | casi negro | casi blanco (forzado por D-1; alinea `--aviso` con `--destructive` y `--exito`, que ya eran «oscuro + primer plano claro») |
| D-3 | `--bloque-a` claro | `0.60 0.125 72` | `0.535 0.115 72` → 5.16 |
| D-4 | los 4 `--bloque-*-suave` claros | `L 0.955` | `L 0.972` → C y D pasan sin tocar su color |
| D-5 | `--input` en los dos temas | igual a `--border` | claro `0.66 0.014 250` · oscuro `0.51 0.022 255` → 3.03 |
| D-6 | `--border` claro | `0.902` | `0.87`. **No es AA, es legibilidad**: `--card` blanco sobre `--background` está a 1.03:1, así que la tarjeta solo existe si su borde se ve |
| D-7 | fuente display (§11.2) | Barlow | **Barlow Condensed** |
| D-8 | piso táctil de 44px (§11.3) | sin excepción | válvula `:not([data-compacto])` |

**`--bloque-b`, `--bloque-c` y `--bloque-d` conservan exactamente el valor de §11.3.** Solo cambia A, que fallaba en sus tres roles: el ámbar es el matiz que en sRGB no puede ser claro y oscuro a la vez.

**Por qué D-7.** Dos razones medibles y una de vernáculo. Los títulos reales son largos —«Sistemas nervioso, digestivo y osteomuscular» son 44 caracteres— y a 375 px con `px-4` un `h1` de 28 px en Barlow normal los parte en **tres** líneas; condensada entran en **dos**. Además Barlow e Inter son la misma voz (las dos neogrotescas de bajo contraste), así que a tamaño de titular el rol display no cumplía su función. Y la grotesca condensada es la letra del peto de competencia y del marcador: sale del mundo del sujeto. Misma familia y mismo diseñador que Barlow, así que convive con Inter y JetBrains Mono sin roce. **Regla de mitigación, que es parte de la decisión: Barlow Condensed nunca baja de 1.125rem y nunca se usa en cuerpo** — las condensadas pierden legibilidad en tamaños pequeños.

**Por qué D-8.** El piso de §11.3 (`min-height: 44px` sobre `button, [role=button], a[href], input, select, textarea`) es correcto en móvil, pero `min-height` gana sobre `height` y **rompe el `panel-navegacion` del Paso 11**: una cuadrícula de 100 botones a 44 px no cabe en pantalla. La válvula `:not([data-compacto])` permite excluir solo esa cuadrícula y los `TabsTrigger` de `/herramientas`, garantizando el objetivo táctil con `gap`. Sin ella, el Paso 11 lo resolvería con `!important`, que es peor. Los enlaces en línea de la teoría no se ven afectados: `min-height` no aplica a cajas `inline`.

**Alternativas descartadas:**

- **Renombrar tokens** para no chocar con shadcn: imposible y innecesario. Los 18 componentes generados dependen de `--primary`, `--border`, `--input`, `--ring`, `--muted`, `--accent`, `--popover` y `--radius`; se auditaron las 29 clases de token y las 4 vars crudas que usan, y §11.3 **las cubre todas**. Cambiar valores no rompe nada.
- **Oscurecer `--background`** para separar la tarjeta en vez de D-6. Medido: la separación pasa de 1.03:1 a **1.08:1, sigue imperceptible**, y estrecha el margen AA de los diez tokens que se leen encima. Mal negocio.
- **Una cuarta familia tipográfica** más «marcador» (Azeret/Martian Mono) en lugar de JetBrains Mono. Se descarta: JetBrains Mono distingue `0/O` y `1/l`, y esta app hace teclear valores de biomarcadores. El carácter de marcador sale del tratamiento, no de otra opinión tipográfica.

**Consecuencias:** con las seis correcciones de paleta, **0 fallos en los 59 pares** de los dos temas. `.claude/DISENO.md` §1.3 deja los números calculados para que el `accessibility-auditor` audite contra ellos y no descubra deuda después.

Dos efectos visibles de D-5 que se aceptan: el `Switch` de shadcn usa `bg-input` como pista apagada y pasa de gris invisible a gris medio —mejora, por fin tiene affordance—, y en oscuro `Button variant="outline"` usa `bg-input/30`, así que los botones fantasma se vuelven visibles. Es un cambio respecto al aspecto por defecto de shadcn.

`--border` queda a propósito por debajo de 3:1: solo dibuja separadores y filos, que son decorativos y están exentos de 1.4.11. Los bordes que **sí** identifican un control usan `--input`, que cumple. Documentado en `DISENO.md` §1.3 para que no se reporte como deuda.

**También aprobado en este ADR:** **dos altas** a la lista cerrada de §10.3 — `riel-bloques.tsx` y `app/error.tsx` como Client Components (**el segundo lo exige Next**, no es elección) — y la aclaración de que `encabezado.tsx` es Server Component, y omitir la línea `manifest: '/manifest.webmanifest'` de §11.2 hasta el Paso 18.1, porque ese archivo no existe hasta entonces y produciría un 404 en consola desde el Paso 5.

**El elemento firma** —el «instrumento de umbral»: riel de bloques con anchos proporcionales a `pesoExamen`, y escala de umbral para el veredicto— no es una desviación: §11 no define ninguno. Su gramática completa, con las siete reglas, vive en `DISENO.md` §4.

---

## ADR-010 · Ningún Client Component importa `content/estructura`

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** Paso 5

**Contexto:** `riel-bloques.tsx` es Client Component (necesita `usePathname` para saber en qué bloque está el usuario) e importaba `BLOQUES` de `@/content/estructura`. Parecía gratis: `BLOQUES` son 4 objetos pequeños. **No lo era.** Los 29 módulos completos —con `objetivos`, `conceptosClave`, `subtitulo` y `minutosEstimados`— viajaban al bundle del navegador. Verificado buscando cadenas en el chunk: `"Prescribir la zona correcta"`, `"conceptosClave"` y `"osteomuscular"` estaban en `static/chunks/app/layout-*.js`.

**La causa no es obvia y es lo que hay que recordar.** `content/estructura.ts` evalúa esto en el ámbito del módulo:

```ts
export const MODULOS_POR_SLUG = new Map(MODULOS.map((m) => [m.slug, m]));
```

Ese `Map` se construye al importar el módulo, así que **ancla `MODULOS`**: el empaquetador no puede eliminarlo por tree-shaking aunque solo se importe `BLOQUES`. Se probó `"sideEffects": false` en `package.json` y **no lo arregla** (149.9 → 149.6 kB, ruido). Lo mismo aplicaría a `MODULOS_POR_SLUG`, `BLOQUES_POR_ID`, `modulosDelBloque` y `moduloSiguiente`: cualquier import desde cliente los trae todos.

**Decisión:** **ningún Client Component importa `@/content/estructura`, ni `content/erratas`, `glosario`, `datos-duros`, `blueprint-examen` o los índices de `banco/` y `tarjetas/`.** Los datos entran **por prop desde un Server Component**, reducidos al subconjunto serializable que el componente necesita.

Implementado así en el Paso 5: `Encabezado` (servidor) importa `BLOQUES`, lo proyecta a `SegmentoRiel[]` —`{ id, peso, titulo }`— y lo pasa como prop. `RielBloques` no conoce `content/`.

**Medición, con builds reales:**

| | `/layout` js gz | `/layout` total gz | chunk `app/layout` raw |
|---|---|---|---|
| Antes | ~137,6 kB | 149.9 kB | 28 100 B |
| **Después** | **132.0 kB** | **144.3 kB** | **8 717 B** (−69 %) |

Las dos columnas de gz miden lo mismo con distinto alcance: la primera solo los 8 chunks `.js`, la segunda añade el chunk `.css` de 12.3 kB. **La métrica oficial del proyecto es la de `.js`** — ver `COMPONENTES.md`, que fija el comando exacto. El valor «antes» de la columna js es derivado, no medido: solo se midió el total antes del arreglo, y recomputarlo exigiría revertir el cambio. **La evidencia dura del arreglo es el chunk `app/layout`, medido en las dos corridas: 28 100 → 8 717 B raw.**

**Por qué importa mucho más de lo que parece hoy.** Con 29 módulos y 0 ítems el costo son 5,6 kB. **En los pasos 15–17 `content/` llega a ~750 ítems**, cada uno con enunciado, 4–5 opciones, una explicación de ≥200 caracteres, pasos de resolución y etiquetas. Un solo `import` descuidado desde un componente cliente metería el banco entero en el bundle inicial de una app que **debe cargar en menos de 3 s en 4G** (§3, métricas de éxito) y funcionar offline. El daño escala con el contenido, no con el código, así que el momento de fijar la regla es ahora, cuando el costo de cumplirla es un `map` de tres campos.

Esto **no contradice** la asimetría de §2.2 («el banco es importable desde el cliente»): ahí lo que se busca es `import()` **dinámico**, bajo interacción del usuario, con code splitting real —`cargarBancoModulo`, `cargarBancoCompleto`—. Lo que esta regla prohíbe es el import **estático** en el grafo del bundle inicial. Son cosas distintas: una carga 25 ítems cuando el usuario pulsa «Empezar», la otra carga 750 antes de que vea nada.

**Alternativas descartadas:**

- **`"sideEffects": false`.** Medido, no funciona: el `new Map(...)` es una expresión evaluada, no un efecto declarado.
- **Quitar `MODULOS_POR_SLUG` de `estructura.ts`** y construir el `Map` en cada consumidor. Rompería §9.1, que es código literal del blueprint, y trasladaría el costo a los Server Components que sí lo usan legítimamente. La regla de la frontera es más barata y no toca `content/`.
- **Un `content/estructura-cliente.ts`** con solo los bloques. Duplica la fuente de verdad de los pesos del examen, que es justo lo que §9.1 existe para evitar.

**Consecuencias:** cualquier componente cliente que necesite datos de contenido declara su propio tipo de prop con el subconjunto mínimo, como `SegmentoRiel`. Cuesta un `map` en el servidor y hace explícito qué cruza la frontera.

**Cómo verificarlo, y la cifra correcta a vigilar.** El `First Load JS` que imprime `npm run build` **no incluye el chunk del layout raíz**, así que subestima la primera carga en ~30 kB: reportaba 103 kB cuando la cifra real era 149.9 kB. La métrica del armazón es el **`/layout` gz** calculado desde `.next/app-build-manifest.json`, contando **solo los `.js`** y gzipeando **archivo por archivo**. Hoy: **132.0 kB js** (144.3 kB con el CSS). `COMPONENTES.md` fija el comando exacto, y usarlo sin variantes no es pedantería: durante el Paso 5 se reportaron 134.4 y 144.3 kB para el mismo build, y las dos eran correctas — cambiaba el alcance. Para detectar una regresión basta buscar una cadena de contenido en el chunk:

```bash
grep -rl "osteomuscular" .next/static/chunks/
```

Si devuelve algo, un componente cliente volvió a importar `content/`.

> **Corrección del canario — 2026-07-30, Paso 8.** La versión original de este
> comando buscaba también `conceptosClave`, y **desde el Paso 8 es un falso
> positivo**: `conceptosClave` es además un campo de `esqModulo`, y
> `src/lib/esquemas.ts` entra ahora al bundle de forma **legítima**, porque
> `almacenamiento.ts` lo importa para validar el progreso al leerlo (§6,
> `intentarMigrar`). Medido: `conceptosClave` devuelve 1 chunk y `osteomuscular`
> devuelve 0, con el bundle sano.
>
> **El canario fiable es `osteomuscular`**: es una cadena de contenido puro, no
> aparece en ningún esquema. Y el barrido va sobre `.next/static/chunks/` entero,
> no solo sobre el chunk del layout: desde el Paso 8 hay rutas con cliente propio. Esta comprobación es **preferible a la cifra**: es binaria y no depende de con qué método se midió el peso.

### Enmienda contable — 2026-07-30

Este ADR decía «tres altas» a §10.3. Son **dos**: `riel-bloques.tsx` y `app/error.tsx`. Lo de `encabezado.tsx` fue **aclarar** que es Server Component, y §10.3 es la lista de archivos que **sí** llevan `"use client"`: aclarar que un archivo no está en ella no es un alta. No cambia ninguna decisión, solo la contabilidad. Verificado el 2026-07-30: los 6 clientes reales coinciden exactamente con §10.3 + las dos altas, **sin desvíos**.

---

## ADR-011 · El barrel de `radix-ui` cuesta 77.5 kB gz por ruta — diagnóstico hecho, arreglo aplazado

**Estado:** Aceptada — **diagnóstico y regla de vigilancia**. El arreglo del código queda asignado al **Paso 9 u 11**.
**Fecha:** 2026-07-30 · **Autor:** Paso 6

**Contexto:** `src/components/ui/badge.tsx` y `src/components/ui/button.tsx`, generados por el CLI de shadcn 2.x, importan así:

```ts
import { Slot } from "radix-ui"
```

`radix-ui` es el **paquete paraguas**, y `Slot` es un componente cliente. Resultado: el barrel completo entra al bundle de cualquier ruta que use un `<Button>` o un `<Badge>`.

**Medición, por diferencia de chunks entre dos rutas del mismo tipo:**

| Ruta | js gz | chunks |
|---|---|---|
| `/modulos` — marcado propio, sin `Badge` | **106.2 kB** | 6 |
| `/not-found` — un solo `<Button asChild>` | **183.8 kB** | 7 |

El chunk extra es **uno**: `static/chunks/470-*.js`, **77.5 kB gz**. Su contenido, verificado buscando símbolos: `Slot`, `Presence`, `DismissableLayer`, `FocusScope`. Es decir, **la página 404 descarga la maquinaria de diálogos, popovers y gestión de foco de Radix para renderizar un botón.**

**Por qué es el mismo error que ADR-010, y por qué es peor.** Las dos fugas tienen idéntica forma: un `import` que parece gratis y arrastra un grafo que el tree-shaking no corta. La diferencia es la escala y la detección:

| | ADR-010 (`content/estructura`) | ADR-011 (barrel de `radix-ui`) |
|---|---|---|
| Coste medido | 5,6 kB gz | **77.5 kB gz** |
| Lo detecta el `grep` de ADR-010 | sí | **no** — no es `content/` |
| Crece con | el contenido (750 ítems en los pasos 15–17) | el número de rutas que usen `Button` o `Badge` |

**Consecuencia inmediata, y la parte de este ADR que ya está en vigor:** la vigilancia por carpeta es insuficiente. Se añade en `COMPONENTES.md` una **segunda métrica obligatoria** —el **js gz por ruta**, con su comando y la línea base del 2026-07-30— y la regla de que **una ruta que supere la línea base de su tipo sin explicación escrita se investiga antes de cerrar el paso**. Un salto de +20 kB gz sobre el piso de servidor puro (~103–107 kB) no es «así es Next»: es un import que arrastró algo.

**Decisión sobre el código: aplazada al Paso 9 u 11, a propósito.**

El arreglo de `Slot` es trivial —dos líneas— y la dependencia ya está disponible:

```
- import { Slot } from "radix-ui"
+ import { Slot } from "@radix-ui/react-slot"
```

`@radix-ui/react-slot@1.3.3` existe en `node_modules` como transitiva; habría que declararla en `dependencies` para no depender de eso.

**Pero el criterio completo no está decidido, y ese es el trabajo real.** Otros **ocho** componentes de `src/components/ui/` importan el mismo barrel, y a diferencia de `Slot` lo hacen para primitivas que **sí** usan de verdad:

| Componente | Primitiva | ¿Se usa ya? |
|---|---|---|
| `dialog.tsx` | `Dialog` | Paso 11 — reanudar sesión |
| `tabs.tsx` | `Tabs` | Paso 18.3 — `/herramientas` |
| `select.tsx` | `Select` | Paso 18.5 — `/ajustes` |
| `tooltip.tsx` | `Tooltip` | — |
| `switch.tsx` | `Switch` | Paso 18.5 |
| `scroll-area.tsx` | `ScrollArea` | Paso 11 — panel de navegación |
| `label.tsx` | `Label` | Pasos 9, 18.3, 18.5 |
| `accordion.tsx` | `Accordion` | — |

Las preguntas que hay que responder de una vez, no archivo por archivo:

1. ¿Se cambian **los diez** a paquetes granulares (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`…), lo que significa **declarar ~10 dependencias nuevas** y desviarse de lo que genera el CLI de shadcn en cada `add` futuro?
2. ¿O solo los dos que arrastran el barrel **sin necesitarlo** (`Slot` en `badge` y `button`), y los otros ocho se dejan porque ahí el barrel sí trae lo que se usa?
3. ¿Cómo se evita la regresión cuando el Paso 9 corra `npx shadcn@2 add` para un componente nuevo y vuelva a escribir `from "radix-ui"`?

**Por qué el Paso 9 u 11 y no ahora:** son los pasos que introducen `Dialog` y `ScrollArea`, así que el reparto de chunks cambia de todos modos y la medición de hoy quedaría obsoleta. Decidir con `Dialog` ya en el grafo es decidir con el caso difícil delante, no con el fácil. Y tocar diez archivos generados por el CLI queda fuera del alcance del Paso 6, que era datos y dos rutas.

**Lo que NO se acepta como consecuencia de aplazarlo:** que una ruta nueva pague 77.5 kB en silencio. `/not-found` los paga hoy y está documentado; cualquier otra ruta que los pague debe aparecer en la medición por ruta de su paso, con su explicación. **La cifra de `/not-found` (183.8 kB) no es una licencia ni una referencia: es el caso patológico.**

**Alternativas descartadas ya:**

- **`optimizePackageImports` de Next para `radix-ui`.** No se probó y no se adopta a ciegas: el paquete paraguas reexporta subpaquetes con sus propios efectos de cliente, y la opción es experimental para paquetes fuera de su lista. Si en el Paso 9 se evalúa, hay que **medirlo** con el comando por ruta, no confiar en la promesa.
- **Prohibir `Button` y `Badge` y usar marcado propio en todas partes**, como hizo `/modulos`. Funciona (106.2 kB) pero renuncia a los 18 componentes que el Paso 1 instaló a propósito, y duplica variantes a mano en cada pantalla. Es la salida de emergencia, no el plan.

---

### Condición de cierre de este ADR

**El barrel no se da por resuelto sin una respuesta escrita a esto: cómo se evita que `npx shadcn@2 add` reescriba `from "radix-ui"`.**

Es la pregunta 3 de arriba, y se eleva a condición de cierre porque las otras dos se resuelven con una decisión y un diff, mientras esta decide si el arreglo **aguanta**. El CLI de shadcn genera los componentes con el import al paquete paraguas, así que cualquier `add` futuro —y los pasos 9, 11, 18.3 y 18.5 van a correr varios— reintroduce la fuga en un archivo nuevo, sin que nada falle: compila, pasa los tests y el validador, y solo se nota en la medición por ruta.

Un arreglo que se deshace solo la próxima vez que alguien corre un comando del flujo normal no es un arreglo, es una limpieza. Así que cerrar este ADR exige elegir un mecanismo y dejarlo escrito, no solo corregir los archivos de hoy. Opciones a evaluar en el Paso 9 u 11, ninguna adoptada todavía:

- Una **comprobación en `npm run lint`** —regla de ESLint `no-restricted-imports` sobre `radix-ui`— que falle el build ante el import al paraguas. Es la única que convierte la regla en compuerta y no en costumbre; hay que ver si molesta a los 8 componentes que sí usan su primitiva del barrel.
- Un **paso de post-procesado** tras cada `shadcn add` que reescriba los imports. Automático, pero silencioso y fácil de olvidar.
- **Documentarlo y confiar en la revisión**, apoyándose en la métrica por ruta de `COMPONENTES.md`. Es lo que hay hoy, y es lo que ya falló una vez.

Mientras no haya respuesta, el estado real es: **fuga conocida, medida, contenida por la métrica por ruta, y sin arreglar.** Es honesto llamarlo así y no «pendiente de aplicar dos líneas».

---

## ADR-012 · `TipoErrata` gana un tercer valor: `aclaracion`

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** software-architect

**Contexto:** `content/erratas.ts`, transcrito hoy literal desde §9.3, trae **X-03 con `tipo: 'contradiccion'`** y, en el mismo objeto, un `loCorrecto` que dice **«No hay conflicto: 2–3 s es correcto. El problema es que se confunde con X-02.»** No es una contradicción entre cartillas ni una errata: la cartilla no dice nada incorrecto. Es una **desambiguación** frente a X-02 (ATP libre 2–3 s ≠ sistema fosfágeno 10–15 s).

El `tipo` no es un campo decorativo: **decide el rótulo**. §12.4 resuelve el título con un binario, `errata.tipo === 'contradiccion' ? 'Las cartillas se contradicen' : 'Errata de la cartilla'`, así que hoy X-03 se renderizaría bajo **«Las cartillas se contradicen»** — la frase opuesta a la que el propio cuadro contiene tres líneas más abajo.

**Se midió el catálogo completo antes de decidir, porque la medición manda sobre la elegancia: 13 de las 14 entradas están bien clasificadas.** X-01 y X-02 son contradicciones reales (36–38 vs 30–32 ATP; 5–10 s vs 10–15 s), y las once E-* son erratas verificables: contenido falso (E-01, E-02, E-05, E-11), tablas mal armadas (E-03, E-04, E-07, E-09, E-10) y tipografía (E-06, E-08). **X-03 es la única entrada que no encaja.**

**Decisión:** **`TipoErrata` pasa a `'contradiccion' | 'errata' | 'aclaracion'` y X-03 se reclasifica a `'aclaracion'`. El id `X-03` no cambia.**

La medición de 1 sobre 14 decide una cosa y no la otra. Decide que **esto no es un problema de taxonomía**: no hay que rediseñar la clasificación de las erratas, ni introducir jerarquías, ni un campo `severidad`. No decide que la única entrada desalineada deba llevar un rótulo falso — y ahí es donde entra el invariante: §22 regla 11 («la app dice la verdad») y regla 10 («retroalimentación honesta»). Un cuadro titulado *«Errata de la cartilla»* sobre un texto que dice *«no hay conflicto»* se contradice **dentro del mismo cuadro**, y lo hace en el registro de erratas, que §1 identifica como **el activo defendible del producto**. Un usuario que detecta que la app se equivoca al clasificar deja de creerle cuando le dice qué responder en el examen — que es justamente el valor de estas 3–5 preguntas.

Frente a eso, el precio del tercer valor es de dos líneas:

| Archivo | Cambio |
|---|---|
| `src/lib/tipos.ts` | la unión + el docblock de `TipoErrata` y del campo `id` |
| `src/lib/esquemas.ts` | `esqErrata.tipo: z.enum([… , 'aclaracion'])` |
| `content/erratas.ts` | `tipo` de X-03 + comentario de cabecera |
| `src/lib/__tests__/esquemas.test.ts` | 4 tests (§ más abajo) |

**El costo es hoy el más bajo que va a ser nunca**, y eso es lo que hace que se pague ahora y no en el Paso 7: los dos únicos consumidores que tendrían que aprender un tercer rótulo — `<AlertaContradiccion>` (§12.4) y la ruta `/erratas` (§17 paso 7) — **todavía no existen**. Hoy se cambia un enum; en el Paso 7 se cambia además un componente que ya rotula al revés y una ruta que ya lo agrupa mal.

**Radio de explosión: cero en persistencia.** `Errata` es contenido, no estado: no aparece en `EstadoProgreso` ni en `esqEstadoProgreso`, así que no hay versión de esquema que subir, ni migración, ni riesgo para el progreso guardado (§22 regla 12). El campo `contradiccion` de `ItemBase` (§4) y el de `DatoDuro` (§9.4) guardan **un id, no un tipo**: siguen validando contra `RE_ID_ERRATA` sin tocarse, y `DD-001 → X-03` sigue resolviendo. El cambio es puramente aditivo — ninguna entrada existente cambia de significado — y por lo tanto trivialmente reversible: borrar el valor y voltear X-03.

**Por qué el id sigue siendo `X-03` y no pasa a una familia `A-*`.** `RE_ID_ERRATA = /^[XE]-\d{2}$/` se usa en **tres** sitios (`esqErrata.id`, `camposBase.contradiccion` de los ítems y `esqDatoDuro.contradiccion`); una familia nueva obliga a tocar los tres, más `DD-001`, más dos secciones del blueprint, y no compra nada. Y el prefijo sigue siendo honesto bajo una relectura precisa: **`X-*` marca la familia de entradas que nacen de una divergencia entre cartillas, `E-*` las erratas de contenido.** X-03 existe *por causa de* X-02 — es la mitad que desambigua la misma confusión — así que pertenece a la familia X sin ser ella misma una contradicción. **El prefijo marca la familia, no el `tipo`**, y así queda escrito en el docblock de `Errata.id` y en la cabecera de `content/erratas.ts`, que era el otro sitio donde la convención se afirmaba de forma binaria.

**Alternativas descartadas:**

- **`tipo: 'errata'`.** La opción de cero cambios de esquema, y la que descarto con más cuidado porque es la tentadora: cambia un rótulo equivocado por otro menos equivocado. «Errata de la cartilla» afirma que la cartilla se equivocó, y no se equivocó. Ahorra dos líneas hoy a cambio de dejar en la UI una afirmación falsa sobre el material fuente, en la pantalla cuya credibilidad es el producto. Barato en código, caro donde importa.
- **Dejarla en `'contradiccion'`.** La peor de las tres: el rótulo dice exactamente lo contrario del cuerpo del cuadro.
- **Reescribir el texto de X-03 para que `'errata'` sea honesto** (p. ej. «la cartilla usa "ATP almacenado" y "sistema fosfágeno" de forma intercambiable»). Es doblar el contenido para que quepa en el esquema, al revés de como debe ir. Y afirmaría algo sobre las cartillas que no está verificado en la transcripción: no se inventa contenido sobre la fuente para salvar un enum.
- **Borrar X-03 y plegar su contenido en `comoResponder` de X-02, o moverlo a un `<Ojo>` de la teoría de C1.** Es la alternativa seria, porque `<Ojo>` es precisamente el mecanismo que el blueprint ya tiene para «no es un error, pero se confunde» (§12.3, y así está usado en el MDX de C5). Se descarta por tres costos concretos: `DD-001` referencia `X-03` y el validador **rompe** ante una referencia colgada, así que habría que editar también `datos-duros.ts`; el dato perdería su ícono de advertencia y su enlace en `/ultima-noche`, sobre un valor que es una trampa real de examen; y la teoría de C1 **no existe hasta el Paso 16** (`c1-vias-energeticas` está `'en-preparacion'`), así que el contenido quedaría en el piso durante nueve pasos. Plegarlo en X-02 además fusiona dos datos duros distintos (2–3 s y 10–15 s) en una sola entrada, que es la confusión que la entrada existe para deshacer.

**Consecuencias — qué hereda el Paso 7:**

1. **`<AlertaContradiccion>` (§12.4) no puede copiarse literal.** Su ternario binario mandaría cualquier `'aclaracion'` a la rama `else` = «Errata de la cartilla», que es el defecto que este ADR arregla. El rótulo pasa a tres ramas; para `'aclaracion'` el texto es **«Aclaración: no es un error»** — dice lo que el cuadro dice y desactiva la lectura de que la cartilla falló.
2. **El tratamiento visual de `'aclaracion'` no debe ser el destructivo.** `border-destructive` / `bg-destructive/5` codifica «aquí hay algo mal» y en una aclaración no lo hay; el token coherente es `aviso`, que es el que `<Ojo>` ya usa para «ojo con esto» (§12.3). La decisión final de estilo es del Paso 7 con el diseñador; lo que este ADR fija es que **no** puede ser rojo.
3. **El nombre del componente queda corto pero no se renombra ahora.** `<AlertaContradiccion>` va a renderizar los tres tipos. Renombrarlo hoy no cuesta nada porque no existe, pero §12.4 y el MDX de C5 (`<AlertaContradiccion id="E-09" />`, `id="X-02"`) ya lo llaman así en dos sitios del blueprint, y el nombre ya era impreciso para las once E-*. Se deja como está para no multiplicar la desviación; si el Paso 7 lo renombra, actualiza también el MDX de C5.
4. **La ruta `/erratas` (§17 paso 7) agrupa por tres tipos, no por dos**, y conserva el ancla `id="X-03"` — `<AlertaContradiccion>` enlaza a `/erratas#X-03` y `DD-001` llega por ahí.

**El blueprint queda desalineado en cuatro puntos y NO se editó `CLAUDE.md`.** §4 (`TipoErrata` binario), §5 (`esqErrata.tipo`), §9.3 (X-03 como `'contradiccion'`) y §12.4 (el ternario). Aplica el criterio de las enmiendas de ADR-006 y ADR-007 — «se corrige el blueprint cuando su instrucción literal está en el camino de ejecución de un paso y no deja rastro que apunte al ADR» — y aquí aplica de lleno: el Paso 7 copia §12.4 tal cual y reintroduce el rótulo falso en silencio. **La edición la autoriza el usuario, no este agente**, así que queda solicitada y no aplicada. Mientras no se aplique, el guardián es el pin de regresión: `src/lib/__tests__/esquemas.test.ts` falla si X-03 vuelve a `'contradiccion'`.

**Cuarta desviación del código literal del blueprint** — tras ADR-003 (§5), ADR-005 (§8) y ADR-006 (§14.3) — y **la primera que toca `src/lib/tipos.ts`**, que hasta hoy era byte-idéntico a §4.

**Tests (compuerta cumplida, 183 → 187):**

- `esqErrata` acepta los tres valores y rechaza `'aclaración'` con tilde, `'nota'` y `''`.
- **Pin de regresión:** X-03 en el catálogo real es `'aclaracion'`. Es el test que importa: §9.3 sigue diciendo `'contradiccion'`, y sin este pin una recopia literal del blueprint revierte el arreglo sin que nada se queje.
- Las 14 entradas reales pasan `esqErrata`.
- La convención de familia: toda `E-*` es `'errata'`; toda `X-*` es `'contradiccion'` o `'aclaracion'`.

Compuertas al cierre: `typecheck` limpio · `lint` limpio · **187 tests** · `validar` con **87 avisos y 0 errores**, 14 erratas.

### Enmienda — 2026-07-30: se editó `CLAUDE.md` en cinco puntos

Autorizado por el usuario, con el **procedimiento nuevo que queda vigente para cualquier cambio a `CLAUDE.md`: se prepara el diff sobre una copia y se revisa ANTES de aplicar.** Con 6.776 líneas, la diferencia entre una edición quirúrgica y una reescritura no se ve en un resumen.

| Punto | Qué cambió |
|---|---|
| §4, `TipoErrata` | tercer valor `'aclaracion'`, con el docblock que explica los tres |
| §4, docblock de `Errata.id` | decía en binario «'X-01' para contradicciones, 'E-01' para erratas»; ahora dice que **el prefijo marca la familia, no el `tipo`** |
| §5, `esqErrata.tipo` | `z.enum([… , 'aclaracion'])` |
| §9.3, X-03 | `tipo: 'contradiccion'` → `'aclaracion'` |
| §12.4, `<AlertaContradiccion>` | el ternario binario pasa a **tres ramas**; el JSX solo consume `rotulo` |

**19 inserciones, 6 supresiones.** Ninguna otra sección se movió.

**§12.4 es lo que justifica la autorización, y es el único de los cinco que no rompe nada.** Copiado literal, manda `'aclaracion'` al `else`, muestra «Las cartillas se contradicen» sobre un texto que dice «no hay conflicto», y **compila, valida y pasa los tests**. Los otros cuatro se descubren solos: el `typecheck` o el validador los tumban. Es exactamente el criterio de las enmiendas de ADR-006 y ADR-007 — el blueprint se corrige cuando su instrucción literal produce un defecto que no deja rastro.

El docblock del `id` entró como quinto punto por ser la misma corrección incompleta: afirmaba en binario algo que ya no lo es, y está justo donde alguien va a buscar la verdad sobre los prefijos. Su texto es **idéntico** al de `src/lib/tipos.ts`, para que blueprint y código no puedan divergir en una relectura.

**Lo que se dejó fuera a propósito:** el `border-destructive` de §12.4. El componente sigue pintando el cuadro en rojo para los tres tipos, y para una `'aclaracion'` eso es incoherente — `destructive` codifica «algo está mal» y aquí no lo hay. Pero el token y su estilo fino son **decisión del `ui-designer`**, no del blueprint. Queda en `PENDIENTES.md` → Paso 7 con la restricción fijada: **no sea rojo**.

**El pin de regresión se mantiene**, aunque §9.3 ya esté corregido. Sigue siendo el guardián: si alguien recopia el bloque de §9.3 desde una versión vieja del blueprint, desde un fork o desde un pantallazo de la conversación, el pin falla. La edición del blueprint reduce la probabilidad del error; el test es lo que lo detecta si ocurre.

