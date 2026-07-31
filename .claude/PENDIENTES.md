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

## Paso 6 — Datos de bloques y módulos ✅ HECHO el 2026-07-30

Se transcribieron §9.2–§9.5 (6 blueprints · 14 erratas · 70 datos duros · 22 términos) y se construyeron `/modulos` y `/bloques/[bloqueId]`. El validador quedó en 87 avisos y 0 errores, como estaba previsto.

## Paso 7 — Renderizado MDX

- ~~Las tres obligaciones sobre `<AlertaContradiccion>`, el tratamiento de `'aclaracion'` y el agrupado de `/erratas`~~ **sin objeto desde ADR-014**: el sistema de erratas se eliminó por completo. **No copiar §12.4 del blueprint, que sigue trayendo el componente.**

## Paso 8 — Módulo piloto C5 · ✅ CERRADO el 2026-07-30

C5 completo: teoría, 15 tarjetas y **28 ítems** con el reparto 12/9/7 de ADR-006, cableado en los dos índices y `estadoContenido: 'completo'`. Validador en 84 avisos y 0 errores.

## Paso 9 — Componentes de ítem · ✅ CERRADO el 2026-07-30

Los 7 tipos × 4 estados, el controlador de sesión y las etapas 3 y 4 de C5. ADR-011 cerrada (barrel), ADR-015 (motor adelantado) y ADR-016 (tests de componente) nacen aquí.

- **Pasarle la auditoría de accesibilidad al recuadro de viñeta de `caso`.** No se ejercitó en runtime: la auditoría creyó que el tipo no salía nunca del muestreo, y **sale** —medido, ~10 %, que es su proporción en el banco—. Lo interactivo de `caso` es `GrupoOpcionUnica`, ya auditado; lo propio suyo es la viñeta, que no es interactiva. Es una comprobación corta, no un bloqueo.
- **A-28 · el foco del `<h2>` del resumen no se ve.** No incumple 2.4.7 (un `tabIndex={-1}` no es operable por teclado), pero deja al usuario vidente de teclado sin saber dónde quedó el cursor. Dibujar un anillo sobre un titular es decisión de aspecto: la toma el `ui-designer`.
- **El `<kbd>` a 12 px mide 4,93:1.** Pasa, con **0,43 de margen**. Cualquier retoque de `--muted` lo tumba: si se toca ese token, se remide.
- **A la tercera copia, extraer el botón propio.** Van dos: `sesion/boton.tsx` y el de `mazo-tarjetas.tsx`.

## Paso 10 — Motor SRS y /repaso · ✅ CERRADO el 2026-07-30

- **`CLAUDE.md` §7.2 quedó desalineado en tres puntos y no se editó** (ADR-017): la normalización de `hoy` en `crearTarjetaSRS` y la acotación del intervalo. No se replica —§7.2 se copia una sola vez— y los tests lo fijan.
- **El canario de ADR-010 es ahora `npm run canario`**, no un `grep`. Desde este paso hay contenido en chunks de cliente **a propósito** (`import()` diferido en `/repaso`), y el grep viejo da falso positivo. Correrlo **después** de `npm run build`.

## Paso 11 — Cronómetro y sesión persistente

- **§7.4 llega aquí, y conviene ejercitarlo con sospecha.** Van cuatro desviaciones del código literal de `src/lib/` en el blueprint (ADR-003, ADR-005, ADR-015, ADR-017), y las tres de motores comparten forma: **fallan en los bordes, no en el caso feliz**, y todas necesitaron lo mismo — normalizar la entrada y acotar la salida. El cronómetro tiene los dos: recibe `ahoraMs` de fuera y produce umbrales de aviso.

- ~~`<AlertaContradiccion>` es prematuro, no código muerto~~ **borrado por ADR-014.** El panel de retroalimentación de este paso muestra veredicto → `explicacion` → `pasos` si es cálculo → `referencia`, y **nada más**: el campo `contradiccion` de `ItemBase` ya no existe. **§13 del blueprint sigue describiendo el cuadro en el panel: no copiarlo.**

