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
- ~~**Sin paso asignado, al `software-architect` — la regla de las 300 líneas contradice la práctica.**~~ **Resuelto el 2026-07-30 por ADR-022**, con enmienda a ADR-020 y edición de `CLAUDE.md` §21 regla 1. La regla se mantiene en **300**, contadas ahora en **líneas de código** (`skipComments` + `skipBlankLines`, tal como las mide ESLint `max-lines`): faltaba la unidad, no el número. Medido así, el segundo archivo más grande del alcance son 294 líneas y el mayor 414 — no hay nada entre medias, así que 300 cae en un hueco natural de la distribución. **Deja un único incumplidor, `controlador-repaso.tsx` (414), que pasa a ser obligación del Paso 12** junto con el encendido de la compuerta de ESLint.

- **Paso 12 — el resumen de un simulacro se pierde con F5.** Consecuencia declarada de no persistir `IntentoSimulacro` todavía: se pueden hacer 120 minutos y perder el resultado recargando la pantalla de cierre. Se acepta hoy porque escribir un intento sin `desglose` dejaría registros que el Paso 12 tendría que migrar, pero **que nadie lo dé por resuelto**: desaparece cuando `guardarIntento` entre en juego.

- **Pasos 15–17 — volver a medir A-29 con la cuadrícula de 100 celdas real.** El auditor la midió clonando celdas en el DOM, no con banco de verdad, y avisó de que con 100 ítems el problema **empeora**: 652 px y 15 filas. El `scroll-padding-bottom` que lo corrige está puesto; lo que falta es confirmarlo sobre el simulacro final ya armable.

- **Paso 18.10 — `SimulacroSinRed` no se ha ejercitado en runtime.** Solo se alcanza si el `import()` del banco rechaza, y en la auditoría el chunk ya estaba cacheado. Queda auditado por código, no por comportamiento — **exactamente el mismo hueco que `src/app/error.tsx`**, que ya estaba en esta lista. Se prueban juntos, con red cortada sobre build de producción.

- **Pasos 15–17 — la portada del simulacro avisará del reparto incumplido.** En cuanto haya ítems suficientes en total pero repartidos desigual, `repartoIncumplido` se enciende y la portada dice que el reparto por tema no será el del examen real. Es el estado esperado durante toda la producción de contenido, no un error.

## Paso 12 — Informe · ✅ CERRADO el 2026-07-31

Las cuatro obligaciones heredadas del Paso 11, cerradas:

- ✅ **El crash de ADR-008/§5 en `esqIntento`**, reproducido desde el Paso 4: `porBloque` y `porNivel` pasan a `z.object` con todas sus claves (**ADR-023**), y el motor gana además una lectura defensiva propia — el esquema protege la puerta de `/ajustes`, pero `construirInforme` es público y no debe depender de que alguien haya validado.
- ✅ **`IntentoSimulacro` se persiste** al cerrar un simulacro, con su desglose real. Eso desbloqueó `itemsRecientes`, que el Paso 11 había dejado cableado apuntando a una lista vacía: dos simulacros seguidos ya no repiten ítems.
- ✅ **`controlador-repaso.tsx`: 414 → 170 líneas de código**, extrayendo `SesionRepaso` a su archivo. **La compuerta `max-lines` está ENCENDIDA** en `eslint.config.mjs` y verificada por mutación (con `max: 150` salta en 16 archivos).
- ✅ **`repaso-vacio.tsx` (6 exportados) partido** en `sesion/repaso/`: un componente por archivo, más `Marco` y `accion-siguiente`.
- ✅ **`opcion-unica.tsx` (2 exportados) resuelto mirando el código**, como pedía la nota: `GrupoOpcionUnica` **tiene consumidor externo** (`caso.tsx`), así que no es un auxiliar interno sino una pieza pública, y le toca archivo propio. No hizo falta excepción. **El criterio queda escrito** en la cabecera de `grupo-opcion-unica.tsx` y sirve para el próximo caso: *un componente con consumidor fuera de su archivo es público; uno que solo usa el archivo que lo define es un auxiliar y puede convivir.*

**Obligaciones nuevas que este paso genera:**

