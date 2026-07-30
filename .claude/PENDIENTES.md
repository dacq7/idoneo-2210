# Obligaciones heredadas, por paso — Idóneo 2210

Lo que un paso **debe** hacer porque un paso anterior lo dejó decidido o pendiente.
No es una lista de deseos: cada línea rompe algo si se ignora.

**Antes de ejecutar un paso, lee su sección.** Las razones completas están en
`ARQUITECTURA.md` (los ADR) y en `BITACORA.md` (la entrada del paso que lo generó).

---

## Paso 5 — Layout y navegación · ✅ CERRADO el 2026-07-30

Las cuatro obligaciones se cumplieron. Se dejan escritas porque explican por qué
`globals.css` y `layout.tsx` son un reemplazo completo y no un parche.

- ✅ `src/app/globals.css` debe incluir **`@custom-variant dark (&:is(.dark *));`** además de los 4 tokens de bloque. Sin esa variante, los `dark:` de los 18 componentes de `src/components/ui/` no responden a la clase que pone `next-themes`, y el modo oscuro queda a medias.
- ✅ `src/app/layout.tsx` sigue siendo el de create-next-app: **`lang="en"`** y `title: "Create Next App"`. La app es `es-CO` y hoy el HTML anuncia inglés. Lo reemplaza §11.2.
- ✅ El pie con la atribución a COLEF/COCED (§11.7) va en **todas** las rutas. Es requisito de la licencia CC BY-NC-SA 4.0, no decoración. Ver ADR-001.
- ✅ Los componentes de shadcn se ven **sin estilo** hasta este paso: el `init` del CLI falló al escribir los tokens base de color. Se resuelve solo al reemplazar `globals.css` completo por §11.3.

**Obligaciones nuevas que este paso genera** (detalle en la bitácora del 2026-07-30):

- **Paso 7 y toda ruta con bloque:** la página debe rotular el bloque en texto (el *eyebrow* «BLOQUE C · CIENCIAS APLICADAS»). El riel del encabezado solo lo enuncia en su `aria-label`, y DISENO.md §1.2 prohíbe que el color sea el único portador. Si se decide que el *eyebrow* va en el encabezado, lo tiene que registrar el `ui-designer` en `DISENO.md`.
- **Paso 11:** el pie se oculta con `hidden` desde `Shell` durante un simulacro activo — no se desmonta (ADR-001).
- **Cualquier paso:** no añadir clases de foco a los componentes; `globals.css` ya pinta 2 px sólidos a `--ring` completo sobre todo elemento interactivo, en `@layer utilities` para ganarle al `outline-none` de shadcn. Y si un elemento usa `hover:bg-accent`, su texto sube a `text-foreground` en el mismo estado: `text-muted-foreground` sobre `bg-accent` mide 4.47:1 en tema oscuro.

## Paso 6 — Datos de bloques y módulos

- **Ya no copia §9.1**: `content/estructura.ts` se escribió en el Paso 3 (ADR-004). Le corresponden §9.2 (blueprints), §9.3 (erratas), §9.4 (datos duros), §9.5 (glosario) y las rutas `/bloques/[bloqueId]` y el índice de `/modulos`.
- `content/blueprint-examen.ts` está hoy con `BLUEPRINTS = {}`. Al pegar §9.2, el validador cruzará las cuotas por módulo contra el banco: esperar avisos, no errores.

## Paso 8 — Módulo piloto C5

- **C5 lleva 28 ítems** (ADR-006). `CLAUDE.md` ya está corregido en las líneas 176, 5350, 6295 y 6319, así que la instrucción del paso y el árbol de directorios dicen 28. §14.3 sigue trayendo **25 ítems de código**: hay que escribir 3 más.
- Los tres ítems adicionales **no son libres de nivel**: al pasar `n` de 25 a 28, los umbrales de `verificarCuotas` se mueven y dos quedan forzados.

  | Id | Nivel | Dificultad | Tipo |
  |---|---|---|---|
  | `C5-026` | recuerdo | 1 | única |
  | `C5-027` | comprensión | 2 | múltiple |
  | `C5-028` | aplicación | 3 | cálculo |

  Reparto final: **12 recuerdo · 9 comprensión · 7 aplicación**. Si al redactar uno sale de otro nivel, **no basta con reetiquetarlo**: recuerdo volvería a 11/28 y el build rompe.
- `content/teoria/c5-umbrales-zonas.mdx` **debe existir** antes de voltear C5 a `'completo'`: desde ADR-005 el validador exige la teoría de todo módulo completo.
- Registrar C5 en `content/banco/indice.ts` y `content/tarjetas/indice.ts`. **Cuidado con el typo en la clave**: desde ADR-005 una clave huérfana es error, no aviso.
- El componente `etapas-modulo.tsx` consume el hook como **`useEstado`**, no `usarEstado` (ADR-007).

## Pasos 9 y 11 — Hooks de sesión y cronómetro

- Los hooks se exportan como **`useSesion`** y **`useCronometro`**; los archivos siguen siendo `usar-sesion.ts` y `usar-cronometro.ts` (ADR-007). Con nombre en español, `react-hooks/rules-of-hooks` da error **y deja de auditar el interior de la función** — justo en el controlador de sesión y el auto-envío del cronómetro.
- **Paso 11, deuda de §6 literal:** `leerSesion()` hace `JSON.parse(crudo) as SesionCronometro` **sin validar**, y no existe `esqSesionCronometro`. Con un payload como `{"foo":1}` devuelve un objeto sin `itemIds` ni `duracionSegundos`: recorrer `itemIds` lanza `TypeError` y `restantes()` daría `NaN`, porque `undefined !== null`. Decidir ahí si se añade el esquema.
- `leerSesion` **no es libre de efectos**: se autolimpia con `borrarCrudo` si el payload es corrupto. El `dialogo-reanudar` debe llamarla desde un efecto, nunca en render.
- `reactStrictMode` ya está activo desde el Paso 2, precisamente para que el doble disparo de efectos aparezca aquí y no en producción.

