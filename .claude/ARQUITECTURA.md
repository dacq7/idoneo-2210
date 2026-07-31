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
> **Tercera corrección — 2026-07-30, Paso 10. El `grep` deja de valer y se
> sustituye por un script.** Hasta el Paso 9 bastaba con buscar cadenas en
> `.next/static/chunks/` porque **ningún** contenido llegaba a un chunk de
> cliente. El Paso 10 lo cambió: `/repaso` carga las tarjetas y los ítems que su
> cola menciona con `import()` dinámico —para lo que §2.2 y §10.2 regla 4 hicieron
> `banco/` y `tarjetas/` client-safe—, así que desde hoy hay contenido en esa
> carpeta **a propósito** y un grep a secas da falso positivo.
>
> La distinción que importa no es «¿está en un chunk?» sino **«¿lo descarga el
> usuario sin pedirlo?»**. `scripts/canario-frontera.ts` (`npm run canario`) mira
> solo los chunks que `app-build-manifest.json` declara por ruta —los de carga
> ansiosa— y deja fuera los que Next parte por un `import()`. Busca dos sondas:
> `osteomuscular` (`content/estructura.ts`) y `Malondialdehído`
> (`content/datos-duros.ts`). **No** busca cadenas de `banco/` ni `tarjetas/`:
> esas viajan al cliente por diseño y buscarlas reintroduce el falso positivo.
>
> **Verificado por mutación:** se añadió `import { MODULOS } from '@/content/estructura'`
> a `riel-bloques.tsx` —la fuga real del Paso 6— y el canario la señaló en
> `layout-*.js` con su archivo y su causa. Restaurado, vuelve a verde.
>
> **Cuarta corrección — 2026-07-30, cierre del Paso 10. La sonda `Malondialdehído`
> nació muerta.** El minificador **escapa todo carácter no ASCII** de los literales
> de cadena: `í` sale como `\xed`, `ó` como `\xf3`. Una sonda acentuada no aparece
> nunca literal en un chunk, así que **nunca podía casar**. Desde ADR-014 el canario
> venía informando «frontera intacta» sin haber comprobado una sola cadena de
> `content/datos-duros.ts`.
>
> La nota de la segunda corrección decía «verificado por mutación», y lo estaba —
> pero **solo para `osteomuscular`**, que es ASCII y sí funciona. Verificar una sonda
> de dos no es verificar el canario, y esa es la lección: una comprobación ejercitada
> a medias da la misma sensación de seguridad que una completa.
>
> La sustituye **`Mioglobina`** (`DD-066`), que cumple los tres criterios de siempre y
> además es ASCII. Y para que no se repita, el script **aborta** si alguna sonda tiene
> un carácter fuera de ASCII imprimible: mejor romper que mentir en verde. Con test
> propio en `scripts/__tests__/canario-frontera.test.ts`.
>
> **Segunda corrección — 2026-07-30, ADR-014.** El canario complementario que
> sondeaba `content/erratas.ts` (`diceLaCartilla`, «Las cartillas se contradicen»)
> quedó sin objeto: el archivo ya no existe. Lo sustituyó **`Malondialdehído`** ⚠️ *(sonda
> inválida — ver la cuarta corrección más abajo; hoy es `Mioglobina`)*
> (valor de `DD-073` en `content/datos-duros.ts`), que cumple los tres criterios:
> es un **valor** y no un nombre de campo —los nombres de campo viajan
> legítimamente dentro de los esquemas de Zod, que es lo que quemó a
> `conceptosClave`—, sale de un archivo que ningún Client Component puede
> importar, y es única en todo el repo. **No sirven las cadenas de
> `content/banco/` ni de `content/tarjetas/`**: esas entran al bundle cliente a
> propósito desde el Paso 11 y darían falso positivo.
>
> ```bash
> grep -rl "osteomuscular"   .next/static/chunks/   # content/estructura.ts
> grep -rl "Malondialdehído" .next/static/chunks/   # content/datos-duros.ts
> ```
>
> **El canario fiable es `osteomuscular`**: es una cadena de contenido puro, no
> aparece en ningún esquema. Y el barrido va sobre `.next/static/chunks/` entero,
> no solo sobre el chunk del layout: desde el Paso 8 hay rutas con cliente propio. Esta comprobación es **preferible a la cifra**: es binaria y no depende de con qué método se midió el peso.

### Enmienda contable — 2026-07-30

Este ADR decía «tres altas» a §10.3. Son **dos**: `riel-bloques.tsx` y `app/error.tsx`. Lo de `encabezado.tsx` fue **aclarar** que es Server Component, y §10.3 es la lista de archivos que **sí** llevan `"use client"`: aclarar que un archivo no está en ella no es un alta. No cambia ninguna decisión, solo la contabilidad. Verificado el 2026-07-30: los 6 clientes reales coinciden exactamente con §10.3 + las dos altas, **sin desvíos**.

---

## ADR-011 · El barrel de `radix-ui` cuesta 77.5 kB gz por ruta — ✅ CERRADA en el Paso 9

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

## ADR-012 · `TipoErrata` gana un tercer valor: `aclaracion` — ⚠️ SUPERSEDIDA por ADR-014

**Estado:** ~~Aceptada~~ **Supersedida por ADR-014** el 2026-07-30: el sistema de erratas se eliminó por completo, así que ya no hay `TipoErrata` que clasificar. Se conserva como historia.
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


---

## ADR-013 · El cuadro de errata sale del cuerpo de la teoría — ⚠️ SUPERSEDIDA por ADR-014

**Estado:** ~~Aceptada~~ **Supersedida por ADR-014** el mismo día: sacar el cuadro del cuerpo de la teoría fue la primera mitad de un movimiento que terminó en eliminar el sistema entero. Se conserva como historia.
**Fecha:** 2026-07-30 · **Autor:** hilo principal, por decisión del usuario

**Contexto.** La teoría de C5 —la plantilla de oro que se replica 28 veces— montaba dos `<AlertaContradiccion>` dentro del hilo de lectura: `E-09` en la sección R2 y `X-02` tras el `<Ojo>` del SIT. Es lo que §14.1 del blueprint prescribe, y §1 llama a ese componente **el activo defendible del producto**.

El problema no es el componente sino **dónde estaba**. En el cuerpo de la teoría producía tres efectos que no se ven al leer el blueprint y sí al leer el MDX renderizado:

1. **El dato correcto no estaba en la prosa.** La bajada de FC en reposo —la mitad de las adaptaciones de R2— vivía **solo** dentro del cuadro de E-09. Quien leyera la teoría saltándose el recuadro no aprendía el dato. Un cuadro de advertencia es tipográficamente saltable: eso es lo que lo hace útil como alerta y lo que lo descalifica como portador del contenido.
2. **Meta-discurso donde tenía que haber enseñanza.** El texto que rodeaba a E-09 decía «no uses esa tabla como fuente». Es una instrucción sobre cómo leer la Cartilla 3, no fisiología. El `<Ojo>` del SIT hacía lo mismo en menor escala: «la cartilla lo ubica en R3+».
3. **Fingía precisión que no existe.** El cuadro de X-02 resolvía «elige 10–15 s si el bloque es Ciencias Aplicadas». La verificación del usuario, con fuentes, dice que **no hay un número único**: el sistema fosfágeno sostiene de 5 a 15 s según intensidad y reservas basales de PCr. El cuadro convertía un rango real en un falso binario de bloques.

**Decisión.** **La teoría afirma el dato correcto de forma directa, integrado en la prosa, sin recuadro y sin hablar de lo que dice o deja de decir la cartilla. `/erratas` sigue existiendo, intacto, como registro de referencia.**

`<AlertaContradiccion>` **no se borra ni se despublica**: sigue registrado en `componentesMdx` y sigue siendo el componente de `/erratas` vía `ESTILO_ERRATA`. Lo que cambia es que **la teoría deja de ser uno de sus lugares**.

**Por qué esto no contradice §1.** §1 identifica como activo defendible el **haber detectado y catalogado** las contradicciones —trabajo que exige haber leído las cuatro cartillas con lápiz en mano—, no la decisión tipográfica de renderizarlas en medio de la lectura. Ese catálogo sigue completo en `content/erratas.ts` (14 entradas), sigue publicado en `/erratas`, y sigue llegando al usuario por tres vías: el enlace del pie en todas las rutas, el campo `contradiccion` de los ítems del banco —que el panel de retroalimentación del Paso 9 va a montar, y ahí el cuadro **sí** corresponde, porque el usuario acaba de fallar el ítem— y los datos duros marcados en `/ultima-noche`. La cobertura no baja; cambia el momento.