- **Paso 13 — el diagnóstico también termina en un informe.** `construirInforme` ya lo soporta (`tipo: 'diagnostico'`), y `/diagnostico` tendrá que persistir su `IntentoSimulacro` igual que hacen los simulacros, con `diagnosticoHecho` puesto por `guardarIntento`.
- **Paso 13 — `diagnosticarViabilidad` sigue sin ser exacta con filtros.** Sin cambios respecto al Paso 11: el diagnóstico filtra por tipo y dificultad, así que su veredicto es una cota superior y la portada lo bloquea (`exacto: false`). Hay que ampliar el censo con la distribución conjunta tipo × dificultad, o cargar el banco en el servidor y contar.
- **Paso 18 — reconsiderar recharts si sigue siendo la única gráfica.** Cuatro barras horizontales son ~40 líneas de SVG a mano y ahorrarían la dependencia entera; hoy se conserva porque §2 la fija y el 18 puede querer más visualizaciones. Ver **ADR-024**.
- **Pasos 15–17 — el informe mejora solo con el contenido.** Hoy un simulacro solo puede tocar C5, así que `temasPrioritarios` devuelve un tema y `dominioPorBloque` una barra. Nada que arreglar: la pantalla ya dice la verdad sobre lo que midió.

## Paso 13 — Diagnóstico y plan · ✅ CERRADO el 2026-07-31

Las dos obligaciones heredadas, cerradas: el diagnóstico persiste su `IntentoSimulacro` como los simulacros, y **`diagnosticarViabilidad` ya es exacta con filtros** (ADR-025) — `censarModulosPara` cuenta en el servidor aplicando el filtro del blueprint.

**Obligaciones nuevas que este paso genera:**

- **Paso 14.4 — el punto 13.4 del blueprint queda diferido, y se declara.** «Conectar `tareasDeHoy` con la tarjeta *Continuar donde ibas* de la portada» no se hizo: la portada sigue siendo la provisional del Paso 5 y su reemplazo es del 14.4, que ya está en esta lista. `tareasDeHoy` y `diaVigente` existen, tienen test y **no tienen consumidor** fuera de ellos hasta entonces. Lo levantó el `code-reviewer`: no bastaba con que la obligación de la portada estuviera anotada, faltaba decir que este punto del paso 13 se apoyaba en ella.
- **Paso 14.4 — `/plan` y `/diagnostico` no son alcanzables desde el armazón.** No están en `DESTINOS` (§11.5 fija cinco: Inicio, Módulos, Repaso, Simulacros, Ajustes) ni en la portada provisional. Hoy solo se llega escribiendo la URL, o desde el enlace a `/diagnostico` que vive dentro de `/plan`. La portada real del 14.4 es su sitio natural.
- **Paso 18.5 — `/ajustes` sigue devolviendo 404 y ya hay tres sitios que enlazan ahí**: el pie (desde el Paso 5), `DESTINOS` y ahora la nav. **`/plan` ya NO**: su campo de fecha de examen se construyó en este paso precisamente porque el remedio del requisito «sin fecha el plan sigue siendo útil» no podía ser un enlace roto. Cuando `/ajustes` exista tendrá su propio campo de fecha; los dos escriben por `guardarDatosPersonales`.

## Paso 14 — Punto de corte usable · ✅ CERRADO el 2026-07-31

- ✅ **La portada real** reemplaza la provisional del Paso 5. `tareasDeHoy`/`diaVigente` del Paso 13 ya tienen consumidor: la prioridad de «continuar donde ibas» consulta el plan del día.
- ✅ **Los 5 SVG de create-next-app borrados.** `public/` queda vacío hasta que el 18.1 meta los iconos de la PWA — que era justo el motivo de borrarlos antes: no colarse en el precache de Serwist.
- ✅ **`/plan` y `/diagnostico` alcanzables** desde la portada, sin tocar los cinco destinos de la barra (§11.5) ni reabrir A-01. Ver ADR-027.
- ✅ **Los 28 módulos navegables** con estado vacío honesto en las cuatro etapas, ahora también con el **cuándo**: `OrdenPublicacion` dice en qué puesto de la cola va el bloque, sin inventar fechas.

**Obligaciones nuevas que este paso genera:**

- **Paso 18.1 — `public/` está vacío.** Los iconos `icono-192.png`, `icono-512.png`, `icono-maskable.png` y `og.png` que pide §16 hay que crearlos: ya no hay ningún archivo ahí que sirva de plantilla ni que estorbe.
- **Paso 18.5 — `/ajustes` YA NO es 404: tiene un anticipo honesto** (`src/app/ajustes/page.tsx`), porque era el quinto destino de la barra en las 18 rutas y este paso declara la app compartible. **El 18.5 reemplaza ese archivo entero** y no debe conservar nada suyo salvo dos cosas: la obligación de exponer la cuarentena de ADR-008, y el aviso de que sin respaldo el progreso se pierde al borrar los datos del navegador — que hoy solo está ahí.
- **Pasos 15–17 — la portada mejora sola con el contenido.** Hoy el denominador de «módulos dominados» es 1 (los publicados), y el escalón 6 de la prioridad —«vas al día con lo que hay»— es alcanzable de verdad. Con 29 módulos publicados ese escalón pasa a ser raro y el plan del día toma el mando.

