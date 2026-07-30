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
