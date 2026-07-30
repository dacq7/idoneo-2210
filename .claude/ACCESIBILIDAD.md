# Estado de accesibilidad — Idóneo 2210

Estándar: **WCAG 2.2 nivel AA**. Última auditoría completa: **2026-07-30** (Paso 7,
rama `paso-7-mdx`). Reverificada **tres** veces el mismo día: primero los arreglos
de A-01 a A-05 (Paso 5), después **los nueve cambios del Paso 7** — A-09 a A-13 más
los cuatro de `DISENO.md` §2.5 y §3.1—, y por último **la ficha por fila de
`DISENO.md` §3.2**, cada uno con su cifra de antes y de después. De la segunda
reverificación salieron **A-17** (el degradado de A-11 invertido en oscuro dentro
de `<TablaClave>`) y **A-18** (axe pierde la tabla de vista); de la **tercera**,
que cierra el paso, salen **A-19 a A-22**. Ver las dos secciones finales.

**A-11 y A-17 quedan cerrados**: §3.2 restituye el dato truncado a 375 px y la
tapa del degradado pasa a `--background`, con lo que las tres variantes colapsan
en una y la señal deja de estar invertida en oscuro.

Público real: adultos de 30 a 60 años, muchos con presbicia, estudiando de noche
o con sol directo, **en el celular y con una mano**. Un contraste flojo o un
objetivo táctil de 32 px los excluye de verdad. Por eso los dos temas se auditan
por separado y a 375 px reales, no estimados.

---

## Cobertura por ruta

Solo existen dos rutas en este paso. Las demás llegan en pasos posteriores.