**Qué se pierde, dicho sin adorno.** El estudiante ya no sabe, leyendo la teoría, que si abre la Cartilla 3 se va a encontrar una tabla desalineada que lo contradice. Esa señal queda solo en `/erratas`. Es el precio, y se paga a sabiendas: vale más que el dato correcto esté en el hilo de lectura que una alerta sobre un libro que el estudiante quizá no abra.

**Alternativas descartadas:**

- **Dejar el cuadro y además meter el dato en la prosa.** Duplica: el mismo dato dos veces en la misma pantalla, con dos redacciones que se van a desincronizar en cuanto alguien edite una sola. Y no arregla el meta-discurso.
- **Cambiar el cuadro por un `<Ojo>`.** Sustituye un recuadro por otro. El `<Ojo>` es para «no hay error, pero aquí te vas a equivocar», y aquí lo que hay es un dato que enseñar.
- **Nota al pie o enlace en línea a `/erratas`.** Saca al usuario de la lectura hacia una ruta de referencia, en móvil, a mitad de un módulo. `/erratas` es para consultar, no para interrumpir.

**Consecuencias.**

1. **Los pasos 15–17 replican esto, no §14.1.** Queda escrito en `.claude/CONTENIDO.md`, que es lo que el autor de contenido lee antes de escribir un módulo. El blueprint queda desalineado en §14.1 y **no se editó `CLAUDE.md`**: la edición la autoriza el usuario, y aquí —a diferencia de ADR-012— el defecto **sí deja rastro**, porque un módulo nuevo que monte el cuadro se ve al revisarlo. Queda solicitada, no aplicada.
2. **`<AlertaContradiccion>` se queda sin ningún consumidor hasta el Paso 9.** No es código muerto: es **prematuro**. Está escrito, probado y con su `ESTILO_ERRATA` en uso desde `/erratas`. Anotado en `PENDIENTES.md` para que una limpieza de código muerto no se lo lleve por delante.
3. **`content/erratas.ts` se reescribió con lo verificado**, no solo se movió de sitio: X-01 pasa a 30–32 siempre (los 36–38 son el dato viejo, no «la versión de Ciencias Básicas»), X-02 pasa a rango 5–15 s, X-03 se mantiene como `'aclaracion'` y gana valor —al bajar el piso de X-02 a 5 s, el 2–3 y el 5–15 quedan más cerca, así que la desambiguación hace más falta, no menos—, y cuatro E-* se corrigieron o completaron (E-01, E-03, E-07, E-09).
4. **`content/datos-duros.ts` acompaña.** `DD-002` decía «10–15 s (Cartilla 3)» y `DD-006` presentaba 30–32 y 36–38 como dos alternativas de igual rango. Alimentan `/ultima-noche`, que es donde el usuario memoriza valores exactos la víspera: dejarlos con la resolución vieja era peor que dejarlos en el banco.

**Ningún ítem del banco cambió**, así que el reparto 12/9/7 de ADR-006 queda intacto. Se revisaron los dos que llevan campo `contradiccion` —`C5-019` (E-09) y `C5-024` (X-02)— y ninguno afirma nada que se haya caído; `C5-019` incluso queda ahora respaldado por la teoría, que antes no enseñaba el dato del que depende su respuesta correcta.

Compuertas al cierre: `typecheck` limpio · `lint` limpio · **187 tests** · `validar` 0 errores.

### Enmienda a ADR-013 — 2026-07-30: se editó `CLAUDE.md` §14.1

Autorizado por el usuario, con el procedimiento vigente desde la enmienda de ADR-012: **diff preparado sobre una copia y revisado antes de aplicar.**

| Punto | Qué cambió |
|---|---|
| §14.1, sección R2 | el párrafo de adaptaciones se amplía a las cuatro (incluida ↓FC en reposo) y el cuadro de `E-09` pasa al párrafo que enseña que **la FCmáx no sube con el entrenamiento** |
| §14.1, `<Ojo>` del SIT | «la cartilla lo ubica en R3+» → «se clasifica en R3+» — el mismo meta-discurso, sin recuadro |
| §14.1, cuadro de `X-02` | pasa a prosa que enseña **5–15 s como rango**, más la separación frente al ATP libre (2–3 s) |
| §14.1, «Lo mínimo que tienes que llevarte» | dos viñetas nuevas: adaptaciones cardiovasculares + FCmáx quieta; 5–15 s vs 2–3 s |
| Nota que sigue al bloque | **la regla que gobierna la réplica**: las erratas no van en el cuerpo de la teoría |

**10 inserciones, 4 supresiones.** Ninguna otra sección se movió.

**Las cuatro primeras son un espejo mecánico**, no una redacción nueva: se verificó extrayendo el bloque cercado de §14.1 y comparándolo con `content/teoria/c5-umbrales-zonas.mdx` — **coinciden byte a byte**.

**La quinta es la que justifica la edición, y no es espejo de nada.** Las otras cuatro arreglan el ejemplo; esta arregla **la instrucción**, que es lo que se replica 28 veces. Un autor que copie C5 sin ella puede leer la ausencia de cuadros como casualidad de este módulo. Va en la nota que ya gobierna la réplica, junto a la regla del `#` de primer nivel, y remite a este ADR.

**Diferencia con la enmienda de ADR-012, que es la que fija el criterio:** allí el defecto era invisible —§12.4 copiado literal compilaba, validaba y pasaba los tests mostrando un rótulo falso—. Aquí **deja rastro**: un módulo que monte el cuadro se ve al revisarlo. Se editó igual porque el rastro visible no protege cuando el mismo defecto se replica 28 veces antes de que alguien mire; el coste de detectarlo tarde se multiplica por 28, y el de editarlo hoy son diez líneas.

**§1 se dejó intacto**, y es decisión, no olvido. *(Dejó de serlo el mismo día: ADR-014 lo sustituyó — la frase que sigue describe el estado de §1 entre las dos ediciones, no el actual.)* Sigue llamando a `<AlertaContradiccion>` «el diferenciador». No es falso bajo la tesis de este ADR —el activo es el catálogo de contradicciones, no el sitio donde se renderiza—, es impreciso en una frase. Tocarlo abre la sección de visión del producto, que ya no es alinear §14.1.

---

## ADR-014 · El contenido enseña el dato verdadero. La app no documenta los errores de las cartillas

**Estado:** Aceptada · **supersede a ADR-012 y a ADR-013**
**Fecha:** 2026-07-30 · **Autor:** hilo principal, por decisión de producto del usuario

**Decisión.** **El sistema de erratas se elimina por completo.** El contenido de Idóneo 2210 enseña el dato **verdadero, investigado y verificado**. Las cuatro cartillas son **la guía del temario, no la fuente de verdad de cada cifra**. La app **no documenta sus errores en ningún lugar**: ni ruta, ni componente, ni campo, ni tipo, ni mención dentro de una explicación.

Rige para todo el proyecto, **incluidos los pasos 15–17**. Ningún paso futuro reintroduce el sistema.

**Qué se borró.**

| Capa | Qué desaparece |
|---|---|
| Ruta | `src/app/erratas/` entera — `PaginaErratas` y `FichaErrata` |
| Contenido | `content/erratas.ts` y sus 14 entradas |
| Componente | `src/components/mdx/alerta-contradiccion.tsx`, con `ESTILO_ERRATA` y `CLASES_DT_ERRATA`; fuera del mapa `componentesMdx` |
| Tipos | `Errata`, `TipoErrata`, y el campo `contradiccion` de `ItemBase` y de `DatoDuro` |
| Esquemas | `esqErrata`, la constante `RE_ID_ERRATA` y las dos validaciones del campo `contradiccion` |
| Validador | las comprobaciones de erratas y el conteo del resumen |
| Navegación | el enlace «Erratas y contradicciones» del pie |
| Página de módulo | la sección «Ojo con las cartillas en este módulo» |
| Tests | los 4 que fijaban la clasificación (187 → 183) |

Además se limpiaron **9 campos `contradiccion`** del contenido real (7 en `datos-duros.ts`, 2 en el banco de C5) y **tres textos que hablaban de las cartillas** en vez de enseñar: dos explicaciones de ítem y un párrafo de la teoría de C5.

