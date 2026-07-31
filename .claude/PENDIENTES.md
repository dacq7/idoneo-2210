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

## Paso 11 — Cronómetro y sesión persistente · ✅ CERRADO el 2026-07-30

Se cerraron las siete obligaciones que este paso heredaba. Resumen de qué pasó con cada una:

- ✅ **§7.4 ejercitado con sospecha, y la sospecha estaba justificada.** `restantes()` devolvía `NaN` con una duración corrupta, y `NaN <= 0` es `false`: el auto-envío **no se disparaba nunca**. Sexta desviación del blueprint, misma forma que las cinco anteriores. Ver **ADR-019**.
- ✅ **La deuda de `esqSesionCronometro`** (§6 hacía `as SesionCronometro` sin validar): resuelta con esquema propio. La sesión ilegible se descarta y **no** manda el progreso a cuarentena, a diferencia de ADR-008 — vive en otra clave. Ver ADR-019.
- ✅ **La deuda de `src/lib/esquemas.ts` en el bundle**: resuelta, y este paso la volvió urgente. `OcultaEnSimulacro` metió `almacenamiento.ts` en el grafo del **layout raíz**, así que su peso pasó a pagarlo toda la app: `/layout` saltó de 132.0 a **148.4 kB gz**. Con la partición vuelve a **132.5**. Ver **ADR-021**.
- ✅ **El banco del simulacro final no viaja en la carga útil RSC**: se carga con `import()` bajo interacción, como §2.2 prescribe. El HTML de `/simulacros/final` no contiene ni una cadena del banco.
- ✅ **Hooks como `useCronometro`** (ADR-007), **`leerSesion` llamada desde efectos** (no es libre de efectos), **`reactStrictMode`** activo.
- ✅ **El pie se oculta con `hidden`, no se desmonta** (ADR-001), y `Pie` sigue siendo Server Component: viaja como payload RSC dentro de `OcultaEnSimulacro` y no entra al bundle cliente.
- ✅ **La válvula `data-compacto` (D-8)** se estrena en el panel de navegación, que es la pantalla para la que se aprobó en el Paso 5.

**Obligaciones nuevas que este paso genera:**

- **Paso 12 — el simulacro NO guarda todavía su `IntentoSimulacro`.** Es deliberado y es la misma decisión que tomó el quiz en el Paso 9: `IntentoSimulacro.desglose` exige `calcularDesglose`, que es de `src/lib/informe.ts` y nace en el Paso 12. Escribir un intento a medias hoy dejaría registros que ese paso tendría que migrar. Hoy el simulacro cierra, califica en pantalla con `ResumenSesion` y **borra la sesión**; lo que falta es persistir el intento y enlazar a `/resultados/[intentoId]`. El `intentoId` ya existe y es la semilla en string, como manda §4.
- **Paso 12 — `usar-sesion.ts` sigue calculando el puntaje con la fórmula de §7.5.** Sin cambio respecto al Paso 9: la línea está marcada en el archivo y se sustituye por la llamada a `calcularPuntaje` cuando `informe.ts` exista.
- **Paso 13 — `diagnosticarViabilidad` NO es exacta si el blueprint filtra por tipo o dificultad**, y lo dice: devuelve `exacto: false`. El diagnóstico es el primero que filtrará (`tiposPermitidos: ['unica','emparejar','caso']`, dificultades 1 y 2), así que ahí hay que ampliar el censo con la distribución **conjunta** tipo × dificultad —las marginales no bastan— o cargar el banco en el servidor y contar de verdad. Con el censo actual el veredicto sería una **cota superior**: podría decir «viable» y no serlo.
- **Cualquier paso que añada un archivo a `src/lib/` importado desde el layout raíz** debe declarar qué arrastra. El canario de ADR-010 **no** cubre esto: vigila contenido, no dependencias. La comprobación es la métrica `/layout` js gz de `COMPONENTES.md`, y este paso demostró que un import inocente cuesta 16 kB en todas las rutas.
- **Sin paso asignado, al `software-architect` — la regla de las 300 líneas contradice la práctica.** `controlador-simulacro.tsx` tiene **368 líneas** (251 sin comentarios) y **ADR-020 justifica la partición precisamente con esa regla**, así que el argumento y el resultado no cuadran. No es un caso aislado: `controlador-sesion.tsx` (390) y `controlador-repaso.tsx` (594) se aprobaron en los pasos 9 y 10. O la regla se cuenta sobre líneas de **código** —y entonces las tres pasan— o necesita una enmienda que diga cuál es el número real. Hoy es una regla que nadie cumple y nadie aplica, que es la peor clase de regla. Lo levantó el `code-reviewer` en el Paso 11 (M1).