| Ruta | Teclado | Lector | Contraste claro | Contraste oscuro | 375 px | Zoom 200 % | Veredicto | Fecha |
|---|---|---|---|---|---|---|---|---|
| `/` (portada provisional) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **APROBADA** (con A-07 y A-08, los dos Menores y cosméticos) | 2026-07-30 |
| 404 (`not-found.tsx`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **APROBADA** (hereda A-07 y A-08) | 2026-07-30 |
| `error.tsx` | ⏳ no ejercitado | ⏳ | ✅ (estático) | ✅ (estático) | ⏳ | ⏳ | **SIN VERIFICAR** | 2026-07-30 |
| `RotuloBloque` (componente, sin ruta que lo consuma) | n/a (no interactivo) | ✅ solo por código | ✅ 4.85:1 peor caso (C) | ✅ 8.02:1 peor caso (C) | n/a | n/a | ~~**APROBADO POR CÓDIGO**~~ → **VERIFICADO EN RUNTIME el 2026-07-30** (Paso 7). Peor caso medido en navegador: **4.84:1** claro (C) · **7.27:1** oscuro (B). La predicción por código se confirma con 0,01 de desvío | 2026-07-30 |
| `/modulos/[slug]` — estado vacío (los 29 hoy) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **APROBADA** | 2026-07-30 |
| `/modulos/[slug]` — con teoría MDX (auditada con un `.mdx` temporal) | ✅ | ✅ A-09 · A-10 · A-12 **arreglados** | ✅ | ✅ **A-17 cerrado** | ✅ | ✅ | ~~**PARCIAL** — 2 Moderados (A-10, A-11)~~ → ~~**PARCIAL** por A-17~~ → **APROBADA 2026-07-30** tras la ficha de §3.2: axe **0 violaciones** en los cuatro cruces de tema × ancho · **A-11 y A-17 cerrados** · quedan A-19 a A-22, los cuatro **Menores** y ninguno bloqueante | 2026-07-30 |
| `/erratas` (14 fichas, 3 grupos, anclas) | ✅ | ✅ **A-13 arreglado** | ✅ | ✅ | ✅ | ✅ | ~~**APROBADA** (con A-13 y A-16, los dos Menores)~~ → **APROBADA sin salvedades** tras la reverificación: A-13 y A-16 cerrados, axe 0/0 en los dos temas | 2026-07-30 |

Reverificación del 2026-07-30, con los cuatro arreglos aplicados:
**axe-core 4.x — 0 violaciones y 0 incompletas en los dos temas**, en `/` y en el
404 (40 reglas pasadas por corrida). Sin scroll horizontal a 640 px, 320 px ni
188 px. Foco de 2 px sólido vivo en los **11** enfocables de cada ancho, en los
dos temas. Ningún enfocable fantasma.

El armazón (`shell` · `encabezado` · `riel-bloques` · `nav-inferior` ·
`barra-lateral` · `interruptor-tema` · `pie`) envuelve **todas** las rutas
futuras: los hallazgos A-01 a A-05 se heredan a cada pantalla que se construya
encima hasta que se arreglen.

`error.tsx` no se pudo ejercitar en runtime: en `dev` el overlay de Next
intercepta el límite de error. Usa el mismo `<Button>` + `<Link>` que el 404, que
sí quedó verificado (foco 2 px sólido, alcanzable con `Tab`). Volver a verificarlo
con un build de producción en el Paso 18.10.

---

## Hallazgos — historial completo

Un hallazgo arreglado **no se borra**: se marca con fecha y con la cifra de antes
y la de después. El historial es lo que evita que vuelva.

| Id | Severidad | Estado |
|---|---|---|
| A-01 | Serio | **arreglado 2026-07-30** |
| A-02 | Moderado | **arreglado 2026-07-30** (residuo cosmético, no es fallo) |
| A-03 | Moderado | **arreglado 2026-07-30** (deja A-07 como código muerto) |
| A-04 | Menor | **aceptado 2026-07-30** — `DISENO.md` §4.6. No es fallo AA. Cerrado |
| A-05 | Menor | **arreglado 2026-07-30** en el objetivo táctil; abre A-08 |
| A-06 | Menor | **arreglado 2026-07-30** en documentación (`DISENO.md` §1.3) |
| A-07 | Menor | **abierto** — el `focus-visible:outline-none` del `<main>` no surte efecto |
| A-08 | Menor | **abierto** — el `py-2` del pie descuadra el párrafo de atribución |
| A-09 | Menor | **abierto** (Paso 7) — tres landmarks `complementary` idénticos «Ojo con esto» |
| A-10 | Moderado | **abierto** (Paso 7) — el contenedor desplazable de tabla es enfocable sin nombre ni rol |
| A-11 | Moderado | **abierto** (Paso 7) — la tabla se corta sin ninguna señal de que sigue a la derecha |
| A-12 | Menor | **abierto** (Paso 7) — `<th>` sin `scope` y primera columna sin `rowheader` |
| A-13 | Menor | **abierto** (Paso 7) — tres enlaces «Ver todas las erratas» con el mismo nombre y tres destinos |
| A-14 | Menor | **aceptado** (Paso 7) — los contenedores de tabla son enfocables aunque no desborden. **Ampliado 2026-07-30**: con la ficha, la tabla ancha se suma a las paradas muertas a 375 px |
| A-15 | Menor | **abierto** (Paso 7) — 88,5 caracteres por línea desde `md`. Decide `ui-designer` |
| A-16 | Menor | **abierto** (Paso 7) — 11 px en versalitas para etiquetas de contenido. Decide `ui-designer` |
| A-17 | Moderado | **arreglado 2026-07-30** — la tapa pasa a `--background`; las tres variantes colapsan en una |
| A-18 | Menor | **resuelto a medias 2026-07-30** — a 375 px axe recupera las celdas de la tabla ancha (17 → 0). A 1280 px sigue ciego: ver **A-22** |
| A-19 | Menor | **abierto** (§3.2) — bajo `sm` el envoltorio promete un desplazamiento que ya no existe. **Arreglo probado en runtime** |
| A-20 | Menor | **abierto** (§3.2) — la clave de la ficha se anuncia en VERSALITAS. Corrige una afirmación mía del Paso 5 |
| A-21 | Menor | **abierto** (§3.1) — la banda «74,4–75,0 cpl» no se cumple en 2 de 4 superficies. Decide `ui-designer` |
| A-22 | Menor | **abierto** (§3.2) — por encima de `sm` ninguna tabla desborda: el degradado no señala nada y cuesta 49 incompletas de axe |

---

### A-01 · La barra inferior pierde el quinto destino al 200 % de zoom
**Criterio:** 1.4.4 Resize Text (AA) · 2.5.8 Target Size (Minimum) (AA) · **Severidad: Serio**
**Dónde:** `src/components/layout/nav-inferior.tsx:30` (el `<li className="flex-1">`)

**Problema.** Los cinco `<li>` son `flex-1` (`flex: 1 1 0%`) pero conservan el
`min-width: auto` que trae por defecto todo ítem flex, así que **no pueden
encogerse por debajo de su contenido**. «Simulacros» son ~63 px de `min-content` y
no caben en el quinto del ancho disponible. Medido en navegador:

| Viewport CSS | Equivale a | `Inicio` | `Módulos` | `Repaso` | `Simulacros` | `Ajustes` |
|---|---|---|---|---|---|---|
| 375 px | 100 % | 75 px | 75 px | 75 px | 75 px | 75 px · **visible 100 %** |
| 220 px | ≈170 % | 31 px | 49 px | 43 px | 63 px | 44 px · **visible 79 %** |
| 188 px | **≈200 %** | 31 px | 49 px | 43 px | 63 px | 44 px · **visible 3 px = 6 %** |

A 188 px la celda de `Ajustes` va de x=185 a x=229 con el viewport en 188: su
**centro cae fuera de la pantalla** y `document.scrollWidth` sigue siendo 188, así
que **no hay scroll horizontal con el que recuperarla**. El quinto destino de la
navegación principal deja de ser pulsable: queda una astilla de 3 px.

A quién afecta y cómo: exactamente al usuario con presbicia que sube el zoom al
200 % — el que más lo necesita. Tiene rodeo (el pie trae «Ajustes y respaldo», y
con `Tab` sí se alcanza), por eso es Serio y no Crítico.

**Arreglo** (verificado en navegador: a 188 px pasa a cinco celdas iguales de
38 px, todas visibles y con el centro dentro de la pantalla; a 375 px nada cambia):

```tsx
// 1) el <li> deja de tener suelo de contenido
<li key={href} className="min-w-0 flex-1">

// 2) la etiqueta degrada en vez de empujar la celda.
//    sr-only conserva el nombre accesible: verificado con CDP, el enlace sigue
//    anunciándose «Inicio» y «Ajustes y respaldo».
<span className="max-w-full truncate px-0.5 text-[0.6875rem] leading-none tracking-[0.01em] max-[22rem]:sr-only">
  {etiqueta}
</span>
```

El estado activo sobrevive sin etiqueta: quedan `aria-current="page"`, la lengüeta
de color y el icono.

**Estado: arreglado 2026-07-30** — `min-w-0` en el `<li>` y
`max-w-full truncate px-0.5 max-[22rem]:sr-only` en la etiqueta. Reverificado
midiendo las cinco celdas:

| Viewport CSS | `Inicio` | `Módulos` | `Repaso` | `Simulacros` | `Ajustes` | scrollWidth |
|---|---|---|---|---|---|---|
| **antes**, 188 px (≈200 %) | 31 px | 49 px | 43 px | 63 px | 44 px · **visible 6 %**, centro en x=207 **fuera** del viewport | 188 (sin scroll para recuperarlo) |
| **después**, 188 px | 37,6 px | 37,6 px | 37,6 px | 37,6 px | 37,6 px · **visible 100 %**, centro en x=169,2 **dentro** | 188 |
| **después**, 375 px | 75 px | 75 px | 75 px | 75 px | 75 px · visible 100 % | 375 |

- Los cinco `<li>` computan `min-width: 0px`. A 188 px las cinco celdas van de
  x=0 a x=188 y **los cinco centros caen dentro del viewport** (18,8 · 56,4 · 94 ·
  131,6 · 169,2).
- **A 375 px nada cambió**: cinco celdas de 75 px, etiquetas visibles y sin
  recorte (`scrollWidth == clientWidth == 375`, ningún `<span>` desborda).
- Objetivo táctil a 188 px: **37,6 × 64 px**, por encima del 24 × 24 de 2.5.8 AA.
  La altura de 64 px no se toca en ningún ancho.
- Umbral de degradación: la etiqueta pasa a `sr-only` en `≤ 352 px`. Entre 352 y
  375 px es visible y **nunca se recorta** — no hay ventana con puntos suspensivos.
- **Sin regresión de nombre accesible.** Medido en el árbol de accesibilidad a
  375, 188 y 94 px, los cinco nombres son idénticos en los tres anchos: «Inicio»,
  «Módulos de estudio», «Repaso del día», «Simulacros cronometrados», «Ajustes y
  respaldo». `sr-only` conserva el nombre íntegro, y para cuatro de los cinco el
  `aria-label` lo garantiza además por su cuenta.

---

### A-02 · La región viva de avisos se anuncia en inglés
**Criterio:** 3.1.2 Language of Parts (AA) · **Severidad: Moderado**
**Dónde:** `src/components/layout/proveedores.tsx:21`

**Problema.** El `<Toaster>` de sonner monta un landmark
`role="region"` cuyo nombre accesible es, medido en el árbol de accesibilidad,
**`"Notifications alt+T"`** — en inglés, dentro de un documento `lang="es-CO"`.
Es la región que va a anunciar **todos** los avisos de la app desde el Paso 9, y
hoy un lector de pantalla en español la lee con fonética española sobre texto
inglés. Es el caso que la regla del proyecto prohíbe explícitamente: contenido en
español sin etiquetas ARIA en inglés mezcladas.

**Arreglo** (una prop, sin tocar los 18 archivos generados de `ui/`):

```tsx
<Toaster position="top-center" containerAriaLabel="Avisos" />
```

**Estado: arreglado 2026-07-30.** Medido en el árbol de accesibilidad:

| | Nombre accesible de la región viva |
|---|---|
| **antes** | `"Notifications alt+T"` — palabra inglesa dentro de `lang="es-CO"` |
| **después** | `"Avisos alt+T"` |

El DOM queda como `<section aria-label="Avisos alt+T" aria-live="polite"
aria-atomic="false">`, rol `region`, no ignorada. `<html lang="es-CO">` intacto.

**Residuo, y por qué no es fallo.** sonner **concatena su pista de atajo** al
`containerAriaLabel` que se le pase, así que el nombre no es exactamente
«Avisos» sino «Avisos alt+T». Lo que se corrigió es lo que importaba: la palabra
en inglés desapareció. `alt+T` es notación de tecla, no prosa inglesa, y describe
un atajo que existe de verdad (lleva el foco a la región de avisos), así que
3.1.2 queda satisfecho. Si en el Paso 9 se quiere el nombre limpio, sonner acepta
además una prop `hotkey`. No es deuda bloqueante.

---

### A-03 · El enlace de salto no mueve el foco
**Criterio:** 2.4.1 Bypass Blocks (A) · **Severidad: Moderado**
**Dónde:** `src/components/layout/shell.tsx:31` (`<main id="contenido">`)

**Problema.** «Saltar al contenido» apunta a `#contenido`, pero `<main>` no es
enfocable y no lleva `tabindex="-1"`. Verificado en Chromium: **funciona** — tras
`Enter` el `hash` cambia, la página desplaza y el `Tab` siguiente continúa desde
`main`, saltándose el enlace de marca, el interruptor de tema y (en escritorio) la
barra lateral completa. Pero `document.activeElement` se queda en `<body>`: el
foco no se movió, solo se movió el punto de partida de la navegación secuencial.

En Safari/VoiceOver —el iPhone que el Paso 18.10 exige probar— ese punto de
partida no es fiable: el usuario activa el salto y no oye nada ni cambia de sitio.

**Arreglo:**

```tsx
<main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-3xl grow px-4 pt-6 sm:px-6">
```

`tabIndex={-1}` no añade el `main` al orden de tabulación; solo lo hace destino
programático de foco. Con la regla de foco de `globals.css` conviene además
comprobar que el `main` no dibuje contorno al recibir foco programático
(`[tabindex]:focus-visible` sí está en el selector, pero `:focus-visible` no se
activa en foco programático de un contenedor, así que no debería pintar nada).

**Estado: arreglado 2026-07-30** en lo que importaba. Medido tras `Tab` + `Enter`:

| | `document.activeElement` tras activar el salto |
|---|---|
| **antes** | `<body>` — el `hash` cambiaba y la página desplazaba, pero el foco no se movía |
| **después** | `MAIN#contenido` (`tabindex="-1"`, `hash = "#contenido"`) |

- Funciona con teclado **y con ratón**: en los dos casos `activeElement` acaba en
  el `<main>`.
- **Sin regresión de orden de tabulación:** barrido de 22 `Tab` a 375 px, el
  `#contenido` **nunca** recibe el foco secuencial. Los enfocables siguen siendo
  11 y en el mismo orden visual.
- La última frase de arriba, la que decía que `:focus-visible` no se activaría,
  **resultó equivocada**: sí se activa. De ahí sale A-07.

---

### A-04 · El contorno de foco se funde con la lengüeta del destino activo
**Criterio:** 1.4.11 Non-text Contrast (AA) · **Severidad: Menor**
**Dónde:** `src/components/layout/nav-inferior.tsx:40` (`focus-visible:-outline-offset-2`)

**Problema.** La barra inferior mete el contorno 2 px hacia dentro para que no se
recorte contra el borde de la barra fija. La lengüeta del destino activo mide 4 px
y vive en `top-0`, así que **los 2 px superiores del contorno se dibujan encima de
la lengüeta**. Y `--ring` es el mismo azul acero que `--primary`:

| Contorno sobre… | Claro | Oscuro |
|---|---|---|
| `bg-primary` (rutas sin bloque: `/`, `/repaso`, `/simulacros`, `/ajustes`, 404) | **1.00:1** | **1.00:1** |
| `bg-bloque-a` | 1.23:1 | 1.21:1 |
| `bg-bloque-b` | 1.11:1 | 1.02:1 |
| `bg-bloque-c` | 1.31:1 | 1.12:1 |
| `bg-bloque-d` | 1.26:1 | 1.06:1 |
| `bg-background` (los otros tres lados) | 6.37:1 | 7.15:1 |

**No es un fallo de AA:** tres de los cuatro lados quedan a 6.37:1 / 7.15:1 y el
rectángulo de foco se lee sin ambigüedad — confirmado por captura en los dos
temas. Es una muesca cosmética en el borde superior, y solo en el destino que ya
está activo.

**Arreglo (opcional, decisión de `ui-designer`).** Si se quiere el contorno
íntegro, bajar la lengüeta 2 px (`top-[2px]`) o volver a `outline-offset-0` en la
barra inferior, con lo que el borde superior cae por encima de la lengüeta, sobre
el fondo de página. Si no, se acepta y se documenta aquí.

**Estado: cerrado el 2026-07-30 — aceptado sin cambio de código.** El
`ui-designer` lo registró como `DISENO.md` §4.6 con las tres condiciones que
obligarían a reabrirlo. Reverificado: **sigue exactamente como se midió y sigue
sin ser fallo AA.**

| Premisa de §4.6 | Medido el 2026-07-30 |
|---|---|
| La lengüeta mide 4 px y vive en `top-0` | `height: 4px`, `top: 0px`, `position: absolute`, `bg-primary` — sin cambio |
| El contorno es de 2 px con `outline-offset` de −2 px en la barra | `2px solid`, `outline-offset: -2px` — sin cambio |
| La lengüeta **no** es el único marcador del destino activo | `aria-current="page"` + `font-weight: 600` + `text-foreground` — los tres presentes |

Contrastes sin cambio: `--ring` sobre `--primary` **1.00:1** en los dos temas, y
sobre los cuatro bloques 1.02–1.31:1; los otros tres lados del contorno a
**6.37:1 claro / 7.15:1 oscuro**. El indicador cumple 1.4.11 por sí solo. **No se
reporta como abierto.**

---

### A-05 · El enlace de la licencia es un objetivo de 15 px de alto
**Criterio:** 2.5.8 Target Size (Minimum) (AA) — **cumple por la excepción de destino en línea** · **Severidad: Menor**
**Dónde:** `src/components/layout/pie.tsx:17`

**Problema.** El enlace «CC BY-NC-SA 4.0» mide **108 × 15 px**. El piso táctil de
`@layer base` no lo alcanza porque `min-height` no aplica a cajas `inline`, tal
como DISENO.md §3 anticipa. Formalmente está exento de 2.5.8 (destino en línea
dentro de una frase), y con teclado se alcanza sin problema (posición 4 del orden
de tabulación, contorno 2 px sólido). Pero es el enlace que ADR-001 vuelve
requisito de licencia, y 15 px de alto con el pulgar y presbicia se falla varias
veces.

**Arreglo:**

```tsx
className="inline-block py-2 underline underline-offset-2 hover:text-foreground"
```

`inline-block` hace que el piso de 44 px sí aplique; `py-2` da área de toque sin
romper el flujo del párrafo. Verificar que no descuadre el interlineado del
párrafo legal.

**Estado: arreglado 2026-07-30** en el objetivo táctil. Esa última advertencia
—«verificar que no descuadre el interlineado»— **se cumplió**: sí descuadra, y de
ahí sale A-08.

| | Caja del enlace | `display` | `min-height` aplicado |
|---|---|---|---|
| **antes** | **108 × 15 px** | `inline` | no (no aplica a cajas `inline`) |
| **después** | **108 × 44 px** | `inline-block` | sí, `44px` |

**Sin regresión de holgura sobre la barra fija**, que era la otra preocupación:

| | Último elemento del pie → borde superior de la barra | Elementos del pie tapados |
|---|---|---|
| **antes** | 30,9 px | ninguno |
| **después** | **31,4 px** | ninguno |

La holgura la da el `py-8` del propio `<footer>` (32 px de `padding-bottom`), que
el arreglo no toca, y `.pb-nav` sigue reservando los 64 px de la barra. Verificado
con la página desplazada hasta el final.

---

### A-06 · DISENO.md §1.3 describe un foco de shadcn que no es el instalado
**Criterio:** — (defecto de documentación, riesgo de regresión) · **Severidad: Menor**
**Dónde:** `.claude/DISENO.md` §1.3, párrafo «Foco de teclado»

**Problema.** §1.3 afirma que «shadcn compone `focus-visible:outline-1
outline-ring` + `focus-visible:ring-[3px] ring-ring/50`». **La versión instalada
no trae ese contorno sólido.** Verificado archivo por archivo: `button`, `badge`,
`switch`, `input`, `select` y `accordion` componen únicamente `outline-none` +
`focus-visible:border-ring` + `focus-visible:ring-[3px] ring-ring/50`; solo
`tabs` y `scroll-area` traen `focus-visible:outline-1`. Y `border-ring` no dibuja
nada en un botón sin clase `border`, porque el ancho de borde es 0.

Es decir: la regla de `@layer utilities` de `globals.css` **no es redundante, es
el único portador del foco** en casi toda la app. Como DISENO.md es la fuente de
verdad aprobada, un agente futuro que lo lea puede concluir que la regla duplica
lo que ya hace shadcn y borrarla — y con ella el foco visible de toda la app.

**Arreglo.** Corregir el párrafo de §1.3 para que describa lo instalado y remita a
la regla de `globals.css` como portador único. Tarea de `ui-designer`, que es
quien mantiene DISENO.md.

**Estado: arreglado 2026-07-30.** `DISENO.md` §1.3 lleva el aviso
`⚠️ Corregido el 2026-07-30 (hallazgo A-06)`, dice explícitamente que la versión
anterior «es falsa para la versión instalada», describe lo que los 18 componentes
traen de verdad (`outline-none` + `focus-visible:border-ring` +
`focus-visible:ring-[3px] ring-ring/50`, con la nota de que `border-ring` no
dibuja nada sin clase `border`) y declara la regla de `globals.css` **único
portador que no se toca**. Además la tabla de prohibiciones de §5 añade la fila
«Borrar o mover la regla de foco de `globals.css` porque *shadcn ya lo hace*».
Cubre el riesgo de regresión que motivó el hallazgo.

---

## Hallazgos abiertos

Los dos son **Menores y cosméticos**: ninguno incumple AA, ninguno bloquea el
cierre del Paso 5. Los dos nacen de los arreglos de esta ronda, así que quedan
aquí para que no se pierdan.

### A-07 · El `focus-visible:outline-none` del `<main>` no surte efecto
**Criterio:** — (ninguno incumplido; 2.4.7 Focus Visible se cumple **de más**) · **Severidad: Menor**
**Dónde:** `src/components/layout/shell.tsx:39`

**Problema.** El arreglo de A-03 añadió `focus-visible:outline-none` al `<main>`
con la intención declarada en el comentario de que «el salto no pinte un contorno
sobre toda la columna». **Esa clase pierde la cascada y no hace nada.** Medido
tras activar el enlace de salto:

```
main#contenido → outline: 2px solid oklch(0.48 0.12 250) · outline-offset: 2px
                 :focus-visible coincide · caja de 375 × 505 px
```

Confirmado con CDP `CSS.getMatchedStylesForNode`: las dos reglas están **en la
misma capa `utilities`** y con la **misma especificidad (0,2,0)** —
`.focus-visible\:outline-none:focus-visible` frente a `[tabindex]:focus-visible`
(selector nº 7 de la regla de `globals.css`). A igual capa y a igual
especificidad decide el orden, y el bloque `@layer utilities` de `globals.css` va
**después** de las utilidades que emite Tailwind. Gana `globals.css`.

Efecto real: al usar «Saltar al contenido» se dibuja un rectángulo azul de 2 px
alrededor de toda la columna de contenido. Es transitorio —desaparece al
siguiente `Tab`— y **no infringe nada**: 2.4.7 quiere un indicador visible, y este
lo es. El problema es de mantenibilidad: el código afirma hacer algo que no hace,
y el siguiente que lea `shell.tsx` va a creerle.

**Arreglo — dos salidas, las dos legítimas.** Es decisión de diseño, igual que
A-04:

1. **Aceptar el contorno** (recomendado): borrar `focus-visible:outline-none`, que
   es código muerto, y documentar en `DISENO.md` que el destino del salto se
   señala con el contorno de la columna. Cuesta una clase menos y deja la
   confirmación visual del salto, que es útil con presbicia.
2. **Suprimirlo de verdad**: subir la especificidad, p. ej.
   `main#contenido:focus-visible { outline: none }` en `globals.css` junto a la
   regla de foco. Si se elige esta, hay que dejar escrito **por qué** el `main` es
   la única excepción al indicador de foco de la app.

**Estado:** abierto · a decidir por `ui-designer`

---

### A-08 · El `py-2` del enlace de licencia descuadra el párrafo de atribución
**Criterio:** — (ninguno incumplido; 1.4.8 Visual Presentation es AAA) · **Severidad: Menor**
**Dónde:** `src/components/layout/pie.tsx:25`

**Problema.** El arreglo de A-05 consiguió los 44 px, pero un `inline-block` de
44 px de alto **infla la caja de línea en la que vive**, y esa línea está en medio
del párrafo de atribución a COLEF/COCED:

| | Alto del párrafo (375 px) | Cajas de línea | Efecto visible |
|---|---|---|---|
| **antes** | 97,5 px | todas de 15 px | bloque legal parejo |
| **después** | **122 px (+24,5)** | 15 px … y **una de 44 px** | el párrafo se lee en tres trozos, con aire desigual alrededor de la línea de la licencia, y parte «Idóneo / 2210» a los dos lados del hueco |

A 1280 px el mismo efecto: 39 px → 63,5 px, de 2 líneas a 3. Confirmado por
captura en los dos anchos. No es un fallo AA, pero el bloque de atribución es
justamente el texto que ADR-001 vuelve requisito de licencia: conviene que se lea
limpio.

**Arreglo — medido, no supuesto.** Cuatro variantes probadas en el navegador:

| Variante | Caja de clic | Alto del párrafo | Descuadre |
|---|---|---|---|
| `inline` puro (antes de A-05) | 108 × 15 | 97,5 px | ninguno |
| `inline-block py-2` (lo que hay hoy) | 108 × **44** | 122 px | **+24,5 px** |
| `inline-block py-2 -my-2` | 108 × **44** | 106 px | +8,5 px |
| **`py-3.5` conservando `display:inline`** | 108 × **43** | **97,5 px** | **ninguno** |

La última es la buena: el `padding` vertical de una caja **`inline`** agranda el
área de toque y de pintado **sin tocar la caja de línea**, así que el párrafo
queda idéntico al original. Los 43 px superan de sobra el 24 × 24 de 2.5.8 AA (el
piso de 44 px es una norma interna del proyecto, más estricta que la norma), y con
`py-[15px]` se llega a 45 px si se quiere el número redondo.

```tsx
// pie.tsx — sin inline-block: el padding de una caja inline no infla la línea
className="py-3.5 underline underline-offset-2 hover:text-foreground"
```

Contrapartida honesta: el área de toque de un `inline` con 14 px de padding se
solapa con las líneas vecinas del párrafo, así que el enlace puede capturar
pulsaciones sobre el texto contiguo. Ese texto no es interactivo, así que el daño
es nulo, y nada se mueve visualmente.

**Estado:** abierto · a decidir por `ui-designer`

---

## Verificación independiente de los dos hallazgos que el implementador reportó arreglados

### 1 · «El foco de shadcn no cumplía 1.4.11; lo arreglé en `@layer utilities`» — **CONFIRMADO**

- **El diagnóstico es correcto.** La versión instalada no trae contorno sólido (ver
  A-06). Sin la regla de `globals.css`, el único portador sería el halo
  `ring-ring/50` a media opacidad.
- **La regla gana la puja de especificidad.** Confirmado con
  `CSS.getMatchedStylesForNode`: `.outline-none` y la regla propia están **en la
  misma capa `utilities`**, y ahí decide la especificidad — `button:focus-visible`
  (0,1,1) vence a `.outline-none` (0,1,0). También se confirmó que el
  `* { outline-color: color-mix(--ring 50%) }` de `@layer base` pierde por orden
  de capa.
- **Estado asentado, medido en los dos temas sobre los 9 enfocables:**
  `outline: 2px solid` a `--ring` **completo**, sin alfa.
  Contraste del contorno: **6.37:1 claro · 7.15:1 oscuro** (mínimo 3:1). ✅
- **Matiz encontrado, no es fallo.** En una primera medición leí el contorno a
  alfa 0.5 y 3 px. Era **artefacto de transición**: `transition-all` (deuda ya
  registrada en `COMPONENTES.md`) anima `outline-color` desde el `ring/50` de
  reposo hasta el `--ring` completo, y `outline-offset` de 0 a 2 px, durante
  ~150 ms. Es transitorio, no infringe AA, y con `prefers-reduced-motion` colapsa
  a 0.01 ms. Refuerza el caso para saldar la deuda de `transition-all`.

### 2 · «`text-muted-foreground` sobre `bg-accent` mide 4.47:1 en oscuro» — **CONFIRMADO, cifra exacta**

Medido de forma independiente: **4.47:1 en oscuro** y 4.72:1 en claro. El par
falla AA en oscuro, tal como dice. Las dos barras suben a `text-foreground` en el
mismo `hover:bg-accent` y con eso pasa a **14.71:1 claro · 10.92:1 oscuro**. ✅

**Barrido de todos los estados de hover y activo del paso — ninguno por debajo de AA:**

| Estado | Claro | Oscuro |
|---|---|---|
`nav-inferior` / `barra-lateral` hover (`text-foreground` sobre `bg-accent`) | 14.71 | 10.92 |
`barra-lateral` activo (`text-foreground` sobre `bg-accent/60`) | 15.63 | 12.75 |
`barra-lateral` activo sin hover, texto apagado sobre `bg-accent/60` | 5.01 | 5.22 |
`Button variant="ghost"` hover (`accent-foreground` sobre `accent`) — el interruptor de tema | 9.50 | 10.12 |
Destino inactivo en reposo (`muted-foreground` sobre `background`) | 5.48 | 6.22 |

---

## Contraste de tokens verificado

Medido de forma **independiente** parseando `src/app/globals.css`, convirtiendo
cada `oklch()` a sRGB y aplicando la fórmula WCAG 2.1. **Los 23 tokens coinciden
hex por hex con DISENO.md §1.1 y §1.2 en los dos temas: cero discrepancias.** Los
mínimos publicados en §1.3 se reproducen exactamente.

| Grupo | Par peor caso | Claro | Oscuro | Mínimo | AA |
|---|---|---|---|---|---|
| Texto sobre `background` / `card` / `muted` | `muted-foreground` / `muted` | 4.93 | 5.06 | 4.5 | ✅ |
| Semánticos como texto | `aviso` / `background` | **4.65** | 9.30 | 4.5 | ✅ |
| Semánticos como relleno | `aviso-foreground` / `aviso` | **4.63** | 9.22 | 4.5 | ✅ |
| Bloques como texto sobre `background` — **es el par de `RotuloBloque`** | `bloque-c` | **4.85** | 8.02 | 4.5 | ✅ |
| Bloques sobre su propio `-suave` | `bloque-c` | **4.64** | 6.27 | 4.5 | ✅ |
| `bloque-contraste` sobre el bloque sólido | `bloque-c` | 4.84 | 8.21 | 4.5 | ✅ |
| Borde que identifica un control (1.4.11) | `input` / `background` | **3.03** | 3.30 | 3.0 | ✅ |
| Anillo de foco (1.4.11) | `ring` / `background` | 6.37 | 7.15 | 3.0 | ✅ |
| Anillo de foco sobre lengüeta de color | `ring` / `primary` | **1.00** | **1.00** | 3.0 | ⚠️ A-04 |
| Separadores decorativos | `border` / `card` | 1.48 | 1.30 | — | **exento** |

### El par que necesita `RotuloBloque` — los cuatro bloques, remedidos el 2026-07-30

`text-bloque-{a,b,c,d}` sobre `--background`, que es exactamente lo que pinta el
componente nuevo. Texto de 11 px (`0.6875rem`), así que el umbral que aplica es el
de texto normal, **4.5:1**, no el de texto grande:

| Token | Hex claro | Claro | Hex oscuro | Oscuro | AA |
|---|---|---|---|---|---|
| `--bloque-a` | `#966000` | 5.16 | `#e0a546` | 8.68 | ✅ |
| `--bloque-b` | `#7151b7` | 5.73 | `#ac90f5` | 7.30 | ✅ |
| `--bloque-c` | `#007f65` | **4.85** ← peor caso | `#54ba9d` | 8.02 | ✅ |
| `--bloque-d` | `#b54d26` | 5.04 | `#ed8a5c` | 7.57 | ✅ |

**Confirmado: el peor caso es C a 4.85:1 en claro, exactamente lo que declara
`DISENO.md` §1.3.** Los cuatro pasan en los dos temas con margen. Y si alguna
página lo mete dentro de una tarjeta, sobre `--card` también pasan los cuatro
(claro 5.29 · 5.88 · 4.98 · 5.17; oscuro 7.96 · 6.69 · 7.36 · 6.94).

**`--border` por debajo de 3:1 es correcto y no es deuda.** Verificado en el CSS
real: solo dibuja separadores, filos de tarjeta y el borde de la barra fija —
información decorativa, exenta de 1.4.11. Los bordes que **sí** identifican un
control usan `--input` (`Input` y `SelectTrigger`, comprobado en los archivos), y
`--input` cumple 3:1 en los dos temas. La distinción de DISENO.md §1.3 se sostiene
en el código.

---

## Verificado y en orden — no volver a revisar sin causa

| Qué | Resultado |
|---|---|
| `<html lang="es-CO">` | ✅ presente |
| Jerarquía de encabezados | ✅ `/` → `h1` + `h2`, sin saltos · 404 → un solo `h1`. El encabezado no rotula sección, así que no compite |
| Landmarks | ✅ `banner`, `main`, `contentinfo` únicos; dos `navigation` con nombres distintos («Navegación principal», «Enlaces del pie») |
| Barra lateral oculta a 375 px | ✅ `display:none` real: **fuera del árbol de accesibilidad y del orden de tabulación**. Nunca hay dos «Navegación principal» a la vez |
| Enfocables fantasma (ocultos pero alcanzables con `Tab`) | ✅ **ninguno**, en los dos anchos. El patrón que el Paso 11 va a necesitar para ocultar el pie ya está sano aquí |
| Orden de tabulación | ✅ visual y sin trampas: salto → marca → tema → (barra lateral en `lg`) → contenido → pie → barra inferior |
| Estado activo de la nav | ✅ **no es solo color**: `aria-current="page"` + lengüeta de 4 px + `text-foreground` + peso 600 |
| Riel de bloques (elemento firma) | ✅ expuesto como `image` con alternativa textual completa en español: «Peso de cada bloque en el examen: A 20 %, B 22 %, C 33 %, D 25 %. No estás dentro de un bloque.» |
| Objetivos táctiles | ✅ todos los interactivos ≥ 44 px (nav 75×64, botón de tema 44×44, enlaces del pie 44 px, licencia 108×44 desde A-05). Ya sin excepciones |
| Válvula `data-compacto` (D-8) | ✅ **0 elementos la usan**. No está aflojando nada todavía |
| Scroll horizontal / reflow (remedido 2026-07-30) | ✅ `scrollWidth == clientWidth` a **640 px** (1280 al 200 %), **320 px** (el ancho de referencia de 1.4.10 para el 400 %) y **188 px** (375 al 200 %), en los dos temas. Fuera de norma: a 94 px (375 al 400 %, muy por debajo de lo que exige cualquier criterio AA) sí desborda —`scrollWidth` 142 vs 94— por el botón `shrink-0` del encabezado. Anotado, no es hallazgo |
| Pie tapado por la barra fija | ✅ no: `.pb-nav` deja **31,4 px de holgura** entre el último elemento del pie y el borde superior de la barra, y **ningún** elemento del pie queda por debajo del borde de la barra |
| Pie de atribución COLEF/COCED | ✅ legible en los dos temas (5.48 / 6.22), enlace a la licencia alcanzable con teclado y subrayado (no depende del color) |
| `prefers-reduced-motion` | ✅ respetado: duraciones a 1e-05 s |
| **Foco de 2 px en todos los enfocables** (reverificado 2026-07-30) | ✅ **11 enfocables por ancho** — 375 px y 1280 px, claro y oscuro, 44 medidas: todas `2px solid` a `--ring` **completo** (`oklch(0.48 0.12 250)` claro · `oklch(0.7 0.13 248)` oscuro), sin alfa. `outline-offset: 2px` en todos salvo la barra inferior, con su −2 px autorizado. **Corrijo mi propio número: son 11, no 9** |
| **Enfocables fantasma, recontado** (reverificado 2026-07-30) | ✅ **ninguno.** A 375 px las 5 celdas de la barra lateral tienen caja de 0 px porque su ancestro es `display:none`: están fuera del árbol de accesibilidad y el barrido de 22 `Tab` no las toca. A 1280 px pasa lo simétrico con la barra inferior. Un detector ingenuo por tamaño de caja las marca como falso positivo; el barrido de `Tab` es el juez |
| **`RotuloBloque`** (solo por código; ninguna ruta lo consume aún) | ✅ es un `<p>`, no un encabezado → no rompe la jerarquía · sin `aria-hidden` · Server Component, no amplía la lista de §10.3 · las mayúsculas las hace `uppercase` en CSS, no el string, así que el lector recibe «Bloque C · Ciencias Aplicadas» y no lo deletrea · devuelve `null` si el id de bloque no existe |
| Consola | ✅ sin errores ni advertencias — confirma que omitir `manifest:` hasta el Paso 18.1 (ADR-009) evita el 404 |
| axe-core 4.x (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, `best-practice`) | ✅ **0 violaciones, 0 incompletas** en los dos temas — remedido el 2026-07-30 con los cuatro arreglos puestos, en `/` **y** en el 404: 40 reglas pasadas por corrida, 4 corridas |

**El verde de axe no es una aprobación, y esta ronda lo demuestra dos veces.** axe
dio 0 violaciones **antes y después** de los arreglos: no vio ninguno de los seis
hallazgos originales, y tampoco ve los dos que nacieron de los arreglos. Lo que
axe no ve: el recorte al 200 % de zoom, el idioma de una etiqueta ARIA, si el
salto de contenido mueve el foco de verdad, el contraste de un contorno contra la
banda que tiene debajo, que una clase de Tailwind pierda la cascada (A-07) y que
un objetivo táctil se gane rompiendo el interlineado del texto legal (A-08).

---

## Herramientas de esta auditoría

- Contraste: script propio (`oklch` → sRGB → WCAG 2.1) parseando `globals.css`
  directamente, no DISENO.md. 80 pares, los dos temas, incluidos los estados con
  alfa que produce el DOM (`bg-accent/60`, `ring/50`).
- Navegador: Playwright + Chromium headless en venv aislado del scratchpad
  (**cero dependencias nuevas en el proyecto**). 375 px y 1280 px, `color-scheme`
  claro y oscuro, `reduced-motion`, viewport reducido para simular zoom.
- Cascada CSS: CDP `CSS.getMatchedStylesForNode` — la única forma de zanjar la
  puja entre `@layer utilities` y `.outline-none`.
- Árbol de accesibilidad: CDP `Accessibility.getFullAXTree` / `getPartialAXTree`.
- axe-core 4.x inyectado desde el scratchpad.


---

## A-07 y A-08 · arreglados el 2026-07-30, tras la reverificación

Los dos eran **residuo de los arreglos de A-03 y A-05**, no defectos del implementador.

### A-07 · `focus-visible:outline-none` en el `<main>` era código muerto
**Severidad:** Menor · **Estado:** arreglado 2026-07-30

Se añadió junto al `tabIndex={-1}` de A-03 para evitar que el salto pintara un contorno alrededor de la columna. **No hacía nada:** esa clase y la regla de `globals.css` están en la misma capa `utilities` con la misma especificidad (0,2,0), y la de `globals.css` va después, así que gana. Verificado con `getMatchedStylesForNode`.

**Arreglo:** se borra la clase. El `<main>` sí pinta `2px solid --ring` al recibir el foco del salto, y eso **es deseable** — 2.4.7 pide que el foco se vea — además de transitorio. Se documenta en el propio componente para que nadie lo intente suprimir otra vez. Dejar código que afirma hacer algo que no hace es peor que el contorno.

### A-08 · el `inline-block` de A-05 partía el párrafo de atribución
**Severidad:** Menor · **Estado:** arreglado 2026-07-30

`inline-block py-2` sí llevó el enlace de la licencia de 108×15 a 108×44 px, pero infló la caja de línea del párrafo legal: **97,5 → 122 px**, con una línea que pasaba de 15 a 44 px. El texto de atribución se leía en tres trozos y partía «Idóneo / 2210». Es el párrafo que ADR-001 vuelve requisito de licencia, así que su legibilidad no es negociable.

**Arreglo, medido por el auditor entre cuatro variantes:** conservar `display: inline` y usar **`py-3.5`**. El objetivo queda en **108 × 43 px** y el párrafo vuelve **exacto a 97,5 px**, porque el padding vertical de una caja `inline` agranda el área de toque sin alterar la caja de línea.

**Sobre los 43 px:** superan de sobra el 24×24 de 2.5.8 AA, y los destinos en línea están exentos de ese criterio. El piso de 44 px de `DISENO.md` §3 es **norma interna más estricta que la norma**, y aquí queda 1 px corto a cambio de que el texto legal se lea de un tirón. Trade-off consciente.

---
---

# Paso 7 — Renderizado MDX · auditoría del 2026-07-30

Rama `paso-7-mdx`. Rutas nuevas: **`/modulos/[slug]`** (encabezado + teoría MDX +
conceptos + erratas del módulo) y **`/erratas`** (14 fichas en 3 grupos).
Componentes nuevos: `renderizador` · `componentes` · `dato` · `formula` ·
`tabla-clave` · `ojo` · `alerta-contradiccion`, y la clase `.prose-idoneo`.

**Cómo se auditó el MDX cuando no hay ningún MDX.** Los 29 módulos están en
preparación y muestran el estado vacío, que es lo correcto y **no es hallazgo**.
Para auditar el pipeline real se montó un `content/teoria/c5-umbrales-zonas.mdx`
temporal con **los cinco componentes**, **tres `<Ojo>`**, **una alerta de cada uno
de los tres tipos de ADR-012** (`E-09` errata · `X-02` contradicción · `X-03`
aclaración), **dos tablas dentro de `<TablaClave>` y una suelta**, `<Dato>` con y
sin nota, dos `<Formula>`, listas ordenadas y sin ordenar, `code`, `em`, `strong`
y un enlace en prosa. **Borrado al terminar**: `content/teoria/` vuelve a tener
solo su `.gitkeep`, verificado con `git status`.

## Método y su techo

| Herramienta | Qué cubrió |
|---|---|
| axe-core 4.x (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`) | 6 corridas: 3 rutas × 2 temas. **49 / 44 / 42 reglas pasadas** |
| Contraste | Script propio sobre el **DOM ya renderizado**, no sobre el CSS leído a mano: `getComputedStyle` → canvas de 1×1 con lectura de píxel (obligatorio: Chromium devuelve `oklch()` sin resolver y un parser de `rgb()` revienta) → composición alfa de toda la cadena de ancestros → WCAG 2.1. **126 pares medidos** |
| Teclado | Barrido de 23 `Tab` con **espera de 460 ms por parada** — por encima del umbral de ~420 ms que da el falso 3 px a alfa 0,5 del `transition-all`, tal como quedó anotado en el Paso 5 |
| Árbol de accesibilidad | CDP `Accessibility.getFullAXTree` |
| Anchos | 1440 · 1280 · 1024 · 834 · 768 · 640 · 414 · **375** · **320** (referencia de 1.4.10 para el 400 %) · **187** (375 al 200 %) |
| Longitud de línea | Rectángulos reales de `Range.getClientRects()` + ancho medio de carácter medido con `canvas.measureText` sobre el texto real, no estimado |

**Lo que axe no vio, otra vez.** De los ocho hallazgos, axe encontró **uno**
(A-09). No vio la tabla que se corta a mitad de un dato, ni el contenedor
enfocable sin nombre, ni los 88 caracteres por línea, ni los 11 px en versalitas.

## Confirmación de `DISENO.md` §6 — **lo confirmo, no lo refuto**

Se pidió verificar los 16 pares de §6.6 contra el CSS ya escrito. **Medidos en
navegador sobre el DOM real, coinciden dentro de ±0,10.** 0 fallos.

| Par | §6.6 dice | Yo mido | Umbral |
|---|---|---|---|
| Rótulo + id (`foreground`) · claro · `background` · destructive | 14.68 | **14.60** | 4.5 ✅ |
| Rótulo + id · claro · `background` · aviso | 15.03 | **14.91** | 4.5 ✅ |
| Rótulo + id · oscuro · `background` · destructive | 13.79 | **13.80** | 4.5 ✅ |
| **`<dt>` · claro · `background` · destructive — el peor caso de §6.6** | 4.71 | **4.71** | 4.5 ✅ |
| `<dt>` · claro · `background` · aviso | 4.82 | **4.80** | 4.5 ✅ |
| `<dt>` · oscuro · `background` · destructive | 5.64 | **5.61** | 4.5 ✅ |
| Enlace (`primary`) · claro · destructive | 5.48 | **5.46** | 4.5 ✅ |
| Enlace · claro · aviso | 5.61 | **5.57** | 4.5 ✅ |
| **Icono `aviso` · claro — el peor caso de toda la sección** | 4.09 | **4.05** | 3.0 ✅ |
| Icono `destructive` · claro | 4.44 | **4.43** | 3.0 ✅ |
| Icono `destructive` · oscuro | 5.09 | **5.10** | 3.0 ✅ |
| Icono `aviso` · oscuro | 7.96 | **7.96** | 3.0 ✅ |

**La decisión de §6.3 se sostiene con mi número.** Si el rótulo fuera
`text-aviso` sobre `bg-aviso/10` estaría en **4.05:1** medido (§6.3 dijo 4.09) y
**fallaría** los 4.5 de texto normal. En `foreground` mide **14.91**. Poner el
color en el icono y el marco, y no en el rótulo, es correcto.

**El `<dt>` a 4.71 no tiene margen y hay que dejarlo escrito**: 0,21 por encima
del mínimo. §6.6 ya fija que el fondo no sube del 10 %; añado que **`--aviso` y
`--destructive` tampoco pueden bajar de L**, porque el peor caso de la sección se
apoya en D-1.

Nada de esto lo cambio yo: si algo se toca, lo registra el `ui-designer` en
`DISENO.md`.

## Lo verificado y correcto — esto es lo que hay que conservar

| Punto | Resultado medido |
|---|---|
| **Jerarquía de encabezados** | ✅ **sin saltos y con un solo `h1` en las dos rutas.** `/modulos/[slug]`: h1 → h2 (objetivos) → h2/h3 de la teoría → h2 (conceptos) → h2 (erratas del módulo). `/erratas`: h1 → h2 (los 3 grupos) → h3 (las 14 fichas). El MDX empezando en `##` es la decisión correcta y `RotuloBloque` como `<p>` la sostiene |
| **`h3` a 18 px** | ✅ exactamente `1.125rem`: Barlow Condensed toca su suelo de §2.3 sin bajarlo |
| **Tamaño del cuerpo de teoría** | ✅ **17 px / 1.65** (28,05 px de interlineado). Es el único sitio de la app que sube desde los 15 px, y es el sitio correcto |
| **Nada de lectura por debajo de 13 px** | ✅ en el flujo de lectura: teoría 17 px · tablas 15 px · `code` 15,3 px · `<dd>` 15 px · nota de `<Formula>` 13 px · fichas de concepto 13 px · `ubicacion` de la ficha 13 px. Las excepciones son etiquetas, no lectura, y van en **A-16** |
| **Sin scroll horizontal** | ✅ `scrollWidth == clientWidth` a **375**, **320** y **187 px** en las dos rutas. El envoltorio `.tabla-desliz` cumple su razón de ser: una tabla de 5 columnas mide **518 px** de contenido en un hueco de **341 px** y **no arrastra la página** |
| **Foco visible** | ✅ los **23** enfocables de `/modulos/[slug]` a 375 px salen `2px solid` a `--ring` **completo**, `outline-offset: 2px` (−2 px en la barra inferior, ya autorizado). Medido a 460 ms por parada |
| **Orden de tabulación** | ✅ visual, sin trampas: salto → marca → tema → prerrequisitos → tabla → alertas → enlaces de prosa → erratas del módulo → pie → barra inferior |
| **El contenedor de tabla no es trampa de foco** | ✅ `Tab` sale hacia «Ver todas las erratas», `Shift+Tab` vuelve al enlace anterior, y las flechas **sí** desplazan: `scrollLeft` = **80** tras dos `ArrowRight` |
| **Anclas de `/erratas`** | ✅ `/erratas#X-03` en carga directa **y** el salto desde la teoría a `#E-09`: `scroll-margin-top` **76 px**, la ficha queda a 76 px del borde superior y **el encabezado pegajoso no la tapa**. El `--alto-encabezado` compartido hace su trabajo |
| **El foco no se pierde al saltar al ancla** | ✅ el navegador coloca el *punto de partida de la tabulación* en la ficha: tras el salto a `#X-03`, el primer `Tab` cae en un enlace **dentro de X-03**, en pantalla (y=449), no al principio del documento |
| **Ids únicos con muchos recuadros** | ✅ **0 ids duplicados** con 3 alertas + 3 `<Ojo>` en el mismo módulo. `alerta-${errata.id}` es una clave única por construcción y el `<Ojo>` no genera id ninguno. La preocupación de §6.7 queda resuelta |
| **Nombre accesible de las alertas** | ✅ las tres salen en el árbol como `complementary` con nombre propio: «Errata de la cartilla · E-09», «Las cartillas se contradicen · X-02», «Aclaración: no es un error · X-03» |
| **Semántica de tabla** | ✅ el árbol expone `table` → `rowgroup` → `row` → `columnheader` / `cell`. Los `<th>` de GFM llegan como `columnheader` (ver A-12 para lo que falta) |
| **El color nunca es el único portador** | ✅ el tipo de alerta va en el **rótulo textual**, el icono es `aria-hidden` y el marco solo acompaña. En la lista de erratas del módulo el rótulo viaja en `sr-only` |
| **`prefers-reduced-motion`** | ✅ **0 elementos** con transición o animación por encima de 2 ms en toda la ruta de teoría |
| **`lang` e idioma** | ✅ `lang="es-CO"`, títulos en español, **cero etiquetas ARIA en inglés** en los siete componentes nuevos |
| **Objetivos táctiles** | ✅ ningún objetivo de bloque por debajo de 24 px. Los únicos menores son enlaces **en línea** dentro de prosa (16–20 px de alto), **exentos** de 2.5.8 por la excepción de destinos en línea. La `min-height: 44px` de `@layer base` no los deforma porque no aplica a cajas `inline`: la válvula funciona como se diseñó |
| **`RotuloBloque` en runtime** | ✅ los 4 bloques × 2 temas. Claro: A 5.15 · B 5.74 · **C 4.84** · D 5.04. Oscuro: A 8.70 · **B 7.27** · C 8.02 · D 7.57. Cierra el «reauditar en el Paso 7» del Paso 5 |
| **Insignia de bloque (`size-8`)** | ✅ `text-bloque-contraste` sobre el color pleno: claro **4.85–5.75**, oscuro **7.43–8.89** |
| **axe-core** | **1 violación** (A-09) y 1 «incompleta» heredada del pie, la misma del Paso 5. Ninguna de las dos rutas añade violaciones de contraste |

---

## Hallazgos del Paso 7

### A-09 · Tres landmarks «complementario» idénticos: los `<Ojo>` de un mismo módulo
**Criterio:** 1.3.1 Info and Relationships (A) en su lectura de landmarks · axe `landmark-unique` · **Severidad: Menor**
**Dónde:** `src/components/mdx/ojo.tsx:24-26`
**Es la única violación de axe de todo el paso, y sale en los dos temas.**

**Problema.** El `<Ojo>` resuelve bien el problema que planteó §6.7 —ya no hay
`<aside>` anónimos— pero lo resuelve con un nombre **fijo**, así que un módulo con
tres recuadros produce **tres landmarks `complementary` llamados exactamente
«Ojo con esto»**. Medido en el árbol de accesibilidad del MDX de prueba:

```
complementary  "Ojo con esto"
complementary  "Ojo con esto"
complementary  "Errata de la cartilla · E-09"
complementary  "Ojo con esto"
complementary  "Las cartillas se contradicen · X-02"
complementary  "Aclaración: no es un error · X-03"
```

A quién afecta y cómo: quien navega por landmarks —la forma rápida de moverse por
una página larga con lector— abre la lista y encuentra **seis regiones
complementarias** en un módulo de teoría, tres de ellas indistinguibles. La lista
de landmarks deja de servir para lo que sirve. El módulo C5 real trae exactamente
esta forma: tres `<Ojo>` y dos alertas.

**Diagnóstico de fondo: ninguno de los dos recuadros es contenido complementario.**
Un `<Ojo>` y una `<AlertaContradiccion>` son **apartes dentro del hilo de lectura**
—se leen en su sitio, no son una barra lateral—, y `<aside>` los convierte en
landmark solo por ser `<aside>`. El rol correcto para un aparte dentro del flujo
es `note`, que **no es landmark** y conserva el nombre.

**Arreglo** (dos líneas, sin tocar el aspecto ni la estructura de §6.1):

```tsx
// ojo.tsx — el título visible ya dice qué es; el landmark sobra
<aside role="note" aria-label="Ojo con esto" className="my-5 flex gap-3 …">

// alerta-contradiccion.tsx — mismo criterio, conservando el aria-labelledby
<aside role="note" aria-labelledby={idRotulo} className={cn('my-6 rounded-lg border p-4 …')}>
```

Con eso `/modulos/[slug]` baja de **6 landmarks complementarios a 0** y los seis
recuadros siguen anunciándose con su nombre al entrar en ellos. La alternativa
—dejar los landmarks y numerar los `<Ojo>` («Ojo con esto 1 de 3»)— se descarta:
inventa un número que no está en pantalla y no arregla que el recuadro no sea
complementario.

**Estado: ~~abierto~~ → ARREGLADO 2026-07-30.** Medido: **6 `complementary` → 0**
a 375 px · 6 `role=note` con nombre · axe pasa de **1 violación a 0** en las
cuatro corridas. Ver la reverificación al final del archivo.

---

### A-10 · El contenedor desplazable de tabla es enfocable, pero no tiene nombre ni rol
**Criterio:** 4.1.2 Name, Role, Value (A) · **Severidad: Moderado**
**Dónde:** `src/components/mdx/componentes.tsx:32-36`

**Problema.** El `tabIndex={0}` es correcto y hay que conservarlo — sin él, en
Chromium y en Firefox la mitad derecha de la tabla de zonas queda fuera del
alcance de quien no usa ratón, que es literalmente 2.1.1. **Lo que falta es que el
sitio donde aterriza el foco diga algo.** Medido:

```
aria-label       → null
role             → null
aria-labelledby  → null
title            → null
árbol de accesibilidad → «generic», enfocable, sin nombre
```

El foco para en las posiciones **6, 10 y 11** del barrido de `Tab`. El usuario
vidente ve el contorno de 2 px y entiende; el usuario de lector oye «en blanco» o
directamente el primer texto de la tabla, sin que nada le diga que **ha entrado en
una región desplazable** ni que **las flechas la mueven** (las flechas sí
funcionan: `scrollLeft` 80 tras dos `ArrowRight`).

A quién afecta y cómo: quien usa lector de pantalla con teclado. No pierde el
contenido —la tabla se lee entera en modo exploración—, pero pierde la operación:
no sabe que ahí hay algo que manejar.

**Arreglo** (una línea, en el mismo mapeo):

```tsx
table: (props) => (
  <div
    className="tabla-desliz"
    tabIndex={0}
    role="group"
    aria-label="Tabla — desplázala en horizontal con las flechas"
  >
    <table {...props} />
  </div>
),
```

**`role="group"` y no `role="region"` a propósito.** El patrón habitual usa
`region`, pero `region` **es landmark** y volvería a meter tres entradas en la
lista que A-09 acaba de limpiar. `group` expone rol y nombre sin ensuciar los
landmarks.

**Estado: ~~abierto~~ → ARREGLADO 2026-07-30.** Medido: los cuatro atributos
pasan de `null` a `role="group"` + «Tabla, desplazable en horizontal», y el árbol
sale `group` en vez de `generic`. **0 landmarks añadidos**, confirmado contra
`/erratas`, que no tiene tablas y declara los mismos 4 `region`.

---

### A-11 · La tabla se corta sin ninguna señal de que sigue a la derecha
**Criterio:** ninguno falla — **lo digo claro**. 1.4.10 Reflow (AA) **exime
expresamente a las tablas de datos** del requisito de una sola dirección de
desplazamiento, y el contenido está disponible. Es comprensión, no conformidad ·
**Severidad: Moderado**
**Dónde:** `src/app/globals.css` (`.prose-idoneo .tabla-desliz`) + `componentes.tsx:33`

**Problema, con la cifra.** La tabla de zonas a 375 px:

| | Medido |
|---|---|
| Ancho del contenido | **518 px** |
| Hueco visible | **341 px** |
| **Oculto a la derecha** | **177 px — el 34 % de la tabla** |
| Barra de desplazamiento visible | **0 px** (superpuesta: no existe hasta que se desplaza) |
| `::before` / `::after` | `content: none` |
| `box-shadow` / `mask-image` / `background-image` | `none` / `none` / `none` |

**No hay ni una señal.** La columna «Sustrato dominante» **entera** es invisible, y
la anterior queda cortada a mitad de valor: en pantalla se lee **«95 % / 5»**
cuando el dato es «95 % / 5 %», y **«99 % / 1»** cuando es «99 % / 1 %».

A quién afecta y cómo: al usuario objetivo entero, no a una minoría. Es la tabla
que la propia teoría llama «la tabla que hay que saberse», el dato es de los que
el examen pregunta con número exacto, y quien la lee de noche en un teléfono se
lleva un porcentaje truncado creyendo que es el valor. El corte a mitad de glifo
insinúa que hay más, pero la quinta columna no deja ni esa pista.

**Arreglo** — degradado de borde con `background-attachment: local`, la técnica
clásica: se pinta sola, se apaga sola al llegar al final, **no necesita JS ni un
Client Component nuevo**, y es estática, así que `prefers-reduced-motion` no la
toca. En `globals.css`, junto a la regla que ya existe:

```css
.prose-idoneo .tabla-desliz {
  margin-block: 1.5rem;
  overflow-x: auto;
  /* dos capas fijas (las sombras) + dos que viajan con el contenido (las tapas
     blancas): cuando la tapa está pegada al borde cubre la sombra, y al
     desplazar se despega y la sombra aparece. */
  background:
    linear-gradient(to right, var(--card) 30%, transparent) left center / 2.5rem 100% no-repeat local,
    linear-gradient(to left,  var(--card) 30%, transparent) right center / 2.5rem 100% no-repeat local,
    radial-gradient(farthest-side at 0 50%, rgb(0 0 0 / 0.16), transparent) left center / 0.75rem 100% no-repeat scroll,
    radial-gradient(farthest-side at 100% 50%, rgb(0 0 0 / 0.16), transparent) right center / 0.75rem 100% no-repeat scroll;
}
```

Complemento barato y recomendado, porque una sombra no es texto: una línea de
ayuda bajo la tabla que solo aparece cuando hace falta no se puede resolver sin
JS, así que va **siempre** dentro de `<TablaClave>`, en la fila de auxiliar de 13
px: *«Se desplaza en horizontal.»* Con eso el aviso también le llega al lector de
pantalla, y encaja con el `aria-label` de A-10.

**Estado: ~~abierto~~ → ARREGLADO A MEDIAS 2026-07-30.** En claro funciona:
**0 señal → 1.43:1 (ΔL 0.31)**, y enciende y apaga en el lado correcto en los
tres estados de desplazamiento. **En oscuro dentro de `<TablaClave>` queda
invertido y en 1.02:1** — sigue en **A-17**. Y lo que motivó el hallazgo, el dato
truncado, **no cambia**: a 375 px se siguen viendo `95 % / ` y se siguen cortando
`5 %`; el degradado se pinta detrás del texto y solo avisa, no restituye.

---

### A-12 · Los `<th>` no llevan `scope` y la primera columna no es encabezado de fila
**Criterio:** 1.3.1 Info and Relationships (A) · **Severidad: Menor**
**Dónde:** `src/components/mdx/componentes.tsx` (falta el mapeo de `th`)

**Problema.** GFM genera `<th>` dentro de `<thead>` y el árbol ya los expone como
`columnheader`, así que **la parte de columnas está cubierta** y axe pasa. Faltan
dos cosas:

1. **`scope="col"` explícito.** Hoy se depende de que cada lector infiera el
   encabezado por posición. Es una línea y quita la dependencia.
2. **No hay ningún `rowheader`.** La primera celda de cada fila —«R2 · VT2»— sale
   como `cell` con un `<strong>` dentro. En una tabla de 5 columnas leída celda a
   celda, «95 % / 5 %» llega anunciado con su columna («Aeróbico / Anaeróbico»)
   pero **sin decir de qué zona es**. Es justo la tabla donde confundir R1 con R2
   cuesta la pregunta.

**Arreglo.** El primer punto, inmediato:

```tsx
th: (props) => <th scope="col" {...props} />,
```

El segundo es una **limitación real de GFM**: la sintaxis de tabla de markdown no
sabe expresar `<th scope="row">`. Dos salidas, y prefiero la primera:

- **Aceptarlo y documentarlo** en `COMPONENTES.md`, junto a la nota que ya existe
  sobre `.tabla-desliz`, para que nadie lo redescubra en el Paso 15.
- Promover la primera celda de cada `<tr>` del `<tbody>` a `<th scope="row">` con
  un mapeo de `tr`. Funciona, pero convierte una regla tipográfica en lógica de
  contenido y se rompe en cuanto una tabla no tenga la primera columna como clave
  (la de fórmulas de FCmáx del ejemplo, sin ir más lejos, sí la tiene; otras no).

**Estado: ~~abierto~~ → ARREGLADO 2026-07-30.** Medido: **0 de 8 → 8 de 8**
`<th scope="col">`, sin ningún otro valor. El `rowheader` sigue en **0**, aceptado
y documentado como límite de GFM.

---

### A-13 · Tres enlaces «Ver todas las erratas» con el mismo nombre y tres destinos distintos
**Criterio:** 2.4.4 Link Purpose (In Context) (A) — **se cumple**; 2.4.9 (AAA) no · **Severidad: Menor**
**Dónde:** `src/components/mdx/alerta-contradiccion.tsx:113-118`

**Problema.** Un módulo con tres alertas produce tres enlaces con **nombre
accesible idéntico** que van a `#E-09`, `#X-02` y `#X-03`. Verificado en el
barrido: paradas **7, 8 y 9**, las tres con el mismo texto. En contexto se
distinguen —cada una vive dentro de un `<aside>` con su nombre— así que **no falla
AA**. Falla en la herramienta que más se usa con lector: la lista de enlaces, donde
el contexto se pierde y quedan tres entradas iguales. Y hay un desajuste menor
entre el nombre («**todas** las erratas») y lo que hace (llevar a **una** ficha).

**Arreglo** (una línea, sin cambio visual):

```tsx
<Link href={`/erratas#${errata.id}`} className="mt-3 inline-flex items-center …">
  Ver todas las erratas
  <span className="sr-only"> — desde la ficha {errata.id}</span>
</Link>
```

**Estado: ~~abierto~~ → ARREGLADO 2026-07-30.** Se implementó con el sufijo
« · ficha X-03». Medido: **3 enlaces con 1 solo nombre → 3 enlaces con 3 nombres
distintos**. El texto visible no cambia.

---

### A-14 · Los tres contenedores de tabla siguen siendo enfocables cuando no desbordan
**Criterio:** 2.4.3 Focus Order (A) — no falla, añade ruido · **Severidad: Menor**
**Dónde:** `src/components/mdx/componentes.tsx:33`

**Medido.** A 1280 px **ninguna** de las tres tablas desborda (`scrollWidth ==
clientWidth` en las tres: 718, 718, 720) y las tres conservan `tabindex="0"`: tres
paradas de tabulación sin nada que operar. A 375 px solo desborda la primera, así
que las otras dos también son paradas muertas.

**No propongo arreglarlo, y esta es la razón.** Saber si una tabla desborda exige
medirla en el navegador, y eso convertiría un Server Component en cliente para
ganar dos paradas de tabulación — un coste desproporcionado, y además la lista de
§10.3 no se amplía por esto. La alternativa contraria (quitar el `tabIndex`)
reintroduce un fallo de 2.1.1 real, que es mucho peor.

Dato que conviene dejar escrito para el futuro: **Chromium ≥ 127 hace enfocables
los contenedores desplazables por su cuenta**, así que el `tabIndex` explícito
seguirá haciendo falta solo mientras Firefox y Safari no lo hagan. Cuando lo
hagan, esta línea se borra y el hallazgo se cierra solo.

**Estado: aceptado 2026-07-30.** Con A-10 puesto, cada parada al menos se anuncia.

---

### A-15 · 88,5 caracteres por línea desde `md` — el número que pidió el usuario
**Criterio:** 1.4.8 Visual Presentation exige ≤ 80 caracteres, y es **AAA**. **No
falla AA** · **Severidad: Menor** · **decide el `ui-designer`**
**Dónde:** no nace en el Paso 7. Sale de `max-w-3xl` en `shell.tsx` (Paso 5) con el
cuerpo de teoría a 17 px. El Paso 7 solo es la primera pantalla que lo enseña.

**Medido, no estimado** — ancho medio de carácter obtenido con `canvas.measureText`
sobre el texto real de la teoría (**8,13 px** a 17 px de cuerpo) y contrastado con
los rectángulos de línea reales:

| Viewport | Caja del párrafo | **Caracteres por línea** | Línea más larga |
|---|---|---|---|
| **375 px** | 343 px | **42,2** | 41,1 |
| 414 px | 382 px | 47,0 | 45,2 |
| 640 px | 592 px | 72,8 | 69,2 |
| **768 px y por encima** | **720 px** | **88,5** | **87,7** |

**Confirmo al `frontend-developer`: 88–89, y confirmo también su diagnóstico de
origen.** A 375 px, que es donde de verdad se lee esta app, **42 caracteres es
correcto** y no hay nada que tocar.

**¿Lo compensa el interlineado de 1.65?** Parcialmente, y hay que ser preciso sobre
qué compensa. Un interlineado generoso reduce el error de *retorno de línea* —
saltarse una línea o releer la misma al volver al margen izquierdo. **No reduce la
distancia de barrido**, que es lo que cansa en una línea de 88 caracteres. Con
presbicia y a media noche, el problema dominante es el barrido. Así que 1.65 ayuda
y hay que conservarlo, pero no es el arreglo.

**Mi criterio, con números, para que se lo lleves al `ui-designer`:** es un
hallazgo real y es **Menor**. Menor y no Moderado por tres cosas: no falla AA, el
contexto de uso declarado del producto es el móvil de una mano —donde el valor es
42—, y el escritorio es secundario. Pero es la superficie de lectura larga de toda
la app, y el arreglo cuesta una línea de CSS.

**Trampa medida que hay que decirle antes de que la pise.** `max-w-[65ch]` **no
arregla nada aquí**: el `body` lleva `font-variant-numeric: tabular-nums`, que
ensancha el glifo «0» de Inter hasta **11 px** a 17 px de cuerpo. Medido:
`1ch = 11 px` → **`65ch` = 715 px ≈ 87,9 caracteres**, prácticamente los 720 px de
ahora. La unidad `ch` miente en este proyecto. Hay que capar en `px` o en `rem`:

| Cap propuesto | Caracteres por línea |
|---|---|
| 720 px (hoy) | 88,5 |
| **640 px** (`40rem`) | **78,7** |
| **608 px** (`38rem`) | **74,8** |
| 600 px | 73,8 |

**Arreglo propuesto** — capar **solo los bloques de texto**, dejando que tablas,
`<Formula>` y los recuadros sigan usando los 720 px, que es donde el ancho sí
ayuda:

```css
.prose-idoneo :is(p, ul, ol, h2, h3) {
  max-width: 38rem;   /* 608 px ≈ 74,8 caracteres por línea */
}
```

A 375 px no cambia absolutamente nada: la caja ya mide 343 px.

**Estado: ~~abierto~~ → RESUELTO 2026-07-30** por `DISENO.md` §3.1 (medida de
lectura de 38rem). Medido tras el cambio: **88,5 → 74,4 cpl** en la teoría de
17 px. Matiz con cifra: las superficies de 15 px caen en **79,2–79,6 cpl**, bajo
el 80 pero con 0,4–0,8 caracteres de margen, no los cinco que estima §3.1.

---

### A-16 · 11 px en versalitas para etiquetas que sí son contenido
**Criterio:** ninguno. WCAG no fija tamaño mínimo y 1.4.4 se cumple (200 % y 400 %
sin desbordes) · **Severidad: Menor** · **decide el `ui-designer`**
**Dónde:** la fila «Eyebrow / etiqueta» de `DISENO.md` §2.3, aplicada en
`alerta-contradiccion.tsx` (`CLASES_DT_ERRATA`), `tabla-clave.tsx`, `dato.tsx` y
`rotulo-bloque.tsx`

**Problema.** Los `<dt>` de las fichas —«DICE LA CARTILLA», «LO CORRECTO», «CÓMO
RESPONDER»— van a **11 px, en mayúsculas, con tracking +0,08em**. Son **42
instancias en `/erratas`** y 3 por cada alerta de la teoría. No son decoración: son
las claves de una lista de definición, la estructura que hace legible la ficha.

Se suman el rótulo de `<TablaClave>`, la etiqueta de `<Dato>` y `RotuloBloque`, los
tres a 11 px.

Contraste, medido: **4.71–4.84 en claro**, es decir, pasa AA **sin margen** (A-15 y
esto se tocan: el `<dt>` a 4.71 es también el peor par de §6.6). Combinar el
tamaño más pequeño de la escala, el contraste más justo y las mayúsculas —que
cuestan velocidad de lectura porque borran el perfil de la palabra— concentra en la
misma pieza los tres factores en su peor valor.

A quién afecta y cómo: al lector de 55 años con presbicia, de noche, sin gafas de
cerca a mano. No le impide nada —puede subir el zoom, y a 200 % y 400 % la página
aguanta— pero es fricción en cada una de las 14 fichas.

**No lo cambio yo: es una decisión de `DISENO.md` §2.3.** Lo que le llevo al
`ui-designer`, por orden de coste:

1. **Quitar el `uppercase` de los `<dt>`** y dejarlos en 11 px con el resto igual.
   Recupera el perfil de palabra sin tocar la escala ni el ritmo.
2. **Subir la fila «Eyebrow» a 12 px** solo donde la etiqueta es contenido (los
   `<dt>`), dejando 11 px donde es antetítulo (`RotuloBloque`, `<TablaClave>`).
3. Dejarlo como está y anotarlo como coste aceptado, con la cifra a la vista.

**Estado: ~~abierto~~ → RESUELTO 2026-07-30** por `DISENO.md` §2.5, con la
opción 2 (subir a 12 px solo donde la etiqueta es contenido) y conservando las
versalitas. Contraste remedido: **4.71:1 claro · 5.61:1 oscuro**, sin cambio,
porque el umbral de «texto grande» empieza en 24 px. Sigue siendo el par con
menos margen del paso: **0,21**.

---

## Observación heredada, no es hallazgo de este paso

> **RESUELTO 2026-07-30:** el pie subió a **13 px** (`DISENO.md` §2.5) y la
> excepción desapareció. Párrafo **97,5 → 105,6 px**, cinco líneas exactas en los
> dos casos: **A-08 no se repitió**. Enlace **108×43 → 113×44**, que ahora cumple
> el piso interno de 44 px sin trade-off. Contraste sin cambio, 5.49 / 6.18.

**El pie de atribución va a 12 px** (`text-xs` en `pie.tsx:10`), por debajo de los
13 px de la fila «Auxiliar / metadato» de §2.3 y por debajo del listón de «nada de
lectura baja de 13 px». Contraste correcto (**5.49** claro · **6.18** oscuro) y
alcanzable con teclado. Es texto **de lectura** —la atribución que ADR-001 vuelve
requisito de licencia— y es del Paso 5, no del Paso 7. Se anota aquí para que no se
pierda; si el `ui-designer` toca la escala por A-16, este es el mismo movimiento.

## Contraste de tokens verificado en el Paso 7

Todos medidos sobre el DOM renderizado, en los dos temas. **0 fallos.**

| Pieza | Sobre | Claro | Oscuro | AA |
|---|---|---|---|---|
| Cuerpo de teoría (`foreground`, 17 px) | `background` | 17.03 | 15.22 | ✅ 4.5 |
| Enlace en prosa (`primary`, 15 px, subrayado) | `background` | 5.46 | 6.47 | ✅ 4.5 |
| `code` (`foreground` sobre `muted`) | `muted` | 15.30 | 12.39 | ✅ 4.5 |
| `th` y `td` de tabla (15 px) | `background` | 17.03 | 15.22 | ✅ 4.5 |
| Título de `<TablaClave>` (11 px) | `background` | 5.49 | 6.18 | ✅ 4.5 |
| `<Dato>` etiqueta (11 px) | `primary/5` | 5.10 | 5.83 | ✅ 4.5 |
| `<Dato>` valor (mono 14 px) | `primary/5` | 15.82 | 14.34 | ✅ 4.5 |
| `<Formula>` cuerpo (mono 14 px) | `muted/50` | 16.09 | 13.83 | ✅ 4.5 |
| `<Formula>` nota (13 px) | `muted/50` | 5.19 | 5.62 | ✅ 4.5 |
| `<Ojo>` título y cuerpo (15 px) | `aviso/10` | 14.91 | 13.00 | ✅ 4.5 |
| Alerta `destructive` · rótulo, tema, `<dd>` | `destructive/10` | 14.60 | 13.80 | ✅ 4.5 |
| Alerta `destructive` · `<dt>` (11 px) — **peor par del paso** | `destructive/10` | **4.71** | 5.61 | ✅ 4.5 |
| Alerta `destructive` · enlace | `destructive/10` | 5.46 | 6.47 | ✅ 4.5 |
| Alerta `destructive` · icono | `destructive/10` | 4.43 | 5.10 | ✅ 3.0 (gráfico) |
| Alerta `aviso` (X-03) · rótulo, tema, `<dd>` | `aviso/10` | 14.91 | 13.00 | ✅ 4.5 |
| Alerta `aviso` · `<dt>` (11 px) | `aviso/10` | 4.80 | 5.28 | ✅ 4.5 |
| Alerta `aviso` · icono — **peor par de gráfico** | `aviso/10` | **4.05** | 7.96 | ✅ 3.0 (gráfico) |
| Ficha de `/erratas` · `h3` (18 px) | tinte del tipo | 14.60 | 13.80 | ✅ 4.5 |
| Ficha de `/erratas` · `ubicacion` (13 px) | tinte del tipo | 4.71 | 5.61 | ✅ 4.5 |
| `RotuloBloque` A · B · C · D (11 px) | `background` | 5.15 · 5.74 · **4.84** · 5.04 | 8.70 · **7.27** · 8.02 · 7.57 | ✅ 4.5 |
| Insignia de bloque (`bloque-contraste` sobre color pleno) | `bloque-{a..d}` | 4.85 – 5.75 | 7.43 – 8.89 | ✅ 4.5 |
| Ficha de concepto clave (13 px) | `card` | 17.49 | 13.92 | ✅ 4.5 |

Marcos `border-{token}/60` y `--border`: **exentos por el criterio ya cerrado en
§1.3 y reafirmado en §6.6** — delimitan, no identifican un control. No se remiden.

---
---

# Paso 7 — **Reverificación de los nueve cambios** · 2026-07-30

Rama `paso-7-mdx`. Se remiden los cinco arreglos de accesibilidad (A-09 a A-13)
y los cuatro cambios de diseño de `DISENO.md` §2.5 y §3.1. **Nada se modificó:**
árbol como se encontró, sin commit.

**Método.** MDX temporal en `content/teoria/c5-umbrales-zonas.mdx` con los cinco
componentes, tres `<Ojo>`, las tres ramas de alerta (`E-09` · `X-02` · `X-03`),
una tabla de 5 columnas dentro de `<TablaClave>` y otra suelta de 3.
**Borrado al terminar**, verificado con `git status`. Servidor en el **3117**
(el 3000 está ocupado por un proceso ajeno), cerrado al acabar. Cero
dependencias nuevas.

Barrido de teclado con **460 ms por parada**: el `transition-all` tarda ~420 ms
en asentar el contorno, y una lectura instantánea lo da a 3 px con alfa 0,5 —
falso. La única parada que salió así fue el `nextjs-portal` del overlay de
desarrollo, que no es código de la app.

Píxeles del degradado leídos por **mediana vertical de columna**: la fila suelta
se contamina con el arco del `border-radius` del marco y da un falso −0,30 de
luminancia en los dos extremos, en los tres estados de desplazamiento.

## Veredicto

**Ocho de nueve confirmados. A-11 falla en la mitad de los casos**: el arreglo
funciona en claro y está **invertido en oscuro dentro de `<TablaClave>`**, que es
donde vive toda tabla de teoría real.

| Cambio | Antes | Después | Estado |
|---|---|---|---|
| **A-09** `role="note"` | 6 landmarks `complementary` en el módulo, 3 con nombre idéntico · axe: **1 violación** (`landmark-unique`) en los dos temas | **0 `complementary`** a 375 px · 6 `role=note` con nombre · axe: **0 violaciones** en las 4 corridas | ✅ **arreglado** |
| **A-10** `role="group"` + nombre | `role`, `aria-label`, `aria-labelledby`, `title` = **null** · `generic` en el árbol | 2 nodos **`group`** con nombre «Tabla, desplazable en horizontal» · **0 landmarks añadidos** | ✅ **arreglado** |
| **A-11** degradado de borde | 0 señal (`::after`, `box-shadow`, `mask-image` = none) | claro **1.43:1** ✓ · **oscuro dentro de `<TablaClave>` 1.02:1 e invertido** | ⚠️ **A-17, abierto** |
| **A-12** `scope="col"` | 0 de 8 `<th>` con `scope` | **8 de 8** `scope="col"` · 0 `rowheader` (límite de GFM, aceptado) | ✅ **arreglado** |
| **A-13** sufijo `sr-only` | 3 enlaces, **1 solo nombre** accesible | 3 enlaces, **3 nombres distintos** | ✅ **arreglado** |
| **§3.1** medida de lectura 38rem | teoría **88,5 cpl** desde 768 px | teoría **74,4 cpl** · tablas y `<Formula>` intactas a 720 px | ✅ **aplicado** |
| **§2.5** `<dt>` 11 → 12 px | 4.71:1 claro / 5.61:1 oscuro | **4.71:1 / 5.61:1** — sin cambio, como se predijo | ✅ **confirmado** |
| **§2.5** pie 12 → 13 px | párrafo 97,5 px · enlace 108×43 · 5.49 / 6.18 | párrafo **105,6 px** (5 líneas exactas) · enlace **113×44** · **5.49 / 6.18** | ✅ **confirmado, sin A-08** |
| **§3.1** recuadros a medida de lectura | 720 px de caja | **608 px** de caja · texto interior 540 px | ✅ **aplicado** |

---

## A-11 · lo que se pidió medir, punto por punto

### (a) Perceptibilidad a 375 px

Luminancia relativa por columna, mediana vertical, sobre el contenedor real.

| Tema y caso | Fondo de referencia | Pico de la señal | **ΔL** | **Contraste** | ¿Se ve? |
|---|---|---|---|---|---|
| **Claro**, dentro de `<TablaClave>` | L 0.9722 | L 0.6644 | **−0.3078** | **1.43:1** | **sí, con holgura** |
| **Oscuro**, tabla **suelta** (sin marco) | L 0.0054 | L 0.0227 | +0.0173 | **1.31:1** | sí |
| **Oscuro, dentro de `<TablaClave>`** | L 0.0054 | L 0.0046 | **−0.0008** | **1.02:1** | **no. Invisible** |

Ningún valor llega a 3:1, y **no tiene por qué**: es una afordancia decorativa
sobre contenido que sigue disponible, no un componente de interfaz de 1.4.11. La
cifra que importa es la de claro, **1.43:1 con ΔL 0.31**, que es un salto de
luminancia grande y perfectamente visible incluso con sol en la pantalla.

### (b) Encendido y apagado con el desplazamiento

**Claro: correcto en los tres estados.**

| `scrollLeft` | Izquierda | Derecha |
|---|---|---|
| 0 (inicio) | 1.02:1 — plano ✓ | **1.43:1 — señal** ✓ |
| 88 (mitad) | **1.43:1** ✓ | **1.43:1** ✓ |
| 177 (final) | **1.43:1** ✓ | 1.02:1 — plano ✓ |

**Oscuro dentro de `<TablaClave>`: invertido.** Al inicio la señal aparece a la
**izquierda**, donde no hay nada a lo que ir, y el borde derecho —que oculta 177
px— sale plano. Al final, al revés. La afordancia **apunta al lado contrario**,
que es peor que no tener ninguna: al usuario le dice que ya se movió cuando no lo
ha hecho.

### (c) «95 % / 5 %» — **sigue truncado**

Esta era la razón de ser del cambio, y hay que decirlo sin rodeos.

| | Medido a 375 px |
|---|---|
| Texto de la celda | `95 % / 5 %` |
| **Visible sin desplazar** | **`95 % / `** |
| **Cortado** | **`5 %`** |
| Fuera del borde derecho | **45 px** |
| Tras desplazar al final | `95 % / 5 %` — **completa** ✓ |

**El degradado no podía arreglar esto y no lo arregla.** Es un `background-image`
del contenedor: se pinta **detrás** del texto, así que no devuelve los caracteres
que faltan. Lo único que cambia es que ahora hay un aviso de que la tabla sigue —
y en oscuro dentro del marco, ni eso. Un usuario que lea de noche en el teléfono
sigue viendo un porcentaje truncado; la diferencia es si algo le sugiere
desplazarse. En claro, sí. En oscuro, no.

---

## A-17 · El degradado de A-11 queda invertido en oscuro dentro de `<TablaClave>`
**Criterio:** ninguno falla (1.4.10 exime a las tablas de datos, igual que en
A-11) · **Severidad: Moderado**
**Dónde:** `src/app/globals.css:461-467`

**Causa: colisión de especificidad, no de color.**

| Regla | Línea | Especificidad |
|---|---|---|
| `.dark .prose-idoneo .tabla-desliz` | 452 | (0,3,0) |
| `.prose-idoneo .marco-tabla .tabla-desliz` | 461 | (0,3,0) |

Empatan, y **gana la última**. Así que dentro de `<TablaClave>` el tema oscuro
nunca llega: el navegador computa las cuatro capas de la variante clara.
Verificado en `getComputedStyle`, no deducido:

```
oscuro · tabla DENTRO de <TablaClave> → linear-gradient(to right, oklch(0.218 0.016 255) …)  ← --card
oscuro · tabla SUELTA                 → linear-gradient(to right, oklch(0.175 0.014 255) …)  ← --background
```

La tabla suelta funciona (**1.31:1**, lados correctos); la enmarcada no. Y **toda
tabla de teoría va dentro de `<TablaClave>`**: la que falla es la única que
importa.

**Debajo hay un segundo error, y es el que hay que arreglar de verdad.** El
comentario dice «dentro de `<TablaClave>` el fondo lo pone el marco». **El marco
no pone ningún fondo:** `.marco-tabla` es `overflow-hidden rounded-lg border
border-border`, sin `background`. El recorrido de ancestros lo confirma —
`tabla-desliz → marco-tabla → .my-6 → .prose-idoneo → … → body` — y termina en
`--background`. Así que la «tapa» se pinta con `--card` sobre un fondo real de
`--background`:

- **claro**: `oklch(1 0 0)` sobre `oklch(0.991 …)` → ΔL 0.019, **1.02:1**, invisible. Por eso nadie lo vio.
- **oscuro**: `oklch(0.218 …)` sobre `oklch(0.175 …)` → **banda visiblemente más clara**, que es justo el «rectángulo más claro» que el comentario dice estar evitando. Esa banda es la falsa señal de (b).

**Arreglo — una regla menos, no una más.** La tapa debe empatar con el fondo real,
que es `--background` **en los dos temas y en los dos contextos**. Como es una
variable que ya cambia con el tema, las tres variantes colapsan en una:

```css
.prose-idoneo .tabla-desliz {
  /* … */
  background-image:
    linear-gradient(to right, var(--background), transparent),
    linear-gradient(to left,  var(--background), transparent),
    linear-gradient(to right, oklch(0% 0 0 / 0.16), transparent),
    linear-gradient(to left,  oklch(0% 0 0 / 0.16), transparent);
}

/* Solo la sombra necesita variante: negro sobre fondo casi negro no se ve. */
.dark .prose-idoneo .tabla-desliz {
  background-image:
    linear-gradient(to right, var(--background), transparent),
    linear-gradient(to left,  var(--background), transparent),
    linear-gradient(to right, oklch(100% 0 0 / 0.14), transparent),
    linear-gradient(to left,  oklch(100% 0 0 / 0.14), transparent);
}
```

Y **se borra el bloque `background-image` de `.prose-idoneo .marco-tabla
.tabla-desliz` (461-467)**, que solo existía para compensar un fondo que el marco
no pone. La regla `margin-block: 0` de la línea 469 **se conserva**: esa sí hace
falta.

Si en algún momento se decide que `<TablaClave>` lleve `bg-card` de verdad,
entonces —y solo entonces— vuelve a hacer falta una variante, y habrá que
escribirla **también** para oscuro.

**Estado: abierto.**

---

## A-18 · El degradado ciega a axe para el contraste de toda tabla
**Criterio:** ninguno · **Severidad: Menor** (deuda de herramienta, no defecto de la interfaz)
**Dónde:** consecuencia directa de `src/app/globals.css:431-447`

Medido en `/modulos/[slug]` a 375 px, con el mismo conjunto de reglas:

| | Antes | Después |
|---|---|---|
| Violaciones de axe | 1 | **0** |
| **Incompletas** | **1** (heredada del pie) | **32** |

De las 32, **31 son celdas de tabla** con el mensaje *«Element's background color
could not be determined due to a background gradient»*. axe deja de poder evaluar
el contraste de **todo el texto de tabla** en cuanto el contenedor lleva un
degradado.

No hay ningún fallo real detrás —el texto de tabla mide **17.03 claro / 15.22
oscuro** sobre `background`, medido a mano— pero a partir de ahora ese contraste
**solo se puede verificar midiendo**, y el Paso 15 mete 28 módulos de tablas. Hay
que dejarlo escrito para que nadie lea «0 violaciones» como «tabla verificada».

**Estado: aceptado, documentado.** No se propone quitar el degradado: la
afordancia vale más que la cobertura automática, y ya se sabía que axe cubre ~30 %.

---

## El pie a 13 px · A-08 **no** se repite

A/B en el navegador: 13 px real contra 12 px inyectado con `add_style_tag`, mismo
DOM, mismo ancho. Reproduce las cifras de A-05/A-08 y las compara.

| A 375 px | **12 px** (anterior) | **13 px** (actual) |
|---|---|---|
| Alto del párrafo de atribución | 97,5 px | **105,6 px** |
| Alto de línea | 19,5 px | 21,125 px |
| Líneas | 5,00 exactas | **5,00 exactas** |
| ¿Caja inflada? | no | **no** |
| «Idóneo 2210» | **partido en 2** | **entero** |
| Enlace de licencia | 108 × 43 px | 91 × 44 px (2 fragmentos) |
| Holgura sobre la barra fija | 31 px | **31 px** |

**El `py-3.5` sigue haciendo su trabajo.** El párrafo mide exactamente 5 alturas
de línea, igual que antes: el crecimiento de 97,5 a 105,6 px es **solo** el
tamaño de fuente (+8,3 %, idéntico a 13/12). La caja no se infló, que es lo que
distinguía A-08 — donde una línea pasaba de 15 a 44 px dentro del párrafo.

**Dos cosas que el A/B destapa y que no estaban previstas:**

1. **«Idóneo 2210» se partía a 12 px** a 375 px, por corte de línea. A 13 px queda
   entero a 375, 768 y 1280. Es suerte del reflujo, no estructura — pero la
   cifra queda registrada y va a favor del cambio.
2. **El enlace ahora se parte en dos fragmentos a 375 px** (91 × 44 cada uno).
   Es un `<a>` **en línea**, exento de 2.5.8, y cada fragmento conserva sus 44 px
   de alto. Sin consecuencia, pero conviene saberlo antes de que alguien lo
   reporte como defecto.

**La cifra de `DISENO.md` §2.5 está mal y hay que corregirla.** §2.5 dice que a
13 px el enlace «pasa de ~43 a ~49 px de alto». Medido: **44,0 px exactos**
(768 px, un solo fragmento). El cálculo es `14 + 16 + 14`, donde 16 px es la caja
de contenido de Inter a 13 px, no 21.

Y esto cierra algo que quedó abierto: A-05/A-08 anotaron los 43 px como «1 px
corto del piso interno de 44 de §3, trade-off consciente». **Ya no hay
trade-off:** 44,0 px cumple el piso exacto. La excepción se puede borrar de §3.

**Contraste, confirmado sin cambio:** **5.49:1 claro · 6.18:1 oscuro**, en las dos
rutas y en las tres piezas del pie (párrafo, enlace de licencia, enlaces de
navegación). El color no se tocó; el tamaño no mueve el umbral.

---

## Medida de lectura de 608 px · sin regresiones, con un matiz

**Alcance, medido elemento a elemento** (`.prose-idoneo`, 768 y 1280 px):

| Elemento | Ancho | Medida |
|---|---|---|
| `p` · `ul` · `ol` · `h2` · `h3` · `hr` · `aside` | **608 px** | lectura ✓ |
| `div` (`<TablaClave>`) · `figure` (`<Formula>`) · `.tabla-desliz` suelta | **720 px** | consulta ✓ |

El selector de hijo directo hace exactamente lo que §3.1 dice. **A 375 px no
cambia nada**: los nueve tipos de elemento miden 343 px, igual que antes.

**Sin scroll horizontal en ningún ancho probado**, en las dos rutas:
375 · 768 · 1280 · **320 (400 %)** · **187 (200 %)**. `scrollWidth == clientWidth`
en los cinco, y **cero elementos** de `main` sobresaliendo de la caja fuera del
contenedor de tabla.

`/erratas`: envoltorio **608 px** con `max-width: 608px`, ficha a 608 px, y 343 px
a móvil. Correcto.

### Caracteres por línea — el número cerrado

Ancho medio de carácter medido con `canvas.measureText` **sobre el texto real de
cada elemento**, no estimado ni heredado.

| Superficie | Cuerpo | 375 px | **≥768 px** | Antes (720 px) |
|---|---|---|---|---|
| **Teoría · párrafo** | 17 px | **42,0** | **74,4** | 88,5 |
| Teoría · elemento de lista | 17 px | 40,2 | 73,2 | — |
| `<Ojo>` · texto | 15 px | 40,4 | **79,3** | ~91,5 |
| Alerta en teoría · `<dd>` | 15 px | 42,6 | **79,2** | ~95,9 |
| Ficha de `/erratas` · `<dd>` | 15 px | 44,1 | **79,6** | ~93,7 |

**El objetivo se cumple: todo queda bajo los 80 de 1.4.8 (AAA).** Y a 375 px, que
es donde se usa la app, los 40–44 cpl son los correctos.

**El matiz, con su cifra.** §3.1 justifica los 608 px con «74,8 cpl y **cinco
caracteres de margen** bajo el 80». Eso vale para el cuerpo de teoría de 17 px
—mido **74,4**, a 0,4 de su predicción— pero **no para las superficies de 15 px**,
que caen en **79,2–79,6**: el margen ahí es de **0,4 a 0,8 caracteres**, no de
cinco. La causa es aritmética: la caja baja de 608 a 540–574 px (−6 % a −11 %)
pero el carácter de 15 px es un 17 % más estrecho que el de 17 px, así que entran
más. §3.1 estimó esas filas con 7,17 px de carácter; los valores reales van de
**6,81 a 7,25 px** según el texto.

No es un fallo —los tres pasan— pero **el margen es cero a efectos prácticos**:
un recuadro un poco más ancho, o un texto con más caracteres estrechos, cruza los
80. Si `DISENO.md` quiere conservar el argumento de los cinco caracteres, la
medida de los recuadros tendría que bajar a ~34rem. **Decide el `ui-designer`**;
no lo cambio yo.

---

## Lo demás que se remidió

| Punto | Resultado |
|---|---|
| **Barrido de teclado** (460 ms/parada, 375 px) | **22 paradas reales, 22 con contorno `2px solid --ring`**. Orden visual, sin trampas: salto → marca → tema → 3 prerrequisitos → **tabla (group)** → 3 alertas → enlace de prosa → **tabla suelta (group)** → 2 erratas del módulo → licencia → 2 del pie → 5 de la barra. La parada 23 es el `nextjs-portal` del overlay de desarrollo (`3px none`, alfa 0,5): **no es código de la app** |
| **`role="note"` no dejó nada sin nombre** | 6 de 6: 3 × «Ojo con esto» por `aria-label`, y 3 por `aria-labelledby` → `alerta-E-09` · `alerta-X-02` · `alerta-X-03`, **los tres con destino existente** y texto correcto |
| **`aria-labelledby` intacto** | sí; el `role="note"` no lo toca. Nombres: «Errata de la cartilla · E-09», «Las cartillas se contradicen · X-02», «Aclaración: no es un error · X-03» |
| **`group` no es landmark** | confirmado por contraste: `/erratas` **no tiene ninguna tabla** y declara los **mismos 4 `region`** que el módulo, que tiene dos. Los contenedores no añadieron ninguno |
| **axe-core** | 4 corridas a 375 px (2 rutas × 2 temas): **0 violaciones**. 50 reglas pasadas en el módulo, 44 en `/erratas`. A 1280 px, también 0 en las dos |
| **Semántica de tabla** | 2 `table` · 8 `columnheader` · 29 `cell` · **0 `rowheader`** (límite de GFM, aceptado en A-12) |
| **`complementary` sin nombre a ≥`lg`** | queda **1**: la barra lateral de escritorio (`aside.hidden.w-60…lg:sticky`), sin `role` ni nombre. **Es del Paso 5, no de este paso**, y axe no lo marca porque es único. Anotado para el Paso 18 |

## Contraste remedido en la reverificación

| Pieza | Sobre | Claro | Oscuro | AA |
|---|---|---|---|---|
| `<dt>` de alerta en teoría — **ahora 12 px** | `destructive/10` | **4.71** | **5.61** | ✅ 4.5 |
| Pie · párrafo de atribución — **ahora 13 px** | `background` | **5.49** | **6.18** | ✅ 4.5 |
| Pie · enlace de licencia — 13 px | `background` | **5.49** | **6.18** | ✅ 4.5 |
| Pie · enlaces de navegación — 13 px | `background` | **5.49** | **6.18** | ✅ 4.5 |

**El umbral del `<dt>` no se movió y así queda escrito:** WCAG solo aplica el
listón relajado de 3:1 a partir de **24 px**, o **18,66 px en negrita**. El `<dt>`
va a 12 px con peso 600: es texto normal, exige 4.5, y mide 4.71. La afirmación
del `ui-designer` es correcta. Sigue siendo **el par con menos margen de todo el
paso: 0,21**.

---
---

# Paso 7 — **Reverificación final: la ficha por fila de `DISENO.md` §3.2** · 2026-07-30

Rama `paso-7-mdx`. Tercera y última pasada del paso. Se mide el cambio de §3.2
—por debajo de `sm` toda tabla de 4+ columnas deja de ser retícula y se presenta
como una ficha por fila— más los dos cambios de §3.1 revisada (recuadros a 36rem).
**Nada se modificó:** árbol como se encontró, sin commit.

**Método.** MDX temporal en `content/teoria/c5-umbrales-zonas.mdx` con **cuatro
tablas**, elegidas para cubrir los dos lados del umbral y el techo del mapeo:

| Tabla | Columnas | Dónde | Para qué |
|---|---|---|---|
| Zonas de entrenamiento | **5** | `<TablaClave>` | la que motivó §3.2 |
| Modelos de distribución | **2** | `<TablaClave>` | **control**: debe seguir en retícula |
| Fórmulas de FCmáx | **3** | suelta, sin marco | **control**: 3 < 4, retícula |
| Siete columnas | **7** | `<TablaClave>` | techo de `--et-1 … --et-7` |

Más los cinco componentes, tres `<Ojo>`, las tres ramas de alerta (`E-09` ·
`X-02` · `X-03`), `<Dato>` con y sin nota, dos `<Formula>`, listas y un enlace en
prosa. **Borrado al terminar**, verificado con `git status`: `content/teoria/`
vuelve a tener solo su `.gitkeep`. Servidor en el **3117** (el 3000 lo ocupa un
proceso ajeno), cerrado al acabar. Cero dependencias nuevas.

Barrido de teclado con **460 ms por parada**, por encima de los ~420 ms que tarda
el `transition-all` en asentar el contorno.

## Veredicto

**Los cuatro puntos que se pidieron medir salen a favor del cambio, y el cambio
cierra A-11 y A-17.** La semántica de tabla sobrevive intacta al cambio de
`display`, el dato truncado se restituye, y axe recupera la tabla ancha a 375 px.
Quedan **cuatro hallazgos nuevos, los cuatro Menores**, ninguno bloqueante: uno
con arreglo probado (A-19) y tres que decide el `ui-designer`.

| Punto medido | Antes | Después | Estado |
|---|---|---|---|
| **1 · Semántica de tabla en el árbol** | — | **idéntica a 375 y a 1280 px**: 3 `table` · 6 `rowgroup` · 14 `row` · **10 `columnheader`** · 37 `cell` · 3 `group` con nombre | ✅ **A-10 y A-12 en pie** |
| **2 · «95 % / 5 %» a 375 px** | visible `95 % / `, cortado `5 %`, 45 px fuera | **`95 % / 5 %` íntegro**, 0 caracteres cortados, 0 px fuera · quinta columna presente · `scrollWidth == clientWidth` (341 = 341) | ✅ **A-11 cerrado** |
| **3 · El `aria-label` que quedó abierto** | «Tabla, desplazable en horizontal» en los dos anchos | miente bajo `sm`, confirmado por axe. **Arreglo probado**: «Tabla» / «Tabla · se desplaza en horizontal» sin JS | ⚠️ **A-19** |
| **4 · Incompletas de axe** | 375 px: **42** (17 de la tabla ancha) | 375 px: **25** (**0** de la tabla ancha) · 1280 px: **49** (25 de la tabla ancha) | ✅ **A-18 resuelto a 375**, sigue a 1280 (**A-22**) |
| Frontera `sm` | — | **639 px ficha · 640 px retícula**, exacta | ✅ sin regresión |
| Tipografía de la ficha (§2.3) | — | clave **12 px Inter 600 versalitas** · 1.ª celda **Barlow Condensed 18 px 600** · resto **Inter 15 px 400** | ✅ los tres |
| Contraste de la clave | — | **5.49:1 claro · 6.18:1 oscuro** (`muted-foreground` sobre `background`) | ✅ AA con holgura |
| Orden de lectura y de foco | — | DOM = visual en las **20 celdas**; 23 paradas, **23 con `2px solid --ring`** | ✅ |
| Zoom 200 % y 400 % | — | **0 solapamientos, 0 celdas fuera del contenedor**, `scrollWidth == clientWidth` a 187 y 320 px | ✅ |
| `prefers-reduced-motion` | — | **0 elementos** con movimiento por encima de 2 ms | ✅ |

---

## 1 · La ficha **no** deshizo A-10 ni A-12

Era el riesgo real: cambiar el `display` de `table`/`tbody`/`tr`/`td` retira la
semántica de tabla del árbol de accesibilidad. Los roles explícitos de
`componentes.tsx` existen justo para eso, y **funcionan**. Árbol completo por CDP
`Accessibility.getFullAXTree`, las cuatro combinaciones de tema × ancho:

| Rol en el árbol | **375 px (ficha)** | **1280 px (retícula)** |
|---|---|---|
| `table` | **3** | **3** |
| `rowgroup` | **6** | **6** |
| `row` | **14** | **14** |
| `columnheader` | **10** | **10** |
| `cell` | **37** | **37** |
| `rowheader` | 0 | 0 (límite de GFM, aceptado en A-12) |
| `group` con nombre | **3** | **3** |

**Las cifras son idénticas.** No hay ni un nodo de diferencia entre el viewport
donde la tabla es ficha y el viewport donde es retícula, ni entre claro y oscuro.
La tabla de 5 columnas conserva sus 5 `columnheader` y sus 20 `cell` con
`display: block`.

> **Sobre el «8 de 8» de A-12.** Aquel número venía de un MDX con dos tablas
> (5 + 3). Este trae cuatro (5 + 2 + 3 + 7), así que el total es **17 de 17**
> `<th scope="col" role="columnheader">`. El invariante es el que importa y se
> cumple: **todo `<th>` llega como `columnheader` con `scope="col"`, en los dos
> anchos**. Ningún otro valor de `scope`, ningún `<th>` pelado.

- El `<thead>` se **recorta** como manda §3.2: `position: absolute`, ancho 1 px,
  `clip-path: inset(50%)`. **Nunca `display: none`** — verificado en
  `getComputedStyle`, y los `columnheader` lo demuestran.
- El envoltorio conserva `role="group"`, nombre y `tabIndex={0}` en los dos
  anchos: **A-10 intacto**.
- **0 landmarks añadidos.** Los `group` siguen sin ser landmark: `/erratas`, que
  no tiene ninguna tabla, declara los **mismos 4 `region`** que el módulo, que
  tiene cuatro.

**El techo del mapeo aguanta.** La tabla de 7 columnas resuelve `--et-1` a
`--et-7` y sus **siete** campos caen dentro del contenedor a 375 px. `--et-7` es
el último que el CSS declara: una tabla de 8 columnas dejaría la octava sin
clave. No es un fallo hoy —ninguna cartilla trae 8 columnas— pero conviene que
esté escrito antes del Paso 15.

---

## 2 · «95 % / 5 %» se lee completo a 375 px

Era la razón de ser del cambio. Medido **carácter a carácter** con
`Range.getBoundingClientRect()`, en los dos temas:

| | Antes (retícula a 375 px) | **Después (ficha)** |
|---|---|---|
| Texto de la celda | `95 % / 5 %` | `95 % / 5 %` |
| **Visible sin desplazar** | `95 % / ` | **`95 % / 5 %`** |
| **Cortado** | **`5 %`** | **ninguno** |
| Fuera del borde derecho | 45 px | **0 px** |
| Quinta columna «Sustrato dominante» | **invisible** | **presente** — «Casi exclusivamente hidratos de carbono» |
| Campos en la ficha de R2 | — | **5 de 5**, los cinco dentro del contenedor |
| Desplazamiento dentro del contenedor | 177 px ocultos (34 %) | **`scrollWidth == clientWidth` = 341 px** |
| Desplazamiento de la página | ninguno | **ninguno** (`scrollWidth == clientWidth` = 375) |

**Los controles se comportan como el umbral pretende.** La tabla de **2
columnas** y la de **3** siguen en retícula a 375 px —`display: table`, `<thead>`
en `static`, degradado con sus 4 capas— y ninguna desborda. El umbral
`:has(thead th:nth-child(4))` separa exactamente lo que dice separar.

**Lo que se pierde queda dicho:** el contenedor de la tabla ancha pasa a medir
**1131 px de alto** contra un viewport de 812. La ficha es larga; a cambio, es
completa y se recorre en la dirección en la que el pulgar ya está desplazando.

---

## 3 · El `aria-label` bajo `sm` — **A-19**, con arreglo probado

### A-19 · El envoltorio promete un desplazamiento que ya no existe
**Criterio:** ninguno falla — 4.1.2 se cumple: el grupo tiene rol y tiene nombre ·
**Severidad: Menor**
**Dónde:** `src/components/mdx/componentes.tsx:86`

`DISENO.md` §3.2 lo dejó planteado y sin cambiar, para que lo decidiera el
auditor. **Lo confirmo, y no por lectura: lo dice el propio axe.**

| Evidencia | 375 px (ficha) | 1280 px (retícula) |
|---|---|---|
| Nombre accesible del grupo | «Tabla, desplazable en horizontal» | «Tabla, desplazable en horizontal» |
| `scrollWidth − clientWidth` | **0** | 0 |
| Regla `scrollable-region-focusable` de axe | **`inapplicable`** | `passes` |

La regla que axe usa para saber si una región es desplazable **deja de aplicar**
bajo `sm`: para su motor, ahí ya no hay región desplazable. Y el nombre sigue
diciendo que la hay, en el viewport donde la app se usa de verdad.

**«CSS no puede reescribir un `aria-label` por viewport» es cierto — y no hace
falta.** El nombre accesible sí se puede variar con CSS si se calcula desde el
contenido: el algoritmo de nombre accesible **excluye los descendientes ocultos**
del elemento referenciado por `aria-labelledby`. Así que basta con mover el
nombre a un `<p class="sr-only">` y apagar el sufijo con **la misma media query
que crea la ficha**.

```tsx
// componentes.tsx — el id se deriva del índice de tabla o de useId en un
// wrapper; cualquier clave única sirve, igual que `alerta-${errata.id}`.
<div className="tabla-desliz" tabIndex={0} role="group" aria-labelledby={idNombre} style={estilo}>
  <p id={idNombre} className="sr-only">
    Tabla<span className="pista-desliz"> · se desplaza en horizontal</span>
  </p>
  <table role="table" {...props}>{children}</table>
</div>
```

```css
/* globals.css, junto al bloque de §3.2 y con el mismo umbral */
@media (max-width: 39.9375rem) {
  .prose-idoneo .tabla-desliz:has(thead th:nth-child(4)) .pista-desliz { display: none; }
}
```

**Probado en el navegador sobre el DOM real, no supuesto.** Prototipo inyectado
sobre la tabla de 5 columnas, leyendo el nombre del árbol por CDP:

| Ancho | Nombre del grupo con el prototipo | Las otras tres tablas (sin tocar) |
|---|---|---|
| **375 px** | **«Tabla»** | «Tabla, desplazable en horizontal» |
| **1280 px** | **«Tabla · se desplaza en horizontal»** | «Tabla, desplazable en horizontal» |

Sin coste: el `<p>` mide 1 × 1 px, no añade parada de tabulación, y
`scrollWidth`, `clientWidth` y el ancho del documento no se mueven en ninguno de
los dos anchos. La afordancia se conserva íntegra por encima de `sm`, que era la
condición.

### Y sí, hace falta algo más que renombrar

**La parada de tabulación se queda sin trabajo bajo `sm`, y eso el nombre no lo
arregla.** Es **A-14 ampliado**: hasta ahora las paradas muertas eran las tablas
que no desbordaban; con la ficha, **la tabla ancha se suma a 375 px** — que es
justamente la que existía para justificar el `tabIndex={0}`. Y el contenedor mide
ahora 1131 px de alto, así que su contorno de foco **no cabe entero en pantalla**
(se ven 812 de 1131 px).

**No propongo quitarlo, por lo mismo que en A-14:** saber si una tabla desborda
exige medirla en el navegador, y eso convertiría un Server Component en cliente
para ganar una parada — y `§10.3` no se amplía por esto. `tabindex` no es
estilable, así que la media query no puede llegar ahí. Se **acepta y se
documenta**, y con A-19 puesto la parada al menos deja de mentir sobre lo que es.

---

## 4 · axe recupera la tabla ancha a 375 px — **A-18 resuelto a medias**

A-18 dejó constancia de que el degradado ciega a axe: *«background color could
not be determined due to a background gradient»*. Para medirlo sin comparar
manzanas con peras, se hizo un **A/B sobre el mismo MDX**: la misma página con la
regla de §3.2 puesta y con §3.2 neutralizada por inyección de CSS.

| A 375 px, mismo MDX | **Sin ficha** (§3.2 anulada) | **Con ficha** (lo que hay) |
|---|---|---|
| Violaciones | 0 | **0** |
| **Incompletas** | **42** | **25** |
| … por degradado | 41 | 24 |
| **… de la tabla ancha (5 col)** | **17** | **0** |
| … de la tabla de 2 columnas | 12 | 12 |
| … de la tabla de 3 columnas | 12 | 12 |
| … del pie («overlapped by another element») | 1 | 1 |

**La tabla ancha pasa de 17 nodos ciegos a 0**: a 375 px axe vuelve a medir el
contraste de todas sus celdas. Las 24 incompletas que quedan son las tablas de 2
y 3 columnas, que conservan el degradado **por diseño** — el umbral de §3.2 no
las toca.

Y las dos cifras que se pidieron, que en efecto difieren:

| | Incompletas | De la tabla ancha |
|---|---|---|
| **375 px** (ficha, degradado apagado) | **25** | **0** |
| **1280 px** (retícula, degradado puesto) | **49** | **25** |

Idénticas en claro y en oscuro. **0 violaciones en las ocho corridas** (2 rutas ×
2 temas × 2 anchos); 51 reglas pasadas en el módulo, 44 en `/erratas`.

> La comparación con el «1 → 32» de A-18 no es directa: aquel MDX traía dos
> tablas y este cuatro. Por eso se hizo el A/B sobre el mismo fixture, que es la
> única cifra honesta.

---

## Hallazgos nuevos

### A-20 · La clave de la ficha se anuncia en VERSALITAS
**Criterio:** ninguno. WCAG no regula el texto transformado · **Severidad: Menor**
**Dónde:** `src/app/globals.css` (`td::before`, `text-transform: uppercase`) — y
en realidad **en toda la app**

El `::before` que pinta la clave **sí llega al árbol de accesibilidad**, y llega
**con la transformación aplicada**. Medido en Chromium:

| | Lo que anuncia una celda |
|---|---|
| **1280 px** (retícula) | `95 % / 5 %` |
| **375 px** (ficha) | `AERÓBICO / ANAERÓBICO` + `95 % / 5 %` |

Dos cosas, y conviene separarlas:

1. **La duplicación está prevista y aceptada.** `DISENO.md` §3.2 dice que el
   lector anuncie además el `::before` es «aceptable y hasta útil», porque GFM no
   sabe expresar `<th scope="row">` (A-12). Lo confirmo: la clave repetida es la
   única pista de fila que llega. No lo toco.
2. **Las versalitas no estaban previstas, y me obligan a corregirme.** El Paso 5
   afirmó de `RotuloBloque` que «las mayúsculas las hace `uppercase` en CSS, no el
   string, así que el lector recibe *Bloque C · Ciencias Aplicadas* y no lo
   deletrea». **Esa afirmación es falsa en Chromium.** El árbol devuelve
   `BLOQUE`, `CIENCIAS APLICADAS`, `DICE LA CARTILLA`, `LO CORRECTO`, `CÓMO
   RESPONDER`, `GRASAS`, `HIDRATOS` y el título de `<TablaClave>` — todos
   transformados. La ficha no introduce el problema: **añade 20 instancias por
   tabla de 5 columnas**, y el Paso 15 mete 28 módulos.

**Alcance real, sin dramatizar.** Que el árbol traiga versalitas no significa que
el lector deletree: NVDA y JAWS leen palabras en mayúsculas con normalidad, y
Gecko y WebKit **no** aplican `text-transform` al nombre accesible, así que el
efecto es de Chromium. El riesgo concreto es que algún lector con verbosidad de
mayúsculas activa lea «AERÓBICO» letra a letra, cinco veces por ficha.

**Arreglo, si el `ui-designer` lo quiere:** escribir la clave ya en versalitas no
es opción (la fuente es el `<thead>`, y ahí debe leerse normal). La salida barata
es quitar el `text-transform` de la clave de la ficha y confiar el escalón
tipográfico al tamaño, el peso y el `letter-spacing` —que es exactamente la
opción 1 que A-16 ya puso sobre la mesa para los `<dt>`—. **Decide el
`ui-designer`; es §2.3 y §3.2, no una corrección de accesibilidad.**

---

### A-21 · La banda «74,4–75,0 cpl» de §3.1 no se cumple en dos de cuatro superficies
**Criterio:** 1.4.8 es **AAA**, no falla AA · **Severidad: Menor** · **decide el `ui-designer`**
**Dónde:** `.claude/DISENO.md` §3.1 revisada

Recuadros remedidos: **576 px = 36rem exactos** a 768 y 1280 px. El cambio se
aplicó. Caracteres por línea con `canvas.measureText` sobre el texto real de cada
elemento:

| Superficie | Cuerpo | 375 px | **≥768 px** | §3.1 afirma | ¿Dentro? |
|---|---|---|---|---|---|
| Teoría · párrafo | 17 px | 42,2 | **74,7** | 74,4–75,0 | ✅ |
| `<Ojo>` · texto | 15 px | 40,3 | **74,5** | 74,4–75,0 | ✅ |
| **Alerta · `<dd>`** | 15 px | 44,7 | **78,3** | 74,4–75,0 | ❌ **fuera por arriba** |
| **Ficha de `/erratas` · `<dd>`** | 15 px | 41,5 | **70,7** | 74,4–75,0 | ❌ fuera por abajo |

**Ninguna falla**: las cuatro quedan bajo los 80 de 1.4.8. Pero la banda que §3.1
publica no describe lo medido. La alerta `<dd>` es la que importa: **78,3 cpl deja
1,7 caracteres de margen**, no los cinco del argumento original — el mismo matiz
que A-15 ya levantó, ahora con la cifra de después. La causa es la de siempre: la
caja baja de 608 a 542 px, pero el carácter de 15 px es más estrecho que el de
17, así que entran más de los que la estimación suponía.

Si §3.1 quiere conservar el argumento del margen, la medida de los recuadros
tendría que bajar. **No lo cambio yo.**

---

### A-22 · Por encima de `sm` ninguna tabla desborda: el degradado no señala nada y cuesta 49 incompletas
**Criterio:** ninguno · **Severidad: Menor** · **decide el `ui-designer`**
**Dónde:** `src/app/globals.css`, el bloque de A-11 fuera de la media query

§3.2 conserva el degradado de 640 px para arriba «porque una tabla de 6 columnas
todavía puede desbordar a 700 px». **Medido, no desborda.** Barrido de las cuatro
tablas del fixture, incluida la de **7 columnas**:

| Ancho | 5 col | 2 col | 3 col | **7 col** |
|---|---|---|---|---|
| 640 · 660 · 680 · 700 · 720 · 768 · 900 · 1280 px | **0** | **0** | **0** | **0** |

Cero desbordamiento en los ocho anchos. La razón es estructural: la tabla lleva
`width: 100%` con `table-layout: auto`, así que las celdas **reparten y envuelven**
en vez de desbordar. Para desbordar haría falta que el ancho de `min-content`
superase los 718 px de la columna — una cadena larga sin puntos de corte, una URL,
una fórmula sin espacios. Posible, pero no es lo que hay.

Balance, con las dos cifras a la vista:

- **Beneficio arriba:** ninguno medible en este contenido.
- **Coste arriba:** **49 incompletas de axe** a 1280 px — sin cobertura automática
  de contraste en ninguna tabla de escritorio, justo antes de que el Paso 15 meta
  28 módulos de tablas.

**No propongo quitarlo por mi cuenta**, porque la premisa de §3.2 no es falsa
—una tabla con contenido inquebrable sí desbordaría— y porque la afordancia vale
más que la cobertura de una herramienta que cubre el 30 %. Lo que sí digo es que
**la decisión debe tomarse con estos dos números delante**, y que si se conserva,
el contraste de tabla en escritorio **solo se puede verificar midiendo a mano**.
Que nadie lea «0 violaciones» como «tabla verificada».

---

## Lo demás que se remidió en esta pasada

| Punto | Resultado |
|---|---|
| **Frontera `sm`, exacta** | **639 px → ficha** (`display: block`, `<thead>` absoluto, 0 capas de degradado) · **640 px → retícula** (`display: table`, `<thead>` estático, 4 capas). El corte cae donde §3.2 dice |
| **≥640 px: nada cambió** | Las cuatro tablas en `display: table`, `<thead>` en `static`, **4 capas de degradado**, `scrollWidth == clientWidth` a 640 · 641 · 768 · 1024 · 1280 px. Sin desplazamiento nuevo en ningún ancho |
| **A-17 cerrado, verificado en `getComputedStyle`** | La tapa computa **`oklch(0.991 0.002 250)` en claro** y **`oklch(0.175 0.014 255)` en oscuro** — `--background` en los dos casos, **dentro y fuera de `.marco-tabla`**. La variante de `--card` que empataba en especificidad ya no existe: las tres colapsaron en una |
| **Tipografía de la ficha contra §2.3** | Clave **12 px · Inter · 600 · versalitas · tracking 0.08em**; primera celda **18 px · Barlow Condensed · 600**; resto **15 px · Inter · 400**. Las tres filas de la tabla de §3.2, exactas |
| **Contraste de la clave** | **5.49:1 claro · 6.18:1 oscuro** (`muted-foreground` sobre `background`, medido por píxel sobre el DOM). Umbral 4.5 para texto normal a 12 px: ✅ con holgura |
| **Contraste del resto de la ficha** | Valor de la 1.ª celda y valores del resto: **17.03 claro · 15.22 oscuro** ✅ |
| **Orden de lectura en la ficha** | **20 de 20 celdas**: el orden del DOM coincide con el orden visual (y creciente, x constante). **0 discrepancias** |
| **Orden de foco a 375 px** | **23 paradas reales, 23 con `2px solid --ring`**. Visual y sin trampas: salto → marca → tema → 3 prerrequisitos → **tabla ancha (group)** → 3 alertas → enlace de prosa → **2 tablas (group)** → 2 erratas del módulo → licencia → 2 del pie → 5 de la barra. La parada 24 es el `nextjs-portal` del overlay de desarrollo: **no es código de la app** |
| **Zoom 200 % (187 px) y 400 % (94 px), y los 320 px de referencia de 1.4.10** | **0 solapamientos** entre celdas de la ficha y **0 celdas fuera del contenedor** en los tres. `scrollWidth == clientWidth` a 187 y a 320. A 94 px el documento sí desborda (171 vs 94), pero **no por la tabla** —0 celdas fuera— sino por el botón `shrink-0` del encabezado, ya anotado en el Paso 5 y fuera de lo que exige cualquier criterio AA |
| **`prefers-reduced-motion`** | **0 elementos** con transición o animación por encima de 2 ms en toda la ruta, con la ficha puesta |
| **axe, las ocho corridas** | **0 violaciones** en `/modulos/[slug]` y `/erratas`, claro y oscuro, 375 y 1280 px. `/erratas`: **0 incompletas a 1280** y 1 a 375 (la del pie, heredada) |
| **La única incompleta que no es degradado** | `<strong>COLEF Colombia</strong>` del pie: *«overlapped by another element»*, la barra fija a 375 px. Es la misma del Paso 5, sin cambio |