**Por qué esto supersede y no solo continúa.** ADR-012 y ADR-013 son el mismo error, tomado en dos escalones. ADR-012 afinó la **taxonomía** del catálogo —añadió `'aclaracion'` para que un rótulo no mintiera—; ADR-013 movió el catálogo **fuera del cuerpo de la teoría**. Los dos aceptaban la premisa de que la app debe **catalogar el error del material fuente**, y trabajaban sobre cómo presentarlo mejor. Esta decisión rechaza la premisa: **el error de la cartilla no es contenido de estudio**. El usuario tiene que aprenderse la fisiología, no la bibliografía de sus erratas.

Visto así, ADR-013 fue la primera mitad de este movimiento sin saberlo. Su argumento —«un dato que solo vive dentro de un recuadro es un dato que el lector se salta»— llevado hasta el final dice que el sitio correcto del dato verdadero es la prosa, y que el aviso sobre el libro **no tiene sitio correcto**.

**Lo que se pierde, dicho sin adorno.** §1 del blueprint llama a este sistema «el activo defendible del producto» y afirma que son 3–5 ítems del examen real. Con esta decisión, si el examen oficial repite un error de la cartilla, la app **no prepara para marcarlo**: enseña lo cierto y el usuario responderá lo cierto. Es una pérdida real y el usuario la asume a sabiendas. A cambio, la app deja de tener dos verdades sobre el mismo dato —lo que la cartilla dice y lo que es— y **el criterio de calidad del contenido pasa a ser uno solo y verificable**: ¿es verdad?

**Consecuencia operativa para los pasos 15–17, que es donde esto se cobra.** El estándar de redacción sube: hasta hoy bastaba con destilar la cartilla; ahora **cada cifra que entra al banco tiene que estar verificada**, y donde la cartilla se equivoque, el contenido dice lo cierto sin anunciar la discrepancia. Escrito en `.claude/CONTENIDO.md`, que es lo que se lee antes de escribir un módulo.

**Lo verificado no se tira.** El catálogo borrado contenía investigación con fuentes que sigue siendo exactamente lo que los pasos 15–17 necesitan para escribir 10 módulos que aún no existen: el ATP por glucosa (30–32, y 30 en músculo esquelético por la lanzadera glicerol-3-fosfato), la duración del sistema fosfágeno (5–15 s, rango real), qué organismos son procariotas (las cianobacterias lo son; protozoos y hongos no), la mediana con n par, el porcentaje de aumento, la fecha de la Ley 2210. **Se conserva como notas de autoría en `.claude/CONTENIDO.md`, no como contenido de la app.** `.claude/` es documentación de construcción, no producto: nada de eso llega al usuario, y sin ello el autor del Paso 17 volvería a derivar los datos de una cartilla que en esos puntos se equivoca — que es justo lo que esta decisión quiere evitar.

**`CLAUDE.md` se alineó el mismo día** — ver la enmienda al pie de este ADR.

Compuertas al cierre: `typecheck` limpio · `lint` limpio · **183 tests** · `validar` 0 errores.

### Enmienda a ADR-014 — 2026-07-30: se editó `CLAUDE.md` en once secciones

Autorizado por el usuario, con el procedimiento vigente: **diff preparado sobre una copia y revisado antes de aplicar.** **46 inserciones, 366 supresiones**; el blueprint pasa de 6.810 a 6.484 líneas.

Se editó con prioridad porque **la reintroducción compila**: a diferencia de ADR-012, donde el `typecheck` tumbaba el defecto, aquí el sistema volvería como contenido nuevo y ninguna compuerta lo detendría — y once secciones lo mandaban construir justo antes de los pasos 15–17, que escriben 28 módulos.

| Sección | Qué cambió |
|---|---|
| **§1** | **el diferenciador se sustituye, no se borra**: pasa de `AlertaContradiccion` a «el contenido enseña el dato verdadero, investigado y verificado». Y fuera «registro de erratas» del alcance v1 |
| §3 | `erratas.ts`, `erratas/page.tsx` y `AlertaContradiccion` del árbol |
| §4 | `TipoErrata` y `Errata` enteros · el campo `contradiccion` de `ItemBase` y de `DatoDuro` |
| §5 | `esqErrata` · `RE_ID_ERRATA` · los dos campos `contradiccion` |
| §8 | el import, el bloque 2 del validador, las dos comprobaciones de referencia colgada y el conteo del resumen |
| §9.3 | **la sección entera** — 187 líneas |
| §9.4 | 7 campos `contradiccion`, y los dos valores que comparaban cartillas (`DD-002` → `5–15 s`; `DD-006` → `30–32 ATP · 30 en músculo esquelético`) |
| §10.1 · §11.7 | la fila `/erratas` y el enlace del pie |
| §12.4 | **la sección entera** y la entrada del mapa `componentesMdx` |
| §13 · §14 · §15.2 | el cuadro del panel de retroalimentación · la nota de réplica, los dos ítems y la regla de redacción de §14.4 · el ícono del modo última noche |
| §17 | pasos 3, 6, 7 (entregable: 5 → 4 componentes), 12, y **18.6 entero** |
| §18.9 | «Reportar una errata» → «Reportar un error de contenido», con la lógica invertida: si una cifra no cuadra con la bibliografía, **el error es nuestro** |
| §21 · §22 | `erratas.ts` del listado de `content/` · **y una regla 15 nueva en cada lista de reglas no negociables** |

**Las dos reglas 15 son el añadido que no estaba en la lista de secciones, y son lo que de verdad protege.** Un blueprint limpio no dice **por qué** está limpio: un agente que trabaje desde una copia vieja, un fork o un pantallazo no tiene nada que lo detenga. La de §22 lo dice explícito: «si encuentras aquí un resto del sistema de erratas, **no lo construyas**: está desactualizado y manda el ADR».

**Van al final de cada lista, no intercaladas**, por dos razones mecánicas: `7bis.` no es un marcador de lista válido en markdown y rompería la numeración al renderizar; y renumerar 8→9 tampoco servía, porque hay comentarios de código que citan «§22 regla 6» y «§22 regla 11» **por número**.

**Quedan tres menciones a «errata» en las 6.484 líneas, y las tres son deliberadas**: los dos párrafos nuevos de §1 y la nota de §14. Las tres dicen que las cartillas se equivocan y que la app **no lo cataloga**. Ninguna manda construir nada.

---

## ADR-015 · `src/lib/simulacro.ts` se adelanta del Paso 11 al Paso 9

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** hilo principal

**Contexto.** §17 coloca el motor de simulacro (§7.3) en el **Paso 11**. Pero el Paso 9 tiene que cerrar las etapas 3 y 4 de C5 —práctica y quiz— y para eso necesita las tres funciones del motor: `armarSimulacro` (elegir los 8 o los 10 ítems según el blueprint), `presentarTanda` (barajar opciones de forma reproducible) y `calificar`. Sin ellas, el Paso 9 no puede renderizar una tanda ni decidir si una respuesta es correcta.

El propio blueprint lo delata: **el punto 6 del Paso 9 pide tests de `calificar` en `src/lib/__tests__/simulacro.test.ts`**, un archivo que prueba un módulo que, según el orden, todavía no existiría.

**Decisión:** `src/lib/simulacro.ts` se instala en el Paso 9, con el **§7.3 literal**. El Paso 11 conserva lo suyo —`cronometro.ts`, `usar-cronometro.ts`, la persistencia de `SesionCronometro`, el diálogo de reanudar y el auto-envío—, que es de donde sale su valor real y que no depende de este adelanto.

Es el mismo movimiento que **ADR-004** hizo con `content/estructura.ts` (del Paso 6 al 3) y por la misma razón: el orden del plan es de dependencias, y aquí faltaba una.

**Consecuencia buena, y no era el objetivo:** el motor entra **acompañado de su batería de tests** en vez de esperar dos pasos sin ejercitar. Eso destapó **dos defectos del §7.3 literal** que llevaban ahí desde que se escribió el blueprint (ver más abajo). Si el motor hubiera llegado en el Paso 11 junto con el cronómetro, los dos habrían tenido dos pasos más de vida y un consumidor más.

**Los dos defectos, ambos violaciones del docblock del propio §7.3:**