## Paso 12 — Informe

- **Riesgo con crash reproducido** (ADR-008): `esqIntento.desglose.porBloque` es `z.record(esqConteo)`, así que un intento **sin** los bloques B/C/D pasa Zod, pero el cast afirma `Record<BloqueId, …>` con las cuatro claves. `construirInforme` de §7.5 hace `porBloque[b.id].total` y revienta con `Cannot read properties of undefined`. Vía de entrada real: `importarJSON` acepta ese respaldo como válido en /ajustes.
  Arreglo: endurecer `desglose` en `src/lib/esquemas.ts` para exigir las 4 claves de bloque y las 3 de nivel. Toca un archivo del Paso 2, así que se decide aquí.

## Paso 14.4 — Punto de corte usable

- Reemplazar la portada **provisional** que dejó el Paso 5 en `src/app/page.tsx` por la real (continuar donde ibas, racha, resumen, cola de repaso, acceso al diagnóstico).
- Borrar **los 5 SVG** de create-next-app en `public/` (`file`, `globe`, `next`, `vercel`, `window`). Desde el Paso 5 **ya no los referencia nadie**, así que se pueden borrar sin tocar código. Si sobreviven, entran al manifiesto de precache de Serwist en el 18.1 y son peso muerto en la caché offline.

## Paso 16 — Resto del bloque C

- Los 8 módulos restantes del bloque C (C1–C4, C6–C9) heredan el mínimo de **28 ítems** (ADR-005 hueco 5). Con `cuotasDelBloque` enforzándolo, el entregable "≥28 cada uno" pasa de promesa a compuerta.

## Paso 18.1 — PWA

- Al reescribir `next.config.ts` con `withSerwist`, **conservar `reactStrictMode: true`**. §16 ya lo incluye, así que no hay conflicto, pero es una reescritura completa del archivo.

## Paso 18.5 — Ajustes

- **La UI de /ajustes debe exponer la cuarentena de ADR-008.** Es obligación, no mejora: sin ella el mecanismo existe y nadie puede usarlo, y el progreso apartado queda inalcanzable. Tres cosas concretas:
  1. **Avisar** cuando `leerIlegible()` devuelve algo: que hay un progreso anterior apartado, y de qué tipo. El campo `motivo` distingue los casos y debe traducirse a lenguaje de usuario — `version-futura` es *"viene de una versión más nueva de la app"*, no *"está corrupto"*.
  2. **Descargar** el `payload` como archivo, para que sea recuperable fuera de la app.
  3. **Descartar** con `descartarIlegible()`, con confirmación.

  Y decir la verdad en el texto: la cuarentena **hace el progreso recuperable, no lo restaura**. Un payload que no parsea es irrecuperable en el caso general.
- `leerIlegible()` **no es libre de efectos** (se autolimpia si el registro está corrupto): llamarla desde un efecto, no en render.
- **Hueco conocido de `necesitaRespaldo`, con test que lo documenta:** §18.5 dice "cada 7 días de uso", pero la rama sin `ultimoRespaldo` mira `racha.dias`, que son días **consecutivos** y se reinicia a 1 al saltarse uno. Un entrenador que estudia 3 noches por semana durante dos meses **nunca** ve el recordatorio. Se copió §6 tal cual; aquí es donde hay UI y contexto para decidir si se arregla.
- El modo privado y el disco lleno degradan a memoria y **no sobreviven un recargue**. Si /ajustes puede detectarlo, conviene decírselo al usuario: su progreso no se está guardando.

## Paso 18.10 — Prueba en dispositivos reales

- **`src/app/error.tsx` no se ha ejercitado nunca en runtime.** En `npm run dev` el overlay de Next intercepta el límite de error, así que el `accessibility-auditor` del Paso 5 no pudo verificarlo: quedó auditado por código, no por comportamiento. Hay que **forzar un error con build de producción** (`npm run build && npm run start`) y comprobar que el mensaje se lee, que `[Reintentar]` llama a `reset()` y que los dos botones se alcanzan con `Tab` y muestran el foco de 2 px. Usa los mismos `<Button>` + `<Link>` que el 404, que sí quedó verificado.

## Paso 18.9 — README

- Reescribir el `README.md` que dejó create-next-app, con la sección de licencia y atribución a COLEF/COCED. Es la segunda obligación **BY** de la licencia (la primera es el pie del Paso 5). Ver ADR-001.

---

## Sin paso asignado

- **ADR-008 pendiente de ratificación** por el `software-architect`: añade una tercera clave de `localStorage` donde §6 dice "dos claves, deliberadamente separadas", más API pública nueva. El `code-reviewer` no lo bloqueó — corrige que §6 destruyera el progreso y restaura un invariante en vez de romperlo.
- Dos verrugas cosméticas del validador que se dejaron a propósito: el resumen cuenta `items` **antes** de validar mientras las cuotas juzgan solo los válidos (la cabecera puede decir 27 y la cuota 25), y `conteoPorModulo` conserva ese mismo conteo. Inofensivas; revisar solo si estorban en los pasos 15–17.
- Los guards de versión de `intentarMigrar` son **redundantes hoy** (`esqEstadoProgreso.version` es `z.literal(1)` y Zod ya rechaza ambos casos). Con la v2 del esquema pasan a ser portantes y necesitarán test propio.