- **Decidir, EN EL MISMO MOMENTO, la deuda de `src/lib/esquemas.ts`.** Manda al navegador los siete esquemas de ítem, más tarjetas y glosario, donde **ninguno se usa**: en cliente solo hace falta `esqEstadoProgreso`, que `almacenamiento.ts` importa para validar el progreso al leerlo. Evidencia: la cadena de sondeo era `grep "diceLaCartilla" .next/static/chunks/`; con `esqErrata` borrado (ADR-014) **hay que elegir una nueva** antes de volver a medirlo. **No es violación de §5** —§5 sanciona ese import explícitamente—; lo no previsto es el coste. Partirlo en `esquemas-progreso.ts` / `esquemas-contenido.ts` sí es arquitectura y choca con §22 regla 2, así que se reportó en vez de hacerse. Misma deuda que el barrel, mismas rutas, mismo momento.
- ~~Decidir la deuda del barrel de `radix-ui`~~ **✅ CERRADA en el Paso 9.** Los 13 archivos de `ui/` pasan al subpath (`radix-ui/slot`, `radix-ui/dialog`, …): **−76.9 kB gz en `/not-found`**. La condición de cierre se resolvió con una regla `no-restricted-imports` — no se puede impedir que `npx shadcn@2 add` escriba el barrel, sí que sobreviva a `npm run lint`. Ver el cierre de ADR-011.

- Los hooks se exportan como **`useSesion`** y **`useCronometro`**; los archivos siguen siendo `usar-sesion.ts` y `usar-cronometro.ts` (ADR-007). Con nombre en español, `react-hooks/rules-of-hooks` da error **y deja de auditar el interior de la función** — justo en el controlador de sesión y el auto-envío del cronómetro.
- **Paso 11, deuda de §6 literal:** `leerSesion()` hace `JSON.parse(crudo) as SesionCronometro` **sin validar**, y no existe `esqSesionCronometro`. Con un payload como `{"foo":1}` devuelve un objeto sin `itemIds` ni `duracionSegundos`: recorrer `itemIds` lanza `TypeError` y `restantes()` daría `NaN`, porque `undefined !== null`. Decidir ahí si se añade el esquema.
- `leerSesion` **no es libre de efectos**: se autolimpia con `borrarCrudo` si el payload es corrupto. El `dialogo-reanudar` debe llamarla desde un efecto, nunca en render.
- `reactStrictMode` ya está activo desde el Paso 2, precisamente para que el doble disparo de efectos aparezca aquí y no en producción.


- **El banco entero viaja en la carga útil RSC**, y con 100 ítems sobre 29 módulos no escala: `/practica` pesa **17.1 kB gz de HTML** contra 9.1 de `/tarjetas`. El simulacro final es el caso difícil y llega aquí, así que es el momento de decidir si se sigue sirviendo desde el servidor o se carga con `import()` bajo interacción, como propone §2.2.
- **El puntaje se calcula hoy en `usar-sesion.ts`** con la fórmula de §7.5. `src/lib/informe.ts` nace en el Paso 12 y es su dueño: esa línea se sustituye por la llamada. Está marcado en el archivo.
- **El motor de simulacro ya está** desde el Paso 9 (ADR-015): `src/lib/simulacro.ts` con §7.3, más 199 tests. Este paso aporta lo suyo — `cronometro.ts`, `usar-cronometro.ts`, la persistencia de `SesionCronometro`, el diálogo de reanudar y el auto-envío—, **no vuelve a copiar §7.3**.
- **`CLAUDE.md` §7.3 quedó desalineado en dos puntos y no se editó** (ADR-015): la rama `multiple` de `calificar` y el `default` de `presentarItem`. No se replica —§7.3 se copia una sola vez y ya está copiado— y los tests lo fijan. Solo importa si algún día se rehace el blueprint desde cero.

## Paso 12 — Informe

- **Riesgo con crash reproducido** (ADR-008): `esqIntento.desglose.porBloque` es `z.record(esqConteo)`, así que un intento **sin** los bloques B/C/D pasa Zod, pero el cast afirma `Record<BloqueId, …>` con las cuatro claves. `construirInforme` de §7.5 hace `porBloque[b.id].total` y revienta con `Cannot read properties of undefined`. Vía de entrada real: `importarJSON` acepta ese respaldo como válido en /ajustes.
  Arreglo: endurecer `desglose` en `src/lib/esquemas.ts` para exigir las 4 claves de bloque y las 3 de nivel. Toca un archivo del Paso 2, así que se decide aquí.