1. **`calificar` daba por correcta una respuesta múltiple con basura dentro.** El docblock dice «cualquier otra forma se califica como incorrecta», pero la rama `multiple` **filtraba** los no-números en silencio: `calificar(item, [0, 1, 'basura'])` devolvía `true`. Sus ramas hermanas (`ordenar`, `emparejar`) sí rechazan. La vía de entrada es real y ya está documentada: `leerSesion()` hace `JSON.parse(crudo) as SesionCronometro` **sin Zod**, así que una sesión corrupta llega cruda a `calificar` — e **infla** el puntaje, no lo baja.
2. **`presentarItem` devolvía el ítem del banco por referencia** en `vf` y `calculo`, cuando el docblock promete una copia. Los módulos de `content/banco/` son **singletons de ES module** cacheados por `import()`: una mutación accidental desde un componente corrompería `correcta` o `respuesta` en el banco para el resto de la sesión.

Los dos se arreglaron con el diff mínimo y un test que falla antes y pasa después, verificado por mutación. Ninguno cambia la API pública ni la calificación de una respuesta bien formada.

**Tercera desviación del código literal del blueprint en `src/lib/`**, tras ADR-003 (§5) y ADR-012 (§4, ya supersedida). `CLAUDE.md` §7.3 queda desalineado en esos dos puntos y **no se editó**: a diferencia de ADR-014, el defecto **no se replica** —§7.3 se copia una sola vez y ya está copiado— y los tests lo fijan. Anotado en `PENDIENTES.md` por si algún día se rehace el blueprint.

**La suite quedó en 382 tests** (183 → 382), con 199 nuevos solo para este motor. Es desproporcionado a propósito: es donde §19 dice que un bug silencioso arruina un simulacro de 120 minutos, y la única forma de saber que un motor determinista lo es de verdad es ejercitarlo con semillas.

### Cierre de ADR-011 — 2026-07-30, Paso 9

**La causa era más concreta que el diagnóstico.** No es que el bundler se atragante con un barrel: es que el paquete paraguas **no es sacudible por construcción**. Su `dist/index.mjs` hace `import * as Dialog from "@radix-ui/react-dialog"` para las **55** primitivas — **namespace imports**, no reexportaciones planas—, y un objeto de espacio de nombres no se puede podar por miembro. El `sideEffects: false` que declara el paquete es cierto y no ayuda: el problema no son los efectos, es la forma del reexport. Y está hecho a propósito, para que puedas escribir `Dialog.Root`.

**El arreglo no es el que proponía el diagnóstico.** `radix-ui` expone un subpath por primitiva (`exports: { ".": …, "./*": … }`), y cada uno es un `export * from "@radix-ui/react-*"` de **una línea**, que sí se sacude. Así que el import correcto es `import * as Slot from "radix-ui/slot"`, **no** `@radix-ui/react-slot`: mismo paquete, misma versión, **cero dependencias nuevas**. El ADR proponía declarar la transitiva como dependencia directa; era innecesario.

**13 archivos de `src/components/ui/` reescritos**, y el criterio queda fijado de una vez para los 8 que usaban el barrel para primitivas que sí consumen, no solo para `badge` y `button`.

**Medido, sobre el mismo comando oficial de `COMPONENTES.md`:**

| Ruta | Antes | Después | |
|---|---|---|---|
| `/not-found` | **183.8 kB js gz** | **106.9 kB js gz** | **−76.9 kB** |
| `/layout` | 131.9 | 131.9 | sin cambio |
| `/modulos` | 106.2 | 106.2 | sin cambio |

El ahorro cae donde el diagnóstico dijo: la ruta que pagaba maquinaria de diálogos que no abre ningún diálogo. Un 404 pasa de costar más que cualquier ruta real a costar lo que le corresponde.

### La condición de cierre, que era la parte difícil

La pregunta que dejó abierta el ADR era la buena: **cómo se evita que `npx shadcn@2 add` reescriba `from "radix-ui"` y deshaga el arreglo solo.**

**Respuesta: no se evita.** El CLI resuelve la plantilla desde el registro remoto y no hay opción en `components.json` —ni `aliases`, ni `registries`— que reescriba el import de la primitiva. Cualquier intento de configurarlo es adivinar contra un formato que no controlamos.

**Lo que sí se puede es que no sobreviva.** `eslint.config.mjs` gana una regla `no-restricted-imports` sobre el nombre exacto `radix-ui` —los subpaths no la disparan— con el mensaje que dice qué escribir en su lugar y por qué. `npm run lint` es compuerta de cierre de paso, así que el barrel reintroducido **muere en el mismo paso en que entra**, no dos pasos después en una medición de peso.

**Verificado por mutación, no de palabra:** se reintrodujo `import { Slot } from "radix-ui"` en `badge.tsx` y `npm run lint` falló con el mensaje. Restaurado, vuelve a verde.

Esto es lo que convierte el arreglo en permanente y no en un parche con fecha de caducidad: **la protección no depende de que nadie se equivoque, sino de que la equivocación sea ruidosa.**

---

## ADR-016 · Vitest gana un segundo entorno: tests de componente en jsdom

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** hilo principal

**Contexto.** El `code-reviewer` encontró en el Paso 9 un **bloqueante silencioso**: `<Control {...props} />` en `envoltorio-item.tsx` se montaba sin `key`. React solo desmonta la hoja cuando cambia el *tipo de elemento*, así que entre dos ítems consecutivos del **mismo `tipo`** la instancia se reutilizaba con su estado local intacto. C5 tiene 4 `calculo`, 3 `multiple`, 3 `caso` y 2 `emparejar` en 28 ítems y una tanda saca 8 o 10: la adyacencia no es un caso de laboratorio.

El daño es el peor de los posibles: **el segundo `calculo` aparece con el número tecleado en el primero mientras `valor` sigue en `null`.** El usuario ve su respuesta escrita, no toca nada, `onCambio` no se dispara y el ítem **se califica en blanco**. Nada en pantalla lo delata.

Se arregló con una línea. **El problema es que su test de regresión no cabía en el proyecto**: `vitest.config.ts` corría con `environment: 'node'` e `include` de `*.test.ts` solamente. Sin DOM no hay forma de montar, desmontar y volver a montar, que es exactamente lo que este defecto necesita para manifestarse.

**Decisión:** `vitest.config.ts` pasa a **dos proyectos** separados por extensión.

| Proyecto | Entorno | Incluye | Para qué |
|---|---|---|---|
| `motores` | `node` | `src/**/*.test.ts` · `scripts/**/*.test.ts` | los motores puros de §19, como hasta hoy |
| `componentes` | `jsdom` | `src/**/*.test.tsx` | **solo** los defectos que se manifiestan al montar, desmontar y volver a montar |

Tres dependencias de desarrollo: `jsdom`, `@testing-library/react`, `@testing-library/user-event`. **Ninguna llega a producción.** No se añadió `@testing-library/jest-dom`: sus matchers son azúcar y tres asserts sobre `.value` no justifican una cuarta dependencia.

**Por qué esto no contradice §19.** §19 dice «Vitest **solo** para `src/lib/`», y la razón que da es buena: los motores son puros y deterministas, la UI se verifica con la checklist manual del 18.10. Ese razonamiento sigue en pie **y este defecto es su punto ciego**: no vive en la lógica, vive en la reconciliación. Ninguna función pura lo expresa y ningún recorrido manual lo ve — el usuario que lo sufre tampoco lo ve, que es lo que lo hace grave.

Así que la regla no se relaja, **se acota**: el proyecto `componentes` existe para la clase «solo se ve al remontar», no para probar que un botón pinta el texto que le pasas. Escrito así en el comentario de `vitest.config.ts`, que es donde alguien va a mirar antes de añadir el suyo.

**Alternativas descartadas:**

- **Dejarlo sin test.** Es lo que pedía el aplazamiento, y choca de frente con la regla del proyecto —«sin test no cuenta»— justo en el defecto más caro encontrado hasta hoy. Además el arreglo es **una línea que cualquiera puede borrar** creyendo que sobra: sin guarda, vuelve sin ruido.
- **Un test estático que haga `grep` de `key={item.id}` en el fuente.** Cero dependencias, y ata el test a la forma del código en vez de a su comportamiento: sobrevive a un renombrado y muere ante cualquier refactor honesto.
- **Volver los siete componentes totalmente controlados** para que el remontaje deje de importar. Es la solución de fondo y la descarto por precio: `calculo` necesita estado local para admitir «126,» a medio teclear, y quitarlo obligaría a subir texto en curso al controlador de sesión. Se arregla el síntoma con el idioma correcto de React y se protege con un test.
- **Playwright en vez de jsdom.** Ya se usa para las auditorías de accesibilidad, donde hace falta un navegador de verdad para medir píxeles. Para esto no: arrancar un navegador por un remontaje es 30 veces el coste, y el test dejaría de correr en la compuerta de cada paso.

