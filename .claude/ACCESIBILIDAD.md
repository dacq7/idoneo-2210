# Estado de accesibilidad — Idóneo 2210

Estándar: **WCAG 2.2 nivel AA**. Última auditoría completa: **2026-07-30** (Paso 5,
rama `paso-5-layout`). **Reverificada el 2026-07-30** tras los arreglos de A-01 a
A-05: los cinco se midieron uno por uno, con la cifra de antes y la de después.

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
| `RotuloBloque` (componente, sin ruta que lo consuma) | n/a (no interactivo) | ✅ solo por código | ✅ 4.85:1 peor caso (C) | ✅ 8.02:1 peor caso (C) | n/a | n/a | **APROBADO POR CÓDIGO** — reauditar en runtime en el Paso 7 | 2026-07-30 |

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
