# Bitácora — Idóneo 2210

Registro cronológico de construcción. **Una entrada por paso completado, siempre.**
Se escribe al final, nunca sobre una entrada anterior.

> **Antes de ejecutar un paso, lee `PENDIENTES.md`.** Ahí está, agrupado por paso, lo que
> los pasos anteriores dejaron decidido o pendiente y que rompe algo si se ignora.
> Las razones completas viven en `ARQUITECTURA.md` (los ADR) y en las entradas de aquí.

Dos formatos conviven:

- **Cierre de paso** (lo escribe quien ejecuta el paso):
  `## Paso N — [Nombre] — [YYYY-MM-DD]` con Estado / Archivos / Verificación / Pendiente / Notas.
- **Intervención de agente** (lo escribe el agente al terminar):
  `## [YYYY-MM-DD HH:MM] · nombre-del-agente · Paso N` con el bloque propio de cada agente.

Estados: ✅ Completado · ⚠️ Completado con ajustes · 🚧 Parcial

---

## Paso 1 — Andamiaje — 2026-07-29

**Estado:** ⚠️ Completado con ajustes

**Archivos creados o modificados**

- Andamiaje Next 15: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `README.md` (placeholder de CNA, se reescribe en el paso 18.9), `src/app/{layout.tsx,page.tsx,globals.css,favicon.ico}`, `public/`.
- `.gitignore` — fusionado a mano: unión del que ya tenía el repo y el de create-next-app.
- `components.json` — idéntico a §11.6, con `"tailwind": { "config": "" }` (marca de v4).
- `src/components/ui/` — los 18 componentes de shadcn del paso 1: accordion, alert, badge, button, card, dialog, input, label, progress, scroll-area, select, separator, sheet, skeleton, sonner, switch, tabs, tooltip.
- `src/lib/utils.ts` — solo `cn()`. El paso 2 lo reemplaza por §11.4 completo (`CLASES_BLOQUE`, `normalizar`, `porcentaje`).
- `LICENSE` — texto legal completo de CC BY-NC-SA 4.0 (20.850 bytes, 22 secciones), descargado de creativecommons.org.
- Árbol de carpetas vacío con `.gitkeep`: `content/{banco,tarjetas,teoria}`, `scripts/`, `src/hooks/`, `src/lib/__tests__/`, y las 14 carpetas de `src/components/`.
- `.claude/BITACORA.md`, `.claude/ARQUITECTURA.md`, `.claude/CONTENIDO.md`, `.claude/settings.json`.

**Verificación**

- `next` **15.5.22** · `react` 19.1.0 · `tailwindcss` **^4** · `@tailwindcss/postcss` **^4**.
- `ls tailwind.config.*` → no existe. Correcto: en v4 no se lee.
- `src/app/globals.css` empieza con `@import "tailwindcss";`. Cero `@tailwind base/components/utilities`.
- `postcss.config.mjs` declara `@tailwindcss/postcss`, sin `autoprefixer`.
- `components.json`: `style: new-york`, `baseColor: neutral`, `cssVariables: true`, `config: ""`, `iconLibrary: lucide`, los 5 aliases de §11.6.
- `zod ^3.25.76` (no 4.x) · `recharts ^2.15.4` (no 3.x) · `next-mdx-remote ^5.0.0` · `vitest ^3.2.7`.
- `LICENSE`: contiene `Attribution-NonCommercial-ShareAlike 4.0 International` y `Section 1 -- Definitions`; texto plano, no HTML.
- `git diff --stat CLAUDE.md` vacío y `.claude/agents/` intacto tras el andamiaje.
- `npm run dev` y `npm run typecheck`: ver la entrada del `code-reviewer` de este mismo paso.

**Ajustes respecto al texto literal del blueprint** — los tres primeros los levantó el `software-architect` en revisión previa:

1. **Andamiaje en sitio.** El paso 1 asume un directorio nuevo (`create-next-app idoneo-2210 && cd idoneo-2210`), pero el repo ya existía con `CLAUDE.md` y `.claude/`. `create-next-app` aborta en un directorio con esos archivos. Se andamió en el scratchpad y se copió con `rsync -a --exclude .git`, sin `--force` y sin borrar nada. Rama `paso-1-andamiaje` desde `main`; el commit `995505d` sigue siendo ancestro.
2. **`create-next-app@15` en vez de `@latest`.** `@latest` instala Next 16 y el stack está cerrado en 15. Ver ADR-002.
3. **`"prebuild": "npm run validar"` se aplaza al paso 3.** `scripts/validar-banco.ts` no existe hasta ese paso, así que añadirlo ahora deja `npm run build` rojo durante dos pasos. `validar` sí queda en `scripts`; el enganche `prebuild` se añade en el paso 3, que es donde el blueprint verifica que el build lo dispare. Compuerta del paso 1: `npm run dev` + `npm run typecheck`.
4. **`"lint": "eslint"` en vez de `"next lint"`.** `next lint` está deprecado en 15.5 y create-next-app ya genera `eslint`. Se conserva lo que genera el CLI.
5. **CLI `shadcn@2` en vez de `@latest`.** El CLI 4.x cambió de librería de componentes y genera otro `components.json`. Ver ADR-002.
6. **`--no-turbopack` no existe en el CLI de la 15.x:** Turbopack es opt-in con `--turbopack`. Se omitió la bandera, que deja webpack en dev, que es lo que el blueprint quiere.
7. **`"@/content/*": ["./content/*"]` añadido a `tsconfig.json`.** Con `--src-dir` solo se mapea `@/* → ./src/*`, y §12.4 importa `@/content/erratas`. Sin esto el paso 3 no compila. El blueprint lo da por hecho en §21.
8. **`src/components/plan/` añadido al árbol.** No está en el `mkdir` del paso 1 pero el paso 13 escribe ahí `vista-plan.tsx`.
9. **`.gitkeep` en las carpetas vacías.** Los directorios vacíos no se comitean; sin esto, "estructura de carpetas creada" no sobrevive a un clone.

**Notas**

- El `init` de shadcn escribió `components.json` correctamente y luego falló al consultar el registro (`Validation failed: - css: Invalid input`): el registro actual devuelve un esquema que el CLI 2.x no sabe leer. Consecuencias: (a) no se escribieron los tokens base de color en `globals.css`, (b) no se creó `src/lib/utils.ts`. Lo segundo se resolvió a mano; lo primero se deja como está porque el **paso 5 reemplaza `globals.css` completo** por §11.3. Efecto visible hasta entonces: los componentes de shadcn se renderizan sin estilo. `shadcn@2 add` sí funciona con el registro actual — el fallo es solo del `init`.
- `lucide-react` entró en `^1.27.0` y el blueprint anotó `^0.470.0`. La API de iconos no cambió; se deja la actual (ver ADR-002).
- `npm audit` reporta 12 avisos altos, todos de la cadena de build: `brace-expansion` (vía eslint), `postcss` anidado dentro de `next`, y `sharp` (optimizador de imágenes). `npm audit fix --force` degradaría `next` a 9.3.3. No se aplica; anotado en ADR-002.
- `.claude/settings.json` se creó con la lista `allow` literal del paso 1. **Cambia la postura de permisos del harness**: queda sujeto a confirmación del usuario.

**Pendiente**

- **Sin comitear.** La rama `paso-1-andamiaje` tiene 0 commits: todo está en el árbol de trabajo. Hasta que se comitee, los `.gitkeep` del ajuste 9 no cumplen su función y el paso no es verificable como diff. Requiere revisar el diff con el usuario primero.
- Paso 2: `src/lib/{tipos,esquemas,fechas}.ts`, `src/lib/utils.ts` completo (§11.4), `vitest.config.ts` con alias `@`, y los primeros tests de esquemas.
- Paso 2 (adelanto sugerido por el `code-reviewer`): `reactStrictMode: true` en `next.config.ts`, que hoy está vacío. §16 lo pide junto a `typedRoutes`, pero los dos llegan con Serwist en el 18.1; activar strict mode tarde destapa efectos dobles justo en los controladores de sesión de los pasos 9 y 11, que es el código más delicado del proyecto.
- Paso 3: añadir `"prebuild": "npm run validar"` a `package.json` y hacer la prueba de fuego (un ítem inválido debe romper el build).
- Paso 5: `globals.css` de §11.3 con los 4 tokens de bloque **y `@custom-variant dark`** — sin esa variante, los `dark:` de `src/components/ui/` no responden a la clase que pone `next-themes`. También el pie con la atribución a COLEF/COCED.
- Paso 5: `src/app/layout.tsx` sigue siendo el de create-next-app, con `lang="en"` y `title: "Create Next App"`. La app es es-CO y hoy el HTML anuncia inglés. Lo reemplaza §11.2.
- Paso 14.4: `src/app/page.tsx` de create-next-app y los 5 SVG que referencia en `public/` (`file`, `globe`, `next`, `vercel`, `window`). Borrar los SVG en ese mismo paso: si sobreviven, entran al manifiesto de precache de Serwist en el 18.1 y son peso muerto en la caché offline.
- Paso 18.9: reescribir el `README.md` que dejó create-next-app.

---

## [2026-07-29 20:45] · code-reviewer · Paso 1

**Qué revisé:** el andamiaje completo del paso 1 en la rama `paso-1-andamiaje` (todo el árbol de trabajo, aún sin commit): `package.json`, `package-lock.json`, `tsconfig.json`, `components.json`, `postcss.config.mjs`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `LICENSE`, `README.md`, `src/app/{layout.tsx,page.tsx,globals.css}`, los 18 componentes de `src/components/ui/`, `src/lib/utils.ts`, el árbol de carpetas con `.gitkeep`, y los cuatro archivos de `.claude/`. Alcance limitado a andamiaje: no evalué ausencia de motores, tipos, contenido ni `vitest.config.ts`, que nacen en los pasos 2+.

**Compuertas:** typecheck **ok** (`tsc --noEmit`, exit 0, cero errores) · dev **ok** (`next dev --port 3577` → `✓ Compiled / in 5.5s`, `GET / 200`, CSS de Tailwind emitido; puerto liberado al terminar, sin logs) · lint **ok** (`eslint`, salida vacía) · test **n/a** (sin `vitest.config.ts` ni archivos de prueba: Vitest sale 1 por "No test files found" — paso 2) · validar **n/a** (`scripts/validar-banco.ts` nace en el paso 3) · build **n/a** (depende de `validar`; `prebuild` aplazado a propósito al paso 3, ver ajuste 3).

**Invariantes verificados**
- Cero `Math.random()` → `grep -rn "Math.random" src/ content/ scripts/` vacío.
- Cero reloj en render → `grep -rn "Date.now()\|new Date()" src/` vacío.
- `localStorage` solo tras el wrapper → `grep -rn "localStorage" src/ --include=*.ts --include=*.tsx | grep -v "lib/almacenamiento.ts"` vacío.
- Tailwind v4 puro → `ls tailwind.config.*` falla · `grep -n "@tailwind " src/app/globals.css` vacío · `globals.css` abre con `@import "tailwindcss";` · `postcss.config.mjs` solo declara `@tailwindcss/postcss`, sin `autoprefixer` · `components.json` con `"config": ""` · instalados `tailwindcss@4.3.3` y `@tailwindcss/postcss@4.3.3`.
- `"use client"` → `grep -rln "use client" src/` devuelve 12 archivos, **todos** en `src/components/ui/` (Radix generado por el CLI). Ningún archivo propio lleva la directiva. Correcto para este paso.
- Teoría server-only → `grep -rn "lib/contenido" src/components/` vacío.
- Banco en diferido → `grep -rn "from '@/content/banco/" src/` vacío.
- Versiones del stack cerrado → `next@15.5.22` · `zod@3.25.76` (no 4) · `recharts@2.15.4` (no 3) · `next-mdx-remote@5.0.0` · `vitest@3.2.7` · `react@19.1.0`.
- shadcn → los 18 componentes del paso 1, ni uno más. Sin `form.tsx`; sin `react-hook-form`, `@hookform/resolvers`, `cmdk`, `vaul`, `date-fns` ni `input-otp`. `ui/` importa del paquete unificado `radix-ui`.
- Licencia → `LICENSE` con el *legal code* completo (438 líneas, 20 850 bytes, 8 secciones, texto plano sin HTML) · `"license": "CC-BY-NC-SA-4.0"` y `"private": true` en `package.json` · ADR-001 escrito.
- Integridad → `git diff --stat CLAUDE.md` y `git diff main -- CLAUDE.md` vacíos · `git merge-base --is-ancestor 995505d HEAD` afirmativo · `.claude/agents/` con sus 7 archivos · `.gitignore` es unión real (las 5 reglas previas siguen como contexto sin cambios en el diff).
- Árbol §3 → `content/{banco,tarjetas,teoria}`, `scripts/`, `src/hooks/`, `src/lib/__tests__/` y las 14 carpetas de `src/components/` (13 de §3 + `plan/`). `tsconfig.json` mapea `@/*` y `@/content/*`.
- Basura → sin `*.log`, `*.tmp`, `*.bak`, `*.orig` ni `.DS_Store`. `.next/`, `node_modules/`, `tsconfig.tsbuildinfo` y `next-env.d.ts` presentes en disco y correctamente ignorados.

**Los nueve ajustes:** los nueve están bien fundamentados y bien documentados; ninguno esconde un problema. Los cuatro que más importaban se comprobaron por su efecto, no por su descripción: el andamiaje con `rsync` sin `--force` (ajuste 1) dejó `CLAUDE.md` intacto y `995505d` como ancestro; `shadcn@2` (ajuste 5) produjo un `components.json` idéntico a §11.6, que era justamente el motivo del pin; `@/content/*` (ajuste 7) es necesario para que el paso 3 compile; y la omisión de `--no-turbopack` (ajuste 6) dejó webpack en dev, verificado en el arranque. El ajuste 9 (`.gitkeep`) es correcto en intención pero inerte hasta que haya commit — ver hallazgos.

**Hallazgos:** 🔴 0 · 🟡 2 · 💭 3
- 🟡 El paso no está comiteado: la rama tiene 0 commits y todo vive en el árbol de trabajo. Los `.gitkeep` del ajuste 9 no cumplen su función hasta entonces.
- 🟡 La lista de Pendiente omite `src/app/layout.tsx` (aún `lang="en"` y `title: "Create Next App"`), `src/app/page.tsx` y los 5 SVG de create-next-app en `public/`.

**Veredicto:** **APROBADO CON CAMBIOS**

**Pendiente antes de cerrar el paso**
1. Comitear el andamiaje en `paso-1-andamiaje` (previa revisión del diff con el usuario). Sin commit, el paso no es verificable como diff ni sobrevive a un clone.
2. Añadir a la lista de Pendiente de la entrada del paso 1: `layout.tsx` → §11.2 en el paso 5 (`lang="es-CO"` y metadata real; hoy el HTML servido anuncia `lang="en"`), y `page.tsx` + los 5 SVG de CNA (`file`, `globe`, `next`, `vercel`, `window`) → paso 14.4, borrando los SVG junto con la página que los referencia para que no entren al precache de Serwist en el paso 18.1.
3. Reforzar en la Pendiente del paso 3 que `"prebuild": "npm run validar"` es condición de cierre de ese paso: su entregable es que el build falle ante un ítem inválido, y sin el enganche el invariante se pierde en silencio.

## Paso 2 — Tipos y esquemas — 2026-07-29

**Estado:** ⚠️ Completado con ajustes

**Archivos creados o modificados**

- `src/lib/tipos.ts` — §4 literal y completo. Solo tipos, sin `"use client"`, sin runtime.
- `src/lib/esquemas.ts` — §5 **con una desviación**: los refinamientos de `esqItem` viven en funciones nombradas. Ver ADR-003 y las notas de abajo.
- `src/lib/fechas.ts` — §7.1 literal.
- `src/lib/utils.ts` — reemplazado por §11.4 completo: `cn()` (idéntico, lo importan los 18 componentes de `ui/`), `CLASES_BLOQUE`, `normalizar()`, `porcentaje()`.
- `vitest.config.ts` — entorno node, `include: ['src/**/*.test.ts']`, alias en **forma de array**.
- `src/lib/__tests__/esquemas.test.ts` — 42 tests.
- `src/lib/__tests__/fechas.test.ts` — 21 tests.
- `src/lib/__tests__/utils.test.ts` — 12 tests.
- `next.config.ts` — `reactStrictMode: true` (añadido al alcance por el usuario).
- `.claude/settings.json` — recorte de permisos (añadido al alcance por el usuario).
- `.claude/ARQUITECTURA.md` — ADR-003.

**Verificación**

- `npm run typecheck` → **0 errores**, cero `any`.
- `npm test` → **75 tests en verde**, 3 archivos. Duración 412 ms.
- `npm run lint` → limpio.
- Invariantes: cero `Math.random()`, cero `Date.now()`, cero `new Date()` sin argumentos en `src/lib/`. `fechas.ts` solo usa `Date.UTC(...)`, `new Date(número)` y `new Date(cadena)`, todos deterministas.

**Ajustes respecto al texto literal del blueprint**

1. **`esqItem` no se pudo copiar tal cual: el §5 tiene un defecto real.** Sus miembros están envueltos en `.superRefine(...)`, lo que los vuelve `ZodEffects`; `discriminatedUnion` de Zod 3 lee `.shape` del miembro y un `ZodEffects` no lo tiene, así que **lanza `TypeError` al construir el esquema, o sea al importar el módulo** — habría reventado el validador del Paso 3, `almacenamiento.ts` del Paso 4 y la app. Corrección mínima: refinamientos en funciones nombradas, aplicadas al esquema por tipo y a la unión con un `switch`. Las 10 reglas (9 mensajes distintos: `'hay opciones duplicadas'` lo comparten `unica` y `caso`), las rutas de issue y los exports quedan idénticos. Descartado `z.union`, que compila pero degrada los mensajes a `raíz: Invalid input` y volvería inútil el validador con 750 ítems. Detalle y evidencia en ADR-003. Lo detectó el `software-architect` en revisión previa, antes de escribir una línea.
2. **Alias de `vitest.config.ts` en forma de array, no de objeto.** El blueprint usa `{ '@': path.resolve(__dirname, 'src') }`, que reemplaza por prefijo: `@/content/estructura` resolvería a `src/content/estructura`, que no existe. Se declara `@/content/` antes de `@/`, con el más específico primero. Todavía ningún test importa de `content/`, pero el Paso 3 en adelante sí.
3. **Dos archivos de test más de los que pide §17.** El paso 2 entrega también `fechas.ts` y `utils.ts`; se les escribió su test por la regla del usuario de no marcar nada como hecho sin su test. §19 no los listaba, y `srs.ts` y `plan.ts` (pasos 10 y 13) dependen de esas cuatro funciones de fecha.

**Añadidos al alcance, pedidos por el usuario**

- **`reactStrictMode: true` en `next.config.ts`.** Solo afecta a desarrollo. Se activa ahora para que el doble disparo de efectos salga a la luz mientras es barato: el auto-envío de `usar-cronometro` (paso 11) y el `IntersectionObserver` de `marcador-lectura` (paso 8) son el código donde ese bug es caro de encontrar tarde. **El paso 18.1 reescribe `next.config.ts` con `withSerwist`: la bandera tiene que sobrevivir esa edición.** §16 ya la incluye, así que no hay conflicto. No se añadió `typedRoutes`: va con Serwist en el 18.1 y hoy no aporta nada con el árbol de rutas vacío.
- **Recorte de `.claude/settings.json`:** `Bash(npx:*)` → `Bash(npx shadcn:*)` + `Bash(npx tsx:*)`. `Bash(npm:*)` se conserva.

**Notas**

- Sobre el recorte de permisos, el `software-architect` levantó tres cosas que **no** apliqué porque el usuario pidió un cambio concreto y ninguna estaba en él — dos de ellas *amplían* permisos, que no se toca por iniciativa propia:
  - `Bash(git:*)` no está en la lista y nunca estuvo. El Paso 1 sigue sin comitear y cada paso cierra con revisión de diff: es la omisión que más va a estorbar.
  - ADR-002 pinea el CLI de shadcn en 2.x, así que el comando real del paso 5 es `npx shadcn@2 add …`. Conviene confirmar que el patrón `Bash(npx shadcn:*)` casa con `npx shadcn@2`; si no, hace falta `Bash(npx shadcn@2:*)`.
  - `Bash(npx tsx:*)` es inofensivo pero probablemente innecesario: el validador corre como `npm run validar`, ya cubierto por `Bash(npm:*)`.
  - El permiso ancho de ese archivo no es Bash sino `Write` y `Edit`, que siguen sin restricción de ruta.
- `normalizar()` quedó escrito con la secuencia de escape `̀-ͯ` y no con los caracteres combinantes literales, que es como salió en el primer intento: funcionalmente igual, pero ilegible y frágil ante cualquier reencoding.
- **No activar `noUncheckedIndexedAccess`** en `tsconfig.json`: `verificarCuotas` usa `Record<number, number>` con acceso indexado directo, y los cinco motores de los pasos 10–13 hacen lo mismo. Activarlo obligaría a reescribir código del blueprint.
- Los `as EstadoProgreso` de §6 son del Paso 4. El `code-reviewer` verificó que **sí compilan** tal como los escribe el blueprint, pese a que `EstadoProgresoValidado` no es asignable a `EstadoProgreso` (porque `z.unknown()` infiere `respuesta?: unknown`): el Paso 4 no se bloquea y no hará falta el fallback `as unknown as`. En cualquier caso, **no tocar los esquemas** para acomodar un cast.

**Pendiente**

- Sigue **sin comitear** el Paso 1 y ahora también el Paso 2: la rama `paso-2-tipos` salió de `paso-1-andamiaje`, que tenía 0 commits, así que ambos pasos están mezclados en el árbol de trabajo. Requiere revisar el diff con el usuario.
- Paso 3: `scripts/validar-banco.ts`, los `content/*.ts` vacíos con forma, añadir `"prebuild": "npm run validar"` y la prueba de fuego (un ítem inválido debe romper el build).
- Paso 5: `globals.css` de §11.3 con los 4 tokens de bloque y `@custom-variant dark` (sin ella los `dark:` de `ui/` no responden a `next-themes`); `layout.tsx` sigue con `lang="en"` y título de create-next-app; el pie con la atribución a COLEF/COCED.
- Paso 14.4: `page.tsx` y los 5 SVG de create-next-app en `public/`.
- Paso 18.9: `README.md`.

---

## [2026-07-29 21:07] · code-reviewer · Paso 2

**Qué revisé:** el cierre completo del Paso 2 en `paso-2-tipos`: `src/lib/tipos.ts`, `src/lib/esquemas.ts`, `src/lib/fechas.ts`, `src/lib/utils.ts`, `vitest.config.ts`, los tres archivos de `src/lib/__tests__/`, y los dos añadidos al alcance por el usuario (`next.config.ts`, `.claude/settings.json`). Leí antes ADR-003 y la entrada de cierre. Fuera de alcance por diseño del plan: `almacenamiento.ts`, los cinco motores, `scripts/validar-banco.ts` y los `content/*.ts` (pasos 3, 4, 6, 10–13).

**Compuertas:** typecheck **ok** (`tsc --noEmit`, exit 0) · test **ok** (66 tests, 3 archivos, 419 ms) · lint **ok** · validar **n/a** (`scripts/validar-banco.ts` nace en el Paso 3) · build **n/a** (depende de `validar`; `prebuild` se engancha en el Paso 3).

**Fidelidad al blueprint, comprobada por diff mecánico** (extraído de `CLAUDE.md`, no de memoria):
- `tipos.ts` → **byte-idéntico** a §4. Los 7 tipos de ítem, `ItemBase`, `BlueprintExamen`, `DesgloseIntento`, `EstadoProgreso`, `SesionCronometro`, `Informe`, `Plan` y los comentarios de invariante están completos y sin añadidos.
- `fechas.ts` → **byte-idéntico** a §7.1.
- `utils.ts` → idéntico a §11.4 salvo el encabezado (§11.4 decía "(fragmento)"). `cn()` con firma intacta.
- `esquemas.ts` → el diff contra §5 **se limita al bloque de `esqItem`**. Desde `CUOTAS` hasta el final (incluidos `verificarCuotas`, `esqTarjeta`, `esqEntradaGlosario`, `esqErrata`, `esqDatoDuro`, `esqModulo`, `esqTarjetaSRS`, `esqEstadoModulo`, `esqIntento`, `esqEstadoProgreso` y **las seis regex**) no hay una sola línea distinta.

**Verificación de ADR-003 — lo central de esta revisión.** No me quedé en el razonamiento del ADR, lo ejecuté:
1. **Premisa confirmada:** construir `z.discriminatedUnion('tipo', [z.object({...}).superRefine(...)])` lanza `TypeError: Cannot read properties of undefined (reading 'tipo')` **al construirse**. El §5 literal habría reventado al importar el módulo. La desviación está justificada.
2. **Equivalencia de comportamiento:** comparé la huella completa de issues (`code` + `path` + `message`) de `esqItem.safeParse` contra el export individual refinado de cada tipo sobre **25 casos** — los 7 válidos, los 10 fallos de refinamiento, 4 fallos de objeto y 4 casos que fallan **a la vez** en objeto y en refinamiento, que es donde una divergencia de cortocircuito se vería. **25/25 idénticos, 0 divergencias.** Las 10 reglas y los 9 mensajes distintos son los de §5, verificados uno a uno en el diff.
3. **Compatibilidad de tipos:** `Item` y `z.infer<typeof esqItem>` son **mutuamente asignables**, el estrechamiento por `tipo` sigue funcionando para los 7 casos, y `pares` sigue infiriendo `[number, number][]` y no `number[]`.

**Invariantes verificados**
- Cero `Math.random()` → `grep -rn "Math.random" src/ content/ scripts/` vacío.
- Reloj → `grep -rn "Date.now()\|new Date(" src/lib/` da solo `fechas.ts:22` (`new Date(t)`, t numérico) y `fechas.ts:27` (`new Date(isoString)`), ambos deterministas y permitidos por §10.4. `grep -rn "new Date()" src/` solo casa el comentario de `fechas.ts:3`. Ningún motor conoce el reloj.
- Cero `any` → `grep -rn ": any\|<any>\| as any\|any\[\]" src/lib/` vacío, tests incluidos.
- `localStorage` → solo aparece en comentarios de `tipos.ts`.
- Tailwind v4 → `ls tailwind.config.*` falla · `@tailwind ` ausente de `globals.css` · `components.json` con `"config": ""`.
- `"use client"` → los dos aciertos del grep (`tipos.ts`, `esquemas.ts`) son la frase *dentro de un comentario*; ningún archivo propio lleva la directiva.
- Teoría server-only y banco en diferido → n/a en este paso, greps vacíos.
- `vitest.config.ts` → entorno node, `include: ['src/**/*.test.ts']`, sin plugins ni dependencias extra. **Comprobé el ajuste 2 empíricamente**: con la forma de array y el específico primero, `@/content/…` resuelve a `content/` y `@/…` a `src/`. La forma de objeto del blueprint habría mandado `@/content/estructura` a `src/content/estructura`.
- `next.config.ts` → `reactStrictMode: true`, con el comentario que avisa de conservarlo en el 18.1.

**Mutación de los tests** (única forma honesta de saber si protegen lo que dicen). Neutralicé una a una las 10 reglas de refinamiento y 7 regresiones más, corriendo la suite en cada caso: **8/10 reglas detectadas, 2 sobreviven**, y sobreviven 6 de las 7 regresiones adicionales. Detalle en los hallazgos. El árbol quedó restaurado y verificado idéntico.

**Hallazgos:** 🔴 0 · 🟡 4 · 💭 5

- 🟡 **Cuatro de los cinco exports individuales pueden perder su refinamiento sin que la suite se ponga roja.** `esquemas.ts:88,123,155,171`; el test existe solo para `unica` (`esquemas.test.ts:250`). Es justo la propiedad por la que ADR-003 eligió aplicar el refinamiento *dos veces* en lugar de la alternativa que descartó. Mutación verificada: `esqItemMultiple = objItemMultiple` deja los 66 tests en verde.
- 🟡 **Dos reglas de `emparejar` sin test:** `'debe haber un par por cada elemento de izquierda'` (`esquemas.ts:109`) y `'el par [i,d] está fuera de rango'` (`esquemas.ts:114`). Borrar cualquiera deja la suite verde. Son errores de autoría reales de los pasos 15–17.
- 🟡 **Ningún test afirma el texto de un mensaje de refinamiento**, que es el claim central de ADR-003. Cambiar `'hay opciones duplicadas'` por otro texto deja los 66 en verde. El validador del Paso 3 imprime esos mensajes para localizar un ítem entre 750: el texto es funcionalidad.
- 🟡 **`.claude/settings.json` perdió `Bash(mkdir:*)`**, que no estaba en el recorte pedido (solo `Bash(npx:*)` → `Bash(npx shadcn:*)` + `Bash(npx tsx:*)`, conservando `Bash(npm:*)`). Va en la dirección segura, pero es deriva no pedida y la bitácora describe el cambio como si fuera solo el de `npx`.

**Notas** 💭
- ADR-003 y el cierre dicen "nueve reglas": son **10 reglas** con **9 mensajes distintos** (`'hay opciones duplicadas'` se repite en `unica` y `caso`). El conteo se usa como checklist de equivalencia, conviene que cuadre.
- `EstadoProgresoValidado` **no** es asignable a `EstadoProgreso`: `z.unknown()` infiere `respuesta?: unknown` (opcional) frente al `respuesta: unknown` requerido de `RespuestaItem`. **No es desviación** — sale del §5 literal — y verifiqué que el `as EstadoProgreso` literal de §6 **sí compila**, así que el Paso 4 no se bloquea y el fallback `as unknown as` de la nota no hará falta.
- Sin ningún test: `esqModulo`, `esqErrata`, `esqEntradaGlosario`, `esqDatoDuro`, `esqTarjetaSRS`, `esqEstadoModulo`, `esqIntento`, `esqEstadoProgreso`. §19 no los pide aquí y el validador del Paso 3 ejercita tres de ellos de hecho, así que no es deuda de este paso. Sí conviene un test de la regex de slug de `esqModulo` antes del Paso 6, que mete los 29 slugs de golpe.
- `esquemas.test.ts:354` (`'las cuotas por omisión son las de CUOTAS'`) pasaría igual si el default fuera otro objeto con los mismos valores. Test de bajo poder, inofensivo.
- `esquemas.test.ts:142` (`'el módulo se importa sin lanzar'`) es redundante: si `esqItem` reventara al construirse, el import tumbaría los 33 tests del archivo. Su valor es documental y está bien anotado como tal.

**Bien resuelto:** el test de `esquemas.test.ts:171` (un ítem sin `opciones` reporta la ruta `opciones` y no `raíz`) es exactamente el guardián que hacía falta contra la alternativa `z.union` que ADR-003 descartó, y funciona.

**Veredicto:** **APROBADO CON CAMBIOS**

**Pendiente antes de cerrar el paso**
1. Extender `esquemas.test.ts:250` a los cinco exports refinados (`multiple`, `emparejar`, `ordenar`, `caso`, además de `unica`): es la garantía que sostiene el diseño de ADR-003.
2. Añadir los dos casos de `emparejar` que faltan: `pares` con una fila de menos, y un `pares` con índice más allá de `derecha`.
3. Afirmar el `message` en al menos un test por refinamiento, para que la equivalencia con §5 que declara ADR-003 quede protegida por la suite y no solo por el ADR.
4. Decidir sobre `Bash(mkdir:*)`: reponerlo o dejar constancia de que se quitó a propósito. Es cambio de permisos, así que lo decide el usuario, no un agente.
5. Corregir el conteo "nueve reglas" → 10 reglas / 9 mensajes en ADR-003 y en el cierre del paso.

## [2026-07-29 21:12] · cierre de los cambios del code-reviewer · Paso 2

Los cuatro 🟡 de la revisión del Paso 2, resueltos. Ninguno era del código: tres eran huecos de la suite y uno una deriva mía en la configuración de permisos.

**Qué cambié**

- `src/lib/__tests__/esquemas.test.ts`: las 10 reglas de refinamiento pasan a una tabla `REGLAS` y **cada una afirma su mensaje exacto**, no solo que falle. Añadidas las dos reglas de `emparejar` que no tenían test (`'debe haber un par por cada elemento de izquierda'` y `'el par [i,d] está fuera de rango'`). El guardián de "el export suelto conserva su refinamiento" pasa de 1 a **los 5**, que es la propiedad por la que ADR-003 aplica el refinamiento dos veces. Más un test de la regex de slug de `esqModulo`, útil antes del Paso 6.
- `.claude/settings.json`: **repuesto `Bash(mkdir:*)`**, que había desaparecido sin que nadie lo pidiera. El recorte pedido era solo `Bash(npx:*)` → `Bash(npx shadcn:*)` + `Bash(npx tsx:*)`.
- ADR-003 y el cierre del Paso 2: "nueve reglas" → **10 reglas / 9 mensajes distintos**. Corregida también la nota sobre los `as EstadoProgreso` del Paso 4, que el revisor verificó que sí compilan.

**Verificación por mutación** — antes de estos cambios, 6 de 7 regresiones sobrevivían en verde. Ahora:

| Mutación | Resultado |
|---|---|
| `esqItemMultiple = objItemMultiple` (export sin refinamiento) | ❌ 1 test falla |
| Borrar la regla `'debe haber un par por cada elemento de izquierda'` | ❌ 1 test falla |
| Cambiar el texto de `'hay opciones duplicadas'` | ❌ 4 tests fallan |

`src/lib/esquemas.ts` restaurado y verificado idéntico con `diff` tras las mutaciones.

**Estado:** `npm run typecheck` 0 errores · `npm test` **75 tests en verde** (42 esquemas · 21 fechas · 12 utils).

**Pendiente:** nada de esta revisión. Queda abierto lo del cierre del Paso 2: el commit de los pasos 1 y 2, y la decisión del usuario sobre añadir `Bash(git:*)` y confirmar si `Bash(npx shadcn:*)` casa con `npx shadcn@2`.

---

## Paso 3 — Validador de banco — 2026-07-29

**Estado:** ⚠️ Completado con ajustes

**Archivos creados o modificados**

- `scripts/validar-banco.ts` — §8 **literal**, sin una línea cambiada.
- `content/estructura.ts` — §9.1 completo: 4 bloques y 29 módulos. **Adelantado del Paso 6**, ver ADR-004. C5 en `'en-preparacion'`, no en `'completo'`.
- `content/erratas.ts` · `content/glosario.ts` · `content/datos-duros.ts` · `content/blueprint-examen.ts` — vacíos con su forma (`[]`, `{}`) y sus helpers, para que el Paso 6 solo rellene arrays sin tocar código.
- `content/banco/indice.ts` · `content/tarjetas/indice.ts` — §9.6 literal, con los mapas vacíos.
- `package.json` — añadido `"prebuild": "npm run validar"`, que era la deuda declarada del Paso 1.
- `.claude/ARQUITECTURA.md` — ADR-004.

**Verificación**

- `npm run typecheck` → 0 errores. `npm run lint` → limpio. `npm test` → **75 tests en verde** (sin cambios).
- `npm run validar` → **verde, exit 0**: 29 módulos, 0 completos, 29 avisos de "en preparación, sin banco todavía".
- `npm run build` → **verde**, y la cadena de scripts confirmada en el log:

```
> idoneo-2210@0.1.0 prebuild
> idoneo-2210@0.1.0 validar
  Validación del banco — Idóneo 2210
  Todo en orden.
> idoneo-2210@0.1.0 build
   Creating an optimized production build ...
```

- `tsx` resuelve los alias `@/lib/*` y `@/content/*` de `tsconfig.json` **sin configuración extra** (verificado por el `software-architect`). `tsc` y `eslint` cubren `scripts/` y `content/` porque el `include` es relativo a la raíz.

**Prueba de fuego — verde → rojo con un solo error → verde**

Escenario A: un ítem `C5-999` con explicación de **48 caracteres**, registrado en el índice, con C5 en `'en-preparacion'`. Salida real de `npm run build`:

```
> idoneo-2210@0.1.0 prebuild
> npm run validar
  Validación del banco — Idóneo 2210
  Módulos: 29 (0 completos, 29 en preparación)
  Ítems: 1 · Tarjetas: 0 · Erratas: 0 · Glosario: 0
  28 aviso(s):
  1 ERROR(ES) — el build se detiene:
    ✗ banco/c5-umbrales-zonas/C5-999 — explicacion: la explicación debe tener al menos 200 caracteres
EXIT DEL BUILD: 1
```

El delta es **exactamente un error**, nombra el id del ítem y el mensaje literal de la regla, y `next build` nunca llegó a correr. Eso es lo que hace la evidencia concluyente: con `MODULOS` vacío el mismo ítem habría sido invisible.

**Prueba de cuotas** — C5 en `'completo'` con 24 ítems monótonos (todos `unica`, todos `recuerdo`, todos dificultad 1) más cinco defectos sembrados. Salida real de `npm run validar`, 21 errores:

```
    ✗ banco/c5-umbrales-zonas/C5-021 — referencia: la referencia debe empezar por "Cartilla N, Tema M"
    ✗ banco/c5-umbrales-zonas/C5-022 — contradicción inexistente "X-99"
    ✗ banco/c5-umbrales-zonas/C5-023 — campo bloque dice "A", debe ser "C"
    ✗ banco/c5-umbrales-zonas/C5-024 — campo modulo dice "c9-dopaje"
    ✗ banco — id de ítem duplicado: C5-020
    ✗ banco/c5-umbrales-zonas — cuota incumplida: tiene 24 ítems, el mínimo es 25
    ✗ banco/c5-umbrales-zonas — cuota incumplida: nivel "comprension": 0/24 = 0 %, mínimo 30 %
    ✗ banco/c5-umbrales-zonas — cuota incumplida: nivel "aplicacion": 0/24 = 0 %, mínimo 20 %
    ✗ banco/c5-umbrales-zonas — cuota incumplida: dificultad 2: 0 ítems, mínimo 3
    ✗ banco/c5-umbrales-zonas — cuota incumplida: dificultad 3: 0 ítems, mínimo 3
    ✗ banco/c5-umbrales-zonas — cuota incumplida: solo 1 tipos distintos (unica), mínimo 4
    ✗ tarjetas/c5-umbrales-zonas — módulo "completo" sin tarjetas
    ✗ glosario/c5-umbrales-zonas — el concepto clave "MLSS" no tiene entrada en el glosario
      (…y los otros 8 conceptos clave de C5)
```

Cubre los tres requisitos que subrayó el usuario: **id + mensaje exacto de la regla**, **cuotas por módulo** (nivel cognitivo, dificultad, tipos mínimos, explicación de 200+, referencia bien formada) y **casos que deben fallar**. La distinción error/aviso también quedó demostrada: el mismo ítem con `bloque: 'A'` produjo un error por el campo y un **aviso** por la referencia a la Cartilla 3 desde el bloque A.

Ambas sondas se revirtieron: `content/banco/c5-umbrales-zonas.ts` borrado, `indice.ts` y `estructura.ts` restaurados desde respaldo y verificados idénticos con `diff`. `npm run validar` vuelve a salir verde con 0 ítems.

**Ajustes respecto al texto literal del blueprint**

1. **`content/estructura.ts` adelantado del Paso 6 al Paso 3.** Sin datos de módulos, el validador queda rojo tres pasos y la prueba de fuego del propio Paso 3 es indemostrable. Ver ADR-004 con la evidencia de las tres alternativas descartadas.
2. **C5 se escribe en `'en-preparacion'`, no en `'completo'` como aparece en §9.1.** Copiarlo literal produce 11 errores; §17 paso 8 es el que lo voltea. Ver ADR-004.
3. **§9.2 (blueprints) NO se adelantó.** `BLUEPRINTS = {}` queda vacío. Pegarlo aquí no aporta y con estructura vacía disparaba 35 errores.

**Notas**

- Dos verrugas cosméticas de §8 que se dejan **tal cual**, documentadas para no arreglarlas en silencio:
  - Los issues de refinamiento tienen `path` vacío, así que la línea sale con dos puntos huérfanos: `— : hay opciones duplicadas`. El arreglo sería `${i.path.join('.') || 'ítem'}`. Se revisará solo si estorba de verdad en los pasos 15–17.
  - `conteoPorModulo` guarda `items.length` antes de validar, mientras las cuotas juzgan solo los válidos: la cabecera puede decir "Ítems: 25" y la cuota "tiene 24". Se ve en la sonda de cuotas de arriba. Inofensivo.
- **Sin tests de Vitest para el validador, a propósito.** Es un script con `process.exit()` en el flujo principal: importarlo desde Vitest mata el runner, y hacerlo testeable exige refactorizar §8 en `validar(datos) → {errores, avisos}`, que es una desviación con su propio ADR y no un efecto colateral de este paso. Su superficie de corrección ya está cubierta: los esquemas y `verificarCuotas` con los 42 tests de `esquemas.test.ts`. La evidencia de este paso son las transcripciones de arriba.
- `item?.id ?? '??'` de §8 no es redundante aunque `tsc` no lo marque: con un `undefined` dentro del array el validador no revienta, imprime `banco/<slug>/?? — : Required`. Se deja.

**Pendiente**

- **El Paso 6 ya no copia §9.1** (hecho aquí). Sí le corresponden: §9.2 blueprints, §9.3 erratas, §9.4 datos duros, §9.5 glosario, y las rutas `/bloques/[bloqueId]` y el índice de `/modulos`.
- Paso 4: `src/lib/almacenamiento.ts` y `src/hooks/usar-estado.ts`. El `code-reviewer` del Paso 2 verificó que los `as EstadoProgreso` de §6 **sí compilan**: no hará falta el fallback `as unknown as`.
- Paso 5: `globals.css` de §11.3 con los 4 tokens de bloque y `@custom-variant dark`; `layout.tsx` sigue con `lang="en"` y título de create-next-app; el pie con la atribución a COLEF/COCED.
- Paso 8: voltear `c5-umbrales-zonas` a `'completo'` cuando exista su contenido, y registrarlo en los dos índices.
- Paso 14.4: `page.tsx` y los 5 SVG de create-next-app en `public/`.

---

## [2026-07-29 21:45] · code-reviewer · Paso 3

**Qué revisé:** `scripts/validar-banco.ts`, `content/estructura.ts`, los seis `content/*.ts` de forma vacía (`erratas`, `glosario`, `datos-duros`, `blueprint-examen`, `banco/indice`, `tarjetas/indice`), el enganche `prebuild` de `package.json`, y ADR-004. Alcance: todo lo no comiteado de la rama `paso-3-validador`.

**Compuertas:** typecheck ✅ (exit 0) · test ✅ (75/75, 3 archivos) · validar ✅ (exit 0, 29 avisos, 0 errores) · build ✅ (exit 0, `prebuild` → `validar` → `next build` en el log). Es el primer paso en que las cuatro aplican y las cuatro pasan.

**Fidelidad comprobada por diff mecánico contra `CLAUDE.md`, no de memoria**

- `scripts/validar-banco.ts` vs §8: **byte-idéntico**, 300 líneas, `diff -u` vacío. Ni una línea cambiada.
- `content/estructura.ts` vs §9.1: el diff son **6 líneas y ninguna es de datos** — 4 de comentario de cabecera, 2 de comentario junto a C5, más `estadoContenido: 'completo'` → `'en-preparacion'`. Es exactamente la única desviación que ADR-004 admite. Los 4 bloques, los 29 módulos, los objetivos, los conceptos clave, los prerequisitos y los 4 helpers son literales.

**Estructura verificada ejecutándola, no leyéndola** (sonda `tsx` propia, no las transcripciones de la bitácora): pesos A=0.2 B=0.22 C=0.33 D=0.25 con suma exacta 1 · 29 módulos, 0 slugs duplicados · `BLOQUES[].modulos` coincide con `MODULOS` **en contenido y en orden** en los cuatro bloques (6+6+9+8), y la vuelta también: todo módulo aparece en el `modulos[]` de su bloque · `orden` es 1..n consecutivo por bloque · 0 prerequisitos inexistentes, 0 autorreferencias, **0 ciclos** · objetivos 3–5 y conceptosClave ≥3 en los 29 · los 4 helpers correctos, incluidos los bordes (`moduloSiguiente` del último y de un slug inexistente devuelven `null`).

**Forma de los seis archivos vacíos:** correcta para que el Paso 6 solo rellene datos. `ERRATAS = []` + `ERRATAS_POR_ID` + `erratasDelModulo` · `GLOSARIO = []` + `normalizarBusqueda` + `buscarGlosario` · `DATOS_DUROS = []` + `CATEGORIAS_DATOS_DUROS` · `BLUEPRINTS = {}` · `BANCO = {}` + los 3 loaders · `TARJETAS = {}` + los 2 loaders. Ningún export que el Paso 6 tenga que crear.

**Los tres requisitos del usuario, repetidos por mí con sondas propias**

(a) **id + mensaje exacto:** ✅ `banco/c5-umbrales-zonas/C5-021 — explicacion: la explicación debe tener al menos 200 caracteres`. Sale el id del ítem y el texto literal de la regla de §5.

(b) **cuotas por módulo:** ✅ con C5 en `'completo'` y 23 ítems monótonos salieron las seis: conteo (`tiene 23 ítems, el mínimo es 25`), `nivel "comprension": 0/23 = 0 %, mínimo 30 %`, `nivel "aplicacion"`, `dificultad 2`, `dificultad 3` y `solo 1 tipos distintos (unica), mínimo 4`. Explicación 200+ y referencia bien formada se verifican por ítem, además del cruce de conceptos clave con el glosario (9 errores) y las tarjetas del módulo completo.

(c) **falla cuando debe:** ✅ 23 errores, exit 1. Sembrados y detectados: explicación corta, referencia sin formato, `contradiccion: 'X-99'` inexistente, `modulo` ajeno, `bloque` ajeno, id duplicado, opciones duplicadas en `unica`, y prefijo de id ajeno al módulo (`A1-001` en c5).

**`prebuild` aborta el build de verdad:** con el validador rojo, `npm run build` sale 1 y el log **no contiene** `Creating an optimized production build`. `next build` nunca corre.

**Invariantes:** cero `Math.random()` en `src/ content/ scripts/` · cero reloj en `content/` y `scripts/`; en `src/` solo `new Date(t)` y `new Date(\`…T12:00:00Z\`)` de `fechas.ts`, ambos con argumento y deterministas · cero `any` · sin `tailwind.config.*` · `localStorage` solo en comentarios de `tipos.ts` · `normalizar()` de §8, `normalizarBusqueda()` de `glosario.ts` y `normalizar()` de `utils.ts` usan la **secuencia de escape** `̀-ͯ` (verificado con `cat -A`: no hay bytes no-ASCII en el rango) y limpian tildes correctamente en `aeróbico`, `VO₂máx`, `cardíaca`, `Prevención`.

**Hallazgos: 🔴 0 · 🟡 5 · 💭 4.** Ningún bloqueante. Los cinco 🟡 son **huecos del propio §8/§5 del blueprint**, no defectos de ejecución de este paso: el validador es fiel al texto y §22 reglas 2 y 9 prohíben "mejorarlo" aquí. Se escalan al `software-architect` para ADR antes de los pasos 15–17.

1. 🟡 **Una clave huérfana en `BANCO`/`TARJETAS` deja un archivo entero sin validar, en silencio.** El bucle es `for (const modulo of MODULOS)` y busca la clave; nunca recorre el índice buscando claves que no correspondan a ningún slug. Sonda: registré `'c5-umbrales-zona'` (sin la `s`) apuntando a un archivo con un ítem que viola ocho reglas a la vez → **exit 0, "Todo en orden.", `Ítems: 0`**, y el único rastro es un aviso que dice `banco/c5-umbrales-zonas — en preparación, sin banco todavía`, es decir un mensaje que **apunta al lado contrario del problema**: afirma que no hay banco cuando hay un archivo registrado con 25 ítems sin revisar. Son 58 claves escritas a mano entre los dos índices en los pasos 15–17, y la primera se escribe en el Paso 8. Arreglo sugerido, ~4 líneas tras el bucle del banco: `for (const clave of Object.keys(BANCO)) if (!slugs.has(clave)) err('banco', \`clave "${clave}" del índice no corresponde a ningún módulo\`)`, e igual para `TARJETAS`.
2. 🟡 **`multiple` no hereda el refinamiento de opciones duplicadas que sí tienen `unica` y `caso`.** `esqItemMultiple.superRefine` vigila índices repetidos y fuera de rango en `correctas`, pero no el texto de `opciones`. Sonda: ítem `multiple` con la opción 0 repetida literalmente en la posición 2 → pasa. El ítem es irresoluble (la opción correcta aparece dos veces y solo un índice cuenta). Mismo defecto, misma familia, tres tipos con enunciado de opciones y solo dos protegidos.
3. 🟡 **`emparejar`: `pares` solo vigila el índice izquierdo duplicado, no el derecho.** Sonda: `pares: [[0,0],[1,0],[2,2],[3,3]]` → pasa. El elemento derecho 0 se usa dos veces y el 1 queda huérfano: la relación no es biyectiva y el ítem queda ambiguo. El `Set izq` del superRefine ya está escrito; falta el gemelo para `d`.
4. 🟡 **La teoría no se verifica nunca.** `grep` sobre §8: cero referencias a `content/teoria/`, cero `fs`. Pero la regla 8 de `CLAUDE.md` y la checklist de §14.4 definen `'completo'` como teoría **+** ≥12 tarjetas **+** ≥25 ítems. El validador exige las dos últimas y no la primera: un módulo puede quedar `'completo'` sin `.mdx`, con el build en verde, mientras su ruta muestra el estado vacío de "en preparación". El validador ya corre en Node; `existsSync` sobre `content/teoria/<slug>.mdx` cierra el hueco.
5. 🟡 **El mínimo de ítems del bloque C no está enforced.** `CUOTAS.minimoItems = 25` es global y `verificarCuotas` no admite override por bloque, pero §14.4 pide "≥25 ítems (28 en el bloque C)" y el entregable del Paso 16 es "9/9 módulos, ≥28 ítems cada uno". Hoy el Paso 16 puede declararse cumplido con 25. Es una cuota escrita en el plan que ningún comando comprueba.

- 💭 **`calculo`: `tolerancia` solo exige `> 0`.** Sonda: `respuesta: 117, tolerancia: 500` pasa; cualquier número entre −383 y 617 se califica correcto y el ítem es imposible de fallar. Un aviso con una heurística (p. ej. `tolerancia > |respuesta| * 0.25`) atraparía el error de unidad sin falsos positivos molestos. Son 8 ítems `calculo` en el blueprint final.
- 💭 **Las tarjetas no reciben el cruce prefijo↔módulo que sí reciben los ítems.** Confirmado por sonda doble: `A1-001` en el módulo c5 **sí** produce `el prefijo del id no corresponde al módulo`; 12 tarjetas `D9-T01…D9-T12` con `modulo: 'c5-umbrales-zonas'` pasan **sin una palabra**. Impacto menor —`idsTarjeta` atrapa las colisiones reales cuando los dos módulos existen— pero es una asimetría gratuita en ids que son las claves de la cola SRS.
- 💭 **`DATOS_DUROS` no se cruza con tarjetas ni con el banco**, aunque el encabezado de §9.4 dice "Cada uno DEBE existir también como tarjeta y como al menos un ítem del banco". Solo se valida su forma y sus referencias a módulo y errata. Es la clase de regla que se cumple sola con 4 datos duros y se pierde con 104.
- 💭 **Confirmé las dos verrugas cosméticas que la bitácora ya documenta**, sin nada que añadir: el issue de refinamiento sale como `C5-026 — : hay opciones duplicadas` (dos puntos huérfanos, `path` vacío), y `conteoPorModulo` cuenta antes de validar, así que la cabecera dijo `Ítems: 26` mientras la cuota decía `tiene 23 ítems`. Ambas inofensivas y bien registradas.

**Lo bien resuelto:** ADR-004 es el mejor argumento técnico de la bitácora hasta ahora — verifiqué su premisa y se sostiene: con `MODULOS = []` el bucle del banco nunca corre y la prueba de fuego del propio paso es indemostrable, así que adelantar §9.1 no es comodidad sino la única forma de que el Paso 3 pueda demostrar su entregable. Las tres alternativas descartadas están bien cerradas, incluida la tercera, que efectivamente se muerde la cola.

**Veredicto:** APROBADO CON CAMBIOS

**Pendiente antes de cerrar el paso:** nada bloqueante; el paso queda cerrado. Deuda a resolver **antes del Paso 8**, que es donde se escribe la primera clave de índice a mano: llevar los hallazgos 1–5 al `software-architect` para un ADR que decida cuáles se implementan (1, 4 y 5 son los que protegen los pasos 15–17; 2 y 3 son refinamientos de §5 y tocan un archivo que ADR-003 ya modificó). Ningún cambio aplicado por mí: el árbol quedó como lo encontré.

**Reversión de mis sondas:** creé y borré `content/banco/c5-umbrales-zonas.ts` y `content/tarjetas/c5-umbrales-zonas.ts`, y modifiqué temporalmente los dos `indice.ts` y el `estadoContenido` de C5. Todo restaurado desde respaldo previo: `diff -r` vacío en `content/` y `scripts/`, los 12 md5 idénticos a los del inicio, `git status` sin cambios respecto al arranque, y las cuatro compuertas repetidas en verde sobre el árbol restaurado.

---

## [2026-07-29 22:15] · endurecimiento del validador (ADR-005) · Paso 3

Los cinco falsos negativos que encontró el `code-reviewer`, implementados antes de comitear el Paso 3. Decisión y argumento en **ADR-005 · El validador se endureció más allá de §8**, redactado por el `software-architect` sobre el lote completo, no consulta por consulta.

**Refactor previo, sin el cual la regla "sin test no cuenta" era imposible**

Tres de los cinco huecos viven en el validador, que llamaba a `process.exit()` en el flujo principal: importarlo desde Vitest mata el runner. Se extrajo la lógica a `scripts/validar-catalogo.ts` como **función pura** `validarCatalogo(catalogo) → { errores, avisos, resumen }`, sin `fs`, sin reloj, sin `process` y sin `console`. `scripts/validar-banco.ts` queda como CLI delgado: lee `content/`, hace `readdirSync` de `content/teoria/`, delega, imprime y sale.

Vive en `scripts/` y no en `src/lib/` a propósito: la app nunca lo importa, y en `src/lib/` sería el primer módulo importable desde un Client Component sin que `server-only` aplique (la función es pura, la guarda sería mentira). `tsconfig.json` incluye `**/*.ts`, así que `tsc` y `eslint` ya lo cubrían; solo hizo falta ampliar el `include` de `vitest.config.ts` a `['src/**/*.test.ts', 'scripts/**/*.test.ts']`.

**Equivalencia demostrada, con la misma condición que ADR-003:** se capturó la salida de `npm run validar` antes del refactor y después. `diff` **vacío**. El precio honesto: `validar-banco.ts` deja de ser byte-idéntico a §8, segunda desviación del código literal del blueprint tras ADR-003. La compensación es que las ~29 comprobaciones de §8 pasan a tener superficie testeable por primera vez: antes **ninguna** tenía test de regresión.

**Los cinco arreglos**

| # | Hueco | Arreglo | Archivo |
|---|---|---|---|
| 1 | Clave huérfana en el índice deja un archivo entero sin validar y el validador sale verde | Recorrido **inverso**: `for (const clave of Object.keys(BANCO))` y su gemelo para `TARJETAS` | `scripts/validar-catalogo.ts` |
| 2 | La teoría MDX nunca se verificaba, pese a que §22 regla 8 la exige para `'completo'` | `slugsConTeoria: ReadonlySet<string>` inyectado; error solo en módulos `'completo'` | `scripts/validar-catalogo.ts` + CLI |
| 3 | `multiple` no detectaba opciones duplicadas, que sí vigilaban `unica` y `caso` | `Set` sobre `opciones` en `refItemMultiple`, mensaje reutilizado | `src/lib/esquemas.ts` |
| 4 | `emparejar` vigilaba el índice izquierdo repetido pero no el derecho | `Set` gemelo `der`, mensaje nuevo `el índice derecho N aparece dos veces` | `src/lib/esquemas.ts` |
| 5 | El mínimo de 28 ítems del bloque C no estaba enforced | `CUOTAS_BLOQUE_C` + `cuotasDelBloque(bloque)`; el validador pasa las reglas del bloque | `src/lib/esquemas.ts` + validador |

Los cinco son **error**, ninguno aviso: son defectos que un humano arregla ya y que degradarían la app, y ninguno es estado transitorio de los pasos 14–17. Los huecos 2 y 5 solo se evalúan en módulos `'completo'`, así que los 28 en preparación siguen callados. `CUOTAS` no se tocó: subirlo a 28 lo exigiría también a los bloques A, B y D.

**Cada arreglo tiene un test que falla si se quita el arreglo** — verificado por mutación, uno por uno:

| Mutación | Tests que fallan |
|---|---|
| Quitar el recorrido inverso del índice | 3 |
| Quitar la verificación de teoría | 1 |
| Quitar las opciones duplicadas de `multiple` | 1 |
| Quitar el `Set` del índice derecho | 1 |
| `cuotasDelBloque` devuelve siempre `CUOTAS` | 3 |

`esquemas.ts` y `validar-catalogo.ts` restaurados y verificados idénticos con `diff` tras las cinco mutaciones.

**Salida real del validador con los cinco sembrados a la vez** — C5 en `'completo'`, 27 ítems (25 válidos + 1 `multiple` con opciones duplicadas + 1 `emparejar` con derecho repetido), sin `.mdx`, y una clave huérfana `'c5-umbrales-zona'` en el índice:

```
  Módulos: 29 (1 completos, 28 en preparación)
  Ítems: 27 · Tarjetas: 12 · Erratas: 0 · Glosario: 9

  6 ERROR(ES) — el build se detiene:
    ✗ banco/c5-umbrales-zonas/C5-026 — : hay opciones duplicadas
    ✗ banco/c5-umbrales-zonas/C5-027 — : el índice derecho 0 aparece dos veces
    ✗ banco/c5-umbrales-zonas — cuota incumplida: tiene 25 ítems, el mínimo es 28
    ✗ banco/c5-umbrales-zonas — cuota incumplida: solo 3 tipos distintos (unica, vf, calculo), mínimo 4
    ✗ banco — la clave "c5-umbrales-zona" del índice no corresponde a ningún módulo
    ✗ teoria/c5-umbrales-zonas — módulo "completo" sin teoría: falta content/teoria/c5-umbrales-zonas.mdx
EXIT: 1
```

Sonda revertida: los dos archivos temporales borrados y los cuatro modificados restaurados desde respaldo, verificados con `diff`. `npm run validar` vuelve a dar una salida **idéntica** a la de antes del endurecimiento.

**Compuertas:** `typecheck` 0 errores · `lint` limpio · `test` **94 en verde** (5 archivos) · `build` verde con `prebuild → validar → next build`.

**Notas**

- Se añadió **una sola** prueba de subproceso, `scripts/__tests__/validar-banco-cli.test.ts`: ejecuta el CLI real contra el contenido real y afirma exit 0 y "Todo en orden.". Cubre lo único que la función pura no puede — un error de cableado entre CLI y función. Los tests por fixture van todos a `validarCatalogo`, que no toca disco.
- El resumen del validador cuenta `items` **antes** de validar mientras las cuotas juzgan solo los válidos. Se ve en la sonda: cabecera "Ítems: 27", cuota "tiene 25". Es la verruga que ya documentó el Paso 3, ahora con evidencia; sigue sin arreglarse.
- Sigue visible la otra verruga: los issues de refinamiento tienen `path` vacío y la línea sale con dos puntos huérfanos (`C5-026 — : hay opciones duplicadas`). El id del ítem y el mensaje están, que es lo que se necesita para ubicarlo; es cosmético. El arreglo sería `${i.path.join('.') || 'ítem'}` y es otra desviación de §8: **pendiente de decisión del usuario.**
- **El `.mdx` huérfano no se implementó.** El `readdir` del hueco 2 daría gratis la detección de `d2-cargas.mdx` con una `s` de más, y el arquitecto lo propuso como **aviso** —a diferencia de la clave huérfana, un `.mdx` de más no esconde contenido sin validar, el archivo es inerte—. Queda fuera porque son cinco huecos, no seis; pendiente del OK del usuario.

**Pendiente que hereda el Paso 8**

- `content/teoria/c5-umbrales-zonas.mdx` **debe existir** antes de voltear C5 a `'completo'`, o el hueco 2 rompe el build.
- **C5 necesita 28 ítems, no los 25 de §14.3.** El blueprint se contradice consigo mismo: §14.3 le da exactamente 25 y §14.4 más el entregable del Paso 16 piden 28 para el bloque C. Recomendación del arquitecto, que comparto: subir C5 a 28 ítems, **no** bajar la regla a aviso — eso reintroduciría justo la clase de falso negativo que ADR-005 condena. Queda como desviación de §14.3 a registrar en la bitácora del Paso 8.

---

## [2026-07-29 22:25] · dos arreglos pendientes y la cuota de C5 · Paso 3

Cerrados los dos puntos que quedaron esperando decisión, y resuelta la contradicción del blueprint sobre C5 antes de que llegue al Paso 8.

**1 · Los dos puntos huérfanos del mensaje de error**

§8 imprimía los issues como `${i.path.join('.')}: ${i.message}`, y los refinamientos de colección tienen `path` vacío, así que salían como `C5-026 — : hay opciones duplicadas`. Se añadió un helper `detalle(issue)` que **omite el prefijo** cuando no hay campo, en vez de inventar una etiqueta: el ámbito (`banco/c5-umbrales-zonas/C5-026`) ya identifica de qué se habla. Aplicado a las **6** formateadoras del validador: estructura, erratas, glosario, datos duros, banco y tarjetas.

Antes → después:

```
✗ banco/c5-umbrales-zonas/C5-026 — : hay opciones duplicadas
✗ banco/c5-umbrales-zonas/C5-026 — hay opciones duplicadas
```

Los errores de campo no cambian: `C5-001 — explicacion: la explicación debe tener al menos 200 caracteres`.

**2 · El `.mdx` huérfano, como AVISO**

`content/teoria/d2-cargas.mdx` (con una `s` de más) no corresponde a ningún módulo. Es el gemelo del hueco 1 en la carpeta de teoría, y el `readdir` que ya hacía el CLI lo da gratis. Va como **aviso, no error**, y la clasificación del arquitecto es la correcta: a diferencia de una clave huérfana en el índice, **un `.mdx` de más no esconde contenido sin validar** — el archivo es inerte, simplemente no se lee. La clave huérfana sí oculta un archivo de ítems entero, y por eso es error.

Salida real, con los dos casos a la vez:

```
  29 aviso(s):
    · teoria — content/teoria/d2-cargas.mdx no corresponde a ningún módulo

  1 ERROR(ES) — el build se detiene:
    ✗ banco/c5-umbrales-zonas/C5-026 — hay opciones duplicadas
```

**Los dos tienen test que falla sin su arreglo** — verificado por mutación:

| Mutación | Tests que fallan |
|---|---|
| Volver a `${path}: ${message}` sin condición | 2 |
| Quitar el aviso del `.mdx` huérfano | 2 |

`scripts/validar-catalogo.ts` restaurado y verificado idéntico con `diff`.

**3 · C5 lleva 28 ítems — ADR-006**

El blueprint se contradecía: §14.3 le da a C5 exactamente **25** ítems, mientras §14.4 y el entregable del Paso 16 piden **28** para el bloque C. Con el hueco 5 de ADR-005 cerrado, ese choque pasó de latente a bloqueante: rompería el build en el Paso 8, al voltear C5 a `'completo'`.

Decisión registrada en **ADR-006**: **C5 lleva 28 ítems.** La razón es de estándar, no de aritmética — el bloque C es el 33 % del examen y C5 es la plantilla de oro que copian los otros 28 módulos; si el piloto nace con la cuota incumplida, no queda un defecto aislado sino **un ejemplo que enseña a incumplirla**, replicado 28 veces. Se descartó bajar la regla a aviso: reintroduce a mano el falso negativo que ADR-005 acababa de tapar con test.

**§14.3 del blueprint queda corregido: donde dice 25 ítems, son 28.** La corrección vive en el ADR y no en `CLAUDE.md`, que sigue siendo de solo lectura (`git diff CLAUDE.md` vacío es invariante desde el Paso 1).

**La cuenta que hereda el Paso 8, y que no es negociable:** al subir `n` de 25 a 28, los umbrales de `verificarCuotas` se mueven y **dos de los tres ítems nuevos quedan forzados**.

| Nivel | Mínimo | Exige con n=28 | §14.3 tiene | Con n=28 | Falta |
|---|---|---|---|---|---|
| recuerdo | ≥40 % | 11,2 → **12** | 11 | 39,3 % ✗ | **+1** |
| comprensión | ≥30 % | 8,4 → **9** | 8 | 28,6 % ✗ | **+1** |
| aplicación | ≥20 % | 5,6 → **6** | 6 | 21,4 % ✓ | libre |

Los tres ítems, entonces:

| Id | Nivel | Dificultad | Tipo | Por qué |
|---|---|---|---|---|
| `C5-026` | recuerdo | 1 | única | Cierra el mínimo forzado de recuerdo (11→12). Única es el tipo dominante del examen (65 % del blueprint FINAL) y C5 va en 52 %. |
| `C5-027` | comprensión | 2 | múltiple | Cierra el mínimo forzado de comprensión (8→9). Múltiple sube 2→3: discrimina comprensión evaluando afirmaciones una a una. |
| `C5-028` | aplicación | 3 | cálculo | El libre. Va a aplicación para dejar margen (7 contra el umbral de 5,6) en vez de quedar pegado en 6. Cálculo sube 3→4, y el bloque C concentra las fórmulas. |

Reparto final: **12 · 9 · 7** por nivel (42,9 / 32,1 / 25,0 %) y **14 única · 4 cálculo · 3 caso · 3 múltiple · 2 emparejar · 1 ordenar · 1 V/F**. Las 15 tarjetas y los 9 conceptos clave del glosario no se mueven.

**Advertencia para quien escriba el Paso 8:** el nivel de esos tres ítems **no es negociable ítem a ítem**. Si al redactar `C5-026` parece más de comprensión que de recuerdo, no basta con cambiarle la etiqueta: recuerdo volvería a 11/28 y el build rompe. Con 28 ítems, 12/9/7 es el único reparto con holgura en los tres niveles.

Los otros 8 módulos del bloque C (C1–C4, C6–C9) heredan el mismo mínimo de 28 en el Paso 16, donde ya estaba declarado como entregable. Con `cuotasDelBloque` enforzándolo, ese entregable pasa de promesa a compuerta.

**Compuertas:** `typecheck` 0 errores · `lint` limpio · `test` **100 en verde** (5 archivos) · `validar` verde · `build` verde.

`.claude/CONTENIDO.md` actualizado: la fila de C5 dice 28 y la regla dura del encabezado nombra el mínimo del bloque C.

---

## Paso 4 — Almacenamiento — 2026-07-29

**Estado:** ⚠️ Completado con ajustes

**Archivos creados**

- `src/lib/almacenamiento.ts` — §6 más los dos cambios de ADR-008. Sin `"use client"`: módulo neutro con guardas de SSR.
- `src/hooks/usar-estado.ts` — §6.1, con la función exportada como `useEstado` (ADR-007). El nombre del archivo no cambia.
- `src/lib/__tests__/almacenamiento.test.ts` — **59 tests**.
- `.claude/ARQUITECTURA.md` — ADR-007 y ADR-008.

**Verificación**

- `npm run typecheck` → 0 errores. `npm run lint` → limpio. `npm test` → **159 tests en verde** (6 archivos). `npm run validar` y `npm run build` sin cambios, en verde.

**Ajustes respecto al texto literal del blueprint**

1. **El hook se exporta como `useEstado`, no `usarEstado`** (ADR-007). Con el nombre de §6.1, `npm run lint` queda **rojo**: `react-hooks/rules-of-hooks` tiene el prefijo `use` hardcodeado y no hay configuración que lo evite. Demostrado en ejecución: con `usarEstado` hay 1 error, con `useEstado` hay 0. Lo grave no es el error sino lo que se pierde — sin reconocer la función como hook, **la regla deja de auditar su interior**, y eso afectaría también a `usarSesion` (Paso 9) y `usarCronometro` (Paso 11), que son el código del cronómetro y el auto-envío. Los nombres de archivo se conservan, así que §10.3 sigue exacto.
2. **Cuarentena del estado ilegible** (ADR-008). §6 no solo abandonaba el progreso: **`leerEstado` lo destruía en el acto**, en la primera lectura de cualquier componente, porque `guardarEstado(crearEstadoInicial(...))` pisa la clave ahí mismo. Eso choca con §22 regla 12 y con el propio comentario de §6. Ahora el payload se aparta bajo `idoneo2210:estado-ilegible` con su motivo antes de sobrescribir.
3. **`localStorageUsable = false` en el `catch` de `escribirCrudo`** (ADR-008). Una línea que corrige pérdida de datos real: la sonda de 1 byte pasa con el disco casi lleno, así que `leerCrudo` seguía leyendo de `localStorage` y devolvía el valor **viejo**. Verificado que `leerSesion()` devolvía la sesión vieja con cero respuestas tras guardar la nueva — en un simulacro final, reanudar perdiendo respuestas.
4. **Guard `version > VERSION_ESQUEMA`** en `intentarMigrar`, y el motivo `version-futura` en la cuarentena, para distinguir "viene de una app más nueva" de "está corrupto". Mismo comportamiento, distinta etiqueta, para que /ajustes pueda decir la verdad.

**Requisito 1 · migraciones defensivas — un test por caso**

| Caso | Motivo de cuarentena | Resultado |
|---|---|---|
| Estado v1 válido | — | se conserva íntegro, no entra en cuarentena |
| Versión vieja (`version: 0`) | `invalido` | apartado |
| Versión futura (`version: 2`) | `version-futura` | apartado |
| JSON malformado / truncado | `no-json` | apartado |
| JSON que no es objeto | `no-json` | apartado |
| Sin campo `version` | `sin-version` | apartado |
| Campo requerido faltante | `invalido` | apartado |
| localStorage no disponible (modo privado) | — | degrada a memoria, nada revienta |
| localStorage lleno (cuota) | — | degrada a memoria, avisa, y lee el valor NUEVO |

Cada caso de cuarentena verifica tres cosas, no una: que el usuario recibe un estado usable (no ve la app en blanco), que el payload original sigue recuperable **byte a byte**, y que el motivo está bien clasificado. Más: la primera cuarentena gana, `descartarIlegible` la borra, `reiniciarTodo` también, y un registro de cuarentena corrupto no revienta.

**Requisito 2 · `useSyncExternalStore`**

- `obtenerSnapshot()` devuelve la **misma referencia** en llamadas sucesivas (`toBe`), y `null` de forma estable cuando no hay estado o es ilegible (`Object.is`).
- `guardarEstado` invalida el caché y la referencia siguiente es la nueva.
- `obtenerSnapshotServidor()` devuelve `null` **incluso con el caché ya poblado**.
- Sincronización entre pestañas: el evento `storage` de la clave de estado invalida y notifica **una** vez; el de otra clave no notifica; `desuscribir()` quita el oyente y el listener de `window`; y otra pestaña puede *arreglar* un estado ilegible.

**Verificación por mutación** — cada requisito tiene test que falla al quitar su garantía:

| Mutación | Tests que fallan |
|---|---|
| Quitar `apartarIlegible` de `leerEstado` | 8 |
| Quitar `localStorageUsable = false` del `catch` | 1 |
| `obtenerSnapshot` sin caché (objeto nuevo cada vez) | 4 |
| `obtenerSnapshotServidor` devuelve el estado cacheado | 1 |

La última **no fallaba** en el primer intento: el test llamaba a `obtenerSnapshotServidor()` sin haber poblado el caché, así que pasaba por la razón equivocada. Corregido para poblar el caché primero, que es lo que le da valor. `almacenamiento.ts` restaurado y verificado idéntico con `diff` tras las cuatro mutaciones.

**Cómo se testeó sin dependencias nuevas**

`vitest.config.ts` usa `environment: 'node'`, así que no hay `window` y las guardas de SSR de §6 dejan el módulo inerte. Se descartó jsdom (dependencia nueva que ADR-002 no admite, y con menos control: para simular cuota habría que parchear `setItem` igual). En su lugar, un doble de `window` de ~35 líneas en el propio archivo de test, montado con `vi.stubGlobal` — que acepta `unknown`, así que **no hace falta ningún `as any`**.

El módulo cachea estado (`snapshot`, `memoria`, `localStorageUsable`, `oyentes`), así que cada caso lo carga con `vi.resetModules()` + `await import()`. **Trampa que hay que respetar:** el archivo de test no puede tener un `import` estático de las funciones bajo prueba — `resetModules` solo afecta a las importaciones dinámicas posteriores. Solo `import type`. Está anotado en un comentario al inicio del archivo.

**Notas**

- **`necesitaRespaldo` se copió tal cual, con un hueco documentado en un test.** §18.5 dice "cada 7 días de uso", pero la rama sin `ultimoRespaldo` mira `racha.dias`, que son días **consecutivos** y se reinicia a 1 al saltarse uno: un entrenador que estudia 3 noches por semana durante dos meses **nunca** ve el recordatorio de respaldo. El blueprint gana y el hueco queda visible para decidirlo en el Paso 18.5, que es donde existe la UI y el contexto.
- **Defecto menor que se dejó sin arreglar, a propósito:** con un estado ilegible guardado, `snapshot` queda en `null` y la guarda `if (snapshot)` nunca corta, así que `obtenerSnapshot` vuelve a hacer `JSON.parse` + Zod + `console.warn` en **cada** llamada — o sea, N warns por render mientras el dato siga ilegible. No hay riesgo de bucle (devuelve `null` de forma estable y `Object.is(null, null)` es `true`): es ruido y coste, no corrupción, y además transitorio, porque el primer `leerEstado` en un efecto lo reemplaza por un estado válido. El arreglo (una bandera `snapshotIlegible`) habría que limpiarla en tres sitios, incluido el handler del evento `storage`, o otra pestaña arreglaría el estado y esta se quedaría en `null` para siempre. No vale ese acoplamiento hoy.
- `crearEstadoInicial` produce un estado que su propio esquema acepta: exportar e importar cierra el círculo desde el minuto uno. Hay test.

**Pendiente**

- **Paso 18.5 hereda una obligación concreta:** la UI de /ajustes **debe exponer la cuarentena** — avisar de que hay progreso apartado, permitir descargarlo y descartarlo. Sin eso, el mecanismo de ADR-008 existe sin que nadie pueda usarlo. Y debe decir la verdad: la cuarentena hace el progreso recuperable, no lo restaura.
- **Paso 12, riesgo ya registrado en ADR-008:** `esqIntento.desglose.porBloque` es `z.record(esqConteo)`, así que un intento sin los bloques B/C/D pasa Zod, pero el cast afirma las cuatro claves y `construirInforme` de §7.5 hace `porBloque[b.id].total` → `Cannot read properties of undefined`. Vía de entrada: `importarJSON` acepta ese respaldo. El arreglo toca `esquemas.ts` (Paso 2) y el crash está en el Paso 12: se decide allí, no aquí.
- Pasos 9 y 11 heredan la convención de ADR-007: `useSesion` y `useCronometro`, archivos `usar-sesion.ts` y `usar-cronometro.ts`.
- Paso 5: `globals.css` de §11.3 con los 4 tokens de bloque y `@custom-variant dark`; `layout.tsx` sigue con `lang="en"`; el pie con la atribución a COLEF/COCED.

---

## [2026-07-29 22:58] · code-reviewer · Paso 4

**Qué revisé:** los tres archivos del entregable — `src/lib/almacenamiento.ts`, `src/hooks/usar-estado.ts` y `src/lib/__tests__/almacenamiento.test.ts` (59 tests) — más `.claude/ARQUITECTURA.md` (ADR-007, ADR-008) y la entrada "Paso 4" de esta bitácora. Diff mecánico contra §6 y §6.1 del blueprint, verificación de la regla 6 sobre la cuarentena de ADR-008, campaña de mutación de 64 mutantes y 28 sondas propias. No apliqué ningún cambio al código.

**Compuertas:** typecheck ok · lint ok · test ok (159 tests, 6 archivos) · validar ok (29 avisos, todos "en preparación") · build ok. Repetidas al final con el árbol restaurado: las cinco siguen en verde.

**Invariantes verificados:**
- `grep -rn "Math.random" src/ content/ scripts/` → vacío.
- `grep -rn "Date.now()\|new Date()" src/lib/` → solo dos comentarios en `fechas.ts`. **`almacenamiento.ts` no llama al reloj:** recibe `ahoraISO` por parámetro en las 12 funciones que lo necesitan.
- `grep -rn "localStorage" src/ --include=*.ts --include=*.tsx | grep -v almacenamiento.ts` → solo comentarios de `tipos.ts` y el doble de `window` del test. Ningún acceso real fuera del wrapper.
- Directiva `"use client"` por primera línea real: `usar-estado.ts` **sí** la lleva; `almacenamiento.ts`, `tipos.ts` y `esquemas.ts` **no** (solo la nombran en comentarios). Concuerda con §10.3.
- `grep -rn ": any\|as any\|<any>" src/ scripts/ content/` → vacío. El doble de `window` va con `vi.stubGlobal`, que acepta `unknown`.
- Tailwind v4: `tailwind.config.*` no existe · sin `@tailwind ` en `globals.css` · `components.json` con `"config": ""`.
- **Regla 6 (sin efectos en render):** rastreados los call sites. `escribirCrudo` se alcanza desde `guardarEstado`, `apartarIlegible` y `guardarSesion`; `apartarIlegible` **solo** desde `leerEstado` (línea 268). El camino de render (`obtenerSnapshot` → `leerCrudo` + `intentarMigrar`) no escribe. Sonda propia: 5 rondas de `obtenerSnapshot`/`obtenerSnapshotServidor`/`intentarMigrar` sobre un payload ilegible dejan el almacén byte a byte igual. Mutar el código para mover la cuarentena a `obtenerSnapshot` mata 5 tests, así que hay presión de regresión sobre la trampa.

**Fidelidad a §6/§6.1:** diff mecánico limpio. Las únicas diferencias son las cuatro documentadas (comentario de encabezado, `localStorageUsable = false` en el `catch`, guard `version > VERSION_ESQUEMA`, bloque de cuarentena de ~70 líneas) más el rename de ADR-007 en §6.1. **Verificado literal:** los 12 mutadores de dominio, `conModulo`, `necesitaRespaldo`, `importarJSON`, `exportarJSON`, `leerSesion`/`guardarSesion`/`borrarSesion` y el bloque de snapshot/suscripción no tienen ni una línea alterada.

**Campaña de mutación — 64 mutantes, 48 muertos, 16 supervivientes.** Verifiqué con sondas propias que **en los 16 casos el código es correcto**: son tests ausentes, no defectos. Los tres que el usuario señaló:
- *Clasificación de `MotivoIlegible`*: **sí discrimina.** Intercambiar `sin-version`↔`invalido` mata 3 tests; `no-json`↔`version-futura`, 1; colapsar los cuatro motivos, 4. Además truncar el `payload` mata 6 y falsear `guardadoEn` mata 7.
- *"La primera cuarentena gana"*: **cubierta**, quitarla mata 1 test.
- *Modo `cuota` del doble de `window`*: **no miente.** La sonda de 1 byte pasa y la escritura real lanza, que es exactamente el fallo de ADR-008; quitar `localStorageUsable = false` mata 1 test.

**Hallazgos:** 🔴 0 · 🟡 11 · 💭 6. Ninguno es un defecto de código: 10 son huecos de test y 1 es deriva de documentación. Los de mayor consecuencia:
- `guardarEstado` no tiene test de `notificar()`: es el único cable entre una escritura y la UI **en la misma pestaña**, y todos los componentes de los pasos 8–13 dependen de él. Los tests de `suscribir` solo ejercen la vía `storage` entre pestañas.
- `obtenerIntento` solo prueba el caso negativo: devolver `intentos[0]` pasa la suite, y `/resultados/[intentoId]` del Paso 12 se apoya entero en esa búsqueda.
- `borrarSesion` sin test: si no borra, el `dialogo-reanudar` del Paso 11 ofrece reanudar un simulacro ya cerrado.
- `marcarTeoriaLeida` nunca verifica `teoriaLeida`; convertirla en no-op pasa la suite (`marcarPracticaCompletada` sí está cubierta: asimetría).
- `importarJSON` no prueba la pureza del camino de éxito; si persistiera, la confirmación explícita de §18.5 quedaría sin efecto (regla 12).
- `necesitaRespaldo` "es false sin intentos" **pasa por la razón equivocada**: con `racha.dias: 5` la segunda rama devuelve `false` igual, así que quitar la guarda no cambia nada.
- `CLAUDE.md` sigue diciendo `usarEstado`: línea 1437 lo define y las 6298 y 6640 instruyen a los pasos siguientes a consumirlo. El Paso 8 (`etapas-modulo.tsx`) se escribiría contra un símbolo que no existe.

**Requisitos subrayados por el usuario, verificados con sondas propias (28, todas en verde):**
- *(a) Migraciones defensivas:* seis escenarios (versión vieja, versión futura, JSON malformado, campo faltante, no-objeto, vacío) más cuota llena y SSR sin `window`. En todos el usuario recibe un estado usable, `obtenerSnapshot` no lanza y el payload original sigue recuperable byte a byte. Nadie pierde progreso ni ve la app en blanco.
- *(b) `useSyncExternalStore`:* `obtenerSnapshotServidor()` devuelve `null` en los **tres** estados del caché (vacío, poblado por lectura, poblado por escritura). `obtenerSnapshot()` devuelve la misma referencia en 50 llamadas seguidas, y `null` estable sin estado y con estado ilegible.

**Veredicto:** APROBADO CON CAMBIOS

**Pendiente antes de cerrar el paso:**
1. Los 10 tests que faltan (los cinco primeros son los que protegen a los pasos 10–13): `guardarEstado` notifica · `obtenerIntento` caso positivo · `borrarSesion` · `guardarColaRepaso` · `guardarDatosPersonales` · `marcarTeoriaLeida` pone la bandera · `importarJSON` puro en éxito · `necesitaRespaldo` sin intentos con racha ≥7 · `necesitaRespaldo` en la frontera `ultimoRespaldo === ayerHace7` · `desuscribir` comprobado sobre el Set interno con dos suscriptores.
2. Alinear `CLAUDE.md` con ADR-007 (líneas 1437, 6298, 6640) o el Paso 8 arranca roto.
3. Ratificación del `software-architect` para ADR-008: añade una tercera clave donde §6 dice "dos claves, deliberadamente separadas" y amplía la API pública del wrapper. No lo bloqueo —corrige una violación real de la regla 12 y está bien argumentado— pero es un desvío de una decisión cerrada y no me corresponde ratificarlo.
4. Heredado al Paso 11, ya visible hoy: `leerSesion` hace `JSON.parse ... as SesionCronometro` **sin validar** y no existe `esqSesionCronometro` en `esquemas.ts`. Sonda propia: con `{"foo":1}` guardado devuelve un objeto sin `itemIds` ni `duracionSegundos`; recorrer `sesion.itemIds` lanza `TypeError` y `restantes()` daría `NaN` porque `undefined !== null`. Es §6 literal, así que no es desvío: es deuda que detona en el cronómetro.
5. Nota para 18.5 y 11: `leerIlegible` y `leerSesion` **no** son libres de efectos (hacen `borrarCrudo` al autolimpiarse). Llamarlas en el cuerpo de un render sería escritura en render.

**Estado del árbol:** lo dejé exactamente como lo encontré. Verificado con `sha256sum -c` (3 sumas coinciden), `diff` contra copias pristinas (idénticos) y `git status --porcelain` (2 docs modificados + 3 sin seguimiento, igual que al inicio). La sonda temporal se borró.

---

## [2026-07-29 23:05] · cierre de los cambios del code-reviewer · Paso 4

Los once 🟡 de la revisión del Paso 4. **Ninguno era defecto de código**: el revisor mutó el código 64 veces, dejó 16 supervivientes y verificó con 28 sondas propias que en los 16 el código estaba bien y lo que faltaba era el test. Diez eran huecos de la suite; el undécimo no es de test y queda pendiente de tu decisión.

**Diez tests añadidos**, de 59 a 69 en el archivo (169 en total):

| Hueco | Por qué importaba |
|---|---|
| `guardarEstado` no probaba `notificar()` | Es el **único cable escritura → UI dentro de la misma pestaña**: los navegadores no emiten `storage` en la pestaña que escribió. Sin él, la app no se refresca al responder un ítem en los pasos 8–13, y la suite seguía verde. |
| `reiniciarTodo` tampoco lo probaba | Igual. |
| `desuscribir` afirmaba sobre el registro de `window`, no sobre el Set interno | Dejar el oyente dentro del Set pasaba. Ahora se verifica vía `guardarEstado`. |
| `obtenerIntento` solo probaba el caso negativo | Devolver `intentos[0]` pasaba, y `/resultados/[intentoId]` del Paso 12 se apoya entero en esa búsqueda: mostraría el informe equivocado. |
| `marcarTeoriaLeida` solo afirmaba `ultimaVisita` | Volverla no-op pasaba. Asimetría con `marcarPracticaCompletada`, que sí estaba cubierta. |
| `guardarColaRepaso` sin test | La escribe `lib/srs.ts` en el Paso 10. |
| `guardarDatosPersonales` sin test | La usan los pasos 13 y 18.5. |
| `borrarSesion` sin test | Si no borra, el `dialogo-reanudar` del Paso 11 ofrece reanudar un simulacro ya cerrado. |
| `leerSesion` con sesión corrupta sin test | Debe descartar y limpiar. |
| `importarJSON` sin test de pureza en el **éxito** | Si persistiera, la confirmación explícita que pide §18.5 no serviría de nada (§22 regla 12). |
| `necesitaRespaldo` "sin intentos" pasaba por la razón equivocada | Con `racha.dias: 5` la segunda rama daba `false` igual. Ahora se prueba con racha 30, así el `false` solo puede venir del corte temprano. Añadida también la frontera inclusiva de `ultimoRespaldo`. |

**Verificación por mutación de los nuevos:**

| Mutación | Test que falla |
|---|---|
| `guardarEstado` sin `notificar()` | 1 |
| `obtenerIntento` devuelve `intentos[0]` | 1 |
| `marcarTeoriaLeida` como no-op | 1 |
| `borrarSesion` como no-op | 1 |
| `importarJSON` persiste al aceptar | 1 |

`almacenamiento.ts` restaurado y verificado idéntico con `diff` tras las cinco.

**Lo que el revisor confirmó que sí estaba bien**

Fidelidad a §6 limpia por diff mecánico: los 12 mutadores, `conModulo`, `necesitaRespaldo`, `importarJSON`, `exportarJSON` y el bloque de sesión están literales, y solo aparecen las cuatro desviaciones documentadas. La cuarentena **no rompe la regla 6**: `apartarIlegible` se llama desde un único sitio, `leerEstado`, y cinco rondas de render sobre un payload ilegible dejan el almacén byte a byte igual — además, mover la cuarentena a `obtenerSnapshot` mata 5 tests, así que la trampa tiene presión de regresión. Y los tres puntos que pedí con lupa aguantaron: `MotivoIlegible` sí discrimina (intercambiar `sin-version` por `invalido` mata 3 tests, truncar el `payload` mata 6), "la primera cuarentena gana" está cubierta, y el modo `cuota` del doble no miente.

**Estado:** `typecheck` 0 · `lint` limpio · `test` **169 en verde** (6 archivos) · `validar` verde · `build` verde.

**Pendiente de decisión del usuario — no es un hueco de test**

**`CLAUDE.md` contradice ADR-007.** Define `usarEstado` en la línea 1437 y manda consumirlo en la 6298 y la 6640. El Paso 8 arrancaría roto si su ejecutor sigue el blueprint literal, porque la función se llama `useEstado`. Hay dos salidas y ninguna la tomo por iniciativa propia:

1. **Editar `CLAUDE.md`** en esos tres puntos. Rompe el invariante que fijó el Paso 1 (`git diff CLAUDE.md` vacío), que hasta ahora ha sostenido que el blueprint es de solo lectura y que sus correcciones viven en los ADR (§5 en ADR-003, §9.1 en ADR-004, §8 en ADR-005, §14.3 en ADR-006).
2. **Dejarlo como está** y confiar en que quien ejecute el Paso 8 lea ADR-007. Es lo coherente con los cuatro ADR anteriores, pero esta corrección es distinta: las otras se descubren al fallar el build o el validador, y esta se descubre como un `TypeError` en runtime o un import que no resuelve.

**Otras notas del revisor, registradas para más adelante**

- **Paso 11, deuda de §6 literal:** `leerSesion` hace `JSON.parse(crudo) as SesionCronometro` **sin validar**, y no existe un `esqSesionCronometro`. Con `{"foo":1}` devuelve un objeto sin `itemIds` ni `duracionSegundos`: recorrer `itemIds` lanza `TypeError`, y `restantes()` daría `NaN` porque `undefined !== null`. No es desviación, es deuda del blueprint; se decide en el Paso 11.
- `leerIlegible` y `leerSesion` **no** son libres de efectos: se autolimpian con `borrarCrudo` si el payload es corrupto. El Paso 18.5 y el `dialogo-reanudar` deben llamarlas desde un efecto, no en render.
- Los guards de versión de `intentarMigrar` son **redundantes hoy**: `esqEstadoProgreso.version` es `z.literal(1)` y Zod ya rechaza ambos casos. Su valor real está en `clasificarIlegible`, que sí está probado. Con la v2 pasan a ser portantes y necesitarán test propio.
- **El doble de `window` tiene una etiqueta imprecisa:** el modo `privado` hace que `setItem` lance siempre, y el Safari privado moderno (≥11) ya no hace eso — da un `localStorage` funcional con cuota pequeña que se borra al cerrar. El escenario que reproduce de verdad es "localStorage inutilizable" (cookies bloqueadas, iframe de terceros, Firefox estricto), que es igual de válido. La etiqueta es imprecisa, el escenario no.
- El revisor escaló **ADR-008** al `software-architect` para ratificación, por la tercera clave de `localStorage` y la API pública nueva. No lo bloqueó: corrige que §6 destruyera el progreso y restaura un invariante en vez de romperlo.

---

## [2026-07-29 23:20] · se editó CLAUDE.md y se creó PENDIENTES.md · Paso 4

Resuelto el undécimo hallazgo del `code-reviewer`, el único que no era hueco de test.

**1 · `CLAUDE.md` editado — tres líneas, primera vez que se toca el blueprint**

| Línea | Antes | Ahora |
|---|---|---|
| 1437 | `export function usarEstado(): EstadoProgreso \| null {` | `useEstado` |
| 6298 | Paso 8, viñeta 6: "…estado leído de `usarEstado()`" | `useEstado()` |
| 6640 | §21: "`usarEstado()` devuelve `null` en el primer render" | `useEstado()` |

`git diff --stat CLAUDE.md` → **3 insertions(+), 3 deletions(-)**. Ni una línea más.

Decisión del usuario, y la razón queda registrada como enmienda de **ADR-007**: no es preferencia de nomenclatura. Con `usarEstado`, `react-hooks/rules-of-hooks` **deja de auditar el interior del hook**, y eso apagaría la verificación en `usarSesion` (Paso 9) y `usarCronometro` (Paso 11) — el controlador de sesión y el cronómetro con auto-envío. El invariante de "blueprint de solo lectura" que fijó el Paso 1 protege la integridad de la fuente, **no cubre errores que rompen el build**.

Por qué esta corrección sí y las cuatro anteriores no: ADR-003 (§5), ADR-004 (§9.1), ADR-005 (§8) y ADR-006 (§14.3) corrigen cosas que **se descubren solas** — rompen `tsc`, el validador o el build, así que quien las tropieza busca la razón y encuentra el ADR. Esta no: un ejecutor del Paso 8 que siguiera el blueprint literal escribiría `import { usarEstado } from '@/hooks/usar-estado'` y eso falla como import que no resuelve, sin señal que apunte a ningún ADR.

**Verificación:** `grep -c usarEstado CLAUDE.md` → **0**. Cero ocurrencias funcionales en `src/`, `scripts/` y `content/`. La única mención que sobrevive en código es el docstring de `src/hooks/usar-estado.ts`, que explica la decisión a quien lea el archivo, y es deliberada. Los nombres de archivo no se tocaron, así que §10.3 sigue exacto. `npm run lint` limpio.

**2 · `.claude/PENDIENTES.md` — nuevo archivo**

Las obligaciones heredadas estaban dispersas en cinco entradas de bitácora y seis ADR, y ninguna estaba donde el paso que debe cumplirlas la va a leer. Ahora hay un índice **agrupado por paso**, con la regla de que cada línea rompe algo si se ignora, y un puntero en el encabezado de esta bitácora para que se lea antes de empezar cualquier paso.

Consolida lo acumulado en los pasos 1 a 4: los tokens de bloque y `@custom-variant dark` del Paso 5, el `lang="en"` que sigue en `layout.tsx`, los 28 ítems de C5 con su reparto forzado 12/9/7 del Paso 8, la convención `useSesion`/`useCronometro` de los pasos 9 y 11, el `leerSesion` sin validar del Paso 11, el crash del `desglose` parcial del Paso 12, los SVG de create-next-app del Paso 14.4, el mínimo de 28 del Paso 16, `reactStrictMode` que debe sobrevivir al 18.1, y el README del 18.9.

**La obligación que motivó el archivo, en `PENDIENTES.md` → Paso 18.5:** la UI de /ajustes **debe** exponer la cuarentena de ADR-008, con las tres acciones concretas — **avisar** (traduciendo `motivo` a lenguaje de usuario: `version-futura` es "viene de una versión más nueva de la app", no "está corrupto"), **descargar** el payload como archivo, y **descartar** con confirmación. Y decir la verdad en el texto: la cuarentena hace el progreso recuperable, **no lo restaura**. Sin esa UI, el mecanismo existe y nadie puede alcanzar el progreso apartado.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **169 en verde** · `validar` verde · `build` verde.

---

## [2026-07-29 23:35] · CLAUDE.md corregido también en la cuota de C5 · Paso 4

Segunda corrección al blueprint, mismo criterio que la del hook: **se edita cuando la instrucción literal rompe el build y no deja rastro que apunte al ADR.**

`CLAUDE.md` seguía diciendo 25 ítems para C5 en cuatro sitios, contra el ADR-006:

| Línea | Antes | Ahora |
|---|---|---|
| 176 | árbol: "25 ítems del módulo piloto" | 28 |
| 5350 | título de §14.3: "— 25 ítems, los 7 tipos" | "— 28 ítems" + nota con los 3 que faltan y su nivel forzado |
| 6295 | Paso 8, viñeta 3: "copiar §14.3 (25 ítems)" | "copiar §14.3 y escribir 3 ítems más hasta 28", con el reparto 12/9/7 y el puntero a ADR-006 |
| 6319 | Paso 8, entregable: "en verde con 25 ítems" | 28 — con 25 el validador **no** estaría verde |

**El escenario que evita:** el Paso 8 lee su viñeta 3, copia los 25 ítems, voltea C5 a `'completo'`, y **entonces** el validador rompe por la cuota del bloque C — con el trabajo de redacción ya hecho y el ejecutor entre dos fuentes que se contradicen.

**El título de §14.3 no se cambió a secas.** Esa sección contiene 25 objetos de ítem: poner "28" sin más sería un título que promete lo que el código no trae. La nota dice que trae 25 y que faltan 3, con la tabla de los tres (`C5-026` recuerdo/1/única, `C5-027` comprensión/2/múltiple, `C5-028` aplicación/3/cálculo) y la advertencia de que reetiquetar uno no sirve. La tabla de verificación que sigue quedó rotulada como "los 25 ítems escritos abajo", que es lo que verifica de verdad.

**Cinco referencias a `≥25` se dejaron intactas** (líneas 51, 2940, 5913, 6684, 6771): son el mínimo **global**, correcto para A, B y D, y no contradicen nada para C porque 28 ≥ 25. La de §14.4 ya decía "≥25 ítems (28 en el bloque C)".

Diff acumulado de `CLAUDE.md` en el Paso 4: **24 insertions(+), 9 deletions(-)** — 3 líneas por el hook (ADR-007) y 4 por la cuota (ADR-006), más la nota explicativa de §14.3. Registrado como enmienda en ADR-006 y actualizado en `PENDIENTES.md`.

---

---

## [2026-07-29 23:40] · ui-designer · Paso 5 (plan, sin código)

**Qué diseñé:** el sistema de diseño completo del Paso 5 como **propuesta pendiente
de aprobación** en `.claude/DISENO.md`. Alcance: paleta con contraste auditado en
los dos temas, escala tipográfica de 15 roles, reglas de espaciado y radio,
elemento firma, y el veto explícito de los tres *looks* por defecto. **No se
escribió nada en `src/`**: el usuario aprueba antes de que se implemente.

**Decisiones tomadas:**
- **Paleta:** se conserva §11.3 en nombres y en 90 % de los valores. Seis valores
  cambian por accesibilidad medida (D-1 a D-6 en `DISENO.md`): `--aviso` y
  `--aviso-foreground`, `--bloque-a`, los cuatro `--bloque-*-suave`, `--input`, y
  `--border` (este último por legibilidad, no por AA). Ningún token se renombra,
  así que los 18 componentes de `src/components/ui/` no se tocan.
- **Auditoría de contraste:** 59 pares medidos con conversión oklch→sRGB y fórmula
  WCAG 2.1, claro y oscuro. §11.3 tal cual traía **6 violaciones AA en tema claro**
  (`--aviso` como texto 3.11:1; `--bloque-a` 3.94:1 / 3.54:1 / 3.93:1 en sus tres
  roles; `--bloque-c` y `--bloque-d` sobre su `-suave` a 4.42:1 y 4.47:1) y
  `--input` fallando 1.4.11 en los dos temas (1.30:1 y 1.42:1). Con las seis
  correcciones: **0 fallos**.
- **Tipografía:** Barlow → **Barlow Condensed** para el rol display (D-7 en
  `DISENO.md`, desviación de §11.2). Inter y JetBrains Mono se conservan. Token
  `--fuente-titulo` intacto.
- **Firma: el instrumento de umbral.** Bandas de intensidad + línea de umbral +
  marcador de calibre, tomado de la gráfica de zonas R0/R1/R2/R3 del módulo C5.
  Hallazgo que lo vuelve sistema: los cortes de `calcularVeredicto` (60/75/85) ya
  son una gráfica de umbral de cuatro tramos. Dos manifestaciones de una misma
  gramática de 7 reglas: el **riel de bloques** (Paso 5) y la **escala de umbral**
  (Pasos 8/12/14).
- **El riel de bloques es proporcional a `pesoExamen`** (A 20 · B 22 · C 33 · D 25),
  no de segmentos iguales. Eso lo convierte en información y no en decoración.
- **Layout:** encabezado no fijo (el alto vertical es escaso a 375px); la
  orientación por bloque persistente vive en la lengüeta del destino activo de la
  barra inferior, que sí está siempre visible y en zona de pulgar.

**Qué descarté y por qué:**
- **Oscurecer `--background`** a `oklch(0.972 0.004 250)` para separar la tarjeta
  del fondo. Medido: la separación pasa de 1.03:1 a **1.08:1, sigue siendo
  imperceptible**, y a cambio estrecha el margen AA de los diez tokens que se leen
  encima. Se rechaza; la jerarquía se resuelve subiendo `--border` (D-6).
- **Cuatro colores propios para las bandas R0/R1/R2/R3** (el reflejo tipo
  Garmin/Strava). Habría producido un sistema de 8 colores categóricos sin
  jerarquía, compitiendo con los 4 tokens de bloque. Sustituido por una rampa de
  opacidad de un solo matiz (12/28/55/85 %), que hace el instrumento reutilizable
  en cualquier contexto de color.
- **Píldora de fondo** para el destino activo de la nav, **anillo/dona** para el
  puntaje y **barra de progreso redondeada** para el avance: los tres son la
  respuesta por defecto de cualquier app de estudio. Reemplazados por lengüeta,
  escala de umbral y riel.
- **Una cuarta familia tipográfica** más «marcador» (Azeret/Martian Mono) en lugar
  de JetBrains Mono. JetBrains se queda porque distingue `0/O` y `1/l`, y la app
  hace teclear valores exactos de biomarcadores. El carácter sale del tratamiento.

**Riesgo estético que asumí:** convertir el cromo de navegación en un instrumento
de medida. El riel del encabezado no es una barra de color: sus anchos codifican
el peso de cada bloque en el examen, y más adelante se rellena con el dominio.
Un riel proporcional puede leerse como asimetría accidental si el usuario no
descubre qué significa — de ahí el `aria-label` que lo enuncia y el *eyebrow* de
texto al lado. Se justifica desde el brief porque el trabajo declarado de la app
es «decirle a un entrenador qué sabe, qué no sabe y qué estudiar hoy», y el peso
de examen por bloque es exactamente el dato que ordena esa decisión.

**Pendiente:**
- **Aprobación del usuario de las 7 desviaciones** (D-1 a D-7). Sin ella,
  §11.2 y §11.3 siguen siendo la fuente de verdad y `DISENO.md` no aplica.
- **Ratificación del `software-architect`** y sus ADR: valores de paleta (D-1…D-6),
  Barlow Condensed (§11.2), válvula `data-compacto` del piso táctil de 44px (D-7),
  y tres archivos que amplían la lista cerrada de §10.3 (`riel-bloques.tsx` y
  `app/error.tsx` como cliente; `encabezado.tsx` como servidor).
- **Decidir la línea `manifest:` de la metadata**: §11.2 apunta a
  `/manifest.webmanifest`, que no existe hasta el Paso 18.1 y produce un 404 en
  consola desde el Paso 5.
- **Auditoría del `accessibility-auditor`** después de implementar, sobre los
  números ya calculados en `DISENO.md` §1.3.

---

## [2026-07-30 00:07] · frontend-developer · Paso 5 (layout y navegación)

**Estado:** ✅ Completado · rama `paso-5-layout`, **sin commit** (el usuario revisa el diff)

**Qué construí:**

| Archivo | Server / Client | Qué es |
|---|---|---|
| `src/app/globals.css` | — | Reemplazo completo. §11.3 con D-1…D-6 y D-8 de ADR-009 |
| `src/app/layout.tsx` | Server | §11.2 con Barlow Condensed (D-7) y sin la línea `manifest:` |
| `src/components/layout/shell.tsx` | Server | Armazón: enlace de salto, encabezado, columna, pie, dos barras |
| `src/components/layout/encabezado.tsx` | Server | Identidad + interruptor de tema + riel, pegajoso |
| `src/components/layout/pie.tsx` | Server | §11.7 **literal**, atribución COLEF/COCED |
| `src/components/layout/proveedores.tsx` | Client | `ThemeProvider` + `Toaster` |
| `src/components/layout/riel-bloques.tsx` | Client | Elemento firma, anchos proporcionales a `pesoExamen` |
| `src/components/layout/nav-inferior.tsx` | Client | 5 destinos, `h-16`, hasta `lg` |
| `src/components/layout/barra-lateral.tsx` | Client | Los mismos 5 destinos, 240px, desde `lg` |
| `src/components/layout/interruptor-tema.tsx` | Client | Ciclo sistema → claro → oscuro |
| `src/components/layout/destinos.ts` | data | Los 5 destinos y `destinoActivo`, en un solo lugar |
| `src/app/not-found.tsx` | Server | 404 honesto, con una acción |
| `src/app/error.tsx` | Client | Límite de error (Next lo exige) |
| `src/app/page.tsx` | Server | **Provisional**, solo para verificar el armazón. La portada es del Paso 14.4 |
| `src/lib/utils.ts` | — | `bloqueDeRuta()` y `claseAcentoBloque()`, puras, con 14 tests nuevos |

**Server o Client, y por qué:** todo lo que no necesita `usePathname`, `useTheme`
ni un handler quedó en el servidor — `Shell`, `Encabezado` y `Pie` no envían
JavaScript. Las cuatro piezas cliente son cliente por una sola razón cada una:
las dos barras y el riel leen la ruta con `usePathname`; el interruptor lee y
escribe el tema. Se respetó §10.3 con las tres altas de ADR-009, y `destinos.ts`
se añadió como **data sin `"use client"`**: no lleva hooks, así que se bundlea con
quien lo importa y evita que las dos barras se desincronicen.

**Las cinco compuertas:** `npm run typecheck` 0 errores y cero `any` ·
`npm run lint` limpio · `npm test` **183 pasan** (169 previos + 14 nuevos) ·
`npm run validar` «Todo en orden» · `npm run build` exitoso, `/` y `/_not-found`
estáticas, 103 kB de First Load JS.

**Estado de `npm run dev`:** compila y renderiza sin errores ni advertencias de
consola. Verificado en el puerto 3117 (el 3000 lo ocupa un proceso ajeno en
`/app`, que no se tocó) y dejado cerrado.

**Verificado a 375 px:** sí, con Chromium headless, en claro y en oscuro, y
también a 1280 px. Medido, no estimado:
- Cero desbordamiento horizontal a 375 px (`scrollWidth === clientWidth`).
- Riel: 75.4 · 82.8 · 123.8 · 93.0 px = **375.0 exactos**, o sea 20/22/33/25 %.
  El segmento de C es visiblemente el más ancho porque C es un tercio del examen.
- Destinos de la barra inferior: **75 × 64 px** cada uno.
- El pie termina 31 px por encima de la barra inferior: no queda tapado.
- A 1280 px, el fondo del encabezado (60 px) y el techo de la barra lateral
  coinciden al píxel, y la barra mide 240 px.

**Teclado y aria-live:**
- Orden de tabulación completo y en orden visual: saltar al contenido → identidad
  → tema → contenido → enlaces del pie → barra inferior (en móvil la nav es lo
  último porque visualmente está abajo; desde `lg` la barra lateral va antes del
  contenido, como se ve).
- **Foco visible en los 9 elementos enfocables, en los dos temas**, medido con
  `getComputedStyle`: 2 px sólidos a `--ring` completo (6.37:1 claro · 7.15:1
  oscuro). En la barra inferior el contorno se mete hacia dentro para no
  recortarse contra el borde de la barra fija.
- El destino activo **no se comunica solo por color**: lleva `aria-current="page"`,
  `text-foreground`, peso 600 y la lengüeta de 4 px.
- El riel es `role="img"` con el peso de los cuatro bloques y el bloque activo
  **en palabras**: «Peso de cada bloque en el examen: A 20 %, B 22 %, C 33 %,
  D 25 %. Estás en el bloque C, Ciencias Aplicadas.»
- El interruptor de tema anuncia estado y consecuencia: «Tema sistema. Cambiar a
  tema claro.»
- `aria-live` no aplica en este paso: no hay retroalimentación dinámica. Entra en
  el Paso 9 con `retroalimentacion.tsx`.

**Dos hallazgos medidos que cambiaron el código:**

1. **El foco de shadcn no cumplía 1.4.11.** DISENO.md §1.3 asume que shadcn
   compone «`focus-visible:outline-1 outline-ring` + halo de 3 px a ring/50», con
   el halo como refuerzo y no como portador. La versión instalada **ya no trae
   ese contorno**: sus 18 componentes usan `outline-none` +
   `focus-visible:ring-[3px] ring-ring/50`, así que el único portador queda a
   media opacidad, por debajo del 3:1 exigido. Verificado: el botón del
   interruptor salía con `outline-style: none`.
   Arreglo en `globals.css`, una sola regla, **en `@layer utilities` y con
   selector de elemento + pseudoclase (0,1,1)**: las capas ganan por orden y no
   por especificidad, así que en `@layer base` habría perdido contra el
   `.outline-none` (0,1,0) de shadcn. A igual capa, gana la especificidad. Los
   componentes que sí traen su contorno (`focus-visible:outline-1`, 0,2,0) siguen
   mandando. Beneficio lateral: ningún componente futuro necesita clases de foco.
2. **`text-muted-foreground` sobre `bg-accent` en tema oscuro mide 4.47:1**, corto
   de AA. No está en los 59 pares de DISENO.md §1.3 porque es un par de *estado*,
   no de reposo. Las dos barras suben el texto a `text-foreground` en el mismo
   `hover:bg-accent`, y queda anotado como contrato en `COMPONENTES.md`.

**Verificación independiente de la paleta:** convertí los 33 tokens de los dos
temas de `oklch` a sRGB y calculé WCAG 2.1 sobre 43 pares antes de escribir una
línea de CSS. Los hex coinciden exactamente con DISENO.md §1.1 y §1.2
(`#fbfcfd`, `#141a22`, `#9f6700`, `#966000`, `#0c1117`, `#151b22`…), y **cero
fallos** más allá del par de estado del punto 2.

**Decisiones menores que tomé, todas dentro de lo aprobado:**
- **`--alto-encabezado: 3.75rem`** en `:root`. Es mecánica de layout, no token de
  diseño: la barra lateral necesita saber dónde termina el encabezado pegajoso
  para no quedar tapada. Medido en navegador (60 px), no calculado a ojo — mi
  primera estimación de 61 px estaba mal por 1 px y el navegador lo delató.
- **La escala tipográfica de DISENO.md §2.3 vive en `@layer base`**, no repetida
  en cada componente: se escribe `<h1>` y sale a 1.75rem / 2.25rem en `lg`.
  Consecuencia buscada: una página no puede desalinearse de la escala por olvido.
- **La barra lateral aparece en `lg` y la inferior desaparece en `lg`.** §11.7
  usaba `md:hidden` para el hueco de la nav y §11.5 pone la barra lateral en `lg`:
  con las dos literales, entre `md` y `lg` no habría ninguna navegación. Se unificó
  en `lg`.
- **El encabezado no rotula la sección** (§17 paso 5 decía «barra superior con
  título de sección»): el título de cada pantalla es su `<h1>`, así que la
  jerarquía de encabezados no se duplica ni salta. Queda anotado en
  `COMPONENTES.md` como contrato para las páginas.

**Deuda que dejo:**
- **Cuatro de los cinco destinos apuntan a rutas que aún no existen** (`/modulos`
  Paso 6, `/repaso` Paso 10, `/simulacros` Paso 11, `/ajustes` Paso 18.5) y hoy
  caen en el 404, que está diseñado y dice que el progreso no se tocó. Igual pasa
  con los dos enlaces del pie (`/erratas` es del Paso 7). No es arreglable en este
  paso sin construir rutas de otros pasos.
- **Decisión de diseño pendiente, registrada en `COMPONENTES.md`:** ¿el *eyebrow*
  de texto del bloque va en el encabezado, junto al riel, o en la página? La
  bitácora del `ui-designer` lo menciona «al lado» del riel; DISENO.md §4.3 no lo
  incluye en el componente. Lo dejé como responsabilidad de la página, que es
  donde estará en el Paso 7. Hoy no se nota: ninguna ruta con bloque existe.
- **`transition-all` en las variantes de los 18 componentes de shadcn**, que
  DISENO.md §5.2 prohíbe. No lo toqué: son archivos generados y arreglarlo es un
  barrido de 18 archivos que merece su propia decisión.
- La segunda manifestación del elemento firma (**escala de umbral**, DISENO.md
  §4.4) queda especificada y sin construir, como estaba previsto: Pasos 12 y 14.
- Los 5 SVG de create-next-app siguen en `public/` y ya no los referencia nadie:
  `page.tsx` dejó de usarlos. Anotado en `PENDIENTES.md` → Paso 14.4.

**Lo que este paso cierra de `PENDIENTES.md`:** las cuatro obligaciones del Paso 5
—`@custom-variant dark`, el `lang="es-CO"` con la metadata real, el pie de
atribución en todas las rutas y los componentes de shadcn sin estilo— quedan
cumplidas y marcadas allí.

---

## [2026-07-30 00:29] · accessibility-auditor · Paso 5

**Qué audité:** el armazón completo del Paso 5 sobre `paso-5-layout` — `/` y el 404,
que son las dos únicas rutas que existen. `src/app/{layout,page,not-found,error}.tsx`,
`src/app/globals.css` y los nueve archivos de `src/components/layout/`
(`shell`, `encabezado`, `riel-bloques`, `nav-inferior`, `barra-lateral`,
`interruptor-tema`, `proveedores`, `pie`, `destinos`), más las clases de foco y
piso táctil que los 18 componentes de `src/components/ui/` heredan. No auditué los
cuatro destinos que caen en 404 a propósito, ni ítems, cronómetro, gráficas o
glosario: no existen.

**Cómo lo probé:** contraste con script propio parseando `globals.css` y
convirtiendo `oklch()` → sRGB → WCAG 2.1 (80 pares, los dos temas, incluidos los
estados con alfa `bg-accent/60` y `ring/50`) · Playwright + Chromium headless en
venv del scratchpad, **cero dependencias nuevas en el proyecto** · 375 px y
1280 px · claro y oscuro · zoom simulado a 200 % y 400 % · recorrido completo por
teclado con medición del estado de foco **asentado** (esperando el fin de la
transición) · CDP `CSS.getMatchedStylesForNode` para zanjar la cascada del foco ·
CDP `Accessibility.getFullAXTree` para landmarks y nombres accesibles ·
axe-core 4.x con `wcag2a,wcag2aa,wcag21aa,wcag22aa,best-practice`. `dev` en el
puerto 3117 (el 3000 lo ocupa un proceso ajeno), cerrado al terminar.

**Hallazgos:** Crítico 0 · Serio 1 · Moderado 2 · Menor 3. Detalle completo, con
mediciones y arreglo en código, en `.claude/ACCESIBILIDAD.md`.

- **A-01 · Serio** — 1.4.4 / 2.5.8. A 200 % de zoom en un móvil de 375 px (188 px
  CSS) el quinto destino de la barra inferior queda con **3 px visibles de 44** y
  su centro fuera de pantalla, sin scroll horizontal que lo recupere: `Ajustes`
  deja de ser pulsable. Causa: los `<li className="flex-1">` conservan
  `min-width:auto` y no encogen por debajo de `min-content` («Simulacros» = 63 px).
  Arreglo verificado en navegador (`min-w-0` en el `<li>` + `truncate` con
  `max-[22rem]:sr-only` en la etiqueta): a 188 px pasa a cinco celdas iguales de
  38 px, todas visibles, y el nombre accesible se conserva.
- **A-02 · Moderado** — 3.1.2. La región viva de sonner se anuncia
  **«Notifications alt+T»**, en inglés, dentro de `lang="es-CO"`. Es la región que
  anunciará todos los avisos desde el Paso 9. Arreglo: `containerAriaLabel="Avisos"`
  en `proveedores.tsx`.
- **A-03 · Moderado** — 2.4.1. «Saltar al contenido» no mueve el foco: `<main>` no
  lleva `tabindex="-1"`. Funciona en Chromium (verificado: el `Tab` siguiente
  continúa desde `main` y se salta la barra lateral completa), pero en
  Safari/VoiceOver —el iPhone del Paso 18.10— el punto de partida secuencial no es
  fiable. Arreglo: `tabIndex={-1}` en el `<main>` de `shell.tsx`.
- **A-04 · Menor** — 1.4.11. `focus-visible:-outline-offset-2` mete los 2 px
  superiores del contorno encima de la lengüeta de 4 px del destino activo, y
  `--ring` es el mismo azul que `--primary`: **1.00:1** en ese borde (1.02–1.31:1
  sobre los cuatro colores de bloque). No es fallo AA: los otros tres lados van a
  6.37:1 / 7.15:1 y el foco se lee sin ambigüedad, confirmado por captura.
  Decisión cosmética para `ui-designer`.
- **A-05 · Menor** — 2.5.8 (exento por destino en línea). El enlace de la licencia
  CC BY-NC-SA mide **108 × 15 px**: `min-height` no aplica a cajas `inline`, como
  DISENO.md §3 anticipa. Cumple la norma pero está por debajo del piso propio de
  44 px, y es el enlace que ADR-001 vuelve requisito de licencia. Arreglo:
  `inline-block py-2`.
- **A-06 · Menor (documentación)** — DISENO.md §1.3 afirma que shadcn compone
  `focus-visible:outline-1 outline-ring`. **La versión instalada no lo trae**:
  `button`, `badge`, `switch`, `input`, `select` y `accordion` solo llevan
  `outline-none` + `border-ring` + `ring-ring/50`, y `border-ring` no dibuja nada
  sin clase `border`. Riesgo real de regresión: un agente que lea DISENO.md puede
  creer que la regla de `globals.css` es redundante y borrar con ella el foco de
  toda la app. Corregir el párrafo (tarea de `ui-designer`).

**Bloqueantes:** ninguno. Ningún Crítico. A-01 es el único que impide completar una
acción, y solo bajo zoom al 200 %, con rodeo por el pie y por teclado.

**Contraste:** **todos AA en los dos temas.** Los 23 tokens de `globals.css`
coinciden **hex por hex** con DISENO.md §1.1 y §1.2 en claro y en oscuro: cero
discrepancias. Los mínimos de §1.3 se reproducen exactamente con mi propio cálculo
(`muted-foreground`/`muted` 4.93 · 5.06 — `aviso`/`background` 4.65 —
`bloque-c`/`-suave` 4.64 — `input` 3.03). Las seis correcciones de ADR-009 (D-1
a D-6) hacen lo que dicen. **`--border` por debajo de 3:1 queda confirmado como
exento y no es deuda:** verifiqué en el código que solo dibuja separadores y filos,
y que los bordes que sí identifican un control usan `--input`, que cumple 3:1.
Único par por debajo del umbral: `ring` sobre la lengüeta de color (A-04), que no
es un fallo AA por las razones anotadas.

**Los dos hallazgos que el implementador reportó arreglados: los dos confirmados
de forma independiente.**
1. El foco de shadcn: diagnóstico correcto y arreglo efectivo. CDP demuestra que
   `.outline-none` (0,1,0) y la regla propia (0,1,1) están **en la misma capa
   `utilities`**, donde decide la especificidad, y que el `*{outline-color:ring/50}`
   de `@layer base` pierde por orden de capa. Estado asentado en los 9 enfocables y
   los dos temas: `2px solid` a `--ring` **completo**, 6.37:1 / 7.15:1. Matiz que
   encontré y que no es fallo: `transition-all` anima `outline-color` desde
   `ring/50` durante ~150 ms, así que una medición sin esperar la transición lee el
   contorno a media opacidad. Es argumento adicional para saldar la deuda de
   `transition-all` ya registrada en `COMPONENTES.md`.
2. `text-muted-foreground` sobre `bg-accent`: **4.47:1 en oscuro, cifra exacta**
   (4.72 en claro). Falla AA y las dos barras lo suben a `text-foreground` en el
   mismo `hover`, con lo que pasa a 14.71 / 10.92. Barrí además los otros cinco
   estados de hover y activo del paso: ninguno por debajo de AA.

**En orden y sin necesidad de revisar otra vez:** `lang="es-CO"` · jerarquía de
encabezados sin saltos en las dos rutas · `banner`/`main`/`contentinfo` únicos y
los dos `nav` con nombres distintos · la barra lateral oculta está realmente fuera
del árbol de accesibilidad y del orden de tabulación (**cero enfocables fantasma**,
que es el patrón que el Paso 11 va a necesitar para ocultar el pie) · estado activo
de la nav con `aria-current` + lengüeta + peso, **no solo color** · el riel de
bloques expuesto como `image` con su alternativa textual completa en español ·
`data-compacto` sin usar en ningún elemento · sin scroll horizontal a 200 % ni
400 % · el pie deja 31 px de holgura sobre la barra fija ·
`prefers-reduced-motion` respetado · consola limpia · **axe: 0 violaciones y 0
incompletas en los dos temas** — que no es una aprobación, porque los seis
hallazgos son justamente lo que axe no ve.

**Pendiente:**
- Arreglar A-01, A-02, A-03 y A-05 (`frontend-developer`); decidir A-04 y corregir
  A-06 en DISENO.md (`ui-designer`).
- **`error.tsx` quedó sin verificar en runtime:** en `dev` el overlay de Next
  intercepta el límite de error. Usa el mismo `<Button>` + `<Link>` que el 404, que
  sí quedó verificado, pero hay que ejercitarlo con build de producción en el
  Paso 18.10.
- Cuando exista la primera ruta con bloque (Paso 7), verificar que el *eyebrow* de
  texto acompaña al color del riel: hoy el bloque activo se distingue
  visualmente solo por `opacity-100` frente a `opacity-25`, y la alternativa
  textual vive únicamente en el `aria-label` del riel. Es la decisión que
  `COMPONENTES.md` deja abierta.
- Re-auditar tras los Pasos 9, 11 y 12, como manda el ciclo.

---

## [2026-07-30 01:40] · accessibility-auditor · Paso 5 — reverificación de los arreglos

**Qué audité:** los cuatro arreglos del Paso 5 sobre el armazón —
`src/components/layout/nav-inferior.tsx` (A-01), `proveedores.tsx` (A-02),
`shell.tsx` (A-03), `pie.tsx` (A-05)— más la aceptación documental de A-04
(`DISENO.md` §4.6) y la corrección de A-06 (`DISENO.md` §1.3). Reverifiqué las
rutas `/` y 404, y audité **por código** el componente nuevo
`src/components/layout/rotulo-bloque.tsx`, que implementa la regla §2.4 y que
todavía ninguna ruta consume.

**Cómo lo probé:** Playwright + Chromium headless en el venv aislado del
scratchpad (**cero dependencias nuevas en el proyecto**), `next dev` en el puerto
**3117** — el 3000 lo ocupa un proceso ajeno que no toqué, y dejé el 3117 cerrado
al terminar. Anchos 375, 352, 220, 188 y 94 px, más 640, 320 y 1280; `color-scheme`
claro y oscuro en cada medición. Árbol de accesibilidad con CDP
`Accessibility.getFullAXTree`; cascada CSS con `CSS.getMatchedStylesForNode` y
`forcePseudoState`; axe-core 4.x inyectado desde el scratchpad. Contraste con mi
script propio que parsea `globals.css` y convierte `oklch` → sRGB. Barridos de
`Tab` de 22 pasos dejando **420 ms** tras cada salto para que `transition-all`
asiente el contorno — sin esa espera se lee un falso 3 px a alfa 0.5.

**Hallazgos:** Crítico 0 · Serio 0 · Moderado 0 · Menor 2 (**A-07** y **A-08**,
los dos nacidos de los propios arreglos). Los seis originales quedan cerrados:
A-01, A-02, A-03, A-05 y A-06 arreglados; A-04 aceptado por §4.6.

**Cifras, antes → después:**
- **A-01** · a 188 px (200 % de zoom sobre 375) las celdas pasan de
  31/49/43/63/44 px con `Ajustes` **al 6 % de visibilidad y su centro fuera del
  viewport**, a **cinco celdas iguales de 37,6 px, todas al 100 % y con los cinco
  centros dentro**. A 375 px sin cambio: 5 × 75 px, sin recorte. Nombres
  accesibles idénticos a 375, 188 y 94 px — `sr-only` conserva los cinco.
- **A-02** · nombre de la región viva `"Notifications alt+T"` → **`"Avisos
  alt+T"`**. La palabra inglesa desapareció; el sufijo `alt+T` lo concatena sonner
  y es notación de tecla, no prosa. 3.1.2 satisfecho.
- **A-03** · `document.activeElement` tras el salto: `<body>` → **`MAIN#contenido`**.
  Funciona con teclado y con ratón. El `main` **no** entró en el orden de
  tabulación (22 `Tab`, nunca lo toca).
- **A-04** · sin cambio y sin fallo: lengüeta 4 px en `top-0`, contorno 2 px a
  −2 px de offset, y los tres marcadores redundantes (`aria-current`, peso 600,
  `text-foreground`) intactos. Las tres premisas de §4.6 se sostienen.
- **A-05** · enlace de la licencia **108 × 15 px → 108 × 44 px**, y la holgura
  sobre la barra fija **30,9 px → 31,4 px** sin ningún elemento del pie tapado.

**Bloqueantes:** ninguno.

**Contraste:** todos AA en los dos temas, sin cambios respecto a la auditoría
original (`globals.css` no se tocó). Reconfirmé el par que necesita el componente
nuevo: `text-bloque-{a,b,c,d}` sobre `--background` da 5.16 / 5.73 / **4.85** /
5.04 en claro y 8.68 / 7.30 / 8.02 / 7.57 en oscuro — **el peor caso es C a
4.85:1, exactamente lo que declara `DISENO.md` §1.3**. Los dos pares que siguen por
debajo de 3:1 son los de A-04 (`--ring` sobre `--primary` y sobre los bloques), ya
aceptados y documentados.

**Regresiones buscadas expresamente, y su resultado:**
- Nombre accesible completo cuando la etiqueta pasa a `sr-only` → **sin regresión**.
- `tabIndex={-1}` metiendo el `main` en el orden de tabulación → **no lo metió**.
- `py-2` del pie descuadrando el bloque legal → **sí descuadra**: el párrafo de
  atribución pasa de 97,5 a **122 px** y una caja de línea de 15 a 44 px, así que
  el texto se lee en tres trozos y parte «Idóneo / 2210». Es **A-08**.
- Foco de 2 px vivo en los enfocables → **sin regresión**, y **son 11 por ancho, no
  9**: corrijo mi propio número. 44 medidas (2 anchos × 2 temas × 11), todas
  `2px solid` a `--ring` completo, sin alfa.
- Enfocables fantasma → **ninguno**, recontado. Las celdas de la barra oculta dan
  caja de 0 px porque su ancestro es `display:none`; están fuera del árbol y fuera
  del `Tab`. Un detector por tamaño de caja las marca como falso positivo.

**Lo nuevo que encontré:**
- **A-07 · Menor.** El `focus-visible:outline-none` que el arreglo de A-03 puso en
  el `<main>` **es código muerto**: pierde la cascada. Confirmado con
  `getMatchedStylesForNode` — `.focus-visible\:outline-none:focus-visible` y
  `[tabindex]:focus-visible` están en la misma capa `utilities` con la misma
  especificidad (0,2,0), y el bloque de `globals.css` va después, así que gana. El
  `main` **sí** pinta `2px solid --ring` alrededor de la columna de 375 × 505 px al
  usar el salto. No infringe nada —2.4.7 quiere un indicador visible— pero el
  código afirma hacer algo que no hace.
- **A-08 · Menor.** El descuadre del párrafo legal descrito arriba. Probé cuatro
  variantes y la buena está medida: conservando `display:inline` con `py-3.5` el
  objetivo queda en **108 × 43 px** y el párrafo vuelve **exacto a 97,5 px**,
  porque el padding vertical de una caja `inline` agranda el área de toque sin
  tocar la caja de línea. 43 px superan de sobra el 24 × 24 de 2.5.8 AA.

**axe-core** (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`,
`best-practice`): **0 violaciones y 0 incompletas** en `/` y en el 404, en los dos
temas, 40 reglas pasadas por corrida. Y lo digo otra vez porque esta ronda lo
prueba dos veces: axe dio 0 **antes y después**. No vio ninguno de los seis
hallazgos originales ni ve los dos nuevos.

**Zoom:** sin scroll horizontal a 640 px (1280 al 200 %), a **320 px** (el ancho de
referencia de 1.4.10 para el 400 %) ni a 188 px (375 al 200 %), en los dos temas. A
94 px (375 al 400 %, muy por debajo de lo que exige cualquier criterio AA) sí
desborda, por el botón `shrink-0` del encabezado: anotado, no es hallazgo.

**Pendiente:**
- Decidir **A-07** y **A-08** (`ui-designer`): los dos son Menores y cosméticos, y
  los dos tienen el arreglo medido en `ACCESIBILIDAD.md`. Ninguno bloquea el cierre
  del Paso 5.
- **`RotuloBloque` queda aprobado solo por código.** Reauditarlo en runtime en el
  Paso 7, cuando exista la primera ruta con bloque: comprobar que va encima del
  `<h1>` sin romper la jerarquía y que el rótulo, no el color del riel, es lo que
  comunica el bloque. Esto **cierra** el pendiente que dejé abierto sobre el
  *eyebrow* de texto: §2.4 lo resolvió.
- `error.tsx` sigue sin verificar en runtime — necesita build de producción,
  Paso 18.10.
- Re-auditar tras los Pasos 9, 11 y 12, como manda el ciclo.

## [2026-07-30 01:15] · cierre de los hallazgos de accesibilidad · Paso 5

Los seis hallazgos de la auditoría del Paso 5, más los dos que salieron al reverificar. Ninguno bloqueaba el cierre; los ocho quedan cerrados.

**Arreglados en código** (A-01 a A-03 y A-05 con las soluciones que el propio auditor había verificado antes de proponerlas):

| | Antes | Después |
|---|---|---|
| **A-01** Serio · barra inferior a 200 % de zoom | celdas 31/49/43/63/44 px; **`Ajustes` visible al 6 %**, su centro fuera del viewport y `scrollWidth` intacto, o sea sin scroll con el que recuperarlo | **cinco celdas iguales de 37,6 px**, las cinco al 100 %, los cinco centros dentro. A 375 px sin cambio |
| **A-02** Moderado · región viva en inglés | `"Notifications alt+T"` dentro de `lang="es-CO"` | `"Avisos alt+T"` |
| **A-03** Moderado · el salto no movía el foco | `activeElement` = `<body>` | `MAIN#contenido`, con teclado y con ratón, y **sin** entrar al orden de tabulación |
| **A-05** Menor · enlace de la licencia | 108 × 15 px | 108 × 43 px, con el párrafo legal intacto |

**Resueltos por el `ui-designer` en `DISENO.md`:**

- **§2.4, nueva REGLA DEL SISTEMA — el rótulo de bloque.** Cierra el hueco que el auditor señaló: el riel comunica el bloque **solo por color**, contra §1.2. Toda pantalla con exactamente un bloque en contexto lleva `BLOQUE C · CIENCIAS APLICADAS` encima de su `<h1>`, en el color del bloque. Las dos partes son necesarias: la letra empareja con el color, el título lo hace legible para quien no memorizó las letras. Asignado a la **página** y no al encabezado, porque la página ya resolvió su `Modulo` desde `params` y el encabezado tendría que pasar a cliente para deducir con `usePathname` un dato que la página tiene exacto — y eso habría añadido una cuarta alta a §10.3, que ADR-009 aprobó justo por lo contrario.
- **A-04 aceptado sin cambio de código** (§4.6): la lengüeta se queda en `top-0`. Tres de los cuatro lados del foco van a 6.37/7.15:1, ocurre solo en el destino ya activo y solo con foco, y ahí `aria-current` + peso 600 + `text-foreground` ya lo marcan de forma redundante. Quedaron escritas las tres condiciones que obligan a reabrirlo.
- **A-06, §1.3 reescrito.** Era el hallazgo con más riesgo a futuro: el documento describía un foco de shadcn que no existe, así que un agente podía concluir que la regla de `globals.css` era redundante y **borrar con ella el foco visible de toda la app**. Ahora describe lo instalado y declara que esa regla es el portador único: no se borra, no se mueve a `@layer base`, no se "simplifica". Tres filas nuevas en §5.2 lo blindan.

**Nuevo componente:** `src/components/layout/rotulo-bloque.tsx`, Server Component, implementa §2.4. Al no llevar `"use client"` no añade altas a §10.3. Todavía ninguna ruta lo consume — las rutas con bloque llegan en el Paso 7 —, así que quedó **aprobado solo por código**: es un `<p>` y no un encabezado, sin `aria-hidden`, y las mayúsculas las hace `uppercase` en CSS y no el string, así que el lector recibe «Bloque C · Ciencias Aplicadas» y no lo deletrea. Contraste sobre el fondo: A 5.16/8.68 · B 5.73/7.30 · **C 4.85**/8.02 · D 5.04/7.57 — el peor caso es C a 4.85:1 en claro, exactamente lo que declara §1.3.

**Los dos hallazgos que salieron al reverificar, residuo de mis propios arreglos:**

- **A-07** · el `focus-visible:outline-none` que añadí con A-03 era **código muerto**: misma capa y misma especificidad que la regla de `globals.css`, que va después y gana. El `<main>` sí pinta el contorno al recibir el salto, y eso es deseable (2.4.7) y transitorio. Se borra la clase y se documenta, porque dejar código que afirma hacer algo que no hace es peor que el contorno.
- **A-08** · mi `inline-block py-2` de A-05 sí agrandó el objetivo, pero **infló la caja de línea del párrafo de atribución**: 97,5 → 122 px, partiendo «Idóneo / 2210». Es el párrafo que ADR-001 vuelve requisito de licencia. Arreglo medido entre cuatro variantes: conservar `display: inline` con `py-3.5` → objetivo de 108 × 43 px y párrafo **exacto a 97,5 px**, porque el padding vertical de una caja `inline` no altera la caja de línea. Los 43 px superan el 24×24 de 2.5.8; el piso de 44 de §3 es norma interna, y queda 1 px corto a cambio de que el texto legal se lea de un tirón.

**Dos cosas del método que vale la pena conservar:**

- **axe-core dio 0 violaciones antes y después de los ocho hallazgos.** No vio ninguno. Es la mejor evidencia de por qué el verde automático no aprueba nada.
- El foco tarda ~420 ms en asentarse porque `transition-all` anima `outline-color`: una medición instantánea lo lee a 3 px y alfa 0.5 y parece un fallo que no existe. Queda anotado como método en `ACCESIBILIDAD.md`, y es argumento extra para la deuda de `transition-all` ya registrada.

**Corrección de un número propio del auditor:** los elementos enfocables son **11 por ancho, no 9**. Las 44 medidas (2 anchos × 2 temas × 11) dan `2px solid` a `--ring` completo, sin alfa.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **183 en verde** · `validar` verde · `build` verde.

**Anotado en `PENDIENTES.md` → Paso 18.10:** `src/app/error.tsx` no se ha ejercitado nunca en runtime, porque en `dev` el overlay de Next intercepta el límite de error. Hay que forzar un error con build de producción y comprobar el mensaje, el `reset()` y el foco de los dos botones.

---

## [2026-07-30 02:10] · frontera server/client y fuga de bundle · Paso 5

El usuario reportó que `encabezado.tsx` y `pie.tsx` llevaban `"use client"` y que 9 de 10 componentes del shell eran cliente. **Era un artefacto de medición**: la línea 1 de varios archivos servidor contenía la cadena literal `"use client"` dentro del comentario que decía no usarla, y `grep "use client"` la cuenta como directiva. El reparto real es **6 clientes y 8 servidores**, y `pie.tsx` **es Server Component**, así que **no hay desviación de §11.7 que registrar**.

Pero la pregunta de fondo abrió el hallazgo con más consecuencias del paso.

**1 · La fuga de bundle — ADR-010**

`riel-bloques.tsx` es cliente e importaba `BLOQUES` de `@/content/estructura`. Parecía gratis: son 4 objetos pequeños. **No lo era:** los 29 módulos completos —con `objetivos`, `conceptosClave`, `subtitulo`— viajaban al navegador. Confirmado buscando `"osteomuscular"` en `static/chunks/app/layout-*.js`.

La causa no es obvia: `content/estructura.ts:593` evalúa `MODULOS_POR_SLUG = new Map(MODULOS.map(...))` en el ámbito del módulo, lo que **ancla `MODULOS`** y bloquea el tree-shaking aunque solo se importe `BLOQUES`. `"sideEffects": false` **no lo arregla** (medido: 149.9 → 149.6 kB, ruido).

Arreglo: `Encabezado` (servidor) proyecta `BLOQUES` a `SegmentoRiel[]` —`{ id, peso, titulo }`— y lo pasa por prop. El riel ya no conoce `content/`.

| | `/layout` gz | chunk `app/layout` raw |
|---|---|---|
| Antes | 149.9 kB | 28 100 B |
| **Después** | **144.3 kB** | **8 717 B** (−69 %) |

**Por qué esto importa mucho más de lo que parece hoy:** con 29 módulos y 0 ítems cuesta 5,6 kB. En los pasos 15–17 `content/` llega a ~750 ítems, cada uno con enunciado, opciones, explicación de ≥200 caracteres y pasos. Un solo import descuidado desde un cliente metería el banco entero en el bundle inicial de una app que debe cargar en <3 s en 4G y funcionar offline. **El daño escala con el contenido, no con el código**, así que la regla se fija ahora, cuando cumplirla cuesta un `map` de tres campos.

No contradice la asimetría de §2.2 («el banco es importable desde el cliente»): ahí se busca `import()` **dinámico** bajo interacción, con code splitting real. ADR-010 prohíbe el import **estático** en el grafo del bundle inicial.

**2 · La cifra de peso con la que estábamos razonando era falsa**

El `First Load JS` que imprime `npm run build` **no incluye el chunk del layout raíz**, así que subestima la primera carga en ~30 kB: reportaba **103 kB** cuando la real era **149.9 kB**. La métrica del armazón es el `/layout` gz calculado desde `.next/app-build-manifest.json`. **Referencia: 144.3 kB.** Registrado como contrato en `COMPONENTES.md` para que ningún paso siguiente use los 103 kB.

**3 · La frontera está bien puesta**

Los seis clientes son necesarios, ninguno redundante ni innecesario: `proveedores` (contexto de tema), `interruptor-tema` (`useTheme`, `useState`, `useEffect`, `onClick`), `nav-inferior`, `barra-lateral` y `riel-bloques` (`usePathname`), y `app/error.tsx` (lo exige Next, y recibe `reset`, no serializable). **Cero desvíos** de §10.3 + ADR-009.

Dos cosas que se evaluaron y se descartaron con número:

- **Volver el riel a servidor** recibiendo el bloque por prop, como hace `RotuloBloque`. **No se puede:** `Shell` lo monta en el layout raíz, y **el layout raíz no recibe los `params` de las rutas hijas**. §2.4 funciona para el rótulo porque lo pone la *página*, que sí los tiene. La salida con `data-bloque` + CSS `:has()` acopla el riel a un atributo que 19 rutas deben recordar poner, y vale 1,9 kB. Descartada.
- **Aislar la parte dependiente de la ruta en las dos barras.** El ahorro tras arreglar el import es ~1,9 kB gz para las dos juntas, y no es limpiamente aislable: `aria-current` y la clase del activo van en el **mismo** `<Link>` que el marcado, así que habría que envolver cada uno de los 5 destinos en un cliente — más JS, no menos. Además `next/link` ya monta el runtime del router, así que `usePathname` solo lee un contexto que ya existe.

**4 · El comentario que causó el error, reescrito**

`SIN "use client"` → `sin directiva de cliente` en 8 archivos (los 5 del shell más `tipos.ts`, `esquemas.ts` y `destinos.ts`). Verificado: **ningún comentario fuera de `src/components/ui/` contiene ya la cadena**, así que una auditoría futura no puede volver a contar mal. La forma correcta de medir quedó documentada en `COMPONENTES.md`:

```bash
grep -rlE "^\s*['\"]use client['\"];?\s*$" src/
```

**5 · El contrato del Paso 11 para el pie, especificado sin construirlo**

El contrato que tenía `COMPONENTES.md` era **inviable**: decía ocultar el pie con `hidden` desde `Shell`, que es servidor y no puede leer `localStorage`. El correcto es un envoltorio cliente que reciba el pie como `children` — `<OcultaEnSimulacro><Pie /></OcultaEnSimulacro>` —, con lo que `Pie` se renderiza en el servidor y viaja como payload RSC: **el componente que lleva la atribución de ADR-001 nunca entra al bundle cliente**. Descartado mutar `document.body.dataset` (exige limpieza al desmontar y se rompe en silencio si dos componentes compiten por el atributo) y descartado volver `Pie` cliente. Especificado en `COMPONENTES.md`, **no construido**: es del Paso 11 y suma una alta a §10.3.

**6 · Correcciones documentales**

`COMPONENTES.md`: fila de `RotuloBloque` añadida · sección «Decisión de diseño pendiente» reemplazada por «Decisiones ya cerradas», porque §2.4 la resolvió · el bullet del rótulo pasa a regla del sistema · contrato del pie reescrito · dos contratos nuevos (ADR-010 y la métrica de peso) · nota de que `bloqueDeRuta` es la única vía de conocer el bloque en el encabezado.

**Enmienda contable a ADR-009:** decía «tres altas» a §10.3. Son **dos** (`riel-bloques.tsx`, `app/error.tsx`); lo de `encabezado.tsx` fue aclarar que es servidor, y §10.3 lista los archivos que **sí** llevan la directiva. No cambia ninguna decisión.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **183 en verde** · `validar` verde · `build` verde · `/layout` **144.3 kB gz** · `grep` de contenido en el chunk del layout: limpio.

---

## [2026-07-30 02:35] · aclaración de la métrica de peso · Paso 5

El usuario detectó una inconsistencia real: el diagnóstico reportó **134.4 kB** de `/layout` gz y la remedición **149.9 → 144.3 kB**. El delta (~5,6 kB) y el −69 % del chunk eran consistentes, la cifra base no.

**Causa, encontrada midiendo:** ninguna de las dos cifras fijaba su método, y el número esconde dos decisiones.

| Decisión | Efecto |
|---|---|
| ¿solo `.js`, o también el `.css`? | el CSS son **12.3 kB** de los 144.3 |
| ¿gzip por archivo y sumado, o gzip de la concatenación? | concatenar comprime ~2 % mejor y **subestima** — el navegador descarga los archivos por separado |

Mi script no filtraba por extensión, así que contaba 9 archivos (8 js + 1 css) = 144.3 kB. El diagnóstico contaba solo js, ~132–134 kB. Las dos estaban "bien"; medían cosas distintas.

**Métrica oficial fijada:** `/layout`, **solo `.js`**, **gzip por archivo y sumado** — lo que de verdad viaja por la red. El CSS se reporta aparte.

| | gz |
|---|---|
| **`/layout` js — OFICIAL** | **132.0 kB** |
| `/layout` css | 12.3 kB |
| `/layout` total | 144.3 kB |
| chunk `app/layout` | 3.2 kB (8 717 B raw) |

`COMPONENTES.md` queda con **la cifra y el comando exacto que la produce**, en una sola línea copiable, con la salida esperada para que la comparación sea válida. ADR-010 queda con las cifras **etiquetadas por alcance** y una advertencia: el valor «antes» de la columna js es **derivado, no medido** —solo se midió el total antes del arreglo, y recomputarlo exigiría revertir el cambio—, así que **la evidencia dura del arreglo es el chunk `app/layout`, medido en las dos corridas: 28 100 → 8 717 B raw.**

Registrado también que la comprobación preferida **no es la cifra sino el `grep`** de una cadena de contenido en el chunk del layout: es binaria y no depende del método de medición.

Sin cambios de código. Compuertas sin tocar: `typecheck` 0 · `lint` limpio · `test` 183 · `validar` verde · `build` verde.

---

## Paso 6 — Datos de bloques y módulos — 2026-07-30

**Estado:** ⚠️ Completado con ajustes

**Corrección de premisa al empezar.** El paso se planteó como «solo rutas, los datos ya están». No era así: `content/estructura.ts` sí existía desde el Paso 3 (ADR-004), pero los otros cuatro `content/*.ts` seguían siendo cascarones de 11 a 28 líneas. `PENDIENTES.md` → Paso 6 lo tenía bien registrado: a este paso le correspondían §9.2–§9.5 **y** las rutas. Se hicieron las dos cosas, en paralelo y sobre archivos disjuntos.

**Datos transcritos** (`technical-writer`), copia literal de `CLAUDE.md`:

| Archivo | Sección | Contenido |
|---|---|---|
| `content/blueprint-examen.ts` | §9.2 | 6 blueprints (`diagnostico`, `final`, `bloque-A`…`D`) + 3 fábricas |
| `content/erratas.ts` | §9.3 | **14** entradas: `X-01`…`X-03` y `E-01`…`E-11` |
| `content/datos-duros.ts` | §9.4 | **70** entradas en 10 categorías, 7 con `contradiccion` |
| `content/glosario.ts` | §9.5 | **22** términos, 8 con sinónimos |

Fidelidad verificada de forma mecánica: extrajo los cuatro bloques `ts` del blueprint y los comparó línea a línea contra el repo — **idénticos**. Sumas cruzadas confirmadas: los 6 blueprints cumplen `reparto == porNivel == totalItems`, `FINAL` también `porTipo == 100`, y su reparto por bloque da A 20 · B 22 · C 33 · D 25, coherente con los `pesoExamen`.

**Rutas construidas** (`frontend-developer`), tres componentes **todos Server, cero altas a §10.3**:

- `/modulos` — los 29 módulos agrupados por bloque, con su color y las 29 insignias «En preparación».
- `/bloques/A|B|C|D` — prerenderizadas (`● SSG`, 4/4), con `RotuloBloque` cumpliendo §2.4, la descripción del bloque, su meta y sus módulos en orden.
- `src/components/modulo/{tarjeta-modulo,lista-modulos,meta-bloque}.tsx`.

`/bloques/c` en minúscula resuelve al bloque C, para que la página y `bloqueDeRuta` del riel no se contradigan; `/bloques/Z` da 404 vía `notFound()`.

**Validador: 87 avisos, 0 errores** — exactamente lo que `PENDIENTES.md` anticipaba. 28 de `blueprint/final` + 29 de los cuatro `bloque-*` («necesita N ítems y hay 0») + 29 de «en preparación, sin banco todavía». Los avisos no rompen el build; es el estado correcto con el banco vacío.

**Peso.** `/layout · js 132.0 kB gz` — **el armazón no se movió ni un byte**, porque las dos rutas son Server Components puros. Los 0.2 kB de más son CSS de utilidades nuevas. ADR-010 limpio: `grep -rl "osteomuscular\|conceptosClave" .next/static/chunks/` no encuentra nada en **ningún** chunk, y siguen siendo los mismos 6 clientes.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **183 en verde** · `validar` exit 0 · `build` verde.

---

### Hallazgo de peso: `Badge` y `Button` cuestan 77.5 kB gz

Lo encontró el `frontend-developer` y lo verifiqué de forma independiente. `src/components/ui/badge.tsx` y `button.tsx` hacen `import { Slot } from "radix-ui"` — **el paquete paraguas** —, y como `Slot` es cliente, el barrel completo entra al bundle de la ruta.

Medido por diferencia de chunks entre rutas:

| Ruta | js gz | chunks |
|---|---|---|
| `/modulos` (marcado propio, sin `Badge`) | **106.2 kB** | 6 |
| `/not-found` (un `<Button asChild>`) | **183.8 kB** | 7 |

El chunk extra es uno solo: `static/chunks/470-*.js`, **77.5 kB gz**, y contiene `Slot`, `Presence`, `DismissableLayer` y `FocusScope`. Una página 404 paga la maquinaria de diálogos y popovers de Radix por un botón.

**Por qué el `grep` de ADR-010 no lo ve:** no es `content/`. Son dos fugas distintas con la misma forma —un import que parece gratis y arrastra un grafo— y la de hoy es **14 veces más grande** que la que motivó ADR-010.

**El arreglo es de dos líneas y la dependencia ya está instalada:** `@radix-ui/react-slot@1.3.3` existe en `node_modules` como transitiva. Bastaría cambiar en `badge.tsx` y `button.tsx`:

```
- import { Slot } from "radix-ui"
+ import { Slot } from "@radix-ui/react-slot"
```

y declarar `@radix-ui/react-slot` en `dependencies` para no depender de una transitiva.

**No se aplicó:** está fuera del Paso 6, toca archivos generados por el CLI de shadcn, y los otros 8 componentes de `ui/` importan el mismo barrel para primitivas que **sí** usan de verdad (`Dialog`, `Select`, `Tabs`, `Tooltip`, `Switch`, `ScrollArea`, `Label`, `Accordion`), así que conviene decidir el criterio completo de una vez y no archivo por archivo. Queda como deuda con dueño: **decidir en el Paso 9 o el 11**, que es cuando entran `Dialog` (reanudar sesión) y `Tabs` (`/herramientas`) y el reparto de chunks cambia de todos modos.

**Un falso positivo anticipado para el `accessibility-auditor`:** `getBoundingClientRect()` sobre los `<a>` de título de las fichas devuelve 22 px de alto. No es un objetivo pequeño — el enlace se estira con `after:absolute inset-0` y esa caja no cuenta en el rect. El `frontend-developer` lo comprobó con `elementFromPoint` en las cuatro esquinas y el centro, y con un clic real. Queda anotado en `COMPONENTES.md`.

**Pendiente que no se corrigió, a propósito** (lo levantó el `technical-writer` durante la transcripción y no es transcripción arreglarlo): **`X-03` está tipada como `'contradiccion'` pero su propio `loCorrecto` dice «No hay conflicto: 2–3 s es correcto»**. Es una nota de desambiguación frente a `X-02`. Como `<AlertaContradiccion>` (§12.4) elige el rótulo según `errata.tipo`, en `/erratas` va a aparecer bajo «Las cartillas se contradicen», que es lo contrario de lo que dice su texto. Decidir antes del Paso 7, que es donde nace `/erratas`.

---

## [2026-07-30 04:05] · vigilancia de peso por ruta y reclasificación de X-03 · Paso 6

**1 · La vigilancia por carpeta tenía un punto ciego, y ya hay una fuga que lo demuestra**

El `grep` de ADR-010 solo mira `content/`. No detecta ninguna otra fuga con la misma forma —un import que parece gratis y arrastra un grafo—, y el barrel de `radix-ui` es **14 veces más grande** que la que motivó ese ADR. Así que la vigilancia pasa de ser por carpeta a ser **por desproporción**.

`COMPONENTES.md` gana una **segunda métrica obligatoria**: el **js gz por ruta**, con su comando exacto, la línea base del 2026-07-30 y una referencia por tipo de ruta — **servidor puro ≈ 103–107 kB gz** es el piso (React + runtime del router + CSS compartido). Más el comando de diagnóstico por diferencia de chunks contra una ruta sana, para localizar el culpable sin adivinar.

**La regla:** si una ruta nueva supera la línea base de su tipo y no hay explicación escrita, **se investiga antes de cerrar el paso**. Un salto de +20 kB gz sobre el piso no es «así es Next»: es un import que arrastró algo. Y queda advertido que los 183.8 kB de `/not-found` **no son licencia ni referencia**, son el caso patológico.

**ADR-011** registra el hallazgo del barrel: la medición por diferencia de chunks, la causa (`import { Slot } from "radix-ui"` en `badge.tsx` y `button.tsx`, con `Slot` cliente, mete `Presence`, `DismissableLayer` y `FocusScope` en la ruta), y el **criterio completo pendiente** planteado como tres preguntas concretas — los diez componentes o solo los dos; ~10 dependencias granulares nuevas o no; y **cómo se evita la regresión cuando el Paso 9 corra `npx shadcn@2 add` y vuelva a escribir `from "radix-ui"`**. Esa tercera es la que decide si el arreglo aguanta. Arreglo asignado al Paso 9 u 11, cuando entren `Dialog` y `ScrollArea` y el reparto de chunks cambie igual. Descartado por escrito adoptar `optimizePackageImports` a ciegas: si se evalúa, se mide.

**2 · X-03 reclasificada — ADR-012**

`X-03` estaba tipada `'contradiccion'` mientras su propio `loCorrecto` dice «No hay conflicto». Como `<AlertaContradiccion>` (§12.4) elige el rótulo con un ternario binario sobre `tipo`, habría aparecido bajo «Las cartillas se contradicen».

El `software-architect` midió primero, como se le pidió: **13 de las 14 entradas están bien clasificadas** — X-01 y X-02 son contradicciones reales, y las once `E-*` son erratas verificables (contenido falso, tablas mal armadas, tipografía). X-03 es la única desalineada.

Esa cuenta decidió **una** cosa y no la otra: descarta rediseñar la taxonomía —nada de jerarquías ni de un campo `severidad`—, pero no obliga a que la única entrada desalineada lleve un rótulo falso. Decisión: **tercer valor `'aclaracion'`** en `TipoErrata`, con el id `X-03` intacto.

El argumento que me convence: un cuadro titulado «Errata de la cartilla» sobre un texto que dice «no hay conflicto» **se contradice dentro del mismo cuadro**, y lo hace en el registro de erratas, que §1 llama el activo defendible del producto. Un usuario que ve que la app clasifica mal deja de creerle cuando le dice qué responder — y ahí se juegan las 3–5 preguntas que separan pasar de no pasar.

El precio es dos líneas, y **hoy es el más bajo que va a ser nunca**: los dos consumidores que tendrían que aprender el tercer rótulo (`<AlertaContradiccion>` y `/erratas`) **no existen todavía**. Radio de explosión en persistencia: **cero** — `Errata` es contenido, no `EstadoProgreso`, así que no hay versión de esquema que subir ni migración. Y `contradiccion` en `ItemBase` y en `DatoDuro` guarda **un id, no un tipo**: `DD-001 → X-03` sigue resolviendo.

**Es la primera desviación de §4**, que hasta hoy era el único archivo byte-idéntico al blueprint.

Descartadas: `tipo: 'errata'` (cambia un rótulo falso por otro menos falso — barato en código, caro donde importa); reescribir el texto de X-03 para que `'errata'` cuadre (doblar el contenido para que quepa en el esquema); y plegarla en un `<Ojo>` de C1 —la alternativa seria, porque `<Ojo>` es el mecanismo que el blueprint ya tiene para «no es error pero se confunde»—, que se cae porque `DD-001` la referencia y el validador rompe ante referencia colgada, porque el dato perdería su ícono en `/ultima-noche`, y porque la teoría de C1 no existe hasta el Paso 16.

**Archivos:** `src/lib/tipos.ts`, `src/lib/esquemas.ts`, `content/erratas.ts`, `src/lib/__tests__/esquemas.test.ts` (+4 tests), `.claude/ARQUITECTURA.md` (ADR-012).

**El test que importa es un pin de regresión:** §9.3 del blueprint sigue diciendo `'contradiccion'`, así que sin el pin una recopia literal revierte esto **en silencio**. Falla si X-03 vuelve a `'contradiccion'`.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **187 en verde** (183 → 187) · `validar` 87 avisos, 0 errores, 14 erratas · `build` verde. Peso sin cambios: `/layout` **132.0 kB js gz**, y las dos rutas nuevas en 106.2.

**Pendiente de autorización del usuario: cuatro puntos del blueprint quedan desalineados** y no se editó `CLAUDE.md`. §4 (`TipoErrata`), §5 (`esqErrata.tipo`), §9.3 (el `tipo` de X-03) y **§12.4 (el ternario binario de `<AlertaContradiccion>`)**. El criterio de las enmiendas de ADR-006 y ADR-007 aplica de lleno: la instrucción literal está en el camino de ejecución del Paso 7 y no deja rastro que apunte al ADR. **§12.4 es el punto crítico** — copiarla literal reintroduce el rótulo falso sin que nada falle.

**Lo que hereda el Paso 7:** §12.4 no se copia literal (tres ramas, y para `'aclaracion'` el rótulo es «Aclaración: no es un error»); el tratamiento visual **no puede ser el destructivo**, porque `border-destructive` codifica «algo está mal» y aquí no lo hay — el token coherente es `aviso`, el que ya usa `<Ojo>`; `/erratas` agrupa por tres tipos y conserva el ancla `id="X-03"`, porque `DD-001` llega por ahí.

---

## [2026-07-30 12:05] · accessibility-auditor · Paso 7 — Renderizado MDX

**Qué audité:** `/modulos/[slug]` (estado vacío y con teoría MDX real) y `/erratas` (14 fichas, 3 grupos de ADR-012, 14 anclas), en la rama `paso-7-mdx`. Los siete componentes nuevos —`renderizador`, `componentes`, `dato`, `formula`, `tabla-clave`, `ojo`, `alerta-contradiccion`— y la clase `.prose-idoneo` de `globals.css`. Sin comitear y con el árbol devuelto tal cual estaba.

**Cómo lo probé:** los 29 módulos están en preparación, así que monté un `content/teoria/c5-umbrales-zonas.mdx` **temporal** con los cinco componentes, tres `<Ojo>`, una alerta de cada uno de los tres tipos (`E-09` · `X-02` · `X-03`), dos tablas dentro de `<TablaClave>` y una suelta, listas, `code` y enlaces en prosa. **Borrado al terminar: `content/teoria/` vuelve a tener solo su `.gitkeep`.** Servidor en el **3117** (el 3000 lo ocupa un proceso ajeno; ni lo toqué), cerrado al acabar y sin dejar logs en el proyecto. Playwright + Chromium en un venv del scratchpad: **cero dependencias nuevas en el proyecto**.

axe-core 4.x en 6 corridas (3 rutas × 2 temas, 49/44/42 reglas pasadas) · **126 pares de contraste** medidos sobre el DOM renderizado, no sobre el CSS leído a mano —con lectura de píxel en canvas, porque Chromium devuelve `oklch()` sin resolver y un parser de `rgb()` revienta ahí— · barrido de **23 `Tab`** con **espera de 460 ms por parada**, por encima del umbral de ~420 ms del `transition-all` que ya quedó anotado en el Paso 5 · árbol de accesibilidad por CDP · anchos 1440 · 1280 · 1024 · 834 · 768 · 640 · 414 · **375** · **320** (referencia de 1.4.10 para el 400 %) · **187** (375 al 200 %) · `prefers-reduced-motion` · longitud de línea con rectángulos reales de `Range` y ancho de carácter medido con `canvas.measureText`.

**Hallazgos:** Crítico 0 · Serio 0 · **Moderado 2** (A-10, A-11) · **Menor 6** (A-09, A-12, A-13, A-14, A-15, A-16).

**Bloqueantes:** ninguno. El paso se puede cerrar; los dos Moderados son de calidad de lectura y de anuncio, no impiden ningún flujo.

**Contraste:** **todos AA en los dos temas.** Confirmo `DISENO.md` §6, no lo refuto: los 16 pares de §6.6 remedidos en navegador coinciden dentro de **±0,10** y dan 0 fallos. El peor par de texto es el `<dt>` a **4.71** (§6.6 decía 4.71 exacto) y el peor de objeto gráfico es el icono `aviso` a **4.05** sobre un umbral de 3.0 (§6.6 decía 4.09). La decisión de §6.3 se sostiene con mi número: en `text-aviso` ese rótulo mediría 4.05 y fallaría; en `foreground` mide 14.91. También cierro el «reauditar en runtime en el Paso 7» de `RotuloBloque`: los 4 bloques × 2 temas, peor caso **C 4.84 claro** frente a los 4.85 que el Paso 5 había predicho por código.

**Lo que respondo a las dos preguntas abiertas del implementador.** (1) La tabla que desliza sin señal **sí es hallazgo, Moderado**: a 375 px oculta **177 px, el 34 % de la tabla**, la quinta columna entera es invisible y la cuarta se corta a mitad de dato —se lee «95 % / 5» donde el valor es «95 % / 5 %»—, con **cero** afordancia: barra superpuesta de 0 px, sin `::after`, sin `box-shadow`, sin `mask-image`. No falla ningún criterio (1.4.10 exime a las tablas de datos) y lo digo así de claro; el arreglo es un degradado con `background-attachment: local` en `globals.css`, sin JS. El `tabIndex={0}` **es correcto y hay que conservarlo**, no es trampa de foco —`Tab` sale, `Shift+Tab` vuelve, las flechas desplazan (`scrollLeft` 80 tras dos `ArrowRight`)— pero el contenedor **no tiene nombre ni rol** (A-10, 4.1.2): se arregla con `role="group"` y un `aria-label`, y **no** con `role="region"`, que volvería a llenar la lista de landmarks. (2) Los nombres accesibles: **0 ids duplicados** con tres alertas y tres `<Ojo>` en el mismo módulo, y ningún `<aside>` anónimo — las tres alertas salen con nombre propio. Pero el `aria-label` fijo del `<Ojo>` produce **tres landmarks `complementary` idénticos** (A-09, la única violación de axe del paso). El fondo es que ninguno de los dos recuadros es contenido complementario: son apartes dentro del hilo de lectura, y `role="note"` en los dos los saca de la lista de landmarks conservando el nombre.

**Sobre la longitud de línea, que es lo que pediste con números.** Confirmo al `frontend-developer` y confirmo su diagnóstico de origen: **42,2 caracteres a 375 px** (correcto, y es donde se lee esta app) y **88,5 desde 768 px**, con la línea más larga en 87,7. Viene de `max-w-3xl` del `Shell` con el cuerpo a 17 px, no del Paso 7. **Es hallazgo real y es Menor**: 1.4.8 pide ≤80 y es **AAA**, no AA, y el contexto declarado del producto es el móvil de una mano. El interlineado de 1.65 **compensa a medias y hay que decir en qué**: reduce el error de retorno de línea, no la distancia de barrido, que es justo lo que cansa a los 88 caracteres. **Trampa medida que hay que darle al `ui-designer` antes de que la pise:** `max-w-[65ch]` no arregla nada aquí, porque `font-variant-numeric: tabular-nums` ensancha el «0» de Inter a **11 px** y `65ch = 715 px ≈ 88 caracteres` — casi los 720 de ahora. Hay que capar en px o rem: **640 px → 78,7 · 608 px → 74,8 · 600 px → 73,8**. Propuesta concreta: capar solo `p, ul, ol, h2, h3` de `.prose-idoneo` a `38rem` y dejar tablas, fórmulas y recuadros a 720 px. A 375 px no cambia nada.

**Lo que quedó bien y hay que conservar:** la jerarquía de encabezados es correcta en las dos rutas —sin saltos y con un solo `h1`—, y la decisión de que el MDX empiece en `##` con `RotuloBloque` como `<p>` es lo que la sostiene. El envoltorio de tabla cumple su razón de ser: **no hay scroll horizontal a 375, 320 ni 187 px** aunque la tabla mida 518 px en un hueco de 341. Las anclas de `/erratas` funcionan en carga directa y desde la teoría, el `scroll-margin-top` de 76 px atado a `--alto-encabezado` impide que el encabezado pegajoso tape la ficha, y **el foco no se pierde**: tras el salto, el primer `Tab` cae dentro de la ficha de destino. `prefers-reduced-motion` deja 0 elementos animados. Los 23 enfocables salen con foco de 2 px sólido a `--ring` completo. Y la `min-height: 44px` de `@layer base` no deforma los enlaces en línea de la teoría porque no aplica a cajas `inline`: la válvula funciona exactamente como se diseñó.

**Pendiente:** A-09 a A-13 son del `frontend-developer` (cinco arreglos, ninguno pasa de unas líneas). A-14 queda **aceptado y documentado**, no se arregla: saber si una tabla desborda exige medirla en el navegador y no vale convertir un Server Component en cliente por dos paradas de tabulación; anotado que Chromium ≥127 ya hace enfocables los contenedores desplazables y que el `tabIndex` explícito seguirá haciendo falta solo mientras Firefox y Safari no lo hagan. **A-15 y A-16 son del `ui-designer`** y van a `DISENO.md`: no toco la escala tipográfica ni el ancho de columna por mi cuenta. Queda anotado como observación heredada que el pie de atribución va a **12 px**, por debajo del listón de 13 —es del Paso 5, y si se toca la escala por A-16 es el mismo movimiento—. Reauditar `/modulos/[slug]` con teoría **de verdad** cuando el Paso 8 publique C5.

---

## Paso 7 — Renderizado MDX — 2026-07-30

**Estado:** ⚠️ Completado con ajustes · auditoría **APROBADO con reservas**

**Qué se construyó**

`src/lib/contenido.ts` (§9.7, `server-only`) · los siete componentes de `src/components/mdx/` · `.prose-idoneo` en `globals.css` · `src/app/modulos/[slug]/page.tsx` (29 prerenderizados) · `src/app/erratas/page.tsx` (las 14 entradas agrupadas en los tres tipos de ADR-012).

**Decisión de diseño previa — `DISENO.md` §6.** El `ui-designer` fijó los tokens de `<AlertaContradiccion>` para los tres tipos, y encontró lo que reordenó el diseño: **`text-aviso` sobre `bg-aviso/10` mide 4.09:1 y falla AA**, y no se arregla bajando el alfa porque D-1 ya dejó `--aviso` en 4.65:1, el mínimo viable. Salida: **el rótulo va en `foreground` en los tres tipos** y el color queda en el icono (umbral 3:1) y el marco. El `<dt>` de 11 px a 4.71:1 es lo que **fija el fondo en 10 % y prohíbe subirlo** — a `/12` cae a 4.57 y a `/15` rompe.

Compartir `aviso` con `<Ojo>` se aceptó como virtud, con una condición elevada a regla dura: **`AlertaContradiccion` lleva marco completo y nunca barra lateral; `<Ojo>` lleva barra lateral y nunca marco.** La forma carga la diferencia, el color carga la semántica. Y `contradiccion` y `errata` siguen compartiendo `destructive` porque no queda token honesto para el tercero: la diferencia la cargan el rótulo y el icono — `Scale` («dos versiones que se sopesan») frente a `CircleX` («esto es falso»).

De paso se corrigieron tamaños del blueprint fuera de la escala de §2.3: el rótulo de §12.4 y el título de `<TablaClave>` usaban `font-titulo text-sm`, o sea **Barlow Condensed a 14 px, que viola la regla dura 1** (la condensada nunca baja de 18 px).

**Peso** — ninguna sorpresa, y el paso **no añadió ni un Client Component** (siguen 6, coincidiendo con §10.3 + ADR-009):

| | gz |
|---|---|
| `/layout` js — métrica oficial | **132.0 kB**, idéntico al Paso 6 |
| `/layout` css | 12.5 → **13.0 kB** (`.prose-idoneo`) |
| `/erratas/page` | **106.9 kB** |
| `/modulos/[slug]/page` | **106.9 kB** |

Las dos rutas nuevas caen en el piso de servidor puro (103–107). `grep` de ADR-010 limpio, y tampoco se filtró contenido de erratas al cliente.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **187** · `validar` 87 avisos, 0 errores · `build` 40 páginas estáticas.

**Verificación del pipeline MDX.** Ninguna teoría existe hasta el Paso 8, así que se comprobó con un `.mdx` temporal que ejercitó los cinco componentes, `##`/`###`, listas, tabla dentro de `<TablaClave>` y tabla suelta, más los tres tipos de alerta contra §6, en claro y oscuro. Borrado después; `content/teoria/` volvió a quedar con solo su `.gitkeep`.

---

### Auditoría: 0 críticos · 0 serios · 2 moderados · 6 menores

El auditor **confirmó §6 con sus propios números**, dentro de ±0,10 en los 16 pares: peor par de texto el `<dt>` a **4.71**, peor gráfico el icono `aviso` a **4.05** sobre umbral 3.0. Y validó la decisión de §6.3 midiendo la alternativa: ese rótulo en `text-aviso` daría **4.05 y fallaría**; en `foreground` da **14.91**. También cerró el «reauditar en runtime» que quedaba de `RotuloBloque`: peor caso **C 4.84 en claro**, contra los 4.85 predichos por código.

**Los dos moderados**

- **A-11 · la tabla desliza sin señal visual.** A 375 px oculta **177 px, el 34 % de la tabla**: la quinta columna entera invisible y la cuarta cortada a mitad de dato — en pantalla se lee **«95 % / 5»** donde el valor real es «95 % / 5 %». Afordancia medida en cero: sin barra, sin `::after`, sin `box-shadow`, sin `mask-image`. **No incumple ningún criterio** —1.4.10 exime a las tablas de datos— y el auditor lo dice así; es **comprensión sobre el dato que el examen pregunta con número exacto**, que es peor. Arreglo: degradado con `background-attachment: local`, sin JS.
- **A-10 · el contenedor deslizable no tiene nombre ni rol.** `aria-label`, `role`, `aria-labelledby` y `title` los cuatro `null`; `generic` en el árbol. Arreglo: `role="group"` + `aria-label`. **No `role="region"`**, que volvería a llenar la lista de landmarks.

El `tabIndex={0}` **se conserva y no es trampa**: `Tab` sale, `Shift+Tab` vuelve, las flechas desplazan.

**Los menores**

- **A-09**, la única violación de axe del paso: el `aria-label` fijo del `<Ojo>` produce **tres landmarks `complementary` idénticos**. El fondo es que ninguno de los dos recuadros es contenido complementario — son apartes en el hilo de lectura. `role="note"` en los dos los saca de la lista conservando el nombre.
- **A-12** · `<th>` sin `scope="col"`. Y sin `rowheader`, «95 % / 5 %» llega con su columna pero sin decir de qué zona es; el `rowheader` es limitación real de GFM y el auditor propone aceptarlo documentado.
- **A-13** · tres enlaces «Ver todas las erratas» con nombre idéntico y tres destinos. Cumple 2.4.4 en contexto, falla en la lista de enlaces. Un `sr-only` lo cierra.
- **A-14** · aceptado sin arreglo: no vale convertir un Server Component en cliente por dos paradas de scroll.
- **A-16** · el `<dt>` a 11 px en versalitas, 42 instancias en `/erratas`, con el contraste más justo de la paleta. Decide el `ui-designer`.
- **Longitud de línea** · **42,2 cpl a 375 px** (correcto) y **88,5 desde 768 px**. Hallazgo real pero **menor**: 1.4.8 pide ≤80 y es **AAA**. El interlineado de 1.65 compensa **a medias** — reduce el error de retorno de línea, no la distancia de barrido, que es lo que cansa a 88. No lo introdujo este paso: sale de `max-w-3xl` del `Shell` (Paso 5).

**Trampa medida, que hay que darle al `ui-designer` antes de que la pise:** `max-w-[65ch]` **no arregla nada**, porque `tabular-nums` ensancha el «0» de Inter a 11 px y `65ch = 715 px ≈ 88 cpl`, casi los 720 de ahora. Hay que capar en px/rem: **640 → 78,7 · 608 → 74,8 · 600 → 73,8**. Propuesta del auditor: capar solo `p, ul, ol, h2, h3` de `.prose-idoneo` a `38rem`, dejando las tablas al ancho completo. A 375 px no cambia nada.

**Lo que quedó bien y hay que conservar:** jerarquía **sin saltos y con un solo `h1`** en las dos rutas — lo sostiene que el MDX empiece en `##` y que `RotuloBloque` sea un `<p>` —; **sin scroll horizontal a 375, 320 ni 187 px** aunque la tabla mida 518 en un hueco de 341; las anclas de `/erratas` funcionan en carga directa y desde la teoría, con `scroll-margin-top` atado a `--alto-encabezado` para que el encabezado no tape la ficha, y **el foco no se pierde**: el primer `Tab` cae dentro de la ficha de destino.

**Observación heredada del Paso 5:** el pie de atribución va a **12 px**, bajo el listón de 13. Si se toca la escala por A-16, es el mismo movimiento.

---

## [2026-07-30 12:15] · accessibility-auditor · Paso 7 — reverificación de los nueve cambios

**Qué audité:** los cinco arreglos de accesibilidad del Paso 7 (A-09 `role="note"` · A-10 `role="group"` + nombre · A-11 degradado de borde · A-12 `scope="col"` · A-13 sufijo `sr-only`) y los cuatro cambios de diseño de `DISENO.md` §2.5 y §3.1 (medida de lectura de 38rem · `<dt>` a 12 px · pie a 13 px · recuadros a medida de lectura). Rutas `/modulos/[slug]` con teoría MDX y `/erratas`; archivos `globals.css`, `componentes.tsx`, `ojo.tsx`, `alerta-contradiccion.tsx`, `tabla-clave.tsx`, `pie.tsx`, `erratas/page.tsx`.

**Cómo lo probé:** axe-core 4.x en 4 corridas a 375 px (2 rutas × 2 temas) más 2 a 1280 px · barrido de `Tab` con **460 ms por parada** (el `transition-all` tarda ~420 ms en asentar el contorno; medir antes da un falso 3 px con alfa 0,5) · árbol de accesibilidad por CDP `Accessibility.getFullAXTree` · contraste sobre el DOM renderizado con canvas de 1×1 y composición alfa de la cadena de ancestros · **píxeles del degradado por mediana vertical de columna** sobre capturas del contenedor real, en tres posiciones de desplazamiento · anchos 187 (200 %) · 320 (400 %) · 375 · 768 · 1280 · cpl con `canvas.measureText` sobre el texto real de cada elemento · **A/B del pie**, 13 px real contra 12 px inyectado con `add_style_tag`. MDX temporal con los cinco componentes y una tabla de 5 columnas, **borrado al terminar** (`content/teoria/` vuelve a tener solo su `.gitkeep`). Servidor en el 3117, cerrado al acabar. Cero dependencias nuevas, cero cambios en el árbol.

**Hallazgos:** Crítico 0 · Serio 0 · Moderado 1 (**A-17**) · Menor 1 (**A-18**). Siete de los nueve cambios quedan confirmados sin reservas; A-11 queda a medias y A-15/A-16 resueltos por diseño.

**Bloqueantes:** ninguno.

**Contraste:** todos AA en los dos temas. `<dt>` a 12 px: **4.71 claro / 5.61 oscuro** — la afirmación del `ui-designer` es exacta, el umbral no se movió porque WCAG empieza «texto grande» en 24 px. Pie a 13 px: **5.49 claro / 6.18 oscuro**, también exacto. Sigue siendo el `<dt>` el par con menos margen del paso: **0,21**.

**Pendiente:**
- **A-17 · Moderado, abierto.** El degradado de A-11 funciona en claro (**0 señal → 1.43:1**, ΔL 0.31, encendiendo y apagando en el lado correcto) y queda **invertido en oscuro dentro de `<TablaClave>`**: la señal real cae a **1.02:1** (invisible) y aparece una falsa banda de 1.09:1 **en el borde contrario**. Causa medida, no deducida: `.prose-idoneo .marco-tabla .tabla-desliz` (globals.css:461) empata en especificidad (0,3,0) con `.dark .prose-idoneo .tabla-desliz` (452) y va después, así que el tema oscuro nunca llega a la tabla enmarcada — y **toda tabla de teoría va enmarcada**. La tabla suelta, que sí recibe la variante oscura, mide **1.31:1** y funciona. Debajo hay un segundo error: el comentario afirma que «dentro de `<TablaClave>` el fondo lo pone el marco», pero `.marco-tabla` **no tiene `background`**; el recorrido de ancestros termina en `--background`. Arreglo propuesto: pintar la tapa con `var(--background)`, que ya cambia con el tema, y **borrar** el bloque de las líneas 461-467 (conservando el `margin-block: 0` de la 469). Las tres variantes colapsan en una y el `.dark` solo necesita el color de la sombra.
- **A-18 · Menor, aceptado y documentado.** El degradado ciega a axe: las incompletas del módulo pasan de **1 a 32**, y **31 son celdas de tabla** con «background color could not be determined due to a background gradient». No hay fallo real detrás (texto de tabla 17.03 / 15.22), pero el contraste de tabla ya solo se puede verificar midiendo. Importa para el Paso 15, que mete 28 módulos de tablas: «0 violaciones» dejará de significar «tabla verificada».
- **Cifra de `DISENO.md` §2.5 a corregir:** dice que el enlace del pie pasa «de ~43 a ~49 px». Medido: **44,0 px exactos**. Consecuencia buena — cierra el «1 px corto» que A-05/A-08 dejaron anotado como trade-off consciente: ahora cumple el piso interno de 44 de §3 y la excepción se puede borrar.
- **Matiz de `DISENO.md` §3.1, decide el `ui-designer`:** el argumento de «cinco caracteres de margen bajo el 80» vale para la teoría de 17 px (mido **74,4 cpl**, contra los 74,8 previstos) pero **no para las superficies de 15 px**, que caen en **79,2–79,6 cpl** — margen real de 0,4 a 0,8 caracteres. §3.1 las estimó con 7,17 px de carácter; los reales van de 6,81 a 7,25 según el texto. Pasan, pero sin margen.
- **Heredado del Paso 5, no de este paso:** a ≥`lg` queda **1 `complementary` sin nombre**, la barra lateral de escritorio. axe no lo marca por ser único. Anotado para el Paso 18.
- **Lo que el arreglo de A-11 no podía arreglar y no arregló:** a 375 px la celda «95 % / 5 %» sigue mostrando `95 % / ` y cortando `5 %`, 45 px fuera del borde. El degradado es `background-image` del contenedor: se pinta detrás del texto, avisa pero no restituye. Tras desplazar al final la celda se lee completa. En claro el aviso llega; en oscuro, por A-17, no.

**Lo que quedó bien y hay que conservar:** axe **0 violaciones** en las seis corridas (antes: 1) · **22 de 22** enfocables con contorno `2px solid --ring` y orden visual sin trampas · los 6 recuadros con `role="note"` **y nombre**, con los tres `aria-labelledby` apuntando a un destino existente · el `group` de A-10 **no añade landmarks**, confirmado contra `/erratas`, que no tiene tablas y declara los mismos 4 `region` · medida de lectura aplicada con precisión quirúrgica (`p·ul·ol·h2·h3·hr·aside` a 608 px; `<TablaClave>`, `<Formula>` y tabla suelta intactas a 720) · **a 375 px no cambió nada**, los nueve tipos de elemento siguen en 343 px · sin scroll horizontal en 187, 320, 375, 768 ni 1280 · el `py-3.5` del pie sigue funcionando: el párrafo mide **5 alturas de línea exactas** a 12 y a 13 px, y «Idóneo 2210», que a 12 px se partía a 375 px, ahora queda entero.

---

## [2026-07-30 13:40] · accessibility-auditor · Paso 7 — reverificación final (ficha por fila, `DISENO.md` §3.2)

**Qué audité:** el cambio de **§3.2** —por debajo de `sm` (640 px) toda tabla de 4+ columnas deja de ser retícula y se presenta como una ficha por fila— sobre `/modulos/[slug]` y `/erratas`, rama `paso-7-mdx`. Piezas tocadas: `src/app/globals.css` (bloque de §3.2 dentro de `@layer components`, más el borrado de la variante `--card` que causaba A-17) y `src/components/mdx/componentes.tsx` (roles explícitos en las seis piezas de la tabla + las claves de columna como `--et-1 … --et-7` leídas del `<thead>` en el servidor). También los recuadros a **36rem** de §3.1 revisada.

**Cómo lo probé:** árbol de accesibilidad por CDP `Accessibility.getFullAXTree` en las cuatro combinaciones de tema × ancho · axe-core 4.x en **8 corridas** (2 rutas × 2 temas × 375 y 1280 px) más un **A/B sobre el mismo MDX** con §3.2 neutralizada por inyección de CSS, que es la única forma honesta de aislar lo que recupera · celda «95 % / 5 %» medida **carácter a carácter** con `Range.getBoundingClientRect()` · barrido de `Tab` con **460 ms por parada** (el `transition-all` tarda ~420 ms en asentar el contorno) · contraste por píxel sobre el DOM renderizado con canvas de 1×1 y composición alfa de la cadena de ancestros · cpl con `canvas.measureText` sobre el texto real · barrido de frontera en **639/640/641** y de desbordamiento en 640–1280 · zoom **187 px (200 %)**, **320 px** (referencia de 1.4.10) y 94 px · `prefers-reduced-motion` · **prototipo del arreglo de A-19 inyectado y medido en runtime**, no propuesto a ciegas. MDX temporal con **cuatro tablas** (5 · 2 · 3 · **7** columnas) para cubrir los dos lados del umbral y el techo de `--et-7`, **borrado al terminar**: `content/teoria/` vuelve a tener solo su `.gitkeep`, verificado con `git status`. Servidor en el **3117**, cerrado al acabar. Cero dependencias nuevas, cero cambios en el árbol.

**Hallazgos:** Crítico 0 · Serio 0 · Moderado 0 · **Menor 4** (A-19 · A-20 · A-21 · A-22). Y **dos cierres**: A-11 y A-17.

**Bloqueantes:** ninguno.

**Contraste:** todos AA en los dos temas. Clave de la ficha (12 px, `muted-foreground` sobre `background`): **5.49 claro / 6.18 oscuro**. Valores de la ficha: **17.03 / 15.22**. Ningún token nuevo, ningún par movido.

**Las cuatro preguntas, con su cifra:**
1. **La ficha NO deshizo A-10 ni A-12.** El árbol es **idéntico a 375 y a 1280 px**, en los dos temas: 3 `table` · 6 `rowgroup` · 14 `row` · **10 `columnheader`** · 37 `cell` · 3 `group` con nombre. Ni un nodo de diferencia. El `<thead>` se recorta (`position: absolute` + `clip-path: inset(50%)`, ancho 1 px), nunca `display: none`. **17 de 17** `<th scope="col" role="columnheader">` — el «8 de 8» de A-12 venía de un MDX de dos tablas; este trae cuatro, y el invariante se cumple entero.
2. **«95 % / 5 %» se lee completo a 375 px**, en claro y en oscuro: **0 caracteres cortados** (antes: `5 %`), **0 px fuera** (antes: 45), quinta columna presente, 5 de 5 campos en la ficha de R2, y `scrollWidth == clientWidth` = 341 px dentro del contenedor. Los controles se comportan: las tablas de **2 y de 3 columnas siguen en retícula** con su degradado. La frontera cae exacta: **639 px ficha · 640 px retícula**.
3. **El `aria-label` miente bajo `sm`, y lo confirma el propio axe**: la regla `scrollable-region-focusable` pasa de `passes` a **`inapplicable`** a 375 px. **Arreglo probado en runtime**: mover el nombre a un `<p class="sr-only">` con `aria-labelledby` y apagar el sufijo con la misma media query — el algoritmo de nombre accesible excluye los descendientes ocultos. Medido: **«Tabla» a 375 px** y **«Tabla · se desplaza en horizontal» a 1280 px**, sin JS, sin parada nueva y sin mover una sola caja.
4. **axe recuperó las celdas a 375 px.** A/B sobre el mismo MDX: **42 → 25 incompletas**, y la tabla ancha pasa de **17 nodos ciegos a 0**. A 1280 px son **49** (25 de la tabla ancha), porque ahí el degradado sigue puesto por diseño. **0 violaciones en las ocho corridas.**

**Pendiente:**
- **A-19 · Menor, con arreglo probado.** Bajo `sm` el envoltorio sigue llamándose «Tabla, desplazable en horizontal» y ya no hay nada que desplazar. No falla 4.1.2 —tiene rol y nombre— pero miente en el viewport donde se usa la app. El arreglo está medido y no cuesta nada; lo aplica `frontend-developer` con una línea de CSS en el bloque de §3.2. **Y hace falta algo más que renombrar**, aunque no tenga salida barata: la parada de tabulación se queda sin trabajo a 375 px (**A-14 ampliado** — ahora incluye la tabla ancha, que era la que justificaba el `tabIndex={0}`) y el contenedor mide **1131 px de alto** contra 812 de viewport, así que su contorno de foco no cabe entero. `tabindex` no es estilable y medir el desbordamiento exigiría un Client Component, que §10.3 no admite: **se acepta y se documenta**.
- **A-20 · Menor, decide el `ui-designer`.** La clave del `::before` llega al árbol **con las versalitas aplicadas**: una celda anuncia `AERÓBICO / ANAERÓBICO` + `95 % / 5 %`. La duplicación está prevista y aceptada por §3.2 (es la única pista de fila que llega, dado el límite de GFM de A-12). Las versalitas no lo estaban, y **me obligan a corregir una afirmación mía del Paso 5**: dije que `RotuloBloque` no llegaba en mayúsculas porque la transformación era de CSS. **Es falso en Chromium** — el árbol devuelve `BLOQUE`, `CIENCIAS APLICADAS`, `DICE LA CARTILLA`, `GRASAS` y el título de `<TablaClave>`, todos transformados. Es de toda la app, no de la ficha; la ficha añade **20 instancias por tabla de 5 columnas** y el Paso 15 mete 28 módulos. Alcance real acotado: Gecko y WebKit no lo hacen, y NVDA/JAWS leen mayúsculas con normalidad.
- **A-21 · Menor, decide el `ui-designer`.** Recuadros a **576 px = 36rem exactos**, aplicado. Pero la banda «74,4–75,0 cpl» de §3.1 se cumple en 2 de 4 superficies: teoría **74,7** ✅ y `<Ojo>` **74,5** ✅, pero **alerta `<dd>` 78,3** (1,7 caracteres de margen, no cinco) y **ficha de `/erratas` 70,7**. Ninguna falla —las cuatro bajo los 80 de 1.4.8, que además es AAA— pero la banda publicada no describe lo medido.
- **A-22 · Menor, decide el `ui-designer`.** Por encima de `sm` **ninguna** de las cuatro tablas desborda en 640 · 660 · 680 · 700 · 720 · 768 · 900 · 1280 px, **ni la de 7 columnas**: con `width: 100%` y `table-layout: auto` las celdas envuelven en vez de desbordar. §3.2 conserva el degradado arriba «porque una tabla de 6 columnas todavía puede desbordar a 700 px»; medido, no ocurre con este contenido. Beneficio arriba: ninguno medible. Coste arriba: **49 incompletas de axe**, es decir cero cobertura automática de contraste en tablas de escritorio justo antes del Paso 15. No propongo quitarlo —una tabla con contenido inquebrable sí desbordaría, y la afordancia vale más que una herramienta que cubre el 30 %— pero la decisión debe tomarse con los dos números delante.
- **Techo del mapeo, antes del Paso 15:** el CSS declara hasta `--et-7`. Una tabla de **8 columnas** dejaría la octava sin clave en la ficha. Ninguna cartilla trae 8 hoy; conviene que esté escrito.
- **Heredado del Paso 5, no de este paso:** a ≥`lg` sigue quedando **1 `complementary` sin nombre**, la barra lateral de escritorio. Anotado para el Paso 18.

**Lo que quedó bien y hay que conservar:** los **roles explícitos** de `componentes.tsx` son la pieza que hace que todo esto funcione — sin ellos el cambio de `display` habría convertido la tabla en `generic` y tirado A-10 y A-12 por la borda; con ellos la semántica **dejó de depender de la presentación**, que es más robusto que lo que había antes · **A-17 cerrado y verificado en `getComputedStyle`**: la tapa computa `--background` en los dos temas **y dentro y fuera de `.marco-tabla`**, las tres variantes colapsaron en una · el umbral `:has(thead th:nth-child(4))` separa exactamente lo que dice separar, sin que el autor de contenido escriba nada · las claves como custom properties leídas **en el servidor** evitan un atributo por celda y un Client Component · **23 de 23** enfocables con contorno `2px solid --ring` y orden visual sin trampas · orden de lectura = orden del DOM en las **20 celdas**, 0 discrepancias · **0 solapamientos y 0 celdas fuera del contenedor** a 187, 320 y 94 px · `prefers-reduced-motion` con **0 elementos** en movimiento · tipografía de la ficha exacta contra las tres filas de §2.3 (12 px Inter versalitas · 18 px Barlow Condensed · 15 px Inter).

---

## [2026-07-30 07:40] · cierre del Paso 7 · ficha por fila y A-19

**Veredicto final del `accessibility-auditor`: APROBADO.** Crítico 0 · Serio 0 · Moderado 0 · Menor 4. `/modulos/[slug]` con teoría pasa de PARCIAL a **APROBADA**, y se cierran **A-11** y **A-17**.

**La decisión de fondo — `DISENO.md` §3.2.** Por debajo de `sm` (640 px), toda tabla de 4 columnas o más deja de ser retícula y se presenta como **una ficha por fila**, con la clave de cada columna encima de su valor. El `ui-designer` descartó todo lo que solo señala —envolver, sticky de primera columna, snap, máscara— con el argumento que zanja el asunto: **el daño no es que el usuario ignore que la tabla sigue, es que cree que ya leyó el valor.** «95 % / 5» no parece un dato cortado; parece un dato.

Coincide además con lo que la app ya enseña: las tarjetas C5-T02 a C5-T05 están escritas exactamente así —una zona con todos sus campos—, así que la vista móvil deja de contradecir al mazo del mismo módulo.

**Las cuatro respuestas medidas:**

1. **La ficha NO deshizo A-10 ni A-12.** El árbol de accesibilidad es **idéntico a 375 y a 1280 px, en los dos temas, ni un nodo de diferencia**: 3 `table` · 6 `rowgroup` · 14 `row` · **10 `columnheader`** · 37 `cell` · 3 `group` con nombre. Son **17 de 17** `<th scope="col" role="columnheader">`. Los roles explícitos son la pieza que sostiene todo: sin ellos el cambio de `display` habría dejado la tabla como `generic`; con ellos **la semántica dejó de depender de la presentación**, que es más robusto que lo que había antes del cambio.
2. **«95 % / 5 %» se lee completo a 375 px**, medido carácter a carácter: **0 cortados** (antes `5 %`), **0 px fuera** (antes 45), quinta columna presente, `scrollWidth == clientWidth`. Los controles funcionan: las tablas de 2 y 3 columnas **siguen en retícula**, con frontera exacta en 639 px ficha / 640 px retícula.
3. **A-19, el `aria-label` que mentía** — y no por lectura: lo confirma axe, cuya regla `scrollable-region-focusable` pasa de `passes` a **`inapplicable`** bajo `sm`. Arreglado y aplicado.
4. **axe recuperó las celdas.** A/B sobre el mismo fixture a 375 px: incompletas **42 → 25**, y las de la tabla ancha **17 → 0**. A 1280 px son 49, porque ahí el degradado sigue puesto por diseño. **0 violaciones en las ocho corridas.**

**A-19 aplicado.** «CSS no puede reescribir un `aria-label`» es cierto, pero no hacía falta: **el algoritmo de nombre accesible excluye los descendientes ocultos** del elemento referenciado por `aria-labelledby`. Con el sufijo en su propio `<span class="pista-desliz">` y apagado por la misma media query que crea la ficha, el nombre queda **«Tabla»** a 375 px y **«Tabla · se desplaza en horizontal»** a 1280. Sin JS, sin parada de tabulación nueva, sin mover una caja.

Detalle de implementación: el id no puede venir de `useId` —esto es Server Component y `useId` es un hook— ni de un contador de módulo, que se compartiría entre peticiones. Se deriva de forma determinista de las claves de columna. Dos tablas con encabezados idénticos en la misma página compartirían nombre, no romperían la página, y en el contenido real de las cartillas no ocurre.

**Sin regresiones.** A ≥640 px no cambió nada: las cuatro tablas en `display:table`, `<thead>` estático, degradado intacto, sin desplazamiento nuevo en 640/641/768/1024/1280. **A-17 cerrado**, verificado en `getComputedStyle`: la tapa computa `--background` en los dos temas, dentro y fuera de `.marco-tabla`. Tipografía exacta contra §2.3, clave a 5.49 / 6.18, orden de lectura = DOM en 20/20 celdas, 23 enfocables con `2px solid`, 0 solapamientos a 187/320/94 px.

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **187** · `validar` 87 avisos, 0 errores · `build` verde. `/layout` js **132.0 kB gz** sin moverse — la ficha es CSS más lectura del `<thead>` en el servidor, **cero JS de cliente**.

---

### Tres hallazgos que quedan abiertos, todos Menores

- **A-20 · las versalitas llegan al árbol de accesibilidad en Chromium.** La clave del `::before` se anuncia `AERÓBICO / ANAERÓBICO`, y lo mismo `DICE LA CARTILLA`, `GRASAS` y el título de `<TablaClave>`. **El auditor se corrige a sí mismo**: en el Paso 5 afirmó que `RotuloBloque` no llegaba en mayúsculas porque la transformación era de CSS, y es falso en Chromium. **Es de toda la app, no de la ficha**; la ficha añade 20 instancias por tabla. Gecko y WebKit no lo hacen. Decide el `ui-designer`.
- **A-21 · la banda de cpl publicada no describe lo medido.** §3.1 afirma 74,4–75,0 y se cumple en 2 de 4: teoría **74,7** ✅ y `<Ojo>` **74,5** ✅, pero el `<dd>` de la alerta va a **78,3** (1,7 caracteres de margen, no cinco) y la ficha de `/erratas` a **70,7**. Ninguna falla el 80; el número publicado no corresponde.
- **A-22 · por encima de `sm` ninguna tabla desborda**, ni la de 7 columnas, en ocho anchos de 640 a 1280: con `width:100%` y `table-layout:auto` las celdas envuelven. §3.2 conserva el degradado arriba «porque una tabla de 6 columnas todavía puede desbordar a 700 px», y con este contenido no ocurre. Beneficio arriba: ninguno medible. Coste: **49 incompletas de axe**, o sea cero cobertura automática de contraste en tablas de escritorio **justo antes del Paso 15**.

Y un apunte para antes del Paso 15: el CSS declara claves hasta `--et-7`; una tabla de **8 columnas** dejaría la octava sin clave.

---

## [2026-07-30 08:05] · A-22 cerrado · el degradado se retira entero · Paso 7

**Decisión del `ui-designer`: el degradado de A-11 se retira de la hoja completa**, no solo por encima de `sm`, y en los dos temas. `grep -c linear-gradient src/app/globals.css` pasa de **8 a 0**.

**La premisa que lo sostenía era una suposición, y no se sostuvo.** §3.2 conservaba el degradado arriba «porque una tabla de 6 columnas todavía puede desbordar a 700 px». El auditor lo midió: **cero desbordes en ocho anchos de 640 a 1280 px, con la tabla de 7 columnas incluida**. Y no es suerte del contenido, es estructura: `width: 100%` con `table-layout: auto` hace que las celdas repartan y envuelvan.

Contra ese beneficio nulo, el coste eran **49 celdas incompletas de axe** a 1280 px — cobertura automática de contraste **cero** en toda tabla de escritorio, justo antes de que los pasos 15–17 escriban 28 módulos llenos de tablas.

**El caso de 2 y 3 columnas cayó igual.** Ese era el único escenario que podía salvar el degradado, porque esas tablas no se apilan bajo `sm`. Están medidas: a 375 px siguen en retícula y **ninguna desborda**, que es justamente lo que promete el umbral de 4 columnas. Ahí el degradado también señalaba un desplazamiento inexistente, y costaba las otras 24 incompletas. Sin ningún viewport donde ayude, es CSS muerto que además ciega la única comprobación automática que hay: se retira, no se conserva «por si acaso».

**Lo que se pierde y por qué se acepta.** Si algún día una celda llevara una cadena inquebrable, esa tabla desbordaría sin señal visual. Tres razones para aceptarlo: el degradado **nunca arregló A-11** —avisaba de que la tabla seguía y no restituía el dato; lo que lo cerró fue la ficha por fila—; el acceso no depende de él, porque `overflow-x: auto`, `tabIndex={0}`, `role="group"` y el `aria-labelledby` de A-19 se quedan intactos; y el caso residual se **previene en vez de señalarse**, con `overflow-wrap: anywhere` en `.prose-idoneo table` — no-op sobre el contenido actual (todas las palabras ya caben, por eso el barrido dio cero) y elimina el escenario a futuro.

Es la tesis de §3.2 aplicada al caso residual: **restituir el dato vale más que advertir de que falta.**

Resultado esperado, según la medición del auditor: `/modulos` pasa de **49 a 0** incompletas a 1280 px y de **25 a 1** a 375 px — la que queda es la del pie, ajena a esto.

**Registrado en `DISENO.md` §3.2**, que gana además dos prohibiciones inversas: **volver a poner el degradado en cualquier ancho** (si algo desborda, el arreglo es que quepa) y **quitar `overflow-x: auto`** «ya que nada desborda».

**Compuertas:** `typecheck` 0 · `lint` limpio · `test` **187** · `validar` 87 avisos, 0 errores · `build` verde. `/layout` js **132.0 kB gz** sin moverse; el css baja de 13.4 a **13.3 kB**.

**Sin reverificación del auditor**, por indicación del usuario: el cambio es quitar un degradado y él ya midió el antes y el después.

**Quedan anotadas para más adelante, cosméticas y no bloqueantes:** **A-20** (las versalitas llegan al árbol de accesibilidad en Chromium — es de toda la app, no de la ficha) y **A-21** (la banda de cpl publicada en §3.1 se cumple en 2 de 4 superficies).

---

**El Paso 7 queda cerrado.** Auditoría APROBADO, cinco rutas navegables, el pipeline MDX verificado de punta a punta, y `content/teoria/` con solo su `.gitkeep` a la espera del Paso 8.

---

## [2026-07-30 14:45] · code-reviewer · Paso 8

**Qué revisé:** el diff completo del Paso 8 en `paso-8-c5`. Contenido: `content/teoria/c5-umbrales-zonas.mdx`, `content/tarjetas/c5-umbrales-zonas.ts` (15), `content/banco/c5-umbrales-zonas.ts` (28 ítems). Cableado: los dos índices y el volteo de `estadoContenido` en `content/estructura.ts`. Interfaz: `etapas-modulo.tsx`, `marcador-lectura.tsx`, `mazo-tarjetas.tsx`, `app/modulos/[slug]/tarjetas/page.tsx` y el enganche en `app/modulos/[slug]/page.tsx`.

**Compuertas:** typecheck ok (0 errores) · lint ok (limpio) · test ok (**187** en 6 archivos) · validar ok (**84 avisos, 0 errores**; los 84 son los esperados: 28 módulos en preparación + blueprints sin banco) · build ok (69 páginas estáticas, `prebuild` disparó el validador).

**Invariantes verificados, con el comando:**

- `grep -rn "Math.random" src/ content/ scripts/` → vacío ✅
- `grep -rn "Date.now()\|new Date()" src/lib/` → solo dos comentarios en `fechas.ts`; ninguna llamada ✅
- Reloj en toda `src/`: exactamente **dos** llamadas, las dos autorizadas por §10.4 — `marcador-lectura.tsx:40` dentro del `useEffect`/callback del observador y `mazo-tarjetas.tsx:100` dentro del handler `responder`. **Cero en cuerpo de render** (§22 regla 6) ✅
- `localStorage` fuera de `lib/almacenamiento.ts` → solo comentarios y tests; ninguna escritura directa ✅
- Tailwind v4: sin `tailwind.config.*`, sin `@tailwind` de v3, `components.json` con `"config": ""` ✅
- `"use client"` real (directiva en línea 1, no la frase en comentarios): 22 archivos. Las **tres altas** del paso son exactamente las tres previstas por §10.3 ✅
- Teoría server-only: `grep -rn "lib/contenido" src/components/` → vacío ✅
- Banco en diferido: `grep -rn "from '@/content/banco/"` en `src/` → vacío; solo el índice, con `import()` ✅
- Pie de atribución: `<Pie />` sigue montado en `shell.tsx:46` ✅
- **Canario de ADR-010** `grep -rl "osteomuscular" .next/static/chunks/` → **vacío** ✅. Verifiqué además que el canario *discrimina*: la cadena sí está en `.next/server/` (chunk 536 y varios `.html`/`.rsc`), así que su ausencia en cliente es señal y no artefacto. Cero Client Components importan `content/` en todo el árbol. La corrección del canario está escrita en ADR-010 y en `COMPONENTES.md` §153/§549 ✅

**Reparto de ADR-006, contado por mí:** 28 ítems · **12 recuerdo / 9 comprensión / 7 aplicación** · dificultad **8 / 12 / 8** (≥3 cada una) · **7 tipos distintos** (≥4) · `cuotasDelBloque('C').minimoItems` = **28**, con test. Ningún ítem reetiquetado: diff campo a campo de los 25 originales contra §14.3 → **byte-idénticos, cero diferencias**. Los tres nuevos aportan uno por nivel y uno por dificultad, que es exactamente el delta necesario. El reparto se alcanzó **escribiendo**, no retiquetando: la trampa que anticipó ADR-006 no se cayó en ella.

**Fidelidad al blueprint:** teoría **byte-idéntica** a §14.1 (mismo MD5, 113 líneas, sin `#` de primer nivel, con los 5 componentes MDX y los ids E-09 / X-02 en su sitio). Tarjetas idénticas a §14.2 salvo **dos líneas de comentario de cabecera** añadidas, triviales y ciertas. Ítems literales: **cero `map()`, plantillas o generadores** en `content/`.

**Peso (regla de `COMPONENTES.md`), confirmado y desglosado por mí** con `app-build-manifest.json` + gzip por chunk. Sobre el piso compartido de ~104 kB, las rutas de módulo suman **26,6 kB gz** en tres chunks que ninguna otra ruta carga: `795-*.js` **12,7 kB** = runtime de Zod · `5-*.js` **9,1 kB** = tailwind-merge **+ iconos lucide** (el implementador lo atribuyó entero a tailwind-merge; la magnitud es la suya, el reparto no) · `571-*.js` **4,9 kB** = código propio (`esquemas.ts` + `almacenamiento.ts`). **El escalón se paga una sola vez:** los tres son chunks compartidos numerados, no `page-*`, así que toda ruta de los Pasos 9–14 que lea progreso los reutiliza sin coste nuevo. Matiz de contabilidad: hoy no entran en «First Load JS shared by all» (102 kB) porque `/`, `/erratas` y `/modulos` no leen progreso; en el **Paso 14**, cuando la portada lea racha y progreso, pasarán a la línea base y el número reportado subirá a ~129 kB sin que el usuario descargue un byte más.

**Hallazgo #8 del implementador: validado.** `obtenerSnapshot` lee `localStorage` y no escribe, así que `useEstado()` devuelve `null` también de forma **permanente** para todo usuario nuevo. `EtapasModulo` lo resuelve bien con la bandera `montado` (`useState` + `useEffect` vacío), y el contrato quedó escrito en `COMPONENTES.md` con el mandato explícito para los Pasos 9–14. Único hueco: el **JSDoc del propio hook** sigue enseñando el contrato viejo (ver 🟡 abajo).

**Diagnóstico de `esquemas.ts` en el navegador: lo comparto, con evidencia dura.** `grep -rl "diceLaCartilla" .next/static/chunks/` devuelve `571-*.js`: `esqErrata` viaja al cliente, y con él los siete esquemas de ítem, tarjetas y glosario, donde nada de eso se usa —en navegador solo hace falta `esqEstadoProgreso`—. Son `export const` con llamadas a `z.object(...)` en tope de módulo, sin anotación `/*#__PURE__*/`: el tree-shaking no puede tocarlos. **Matiz importante: no es violación de §5.** §5 sanciona explícitamente que `almacenamiento.ts` importe `esquemas.ts` en el navegador («para el JSON importado»); lo que el blueprint no anticipó es el coste. Partir el archivo **sí** es cambio de arquitectura y choca con §22 regla 2, así que el implementador hizo bien en reportar en vez de hacerlo. Y sí, **conviene decidirlo junto con la deuda del barrel de `radix-ui` (ADR-011)**: son dos deudas de peso sobre las mismas rutas, y el Paso 9 es cuando esas rutas se cargan de verdad. Escalado al `software-architect`.

**Hallazgos:** 🔴 1 · 🟡 2 · 💭 3

- 🔴 **`C5-028` mezcla escalas de porcentaje y sitúa en R1 un valor que la teoría del propio módulo pone en R2.** El enunciado pide «el límite superior de la zona R1 al 75 % de la frecuencia cardíaca de reserva»; con Fox (FCmáx 185) y reposo 55, la respuesta 152,5 lpm es el **82,4 % de la FCmáx**, y la tabla de §14.1 —y el ítem C5-015— sitúan R1 en 65–75 % (120–139 lpm) y R2 en 80–90 % (148–167 lpm). El ítem etiqueta como techo de R1 un valor que cae dentro de R2. Es exactamente la ambigüedad que `C5-008` existe para enseñar a evitar («antes de aplicar un porcentaje, pregunta siempre porcentaje de qué») y que §14.4 prohíbe explícitamente. Pesa porque es la plantilla de oro: se replicaría 28 veces como modelo de ítem `calculo` / `aplicacion` / dificultad 3. **La aritmética y los `pasos` son correctos; lo que falla es el marco.** Arreglo de una línea, sin tocar nada más: quitar el marco de zona del enunciado → «…quiere prescribirle una intensidad del **75 % de la frecuencia cardíaca de reserva** con el método de Karvonen, estimando la FCmáx con Fox et al. (1971)». `respuesta`, `tolerancia`, `pasos` y explicación quedan válidos tal cual.
- 🟡 **El JSDoc de `useEstado` enseña el contrato que el propio paso demostró falso.** `src/hooks/usar-estado.ts:11-14` dice «Devuelve null en el primer render … y el estado real a partir del segundo. Todo componente que lo use DEBE renderizar un esqueleto mientras sea null». Eso es literalmente el patrón que deja el esqueleto puesto **para siempre** en todo usuario nuevo. `COMPONENTES.md` lo corrigió; el hook no, y quien construya los Pasos 9–14 lee el hook en el punto de llamada, no el documento. Arreglo: reescribir el bloque con los **dos** casos de `null` y remitir al patrón `montado` de `EtapasModulo`.
- 🟡 **`C5-026` atribuye a R2 un «5–10 % de grasas» que la fuente no da.** La cartilla dice de R2 «casi exclusivamente hidratos de carbono», sin cifra; la explicación presenta 5–10 % como el reparto de R2. En la plantilla de oro eso enseña a **inventar una cifra plausible para justificar un distractor**, que es el hábito más caro de replicar 28 veces. Derivado a `technical-writer`: o se quita la atribución numérica («ese reparto no corresponde a ninguna zona; en R2 el sustrato es casi exclusivamente hidrato»), o se cita la fuente que la respalde.
- 💭 Karvonen entra al banco de C5 siendo concepto de C2. Es defendible —C2 es prerequisito, y la `referencia` apunta a la Tabla 2 de FCmáx igual que C5-011 y C5-017— y además juega bien con C5-011, que enseña a **no** usar Karvonen cuando el enunciado pide % de FCmáx. Queda anotado por si al escribir C2 en el Paso 16 se prefiere mover o duplicar.
- 💭 Accesibilidad (no hay auditoría para este paso, así que lo digo yo). **Lo que está bien resuelto:** gestión de foco explícita en `MazoTarjetas` con `objetivoFoco` + `tabIndex={-1}` en reverso y resumen —el foco no cae nunca al `<body>` al desaparecer el botón pulsado—, `role="status"` en el contador de tarjeta, piso táctil de 44 px garantizado en `@layer base`, y el color nunca como único portador (el chip numérico siempre va con texto de estado). **Dos notas menores:** el manejador de teclas `1`/`2` vive en un `<div onKeyDown>` no focusable y funciona solo porque el foco está siempre en un descendiente —si el usuario pulsa una zona neutra, las teclas dejan de responder—; y la ayuda de teclado es `hidden sm:block`, así que un lector de pantalla en móvil con teclado externo no la anuncia. Ninguna de las dos bloquea.
- 💭 Los dos comentarios de cabecera añadidos en `content/tarjetas/c5-umbrales-zonas.ts` son la única desviación de §14.2: triviales y ciertas (DD-040…DD-044 son en efecto los datos duros del módulo).

**Veredicto:** **APROBADO CON CAMBIOS.** Las cinco compuertas están en verde y **todos** los invariantes del blueprint se sostienen —incluidos los dos que este paso ponía a prueba de verdad, el canario de ADR-010 y el reloj fuera del render—. La ingeniería del paso es sólida: el reparto de ADR-006 se ganó escribiendo tres ítems y no retiquetando ninguno, la teoría es byte-idéntica al blueprint, y el doble `null` de `useEstado` se detectó, se resolvió bien y se documentó. Lo que impide darlo por cerrado es un defecto de contenido en la plantilla que se copia 28 veces.

**Pendiente antes de cerrar el paso:**
1. Corregir el enunciado de `C5-028` (🔴) — una línea; `npm run validar` debe seguir en verde.
2. Reescribir el JSDoc de `useEstado` con los dos casos de `null` (🟡).
3. Resolver el «5–10 % de grasas» de `C5-026` con el `technical-writer` (🟡).
4. Escalado al `software-architect`, **no bloquea el Paso 8**: decidir el troceado de `esquemas.ts` junto con el barrel de `radix-ui` (ADR-011), en el Paso 9.


## Paso 8 — Módulo piloto C5 — 2026-07-30

**Estado:** ⚠️ Completado con ajustes · revisión **APROBADO CON CAMBIOS**, con el bloqueante ya resuelto

Ejecutado en **una sola pasada** por indicación del usuario: sin consultas intermedias, con las decisiones tomadas y registradas sobre la marcha, y **una única** revisión al final. Sin auditoría de accesibilidad — el Paso 7 ya validó las superficies de lectura.

**Qué se entregó**

- `content/teoria/c5-umbrales-zonas.mdx` — §14.1, **byte-idéntico** (mismo MD5).
- `content/tarjetas/c5-umbrales-zonas.ts` — 15 tarjetas, §14.2.
- `content/banco/c5-umbrales-zonas.ts` — **28 ítems**: los 25 de §14.3 verificados **byte-idénticos campo a campo**, más 3 escritos para este paso.
- C5 registrado en los dos índices y `estadoContenido` volteado a `'completo'`: **las cuotas del bloque C empezaron a correr de verdad**.
- `src/components/modulo/{etapas-modulo,marcador-lectura,mazo-tarjetas}.tsx`, `src/app/modulos/[slug]/tarjetas/page.tsx` y el enganche en la página de módulo. Tres altas a §10.3, las tres previstas por el blueprint: 6 → 9 clientes propios.

**El reparto de ADR-006 se ganó escribiendo, no reetiquetando** — el revisor lo comprobó: 12 recuerdo · 9 comprensión · 7 aplicación (42,9 / 32,1 / 25,0 %), dificultad 8/12/8, los 7 tipos, y `cuotasDelBloque('C')` exigiendo 28. Los tres nuevos aportan exactamente uno por nivel y uno por dificultad: el delta justo.

**Validador:** 29 módulos (**1 completo**), 28 ítems, 15 tarjetas, 14 erratas, 22 términos. **84 avisos, 0 errores.**

---

### El bloqueante, y por qué importaba más que un ítem

**`C5-028` mezclaba escalas.** Preguntaba por «el límite superior de la zona R1 al 75 % de la frecuencia cardíaca de reserva», y su respuesta —152,5 lpm— es el **82,4 % de la FCmáx**, que la tabla de §14.1 y el propio `C5-015` sitúan en **R2**. La aritmética y los cuatro `pasos` estaban bien; fallaba el marco.

Es exactamente la ambigüedad que `C5-008` existe para enseñar a evitar: *«antes de aplicar un porcentaje, pregunta siempre porcentaje de qué»*. Y pesaba porque **C5 es la plantilla de oro**: ese ítem sería el modelo de todo `calculo` / `aplicacion` / dificultad 3 en los 28 módulos restantes.

**Arreglo:** se retira el marco de zona del enunciado —queda «una intensidad del 75 % de la frecuencia cardíaca de reserva con el método de Karvonen»— y la etiqueta `R1`, que ya no describe el ítem. `respuesta`, `tolerancia`, `pasos` y explicación quedan válidos tal cual.

### Los dos 🟡, también arreglados

- **El JSDoc de `useEstado` enseñaba el contrato que este paso demostró falso.** Decía «todo componente que lo use DEBE renderizar un esqueleto mientras sea null», que es **literalmente el patrón que deja el esqueleto puesto para siempre**. Reescrito para distinguir los dos casos y remitir al contrato de `COMPONENTES.md`. Importa porque los pasos 9–14 leen el hook en el punto de llamada, no la documentación.
- **`C5-026` atribuía a R2 un «5–10 % de grasas» que la cartilla no da** — dice «casi exclusivamente hidratos», sin porcentaje. Cifra inventada para justificar un distractor, en la plantilla de oro. La explicación ahora dice que ese reparto no corresponde a ninguna zona con cifra propia.

---

### El hallazgo que cambia el patrón de los Pasos 9–14

**`useEstado()` devuelve `null` en dos situaciones distintas**, y confundirlas tiene consecuencias: el primer render —transitorio— y **el usuario que no tiene nada guardado, que es permanente**, porque `obtenerSnapshot` lee `localStorage` y no escribe. Tratar `null` como «cargando» deja el esqueleto puesto **para siempre en todo usuario nuevo**, que es justo la primera visita.

Es el tipo de bug que no aparece en desarrollo —donde siempre hay estado— y se descubre con el primer usuario real. `etapas-modulo.tsx` lo resuelve con una bandera de montaje, y el contrato quedó escrito en `COMPONENTES.md` y ahora también en el JSDoc del hook.

### Peso — la regla de `COMPONENTES.md` se aplicó antes de cerrar

| Ruta | js gz | Antes |
|---|---|---|
| `/layout` | **131.9 kB** | 132.0 — sin moverse |
| `/modulos/[slug]/page` | **134.0 kB** | 106.9 |
| `/modulos/[slug]/tarjetas/page` | **135.8 kB** | nueva |

+26,6 kB sobre el piso de servidor puro, **investigado antes de cerrar** como manda la regla. No es un import accidental: es el escalón de una sola vez del **primer cliente que lee progreso** — Zod 12,7 kB + tailwind-merge y lucide 9,1 kB + 4,9 kB propio. El revisor lo confirmó y añadió el dato que importa: **son chunks compartidos numerados, no `page-*`**, así que toda ruta de los pasos 9–14 que lea progreso los reutiliza sin coste nuevo. Y un matiz de contabilidad: en el **Paso 14**, cuando la portada lea la racha, pasarán a «shared by all» y la cifra reportada subirá a ~129 kB **sin que nadie descargue un byte más**.

### El canario de ADR-010 tenía un falso positivo, corregido

`conceptosClave` **dejó de servir**: es también campo de `esqModulo`, y `esquemas.ts` entra ahora al bundle de forma **legítima**, porque `almacenamiento.ts` lo importa para validar el progreso al leerlo. Medido: `conceptosClave` devuelve 1 chunk y `osteomuscular` 0, con el bundle sano.

El canario fiable es **`grep -rl "osteomuscular" .next/static/chunks/`**, sobre el árbol entero y no solo el chunk del layout. Corregido en **ADR-010** y en los dos sitios de `COMPONENTES.md`. El revisor comprobó además que **discrimina**: «osteomuscular» sí está en `.next/server/`, así que su ausencia en cliente es señal y no artefacto.

### Deuda registrada, no ejecutada

**`esquemas.ts` manda al navegador los siete esquemas de ítem, tarjetas, erratas y glosario, donde ninguno se usa** — solo `esqEstadoProgreso` hace falta en cliente. Evidencia dura: `grep "diceLaCartilla" .next/static/chunks/` devuelve `571-*.js`.

No es violación de §5, que sanciona el import explícitamente; lo no previsto es el coste. Partirlo en `esquemas-progreso.ts` / `esquemas-contenido.ts` **sí es arquitectura** y choca con §22 regla 2, así que el implementador lo reportó en vez de hacerlo — y el revisor comparte el diagnóstico. **Se decide junto con la deuda del barrel de `radix-ui` (ADR-011) en el Paso 9 u 11**: misma deuda, mismas rutas, mismo momento. Escalado al `software-architect`.

### Dos decisiones de contenido tomadas sin consultar, y registradas

- **`C5-028` es de Karvonen**, elegido sobre gasto cardíaco, MET y conversión de pulso porque es el único de los cuatro con cuatro pasos reales —dificultad 3 de verdad— y porque **`C5-011` nombra a Karvonen como el error clásico sin hacerlo ejecutar nunca**: este ítem cierra ese lazo y muestra los 14 latidos de diferencia contra el %FCmáx ingenuo.
- **Su `referencia` apunta a `Subtema 2.1 — Tabla 2`, no a 2.6.x**, porque la frecuencia de reserva vive en el material de FCmáx y esa es **la misma cadena que ya usan `C5-011` y `C5-017`** en §14.3. Reutilizar una referencia sostenible antes que inventar un subtema no visto en la cartilla.

### Dos notas menores de accesibilidad, del revisor

La gestión de foco de `MazoTarjetas` está bien resuelta —`objetivoFoco` + `tabIndex={-1}` evitan que el foco caiga al `<body>` cuando desaparece el botón pulsado—. Sin bloquear: las teclas `1`/`2` viven en un `<div onKeyDown>` no enfocable, así que dejan de responder si se pulsa una zona neutra; y la ayuda de teclado es `hidden sm:block`.

**Compuertas finales:** `typecheck` 0 · `lint` limpio · `test` **187** · `validar` 84 avisos / 0 errores · `build` **69 páginas**.

---

## Paso 8b — Tres correcciones sobre C5 — 2026-07-30
**Estado:** ✅ Completado
**Rama:** `paso-8b-correcciones`

**1 · Bug de tablas (A-23).** El `overflow-wrap: anywhere` con que se cerró A-22 partía palabras normales en las cabeceras: «Zon/a», «Aeróbi/co», «Sustrat/o». Causa medida: `anywhere` rebaja la anchura mínima intrínseca de la celda a un carácter y `table-layout: auto` la toma como suelo de columna. Repartido por rol — `th: normal` · `td: break-word` · `td::before: normal` (en la ficha de §3.2 el rótulo vive dentro de un `<td>`). Verificado en navegador con `Range` + `getClientRects()` y control con `normal !important`: **0 palabras partidas a 375 px** en las dos tablas de C5 (35 celdas, 188 palabras), igual en los otros 8 anchos hasta 1280; 0 desbordamientos. Único corte residual, `80–90` desde 768 px, presente también en el control: es UAX#14.

**2 · Mazo de tarjetas: se invirtió la jerarquía.** Los botones pasan a acción primaria a **52 px** (la medida que DISENO.md §3 reserva a las opciones de ítem: esto es la respuesta a la tarjeta); los del resumen se quedan en 44 porque son navegación. El atajo de teclado baja a una línea de 13 px y pasa de `hidden sm:block` a `[@media(any-pointer:fine)]:block` — el ancho era un mal proxy de la modalidad y fallaba en los dos sentidos. **De paso se cerró el fallo que el `code-reviewer` señaló en el Paso 8**: las teclas vivían en un `<div onKeyDown>` sin `tabIndex`, así que dejaban de responder al pulsar una zona neutra; ahora escuchan en `window` con guarda de campos editables y modificadores, patrón de §13. Verificado: las 15 tarjetas recorridas sin un solo clic.

**3 · Las erratas salen del cuerpo de la teoría → ADR-013.** La teoría enseña el dato correcto y punto; `/erratas` sigue intacto como registro. Los dos `<AlertaContradiccion>` de C5 se sustituyen por prosa que **enseña más de lo que había**: la bajada de FC en reposo vivía solo dentro del cuadro de E-09, y ahora está en el hilo de lectura junto con «la FCmáx no sube con el entrenamiento», que es el dato del que depende la respuesta correcta de `C5-019` y que la teoría no traía. X-02 pasa a enseñarse como **rango real de 5–15 s** en vez de fingir el binario por bloques.

`content/erratas.ts` se reescribió con lo verificado, no solo se movió: **X-01** resuelve a 30–32 siempre (los 36–38 son el dato viejo, no «la versión de Ciencias Básicas»; 30 en músculo esquelético por la lanzadera glicerol-3-fosfato), **X-02** a rango, **X-03** se mantiene como `'aclaracion'` y gana valor al acercarse los dos números, y cuatro erratas se corrigieron o completaron: **E-01** (su propio `loCorrecto` decía «las algas son eucariotas» a secas — las cianobacterias son bacterias), **E-03** (el cartílago amortigua, pero no es el amortiguador principal), **E-07** («vegetales de hoja verde» no discrimina B2 frente a folato) y **E-09** (faltaba que la FCmáx no cambia). Verificadas y sin cambio: E-02, E-04, E-05, E-06, E-08, E-10, E-11.

`content/datos-duros.ts` acompañó, fuera del alcance pedido: `DD-002` decía «10–15 s (Cartilla 3)» y `DD-006` presentaba 30–32 y 36–38 como alternativas de igual rango. Alimentan `/ultima-noche`, que es donde se memorizan valores exactos la víspera.

**Ningún ítem del banco cambió** — reparto 12/9/7 de ADR-006 intacto. Se revisaron los dos con campo `contradiccion` y ninguno afirma nada que se haya caído.

**Extensión de ADR-013 a la página del módulo (misma pasada).** Se quitó de `src/app/modulos/[slug]/page.tsx` la sección «Ojo con las cartillas en este módulo», que listaba las erratas del módulo enlazando a `/erratas`. Es el mismo criterio: la prosa ya enseña el dato correcto, y el listado devolvía la lectura al material equivocado justo después de haber aprendido el bueno. El registro sigue completo en `/erratas`, y el cuadro vuelve en el panel de retroalimentación del ítem (Paso 9), cuando el aviso es la respuesta a un fallo. Sin ADR nuevo: no es una decisión distinta, es la misma aplicada a la segunda superficie. Cayeron con ella los imports de `erratasDelModulo` y `ESTILO_ERRATA`; `/modulos/[slug]` se queda en **134.0 kB js gz**, sin cambio — la página es servidor de punta a punta, así que nada de esto pesaba en el navegador.

**Archivos:** `src/app/globals.css` · `src/app/modulos/[slug]/page.tsx` · `src/components/modulo/mazo-tarjetas.tsx` · `content/teoria/c5-umbrales-zonas.mdx` · `content/erratas.ts` · `content/datos-duros.ts` · `.claude/{ARQUITECTURA,ACCESIBILIDAD,PENDIENTES,CONTENIDO,COMPONENTES}.md`

**Verificación:** `typecheck` ✅ · `lint` ✅ · **187 tests** ✅ · `validar` ✅ 0 errores · `build` ✅. Peso: `/layout` **131.9 kB js gz** sin cambio; `/modulos/[slug]/tarjetas` **135.8 → 136.0 kB**, delta localizado en el chunk propio de la ruta (2.36 → 2.57 kB gz) y pagado por el listener y las clases de tamaño. Canario ADR-010 limpio.

**Pendiente:** `CLAUDE.md` §14.1 **se alineó el mismo día** (enmienda a ADR-013): el bloque coincide byte a byte con el `.mdx` real y la nota que lo sigue fija la regla para los 28 módulos restantes. `<AlertaContradiccion>` queda sin consumidor hasta el Paso 9: anotado en `PENDIENTES.md` para que no se barra como código muerto.

## Paso 8c — Se elimina el sistema de erratas → ADR-014 — 2026-07-30
**Estado:** ✅ Completado
**Rama:** `paso-8b-correcciones`

Decisión de producto del usuario, cerrada: **la app no documenta los errores de las cartillas en ningún sitio.** El contenido enseña el dato verdadero, investigado y verificado; las cartillas son la guía del temario, no la fuente de verdad de cada cifra. **ADR-014 supersede a ADR-012 y a ADR-013**, que eran el mismo error en dos escalones: los dos aceptaban que la app debía catalogar el fallo del material fuente y discutían cómo presentarlo mejor.

**Borrado:** la ruta `/erratas` entera · `content/erratas.ts` (14 entradas) · `alerta-contradiccion.tsx` con `ESTILO_ERRATA` y `CLASES_DT_ERRATA` · los tipos `Errata` y `TipoErrata` · `esqErrata` y `RE_ID_ERRATA` · el campo `contradiccion` de `ItemBase` y de `DatoDuro` · las comprobaciones del validador y su conteo · el enlace del pie · la sección «Ojo con las cartillas en este módulo» de `/modulos/[slug]` · 4 tests (187 → **183**).

**Limpieza de contenido:** 9 campos `contradiccion` (7 en `datos-duros.ts`, 2 en el banco de C5) y **tres textos que hablaban de las cartillas en vez de enseñar** — dos explicaciones de ítem (`C5-009` decía «la cartilla ubica…», `C5-026` citaba «la cartilla dice “casi exclusivamente hidratos”») y un párrafo de la teoría de C5. También los dos valores de `datos-duros.ts` que llevaban la comparación dentro: `DD-002` y `DD-006`.

**Lo verificado se conservó como notas de autoría en `CONTENIDO.md`, no como contenido de la app.** El catálogo borrado contenía investigación con fuentes que es exactamente lo que los pasos 15–17 necesitan para **10 módulos que aún no existen**: ATP por glucosa (30–32, y 30 en músculo esquelético), sistema fosfágeno (5–15 s), qué organismos son procariotas, la mediana con n par, el porcentaje de aumento, la fecha de la Ley 2210, y seis más. Sin eso, el autor del Paso 17 volvería a derivar el dato de una cartilla que en esos puntos se equivoca — justo lo que la decisión quiere evitar. `.claude/` es documentación de construcción: nada de eso llega al usuario.

**`CLAUDE.md` se alineó el mismo día**, con diff revisado antes de aplicar: **46 inserciones, 366 supresiones** en once secciones, de 6.810 a 6.484 líneas. §1 **sustituye** el diferenciador —pasa a «el contenido enseña el dato verdadero, investigado y verificado»— en vez de dejarlo hueco. Se priorizó porque **la reintroducción compila**: no habría gate que la detuviera, y once secciones la mandaban construir justo antes de los pasos 15–17. **§21 y §22 ganan una regla 15** que dice por qué el documento está limpio, al final de cada lista y no intercalada: `7bis.` no es marcador de lista válido, y renumerar rompería los comentarios de código que citan «§22 regla 6» y «§22 regla 11» por número.

**Archivos:** borrados `src/app/erratas/` · `content/erratas.ts` · `src/components/mdx/alerta-contradiccion.tsx`. Tocados `src/lib/tipos.ts` · `src/lib/esquemas.ts` · `src/lib/__tests__/esquemas.test.ts` · `scripts/validar-catalogo.ts` · `scripts/validar-banco.ts` · `scripts/__tests__/validar-catalogo.test.ts` · `src/components/layout/pie.tsx` · `src/components/mdx/{componentes,dato,ojo,tabla-clave}.tsx` · `src/app/modulos/[slug]/page.tsx` · `content/{datos-duros,banco/c5-umbrales-zonas,teoria/c5-umbrales-zonas}` · `.claude/{ARQUITECTURA,CONTENIDO,PENDIENTES,DISENO,COMPONENTES,ACCESIBILIDAD}.md` · `CLAUDE.md`

## Paso 9 — Componentes de ítem y sesión — 2026-07-30
**Estado:** ✅ Completado · **Rama:** `paso-9-items`

**Construido.** `src/components/items/` con el contrato de §13, los **7 tipos × 4 estados**, `envoltorio-item.tsx` y `retroalimentacion.tsx`; `src/hooks/usar-sesion.ts`; `src/components/sesion/` con el controlador, el resumen y su botón; y las etapas 3 y 4 de C5 en `/modulos/[slug]/practica` y `/quiz`. `PropsItem` se hizo genérico en el tipo del ítem: los 7 componentes no llevan un solo cast y el único del sistema vive en el `switch` del envoltorio, con `satisfies never` para que un octavo tipo rompa ahí.

**`src/lib/simulacro.ts` se adelantó del Paso 11 (ADR-015)** porque sin `armarSimulacro`, `presentarTanda` y `calificar` este paso no puede renderizar ni calificar una tanda — el propio blueprint lo delata pidiendo en el Paso 9 los tests de un módulo que aún no existiría. Llegó con **199 tests**, y eso destapó **dos defectos del §7.3 literal**: `calificar` daba por correcta una respuesta múltiple con basura dentro (filtraba los no-números en silencio, e **inflaba** el puntaje), y `presentarItem` devolvía el ítem del banco **por referencia** en `vf` y `calculo`, con los módulos de `content/banco/` siendo singletons de ES module.

**ADR-011 cerrada, con la causa concreta.** El paraguas `radix-ui` no es sacudible **por construcción**: su `dist/index.mjs` hace `import * as X` para las 55 primitivas — namespace imports, no reexportaciones planas—, así que `sideEffects: false` no ayuda. La solución no era la que proponía el diagnóstico: cada subpath (`radix-ui/slot`, `radix-ui/dialog`, …) es un `export * from` de una línea, así que **mismo paquete, cero dependencias nuevas**. 13 archivos de `ui/` reescritos. **`/not-found`: 183.8 → 106.9 kB js gz (−76.9).** La condición de cierre —cómo evitar que `npx shadcn@2 add` lo deshaga— se resolvió al revés de como estaba planteada: **no se puede evitar que lo escriba, sí que sobreviva** a `npm run lint`, con una regla `no-restricted-imports` verificada por mutación.

**Bloqueante encontrado por el `code-reviewer` y corregido.** `<Control {...props} />` se montaba **sin `key`**: dos ítems seguidos del mismo `tipo` reutilizaban la instancia con su estado local. El segundo `calculo` aparecía con el número tecleado en el primero mientras `valor` seguía en `null` — **el usuario ve su respuesta escrita y el ítem se califica en blanco**, sin que nada lo delate. Su test de regresión no cabía en el proyecto, y de ahí sale **ADR-016**: Vitest gana un segundo entorno (`jsdom`) acotado a la clase «solo se ve al remontar».

**Los cuatro «debe arreglarse» del revisor, cerrados en esta misma pasada:** `terminar()` y `cerrar()` idempotentes (hoy inalcanzable, real en cuanto el Paso 11 meta auto-envío compitiendo con el clic — el síntoma sería un `intentosQuiz` inflado, que el informe del Paso 12 lee); el efecto de `ordenar` ya no escribe en modo `bloqueado`; los textos de `emparejar` y `ordenar` dejan de invitar a tocar cuando el modo no lo permite; y las `key` de `emparejar` pasan de texto a índice, porque `esqItemEmparejar` **no** exige que `izquierda` ni `derecha` sean únicas.

**Accesibilidad — A-24 a A-28.** Arreglados: dos objetivos táctiles de 16 y 19 px que el `min-height` de `@layer base` no alcanzaba por ser `display:inline` (A-24); la fila acertada de `ordenar` en revisión, que no decía nada y dejaba el acierto a deducir por ausencia (A-25); **el campo de `calculo`, que nunca anunciaba su unidad** y ningún enunciado de C5 la menciona — con `calificar()` comparando por tolerancia, eso es el ítem perdido (A-26); y ocho landmarks `region` idénticos en el resumen (A-27). Abierto: A-28, el foco invisible en el `<h2>` del resumen, que es decisión de aspecto.

**Lo que la auditoría reportó y no era.** «El tipo `caso` no sale nunca» apuntaba a `armarSimulacro`. **Medido: sale.** 500 semillas → 416 `caso` en práctica y 548 en quiz (~10 %, que es su proporción en el banco: 3 de 28), los 28 ids salen alguna vez, y con semillas realistas de `Date.now()` —consecutivas al milisegundo, cada 3 s y cada 60 s— las 40 tandas son distintas. El muestreo es uniforme; fue artefacto de la navegación de la auditoría. **Queda pendiente pasarle la auditoría al recuadro de viñeta de `caso`**, que por eso no se ejercitó.

**Verificación:** `typecheck` ✅ · `lint` ✅ · **388 tests** en 9 archivos (183 → 388) ✅ · `validar` ✅ 0 errores · `build` ✅. Canarios de ADR-010 en cero, incluida una sonda del propio banco (`MLSS`). Peso: `/layout` **131.9 kB js gz** sin cambio · práctica y quiz **143.5** cada una, +7.5 sobre `/tarjetas`, en un chunk que **las dos comparten** (la segunda ruta cuesta 0.1 kB) y que contiene el motor, los 7 tipos y el controlador.

**Deuda que queda anotada:** `esquemas.ts` sin partir (se aplaza otra vez, exigía tocar `src/lib/` en una pasada donde estaba vetado); segunda copia del botón propio, la tercera obliga a extraerlo; el puntaje se calcula en `usar-sesion.ts` con la fórmula de §7.5 y el Paso 12 es su dueño; nada encola en el SRS todavía (Paso 10); y el banco entero viaja en la carga útil RSC —17.1 kB gz de HTML en práctica contra 9.1 en tarjetas—, que con 100 ítems sobre 29 módulos no escala y es decisión del Paso 11.

## Paso 10 — Motor SRS y /repaso — 2026-07-30
**Estado:** ✅ Completado · **Rama:** `paso-10-srs`

**Construido.** `src/lib/srs.ts` (§7.2) con **55 tests** · `/repaso` con su controlador cliente, cuatro pantallas de estado vacío y una quinta de fallo de red · los dos enganches de la cola · `fechaLocalDe` en `src/lib/fechas.ts` · `scripts/canario-frontera.ts` con `npm run canario`.

**Tres defectos del §7.2 literal (ADR-017), todos de persistencia y ninguno visible al escribir.** El grave: **`crearTarjetaSRS` copiaba `hoy` sin normalizar** —único punto del motor que escribe una fecha sin pasar por `sumarDias`—, así que un handler que le pasara `new Date().toISOString()` creaba la tarjeta con hora. `colaDelDia` compara **strings**: `'2026-07-30T15:…' <= '2026-07-30'` es `false`, y **la tarjeta no vuelve a la cola nunca**, con el usuario viendo «nada que repasar hoy». Los otros dos: el intervalo desbordaba hasta lanzar `RangeError` en un handler al acierto 19, y un `intervaloDias` en 0 dejaba la tarjeta reapareciendo hoy indefinidamente.

**Se decidió NO poner `.max()` a `esqTarjetaSRS`**, que era la simetría obvia. Ese esquema se evalúa dentro de `esqEstadoProgreso`: un valor fuera de rango no invalida esa tarjeta, **invalida el estado entero** y manda todo el progreso a cuarentena (ADR-008). La capa correcta es el motor acotando al escribir.

**`fechaLocalDe`, y no es cosmética.** El `hoy` del SRS no puede salir de `soloFecha(...toISOString())`: eso da la fecha **UTC** y Colombia es UTC−5, así que a las 19:00 en Bogotá UTC ya está en el día siguiente. La cola se adelantaría cinco horas cada tarde —la franja en que este usuario estudia— y el intervalo del SM-2 se acortaría un día de forma sistemática y silenciosa. Se calcula a mano para no depender del ICU del navegador, y recibe el `Date` en vez de construirlo (§22 regla 6).

**El contenido de la cola sale de un `import()` dinámico** de `content/tarjetas/indice` y `content/banco/indice`, cargando solo los módulos que la cola menciona. No viola ADR-010 —que prohíbe el import **estático** de `content/estructura`—, y es para lo que §2.2 hizo `banco/` y `tarjetas/` client-safe. Se descartó «el servidor lo manda todo por prop» por medición: hoy costaría ~8 kB, pero **a 29 módulos serían ~750 ítems y ~350 tarjetas en el documento de la ruta que se abre a diario**, aunque la cola tenga tres elementos.

**El canario de ADR-010 dejó de poder ser un `grep`.** Desde este paso hay contenido en chunks de cliente **a propósito**, así que la pregunta ya no es «¿está en un chunk?» sino **«¿lo descarga el usuario sin pedirlo?»**. `npm run canario` mira solo los chunks que el manifiesto declara por ruta y deja fuera los diferidos. Verificado por mutación con la fuga real del Paso 6.

**Y ahí apareció un fallo mío, que es el hallazgo más incómodo del paso:** la sonda `Malondialdehído` que introduje en ADR-014 **nació muerta**. El minificador escapa todo carácter no ASCII (`í` → `\xed`), así que nunca podía casar: desde entonces el canario informaba «frontera intacta» sin haber comprobado una sola cadena de `datos-duros.ts`. La nota decía «verificado por mutación» y lo estaba, **pero solo para `osteomuscular`**. Verificar una sonda de dos no es verificar el canario. Sustituida por `Mioglobina` y el script **aborta** ante cualquier sonda no ASCII: mejor romper que mentir en verde.

**Dos hallazgos del `code-reviewer`, cerrados en esta pasada.** (1) El `import()` no tenía `.catch()`: un `ChunkLoadError` dejaba la vista en «cargando» **para siempre**, y la guarda `preparando` bloqueaba todo reintento — en la ruta que se abre a diario, en una app cuyo §3 cuenta con conectividad intermitente. Se añadió una **quinta pantalla** con copy honesto y reintento, en vez de reciclar `ColaSinContenido`, que habría dicho «volverán a aparecer en cuanto su módulo se publique» cuando lo que pasa es que el bus entró en un túnel. (2) El enganche del mazo no era idempotente (**ADR-018**): estudiar el mazo a las 8 y repetirlo a las 9 contaba dos revisiones sin espaciado real. Ahora solo se programa lo que de verdad vence hoy.

**Verificación:** `typecheck` ✅ · `lint` ✅ · **456 tests** en 12 archivos (443 → 456) ✅ · `validar` ✅ 0 errores · `build` ✅ · `canario` ✅. Los dos arreglos, verificados por mutación.

**Peso:** `/layout` **132.0 kB js gz** (+86 B de churn de hash) · `/repaso` **144.5** · práctica y quiz **145.1** (+1.6, por el resplit del chunk compartido: gzip comprime peor dos archivos que uno, y a cambio `/repaso` no duplica el sistema de ítems).

---

## Paso 11 — Motor de simulacro, cronómetro y auto-envío — 2026-07-30

**Estado:** ✅ Completado
**Rama:** `paso-11-simulacro`

**Archivos creados**

| Archivo | Qué es |
|---|---|
| `src/lib/cronometro.ts` | §7.4 con desviaciones (ADR-019) |
| `src/hooks/usar-cronometro.ts` | `useCronometro`: el único sitio que lee el reloj para el cronómetro |
| `src/lib/esquemas-progreso.ts` | partición de §5 por consumidor (ADR-021) · `esqSesionCronometro` nuevo |
| `src/lib/almacenamiento-crudo.ts` | acceso de bajo nivel + claves (ADR-021) |
| `src/lib/sesion-activa.ts` | «¿hay simulacro en curso?» sin Zod (ADR-021) |
| `src/lib/censo.ts` | helper de servidor: conteos por módulo |
| `src/components/layout/oculta-en-simulacro.tsx` | oculta el pie sin desmontarlo (ADR-001) |
| `src/components/sesion/controlador-simulacro.tsx` | orquesta viabilidad → carga → reanudación → tanda → cierre (ADR-020) |
| `src/components/sesion/simulacro-en-curso.tsx` | la tanda cronometrada, con persistencia por respuesta |
| `src/components/sesion/cronometro-visual.tsx` | cifra + avisos, con los dos canales separados |
| `src/components/sesion/panel-navegacion.tsx` | cuadrícula de ítems · estrena `data-compacto` (D-8) |
| `src/components/sesion/dialogo-reanudar.tsx` | «tienes un simulacro a medias» |
| `src/components/sesion/portada-simulacro.tsx` | la pantalla que puede **negarse a empezar** |
| `src/components/sesion/simulacro-sin-red.tsx` | el `import()` puede rechazar |
| `src/app/simulacros/page.tsx` · `final/page.tsx` · `bloque/[bloqueId]/page.tsx` | las tres rutas |
| `src/lib/__tests__/cronometro.test.ts` · `src/components/sesion/__tests__/simulacro-en-curso.test.tsx` | 32 + 15 tests |

**Modificados:** `src/lib/simulacro.ts` (+`diagnosticarViabilidad`, `CensoModulo`), `src/lib/esquemas.ts` (partición + re-export), `src/lib/almacenamiento.ts` (`leerSesion` valida; partición), `src/hooks/usar-sesion.ts` (+`SesionInicial`, +`irA`), `src/components/layout/shell.tsx`, `content/banco/indice.ts` (+`censarBanco`), tests de simulacro y almacenamiento.

**Verificación**

Cuatro compuertas en verde: `typecheck` · `lint` (0 warnings) · `test` **527 pasando** (456 → 527, +71) · `build` (133 páginas estáticas). `npm run canario` tras el build: frontera intacta.

**Campaña de mutación — 6 mutantes, 6 muertos.** Un test que no mata a su mutante no cuenta:

| Mutante | Tests que caen |
|---|---|
| `restantes()` deja pasar una duración no finita (el §7.4 literal) | 2 |
| `useSesion` ignora el estado inicial (reanudar arranca en blanco) | 3 |
| `leerSesion` vuelve al cast sin validar (el §6 literal) | 4 |
| viabilidad cuenta el banco entero, no las unidades del reparto | 1 |
| el cronómetro pasa a `aria-live="polite"` | 1 |
| los avisos no se persisten en `avisosVistos` | 1 |

**Los invariantes del paso, comprobados**

- **Cerrar la pestaña no regala tiempo.** No hay contador en memoria: cada tick recalcula desde `iniciadoEnMs` contra el reloj real. Test: montar con el reloj 119 min por delante da `01:00`, no `2:00:00`.
- **Reanudar no pierde respuestas.** Se persiste tras **cada** respuesta —no cada 30 s— precisamente por el defecto de ADR-008: la sonda de 1 byte pasa con el disco casi lleno y `leerSesion()` devolvía la sesión vieja con cero respuestas. Un guardado periódico encima de eso habría hecho el fallo intermitente.
- **Auto-envío al llegar a 0**, exactamente una vez, y también si el tiempo se agotó con la pestaña cerrada.
- **Avisos persistidos**: el test los emite, desmonta, vuelve a montar desde el disco y comprueba que la región viva sale vacía.
- **El cronómetro no habla cada segundo**: `role="timer"` + `aria-live="off"`, `aria-label` recalculado por **minuto**, y una región `role="status"` aparte que solo emite en los tres umbrales. Tres anuncios por sesión en vez de 7200.

**La decisión de producto del paso: la app se niega a armar un examen mentiroso**

`armarSimulacro` no falla cuando falta contenido: rellena desde el pool y devuelve lo que haya. Correcto mientras se escribe contenido, **inaceptable en el instrumento de medida**. Con el banco de hoy, «simulacro final · 100 ítems» habría producido 28 ítems de C5 presentados como el examen completo, y un porcentaje sobre ellos presentado como el pronóstico del usuario.

`diagnosticarViabilidad` (función pura sobre un censo de conteos) responde **antes** de cargar nada. Hoy declara inviables los cinco simulacros y la portada dice qué falta con cifras: «hacen falta 100 ítems y hay 28: faltan 72», más por qué no se ofrece uno más corto y qué sí se puede hacer hoy. Un test ata el diagnóstico a la realidad: si dice inviable, `armarSimulacro` devuelve menos ítems de los pedidos.

**Peso — js gz por ruta**, con el comando oficial de `COMPONENTES.md`:

| Ruta | Antes | Después | Δ |
|---|---|---|---|
| `/layout` | 132.0 | **132.5** | +0.5 |
| `/page` | 102.9 | 102.9 | — |
| `/modulos/[slug]` | 134.2 | **133.0** | −1.2 |
| `/modulos/[slug]/tarjetas` | 136.7 | **135.6** | −1.1 |
| `/modulos/[slug]/practica` · `/quiz` | 145.1 | 145.1 | — |
| `/repaso` | 144.5 | **143.7** | −0.8 |
| `/simulacros` | — | **107.0** | nueva |
| `/simulacros/bloque/[bloqueId]` · `/final` | — | **147.7** | nuevas |

El dato que importa no es ninguno de esos: es el que **no** ocurrió. `OcultaEnSimulacro` vive en `Shell`, así que metió `almacenamiento.ts` en el grafo del layout raíz y `/layout` subió a **148.4 kB gz** (+16.4 en **todas** las rutas, incluida la portada). Diagnosticado con sondas —`grep "exactamente 4 opciones"` y `grep "ZodError"` sobre los chunks de carga ansiosa— y resuelto partiendo por consumidor (ADR-021): queda en +0.5. Era exactamente la deuda que `PENDIENTES.md` había aplazado hasta este paso.

**El banco NO viaja en la carga útil RSC.** `/simulacros/final` sirve 34.9 kB de HTML y **cero** cadenas del banco: se carga con `import()` al pulsar «Empezar» (§2.2, permitido explícitamente por ADR-010). Comparar con `/practica`, que con **un** módulo ya pesaba 17.1 kB gz de HTML — con 29 módulos esa vía no escalaba.

**Tres ADR nuevos:** ADR-019 (validar la sesión al leerla, y por qué aquí sí se descarta cuando ADR-017 decidió no hacerlo), ADR-020 (controlador de simulacro aparte), ADR-021 (partición por consumidor).

**Pendiente, declarado y no oculto:** el simulacro **no persiste todavía su `IntentoSimulacro`**. Es la misma decisión que tomó el quiz en el Paso 9 y por el mismo motivo: `desglose` exige `calcularDesglose` de `src/lib/informe.ts`, que nace en el Paso 12. Hoy el intento se cierra, se califica en pantalla y la sesión se borra; falta persistirlo y enlazar a `/resultados/[intentoId]`. Anotado en `PENDIENTES.md`.

### Revisión del `code-reviewer` — mismo día

**APROBADO CON RESERVAS**, sin bloqueantes. Detalle en `REVISIONES.md`. Se aplicaron cuatro arreglos a raíz de sus hallazgos:

- **R1** — un reloj hacia atrás o un `iniciadoEnMs` **futuro** congelaban el auto-envío: la sesión pasaba Zod y `seAcabo()` devolvía `false` indefinidamente. Es la misma clase de fallo que ADR-019 cierra, por una puerta que la campaña de mutación no cubría. Cerrado con `inicioCoherente()`, aplicada en la reanudación.
- **R2** — `Viabilidad.exacto` no lo consumía nadie. Ahora la portada no ofrece empezar con `exacto === false`, y tres tests fijan el contrato para el Paso 13.
- **R3** — dos simulacros seguidos repetían **5 de 10** ítems: `itemsRecientes` estaba en la firma del motor y no lo llamaba nadie. Cableado.
- **M2** — `empezar()` revalida la viabilidad, alcanzable desde el diálogo de reanudar.

Suite 529 → **536**. Los dos mutantes de los arreglos nuevos mueren (1 y 3 tests).

**Lección de proceso, anotada porque costó tiempo al revisor:** la rama no tenía commits y editué `simulacro-en-curso.tsx` a mitad de su revisión, así que tuvo que descartar una tanda de compuertas y repetirlas. **El próximo paso se comitea antes de pedir revisión.**

---

## [2026-07-30 23:40] · accessibility-auditor · Paso 11

**Qué audité:** el cronómetro y el panel de navegación del simulacro, con el resto de
la pantalla como contexto — `cronometro-visual.tsx`, `panel-navegacion.tsx`,
`simulacro-en-curso.tsx`, `portada-simulacro.tsx`, `dialogo-reanudar.tsx`,
`simulacro-sin-red.tsx`, `oculta-en-simulacro.tsx` y las tres rutas de `/simulacros`.

**Cómo lo probé:** Playwright + Chromium sobre **build de producción** en :3210 (el
`dev` reventaba con `__webpack_modules__ is not a function` al recargar sobre el
`import()` del banco). axe-core 4.x (wcag2a/2aa/21a/21aa/22aa) en 4 pantallas × 2 temas
= **0 violaciones**. Recorrido de teclado real con `Tab` y **espera de 320 ms** para
leer el foco ya asentado. Anchos 375×780, 375×667, 375×640 y 188×390 (375 px al 200 %).
Contraste por composición alfa en oklch, contrastado contra los colores computados en
el navegador. `prefers-reduced-motion: reduce`.

**Cómo provoqué la pantalla en curso** (hoy ningún simulacro es armable): **sembrando
`localStorage['idoneo2210:sesion']`** con una sesión de `tipo:'bloque', ambito:'C'` y
los 28 ids de C5, y entrando por «Continuar donde iba». La vía `continuar()` no
comprueba viabilidad, así que **no hizo falta tocar ni contenido ni código**. Variando
`iniciadoEnMs` se ejercitaron los tres estados del cronómetro y el auto-envío.

**Hallazgos:** Crítico 0 · Serio 1 · Moderado 3 · Menor 4.

**Bloqueantes:** ninguno. El Serio (A-29) no impide terminar el simulacro: los botones
«Anterior/Siguiente» llegan a cualquier ítem.

**Contraste:** todos los tokens del cronómetro pasan AA en los dos temas sobre su
superficie real, que es `--background` y no `--card` (A-36). Único fallo: `--aviso`
como texto sobre `--accent` en tema claro, **4.01:1** (A-30), en la ficha de
`/simulacros`, no en el cronómetro.

**Pendiente:** `SimulacroSinRed` no se pudo ejercitar en runtime (solo se alcanza si el
`import()` del banco rechaza, y el chunk ya estaba cacheado); auditado por código.
La cuadrícula de 100 celdas se midió **clonando celdas en vivo**, no con un banco real.

### Auditoría del `accessibility-auditor` — mismo día

**axe-core: 0 violaciones** en 4 pantallas × 2 temas. Los ocho hallazgos salieron de medición manual, que es la única forma de encontrarlos.

**Tres incumplimientos AA reales, los tres corregidos:**

- **A-29 · 2.4.11** — a 375×667, **14 de las 28 celdas** del panel quedaban **totalmente tapadas** por la barra inferior fija al recibir el foco. Una línea de `scroll-padding-bottom` en `globals.css`. `.pb-nav` no podía arreglarlo: rellena el final de la columna, no la ventana de desplazamiento. Con 100 ítems empeoraría.
- **A-30 · 1.4.3** — `text-aviso` sobre `--accent` mide 4,01:1 en el «faltan 72 ítems» de la ficha al pasar el puntero.
- **A-31 · 2.4.6** — el peor de producto, no solo de accesibilidad: al cerrar un simulacro el titular decía **«Terminaste la práctica»**, el botón «Repetir la práctica», y **el puntaje no se mostraba**. `'suelta'` caía en la rama de la práctica. Y ese `<h2>` es el elemento que **recibe el foco en el auto-envío**: tras 120 minutos de examen era lo primero que oía quien usa lector, y el usuario cerraba sin saber su porcentaje.

**Las cinco mejoras también se aplicaron**: foco al entrar (A-32), nombre para la segunda región viva (A-33), la marca del panel pasa de un punto de 4 px a una barra de 10×3 —«respondida» y «marcada» miden 1,04:1 **entre sí** en claro (A-34)—, encabezado real en `SimulacroSinRed` (A-35) y la superficie del cronómetro corregida a `--background` con sus cifras (A-36).

**Los cuatro puntos que se le pidieron, respondidos con medición:**

- **El reparto del cronómetro funciona.** `MutationObserver` durante 12 s cruzando el umbral de 10 min: **exactamente 2 mutaciones** —el `aria-label`, que es mudo, y **un** texto en la región de avisos—. Sin doble anuncio. En 7 s la cifra pasó por `44:59…44:53` y el label no se movió de «Quedan 45 minutos».
- **Contraste**: los tres estados del cronómetro pasan AA en los dos temas. `text-aviso` como texto queda justificado; su único fallo estaba en otra superficie.
- **Panel**: celda 36×36 medidos, `gap` 8 px, 7 por fila a 375 px. **D-8 está bien gastada**: 100 celdas son 652 px y 15 filas, contra ~876 px y 17 filas con celdas de 44.
- **Teclado**: orden de foco = orden visual, sin trampas, contorno de 2 px sólido a `--ring` (6,37:1 claro · 7,15:1 oscuro) en los 40 enfocables. El pie oculto sale del recorrido de `Tab` **y reaparece al terminar**.

**Un falso positivo que dejó documentado y vale para todo el proyecto:** midió el contorno de foco en 2,26:1 y no lo es — los enfocables llevan `transition-colors duration-150`, que **también anima `outline-color`**, y la lectura caía dentro de la transición. Con 320 ms de espera el valor asentado es `--ring` al 100 %. Toda medición de foco en esta app tiene que esperar a que la transición termine.

Suite final **537**. Los tres mutantes de los arreglos (foco al entrar, `inicioCoherente`, `exacto`) mueren.

---

## [2026-07-30] · software-architect · Resolución del M1 del Paso 11 — la regla de las 300 líneas

**Qué revisé:** `CLAUDE.md` §21 «Reglas de código» punto 1, su historial de aplicación en los pasos 9, 10 y 11, y la cita que hace de ella ADR-020. Sin tocar código: la intervención es documentación y una regla.

**Veredicto:** APROBADO CON CAMBIOS — la regla se conserva con el mismo número y se le fija la unidad que le faltaba.

**Desvíos detectados:**

- **La unidad no estaba definida, y por eso la regla solo se podía invocar, nunca cumplir ni aplicar.** Tres mediciones honestas de `mazo-tarjetas.tsx` dieron 424 (`wc -l`), 300 (conteo a mano), 282 (`sed`/`awk`) y 294 (ESLint `max-lines`). Ese es el mecanismo de la queja del usuario, no el número.
- **ADR-020 citó la regla en un sentido que su letra no soporta**: proyectó el tamaño del componente fusionado en líneas totales y lo comparó contra un límite que solo tiene sentido en líneas de código. Con la unidad fijada, el argumento y el resultado sí cierran (fusionado ~500 de código; las dos mitades en 271 y 259).
- **La regla nunca decidió una partición de verdad.** Las dos que ocurrieron se decidieron por divergencia de ciclos de vida (ADR-020) y por peso medido del bundle (ADR-021). Queda escrito que el límite es un indicador que obliga a mirar el archivo, no un criterio de diseño.

**Decisión (ADR-022):** el número sigue en **300** y la unidad pasa a ser **líneas de código**, `skipComments` + `skipBlankLines`, tal como las cuenta ESLint `max-lines`. Alcance `src/components/**` (salvo `ui/`), `src/hooks/**`, `src/app/**`; fuera `content/**` (datos: el banco de C5 son 594 líneas de código y 28 módulos van a copiar esa forma), `src/lib/**` (motores copiados por §22 regla 2 — `simulacro.ts` 306, `almacenamiento.ts` 298) y los tests (`simulacro.test.ts`, 925).

**Por qué no se movió el número:** medido bien, ya era el correcto. El mayor archivo del alcance mide 414 y el segundo 294; **no hay nada entre medias**. Subirlo a 400 o 450 habría ratificado el statu quo con un número de aspecto técnico; contar líneas totales habría gravado el comentario, que es un rasgo cultivado del proyecto (`cronometro.ts`: 172 totales, 73 de código).

**Verificación:** `npx eslint --rule '{"max-lines":["error",{"max":1,…}]}'` sobre todo el repositorio, que es también la herramienta que definirá la unidad. `npm run typecheck`, `npm run lint` y `npm test` en verde — el diff son cuatro archivos markdown, nada que compile.

**Archivos:** `.claude/ARQUITECTURA.md` (ADR-022 nuevo + enmienda dentro de ADR-020), `CLAUDE.md` (línea 6350, sexta edición del blueprint, autorizada por el usuario), `.claude/PENDIENTES.md`, `.claude/BITACORA.md`.

**Pendiente para el siguiente paso:**

- **Paso 12 — `controlador-repaso.tsx` (414) es el único incumplidor y no se acepta con excusa.** Se extrae `SesionRepaso` (~250 líneas, ya separada por nombre dentro del archivo) y **acto seguido se enciende `max-lines` en `eslint.config.mjs`**. No se encendió ahora porque con 414 dejaría el lint rojo, y las dos salidas para evitarlo son las dos formas de recrear la enfermedad. **Hasta esa línea, la regla sigue siendo de honor.**
- **Sin paso asignado — pregunta abierta al usuario:** la otra mitad de la regla 1, «un componente por archivo», tampoco describe la práctica (`repaso-vacio.tsx` exporta 7). No se decidió sin autorización.

### Cierre de la regla 1 — 2026-07-31

El usuario resolvió la mitad que ADR-022 había dejado abierta: **«un componente EXPORTADO por archivo»**, porque los auxiliares locales no son componentes públicos. `CLAUDE.md` §21 regla 1 editada con esa palabra.

Es la lectura que hace la regla cierta *y* la única que la deja en pie: con la redacción vieja, cumplirla habría exigido partir en archivos sueltos los subcomponentes locales de `controlador-sesion.tsx` (define 5, exporta 1) y `mazo-tarjetas.tsx` (define 4, exporta 1) — empeorar el código para satisfacer la letra.

**El barrido tras la edición encontró DOS incumplidores, no uno.** El `software-architect` había nombrado solo `repaso-vacio.tsx` (6 exportados); falta `items/opcion-unica.tsx` (2: `GrupoOpcionUnica` y `OpcionUnica`). Los dos suben a `PENDIENTES.md` como obligación del Paso 12, **sin prejuzgar el arreglo**: la pareja de `opcion-unica.tsx` es cohesiva y la consumen varios tipos de ítem, así que puede tocar partirla o puede merecer una excepción registrada. Eso se decide mirando el código.

La compuerta de ESLint sigue apagada y el usuario lo ratificó con el argumento del arquitecto: subir el número o poner un `eslint-disable` serían las dos formas de recrear el problema recién cerrado. Se enciende en el Paso 12 con los tres incumplimientos resueltos. Y `max-lines` cubre **solo la primera mitad** de la regla: a la de «un componente exportado» no se le inventa una comprobación automática, porque distinguir un componente de un helper exportado exige criterio.

**Paso 11 aprobado por el usuario.** Los dos aplazamientos quedan ratificados: persistir el `IntentoSimulacro` exige `informe.ts` del Paso 12, y `SimulacroSinRed` va al 18.10 junto a `error.tsx`.

---

## Paso 12 — Motor de informe y `/resultados/[intentoId]` — 2026-07-31

**Estado:** ✅ Completado
**Rama:** `paso-12-informe`

**Archivos creados**

| Archivo | Qué es |
|---|---|
| `src/lib/informe.ts` | §7.5 + lectura defensiva del desglose (ADR-023) |
| `src/app/resultados/[intentoId]/page.tsx` · `src/app/progreso/page.tsx` | las dos rutas |
| `src/components/informe/vista-informe.tsx` | orquesta: lee el intento, construye el informe |
| `informe/veredicto-informe.tsx` | puntaje, veredicto y la nota de COLEF |
| `informe/tabla-dominio.tsx` · `grafica-dominio.tsx` · `barras-dominio.tsx` | la fuente, el SVG diferido y el compositor (ADR-024) |
| `informe/patrones-informe.tsx` · `temas-prioritarios.tsx` · `dominio-modulo.tsx` · `revision-items.tsx` | las cuatro secciones |
| `src/components/progreso/panel-progreso.tsx` | historial de intentos y módulos |
| `src/components/sesion/sesion-repaso.tsx` | extraído del controlador (ADR-022) |
| `src/components/sesion/repaso/*.tsx` (6) | `repaso-vacio.tsx` partido: un componente por archivo |
| `src/components/items/grupo-opcion-unica.tsx` | extraído de `opcion-unica.tsx` |
| `src/lib/__tests__/informe.test.ts` | 42 tests |

**Verificación.** Cinco compuertas en verde: `typecheck` · `lint` · **579 tests** (537 → 579) · `build` · `canario`.

**Campaña de mutación — 4 mutantes, 4 muertos.** El cuarto es el que importa: **`porBloque` revertido a `z.record` sobrevivió** en la primera pasada, o sea que ADR-023 no tenía guarda. Se añadieron 4 tests que fijan el esquema y entonces sí murió. Un test escrito después de ver sobrevivir al mutante es el único que se sabe con dientes.

**Las cuatro obligaciones heredadas, cerradas.** Detalle en `PENDIENTES.md`. La que más código movió fue la regla 1: `controlador-repaso.tsx` baja de **414 a 170** líneas de código extrayendo `SesionRepaso`, `repaso-vacio.tsx` se parte en seis archivos y `GrupoOpcionUnica` sale a uno propio. **La compuerta `max-lines` queda encendida**, que era la mitad que ADR-022 no pudo cerrar en su momento: verificada por mutación —con `max: 150` salta en 16 archivos— y en verde a 300.

**Sobre `opcion-unica.tsx`, que era la decisión abierta:** `PENDIENTES.md` pedía decidir mirando el código, no contando exports, y mirándolo no hacía falta excepción — `GrupoOpcionUnica` lo consume `caso.tsx`, así que tiene consumidor externo y es público por derecho propio. **El criterio queda escrito** para el próximo caso: un componente con consumidor fuera de su archivo es público; uno que solo usa el archivo que lo define es un auxiliar y puede convivir.

**Los dos requisitos de producto**

- **El veredicto dice que los cortes son criterio interno.** `NOTA_VEREDICTO` va pegada al veredicto, no en un pie, y con un test que falla si alguien la suaviza o si un mensaje empieza a hablar de «aprobado». La app no conoce el corte real de COLEF: afirmarlo sería la clase de cosa que §22 regla 11 prohíbe, sobre la decisión más cara que toma el usuario.
- **La detección de patrón funciona y puede callarse.** Recuerdo alto con aplicación baja produce «te sabes las definiciones pero no las estás aplicando; haz la Práctica». Con los tres niveles parejos devuelve `[]` y la sección lo dice en vez de rellenar: un informe que siempre encuentra algo enseña a no leerlo.

**Peso — js gz por ruta**

| Ruta | Antes | Después |
|---|---|---|
| `/layout` | 132.5 | **132.4** |
| `/resultados/[intentoId]` | — | **145.6** (nueva) |
| `/progreso` | — | **135.9** (nueva) |
| `/repaso` | 143.7 | 143.8 |
| `/simulacros/final` | 148.3 | 150.1 |

El dato del paso: `/resultados` pesaba **244.9 kB gz** con recharts en el bundle —casi 100 más que cualquier otra ruta, en la pantalla que se abre tras dos horas de examen y muchas veces en 4G—. Diferirlo la deja en **145.6**, y solo es defendible porque la **tabla es la fuente**: el desglose se ve entero sin esperar, y si la gráfica no llega no falta ningún dato (ADR-024).

**Dos ADR nuevos:** ADR-023 (el esquema exige las claves que el informe lee, y por qué eso no contradice ADR-017) y ADR-024 (la tabla es la fuente, recharts diferido).

## [2026-07-31 19:20] · accessibility-auditor · Paso 12 (alcance acotado)

**Qué audité:** solo el dominio por bloque de `/resultados/[intentoId]` —
`src/components/informe/grafica-dominio.tsx`, `tabla-dominio.tsx` y
`barras-dominio.tsx`. Alcance acotado por el usuario a las gráficas de recharts y
a lo inseparable de ellas; el resto del informe **no se auditó**.

**Cómo lo probé:** dos builds de producción (`npm run build` + `next start`,
nunca `dev`) · Playwright sobre Chromium · estado sintético con **dos** intentos
`final`/`global` sembrado con `addInitScript`, diseñado para que los cuatro casos
de la columna «Cambio» (`+30` · `-40` · `0` · `—`) salgan en una sola pantalla,
pasando `esqEstadoProgreso` entero con las cuatro claves de bloque de ADR-023 ·
claro y oscuro × 375 px y 1280 px · `prefers-reduced-motion: reduce` · el chunk de
recharts **retenido** y **abortado** por separado · axe-core 4.x acotado a la
sección · árbol de accesibilidad real · esperas de 1400 ms por la lección de
`transition-colors` del Paso 11.

**Hallazgos:** **Crítico 1** (A-39) · Serio 1 (A-37) · Moderado 1 (A-38,
arreglado durante la auditoría) · Menor 0.

**Bloqueantes:** A-39 — al arreglar A-38 se quitó `loading: () => null` del
`dynamic()`, y con eso se perdió la absorción del `ChunkLoadError`. Si el chunk de
recharts **falla** (no si tarda), la ruta entera cae a `error.tsx`: 0 encabezados,
0 tablas, «Esta pantalla no se pudo mostrar» después de dos horas de examen. Es
justo el escenario que ADR-024 dice haber previsto. Arreglo: restituir `loading`
conservando el `minHeight`; son compatibles.

**Contraste:** **todos AA en los dos temas.** Peor caso, barra C sobre el fondo
real: 4.84:1 claro / 8.02:1 oscuro (umbral 3.0 de 1.4.11). Etiqueta de valor
17.03:1 / 15.22:1 — se dibuja fuera de la barra, sobre el fondo de página, así
que no depende del bloque. Los cuatro deltas de la tabla entre 5.03:1 y 6.95:1.
Ningún token necesita corrección; **nada que pasar al `ui-designer`**.

**Lo que se confirmó:** el `aria-hidden` sobre el SVG es correcto — no aparece en
el árbol de accesibilidad, no contiene enfocables, y la tabla es superconjunto
estricto de la gráfica (añade `aciertos/total` y el delta, con `—` para «no
comparable»). El signo textual del delta basta como portador no cromático. La
letra del eje Y distingue los bloques sin color. `isAnimationActive={false}`
verificado en runtime: cero nodos `<animate>` en todas las corridas, también sin
`reduce`. La reserva de altura de A-38 quedó exacta (621 px de sección y tabla en
1361 px, con gráfica y sin ella).

**Correcciones de método, anotadas en ACCESIBILIDAD.md:** Chromium devuelve
`oklch()` desde `getComputedStyle` y hay que rasterizar en `<canvas>` para medir
contraste (mi primera corrida dio 1.03:1 en todo y el fallo era mío) · hay dos
tablas en el informe y la de nivel cognitivo va antes en el DOM · un `next start`
viejo sobrevive a `rm -rf .next` y ensucia la medición con 400 y 404 ·
`route.continue()` corrompe las URLs con corchetes · retener un chunk y abortarlo
son pruebas distintas, y ahí estaba el hallazgo Crítico.

**Pendiente:** A-39 (Crítico) y A-37 (Serio) abiertos. El `layout-shift` residual
de 0.393 es del cambio `<Esqueleto/>` → informe en `vista-informe.tsx`, **no** de
recharts (idéntico con gráfica y sin ella); queda fuera de alcance y sin hallazgo.
Sin auditar del Paso 12: veredicto, patrones, temas prioritarios, dominio por
módulo y revisión ítem por ítem. `radius={2}` en `<Bar>` contradice §4.5 de
`DISENO.md`; derivado al `ui-designer`, no es accesibilidad.

---

## Paso 13 — Diagnóstico y plan de estudio — 2026-07-31

**Estado:** ✅ Completado · **Rama:** `paso-13-diagnostico`

**Archivos creados:** `src/lib/plan.ts` (§7.6 + `DIAS_SIN_FECHA` y `diaVigente`), `src/app/diagnostico/page.tsx`, `src/app/plan/page.tsx`, `src/components/plan/vista-plan.tsx`, `src/lib/__tests__/plan.test.ts` (32 tests), `src/components/plan/__tests__/vista-plan.test.tsx` (5).

**Modificados:** `src/lib/censo.ts` (+`censarModulosPara`), `src/lib/simulacro.ts` (`CensoModulo.filtradoPara`, `exacto` real), `src/components/sesion/controlador-simulacro.tsx` (+`destinoCierre`).

**Compuertas:** typecheck · lint · **636 tests** (593 → 636) · build 136 páginas · canario · validar.

**Campaña de mutación — 5 mutantes, 5 muertos.** El cuarto sobrevivió a la primera pasada y es el interesante: poner a **cero** el factor de los módulos dominados no mataba ningún test, porque el que había solo comprobaba que el módulo *siguiera en el plan* — y con factor 0 sigue, solo que al final. La distinción real es que un dominado del bloque C debe ir **por delante** de uno del mismo bloque que el diagnóstico dice casi perfecto (0.099 contra 0.033). Con ese test, el mutante muere.

**La obligación heredada, cerrada (ADR-025).** `diagnosticarViabilidad` ya no devuelve una cota superior cuando el blueprint filtra: `censarModulosPara` cuenta en el servidor aplicando el filtro del blueprint y marca el censo con su id. De las dos salidas que proponía `PENDIENTES.md` se eligió contar en el servidor, porque la conjunta tipo × dificultad multiplicaba por 21 lo que cruza la frontera y esta no cambia nada: sigue siendo un número por módulo.

**El diagnóstico reutiliza `ControladorSimulacro`, y no es pereza.** El diagnóstico **es** un simulacro cronometrado: mismo muestreo, mismo reloj, misma persistencia, misma reanudación, mismo auto-envío. Lo único que cambia son tres datos que ya viajaban por prop. `guardarIntento` pone `diagnosticoHecho` al ver `tipo: 'diagnostico'` (§6), así que el hito no necesitó código.

**Un defecto que solo cazó el build**, y por eso el build es compuerta: la primera versión pasaba `alCerrar` como **función** desde la página al controlador. Typecheck y lint en verde, tests en verde, y el prerender falló con «Functions cannot be passed directly to Client Components». Es una prop serializable ahora (`destinoCierre`), y el porqué queda escrito en el tipo para que nadie lo vuelva a intentar.

**Las decisiones del plan, y una que corregí a mitad**

- **Sin fecha de examen el plan sigue existiendo** (`DIAS_SIN_FECHA = 42`) y **lo dice** en sus advertencias, con enlace a Ajustes. Seis semanas no es un número redondo elegido al azar: es el horizonte más corto que no dispara la advertencia de «~N min diarios» desde el primer día, que sería la peor bienvenida posible. Tiene test.
- **Los prerequisitos son restricción dura y la prioridad es blanda.** Aunque C5 sea lo peor del diagnóstico, no puede adelantarse a C1, C2 y C3. Test sobre los 29 módulos reales, no sobre un grafo de juguete.
- **`diaVigente` se documentó de más y se corrigió.** Nació con el comentario «el día que le toca aunque el usuario se haya saltado días», y el test que escribí para eso **falló**: la app regenera el plan con `hoy` en cada visita, así que su día 1 **es** hoy y ese escenario no ocurre. Es una guarda para un `Plan` ya construido consultado con otra fecha, y ahora el comentario dice eso y no más.

**Peso — js gz por ruta**

| Ruta | Antes | Después |
|---|---|---|
| `/layout` | 132.4 | 132.4 |
| `/diagnostico` | — | **150.3** (nueva) |
| `/plan` | — | **134.7** (nueva) |

`/diagnostico` pesa lo mismo que los otros simulacros porque **es** el mismo controlador. `/plan` queda por debajo de las rutas de sesión: no carga banco.

**Nota de frontera declarada:** `/plan` pasa los `Modulo` **completos** por prop, y es la excepción razonada del proyecto a la proyección que hace el informe. `generarPlan` necesita `prerequisitos`, `minutosEstimados`, `orden` y `bloque` de los 29 —no tres campos—, así que proyectar ahorraría poco y obligaría a mantener un tipo paralelo en sincronía con `Modulo`. Lo que ADR-010 prohíbe es el import **estático** desde cliente, que sigue sin ocurrir: el canario está en verde.

### Verificación de accesibilidad — decisión y comprobación propia

**No se invocó al `accessibility-auditor`,** y la razón es la que fijó el usuario: solo si hay interacción nueva sin auditar. `/diagnostico` **reutiliza `ControladorSimulacro`**, cuyo cronómetro, panel de navegación, portada y diálogo de reanudar se auditaron enteros en el Paso 11 (A-29 a A-36); `/plan` son listas de enlaces con los patrones ya verificados en pasos anteriores.

Lo único sin precedente es el **día destacado** del plan, que se marca con borde y fondo de color. Se comprobó a mano, a 375 px y en los dos temas:

| | claro | oscuro |
|---|---|---|
| Encabezados sin saltos de nivel | ✅ 6 | ✅ 6 |
| Enlaces por debajo de 44 px | 0 | 0 |
| El destacado **se dice en texto** («Hoy toca» / «Por aquí ibas»), no solo en color | ✅ | ✅ |

**Y esa comprobación encontró un defecto de copy que ningún test habría cazado.** La portada del diagnóstico decía «hay **14 publicados**», y 14 no son los publicados: C5 tiene **28**. Catorce son los **elegibles** para el diagnóstico una vez aplicado su filtro de tipo y dificultad (ADR-025). El texto se corrigió a «que sirvan para este examen», que es cierto con censo filtrado y sin filtrar.

Es un detalle pequeño y merece decirse en voz alta: la pantalla cuyo trabajo es **decir la verdad sobre lo que hay** estaba dando un número correcto con una etiqueta falsa. La cifra la produjo bien ADR-025; el copy se quedó del paso anterior.

---

## [2026-07-31 02:40] · code-reviewer · Paso 13

**Qué revisé:** `git diff main...paso-13-diagnostico` (90ec8df), 12 archivos: `src/lib/plan.ts`, `src/lib/censo.ts`, `src/lib/simulacro.ts`, `src/app/diagnostico/page.tsx`, `src/app/plan/page.tsx`, `src/components/plan/vista-plan.tsx`, `src/components/sesion/controlador-simulacro.tsx` y sus tests.

**Compuertas:** typecheck ✅ · lint ✅ · test ✅ 636 · validar ✅ 0 errores (87 avisos de contenido en preparación) · build ✅ 136 páginas con `.next` limpio · canario ✅ 32 chunks, frontera intacta.

**Invariantes verificados (comando, no memoria):**
- `grep -rn "Math.random" src/ content/ scripts/` → solo comentarios ✅
- `grep -rn "Date.now()\|new Date()" src/lib/` → solo comentarios y tests ✅; el único reloj del paso es `vista-plan.tsx:43`, dentro de `useEffect` (§10.4) ✅
- `grep -rn "localStorage" src/ --include=*.ts*` fuera de `almacenamiento*` → solo comentarios ✅
- ADR-022: `vista-plan.tsx` 223 líneas de código, `/plan` 39, `/diagnostico` 22 (límite 300) ✅; un componente exportado por archivo ✅
- Frontera servidor→cliente: build en verde con `.next` limpio; `destinoCierre` es objeto serializable ✅

**Sondas ejecutadas (borradas al terminar):** banco fabricado de 29×12 ítems → el diagnóstico reparte **A6·B7·C10·D7 exacto** en 5 semillas, solo `unica`/`emparejar`/`caso`, solo dificultad 1–2, sin repetidos, y **acierta las cuotas de nivel 14/10/6 exactas**. `censarModulosPara(DIAGNOSTICO)` sobre el contenido real → C5 **14 elegibles de 28 publicados**, `exacto: true`, `faltan: 16`. 200 diagnósticos sembrados × 7 horizontes y barrido de horizonte 1–120: **cero violaciones de prerequisito, cero materia nueva en los 3 días reservados, cero días vacíos**. Diagnóstico de punta a punta en jsdom: intento persistido con `tipo:'diagnostico'`, pasa `esqIntento`, sobrevive el round-trip por `localStorage`, `diagnosticoHecho: true`, cierre a `/plan`; sin `destinoCierre`, a `/resultados/[id]`.

**Hallazgos:** 🔴 1 · 🟡 4 · 💭 5
- 🔴 `/plan` pasa los 29 `Modulo` completos al cliente. ADR-010 decide «reducidos al subconjunto serializable que el componente necesita»; la excepción se justifica con «proyectar ahorraría poco» y **medido son 19 054 → 4 674 B raw / 5 583 → 1 126 B gz (−75 %)**. Desvío de un ADR aceptado, registrado solo en comentario y bitácora. **Escalado al `software-architect`.**
- 🟡 **3 mutantes sobreviven con 636/636 en verde**: `censarModulosPara` contando publicados en vez de elegibles (la regresión exacta que ADR-025 existe para impedir), `filtradoPara` sin poner (dejaría el diagnóstico bloqueado para siempre en los pasos 15–17) y `destinoCierre` ignorado (el diagnóstico cerraría a `/resultados`). `censarModulosPara` no tiene ni un test directo y nadie monta `ControladorSimulacro`.

**Veredicto:** APROBADO CON CAMBIOS

**Pendiente antes de cerrar el paso:** decisión del `software-architect` sobre la excepción de frontera de `/plan`; test directo de `censarModulosPara`; test de `destinoCierre`.

### Revisión del `code-reviewer` — Paso 13

**APROBADO CON CAMBIOS.** Los siete puntos del encargo pasaron con sonda ejecutada —incluido un barrido de **200 diagnósticos sembrados × 7 horizontes** y otro de **1 a 120 días** sin un solo contraejemplo de prerequisitos—, y el muestreo del diagnóstico **clava las cuotas de nivel exactas** (14/10/6), no aproximadas.

**El bloqueante era una cifra que me inventé.** `/plan` mandaba los `Modulo` completos al cliente porque escribí que «proyectar ahorraría poco», y **nunca lo medí**: son 4 457 B gz, el **75 %** de la carga útil de la ruta. Corregido (ADR-026), con la sonda de contenido ya en negativo. La lección queda en el ADR: en un proyecto que mide kB gz en cada paso, «ahorraría poco» sin cifra al lado no es justificación.

**Tres mutantes vivos con 636/636 en verde**, y es el hallazgo de fondo:

| Mutante | Qué rompía | Por qué sobrevivía |
|---|---|---|
| `censarModulosPara` ignorando el filtro | **La regresión exacta que ADR-025 existe para impedir**: 28 en vez de 14 | los 7 tests de ADR-025 construyen el censo **a mano** y solo prueban `diagnosticarViabilidad` |
| Sin `filtradoPara` | `exacto` falso siempre → diagnóstico bloqueado **para siempre**, y el fallo solo se vería en los pasos 15–17 | ídem |
| `destinoCierre` ignorado | el diagnóstico cerraba a `/resultados`, perdiendo el titular del paso | **nadie montaba `ControladorSimulacro`** |

Cerrados con `censo.test.ts` (8) y `controlador-simulacro.test.tsx` (5). Los tres mutantes repetidos: los tres mueren.

**Y una corrección incómoda que conviene dejar escrita:** ADR-025 afirmaba «tiene test propio y el mutante muere». Era cierto **solo de la guarda de censo vacío**, no de la función que el ADR titula. Un ADR que declara cobertura obliga a comprobar de qué.

**El remedio del requisito era un enlace roto.** La advertencia «sin fecha» mandaba a `/ajustes`, que **devuelve 404** hasta el paso 18.5 — y un test mío lo fijaba. Se construyó `CampoFechaExamen` **en `/plan`**, que además es lo que pedía el blueprint 13.3 («pide la fecha de examen si falta») y que yo había leído como satisfecho por la advertencia.

**Notas aplicadas:** `server-only` en `censo.ts` (con alias en Vitest, porque el paquete lo resuelve Next y no npm — la barrera del build sigue intacta) y el conteo de tests corregido: `plan.test.ts` son **31**, no 32.

**Peso tras la revisión:** `/plan` 135.3 kB gz de JS y **4 657 B gz** de carga útil RSC. `/diagnostico` 150.3, igual que los simulacros porque es el mismo controlador.

Suite **651** (636 → 651).

---

## Paso 14 — Punto de corte usable — 2026-07-31

**Estado:** ✅ Completado · **Rama:** `paso-14-esqueleto`

**Es el paso que hace la app compartible.** Después de él se le puede mandar el enlace a alguien que no sepa nada del proyecto y que la app le explique sola qué es, qué hay y qué falta.

**Archivos creados:** `src/components/inicio/{panel-inicio,tarjeta-continuar,racha,resumen-inicio}.tsx`, `src/components/modulo/orden-publicacion.tsx`, `src/components/inicio/__tests__/panel-inicio.test.tsx` (12 tests).
**Reemplazado:** `src/app/page.tsx` (la portada provisional del Paso 5).
**Borrados:** los 5 SVG de create-next-app. `public/` queda **vacío** hasta el 18.1.

**Compuertas:** typecheck · lint · **663 tests** (651 → 663) · build 136 páginas · canario · validar.

**La decisión del paso (ADR-027): `/plan` y `/diagnostico` entran por la portada.** Añadirlos a la barra habría reabierto **A-01**, un fallo AA serio que costó una desviación de maquetación cerrar: a 200 % de zoom las cinco celdas ya están en 38 px, y una sexta las deja en ~31. La portada es el destino «Inicio» de esa misma barra, así que no se pierde nada — y de paso deja de ser una pantalla de bienvenida para ser el **hub** que decide qué toca ahora.

**Un defecto que encontró su propio test.** La prioridad de «continuar donde ibas» tiene seis escalones, y los escalones 4 y 6 eran **inalcanzables**: el escalón 3 ofrece el módulo del plan de hoy, y el plan sigue incluyendo los módulos dominados —decisión deliberada del Paso 13, porque repasarlos vale algo—. Así que con C5 dominado la portada mandaba a reestudiarlo en vez de ofrecer la cola de repaso vencida. Corregido: el escalón 3 se salta el módulo del día si ya está dominado. **Lo que está a punto de olvidarse gana a lo que ya se sabe.**

**El «cuándo llega» de los estados vacíos.** Faltaba la tercera pregunta del estado vacío honesto —qué falta, **cuándo llega**, qué se puede hacer hoy—. No hay fecha comprometida y inventarla sería mentir justo en la pantalla que existe para no hacerlo, así que se da lo que sí está decidido: el **orden de producción** de §14.4 (C5 → D → resto de C → B → A). Quien mira un módulo del bloque D sabe que el suyo es lo siguiente; quien mira uno del A sabe que va al final y puede planificar. Más útil que un «pronto» y más honesto que una fecha.

**Peso — js gz por ruta.** `/page` sube de **102.8 a 136.5 kB gz**, y es esperado: la portada pasó de HTML estático a Client Component con estado, plan y SRS. Queda por debajo de las rutas de sesión (144–150) y del layout más su propio código. El resto no se movió.

**Lo que queda para el 18:** `public/` vacío espera los iconos de la PWA, y `/ajustes` sigue en 404 — la portada, a diferencia del pie y de `DESTINOS`, **no** enlaza ahí.

### Revisión del `code-reviewer` — Paso 14

**RECHAZADO**, dos bloqueantes, con las seis compuertas en verde. Detalle en `REVISIONES.md`.

La lección del paso: **una pantalla que decide qué hacer no se valida con compuertas.** Los 663 tests, el build y el canario no detectan que el consejo sea equivocado — solo que el código compila y no revienta. Los dos bloqueantes eran consejos falsos en estados alcanzables:

- **B1** — una sesión de hace tres días producía «el cronómetro sigue corriendo», y como nada limpia esa clave salvo visitar la ruta del simulacro, la portada **se quedaba clavada en ese escalón para siempre**.
- **B2** — el día del examen la portada ofrecía 45 minutos de teoría nueva mientras `/plan`, en la misma app, decía «nada de teoría nueva». Con el examen pasado, idéntico.

Los cinco relevantes también se aplicaron, incluido un **test que no comprobaba lo que su nombre decía** (pasaba igual con el mutante) y `/ajustes`, que era el quinto destino de la barra devolviendo 404 en las 18 rutas justo en el paso que declara la app compartible.

Suite **673** (663 → 673). Cuatro mutantes sobre los arreglos, cuatro muertos.

### Auditoría del `accessibility-auditor` — Paso 14

**axe-core: 0 violaciones** en cinco combinaciones. Los dos incumplimientos AA salieron **a mano**, y ninguno era detectable automáticamente — igual que los dos bloqueantes del `code-reviewer` no los detectaron 663 tests. Dos veces en el mismo paso.

- **A-40 · Serio** — faltaba `scroll-padding-top`: al 200 % de zoom el botón «Hacer el diagnóstico», que es la **única acción principal de la portada**, quedaba oculto al **100 %** al recibir el foco con Shift+Tab. Es la mitad que faltaba del arreglo de A-29: en el Paso 11 se tapó la banda de abajo y se dejó la de arriba. Verificado tras el arreglo: **0 % en los tres tamaños**.
- **A-41 · Moderado** — el detalle de los dos destinos caía a **4,44:1** en hover sobre tema oscuro, porque el `<span>` declara su color y gana sobre el heredado. Ahora **10,93:1**.
- **A-42 y A-44** también corregidos: la cifra `0/1` no se pronunciaba «0 de 1» en ningún lector, y `/diagnostico` aparecía dos veces en la primera pantalla del usuario nuevo.

**Lo que confirmó, y era el riesgo de ADR-027: A-01 no se ha reabierto.** A 188 px la barra sigue con cinco destinos de **37,59 px**, todos enteros. Una sexta celda los dejaría en ~31. La decisión de meter `/plan` y `/diagnostico` por la portada se sostiene con la medición.

Suite **675**.

## [2026-07-31 21:05] · technical-writer · Paso 15 (parcial: D1 y D2)

**Qué escribí:**
- `content/teoria/d1-conceptualizacion.mdx` · `content/tarjetas/d1-conceptualizacion.ts` · `content/banco/d1-conceptualizacion.ts`
- `content/teoria/d2-carga.mdx` · `content/tarjetas/d2-carga.ts` · `content/banco/d2-carga.ts`
- `/tmp/glosario-d1-d2.ts` — 6 entradas de glosario, fuera del repo para que las integre el `minimal-change-engineer`
- `.claude/CONTENIDO.md` — filas de d1 y d2 y línea de totales

**Conteo entregado:** teoría sí (los 2) · 30 tarjetas (15 + 15) · 50 ítems (25 + 25) · 6 términos de glosario.

**Reparto de los ítems:**
- **d1-conceptualizacion** — nivel 11 recuerdo (44 %) / 8 comprensión (32 %) / 6 aplicación (24 %) · dificultad 5·13·7 · 6 tipos: 14 única, 3 caso, 3 emparejar, 2 ordenar, 2 múltiple, 1 V/F. `verificarCuotas` con `CUOTAS` en verde.
- **d2-carga** — nivel 11 / 8 / 6 igual · dificultad 5·14·6 · 7 tipos: 12 única, 4 cálculo, 3 caso, 2 múltiple, 2 emparejar, 1 ordenar, 1 V/F. `verificarCuotas` en verde.
- Los 4 ítems de cálculo de D2 cubren densidad (30/60 → 33,3 %), densidad de circuito (45/15 → 75 %), tonelaje (4×8×60 → 1920 kg) y carga de sesión (RPE 7 × 75 min → 525 UA).

**Erratas o datos duros nuevos:** ninguno. Los datos duros existentes quedan cubiertos por tarjetas: DD-090, DD-091 y DD-092 en d2; DD-100 y DD-101 en d1.

**Datos verificados que van más allá del temario mínimo (ADR-014), enseñados sin anunciar discrepancia:**
- Ley 2210 sancionada el **23 de mayo de 2022** (dato ya verificado en `CONTENIDO.md`, reutilizado sin volver a derivarlo).
- **Escala de Borg**: la original va de **6 a 20** y la **CR-10 de 0 a 10**. La equivalencia «RPE × 10 ≈ FC» se enseña como aproximación calibrada en adultos jóvenes sanos, con su límite explícito (edad, betabloqueantes, calor, deshidratación). Enseñar solo «la escala de Borg» sin distinguir las dos versiones deja al usuario sin poder resolver el cálculo de carga de sesión.
- **Carga de sesión = RPE (0–10) × minutos**, en unidades arbitrarias. Es la vía de cuantificar carga interna sin instrumentación y sostiene el ítem D2-023.
- **Densidad**: se enseña con el denominador correcto (trabajo + descanso) y se añade la regla `1 ÷ (1 + n)` para la notación de relación trabajo:descanso, porque el error de campo es dividir 1 entre n.

**Dudas de fuente:** ninguna que bloquee. Dos decisiones de alcance que dejo anotadas por si se quieren estrechar:
1. Los subtemas de `referencia` (Cartilla 4, Tema 1, Subtemas 1.1–1.6 y Tema 2, Subtemas 2.1–2.6) los asigné por coherencia temática con la estructura del bloque. Si la numeración real de la Cartilla 4 difiere, es un renombrado mecánico de un campo, sin tocar contenido.
2. El módulo D1 **no lleva ítems de cálculo**: es un módulo conceptual (definiciones, componentes, fases, niveles) y cualquier cálculo saldría forzado. Cumple con 6 tipos distintos, muy por encima del mínimo de 4, y D2 aporta 4 ítems de cálculo, así que el bloque D no queda corto de ese tipo para el blueprint final.

**Pendiente (no es mío, es del `minimal-change-engineer`):**
- Cablear `d1-conceptualizacion` y `d2-carga` en `content/banco/indice.ts` y `content/tarjetas/indice.ts`.
- Integrar los 6 términos de `/tmp/glosario-d1-d2.ts` en `content/glosario.ts`. **No** duplicar `Densidad` ni `Escala de Borg (RPE)`, que ya existen.
- Pasar los dos módulos a `estadoContenido: 'completo'` en `content/estructura.ts`.
- Cerrar la columna **Validado** en `.claude/CONTENIDO.md`.
- Faltan los 6 módulos restantes del bloque D: D3, D4, D5, D6, D7 y D8.

## [2026-07-31 · paso 15] · technical-writer · Bloque D — d5-velocidad y d6-flexibilidad

**Qué escribí:**
- `content/teoria/d5-velocidad.mdx` · `content/tarjetas/d5-velocidad.ts` · `content/banco/d5-velocidad.ts`
- `content/teoria/d6-flexibilidad.mdx` · `content/tarjetas/d6-flexibilidad.ts` · `content/banco/d6-flexibilidad.ts`
- `/tmp/glosario-d5-d6.ts` (7 entradas, fuera del repo: `content/glosario.ts` no se toca aquí)
- Filas de d5 y d6 en `.claude/CONTENIDO.md`

**Conteo entregado:** teoría sí (los dos) · 15 + 15 tarjetas · 25 + 25 ítems · 7 términos de glosario.

**Reparto de los ítems** (idéntico en los dos módulos, verificado con `verificarCuotas(CUOTAS)`):
- Nivel: 11 recuerdo (44 %) · 8 comprensión (32 %) · 6 aplicación (24 %) — cuotas 40/30/20.
- Dificultad: 6 de nivel 1 · 12 de nivel 2 · 7 de nivel 3 — mínimo 3 de cada una.
- Tipos: 13 única · 3 caso · 3 cálculo · 2 múltiple · 2 emparejar · 1 ordenar · 1 V/F — los 7, mínimo 4.
- `npm run validar` en verde y `tsc --noEmit` limpio. Los avisos de blueprint para d5/d6 siguen
  ahí porque el contenido aún no está cableado en los índices: eso es del `minimal-change-engineer`.

**Erratas o datos duros nuevos:** ninguno añadido a `content/datos-duros.ts` (no me corresponde tocarlo
en este paso). Sí quedan candidatos claros para cuando se abra ese archivo: los parámetros del
estiramiento estático (10–30 s por repetición, ~60 s acumulados por grupo muscular), el protocolo de
FNP mantener-relajar (10 s / 6 s isométricos submáximos / 10–30 s), el umbral de salida falsa de
0,100 s y la relación trabajo:descanso 1:12–1:20 del trabajo aláctico.

**Aplicación de ADR-014 — dónde enseñé el dato verdadero sin anunciar discrepancia:**
- **Estiramiento estático:** 10–30 s por repetición y ~60 s acumulados por grupo muscular. No los
  "6–12 s" ni los "3 s" que circulan en material de curso: por debajo de 10 s no se produce el efecto
  y pasar de 30 s en una repetición no aporta nada extra.
- **FNP:** contracción isométrica **submáxima de ~6 s**, no máxima ni de 20 s. El efecto es el mismo y
  el riesgo, menor. El rango se gana en el estiramiento posterior, no en la contracción (ítem D6-024).
- **Mecanismo del FNP:** enseño la inhibición autógena (OTG, reflejo miotático inverso) y la
  recíproca, que es lo que se pregunta, y añado en la teoría que la mayor parte de la ganancia aguda
  es aumento de la **tolerancia al estiramiento**, no relajación refleja.
- **Estático antes de potencia:** el estático prolongado (>60 s por grupo) inmediatamente antes de un
  esfuerzo de fuerza/potencia/velocidad **baja el rendimiento** agudamente; por debajo de 60 s el
  efecto es trivial. De ahí que el calentamiento lleve dinámicos (ítems D6-015 y D6-023).
- **Estiramiento y lesiones:** no está demostrado que prevenga lesiones musculares ni que quite
  agujetas; lo que reduce lesiones es el trabajo de fuerza, sobre todo excéntrica (ítem D6-019).
- **Sit and reach:** el resultado depende de dónde tenga el cero el cajón — planta del pie en la
  versión clásica (admite negativos) o 23 cm en la calibrada. Ítems D6-017 y D6-020.
- **Salida falsa:** 0,100 s es el **umbral reglamentario**, no el tiempo de reacción de nadie; el real
  de un velocista de élite está en 0,12–0,20 s.
- **Velocidad resistida:** la carga no debe frenar más de un ~10 % la velocidad normal si se busca
  transferencia; con más, cambia el patrón de carrera.

**Dudas de fuente:** ninguna que bloquee. Dejo señalado que los subtemas de referencia usan la
numeración `Cartilla 4, Tema 3, Subtema 3.3.x` (velocidad) y `3.4.x` (flexibilidad), coherente con
tratar el Tema 3 de la Cartilla 4 como el de capacidades físicas. Si al escribir d3 y d4 se fija otra
numeración para fuerza y resistencia, hay que alinear las referencias de los cuatro módulos.

**Pendiente (del `minimal-change-engineer`, no mío):** cablear d5 y d6 en `content/banco/indice.ts` y
`content/tarjetas/indice.ts`, integrar las 7 entradas de `/tmp/glosario-d5-d6.ts` en
`content/glosario.ts`, pasar los dos módulos a `estadoContenido: 'completo'` y cerrar la columna
**Validado** de `.claude/CONTENIDO.md`.

## [2026-07-31 18:40] · technical-writer · Paso 15 — bloque D, módulos D7 y D8

**Qué escribí:**
- `content/teoria/d7-modelos-planificacion.mdx` · `content/tarjetas/d7-modelos-planificacion.ts` · `content/banco/d7-modelos-planificacion.ts`
- `content/teoria/d8-estructuras.mdx` · `content/tarjetas/d8-estructuras.ts` · `content/banco/d8-estructuras.ts`
- `/tmp/glosario-d7-d8.ts` (7 entradas, fuera del repo — las inserta el `minimal-change-engineer`)

**Conteo entregado:** teoría sí (los 2) · 30 tarjetas (15 + 15) · 50 ítems (25 + 25) · 7 términos de glosario.

**Reparto de los ítems** (verificado ejecutando `verificarCuotas(items, CUOTAS)` contra el módulo real, no a ojo):
- **d7-modelos-planificacion** — nivel 11 recuerdo (44 %) / 8 comprensión (32 %) / 6 aplicación (24 %) · dificultad 6·12·7 · los 7 tipos: 13 única, 3 caso, 2 emparejar, 2 múltiple, 2 ordenar, 2 cálculo, 1 V/F. Explicación más corta: 414 caracteres.
- **d8-estructuras** — nivel 11 / 8 / 6 igual · dificultad 7·12·6 · los 7 tipos: 13 única, 3 caso, 2 emparejar, 2 ordenar, 2 múltiple, 2 cálculo, 1 V/F. Explicación más corta: 377 caracteres.
- **Cálculos de D7:** bloques ATR que caben en la temporada (4+3+2=9 semanas en 36 → 4 bloques, es decir 4 picos) y reparto porcentual de los períodos del macrociclo tradicional (40 semanas al 60/30/10 → el preparatorio dura 12 semanas más que el competitivo).
- **Cálculos de D8:** mesociclos de un macrociclo (28 ÷ 4 = 7) y porcentaje que ocupa la parte principal de una sesión (90 − 15 − 10 = 65 → 72,2 %).
- **Los 4 ordenar** son el tipo que mejor encaja en estos dos módulos y por eso van 2 en cada uno: en D7, las etapas del macrociclo tradicional y las fases del bloque ATR; en D8, la jerarquía de estructuras de mayor a menor y los momentos de la sesión.
- **El par de distractores natural se explota en los dos módulos:** en D7, tradicional contra contemporáneo (D7-004, D7-012, D7-014, D7-015, D7-019, D7-020); en D8, cruzar los niveles de estructura entre sí (D8-002, D8-003, D8-008, D8-013, D8-017, D8-018).

**Erratas o datos duros nuevos:** ninguno. D7 y D8 no tienen entradas propias en `content/datos-duros.ts`; las cifras que sí se memorizan (duraciones de las estructuras, partes de la sesión, picos por modelo) quedan cubiertas por tarjeta y por ítem.

**Datos verificados que van más allá del temario mínimo (ADR-014), enseñados sin anunciar discrepancia:**
- **Las duraciones de las estructuras son rangos con un valor habitual, no cifras fijas.** Macrociclo 3–12 meses · mesociclo 2–6 semanas (habitual 4) · microciclo 3–10 días (habitual 7) · sesión 60–120 min. Enseñar «el microciclo dura 7 días» como definición es falso y además impide entender por qué existen microciclos de choque de 5 días o de aproximación de 10.
- **El microciclo dura 7 días por el calendario social y competitivo, no por fisiología.** No hay un ciclo de supercompensación de siete días: los tiempos de recuperación varían por capacidad y por magnitud de la carga. Sostiene D8-007 y D8-012.
- **La vuelta a la calma no previene las agujetas.** El dolor muscular de aparición tardía viene del daño microscópico de la fibra, sobre todo por trabajo excéntrico, y aparece igual con o sin vuelta a la calma. Lo que sí hace es acelerar el retorno a valores basales, favorecer la retirada de metabolitos y evitar el estancamiento de sangre en los miembros inferiores al parar en seco. Es la creencia más repetida del campo y por eso es distractor en D8-006, D8-016 y D8-025.
- **Atribución de los modelos a sus autores:** tradicional → Matveiev · cargas concentradas y efecto retardado → Verkhoshansky · ATR → Issurin y Kaverin · péndulo → Arosiev · alta intensidad → Tschiene · microciclo estructurado → Seirul·lo. Se distingue explícitamente Verkhoshansky de Issurin, que están emparentados pero no son lo mismo (D7-007).
- **Efecto residual y efecto retardado son cosas distintas** y se confunden por el nombre: residual es lo que queda de una capacidad al dejar de entrenarla —lo que hace viable concentrar la carga—; retardado es cuándo aparece la mejora —después del bloque, no dentro—. Sostiene D7-013 y D7-017.
- **Ciclo plurianual por encima del macrociclo** (2–4 años). Se enseña porque es el nivel donde se piensa una carrera olímpica y su ausencia deja la jerarquía coja (D8-013).
- **Orden dentro de la parte principal: técnica y velocidad → fuerza → resistencia**, por estado del sistema nervioso, no por gasto energético (D8-015, D8-022).

**Dudas de fuente:** una, que no bloquea. Los subtemas de `referencia` (Cartilla 4, Tema 4, Subtemas 4.1–4.1.3 para D7 y 4.2–4.2.4 para D8) los asigné agrupando los dos módulos bajo un mismo Tema de planificación, por coherencia temática con el resto del bloque. Si la numeración real de la Cartilla 4 difiere, es un renombrado mecánico de un campo de texto, sin tocar contenido ni cuotas.

**Pendiente (no es mío, es del `minimal-change-engineer`):**
- Cablear `d7-modelos-planificacion` y `d8-estructuras` en `content/banco/indice.ts` y `content/tarjetas/indice.ts`.
- Integrar los 7 términos de `/tmp/glosario-d7-d8.ts` en `content/glosario.ts`. Ninguno existe todavía en el archivo, así que no hay riesgo de duplicado.
- Pasar los dos módulos a `estadoContenido: 'completo'` en `content/estructura.ts`.
- Cerrar la columna **Validado** en `.claude/CONTENIDO.md`.

---

## [2026-07-31 18:40] · technical-writer · Paso 15 — bloque D, módulos D3 y D4

**Qué escribí:**
- `content/teoria/d3-fuerza.mdx`
- `content/tarjetas/d3-fuerza.ts`
- `content/banco/d3-fuerza.ts`
- `content/teoria/d4-resistencia.mdx`
- `content/tarjetas/d4-resistencia.ts`
- `content/banco/d4-resistencia.ts`
- `/tmp/glosario-d3-d4.ts` (7 entradas, fuera del repo — las inserta el `minimal-change-engineer`)

**Conteo entregado:** teoría sí (los 2) · 30 tarjetas (15 + 15) · 50 ítems (25 + 25) · 7 términos de glosario.

**Reparto de los ítems** (verificado ejecutando `verificarCuotas(items, CUOTAS)` contra los módulos reales, más `esqItem.safeParse` sobre los 50):
- **d3-fuerza** — nivel 11 recuerdo (44 %) / 8 comprensión (32 %) / 6 aplicación (24 %) · dificultad 6·13·6 · los 7 tipos: 13 única, 3 caso, 3 cálculo, 2 emparejar, 2 múltiple, 1 ordenar, 1 V/F. Explicación más corta: 499 caracteres.
- **d4-resistencia** — nivel 11 / 8 / 6 igual · dificultad 6·13·6 · los 7 tipos con el mismo reparto. Explicación más corta: 495 caracteres.
- **Cálculos de D3:** carga de trabajo desde el 1RM (120 kg al 75 % → 90 kg), estimación de Epley (80 kg × 8 → 101,3 kg) y estimación de Brzycki (60 kg × 12 → 86,4 kg). Los tres verificados numéricamente; el mayor desvío contra el valor declarado es 0,033 kg, muy dentro de la tolerancia.
- **Cálculos de D4:** Cooper directo (2600 m → 46,8 ml/kg/min), Course Navette en dos pasos (palier 7 → 11,5 km/h → 47,9 ml/kg/min) y Cooper encadenado con MET (2800 m → 51,3 ml/kg/min → 14,7 MET). Mayor desvío: 0,04.
- **El par de distractores natural se explota en los dos módulos:** en D3, cruzar las filas de la tabla de %1RM entre sí (D3-002, D3-003, D3-005, D3-006, D3-018, D3-023, D3-025); en D4, confundir interválico con repeticiones por el tipo de pausa (D4-003, D4-004, D4-010, D4-013, D4-018).

**Erratas o datos duros nuevos:** ninguno. D3 cubre sus tres datos duros existentes —DD-010 fuerza máxima, DD-011 hipertrofia, DD-012 resistencia muscular— con una tarjeta de fila completa cada uno (D3-T03, D3-T04, D3-T05) y con ítems dedicados; los valores se respetan al pie de la letra, incluida la duración de serie y el descanso. D4 no tiene entradas propias en `content/datos-duros.ts`: los valores que sí se preguntan con número exacto (cortes de duración, constantes de Cooper, protocolo de la Navette) quedan cubiertos por tarjeta de tipo `dato` o `formula` y por al menos un ítem.

**Datos verificados que van más allá del temario mínimo (ADR-014), enseñados sin anunciar discrepancia:**
- **Las cuatro columnas de la tabla de %1RM son la misma realidad dicha de cuatro maneras**, no cuatro datos sueltos. Se enseña la coherencia carga↔repeticiones↔duración↔descanso y se usa como criterio de corrección en D3-018: al 90 % del 1RM se completan 4 o 5 repeticiones, así que «3×12 al 90 %» no es una prescripción exigente, es una imposible.
- **La potencia máxima no está en el 1RM.** `P = F × v`: con la carga máxima la velocidad se desploma y el producto cae con ella, así que el máximo aparece con cargas medias. Sostiene D3-014 y D3-024, y evita el error de campo de entrenar potencia subiendo el peso.
- **La fuerza explosiva la define la intención de mover rápido, no lo ligero de la carga.** Es la confusión más extendida en el gimnasio y por eso es distractor en D3-013.
- **La estimación indirecta del 1RM pierde precisión al subir las repeticiones, no al revés.** Epley y Brzycki coinciden hasta unas 10 repeticiones y divergen por encima (60 kg × 12 → 84 kg contra 86,4 kg). Se enseña el límite explícitamente y se usa como distractor en D3-017 y D3-022, porque «más datos, más precisión» es una intuición razonable y falsa aquí.
- **El método de intensidades máximas gana fuerza sin ganar mucho tamaño**, por adaptación nerviosa —reclutamiento, sincronización, frecuencia de descarga— y por volumen total bajo. Sostiene D3-008, D3-019 y D3-023.
- **Resistencia local = menos de un sexto o un séptimo de la masa muscular total**, es decir la musculatura de un solo miembro. Es el criterio defendible; la cifra de «un tercio» que circula convierte en local casi cualquier ejercicio de tren inferior y vacía la distinción.
- **La resistencia arranca en los 35 segundos**, no en el segundo cero: por debajo el esfuerzo se clasifica como fuerza o velocidad. Sostiene D4-002.
- **El fartlek es continuo porque no tiene pausa, no porque su intensidad sea estable.** La recuperación se hace en movimiento. Sostiene D4-008, D4-017 y D4-019, donde el distractor tentador es clasificarlo por el cambio de ritmo.
- **La pausa útil del interválico tiene mecanismo, no solo nombre:** al cortar el esfuerzo la frecuencia cardíaca cae antes que el retorno venoso, el ventrículo se llena mejor y el volumen sistólico alcanza ahí su valor más alto. Sostiene D4-014 y explica por qué esperar la recuperación total tira el estímulo.
- **Cooper estima, no mide.** Es indirecto y de ritmo libre, así que la estrategia de dosificación forma parte de la prueba: dos deportistas con el mismo VO₂máx real pueden firmar distancias muy distintas. Sostiene D4-015, y D4-025 lo aprovecha para separar «el test más preciso» de «el mejor test aplicable».
- **Course Navette: 20 m, arranque en 8,5 km/h y +0,5 km/h por palier de un minuto.** El incremento de 1 km/h que a veces se ve acortaría el test a la mitad de paliers; es el distractor de D4-007.

**Dudas de fuente:** una, y esta vez sí conviene resolverla antes de integrar. Numeré `referencia` como **Cartilla 4, Tema 3** para D3 (subtemas 3.1 a 3.4) y **Cartilla 4, Tema 4** para D4 (subtemas 4.1 a 4.4), agrupando cada capacidad física bajo un Tema propio. La entrada de D7/D8 de esta misma sesión usa **Tema 4** para los módulos de planificación, así que el bloque D ha quedado con dos criterios de numeración distintos escritos en paralelo. No afecta a cuotas ni al validador —el regex solo exige `Cartilla [1-4], Tema \d+`— pero conviene unificarlo de una pasada cuando estén los 8 módulos del bloque a la vista. Es un renombrado mecánico de un campo de texto.

**Verificación hecha antes de entregar:**
- `esqItem.safeParse` sobre los 50 ítems: todos válidos, sin ids duplicados, ninguna explicación por debajo de 200 caracteres (la más corta va en 495).
- `verificarCuotas(items, CUOTAS)` con las cuotas del bloque D: los dos módulos PASAN sin incumplimientos.
- `esqTarjeta.safeParse` sobre las 30 tarjetas y `esqEntradaGlosario.safeParse` sobre los 7 términos: todos válidos.
- Los 6 cálculos recomputados aparte contra el valor declarado y su tolerancia.
- Los dos MDX compilados con `@mdx-js/mdx` + `remark-gfm`: compilan, no llevan `#` de primer nivel y solo usan `<Dato>`, `<Formula>`, `<TablaClave>` y `<Ojo>`.
- Recuento de columnas de todas las tablas (A-23): la de %1RM de D3 es la más ancha con 6 columnas y cabeceras de una palabra —Objetivo, % 1RM, Reps, Duración, Descanso, Vía—; el resto va en 2, 3 y 4.

**Pendiente (no es mío, es del `minimal-change-engineer`):**
- Cablear `d3-fuerza` y `d4-resistencia` en `content/banco/indice.ts` y `content/tarjetas/indice.ts`.
- Integrar los 7 términos de `/tmp/glosario-d3-d4.ts` en `content/glosario.ts`. Ninguno de los 7 existe todavía en el archivo, así que no hay riesgo de duplicado.
- Pasar los dos módulos a `estadoContenido: 'completo'` en `content/estructura.ts`.
- Unificar la numeración de `Tema` en las `referencia` de los 8 módulos del bloque D, si se decide un criterio único.
- Cerrar la columna **Validado** en `.claude/CONTENIDO.md`.

## [2026-07-31 09:40] · minimal-change-engineer · Paso 15

**Módulos integrados:** d1-conceptualizacion · d2-carga · d3-fuerza · d4-resistencia · d5-velocidad · d6-flexibilidad · d7-modelos-planificacion · d8-estructuras

**Archivos tocados:**
- `content/banco/indice.ts` — registrar los 8 módulos con `import()` dinámico, patrón idéntico al de C5.
- `content/tarjetas/indice.ts` — lo mismo para las tarjetas.
- `content/glosario.ts` — fundir las 27 entradas de los cuatro fragmentos de `/tmp`; sin ellas el validador rompe por `conceptoClave` sin entrada.
- `content/estructura.ts` — `estadoContenido` de los 8 a `'completo'`. Solo ese campo, 8 líneas.
- `content/banco/d3-fuerza.ts` y `content/banco/d4-resistencia.ts` — remapeo mecánico del campo `referencia` (ver abajo).
- `.claude/CONTENIDO.md` — columna Validado de los 8 y pie de totales.

**Diff:** 226 líneas añadidas, 10 eliminadas sobre archivos versionados. Los dos ficheros de banco remapeados son nuevos en esta rama, así que su cambio no aparece en el diff contra HEAD: son 50 campos `referencia` reescritos (25 + 25).

**Correcciones mecánicas aplicadas:**
- **Colisión de numeración de `referencia`.** Los cuatro escritores asignaron `Tema/Subtema` por separado y chocaban: «Subtema 3.4» apuntaba a fuerza *y* a flexibilidad, «Subtema 4.1» a resistencia *y* a modelos de planificación. Una referencia que apunta a dos sitios no sirve como mapa del temario. Impuesto el esquema que ya cumplían D1, D2, D5, D6, D7 y D8 — Tema 3 = capacidades físicas, Tema 4 = planificación:
  - `d3-fuerza`: `Tema 3, Subtema 3.1|3.2|3.3|3.4` → `3.1.1|3.1.2|3.1.3|3.1.4`. El Tema no cambia.
  - `d4-resistencia`: `Tema 4, Subtema 4.1|4.2|4.3|4.4` → `Tema 3, Subtema 3.2.1|3.2.2|3.2.3|3.2.4`. Cambia también el número de Tema.
  - Hecho por cadena completa (subtema + título), una pasada por cadena, sin encadenar sustituciones. Verificado después: los 8 módulos ocupan subtemas disjuntos.
  - Los `.mdx` y las tarjetas de esos dos módulos no citan subtemas: comprobado, no había nada que tocar ahí.
- **Duplicados de glosario:** verificado a mano, no por confianza. `Densidad` y `Escala de Borg (RPE)` ya estaban en el archivo desde el paso 6 con módulo `d2-carga`; el fragmento de D1–D2 los había omitido correctamente. Las 27 entradas nuevas no colisionan con las 22 existentes ni entre sí bajo la normalización del validador (sin tildes, minúsculas, sin paréntesis).

**Contenido que pedí y no escribí yo:** ninguno. Los 24 archivos de contenido y los 4 fragmentos de glosario llegaron completos; este paso fue integración pura más el remapeo mecánico.

**Validador:** ok · 60 avisos · 0 errores. Los 60 avisos son los esperados en este punto del plan: 20 módulos en preparación sin banco y los blueprints que todavía no tienen ítems suficientes en los bloques A, B y C.

**Notado pero NO hecho:**
- **7 tests fallan, y no los toqué: viven en `src/`.** Para el `code-reviewer` / `frontend-developer`. Antes del diff: 675/675. Después: 668/675. Ninguno es un fallo de motor — son fixtures anclados al estado «solo C5 publicado» del paso 8, que caducan exactamente al publicar contenido nuevo:
  - `src/lib/__tests__/censo.test.ts` → «incluye los módulos vacíos en vez de omitirlos» espera `MODULOS.length - 1` módulos vacíos (ahora son `- 9`); «el veredicto … con el contenido de hoy» espera `totalDisponible === ELEGIBLES_C5` y `viable === false`, y con el bloque D dentro el diagnóstico ya no es inviable por las mismas cifras.
  - `src/components/inicio/__tests__/panel-inicio.test.tsx` → 5 casos con los literales `'0/1'` y `/Hay 1 de 29 módulos publicados/`, más los escalones de prioridad que dependen de cuántos módulos hay publicados.
  - Confirmado con `git stash` que la causa es la publicación de contenido y no la integración. La decisión de si esos tests deben pasar a leer el conteo de `MODULOS` publicados en vez de literales es de diseño de test, no mía.
- El reparto por nivel de los 8 módulos es **idéntico** (11/8/6) en los cuatro escritores. Cumple cuotas de sobra y no es un defecto, pero conviene que el `technical-writer` sepa que salió un patrón uniforme por si en los pasos 16–17 se busca más variedad.
- `.claude/COMPONENTES.md` publica como «cifras de hoy» las del paso 6 (`/layout` js 132.0 kB gz, css 12.5). La base real medida hoy antes de este diff es **132.4 js / 14.3 css**: los pasos 7–14 la movieron y la tabla no se actualizó. No la toqué — es de otro dueño; queda para quien mantenga ese documento.

**Peso (métrica oficial: solo `.js`, gzip por archivo y sumado), base medida con `git stash` sobre este mismo build:**

| Ruta | js gz | Δ |
|---|---|---|
| `/layout` | 132.7 kB | +0.3 |
| `/page` | 137.7 kB | +0.3 |
| `/repaso/page` | 144.3 kB | +0.3 |
| resto de rutas | — | +0.3 |

+0.3 kB uniforme en las 20 rutas, con **200 ítems y 120 tarjetas nuevos** entrando al repositorio. Ese incremento es el índice —16 líneas de `import()`—, no el contenido: la frontera de ADR-010 aguanta el primer bloque completo. `npm run canario` en verde: 33 chunks de carga ansiosa revisados, ninguno lleva contenido.

**Pendiente:**
- Los 7 tests de `src/` desactualizados (arriba). Es lo único que impide cerrar el paso 15 con las seis compuertas en verde.
- El paso 16 debe ceñirse al mapa de numeración del bloque D que quedó fijado en `CONTENIDO.md` si cita la Cartilla 4.

---

## Paso 15 — Contenido del bloque D — 2026-07-31

**Estado:** ✅ Completado · **Rama:** `paso-15-bloque-d`

**Los 8 módulos del bloque D, uniformes:** 25 ítems y 15 tarjetas cada uno, reparto 11 recuerdo / 8 comprensión / 6 aplicación (44/32/24 %), ≥3 por cada dificultad y 6–7 tipos distintos sobre el mínimo de 4. Explicación más corta del bloque: **377 caracteres**, casi el doble del mínimo de 200.

**Banco: 28 → 228 ítems. Tarjetas: 15 → 135. Glosario: 22 → 49 términos.**

### Cómo se produjo, y por qué así

Cuatro `technical-writer` **en paralelo, emparejados por afinidad temática** —D1+D2 conceptuales, D3+D4 fuerza y resistencia, D5+D6 velocidad y flexibilidad, D7+D8 planificación— en vez de uno por módulo o uno para los ocho. §14.4 pide un bloque por sesión para que el tono y el criterio de dificultad no deriven; agrupar los que comparten vocabulario protege eso mismo dentro del bloque, y permite que cuatro trabajen a la vez.

Luego un `minimal-change-engineer` para el enganche: índices, glosario, `estadoContenido` y el remapeo de referencias. **Cero líneas en `src/`** por su parte, que era la condición.

### Lo que el paralelismo costó, y hay que saberlo antes de repetirlo en 16 y 17

**Cuatro agentes escribiendo a la vez producen incoherencias que ninguno puede ver solo.** Salieron tres:

1. **Colisión de referencias.** Cada uno numeró sus `Tema/Subtema` por su cuenta y el resultado fue que **«Subtema 3.4» apuntaba a fuerza Y a flexibilidad**, y «Subtema 4.1» a resistencia Y a modelos de planificación. La `referencia` es el mapa con el que el usuario va a verificar el dato en la cartilla: una que apunta a dos sitios no sirve. Lo diagnostiqué comparando los ocho archivos y el integrador lo remapeó — 50 campos, esquema final **Tema 3 = capacidades (3.1 fuerza · 3.2 resistencia · 3.3 velocidad · 3.4 flexibilidad)** y **Tema 4 = planificación (4.1 modelos · 4.2 estructuras)**. Fijado en `CONTENIDO.md` para el paso 16.
2. **Criterios distintos para el mismo hecho** en `CONTENIDO.md`: dos agentes marcaban la columna Glosario en ⬜ y los otros en ✅ estando exactamente en el mismo estado.
3. **Reparto por nivel idéntico** en los cuatro (11/8/6). Cumple de sobra y no es defecto, pero es una señal de que todos leyeron la misma sugerencia al pie de la letra.

**Para los pasos 16 y 17: fijar la numeración de `Tema/Subtema` del bloque ANTES de repartir el trabajo.** Es la única de las tres que produce contenido incorrecto y no solo desprolijo.

### Siete tests míos caducaron, y estaban mal escritos

Al publicar el bloque D fallaron 7 tests de `src/` —`censo.test.ts` y `panel-inicio.test.tsx`— porque estaban anclados con **literales al estado «solo C5 publicado»**: `'0/1'`, `/Hay 1 de 29 módulos publicados/`, `MODULOS.length - 1`, y fixtures que marcaban un único módulo como dominado.

El integrador hizo bien en no tocarlos —viven en `src/`— y en escalarlos. **El defecto es de diseño de test:** un test que hay que reescribir cada vez que se publica contenido no está midiendo el código, está midiendo el calendario. Reescritos para **derivar del catálogo** (`MODULOS.filter(m => m.estadoContenido === 'completo')`), así que sobreviven a los pasos 16 y 17 sin tocarse.

### Qué se puede armar ahora

| Examen | Pide | Hay | Estado |
|---|---|---|---|
| **Simulacro del bloque D** | 40 | **200** | **ARMABLE** |
| **Diagnóstico inicial** | 30 | **121 elegibles** | **ARMABLE** |
| **Simulacro final** | 100 | 228 | **ARMABLE**, con reparto incompleto en 20 módulos |
| Bloque C | 40 | 28 | faltan 12 |
| Bloques A y B | 40 | 0 | faltan 40 |

**El diagnóstico deja de ser una promesa**, que es el hito de producto del paso: un usuario nuevo ya puede medirse y recibir un plan real. El simulacro final se declara armable y **avisa de que el reparto no será el del examen real** —ADR-025 y la portada honesta del Paso 11 hacen ese trabajo sin código nuevo—.

### Peso

**+0.3 kB gz en todas las rutas**, uniforme. Con 200 ítems y 120 tarjetas nuevos, ese incremento es el índice (16 líneas de `import()`), no el contenido: la frontera de ADR-010 aguantó su primer bloque completo sin que un solo ítem entre en un chunk de carga ansiosa. El canario, en verde.

**Nota heredada, sin resolver:** los subtemas de `referencia` se asignaron por coherencia temática, no contra la numeración real de la Cartilla 4. Es verificable contra el material oficial y su corrección sería un renombrado mecánico de un campo.