**Verificado por mutación, que es lo único que prueba que un test tiene dientes:** se quitó la `key`, `npx vitest run --project componentes` falló en el caso del `calculo`; restaurada, verde. El caso de `unica` **no** falla sin `key` —ese componente es totalmente controlado y no tiene estado que arrastrar— y se conserva a propósito: documenta la diferencia y detecta el día en que alguien le añada estado local.

**Suite: 382 → 385.** Los tres nuevos son de componente.

**Consecuencia para los pasos siguientes.** El Paso 11 mete auto-envío por temporizador y reanudación de sesión —dos cosas que solo existen en el ciclo de vida— y el Paso 12 mete gráficas. Los dos tienen ahora dónde poner su test de ciclo de vida sin volver a abrir esta discusión. Lo que **no** cambia es §19: la UI no se prueba exhaustivamente en v1, y la checklist manual del 18.10 sigue siendo la verificación de la interfaz.

---

## ADR-017 · El motor SRS se desvía de §7.2 en tres puntos, todos de persistencia

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** hilo principal, sobre el hallazgo del `code-reviewer`

**Contexto.** `src/lib/srs.ts` se instaló con el **§7.2 literal** y su batería de tests lo ejercitó por primera vez. Los tres defectos que aparecieron comparten forma: **el motor produce estados que el esquema de persistencia rechaza o que la cola no vuelve a ver**. Ninguno se manifiesta como excepción al escribir; todos se cobran después, cuando el progreso ya está guardado.

**1 · `crearTarjetaSRS` copiaba `hoy` sin normalizar.** Es el único punto del motor que escribe una fecha sin pasar por `sumarDias`, que ya recorta. Si un handler le pasa `new Date().toISOString()` —lo natural, y lo que el resto de la app usa como `ahoraISO`—, la tarjeta nace con `proximaRevision: '2026-07-30T15:42:11.000Z'`. Dos consecuencias, y la segunda es peor que la primera:

- `esqTarjetaSRS` la rechaza (`RE_FECHA`), así que **todo el `EstadoProgreso` va a cuarentena** en la siguiente lectura (ADR-008).
- Y aunque sobreviviera: `colaDelDia` compara **strings**, y `'2026-07-30T15:…' <= '2026-07-30'` es `false`. La tarjeta **nunca vuelve a la cola**. Silenciosa: el usuario ve «nada que repasar hoy» y el `proximoEnDias` dice 0.

Arreglo: `proximaRevision: soloFecha(hoy)`.

**2 · El intervalo desbordaba hasta lanzar.** Con la facilidad en el techo la progresión es `3·8·22·62·174·487…`; en el acierto **18** `sumarDias` emite un año expandido (`'+112632-03'`) que falla `RE_FECHA` sin avisar, y en el **19** `new Date(…).toISOString()` lanza `RangeError` **dentro de un handler**. No hace falta estudiar 19 aciertos para llegar: `esqTarjetaSRS` valida `intervaloDias` con `int().min(0)` y **sin techo**, así que un respaldo importado con un valor absurdo pasa Zod y revienta en la primera revisión acertada.

**3 · Intervalo 0 y la cola no drena.** `{ repeticiones: 5, intervaloDias: 0 }` pasa el esquema. Al acertar, `round(0 × EF) = 0` → `proximaRevision = hoy` → la tarjeta reaparece hoy, indefinidamente.

Los dos últimos se cierran en una expresión: `Math.min(MAX_INTERVALO_DIAS, Math.max(1, …))`, con `MAX_INTERVALO_DIAS = 36_500` (100 años). El techo es **defensivo, no pedagógico**: una tarjeta a 100 años ya está retirada de hecho, así que no cambia ningún comportamiento alcanzable estudiando. La API pública solo **gana** una constante.

**Decisión adicional, y va en sentido contrario al instinto: `esqTarjetaSRS` NO recibe un `.max()`.**

Sería la simetría obvia —si el motor no genera más de 36.500, que el esquema no acepte más— y es **exactamente lo que no hay que hacer aquí**. `esqTarjetaSRS` se evalúa dentro de `esqEstadoProgreso`, así que un `intervaloDias` fuera de rango no invalida *esa tarjeta*: **invalida el estado entero** y manda a cuarentena todo el progreso del usuario (ADR-008). Un dato absurdo en una tarjeta suelta no debe costar el historial de intentos, la racha y el resto de la cola.

La capa correcta es la que ya se arregló: **el motor lo acota al escribir.** Un `intervaloDias` heredado de un respaldo raro entra, no rompe nada —`colaDelDia` solo compara fechas— y queda acotado en la primera revisión. Validar en la puerta habría convertido un dato inofensivo en una pérdida de progreso, que es justo lo que ADR-008 existe para impedir.

**Cuarta desviación del código literal del blueprint**, tras ADR-003 (§5), ADR-005 (§8) y ADR-015 (§7.3). Se repite el patrón y ya no es casualidad: **los archivos de `src/lib/` del blueprint fallan en los bordes**, no en el caso feliz, y los tres motores han necesitado el mismo tipo de arreglo — normalización de entrada y acotación de salida. El §7.4 (cronómetro) llega en el Paso 11 y conviene ejercitarlo con la misma sospecha.

`CLAUDE.md` §7.2 queda desalineado y **no se editó**: como en ADR-015, el defecto **no se replica** —§7.2 se copia una sola vez y ya está copiada— y los tests lo fijan. Anotado en `PENDIENTES.md`.

**Verificado por mutación:** los tres arreglos revertidos uno a uno, con 2, 1 y 3 tests cayendo respectivamente. **55 tests nuevos** para este motor; suite de 388 → 443.

---

## ADR-018 · El mazo de tarjetas programa con `registrarRevision`, no con `encolar`

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** hilo principal

**Contexto.** §7.2 dice que `encolar` se llama con «toda tarjeta vista en la etapa Tarjetas» y con «todo ítem fallado en práctica, quiz o simulacro». El segundo enganche se implementó así. **El primero no**, y la diferencia importa.

`encolar` crea la tarjeta con `proximaRevision = hoy`. Si el mazo de un módulo encola sus 15 tarjetas, **las 15 vencen inmediatamente**: el usuario termina la etapa 2, entra en `/repaso` un minuto después y se encuentra las mismas 15 que acaba de ver. Eso no es repaso espaciado, es repetición inmediata, y vacía de sentido la ruta que este paso construye.

**Decisión:** el mazo llama **`registrarRevision`**, que crea *y programa* según la respuesta del usuario («la sabía» / «no la sabía»). Una tarjeta acertada sale a 1 día; una fallada, también a 1 día pero con la facilidad ya penalizada. El cierre de sesión de práctica/quiz sigue con `encolar`, que ahí sí es lo correcto: **lo que fallas hoy se repasa hoy**.

La asimetría no es un descuido, es la diferencia entre los dos gestos: ver una tarjeta **es** una revisión y trae su veredicto; fallar un ítem **no** es una revisión, es el motivo por el que el elemento entra en la cola.

**El defecto que esto abrió, y su arreglo.** `registrarRevision` **no es idempotente** —a diferencia de `encolar`, que por contrato no toca lo que ya existe—, así que estudiar el mazo a las 8 y repetirlo a las 9 contaba **dos** revisiones sin espaciado real: `repeticiones` 1→2, intervalo 1→3 días. El SM-2 empieza a afirmar que el usuario recuerda algo que no ha tenido tiempo de olvidar, que es exactamente la forma de romper un algoritmo de espaciado sin que nada falle.

Había una guarda (`esRepaso`) pero solo cubría la pasada de falladas **dentro** de la sesión, no una segunda visita a la ruta.

**Arreglo: solo se programa lo que de verdad toca hoy.** Si la tarjeta ya tiene `proximaRevision > hoy`, no se re-registra. Es la semántica correcta del SRS —una tarjeta que no ha vencido no se revisa— y cubre las dos vías, la de dentro de la sesión y la de la segunda visita.

**Quinta desviación del código literal del blueprint**, tras ADR-003, ADR-005, ADR-015 y ADR-017. `CLAUDE.md` §7.2 sigue documentando el `encolar` para las tarjetas y **no se editó**: es una nota en prosa, no código copiable, y el comportamiento correcto queda fijado por el comentario del enganche y por este ADR.

---