## Paso 15 — Contenido del bloque D · y todo paso que escriba tablas

- **El CSS de la ficha declara claves hasta `--et-7`.** Una tabla de **8 columnas o más** apilaría igual, pero de la octava en adelante el valor saldría **sin su clave**. Ninguna tabla de las cartillas llega a 6; si alguna llegara, se añade la línea que falte en `globals.css` §3.2.

- ~~**A-18 · «0 violaciones de axe» ya NO significa «tabla verificada».**~~ **Resuelto al cerrar A-22** (2026-07-30): el degradado que cegaba a axe sobre las celdas de tabla ya no existe, así que un informe en verde vuelve a responder por ellas. **No hay que medir a mano el contraste de las tablas nuevas.** Se deja tachado y no borrado porque la advertencia circuló varios días.

- **A-23 · lo que sí hereda este paso, y es más caro que lo anterior.** El remedio de A-22 (`overflow-wrap: anywhere` en `.prose-idoneo table`) partía palabras normales en las cabeceras: «Zon/a», «Aeróbi/co», «Sustrat/o». Ya arreglado en el Paso 8b repartiendo el valor por rol de celda (`th: normal` · `td: break-word` · `td::before: normal`). **La lección operativa para 29 módulos de tablas:** un cambio de maquetación tipográfica sobre `table` llega por herencia a rótulos y valores por igual, y son roles con necesidades opuestas. Al tocar el CSS de tabla, se comprueba con **una tabla ancha real a 375 px**, no con una de dos columnas. Ver A-23 en `ACCESIBILIDAD.md`.

## Paso 15 — Bloque D · ✅ CERRADO el 2026-07-31

Los 8 módulos publicados: 25 ítems y 15 tarjetas cada uno. Banco 28 → 228, glosario 22 → 49.

**Obligaciones nuevas, y la primera es la que más importa:**

- **Pasos 16 y 17 — FIJAR LA NUMERACIÓN DE `Tema/Subtema` DEL BLOQUE ANTES DE REPARTIR EL TRABAJO.** Con cuatro escritores en paralelo cada uno numeró por su cuenta y **«Subtema 3.4» acabó apuntando a fuerza Y a flexibilidad**, «Subtema 4.1» a resistencia Y a planificación. La `referencia` es el mapa con el que el usuario verifica el dato en la cartilla: una que apunta a dos sitios no sirve. Costó remapear 50 campos. Esquema ya fijado para D: **Tema 3 = capacidades (3.1 fuerza · 3.2 resistencia · 3.3 velocidad · 3.4 flexibilidad)**, **Tema 4 = planificación (4.1 modelos · 4.2 estructuras)**.

- **Pasos 16 y 17 — el sesgo de longitud de la opción correcta, que es deuda de la PLANTILLA.** §14.4 dice «la correcta nunca puede ser la más larga y detallada» y el bloque D la incumple en el **62,5 %** de los ítems… pero **C5, la plantilla de oro, lo incumple en el 76 %**. Medido por el `code-reviewer`. O sea: el bloque D salió mejor que el modelo que se le mandó replicar, y aun así es una pista explotable — a 750 ítems, un usuario espabilado aprende a marcar la larga sin leer.
  **Barajar no lo cura**: `presentarItem` cambia el orden, no la longitud. Los peores son `d4-resistencia` (75 %) y `d6-flexibilidad` (69 %); los ids están en la bitácora del revisor. Para 16–17: **instruir al `technical-writer` de que iguale longitudes**, y decidir si se repasa C5 y D o se acepta la deuda declarada.

- **Verificable contra el material oficial:** los subtemas de `referencia` se asignaron por coherencia temática, no contra la numeración real de la Cartilla 4. Corregirlo sería un renombrado mecánico de un campo, sin tocar contenido.

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

- ~~**Pregunta abierta al usuario — la otra mitad de la regla 1 tampoco describe la práctica.**~~ **Resuelta el 2026-07-31 por el usuario:** la regla dice «un componente **exportado** por archivo», porque los auxiliares locales no son componentes públicos. `CLAUDE.md` §21 regla 1 editada; ver la enmienda a ADR-022. Deja **dos** incumplidores, que suben como obligación del Paso 12 (arriba).