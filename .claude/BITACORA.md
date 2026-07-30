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