## ADR-019 · La sesión cronometrada se valida al leerla, y una sesión ilegible se descarta

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** Paso 11

**Contexto.** `PENDIENTES.md` dejaba dos cosas anotadas para este paso, y resultaron ser la misma:

1. §6 hace `JSON.parse(crudo) as SesionCronometro` **sin validar**, y no existía `esqSesionCronometro`.
2. §7.4 llega aquí y «conviene ejercitarlo con sospecha», porque las cuatro desviaciones previas de `src/lib/` (ADR-003, ADR-005, ADR-015, ADR-017) comparten forma: **fallan en los bordes** y todas necesitaron lo mismo, normalizar la entrada y acotar la salida.

**El defecto, que es el peor posible en este paso.** Con un payload como `{"foo":1}`, `leerSesion()` devolvía un objeto sin `duracionSegundos`. Entonces `restantes()` calcula `undefined - 0` → `NaN`, y **`NaN <= 0` es `false`**, así que `seAcabo()` responde «todavía no» **para siempre**. El simulacro no se auto-envía nunca: el usuario ve `--:--`, se queda sin cronómetro y su intento no se cierra. Nada en pantalla lo delata, que es la firma de todos los defectos de esta familia.

**Decisión, en dos capas.**

- **`esqSesionCronometro` en `esquemas-progreso.ts`.** `iniciadoEnMs` y `duracionSegundos` son `z.number().finite()`, que es exactamente lo que impide el `NaN`. La sesión que no valida se descarta y se limpia.
- **El motor acota igual.** `restantes()` devuelve 0 ante una duración no finita y `transcurridos()` devuelve 0 ante un `iniciadoEnMs` corrupto. No sobra: la sesión también se construye en memoria, y un `duracionSegundos` derivado de un `blueprint.minutos` inesperado no pasa por Zod.

**Y una decisión que va en sentido contrario a ADR-017, por la razón contraria.** ADR-017 decidió deliberadamente **no** poner un `.max()` a `intervaloDias`, porque `esqTarjetaSRS` se evalúa dentro de `esqEstadoProgreso` y un dato absurdo en una tarjeta suelta habría mandado a cuarentena **todo el progreso** del usuario. Aquí la situación es la inversa: `SesionCronometro` vive en su **propia clave**, así que rechazarla no toca ni un intento, ni la racha, ni la cola de repaso. Lo que se pierde es un simulacro en curso ya ilegible, y la alternativa —dejarlo pasar— es un cronómetro que no termina.

Dicho de otra forma: **la regla no es «validar poco» ni «validar mucho», es validar en la capa cuyo radio de daño corresponde al dato.** ADR-017 y ADR-019 aplican el mismo criterio y salen distintas porque las claves son distintas.

**Detalle de la salida acotada.** `marcarAvisoVisto` filtra `avisosVistos` a los tres umbrales conocidos. Sin eso, un valor heredado de un respaldo raro crecería en cada escritura, y esta es **la ruta que más escribe de toda la app**: una vez por respuesta durante 120 minutos.

**Sexta desviación del código literal del blueprint.** `CLAUDE.md` §7.4 y §6 quedan desalineados y **no se editaron**: como en ADR-015 y ADR-017, el código no se replica —se copia una sola vez y ya está copiado— y los tests lo fijan. Anotado en `PENDIENTES.md`.

**Verificado por mutación:** revertidos uno a uno, caen 2 tests (acotación del motor) y 4 (validación al leer). Suite 456 → 527.

---

## ADR-020 · El simulacro tiene su propio controlador, separado de práctica y quiz

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** Paso 11

**Contexto.** §10.1 asigna un único `ControladorSesion` a las cinco sesiones del producto —práctica, quiz, diagnóstico y los dos simulacros—, y la cabecera del archivo del Paso 9 lo anticipaba así: «el cronómetro, el diálogo de reanudar y la escritura de `SesionCronometro` llegan con el Paso 11 y entran por aquí sin cambiar el contrato».

No entraron. Al construirlo se ve por qué.

**Decisión:** `controlador-simulacro.tsx` es un componente aparte. Dos razones, ninguna estética:

- **Tamaño medido.** `controlador-sesion.tsx` ya ocupa 391 líneas. Sumarle cronómetro, persistencia por respuesta, reanudación, panel de navegación, auto-envío y carga diferida lo dejaría muy por encima de las 300 que fija la regla de código 1 de `CLAUDE.md`.
- **Las responsabilidades divergen de verdad.** Práctica y quiz reciben su banco **por prop desde el servidor** y no persisten nada hasta el final. El simulacro **carga el banco con `import()` bajo interacción** y escribe tras cada respuesta. No es el mismo componente con un `if`: son dos ciclos de vida distintos.

**Lo que sí se comparte, que es lo que importa:** `useSesion` (la máquina de estado de una tanda), `EnvoltorioItem`, `Boton` y `ResumenSesion`. **No hay una segunda implementación de la tanda**, que era el riesgo real de partir.

`useSesion` gana dos cosas para esto, ambas aditivas y sin tocar a sus consumidores actuales: `SesionInicial` (reanudar con respuestas e índice) e `irA` (el salto del panel de navegación). El estado inicial se lee con un inicializador perezoso de `useState`, es decir **una sola vez al montar**: mirarlo en cada render haría que cada escritura en `localStorage` reinyectara el valor guardado y machacara lo que el usuario está tecleando.

**Alternativas descartadas:**

- **Ampliar `ControladorSesion` con banderas.** Es lo que decía el plan; produce un componente de ~700 líneas con dos modos que no comparten casi nada de su ciclo de vida.
- **Extraer una base común y heredar.** La parte común ya está extraída y se llama `useSesion`. Una capa más sería abstracción sin segundo caso que la justifique.

**Consecuencia:** `CLAUDE.md` §10.1 queda desalineado en una fila (la que asigna `ControladorSesion` a `/simulacros/*`) y **no se editó**, por el criterio de siempre: es una tabla descriptiva, no código copiable, y su instrucción literal no está en el camino de ejecución de ningún paso futuro.

### Enmienda — 2026-07-30: la cita de la regla 1 mezclaba dos unidades. **ADR-022** la fija

El `code-reviewer` levantó como M1 que este ADR **justifica una partición citando un límite que el resultado incumple**: dice que juntarlo todo quedaría «muy por encima de las 300 que fija la regla de código 1» y `controlador-simulacro.tsx` salió con 402 líneas. La contradicción era real, y su causa no era el razonamiento sino que **la regla no decía en qué unidad se cuenta** y este ADR usó dos sin darse cuenta: proyectó el tamaño del componente fusionado en líneas totales y lo comparó contra un límite que solo tiene sentido en líneas de código.

Medido con la unidad que ADR-022 fija —líneas de código, `skipComments` + `skipBlankLines`— la aritmética cierra, y en el mismo sentido en que la escribió este ADR:

| | Código | Contra el límite de 300 |
|---|---|---|
| `controlador-sesion.tsx` | 271 | dentro |
| `controlador-simulacro.tsx` | 259 | dentro |
| El componente fusionado que este ADR evitó | ~500 | **muy por encima** |

Así que **el argumento se sostiene y el resultado también**: fusionar habría dado un componente de ~500 líneas de código, y la partición deja las dos mitades holgadamente dentro. Lo que no se sostenía era comparar 402 contra 300 sin decir que la primera cifra incluye comentarios y la segunda no. Se corrige también el dato de partida: donde dice «`controlador-sesion.tsx` ya ocupa 391 líneas», son 390 totales y **271 de código**.

**Lo que no cambia, y conviene subrayarlo porque es lo que este episodio puso en riesgo:** la razón que sostiene esta decisión es la **segunda**, la divergencia real de ciclos de vida —práctica y quiz reciben el banco por prop y no persisten hasta el final; el simulacro carga con `import()` y escribe tras cada respuesta—. El tamaño era refuerzo, no criterio. ADR-022 lo deja escrito como regla general: **el límite de líneas es un indicador que obliga a mirar el archivo, no un criterio de diseño para decidir particiones.** Si mañana un ADR vuelve a apoyar una partición principalmente en el conteo de líneas, el argumento está mal construido aunque el número dé.

---

## ADR-021 · `esquemas.ts` y `almacenamiento.ts` se parten por consumidor, no por tema

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** Paso 11

