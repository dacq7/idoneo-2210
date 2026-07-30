# Bitácora — Idóneo 2210

Registro cronológico de construcción. **Una entrada por paso completado, siempre.**
Se escribe al final, nunca sobre una entrada anterior.

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