## Paso 14.4 — Punto de corte usable

- Reemplazar la portada **provisional** que dejó el Paso 5 en `src/app/page.tsx` por la real (continuar donde ibas, racha, resumen, cola de repaso, acceso al diagnóstico).
- Borrar **los 5 SVG** de create-next-app en `public/` (`file`, `globe`, `next`, `vercel`, `window`). Desde el Paso 5 **ya no los referencia nadie**, así que se pueden borrar sin tocar código. Si sobreviven, entran al manifiesto de precache de Serwist en el 18.1 y son peso muerto en la caché offline.

## Paso 15 — Contenido del bloque D · y todo paso que escriba tablas

- **El CSS de la ficha declara claves hasta `--et-7`.** Una tabla de **8 columnas o más** apilaría igual, pero de la octava en adelante el valor saldría **sin su clave**. Ninguna tabla de las cartillas llega a 6; si alguna llegara, se añade la línea que falte en `globals.css` §3.2.

- ~~**A-18 · «0 violaciones de axe» ya NO significa «tabla verificada».**~~ **Resuelto al cerrar A-22** (2026-07-30): el degradado que cegaba a axe sobre las celdas de tabla ya no existe, así que un informe en verde vuelve a responder por ellas. **No hay que medir a mano el contraste de las tablas nuevas.** Se deja tachado y no borrado porque la advertencia circuló varios días.

- **A-23 · lo que sí hereda este paso, y es más caro que lo anterior.** El remedio de A-22 (`overflow-wrap: anywhere` en `.prose-idoneo table`) partía palabras normales en las cabeceras: «Zon/a», «Aeróbi/co», «Sustrat/o». Ya arreglado en el Paso 8b repartiendo el valor por rol de celda (`th: normal` · `td: break-word` · `td::before: normal`). **La lección operativa para 29 módulos de tablas:** un cambio de maquetación tipográfica sobre `table` llega por herencia a rótulos y valores por igual, y son roles con necesidades opuestas. Al tocar el CSS de tabla, se comprueba con **una tabla ancha real a 375 px**, no con una de dos columnas. Ver A-23 en `ACCESIBILIDAD.md`.

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

- **`DISENO.md` §1.4, fila D-1, afirma algo falso y es anterior a ADR-014.** Dice que `text-aviso` «sí se usa como texto: el `<Ojo>` de §12.3». En el `ojo.tsx` real, `text-aviso` está **solo en el icono**; el título va en `text-foreground` por §6.3. El consumidor real de `text-aviso` como texto es el **cronómetro a los 10 min** (Paso 11). Corregirlo cambia la justificación de un valor de la paleta, así que lo decide el `ui-designer` — conviene hacerlo **en el Paso 11**, cuando el cronómetro exista y la justificación se pueda escribir sobre algo medido en vez de sobre una promesa.

- ~~**`CLAUDE.md` sostiene entero el sistema de erratas que ADR-014 eliminó.**~~ **Editado el 2026-07-30** (enmienda a ADR-014): once secciones limpias, 366 líneas fuera. §1 **sustituye** el diferenciador en vez de borrarlo. Y **§21 y §22 ganan una regla 15** que dice por qué el documento está limpio, para que una copia vieja no reintroduzca el sistema en silencio.

- **ADR-008 pendiente de ratificación** por el `software-architect`: añade una tercera clave de `localStorage` donde §6 dice "dos claves, deliberadamente separadas", más API pública nueva. El `code-reviewer` no lo bloqueó — corrige que §6 destruyera el progreso y restaura un invariante en vez de romperlo.
- Dos verrugas cosméticas del validador que se dejaron a propósito: el resumen cuenta `items` **antes** de validar mientras las cuotas juzgan solo los válidos (la cabecera puede decir 27 y la cuota 25), y `conteoPorModulo` conserva ese mismo conteo. Inofensivas; revisar solo si estorban en los pasos 15–17.
- Los guards de versión de `intentarMigrar` son **redundantes hoy** (`esqEstadoProgreso.version` es `z.literal(1)` y Zod ya rechaza ambos casos). Con la v2 del esquema pasan a ser portantes y necesitarán test propio.