**Contexto.** `PENDIENTES.md` traía esta deuda desde el Paso 9, con la decisión aplazada expresamente «al Paso 11»: `src/lib/esquemas.ts` manda al navegador los siete esquemas de ítem, más tarjetas y glosario, **donde ninguno se usa**; en cliente solo hace falta `esqEstadoProgreso`, que `almacenamiento.ts` importa para validar el progreso al leerlo (§6). La nota decía que partirlo «sí es arquitectura y choca con §22 regla 2, así que se reportó en vez de hacerse».

**Lo que forzó la decisión fue una medición de este paso, no una preferencia.** `OcultaEnSimulacro` (el envoltorio que oculta el pie durante un simulacro, ADR-001) vive en `Shell`, así que `almacenamiento.ts` pasó a estar en el grafo del **layout raíz**: su peso dejó de pagarlo una ruta para pagarlo **todas**, incluida la portada.

| | `/layout` js gz |
|---|---|
| Antes del paso | 132.0 kB |
| Con `OcultaEnSimulacro` importando `almacenamiento.ts` | **148.4 kB** (+16.4) |
| Tras esta decisión | **132.5 kB** (+0.5) |

Diagnosticado con sondas, no por deducción: `grep "exactamente 4 opciones"` encontraba los esquemas de ítem en un chunk de carga ansiosa del layout, y `grep "ZodError"` encontraba Zod.

**Decisión: tres archivos nuevos, cero líneas de lógica tocadas.**

| Archivo | Qué lleva | Quién lo importa |
|---|---|---|
| `src/lib/esquemas-progreso.ts` | progreso, intentos, cola SRS, `esqSesionCronometro` | `almacenamiento.ts` |
| `src/lib/almacenamiento-crudo.ts` | claves, `memoria`, `localStorageUsable`, leer/escribir/borrar en crudo | `almacenamiento.ts`, `sesion-activa.ts` |
| `src/lib/sesion-activa.ts` | `haySesionEnCurso`, `suscribirSesion`, `notificarSesion` — **sin Zod** | `OcultaEnSimulacro` |

`esquemas.ts` re-exporta el archivo de progreso (`export * from './esquemas-progreso'`) y `almacenamiento.ts` re-exporta el canal de sesión, así que **ningún consumidor existente cambia**.

**Por qué esto no choca con §22 regla 2** («copiar el código de §4 a §8 tal cual»). Los esquemas son byte-idénticos y sus exports siguen saliendo del mismo sitio: lo único que cambia es **qué archivo los hospeda**, que es una decisión de empaquetado y no de lógica. La regla existe para que nadie «mejore» un motor y le rompa un invariante; aquí no se tocó ni un `.min()`.

**La línea de corte es el consumidor, no el tema.** Un `esquemas-contenido.ts` / `esquemas-progreso.ts` partido por asunto habría sido igual de bonito y no habría resuelto nada: lo que decide el peso del bundle es **quién importa qué**, y el corte tiene que caer ahí.

**El estado degradado se comparte a propósito.** `memoria` y `localStorageUsable` viven en `almacenamiento-crudo.ts` y los dos módulos usan la misma instancia. Si `sesion-activa.ts` tuviera su copia, una escritura fallida por disco lleno degradaría un módulo y no el otro — y volveríamos al defecto de ADR-008 por otra puerta, que es exactamente el que este paso promete blindar.

**§22 regla 4 sigue intacta:** «todo acceso a `localStorage` pasa por `lib/almacenamiento`». **Nadie fuera de `src/lib/` importa `almacenamiento-crudo.ts`**; los componentes siguen llamando a `almacenamiento.ts` o a `sesion-activa.ts`.

**Efecto medido en el resto de rutas** (la partición de esquemas beneficia a todas las que tocan progreso):

| Ruta | Antes | Después |
|---|---|---|
| `/modulos/[slug]` | 134.2 | **133.0** |
| `/modulos/[slug]/tarjetas` | 136.7 | **135.6** |
| `/repaso` | 144.5 | **143.7** |

**Consecuencia para los pasos siguientes:** cualquier archivo nuevo de `src/lib/` que vaya a ser importado desde el layout raíz debe declarar qué arrastra. El canario de ADR-010 no cubre esto —vigila contenido, no dependencias—, así que la comprobación es la métrica de `/layout` js gz de `COMPONENTES.md`.

---

## ADR-022 · La regla de las 300 líneas se cuenta en código y la mide ESLint, no el ojo

**Estado:** Aceptada
**Fecha:** 2026-07-30 · **Autor:** software-architect

**Contexto.** `CLAUDE.md` §21, «Reglas de código», punto 1: «Un componente por archivo, máximo 300 líneas.» En once pasos esa regla **no ha funcionado como compuerta ni una vez**. `controlador-sesion.tsx` (390 líneas) y `controlador-repaso.tsx` (594) se aprobaron en los pasos 9 y 10 sin que nadie la invocara. En el Paso 11 sí se invocó, y al revés: **ADR-020 justificó partir el controlador de simulacro diciendo que juntarlo todo «lo llevaría muy por encima de las 300 que fija la regla de código 1», y el resultado quedó en 402 líneas.** El `code-reviewer` lo levantó como M1 y lo derivó aquí porque implica enmendar una regla escrita.

El diagnóstico del usuario es el correcto y conviene dejarlo textual: *«Una regla que nadie cumple ni aplica es peor que no tenerla, porque se invoca solo cuando conviene.»*

**Lo que faltaba no era el número: era la unidad.** Tres mediciones honestas del mismo archivo, `mazo-tarjetas.tsx`, dieron tres resultados distintos:

| Quien mide | `mazo-tarjetas.tsx` | `controlador-repaso.tsx` |
|---|---|---|
| `wc -l` (total) | 424 | 594 |
| Conteo a mano del usuario (sin comentarios ni vacías) | 300 | 417 |
| `sed`/`awk` de este ADR | 282 | 408 |
| **ESLint `max-lines`** con `skipComments` + `skipBlankLines` | **294** | **414** |

Una regla denominada en una unidad indefinida **no se puede cumplir ni aplicar; solo se puede invocar**. Ese es el mecanismo exacto de la queja, y por eso no basta con mover el número: hay que nombrar la herramienta que lo mide, o dentro de tres pasos el número nuevo estará en la misma situación que el viejo.

**El proyecto cultiva la densidad de comentarios a propósito** —las cabeceras registran decisiones, alternativas descartadas y mediciones— así que contar líneas totales grava justo lo que el proyecto quiere fomentar. `src/lib/cronometro.ts` son 172 líneas totales y **73** de código: 58 % de comentario. Con `wc -l`, el archivo mejor documentado del repositorio es el que más se acerca al límite.

**Decisión: el número sigue siendo 300 y la unidad pasa a ser líneas de código, tal como las cuenta ESLint `max-lines` con `skipComments: true` y `skipBlankLines: true`.**

El número no se toca porque, **medido bien, ya era el correcto**. Esta es la distribución real del alcance de la regla:

| Archivo | Código |
|---|---|
| `sesion/controlador-repaso.tsx` | **414** |
| `modulo/mazo-tarjetas.tsx` | 294 |
| `sesion/controlador-sesion.tsx` | 271 |
| `sesion/controlador-simulacro.tsx` | 259 |
| `sesion/repaso-vacio.tsx` | 227 |
| `items/emparejar.tsx` | 214 |
| `modulo/etapas-modulo.tsx` | 211 |
| `app/modulos/[slug]/page.tsx` | 191 |
| `sesion/simulacro-en-curso.tsx` | 172 |
| `hooks/usar-sesion.ts` | 170 |

**No hay nada entre 294 y 414.** El 300 cae en un hueco natural de la distribución: deja dentro los diez componentes que se aprobaron sin que nadie se quejara de su tamaño y deja fuera exactamente uno, que es el que el revisor lleva dos pasos nombrando. Inventar un 400 o un 450 habría sido ratificar el statu quo con un número de aspecto técnico.

**Alcance, explícito.** La regla gobierna `src/components/**` (excepto `ui/`, que es código generado por el CLI de shadcn), `src/hooks/**` y `src/app/**`. Quedan fuera:

- **`content/**`.** `content/banco/c5-umbrales-zonas.ts` son **594** líneas de código que son **datos**: 28 objetos de ítem con su explicación de ≥200 caracteres. Los otros 28 módulos van a copiar esa forma en los pasos 15–17. Cualquier regla de línea sobre `content/` nace muerta.
- **`src/lib/**`.** `simulacro.ts` (306) y `almacenamiento.ts` (298) **están copiados literalmente del blueprint porque §22 regla 2 lo ordena**. Una regla que pone en incumplimiento código que otra regla manda copiar tal cual es incoherente. Además `src/lib/` ya tiene un criterio de partición mejor y medido: **ADR-021**, que parte por consumidor cuando el peso del bundle lo pide, en kB gz.
- **Tests.** `src/lib/__tests__/simulacro.test.ts` son **925** líneas de código. Ahí el tamaño no es señal de diseño: es cobertura.

