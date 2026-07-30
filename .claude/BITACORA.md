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
