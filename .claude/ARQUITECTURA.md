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