- **Paso 12 — el resumen de un simulacro se pierde con F5.** Consecuencia declarada de no persistir `IntentoSimulacro` todavía: se pueden hacer 120 minutos y perder el resultado recargando la pantalla de cierre. Se acepta hoy porque escribir un intento sin `desglose` dejaría registros que el Paso 12 tendría que migrar, pero **que nadie lo dé por resuelto**: desaparece cuando `guardarIntento` entre en juego.

- **Pasos 15–17 — volver a medir A-29 con la cuadrícula de 100 celdas real.** El auditor la midió clonando celdas en el DOM, no con banco de verdad, y avisó de que con 100 ítems el problema **empeora**: 652 px y 15 filas. El `scroll-padding-bottom` que lo corrige está puesto; lo que falta es confirmarlo sobre el simulacro final ya armable.

- **Paso 18.10 — `SimulacroSinRed` no se ha ejercitado en runtime.** Solo se alcanza si el `import()` del banco rechaza, y en la auditoría el chunk ya estaba cacheado. Queda auditado por código, no por comportamiento — **exactamente el mismo hueco que `src/app/error.tsx`**, que ya estaba en esta lista. Se prueban juntos, con red cortada sobre build de producción.

- **Pasos 15–17 — la portada del simulacro avisará del reparto incumplido.** En cuanto haya ítems suficientes en total pero repartidos desigual, `repartoIncumplido` se enciende y la portada dice que el reparto por tema no será el del examen real. Es el estado esperado durante toda la producción de contenido, no un error.

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

- ~~**`DISENO.md` §1.4, fila D-1, afirma algo falso y es anterior a ADR-014.**~~ **Corregido el 2026-07-30, Paso 11.** El consumidor real de `text-aviso` como texto ya existe y está medido: el **cronómetro entre los 10 y los 2 minutos** (`cronometro-visual.tsx`). La fila de `DISENO.md` §1.4 se actualizó con esa justificación en vez de con la del `<Ojo>`, donde `text-aviso` solo tiñe el icono.

- ~~**`CLAUDE.md` sostiene entero el sistema de erratas que ADR-014 eliminó.**~~ **Editado el 2026-07-30** (enmienda a ADR-014): once secciones limpias, 366 líneas fuera. §1 **sustituye** el diferenciador en vez de borrarlo. Y **§21 y §22 ganan una regla 15** que dice por qué el documento está limpio, para que una copia vieja no reintroduzca el sistema en silencio.

- **ADR-008 pendiente de ratificación** por el `software-architect`: añade una tercera clave de `localStorage` donde §6 dice "dos claves, deliberadamente separadas", más API pública nueva. El `code-reviewer` no lo bloqueó — corrige que §6 destruyera el progreso y restaura un invariante en vez de romperlo.
- Dos verrugas cosméticas del validador que se dejaron a propósito: el resumen cuenta `items` **antes** de validar mientras las cuotas juzgan solo los válidos (la cabecera puede decir 27 y la cuota 25), y `conteoPorModulo` conserva ese mismo conteo. Inofensivas; revisar solo si estorban en los pasos 15–17.
- Los guards de versión de `intentarMigrar` son **redundantes hoy** (`esqEstadoProgreso.version` es `z.literal(1)` y Zod ya rechaza ambos casos). Con la v2 del esquema pasan a ser portantes y necesitarán test propio.