**Alternativas descartadas:**

- **Dejar la unidad en líneas totales (`wc -l`) y subir el número.** Es la opción cómoda: se mide con un comando y no hay ambigüedad. Se descarta porque **grava el comentario**, que es un rasgo cultivado del proyecto y no un defecto a controlar. Con líneas totales, la forma barata de cumplir la regla es borrar las cabeceras que explican por qué el código es como es — que es el peor incentivo que se le puede poner a este repositorio en particular.
- **Subir el umbral a 400 o 450 en líneas de código.** Nada quedaría fuera: el mayor archivo del alcance mide 414 y el segundo 294. Una regla calibrada justo por encima del peor caso **no puede fallar nunca**, y una regla que no puede fallar es la que estamos retirando, con otro número. Además obliga a mover el número del blueprint sin evidencia que lo respalde.
- **Retirar la regla.** Era la opción más defendible de las tres, y estuvo cerca. A su favor: en once pasos, **ninguna partición se decidió de verdad por tamaño**. Las dos que ocurrieron se decidieron por divergencia de responsabilidades (ADR-020) y por peso medido del bundle (ADR-021), que son criterios mejores y ya registrados; el conteo de líneas solo apareció como argumento de refuerzo, y mal citado. En contra, y es lo que decidió: **medida bien, la regla sí señala algo real.** El único archivo que deja fuera, `controlador-repaso.tsx`, no es un componente largo — es un archivo que hospeda tres responsabilidades con nombre propio (ver abajo). La regla acertó en el único sitio donde disparó. Retirarla habría sido tirar un indicador calibrado por culpa de una unidad mal escrita.
- **Encender la compuerta de ESLint en este mismo cambio.** Con `max: 300` hoy, `npm run lint` queda **rojo** por `controlador-repaso.tsx`. Las dos salidas para evitarlo —subir el número hasta que nadie incumpla, o poner un `eslint-disable max-lines` en la cabecera del archivo— son precisamente las dos formas de recrear la enfermedad. La compuerta se enciende cuando el archivo baje de 300, y las dos cosas van juntas en la misma obligación del Paso 12.

**Consecuencias:**

**Un solo archivo queda en incumplimiento, y tiene nombre: `src/components/sesion/controlador-repaso.tsx`, 414 líneas de código contra un límite de 300.** No se acepta con una excusa: genera obligación en `PENDIENTES.md` para el **Paso 12**, junto con el encendido de la compuerta.

Y el arreglo no es cortar por la línea 300. El archivo ya está partido por dentro, con nombres:

| Símbolo | Qué es |
|---|---|
| `resolverElementos` | cargador: `import()` de los dos índices y resolución de la cola |
| `ControladorRepaso` | contenedor: lee el estado, decide qué vista mostrar |
| `SesionRepaso` (~250 líneas) | la vista de la sesión de repaso |
| `Esqueleto`, `Tecla` | dos auxiliares de presentación |

El conteo es el **síntoma** de una separación que ya existe; extraer `SesionRepaso` a su propio archivo lo deja holgadamente por debajo de 300 sin inventar una abstracción. Ese es el criterio general que hereda la regla: **superar el límite no se resuelve partiendo por tamaño, se resuelve extrayendo la responsabilidad que el archivo ya tiene con nombre aparte.**

**La compuerta, cuando se encienda, es esta y no otra** (en `eslint.config.mjs`, sobre el alcance declarado arriba):

```js
'max-lines': ['error', { max: 300, skipComments: true, skipBlankLines: true }],
```

A partir de ahí la regla deja de depender de que un revisor se acuerde de invocarla: pasa o no pasa, y cualquier excepción tiene que ser un `eslint-disable` visible en la cabecera del archivo, con su razón, y localizable con un `grep`. **Mientras esa línea no exista, la regla sigue siendo de honor** — mejor que antes, porque ahora dos personas que midan obtienen el mismo número y solo hay un incumplidor conocido, pero de honor. Que nadie la dé por blindada hasta el Paso 12.

**Queda una contradicción abierta en la misma regla 1, y no se toca aquí porque no fue lo que se autorizó.** La mitad «un componente por archivo» tampoco describe la práctica: los archivos del proyecto llevan **un componente exportado y varios auxiliares locales** —`controlador-sesion.tsx` define 5 y exporta 1, `mazo-tarjetas.tsx` define 4 y exporta 1—, y `repaso-vacio.tsx` **exporta 7**. O la regla quiere decir «un componente *exportado* por archivo» y hay que escribirlo así, o `repaso-vacio.tsx` incumple. Se registra en `PENDIENTES.md` como pregunta abierta al usuario, no se decide por iniciativa propia: es el mismo error que se está corrigiendo.

**§21 del blueprint queda editado** (una línea, la 6350). Es la sexta vez que se toca `CLAUDE.md` y encaja en el criterio que fijaron las enmiendas de ADR-006 y ADR-007: **se corrige cuando su instrucción literal induce a error a un paso futuro y no deja rastro que apunte al ADR.** Es exactamente lo que pasó en el Paso 11, donde la regla se citó de buena fe en un sentido que su letra no soporta. Aquí hay además autorización explícita del usuario, que es quien pidió la decisión.

### Enmienda a ADR-022 — 2026-07-31: la otra mitad de la regla 1, resuelta por el usuario

ADR-022 fijó la unidad del **límite de líneas** y dejó abierta a propósito la otra mitad de la regla 1 —«un componente por archivo»—, que tampoco describía la práctica. La decisión la tomó el usuario, que es de quien depende cambiar una regla escrita:

> **«Significa "un componente EXPORTADO por archivo". Escríbelo así, que es lo que la práctica ya hace y lo que tiene sentido: los auxiliares locales no son componentes públicos.»**

`CLAUDE.md` §21 regla 1 queda editada con esa palabra. Es la lectura correcta y además la única que deja la regla en pie: los archivos de este proyecto definen un componente público y varios subcomponentes locales —`controlador-sesion.tsx` define 5 y exporta 1, `mazo-tarjetas.tsx` define 4 y exporta 1—, que es práctica sana de React. Con la redacción vieja, **cumplir la regla habría exigido partir cada uno de esos auxiliares en su propio archivo**, es decir, empeorar el código para satisfacer la letra.

**Medido tras la edición, quedan DOS incumplidores, no uno.** El `software-architect` había nombrado solo `repaso-vacio.tsx`; el barrido completo del alcance encuentra otro:

| Archivo | Componentes exportados | Cuáles |
|---|---|---|
| `sesion/repaso-vacio.tsx` | **6** | `AccionSiguiente`, `ColaSinEstrenar`, `NadaPendienteHoy`, `ColaSinContenido`, `RepasoSinRed`, `CierreRepaso` |
| `items/opcion-unica.tsx` | **2** | `GrupoOpcionUnica`, `OpcionUnica` |

(`siguienteSinDominar`, en `repaso-vacio.tsx`, es un helper y no un componente: no cuenta.)

Los dos pasan a ser obligación del **Paso 12**, y van declarados en `PENDIENTES.md` en vez de resolverse por iniciativa propia — el usuario pidió expresamente anotarlos sin arreglarlos ahora. **No se prejuzga el arreglo**: `opcion-unica.tsx` exporta una pareja cohesiva que consumen varios tipos de ítem, así que puede que lo correcto sea partirlo o puede que merezca una excepción razonada. Esa es una decisión de diseño que el Paso 12 tomará mirando el código, no una que se pueda tomar contando exports.

**La compuerta de ESLint sigue apagada, y el usuario lo ratificó** con el mismo argumento que dio el `software-architect`: *«subir el número o poner un eslint-disable serían las dos formas de recrear el problema que acabamos de cerrar.»* Se enciende en el Paso 12, cuando los tres incumplimientos —`controlador-repaso.tsx` por líneas, y estos dos por exports— estén resueltos. Nótese que `max-lines` cubre solo la primera mitad de la regla: **la de «un componente exportado» no tiene compuerta automática** y no se le inventa una, porque distinguir un componente de un helper exportado exige criterio, no una expresión regular.
