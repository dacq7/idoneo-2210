# Sistema de diseño — Idóneo 2210

> ## ✅ APROBADO — 2026-07-29
>
> **Fuente de verdad del sistema de diseño de Idóneo 2210.** Aprobado por el
> usuario el 2026-07-29 sobre la rama `paso-5-layout`, con las **ocho
> desviaciones** que contiene: D-1 a D-6 (valores de paleta que corrigen seis
> fallos AA medidos en el tema claro de §11.3), D-7 (Barlow → Barlow Condensed,
> §11.2) y D-8 (la válvula `data-compacto` del piso táctil).
>
> También aprobadas: las tres altas a la lista cerrada de §10.3
> (`riel-bloques.tsx` y `app/error.tsx` como cliente, `encabezado.tsx` como
> servidor) y omitir la línea `manifest:` de §11.2 hasta el Paso 18.1.
>
> Registrado en **ADR-009** de `ARQUITECTURA.md`. Donde este documento y §11.2 o
> §11.3 del blueprint difieran, **manda este documento**; el motivo de cada
> diferencia está en su fila de §1.4 y en el ADR.

Cualquier agente que construya interfaz lee este archivo antes de escribir un
componente. Si algo no está aquí, no es del sistema.

---

## 1. Paleta

Formato `oklch(L C H)`, como exige §2.1. El hex es informativo: **el valor que se
escribe en `globals.css` es el `oklch`.**

Todo token se declara **dos veces**: el valor crudo en `:root` / `.dark`, y su
alias en `@theme inline`. Sin el alias, la utilidad de Tailwind no existe.

### 1.1 Los seis colores nombrados

| Nombre | Token | Claro | Oscuro | Para qué |
|---|---|---|---|---|
| **Azul acero** | `--primary` · `--ring` | `oklch(0.48 0.12 250)` `#1a609e` | `oklch(0.70 0.13 248)` `#56a4eb` | Acción principal, enlaces, foco de teclado, veredicto «Listo». El único color de marca. |
| **Pizarra** | `--foreground` · `--muted-foreground` | `#141a22` · `#606873` | `#e2e7eb` · `#8c949f` | Todo el texto. Azulada, no negra: descansa la vista en lectura larga de noche. |
| **Verde campo** | `--exito` | `oklch(0.52 0.125 152)` `#1c7d43` | `oklch(0.68 0.14 152)` `#48b06c` | Respuesta correcta, veredicto «Sólido». Nunca para celebrar: para informar. |
| **Rojo tabla** | `--destructive` | `oklch(0.552 0.19 27)` `#c9312d` | `oklch(0.66 0.18 26)` `#ec5c55` | Respuesta incorrecta, veredicto «En riesgo», cronómetro ≤2 min. |
| **Ámbar de aviso** | `--aviso` | `oklch(0.560 0.120 72)` `#9f6700` ⚠ | `oklch(0.78 0.14 76)` `#eaaa40` | Veredicto «En camino», cronómetro ≤10 min, `<Ojo>`. |
| **Lienzo** | `--background` · `--card` | `#fbfcfd` · `#ffffff` | `#0c1117` · `#151b22` | Fondo de página y de tarjeta. |

Los tokens restantes de §11.3 (`--secondary`, `--muted`, `--accent`, `--popover`,
`--border`, `--input`, `--chart-1..5`) se conservan: los consumen los 18
componentes de `src/components/ui/` y **renombrarlos no es una opción**.

### 1.2 Los cuatro tokens de bloque

Cumplen el requisito duro del brief: **el usuario sabe en qué bloque está por el
color, sin leer.** Cada bloque tiene su color, su `-suave` (relleno de panel) y
comparten `--bloque-contraste` (texto sobre el color sólido).

| Bloque | Token | Claro | Oscuro | `-suave` claro | `-suave` oscuro |
|---|---|---|---|---|---|
| **A** · Ciencias Básicas | `--bloque-a` | `oklch(0.535 0.115 72)` `#966000` ⚠ | `oklch(0.76 0.13 76)` `#e0a546` | `oklch(0.972 0.030 78)` `#fff4e0` ⚠ | `oklch(0.28 0.045 76)` `#36260d` |
| **B** · Pedagogía | `--bloque-b` | `oklch(0.52 0.155 295)` `#7151b7` | `oklch(0.72 0.145 295)` `#ac90f5` | `oklch(0.972 0.026 295)` `#f7f3ff` ⚠ | `oklch(0.28 0.05 295)` `#2b243f` |
| **C** · Ciencias Aplicadas | `--bloque-c` | `oklch(0.53 0.105 172)` `#007f65` | `oklch(0.72 0.105 172)` `#54ba9d` | `oklch(0.972 0.026 172)` `#e5fcf4` ⚠ | `oklch(0.27 0.04 172)` `#0e2d24` |
| **D** · Entrenamiento | `--bloque-d` | `oklch(0.55 0.145 40)` `#b54d26` | `oklch(0.73 0.135 45)` `#ed8a5c` | `oklch(0.972 0.026 45)` `#fff1e8` ⚠ | `oklch(0.28 0.05 45)` `#3d2013` |
| — | `--bloque-contraste` | `oklch(0.99 0 0)` `#fcfcfc` | `oklch(0.16 0.01 255)` `#0a0e12` | — | — |

**Por qué estos cuatro matices y no otros.** Están separados ~70–100° de matiz
entre sí, así que se distinguen en el rango completo de deficiencia de visión al
color más común (protanopía/deuteranopía) por *matiz y por lightness*, no solo
por matiz: A y D quedan en el lado cálido pero con L y croma distintos, B es el
único violeta y C el único verde-azulado. Y ninguno es el azul acero de
`--primary`: el color de bloque nunca se confunde con «esto es un botón».

**El color de bloque nunca es el único portador de una información.** Siempre va
acompañado del texto del bloque (el rótulo «BLOQUE C · CIENCIAS APLICADAS») o de
su letra. El color acelera el reconocimiento; no lo sustituye.

Esta frase es la que obliga al **rótulo de bloque de §2.4**: el riel del
encabezado comunica el bloque en contexto *solo por color*, así que toda ruta con
un bloque en contexto está obligada a poner el nombre en texto. **§2.4 es una
regla del sistema, no una tarea de un paso concreto.**

**Uso obligado del mapa estático.** Tailwind no genera clases dinámicas:
`bg-bloque-${id}` no existe. Se usa `CLASES_BLOQUE` de `src/lib/utils.ts`, que ya
está escrito y probado.

### 1.3 Contraste verificado — AA en los dos temas

Medido con conversión oklch → sRGB y la fórmula WCAG 2.1. **59 pares, 0 fallos.**
Los valores mínimos de cada grupo:

| Grupo | Claro (peor caso) | Oscuro (peor caso) | Mínimo |
|---|---|---|---|
| Texto normal sobre `background` / `card` / `muted` | 4.93:1 (`muted-foreground`/`muted`) | 5.06:1 | 4.5 |
| Semánticos **como texto** (`text-aviso`, `text-exito`…) | 4.65:1 (`aviso`/`background`) | 5.14:1 | 4.5 |
| Semánticos **como relleno** (`bg-aviso` + `text-aviso-foreground`) | 4.63:1 | 5.74:1 | 4.5 |
| Bloques **como texto** sobre `background` / `card` | 4.85:1 (C) | 6.69:1 | 4.5 |
| Bloques sobre su propio `-suave` | 4.64:1 (C) | 5.69:1 | 4.5 |
| `--bloque-contraste` sobre el bloque sólido (insignias) | 4.84:1 (C) | 7.47:1 | 4.5 |
| No textual 1.4.11: borde de campo, anillo de foco, bandas | 3.03:1 (`input`) | 3.03:1 | 3.0 |

**`--border` queda deliberadamente por debajo de 3:1** (1.48:1 claro / 1.42:1
oscuro). Es correcto: `border-border` solo dibuja separadores, filos de tarjeta y
reglas de tabla — información decorativa, exenta de 1.4.11. Los bordes que **sí**
identifican un control (`border-input` en `Input` y `SelectTrigger`) usan
`--input`, que sí cumple 3:1. Esta distinción es intencional y no es deuda.

**Foco de teclado — la regla de `globals.css` es el único portador. No se toca.**

⚠️ **Corregido el 2026-07-30 (hallazgo A-06 de `ACCESIBILIDAD.md`).** La versión
anterior de este párrafo afirmaba que shadcn compone
`focus-visible:outline-1 outline-ring`. **Es falso para la versión instalada**, y
creerlo lleva a borrar el único indicador de foco que tiene la app.

Lo que **realmente** traen los 18 componentes de `src/components/ui/`, verificado
archivo por archivo: `outline-none` + `focus-visible:border-ring` +
`focus-visible:ring-[3px] ring-ring/50`. Es decir:

- `border-ring` **no dibuja nada** en un botón sin clase `border`: el ancho de
  borde es 0.
- Queda solo el halo de 3px a media opacidad, por debajo del 3:1 que pide WCAG
  1.4.11. Medido en navegador: sin regla propia, el interruptor de tema sale con
  `outline-style: none`.
- Solo `tabs` y `scroll-area` traen `focus-visible:outline-1` propio.

Por eso el foco de toda la app lo pinta **una sola regla** en `globals.css`, y
**esa regla no es redundante: es el único portador.** No se borra, no se mueve a
`@layer base`, no se «simplifica» porque parezca que shadcn ya lo hace.

```css
@layer utilities {
  a:focus-visible, button:focus-visible, [role='button']:focus-visible,
  input:focus-visible, select:focus-visible, textarea:focus-visible,
  summary:focus-visible, [tabindex]:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
}
```

**Por qué va en `@layer utilities` con selector de elemento + pseudoclase.** Las
capas ganan por orden, no por especificidad: en `@layer base` esta regla perdería
contra el `.outline-none` de shadcn. A igual capa decide la especificidad, y
`button:focus-visible` (0,1,1) vence a `.outline-none` (0,1,0). Los componentes
que sí traen contorno propio (`focus-visible:outline-1`, 0,2,0) siguen mandando
sobre ella, que es lo correcto.

**Estado medido** (auditoría del 2026-07-30, los dos temas, los 9 elementos
enfocables de las rutas del Paso 5): `outline: 2px solid` a `--ring` **completo,
sin alfa**. Contraste del contorno **6.37:1 en claro · 7.15:1 en oscuro**, sobre
un mínimo de 3:1. El halo de 3px al 50 % es refuerzo, no el portador.

**Nota para quien vuelva a medirlo.** El `transition-all` de shadcn (deuda
registrada en `COMPONENTES.md`) anima `outline-color` desde el `ring/50` de reposo
hasta `--ring` completo, y `outline-offset` de 0 a 2px, durante ~150 ms. Una
medición instantánea puede leer el contorno a media opacidad y a 3px: es
**artefacto de transición, no un fallo**. Con `prefers-reduced-motion` colapsa a
0.01 ms. Refuerza el caso para saldar la deuda de `transition-all`.

**Única excepción autorizada al contorno:** la barra inferior fija lo mete hacia
dentro con `focus-visible:-outline-offset-2`, porque 2px por fuera se recortan
contra el borde de la barra. Consecuencia aceptada y documentada en §4.6.

### 1.4 ⚠ DESVIACIONES DE §11.3 — seis valores, cero nombres

Ninguna renombra un token, así que los 18 componentes de shadcn no se tocan. Son
cambios de **valor** en `globals.css`.

| # | Token | §11.3 dice | Propuesta | Por qué |
|---|---|---|---|---|
| **D-1** | `--aviso` (claro) | `oklch(0.66 0.145 72)` `#c88100` | `oklch(0.560 0.120 72)` `#9f6700` | **Violación AA medida: 3.11:1** como texto sobre `background`. Y `text-aviso` sí se usa como texto: el `<Ojo>` de §12.3 y el cronómetro a los 10 min. |
| **D-2** | `--aviso-foreground` (claro) | `oklch(0.20 0.02 255)` (casi negro) | `oklch(0.99 0 0)` (casi blanco) | Consecuencia forzada de D-1: sobre el ámbar oscuro, el texto negro cae a 3.01:1. Con el cambio, `--aviso` se comporta **igual que `--destructive` y `--exito`**, que ya son «color oscuro + primer plano claro». Corrige la única incoherencia de la paleta. |
| **D-3** | `--bloque-a` (claro) | `oklch(0.60 0.125 72)` `#ad720d` | `oklch(0.535 0.115 72)` `#966000` | **Tres violaciones AA medidas:** 3.94:1 como texto sobre `background`, 3.54:1 sobre su `-suave`, y 3.93:1 con `--bloque-contraste` encima. El ámbar es el matiz que en sRGB no puede ser claro y oscuro a la vez; hay que bajarlo. En oscuro sigue siendo `#e0a546`, así que el bloque A se lee como «oro/ámbar» en los dos temas. |
| **D-4** | los 4 `--bloque-*-suave` (claro) | `L 0.955` | `L 0.972`, croma bajado a 0.026–0.030 | Con `L 0.955`, C y D fallaban por margen (4.42:1 y 4.47:1) al poner su color encima. Subir el `-suave` los arregla **sin tocar los colores de bloque B, C y D**, que se quedan exactamente como §11.3. Es el arreglo de menor huella. |
| **D-5** | `--input` (los dos temas) | igual que `--border` | claro `oklch(0.66 0.014 250)` `#8c939b` · oscuro `oklch(0.51 0.022 255)` `#5e6773` | **1.30:1 claro y 1.42:1 oscuro.** El borde de un campo de texto sí identifica el control: WCAG 1.4.11 pide 3:1. Afecta el `<input>` del ítem de cálculo (Paso 9), `/ajustes` y `/herramientas`. |
| **D-6** | `--border` (claro) | `oklch(0.902 0.008 250)` | `oklch(0.87 0.010 250)` `#cfd5db` | **No es AA, es legibilidad.** `--card` (`#ffffff`) sobre `--background` (`#fbfcfd`) son perceptualmente idénticos: ΔL* ≈ 1.2. La tarjeta solo existe si su borde se ve. Con 0.87 sube a 1.48:1 vs la tarjeta, que sí se percibe. |

**Alternativa medida y rechazada.** Antes de D-6 probé oscurecer
`--background` a `oklch(0.972 0.004 250)` para que las tarjetas blancas
«flotaran». La separación tarjeta/fondo pasa de 1.03:1 a **1.08:1 — sigue siendo
imperceptible** — y a cambio ese fondo más oscuro estrecha el margen AA de *los
diez tokens de color* que se leen encima. Mal negocio: se paga en accesibilidad
lo que no se cobra en jerarquía. Se rechaza; la jerarquía sale del borde.

**Consecuencias visuales de D-5 que hay que aceptar a ojos abiertos:**
- `Switch` usa `data-[state=unchecked]:bg-input` como pista apagada. Pasa de un
  gris casi invisible a un gris medio. Sigue distinguiéndose sin ambigüedad del
  estado encendido (`bg-primary`, azul saturado), y el control por fin tiene
  affordance visible.
- En oscuro, `Button variant="outline"` y `SelectTrigger` usan `bg-input/30`
  como relleno. Con `--input` más claro, el relleno sube un paso: los botones
  fantasma se vuelven visibles. Es mejora, pero es un cambio respecto al aspecto
  por defecto de shadcn.

---

## 2. Tipografía

### 2.1 Familias y roles

Tres familias, tres voces distintas. Todas por `next/font/google` — **cero
dependencias nuevas** (ADR-002).

| Rol | Familia | Pesos | Token | Dónde |
|---|---|---|---|---|
| **Display** | **Barlow Condensed** ⚠ | 600, 700 | `--fuente-titulo` → `--font-titulo` | `h1`–`h3`, veredicto, cifras grandes. **Nunca por debajo de 1.125rem.** |
| **Cuerpo** | **Inter** | 400, 500, 600 | `--fuente-cuerpo` → `--font-sans` | Teoría, enunciados, opciones, *eyebrows*, etiquetas de nav, pie. Todo lo que se lee. |
| **Utilitaria** | **JetBrains Mono** | 400, 500 | `--fuente-mono` → `--font-mono` | Cronómetro, valores de la calculadora, `<Formula>`, `<Dato>`, letra de opción (A/B/C/D), cifras del informe. |

`font-variant-numeric: tabular-nums` global en `body` (§11.3). Es deliberado y se
conserva: la app está llena de rangos numéricos («65–75 %», «10–15 s», «♂ 40–52 %»)
y en las tablas de teoría la alineación de columnas importa más que el ligero
ensanche en prosa corrida. Afecta a Inter y a Barlow Condensed; en JetBrains Mono
no hace nada porque ya es monoespaciada.

### 2.2 ⚠ DESVIACIÓN DE §11.2 — Barlow → Barlow Condensed

§11.2 fija **Barlow** 600/700 para títulos. Propongo **Barlow Condensed**.
El nombre del token no cambia (`--fuente-titulo` / `--font-titulo`), así que nada
aguas abajo se rompe.

**Tres razones, en orden de peso:**

1. **Funcional, medible.** Los 29 títulos de módulo de `content/estructura.ts`
   son largos: «Sistemas nervioso, digestivo y osteomuscular» (44 car.),
   «Macronutrientes y micronutrientes» (33), «Estadística descriptiva y calidad
   de pruebas» (43). A 375 px de ancho con `px-4`, un `h1` de 28 px en Barlow
   normal parte esos títulos en tres líneas. Condensada entran en dos. En un
   teléfono, eso es la diferencia entre ver el contenido y ver solo el título.
2. **Barlow y Inter son la misma voz.** Las dos son neogrotescas de bajo
   contraste. A 22–28 px, Barlow 700 junto a Inter 600 se leen como una sola
   familia: el rol «display» no cumple su función de contraste tipográfico.
   Condensada sí es inconfundible a cualquier tamaño.
3. **Es el vernáculo del sujeto.** La grotesca condensada es la letra del peto de
   competencia, del marcador del estadio, del rótulo de la planilla. Barlow
   Condensed es del mismo diseñador y la misma familia que Barlow, así que
   convive con Inter y JetBrains Mono sin roce.

**Trade-off que hay que aceptar:** las condensadas pierden legibilidad en tamaños
pequeños y para lectores con baja visión. **Mitigación, que es regla del sistema:
Barlow Condensed nunca baja de 1.125rem (18 px) y nunca se usa en cuerpo de
texto.** El *eyebrow* de 11 px va en **Inter 600 versalitas con tracking +0.08em**,
no en condensada.

**Considerado y descartado:** cambiar JetBrains Mono por una mono más
«instrumento» (Azeret Mono, Martian Mono). JetBrains Mono se queda porque
distingue sin ambigüedad `0/O` y `1/l`, y esta app hace escribir valores exactos
de biomarcadores y frecuencias cardíacas. El carácter de marcador se consigue con
el **tratamiento** (tamaño grande, tracking −0.02em, ranura de ancho fijo), no
con una cuarta opinión tipográfica. Una familia menos que discutir.

### 2.3 Escala completa

Móvil primero. Donde no hay columna `lg`, el valor no cambia.

| Rol | Familia | Móvil | `lg` | Peso | line-height | tracking |
|---|---|---|---|---|---|---|
| Antetítulo (eyebrow) | Inter | 0.6875rem · 11px | = | 600 | 1.1 | +0.08em, `uppercase` |
| **Clave de campo** | Inter | **0.75rem · 12px** | = | 600 | 1.1 | +0.08em, `uppercase` |
| `h1` de pantalla | Barlow Cond. | 1.75rem · 28px | 2.25rem · 36px | 700 | 1.08 | −0.005em |
| `h2` de sección | Barlow Cond. | 1.375rem · 22px | 1.5rem · 24px | 600 | 1.15 | 0 |
| `h3` | Barlow Cond. | 1.125rem · 18px | = | 600 | 1.25 | 0 |
| Veredicto | Barlow Cond. | 2rem · 32px | 2.5rem · 40px | 700 | 1.05 | −0.01em |
| Cuerpo de teoría (MDX) | Inter | 1.0625rem · 17px | = | 400 | 1.65 | 0 |
| Cuerpo de interfaz | Inter | 0.9375rem · 15px | = | 400 | 1.5 | 0 |
| Enunciado de ítem | Inter | 1.0625rem · 17px | = | 500 | 1.45 | 0 |
| Opción de ítem | Inter | 0.95rem · 15px | = | 400 | 1.4 | 0 |
| Auxiliar / metadato | Inter | 0.8125rem · 13px | = | 400 | 1.5 | 0 |
| Pie legal | Inter | **0.8125rem · 13px** | = | 400 | 1.6 | 0 |
| Etiqueta de nav inferior | Inter | 0.6875rem · 11px | = | 500 · 600 activo | 1 | +0.01em |
| Cronómetro, pantalla completa | JB Mono | 2.25rem · 36px | 2.75rem · 44px | 500 | 1 | −0.02em |
| Cronómetro, barra fija | JB Mono | 1.375rem · 22px | = | 500 | 1 | −0.02em |
| Dato / valor / fórmula | JB Mono | 0.875rem · 14px | = | 500 | 1.4 | 0 |

**Cuatro reglas duras de la escala:**

1. **Barlow Condensed ≥ 1.125rem, siempre.** Por debajo de eso, Inter.
2. **Ningún `<input>` baja de 16px en móvil.** iOS hace zoom automático al enfocar
   un campo con letra menor, y en medio de un simulacro cronometrado eso
   desorienta y cuesta segundos. El `Input` de shadcn ya trae
   `text-base md:text-sm`: **no se toca.**
3. **El cronómetro va en ranura de ancho fijo.** JetBrains Mono + `tabular-nums`
   + un contenedor de ancho mínimo calculado para `H:MM:SS`. Los dígitos no
   pueden mover el layout cada segundo.
4. **Ningún tamaño de lectura baja de 13px. Sin excepciones.** Lo único que vive
   por debajo son **etiquetas** (11–12px), y una etiqueta no es lectura: es una
   pieza corta y fija que se reconoce por posición y forma, no que se recorre
   palabra a palabra. Hasta el 2026-07-30 esta regla llevaba una excepción para
   el pie legal (12px); la excepción se elimina — ver §2.5.

### 2.4 El rótulo de bloque — **REGLA DEL SISTEMA**

> Añadida el 2026-07-30. Deriva de **§1.2** («el color de bloque nunca es el único
> portador de una información») y cierra el hueco que el Paso 5 dejó abierto: el
> riel de §4.3 comunica el bloque en contexto **solo por color**. No es una tarea
> del Paso 7: **aplica a toda ruta que tenga un bloque en contexto**, y cualquier
> agente que construya una pantalla de bloque o de módulo la cumple sin preguntar.

**Regla, en una frase.** Toda pantalla con **exactamente un** bloque en contexto
muestra el rótulo `BLOQUE {LETRA} · {TÍTULO DEL BLOQUE}` inmediatamente encima de
su `<h1>`, en el color de ese bloque. Ninguna otra pantalla lo muestra.

#### Qué dice, exactamente

Forma completa, **letra y título**, en versalitas: `BLOQUE C · CIENCIAS APLICADAS`.
Separador ` · ` (espacio, punto medio, espacio) — el mismo del resto del sistema.

Las dos partes son necesarias y ninguna es negociable:
- **la letra** es lo que empareja con el color: es el identificador que usan el
  riel (4 segmentos), los ids de ítem (`C5-014`) y el blueprint;
- **el título** es lo que lo hace legible para un humano que no memorizó las
  letras.

El título sale de `BLOQUES` en `content/estructura.ts`, nunca escrito a mano.
Cabe en una línea a 375 px: el caso más largo,
`BLOQUE D · ENTRENAMIENTO DEPORTIVO` (34 caracteres), entra en los 343 px útiles.
**No se trunca nunca**; si algún día no cupiera, envuelve a dos líneas.

#### Dónde vive

Inmediatamente **encima del `<h1>` de la página**, formando con él una sola unidad
de título. No en el encabezado.

```
┌────────────────────────────────────────┐
│  Idóneo 2210                      [☾]  │  encabezado sticky (marca + tema)
├──▓▓▓▓▓▓▓▓─▒▒▒▒▒▒▒▒▒─████████████─▒▒▒▒──┤  riel de bloques, h-1, a sangre
│                                        │
│  BLOQUE C · CIENCIAS APLICADAS         │  ← rótulo   Inter 600 11px
│  Umbrales y zonas de entrenamiento     │  ← h1       Barlow Cond. 700 28px
│                                        │
```

Estilo, tal cual sale de la escala de §2.3 (fila «Antetítulo (eyebrow)» — y ahí
**se queda en 11px** tras la revisión de A-16, ver §2.5), sin
inventar nada: **Inter 600, 0.6875rem (11px), `uppercase`, tracking +0.08em,
line-height 1.1**, color `text-bloque-{a|b|c|d}` vía `CLASES_BLOQUE`, y `mb-1.5`
de separación con el `h1`.

El rótulo **sí va en el color del bloque**, y eso es deliberado: así el mismo
elemento lleva el texto y el color, y la redundancia de §1.2 queda en un solo
sitio en vez de repartida. Está medido: bloques como texto sobre `background` dan
**4.85:1 en el peor caso (C)** y 6.69:1 en oscuro — AA para texto normal, que es
el umbral que aplica a 11px (§1.3).

#### De quién es la responsabilidad

**De la página, no del encabezado.** Se implementa una sola vez como componente
compartido para que ninguna pantalla lo reinvente:

| | |
|---|---|
| Componente | `RotuloBloque` |
| Archivo | `src/components/layout/rotulo-bloque.tsx` |
| Frontera | **Server Component.** Sin `"use client"`, sin estado, sin `usePathname` |
| Props | `{ bloque: BloqueId }` |
| Marcado | un `<p>`, **no un encabezado**: no entra en la jerarquía de `h1`–`h3` |
| Se anuncia | **sí.** Nunca `aria-hidden`: es el portador no-cromático de la información. Que el riel también lo diga en su `aria-label` es redundancia buscada, no duplicación que haya que suprimir |

**Por qué la página y no `encabezado.tsx`, habiendo un encabezado común.** Tres
razones, en orden de peso:

1. **La página tiene el dato; el encabezado tendría que adivinarlo.** Una ruta de
   módulo ya resolvió su `Modulo` desde `params` y conoce su `bloque` con
   certeza. `encabezado.tsx` no recibe props y en App Router un Server Component
   no puede leer la ruta: tendría que pasar a cliente y usar `usePathname`, o sea
   **deducir por heurística un dato que la página tiene exacto.**
2. **Cuesta una regresión de arquitectura.** `encabezado.tsx` es hoy Server
   Component, y es un alta explícita a la lista cerrada de §10.3 aprobada en
   ADR-009 precisamente por serlo. Pasarlo a cliente para poner un rótulo va
   contra §10.2 (Server por defecto) y añade una cuarta alta a esa lista, a cambio
   de nada: `riel-bloques.tsx` ya es cliente y ya lleva el bloque en su
   `aria-label`.
3. **Pertenece al título, no al armazón.** El rótulo es el antetítulo del `h1`:
   ahí es donde el ojo ya está. En el encabezado sticky quedaría separado del
   título que califica, compitiendo con la marca y gastando alto vertical
   permanente en una pantalla de 375 px.

#### Qué pasa en las rutas sin bloque en contexto

**No se pone nada.** Sin marcador de posición, sin `GLOBAL`, sin rótulo vacío que
reserve alto. El riel ya dice lo suyo (cuatro segmentos al 25 % y
`aria-label` «No estás dentro de un bloque»), y un rótulo genérico en las rutas
más visitadas sería ruido.

| Ruta | Rótulo | Por qué |
|---|---|---|
| `/bloques/[bloqueId]` | ✅ | el bloque **es** la pantalla |
| `/modulos/[slug]` y sus 3 etapas (`tarjetas`, `practica`, `quiz`) | ✅ | `modulo.bloque` |
| `/simulacros/bloque/[bloqueId]` | ✅ | un solo bloque evaluado |
| `/`, `/repaso`, `/simulacros`, `/glosario`, `/ajustes`, `/plan`, `/progreso`, `/herramientas`, `/ultima-noche`, `/diagnostico`, `/simulacros/final`, 404, `error.tsx` | ❌ | ningún bloque, o los cuatro a la vez |
| `/resultados/[intentoId]` | **depende del `ambito` del intento** | ✅ si el intento es de tipo `bloque` o `quiz` (un solo bloque); ❌ si es `final` o `diagnostico`, que abarcan los cuatro |

**Criterio general, para cualquier ruta futura:** el rótulo aparece si y solo si
hay **exactamente un** bloque en contexto. Varios bloques a la vez ⇒ no hay rótulo,
porque no hay un color de bloque que acompañar.

### 2.5 Antetítulo o clave de campo — **cuál de los dos 11/12px aplica**

> Añadida el 2026-07-30. Resuelve **A-16** de la auditoría del Paso 7 y la
> observación heredada del Paso 5 sobre el pie. Sustituye a la antigua fila
> única «Eyebrow / etiqueta».

**El error no era el tamaño: era la fila.** La partición nació con el `<dt>` de
`<AlertaContradiccion>`, que estaba en la fila «Eyebrow» —fila equivocada, no
tamaño equivocado—. **ADR-014 retiró ese componente y con él la ruta `/erratas`,
pero la partición se queda: la sostiene la ficha por fila de §3.2**, cuyo
`td::before` es una clave de campo con el mismo trabajo. Un antetítulo y una clave
de campo hacen cosas distintas:

| | **Antetítulo (11px)** | **Clave de campo (12px)** |
|---|---|---|
| Qué es | rótulo que **precede a un título** y lo califica | **clave que nombra el campo que le sigue** |
| Cómo se lee | una vez, al entrar a la pantalla. Orienta y se retira | **muchas veces**: el lector salta entre claves comparando campos |
| Cuántas hay | una por pantalla | **5 por ficha × 4 fichas** en una sola tabla de C5, y la misma tabla en cada módulo |
| Si desaparece | se pierde orientación | **se pierde la estructura**: la ficha deja de ser legible |

Una pieza que se relee todo el rato no puede ir en el escalón más pequeño de la
escala. El antetítulo sí: se lee una vez y su tamaño pequeño es justamente lo que
le dice al ojo «esto no es el título».

**Quién es cuál, hoy:**

| Pieza | Fila | Por qué |
|---|---|---|
| `td::before` de la **ficha por fila** de §3.2 (la vista de tabla bajo `sm`) | **Clave de campo · 12px** | es la estructura de la ficha, releída en cada fila y en cada módulo. **Desde ADR-014 es el único consumidor de esta fila** |
| `RotuloBloque` (§2.4) | Antetítulo · 11px | se lee al entrar; el `h1` de 28px que va debajo lo respalda de inmediato |
| Título de `<TablaClave>` | Antetítulo · 11px | antetítulo de la tabla, leído una vez antes de bajar a los datos |
| `etiqueta` de `<Dato>` | Antetítulo · 11px | va **en línea** dentro de la prosa de 17px y pegada a su valor: los dos se leen de una sola mirada. Subirla engorda el chip y descuadra el ritmo de línea del párrafo |
| Etiqueta de la barra inferior | Antetítulo · 11px | acompaña a un icono en posición fija y permanente. Además, subirla **agravaría A-01** (a 200 % de zoom la barra ya pierde el quinto destino) |
| Antetítulos de `/`, `/modulos`, `error.tsx`, `not-found.tsx` | Antetítulo · 11px | los cuatro son antetítulos de un `h1` |

**Criterio para cualquier etiqueta futura:** ¿el lector vuelve a ella mientras
lee? Si vuelve, es clave de campo (12px). Si la lee una vez y sigue, es
antetítulo (11px).

#### Las versalitas se quedan

Se descarta quitarles el `uppercase` a las claves, que era la opción más barata
del auditor. Las mayúsculas cuestan perfil de palabra —cierto— pero aquí ese
coste se paga **una sola vez**: las claves de una tabla son siempre las mismas, en
el mismo orden, en todas sus fichas. A partir de la segunda ficha el lector ya
no las lee, las reconoce por forma y posición, y es justamente el bloque de
versalitas lo que le permite saltar directo al campo que busca sin leer. En prosa
corrida el perfil de palabra importa en cada palabra; en un marco fijo y
repetido, no. Se conserva el `uppercase` y la legibilidad se compra con el
tamaño, que es donde el problema estaba de verdad.

#### El pie sube a 13px y la excepción desaparece

El pie de atribución iba a 12px por la excepción que la regla 4 se concedía a sí
misma. Se elimina, por tres razones:

1. **El pie es lectura, no etiqueta.** Es un párrafo de texto corrido, el único
   que quedaba por debajo del listón. La regla decía «nada de lectura bajo 13px»
   y acto seguido exceptuaba el único caso que la violaba.
2. **«Es legal, luego va pequeño» es inercia, no argumento.** ADR-001 convierte
   esa atribución en requisito de licencia: si algo, eso pide que se lea mejor,
   no peor.
3. **Cuesta cero.** El contraste ya sobra (5.49 claro · 6.18 oscuro) y el pie
   vive al final de la página, debajo del doblez, sin nada que descuadrar.

Tras el cambio, la fila «Pie legal» solo se distingue de «Auxiliar / metadato»
por su `line-height` de 1.6, que se conserva: es un bloque legal denso y ese aire
extra es lo que lo hace recorrible.

⚠ **No se toca el `py-3.5` del enlace de licencia.** Es la solución de A-05/A-08:
padding vertical sobre una caja `inline`, que agranda el área táctil sin alterar
la caja de línea. Con 13px el enlace pasa de 43 a **44,0 px exactos** de alto
(medido en navegador por el `accessibility-auditor` el 2026-07-30; la
estimación previa de ~49 px era incorrecta). Ese número cierra el «1 px corto»
que A-05 y A-08 habían anotado como trade-off consciente: el enlace de la
licencia **cumple el piso de 44 px exacto**, no por debajo y no por encima.

**La excepción quedó retirada en §3 el 2026-07-30.** El piso táctil vuelve a no
tener más válvula que `data-compacto` (D-7). Cualquier documento que todavía
describa el enlace del pie como excepción al piso está desactualizado: la cifra
que manda es la medida, 44,0 px.

---

## 3. Espaciado, radio y superficie

Se conserva §11.5 completo. Aquí queda consolidado para no tener que volver al
blueprint.

| Regla | Valor |
|---|---|
| Ancho de contenido | `max-w-3xl` (768px). App de leer y responder, no tablero ancho. **Dentro de esa columna hay dos medidas — ver §3.1.** |
| Padding horizontal de página | `px-4` móvil · `px-6` desde `sm` |
| Padding de tarjeta | `p-4` móvil · `p-6` desde `sm` |
| Separación entre tarjetas | `gap-3` móvil · `gap-4` desde `sm` |
| Ritmo vertical | múltiplos de 4px. Entre secciones `space-y-6`; dentro de una sección `space-y-3` |
| Radio base | `--radius: 0.625rem` → `sm` 6px · `md` 8px · `lg` 10px · `xl` 14px |
| Radio por elemento | tarjetas `rounded-lg` · botones y opciones `rounded-md` · insignias `rounded-full` · **bandas del instrumento de umbral `rounded-none`** |
| Sombra | `shadow-sm` en tarjetas. Los botones son planos con borde. Cero sombras de color. |
| Táctil | opciones de ítem `min-h-[52px]` · resto de interactivos **44px, sin excepciones** (forzado en `@layer base`). Única válvula: `data-compacto` (D-7, al final de esta sección) |
| Barra inferior | `h-16` + `env(safe-area-inset-bottom)` |
| Transiciones | ≤200ms. Por defecto 150ms `ease-out`. Solo `color`, `background-color`, `border-color`, `opacity`, `transform`. **Nunca `all`.** |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce)` anula duraciones a 0.01ms (§11.3) |

> **El enlace de licencia del pie deja de ser una excepción al piso táctil —
> 2026-07-30.** Mientras el pie iba a 12px, ese enlace medía **43 px** y esta
> sección le concedía un pase por ser una caja `inline` con `py-3.5`. Con el pie
> a 13px (§2.5) el `accessibility-auditor` lo midió en **44,0 px exactos**:
> cumple el piso por derecho propio y **la excepción se retira**, no se renueva.
> Nada que aplicar en código — el `py-3.5` de `pie.tsx` **no se toca**, es
> justamente lo que produce los 44,0 px. Lo que cambia es la regla: a partir de
> aquí, **ningún elemento interactivo de esta app baja de 44 px salvo con
> `data-compacto`**, y `data-compacto` no se usa en el pie.

### 3.1 Dos medidas dentro de la columna — **lectura y consulta**

> Añadida el 2026-07-30. Resuelve **A-15** de la auditoría del Paso 7.

**La columna de 768px sigue siendo la columna. Lo que se estrecha es el texto que
se lee renglón a renglón.**

| | **Medida de lectura** | **Medida de consulta** |
|---|---|---|
| Ancho | **≈75 caracteres por línea**, que en píxeles son **38rem · 608px** en las superficies de **17px** y **36rem · 576px** en las de **15px** | la columna entera · **720px** |
| Qué va aquí | 38rem: párrafos, listas, `h2`, `h3`, `hr`. 36rem: el recuadro de prosa, hoy solo `<Ojo>` | tablas, `<TablaClave>`, `<Formula>` |
| Cómo se consume | se recorre línea tras línea | se **busca** un dato dentro de una retícula |

#### La medida se define en caracteres, no en píxeles

> ⚠ **Corregido el 2026-07-30, reverificación del Paso 7.** La primera versión de
> §3.1 fijó un único tope de 38rem y afirmó que dejaba «cinco caracteres de
> margen» bajo el 80 de 1.4.8. **Esa afirmación era cierta solo para la teoría de
> 17px.** El auditor remidió con `canvas.measureText` sobre el texto real y
> encontró que las tres superficies de 15px de entonces —`<Ojo>`, la alerta y la
> ficha de `/erratas`— se quedaban en **79,2–79,6 cpl**: el margen ahí era de
> **0,4 a 0,8 caracteres**, no de cinco. La estimación original usó 7,17px de
> ancho de carácter para todas; los valores reales van de **6,81 a 7,27px** según
> el texto. *(De aquellas tres superficies **ADR-014 solo deja en pie el `<Ojo>`**;
> la medición se conserva porque es la que fijó el número.)*

**La causa es aritmética, y explica por qué un solo número en píxeles no puede
servir para dos cuerpos.** Un recuadro tiene padding (y `<Ojo>`, además, la
columna del icono), así que su caja de texto baja de 608 a 544–576px — un 6 a 11 %
menos. Pero el carácter de 15px es un **17 % más estrecho** que el de 17px. El
ancho baja menos de lo que el carácter encoge, así que entran *más* caracteres,
no menos. Capar las dos cosas al mismo valor en píxeles produce, necesariamente,
dos medidas distintas en caracteres.

**Se corrige subiendo la definición un nivel: la medida es ≈75 cpl y el píxel es
su implementación.** Un valor por cuerpo, calculado con el ancho de carácter
medido de cada superficie:

| Superficie | Cuerpo | Ancho de carácter medido | Caja de texto | **cpl** |
|---|---|---|---|---|
| Párrafo de teoría · tope 38rem | 17px | 8,17px | 608px | **74,4** |
| `<Ojo>` · tope **36rem** | 15px | 6,86px | 512px (576 − 32 de `p-4` − 32 de icono y `gap`) | **74,6** |
| Tabla · `<TablaClave>` · `<Formula>` | 15px | — | 720px | **medida de consulta — no se capa** |

Las dos caen entre **74,4 y 74,6 cpl**: dentro de la banda clásica de lectura
sostenida (45–75) y con **cinco caracteres de margen reales** bajo el 80 de 1.4.8,
en las dos superficies y no solo en una.

> Las otras dos superficies de 15px que esta tabla medía —el `<dd>` de la alerta
> (74,8) y la ficha de `/erratas` (75,0)— **desaparecen con ADR-014**. Salían de la
> misma banda y no movían el número: el tope de 36rem no depende de ellas.

**Por qué no se acepta el 0,4 de margen, que era la otra salida legítima.**
Pasaban el 80 y 1.4.8 es AAA, no AA: aceptarlo era defendible. Se descarta por una
razón concreta y con cifra: **el margen no es para el texto de hoy, es para el de
los pasos 15–17.** Los recuadros de C5 son pocos; los 29 módulos meterán del orden
de 150. Tomando el ancho de carácter **mínimo** que el auditor midió (6,81px), un
texto con más caracteres estrechos de la media empuja la línea hasta cruzar el 80
sin que nadie lo note, porque nadie va a remedir 150 recuadros —el peor caso que
decidió el número se midió sobre la caja de 576px de la alerta: `576 ÷ 6,81 =
84,6 cpl`—. **Con 36rem el peor caso del `<Ojo>` da 75,2 cpl.** Es un tope que se
sostiene solo mientras el contenido crece; el de 38rem dependía de que el texto
futuro se pareciera al de C5.

**Se descarta bajar a 34rem (544px)**, que era el número «seguro»: deja el
recuadro en ~70 cpl, por debajo de la teoría, y crea una diferencia de 64px
entre el párrafo y el recuadro que sí se ve como un escalón. 36rem se separa solo
**32px** de la prosa: a esa distancia el recuadro se lee alineado con el texto, no
indentado.

**A 375px no cambia absolutamente nada, ni con 38rem ni con 36rem**: la caja ya
mide 343px (42,2 cpl, que es correcto). Los topes solo empiezan a morder desde
~656px y ~624px de viewport respectivamente. **Dos reglas, ningún breakpoint.**

El argumento que manda no es el número de la AAA de todos modos: es que este es el
público que lee de noche, con presbicia, después de trabajar.

⚠ **`max-w-[65ch]` NO sirve en este proyecto, y hay que decirlo antes de que
alguien lo «arregle».** El `body` lleva `font-variant-numeric: tabular-nums`
(§11.3, deliberado por los rangos numéricos), que ensancha el glifo «0» de Inter
hasta **11px** a 17px de cuerpo. Medido: `65ch = 715px ≈ 87,9 cpl`,
prácticamente los 720 de ahora. **La unidad `ch` miente aquí. Se capa en `rem`.**

#### El interlineado de 1.65 se conserva, y no era el arreglo

Un interlineado generoso reduce el **error de retorno de línea** —saltarse una
línea al volver al margen izquierdo—, no la **distancia de barrido**, que es lo
que cansa a 88 caracteres. Con presbicia y de noche el problema dominante es el
barrido. 1.65 ayuda y se queda; el tope es lo que arregla el problema.

#### Que las tablas sobresalgan es deliberado

Las tablas, `<TablaClave>` y `<Formula>` quedan **112px más anchas que el texto**
y sobresalen por la derecha. Es una decisión, no un descuido, por tres razones en
orden de peso:

1. **Estrechar la tabla crearía un problema de accesibilidad donde hoy no lo
   hay.** Una tabla de 5 columnas de la Cartilla 3 empezaría a desplazarse
   horizontalmente en viewports donde hoy entra entera — es decir, A-11 (la tabla
   se corta sin señal) aparecería en escritorio, que es justo donde no aparece.
   Regresión real a cambio de nada.
2. **`<Formula>` es `whitespace-nowrap` con `overflow-x-auto`.** Estrecharla la
   hace desplazarse antes, y una fórmula partida o desplazada no se lee.
3. **El saliente es señal.** Un bloque más ancho que la columna de texto dice,
   solo por su forma, «esto no es prosa, es un dato que se consulta». Con esta
   regla el saliente pasa a significar **exactamente una cosa**, porque el
   recuadro de prosa no sobresale.

Ese último punto es el cambio respecto a lo que proponía el auditor, que dejaba
los recuadros a 720px junto con las tablas. **Se corrige: el recuadro contiene
frases, no datos, y a 720px su texto interior corre a 91–96 cpl, peor que la
propia teoría.** Va a medida de lectura.

⚠ **Todo lo anterior habla de `sm` para arriba.** Por debajo de 640px la tabla
ancha deja de ser una tabla: se apila en fichas. Es §3.2, y es la decisión que
resuelve de verdad A-11.

#### Dónde se escribe — **no hay clase de Tailwind, y es correcto**

Los elementos los emite MDX, no un JSX que se pueda decorar. La regla vive donde
vive el resto de `.prose-idoneo`: en `globals.css`, dentro del `@layer components`
que ya existe, **inmediatamente después de la regla base `.prose-idoneo`**:

```css
  /* Medida de lectura, superficies de 17px (DISENO.md §3.1). Solo hijos
     DIRECTOS: los <p> que van dentro de un <Ojo> no se capan por su cuenta — el
     <aside> ya viene capado y capar también su interior dejaría un hueco muerto
     dentro del marco. Tablas, <TablaClave> (div) y
     <Formula> (figure) quedan fuera de la lista a propósito: §3.1, medida de
     consulta. `ch` no sirve aquí: tabular-nums lo infla a ~88 cpl. */
  .prose-idoneo > :is(p, ul, ol, h2, h3, hr) {
    max-width: 38rem;
  }

  /* Medida de lectura, superficies de 15px: el recuadro de prosa. Hoy el único
     <aside> hijo directo de .prose-idoneo es <Ojo>. 36rem deja su TEXTO INTERIOR
     —la caja menos el padding y menos la columna del icono— en 74,6 cpl, los
     mismos 75 que la teoría. Con 38rem caía en 79,3: pasaba el 80 de 1.4.8 con
     0,4 caracteres de margen, que no es margen. Va como regla aparte y NO dentro
     del :is() de arriba, para que la diferencia sea explícita y no dependa del
     orden de dos selectores empatados en especificidad. */
  .prose-idoneo > aside {
    max-width: 36rem;
  }
```

El selector de **hijo directo** hace todo el trabajo de alcance: no hay que
exceptuar nada a mano, y si mañana entra un componente MDX nuevo, entra por
defecto a medida de consulta —que es lo conservador— hasta que alguien decida lo
contrario.

`hr` va en la lista aunque el auditor no lo pusiera: una regla horizontal a 720px
bajo un texto de 608px sobresaldría por la derecha sin significar nada.

**Toda la regla vive en CSS, en un solo archivo.** Hasta ADR-014 había además dos
clases en `src/app/erratas/page.tsx` —esa ruta ya no existe—: **una página que no
pase por `.prose-idoneo` y presente prosa seguida se capa en la página**, con
38rem si su cuerpo es de 17px y 36rem si es de 15px. Hoy no hay ninguna.

| Archivo | Qué | Cómo queda |
|---|---|---|
| `src/app/globals.css` | dos reglas en `@layer components`, tras `.prose-idoneo` | el bloque CSS de arriba |

El `<h1>` de la página de módulo, el `RotuloBloque` y los objetivos quedan fuera:
viven fuera de `.prose-idoneo` y son piezas cortas que nunca alcanzan los 608px.
No se les pone tope para no fabricar una alineación que en la práctica no se ve.

**Prohibido a partir de aquí:**

| Prohibido | Por qué |
|---|---|
| `max-w-[65ch]` o cualquier tope en `ch` para texto | `tabular-nums` infla `1ch` a 11px: 65ch ≈ 88 cpl, no arregla nada |
| Llevar tablas o `<Formula>` a medida de lectura | adelanta el desplazamiento horizontal y con él A-11 |
| Centrar la columna de texto dentro de la de consulta (`mx-auto`) | el borde izquierdo del texto es el ancla del retorno de línea; si baila entre bloques, se pierde el beneficio que el tope venía a dar |
| Bajar el `line-height` de 1.65 «ahora que la línea es corta» | son dos mitigaciones de problemas distintos: barrido y retorno de línea |

**Consecuencia conocida del piso táctil de 44px.** La regla de §11.3 aplica
`min-height: 44px` a `button, [role="button"], a[href], input, select, textarea`
en `@layer base`. `min-height` gana sobre `height`, así que **anula los tamaños
compactos de shadcn**: `Button size="sm"` (`h-8`), `SelectTrigger size="sm"`,
`TabsTrigger`, el botón de cierre del `Dialog`. En móvil eso es correcto y
deseable. **Pero rompe el `panel-navegacion` del Paso 11**, una cuadrícula de 100
botones para navegar entre ítems del simulacro: a 44px cada celda, no cabe en
pantalla. Y el `TabsTrigger` de `/herramientas` (5 pestañas) queda muy grueso.

Sobre los enlaces en línea la regla es inocua: `min-height` no aplica a cajas
`inline`, así que un `<a>` dentro de un párrafo de teoría no se deforma. Solo
afecta a los que se ponen `block` o `flex`.

⚠ **DESVIACIÓN D-7, a decidir ahora porque el Paso 11 depende de ella.** Añadir
una válvula de escape al selector, sin relajar el piso por defecto:

```
button:not([data-compacto]), [role='button']:not([data-compacto]),
a[href]:not([data-compacto]), input, select, textarea { min-height: 44px; }
```

`data-compacto` se usa **solo** en la cuadrícula de navegación del simulacro y en
los `TabsTrigger`, y en esos casos el objetivo táctil se garantiza con
`gap` suficiente entre celdas. Si no se aprueba, el Paso 11 tendrá que resolverlo
con `!important` o con un `<div role="button">` sin `role`, que es peor.

### 3.2 La tabla ancha en móvil — **una ficha por fila**

> Añadida el 2026-07-30, reverificación del Paso 7. Cierra **A-11** de verdad:
> el degradado avisaba de que la tabla seguía, pero **no devolvía el dato**.

#### El problema, con su cifra

La tabla de zonas de C5 a 375px mide **518px** de contenido en un hueco de
**341px**: oculta **177px, el 34 % de su ancho**. El corte no cae entre columnas,
cae a mitad de celda, así que **en pantalla se lee «95 % / 5» donde el valor es
«95 % / 5 %»**, y la quinta columna entera no existe hasta que el usuario se
desplaza.

Eso no incumple ninguna norma —1.4.10 exime expresamente a las tablas de datos— y
aun así es el peor defecto abierto del Paso 7, por tres hechos que se acumulan:

1. **Es la tabla más consultada de la app.** La teoría la llama, con esas
   palabras, «la tabla que hay que saberse», y es contenido del módulo piloto que
   §22 regla 10 designa plantilla de oro: los **28 módulos restantes** replican su
   forma.
2. **El examen pregunta esos valores con número exacto.** R1 65–75 %, R2 75–85 %
   del VO₂máx y 80–90 % de la FCmáx, participaciones 99/1, 95/5, 65/35.
3. **El truncamiento es silencioso.** «95 % / 5» no parece un dato cortado: parece
   un dato. El usuario no sabe que le falta algo, así que no se desplaza. Memoriza
   un valor falso y falla la pregunta.

Un aviso perimetral no puede resolver el punto 3, porque el problema no es que el
usuario ignore que la tabla sigue: es que **cree que ya leyó el valor**.

#### La decisión

> **Por debajo de `sm` (640px), toda tabla de 4 columnas o más deja de
> presentarse como retícula y se presenta como una ficha por fila: cada fila del
> `<tbody>` es un bloque, y cada celda es una pareja clave-valor con el
> encabezado de su columna encima.** De `sm` para arriba no cambia
> absolutamente nada.

```
┌────────────────────────────────────────┐  375 px
│  ZONAS DE ENTRENAMIENTO — LA TABLA…    │  título de <TablaClave>, 11px
│ ┌────────────────────────────────────┐ │  .marco-tabla
│ │ ZONA                               │ │  clave, Inter 600 12px versalitas
│ │ R2 · VT2                           │ │  valor 1.º, Barlow Cond. 600 18px
│ │                                    │ │
│ │ % FCMÁX / VO₂MÁX                   │ │
│ │ 75–85 % VO₂máx · 80–90 % FCmáx     │ │  valor, 15px — COMPLETO
│ │                                    │ │
│ │ OBJETIVO                           │ │
│ │ Oxidación del glucógeno, ↑ volemia,│ │
│ │ ↑ volumen sistólico… Contiene el   │ │
│ │ MLSS                               │ │
│ │                                    │ │
│ │ AERÓBICO / ANAERÓBICO              │ │
│ │ 95 % / 5 %                         │ │  ← el dato que hoy se pierde
│ │                                    │ │
│ │ SUSTRATO DOMINANTE                 │ │
│ │ Casi exclusivamente hidratos       │ │  ← la columna que hoy no existe
│ ├────────────────────────────────────┤ │  1px --border entre fichas
│ │ ZONA                               │ │
│ │ R3 / R3+                           │ │
│ …                                      │
```

**Cuatro razones, en orden de peso:**

1. **Restituye el dato, que era el encargo.** Cero desplazamiento horizontal,
   cero truncamiento, cero columna invisible. Es la única de las alternativas
   evaluadas que lo hace.
2. **Coincide con lo que la propia app ya enseña.** Las tarjetas C5-T02 a C5-T05
   están escritas exactamente así — «Zona R2 (VT2): porcentaje, objetivo y
   sustrato», una zona con todos sus campos — porque es la unidad en la que este
   contenido se memoriza. La vista móvil de la tabla deja de contradecir al mazo
   de tarjetas del mismo módulo.
3. **Escala sola a los 29 módulos.** La regla no menciona ninguna tabla concreta:
   se dispara por número de columnas. El autor de los pasos 15–17 escribe markdown
   normal y no se entera.
4. **Es la lectura que un pulgar puede hacer.** Vertical, en la dirección en la
   que ya se está desplazando la página, sin gesto lateral dentro de un contenedor
   dentro de una página.

**Qué se pierde, y por qué se acepta.** La ficha no permite comparar R1 con R2 de
un vistazo, que es lo que una retícula hace bien. Se acepta porque a 375px **esa
comparación hoy tampoco existe**: dos de las cinco columnas están fuera de
pantalla. Se cambia una comparación imaginaria por cuatro valores exactos. Y la
retícula no desaparece del producto: reaparece intacta desde 640px, que es donde
sí cabe.

#### El umbral: 4 columnas, y por qué no todas

`:has(thead th:nth-child(4))`. Una tabla de 2 o 3 columnas **cabe** a 375px —la de
modelos de distribución de C5 tiene 2— y ahí la retícula es mejor que la ficha:
compara sin coste. Apilarlas sería alargar la página a cambio de nada. El umbral
está en 4 porque cuatro columnas con el `padding` de §3.2 pasan de los 341px
disponibles en cuanto una celda lleva texto de frase.

CSS puede contar columnas; no puede medir si la tabla desborda. Contar es
determinista y se comporta igual en los 29 módulos, que es lo que hace falta.

#### El degradado de A-11 se retira — **A-22, corrección de esta sección**

> Esta subsección decía, hasta el 2026-07-30, que por debajo de `sm` el degradado
> se apagaba y **de 640px para arriba se conservaba tal cual «porque una tabla de
> 6 columnas todavía puede desbordar a 700px»**. El `accessibility-auditor` midió
> esa premisa y **no se sostiene con este contenido**. Se retira el degradado
> **entero**, en los dos temas y en todos los anchos.

**La premisa era una suposición; el barrido, un hecho.** Las cuatro tablas del
fixture —incluida una de **7 columnas**— en ocho anchos (640 · 660 · 680 · 700 ·
720 · 768 · 900 · 1280px): **cero desbordamiento**. Y no es suerte del contenido,
es estructura: la tabla lleva `width: 100%` con `table-layout: auto`, así que las
celdas **reparten y envuelven** en vez de desbordar. Para desbordar haría falta un
`min-content` mayor que la columna: una cadena sin puntos de corte.

**Y no solo arriba: tampoco abajo.** El apagado estaba atado a
`:has(thead th:nth-child(4))`, así que las tablas de 2 y 3 columnas conservaban el
degradado también a 375px. Están medidas en el mismo informe: a 375px siguen en
retícula y **ninguna desborda** —es exactamente lo que el umbral de 4 columnas
promete—. También ahí el degradado señalaba un desplazamiento que no existe.

Los dos números que cierran la decisión:

| | Beneficio | Coste |
|---|---|---|
| **≥ 640px** | ninguno medible: 0 desbordes en 8 anchos, 7 columnas incluidas | **49 incompletas** de axe a 1280px |
| **< 640px, tablas de 2 y 3 col.** | ninguno medible: 0 desbordes a 375px | **24 incompletas** de axe a 375px (12 + 12) |
| **< 640px, tablas de 4+ col.** | ninguno: ya es ficha, no hay nada que desplazar | 0 — ya estaba apagado |

**No queda ningún viewport donde el degradado ayude.** Conservarlo «por si acaso»
sería CSS muerto que además **ciega la única comprobación automática de contraste
que tenemos sobre tablas**, y los pasos 15–17 van a escribir 28 módulos llenos de
tablas. Un recurso sin escenario donde ayude no se conserva: se retira.
Retirado el degradado, `/modulos` pasa de **49 → 0** incompletas a 1280px
y de **25 → 1** a 375px (la que queda es la del pie, ajena a esto).

**Qué se pierde, y por qué es aceptable.** Si algún día una celda lleva una cadena
inquebrable —una URL, una fórmula sin espacios—, esa tabla desbordará y ya no
habrá señal visual de que continúa. Se acepta por tres razones, y la tercera lo
convierte casi en teórico:

1. **La afordancia perimetral nunca fue la que arreglaba el problema.** Es la
   tesis de esta misma sección: el degradado avisaba de que la tabla seguía y **no
   restituía el dato**. Lo que cerró A-11 fue la ficha, no la sombra.
2. **El acceso no depende del degradado.** El envoltorio conserva
   `overflow-x: auto`, `tabIndex={0}`, `role="group"` y su `aria-labelledby`
   (A-10, A-19). El contenido sigue siendo alcanzable con teclado, con puntero y
   con lector; lo que desaparece es un adorno que no señalaba nada.
3. **El caso residual se previene, no se señala.** Junto con la retirada,
   `.prose-idoneo table` estrena `overflow-wrap: anywhere`: una cadena
   inquebrable **envuelve** en vez de desbordar. Sobre el contenido actual es un
   no-op —todas las palabras ya caben, por eso el barrido dio cero— y sobre el
   contenido futuro elimina el escenario en lugar de avisar de él. Es la misma
   tesis de §3.2 aplicada al caso residual: **restituir el dato vale más que
   advertir de que falta.**

**Se declina, igual que antes, el complemento que proponía el auditor** —una línea
de ayuda fija dentro de `<TablaClave>` que dijera «Se desplaza en horizontal»—.
Con el degradado retirado sería falsa en todos los anchos, no solo en la ficha.

**Lo que hay que dejar escrito para quien venga después:** el contraste del texto
de tabla ya **no** es una medición manual pendiente. Con el degradado fuera, axe
lo evalúa solo, en los cuatro escenarios (2 temas × 2 anchos). Eso es justo la
cobertura que A-18 daba por perdida y la que los 28 módulos que faltan van a
necesitar.

**El CSS que queda, literal.** En `globals.css` desaparecen dos bloques enteros
—la regla base de `.prose-idoneo .tabla-desliz` pierde sus cinco declaraciones
`background-*` y la variante `.dark .prose-idoneo .tabla-desliz` se borra
completa— y el envoltorio se queda en esto:

```css
  .prose-idoneo .tabla-desliz {
    margin-block: 1.5rem;

    /* Red de seguridad, no afordancia. A-22 midió las cuatro tablas del fixture
       —la de 7 columnas incluida— en ocho anchos de 640 a 1280 px: ninguna
       desborda, porque `width: 100%` con `table-layout: auto` hace que las
       celdas repartan y envuelvan. Por eso aquí NO hay degradado: no señalaba
       nada y cegaba la medición de contraste de axe en toda tabla (49 celdas a
       1280 px). Se queda `overflow-x`: sostiene el `role="group"` enfocable de
       A-10/A-19 y cubre el caso residual. */
    overflow-x: auto;
  }
```

Y la tabla suma una línea, que es la que sustituye al degradado en su único caso
real:

```css
  .prose-idoneo table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9375rem;
    line-height: 1.45;
    /* A-22 · una cadena inquebrable ENVUELVE en vez de desbordar. Sobre el
       contenido actual no cambia un píxel —todas las palabras ya caben— y
       elimina el único escenario que el degradado decía cubrir. Es heredada:
       basta declararla aquí para que llegue a `th` y `td`. */
    overflow-wrap: anywhere;
  }
```

#### Tipografía de la ficha — todo sale de la escala de §2.3

| Pieza | Fila de §2.3 | Valor |
|---|---|---|
| Clave del campo | **Clave de campo** | Inter 600 · 12px · versalitas · tracking +0.08em · `muted-foreground` |
| Valor de la primera celda | **`h3`** | Barlow Condensed 600 · 18px · line-height 1.25 |
| Valor del resto de celdas | **Cuerpo de interfaz** | Inter 400 · 15px (el que la tabla ya usa) |

La clave es **clave de campo (12px) y no antetítulo (11px)**, y el criterio es el
de §2.5 aplicado literalmente: *¿el lector vuelve a ella mientras lee?* Vuelve, y
mucho — 5 claves × 4 fichas en una sola tabla, y la misma tabla en cada módulo.
**Desde ADR-014 esta ficha es el único consumidor de la fila «Clave de campo»**, y
es la que la sostiene: sin ella, §2.5 se quedaría sin razón para existir.

El primer valor sube a la fila `h3` porque **es la identidad de la ficha**: dice de
qué zona se está hablando y hay que poder saltar de ficha en ficha por él. 18px es
además el mínimo que §2.3 regla 1 le permite a Barlow Condensed, así que la
elección no abre ninguna excepción.

**Ningún color se mueve.** La clave usa `muted-foreground` sobre `background`, que
es un par ya verificado en §1.3 (grupo «texto normal», peor caso 4.93:1 — AA con
holgura para texto normal, que es el umbral que aplica a 12px). El filete entre
fichas usa `--border`, decorativo y exento de 1.4.11 por la misma nota de §1.3. No
hay contraste que recalcular.

#### Accesibilidad — dos cosas que hay que hacer bien o no hacerlo

1. **Los roles se escriben explícitamente en las seis piezas de la tabla.** Todo
   navegador retira la semántica de tabla del árbol de accesibilidad en cuanto el
   `display` deja de ser `table-*`: sin roles, la vista de ficha convertiría la
   tabla en un `generic` y tiraría por la borda **A-12** (`scope="col"`, 8 de 8) y
   la mitad de **A-10**. Con `role="table"`, `rowgroup`, `row`, `columnheader` y
   `cell` escritos, la semántica **deja de depender de la presentación** — que es
   más robusto que lo que hay hoy, no menos.
2. **El `<thead>` se oculta a la vista, nunca con `display: none`.** Es el origen
   de los `columnheader`; con `display:none` desaparecen del árbol. Se usa el
   recorte de 1px. El usuario de lector sigue teniendo la tabla completa; el
   usuario vidente ve la ficha.

**No se toca nada de lo que el auditor dejó cerrado:** ni el `tabIndex={0}`, ni el
`role="group"`, ni el `aria-label` del envoltorio, ni el `scope="col"`.

⚠ **Consecuencia que hay que anotar y que decide el auditor, no este documento.**
Por debajo de `sm` el envoltorio sigue siendo un `role="group"` enfocable
etiquetado «Tabla, desplazable en horizontal», y ahí ya no hay nada que desplazar.
No es un fallo —el grupo sigue nombrando correctamente lo que contiene— pero la
segunda mitad del nombre sobra en ese viewport. **Queda planteado, sin cambiarlo.**

#### El CSS exacto — `src/app/globals.css`

Va **dentro del `@layer components` que ya existe**, inmediatamente después de la
regla `.prose-idoneo tbody tr:last-child td`. Usa anidamiento CSS, que Tailwind v4
compila con Lightning CSS.

```css
  /* ── §3.2 · La tabla ancha se apila en ficha por debajo de `sm` ──────────
     Solo tablas de 4 columnas o más. Las de 2 y 3 caben a 375 px y se quedan
     como retícula, que es donde comparan mejor. El umbral se cuenta, no se
     mide: CSS sabe cuántas columnas hay y eso se comporta igual en los 29
     módulos. */
  @media (max-width: 39.9375rem) {
    .prose-idoneo .tabla-desliz:has(thead th:nth-child(4)) {
      /* Aquí iba `background-image: none`, para apagar el degradado de A-11.
         Sobra desde que A-22 lo retiró de la hoja entera: no hay degradado que
         apagar. `overflow-x: auto` se queda como está: quitarlo no aporta nada
         y el contenedor sigue siendo el mismo elemento que el teclado ya
         conoce. */

      & table {
        display: block;
        width: 100%;
      }

      /* El encabezado sigue en el árbol de accesibilidad: es el origen de los
         `columnheader` que A-12 dejó en 8 de 8. Se oculta a la vista, NUNCA
         con `display: none`, que sí los borraría. */
      & thead {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }

      & tbody {
        display: block;
      }

      /* Una fila = una ficha. El filete las separa; el marco de <TablaClave>
         ya pone el borde exterior y una tabla suelta no lo necesita. */
      & tbody tr {
        display: block;
        padding: 0.75rem;
        border-bottom: 1px solid var(--border);
      }

      & tbody tr:last-child {
        border-bottom: 0;
      }

      /* Una celda = clave arriba, valor debajo. */
      & tbody td {
        display: block;
        padding: 0;
        border: 0;
      }

      & tbody td + td {
        margin-top: 0.625rem;
      }

      /* La clave. Fila «Clave de campo» de §2.3, literal. El texto lo pone
         `componentes.tsx` en `--et-N` a partir del <thead>; si faltara, la
         ficha se degrada a valores sin clave — nunca a una ficha rota.
         `font-family` explícita: la primera celda pasa a Barlow Condensed y
         el ::before heredaría 12 px condensados, que viola §2.3 regla 1. */
      & tbody td::before {
        display: block;
        margin-bottom: 0.125rem;
        font-family: var(--font-sans);
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted-foreground);
        content: var(--et-1, "");
      }

      & tbody td:nth-child(2)::before { content: var(--et-2, ""); }
      & tbody td:nth-child(3)::before { content: var(--et-3, ""); }
      & tbody td:nth-child(4)::before { content: var(--et-4, ""); }
      & tbody td:nth-child(5)::before { content: var(--et-5, ""); }
      & tbody td:nth-child(6)::before { content: var(--et-6, ""); }
      & tbody td:nth-child(7)::before { content: var(--et-7, ""); }

      /* La primera celda es la identidad de la fila: hace de título de ficha.
         18 px es además el mínimo que §2.3 regla 1 permite a Barlow Condensed. */
      & tbody td:first-child {
        font-family: var(--font-titulo);
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.25;
      }
    }
  }
```

**Tope de 7 columnas** en las claves. Una tabla de 8 o más apilaría igual, pero de
la octava en adelante el valor saldría sin su clave. Ninguna tabla de las cartillas
llega a 6; si alguna llegara, se añade la línea que falte.

#### El mapeo exacto — `src/components/mdx/componentes.tsx`

Dos cosas: los **roles explícitos** en las seis piezas, y las claves de columna
como custom properties. Las claves se leen del `<thead>` **una sola vez, en el
servidor**, y viajan en `style` como `--et-1 … --et-N`. No hay atributo por celda,
no hay JS de cliente, no hay estado.

```tsx
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

/* Roles explícitos. NO son redundantes: la vista de ficha de DISENO.md §3.2
   cambia el `display` de `table`, `tbody`, `tr` y `td`, y todo navegador retira
   la semántica de tabla del árbol de accesibilidad en cuanto el display deja de
   ser `table-*`. Con los roles escritos, la semántica deja de depender de la
   presentación — y A-10 y A-12 siguen en pie en los dos viewports. */
const Thead = (props: React.ComponentProps<'thead'>) => <thead role="rowgroup" {...props} />;
const Tbody = (props: React.ComponentProps<'tbody'>) => <tbody role="rowgroup" {...props} />;
const Tr = (props: React.ComponentProps<'tr'>) => <tr role="row" {...props} />;
const Th = (props: React.ComponentProps<'th'>) => <th scope="col" role="columnheader" {...props} />;
const Td = (props: React.ComponentProps<'td'>) => <td role="cell" {...props} />;

/** Texto plano de un subárbol de React: un <th> puede traer <strong> o <code>. */
function textoPlano(nodo: ReactNode): string {
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  if (Array.isArray(nodo)) return nodo.map(textoPlano).join('');
  if (isValidElement(nodo)) return textoPlano((nodo.props as { children?: ReactNode }).children);
  return '';
}

function primerHijo(nodo: ReactNode, tipo: unknown): ReactElement | undefined {
  return Children.toArray(nodo).find(
    (hijo): hijo is ReactElement => isValidElement(hijo) && hijo.type === tipo,
  );
}

/** Los encabezados de columna, en orden. [] si la tabla no trae <thead>: en ese
 *  caso la ficha sale sin claves, que es una degradación, no una rotura. */
function clavesDeColumna(children: ReactNode): string[] {
  const thead = primerHijo(children, Thead);
  const fila = thead && primerHijo((thead.props as { children?: ReactNode }).children, Tr);
  if (!fila) return [];
  return Children.toArray((fila.props as { children?: ReactNode }).children)
    .filter((hijo): hijo is ReactElement => isValidElement(hijo) && hijo.type === Th)
    .map((th) => textoPlano((th.props as { children?: ReactNode }).children).trim());
}
```

Y el mapa. **El `table` de hoy solo gana `style` y `role`; el `th` de hoy pasa a
ser `Th`.** El resto son altas:

```tsx
export const componentesMdx: MDXComponents = {
  Dato,
  Formula,
  TablaClave,
  Ojo,

  table: ({ children, ...props }) => {
    // Las claves de columna viajan como custom properties; el CSS de §3.2 las
    // pinta con `content: var(--et-N)` en la vista de ficha. `JSON.stringify`
    // las entrega ya entrecomilladas y escapadas, que es lo que `content` pide.
    const estilo = Object.fromEntries(
      clavesDeColumna(children).map((clave, i) => [`--et-${i + 1}`, JSON.stringify(clave)]),
    ) as React.CSSProperties;

    return (
      <div
        className="tabla-desliz"
        tabIndex={0}
        role="group"
        aria-label="Tabla, desplazable en horizontal"
        style={estilo}
      >
        <table role="table" {...props}>
          {children}
        </table>
      </div>
    );
  },

  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
};
```

**Tres notas de aplicación:**

- `clavesDeColumna` compara `type` **por identidad** contra los componentes del
  propio archivo. Funciona porque son constantes de módulo y porque MDX sustituye
  el elemento por el componente mapeado. Si alguien quita `thead`, `tr` o `th` del
  mapa, la función devuelve `[]` y las fichas salen sin clave: falla visible y
  ruidosa, nunca silenciosa.
- `role="table"` sobre un `<table>` es redundante en la vista de retícula y ahí no
  molesta. `eslint-config-next` no activa `jsx-a11y/no-redundant-roles`, así que no
  hay aviso que silenciar.
- El `<span>` que algunas soluciones de este patrón inyectan por celda **no hace
  falta**: la clave la pone el pseudo-elemento. Que el lector de pantalla anuncie
  además el `::before` es aceptable y hasta útil, porque GFM no sabe expresar
  `<th scope="row">` (límite documentado en A-12) y esta es la única pista de fila
  que llega.

#### Prohibiciones que nacen de §3.2

| Prohibido | Por qué |
|---|---|
| Resolver el truncamiento pidiéndole al autor que escriba la tabla de otra forma | son 29 módulos escritos con markdown de GFM. Lo que no salga del CSS o del mapeo, no se aplica solo |
| `display: none` en el `<thead>` de la vista de ficha | borra los `columnheader` del árbol y deshace A-12 |
| Cambiar el `display` de la tabla **sin** escribir los roles | convierte la tabla en `generic` y deshace A-10 y A-12 |
| Apilar tablas de 2 o 3 columnas | caben a 375px, y en retícula comparan mejor. La ficha es la salida de un problema, no un estilo |
| Poner la clave del campo en 11px | es clave de campo, no antetítulo: se relee en cada ficha y en cada módulo (§2.5) |
| Poner el valor de la primera celda en Barlow Condensed **por debajo** de 18px | §2.3 regla 1, sin excepciones |
| **Volver a poner el degradado de A-11**, en cualquier ancho | A-22 midió 0 desbordes en 8 anchos de 640 a 1280px, la tabla de 7 columnas incluida, y 0 a 375px en las de 2 y 3. No señalaba nada y costaba 49 incompletas de axe. Si algún día una tabla desborda de verdad, el arreglo es que **quepa** (`overflow-wrap`, menos columnas), no volver a avisar de que no cabe |
| Quitar `overflow-x: auto` del envoltorio «ya que nada desborda» | es la red de seguridad del caso residual y el sostén del `role="group"` enfocable de A-10/A-19. Se queda pase lo que pase |
| Estrechar la tabla a la medida de lectura para «que quepa» | §3.1: adelanta el desbordamiento a viewports donde hoy entra entera |

---

## 4. El elemento firma — **el instrumento de umbral**

### 4.1 De dónde sale

El mundo del entrenador de resistencia ya tiene un instrumento que este público
lee sin esfuerzo: **la gráfica de zonas de entrenamiento**. Bandas de intensidad
creciente (R0 · R1/VT1 · R2/VT2 · R3), una **línea de umbral** que marca dónde
cambia el régimen, y la **posición del deportista** respecto a ella. Es contenido
literal del examen (módulo C5) y a la vez la metáfora exacta del progreso.

El hallazgo que lo convierte en sistema y no en adorno: **los cortes de veredicto
de `calcularVeredicto` (§7.5) ya son una gráfica de umbral.** Cuatro tramos, tres
umbrales:

```
 85 ─────────  Sólido        ← umbral secundario
 75 ═════════  Listo         ← EL umbral: la línea de aprobar
 60 ─────────  En camino     ← umbral secundario
  0            En riesgo
```

R0/R1/R2/R3 y riesgo/camino/listo/sólido son la misma forma. La app no necesita
inventar una metáfora: ya la tenía en la lógica.

**Por eso el progreso en Idóneo 2210 nunca se dibuja con una barra de progreso
genérica ni con un anillo.** Se dibuja con bandas, línea de umbral y marcador.

### 4.2 Gramática — las siete reglas

Cualquier agente que dibuje progreso, dominio o veredicto obedece estas siete.
Son suficientes para reproducir el instrumento sin haber visto un diseño.

1. **La banda es relleno puro. Jamás va tipografía encima de una banda.**
   No es preferencia estética, es un límite medido: en tema oscuro, `foreground`
   sobre la banda más intensa (85 % de opacidad) cae a **2.29:1**. Toda la
   tipografía vive en el **canalón** (izquierda, ancho fijo `w-10`, alineado a la
   derecha) o en el encabezado del componente, sobre `card` o `background`.
2. **Rampa de opacidad de banda: 12 % · 28 % · 55 % · 85 %**, de menor a mayor
   intensidad. Un solo matiz por instrumento. La rampa se aplica al color que el
   contexto ya tiene: el del bloque en un contexto de bloque, `--primary` en
   contexto global. **Nunca cuatro colores nuevos para las cuatro bandas** — el
   sistema ya gastó sus cuatro colores categóricos en los bloques.
3. **El umbral principal es una regla sólida de 2px en `foreground/70`**
   (6.47:1 claro · 7.39:1 oscuro), con su rótulo en el canalón: `75 · LISTO`.
   Los umbrales secundarios son de **1px punteados en `foreground/40`**. Un
   instrumento tiene un umbral protagonista; los demás son referencia.
4. **El marcador es una regla, no un punto.** 2px de ancho completo en
   `foreground`, más una lengüeta de 10px que entra en el canalón, y la cifra en
   JetBrains Mono 500 pegada a la lengüeta. **Nunca un punto, nunca una píldora,
   nunca un círculo.** Es la lectura de un calibre.
5. **Esquinas rectas.** `rounded-none` en las bandas y en los segmentos del riel.
   El radio de 10px del resto del sistema es para tarjetas y botones; el
   instrumento es un aparato de medida y no se redondea.
6. **Movimiento: uno o ninguno.** Al montar, solo el marcador se desplaza desde 0
   hasta su valor, **180ms `ease-out`, una vez**. Las bandas no aparecen
   escalonadas, el número no cuenta hacia arriba, no hay confeti nunca. Bajo
   `prefers-reduced-motion` el marcador aparece ya colocado.
7. **Accesible sin el dibujo.** El contenedor es `role="img"` con `aria-label`
   completo en palabras — «Puntaje 68 de 100. Veredicto: En camino. El umbral de
   aprobación está en 75.» — y la cifra y el veredicto están además como texto
   visible al lado. El instrumento acelera la lectura; no la monopoliza.

### 4.3 Manifestación 1 — el **riel de bloques** (esto es lo que construye el Paso 5)

Una tira horizontal a sangre completa, en el encabezado de **todas** las rutas.
`h-1` (4px), `rounded-none`, con `border-b border-border` debajo.

Cuatro segmentos, **de ancho proporcional a `pesoExamen`** de
`content/estructura.ts`: **A 20 % · B 22 % · C 33 % · D 25 %**. Esto es lo que
separa el riel de una barra de colores decorativa: su forma dice cuánto pesa cada
bloque en el examen, que es el dato más accionable que tiene un estudiante que
decide qué estudiar. El segmento de C es visiblemente el más ancho porque C es un
tercio del examen.

Estados:
- **Sin bloque en contexto** (`/`, `/repaso`, `/simulacros`, `/ajustes`, 404):
  los cuatro segmentos al 25 % de opacidad. Estructura sin énfasis.
- **Dentro de un bloque** (`/bloques/[id]`, `/modulos/[slug]`,
  `/simulacros/bloque/[id]`): el segmento del bloque activo al 100 %, los otros
  tres al 25 %.
- Entre segmentos, una separación de 1px del color de `background`, para que los
  límites se lean cuando dos segmentos vecinos están al mismo nivel.

El bloque activo se deriva de la ruta con un ayudante puro
`bloqueDeRuta(pathname): BloqueId | null` en `src/lib/utils.ts`, con test propio
(`/modulos/c5-…` → `'C'` por el prefijo del slug).

Accesibilidad: `role="img"` con
`aria-label="Peso de cada bloque en el examen: A 20 %, B 22 %, C 33 %, D 25 %.
Estás en el bloque C."`

⚠️ **El riel no lleva texto encima ni al lado, y nunca lo llevará.** Por la regla 1
de §4.2 la banda es relleno puro. Como consecuencia, **visualmente el riel
comunica el bloque solo por color**, y eso por sí solo violaría §1.2. Lo que cierra
ese hueco es el **rótulo de bloque de §2.4**, que lo pone la página encima de su
`h1` — no el encabezado. Un agente que sienta la tentación de meter el nombre del
bloque en el encabezado, junto al riel, está resolviendo un problema que §2.4 ya
resolvió mejor: leer §2.4 antes de tocar `encabezado.tsx`.

**Cuando llegue el dominio (Pasos 12 y 14)** el mismo componente crece sin
cambiar de forma: cada segmento se rellena de izquierda a derecha según el
dominio de ese bloque, y una vertical de 1px al 75 % del segmento marca el
umbral. De un vistazo: cuánto pesa, cómo vas, y si pasaste la línea.

### 4.4 Manifestación 2 — la **escala de umbral** (se especifica ahora, se construye en los Pasos 12 y 14)

Se documenta aquí para que las dos manifestaciones nazcan de la misma
especificación y no divergan.

Escala vertical 0–100, cuatro bandas apiladas, ~160px de alto a 375px:

```
      ┌──────────────────────────────┐
  100 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  Sólido    exito     /85
   85 ├──────────────────────────────┤  ┈┈ punteado 1px foreground/40
      │▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  Listo     primary   /55
   75 ╞══════════════════════════════╡  ══ SÓLIDO 2px foreground/70   ← el umbral
   68 ┼──────────────────────────────┤  ── marcador 2px foreground + lengüeta
      │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  En camino aviso     /28
   60 ├┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┤  ┈┈ punteado
      │                              │  En riesgo destructive /12
    0 └──────────────────────────────┘
      ↑ canalón w-10, JB Mono 14px, alineado a la derecha
```

- El color de cada banda es el `Veredicto.color` que ya devuelve
  `calcularVeredicto` (§7.5): `destructive`, `aviso`, `primary`, `exito`. Cero
  tokens nuevos.
- **Variante de quiz de módulo** (Paso 8): la misma escala con **un solo umbral**,
  en `UMBRAL_DOMINIO = 80`, rotulado `80 · DOMINADO`, y las bandas en el color del
  bloque del módulo, no en los del veredicto.
- **Honestidad, que es requisito del brief:** debajo de la escala va siempre
  `NOTA_VEREDICTO` de §7.5. La escala no puede insinuar que 75 es el corte
  oficial de COLEF.

### 4.5 Lo que el instrumento reemplaza — prohibiciones concretas

| En vez de… | Se usa… |
|---|---|
| Barra de progreso redondeada | Riel de bloques, o banda + umbral |
| Anillo / dona con % en el centro | Escala de umbral con marcador en el canalón |
| Cifra gigante con etiqueta pequeña como recurso de portada | El instrumento; la cifra es la lectura del marcador, no el protagonista |
| Píldora de fondo para el destino activo de la nav | Lengüeta de 4px del color del bloque sobre el destino activo |
| Barras de recharts con esquinas redondeadas y degradado | Barras rectas, un color por bloque, sin degradado |

### 4.6 La lengüeta de la nav y el contorno de foco — **fallo cosmético aceptado (A-04)**

> Decidido el 2026-07-30 sobre el hallazgo **A-04** de `ACCESIBILIDAD.md`
> (severidad Menor, decisión delegada a este documento).

**Veredicto: se acepta como está. No se cambia código.** La lengüeta del destino
activo se queda en `top-0`, con sus 4px, tocando el borde superior de la barra.

**Qué pasa.** La barra inferior fija mete el contorno de foco hacia dentro
(`focus-visible:-outline-offset-2`, la excepción autorizada en §1.3), así que sus
2px superiores se dibujan **encima** de la lengüeta de 4px. Y como `--ring` es el
mismo azul acero que `--primary`, ese borde superior mide **1.00:1** sobre
`bg-primary` (1.02–1.31:1 sobre los cuatro colores de bloque).

**Por qué se acepta.** No es un fallo AA, y el arreglo cuesta más de lo que
arregla:

- Los otros **tres lados van a 6.37:1 en claro y 7.15:1 en oscuro**, y el
  rectángulo de foco se lee sin ambigüedad — confirmado por captura en los dos
  temas. El indicador cumple 1.4.11 por sí solo.
- Solo ocurre en el destino que **ya está activo**, y solo mientras tiene el foco.
  En ese caso concreto el usuario ya sabe dónde está: `aria-current="page"`, el
  peso 600 y `text-foreground` lo marcan de forma redundante (§4.5).
- Las dos salidas que propone el auditor tienen coste permanente para todos los
  usuarios, a cambio de una muesca transitoria en un solo estado:
  - `top-[2px]` despega la lengüeta del borde de la barra. Deja de leerse como
    parte de la estructura de la barra y pasa a leerse como un guion flotante:
    peor en todas las pantallas, siempre.
  - `outline-offset-0` devuelve el contorno hacia fuera, que es exactamente lo que
    `-outline-offset-2` estaba evitando: se dibujaría por encima del contenido de
    la página, fuera de la barra.

**Cuándo hay que revisar esta decisión** — deja de ser aceptable si cambia
cualquiera de sus tres premisas:

1. la lengüeta pasa de 4px (a 6px o más, la muesca deja de ser un borde y se come
   un tercio del lado superior del contorno);
2. el contorno baja de 2px o cambia su `outline-offset` en la barra inferior;
3. la lengüeta se convierte en el **único** marcador del destino activo — es decir,
   si alguien quita `aria-current`, el peso 600 o `text-foreground`. Eso ya está
   prohibido por §1.2, pero conviene decirlo aquí.

---

## 5. Qué está prohibido en este proyecto, y por qué

### 5.1 Los tres *looks* por defecto de la IA — vetados los tres

Ninguno dice nada del entrenador deportivo colombiano; los tres aparecerían igual
en una app de recetas.

1. **Fondo crema ~`#F4F1EA` + serif de alto contraste + acento terracota
   ~`#D97757`.** Vetado. Nótese que `--bloque-d` es terracota (`#b54d26`): es
   admisible porque es **uno de cuatro colores categóricos con un trabajo
   asignado** (el bloque de Entrenamiento), no el acento de la marca. El acento de
   la marca es el azul acero. Y el fondo claro es azulado-neutro (`#fbfcfd`),
   nunca crema.
2. **Fondo casi negro con un único acento verde ácido o vermellón.** Vetado. El
   tema oscuro es azul-pizarra `#0c1117` y sostiene nueve colores con función
   semántica, no un acento único.
3. **Maquetación tipo periódico: filetes finos, radio 0, columnas densas.**
   Vetado. El radio base es 10px y el contenido es una columna de `max-w-3xl` con
   interlínea 1.65. **La única excepción deliberada es `rounded-none` en las
   bandas del instrumento de umbral**, porque un aparato de medida no se redondea.

### 5.2 Prohibiciones adicionales

| Prohibido | Por qué |
|---|---|
| Degradados de malla, glassmorfismo, `backdrop-blur` decorativo | No sale del mundo del entrenador y castiga el rendimiento en el gama media que es el dispositivo objetivo |
| Marcadores `01 / 02 / 03` | Solo se numera lo que **es** una secuencia real. Las 4 etapas del módulo y las 5 fases del entrenamiento sí lo son y se numeran; los bloques y los destinos de la nav no |
| Sombras de color, brillos, `box-shadow` con matiz | Solo `shadow-sm` neutra |
| Emoji en la interfaz | Público profesional adulto. Los iconos son de `lucide-react` |
| Confeti, celebraciones, animaciones de premio, rachas con fuego | El brief lo prohíbe: la app es honesta cuando el resultado es malo. Un 52 se informa, no se decora |
| `transition-all` | Anima propiedades de layout y produce tirones en gama media. Solo propiedades enumeradas |
| Animación de entrada en las gráficas del informe | El informe se lee, no se presenta |
| Cambiar el pie de atribución, acortar su texto o quitar el enlace a la licencia | Requisito de la licencia CC BY-NC-SA 4.0. Ver ADR-001 y §11.7 |
| Que el color de bloque sea el único portador de una información | Siempre acompañado del nombre o la letra del bloque. En una pantalla con bloque en contexto eso se cumple con el **rótulo de §2.4**, que es obligatorio, no opcional |
| Poner el nombre del bloque en el encabezado, o texto de cualquier clase sobre el riel | §2.4 lo resuelve en la página, encima del `h1`. Meterlo en `encabezado.tsx` obliga a pasarlo a cliente para adivinar por ruta un dato que la página ya tiene exacto |
| Borrar o mover la regla de foco de `globals.css` porque «shadcn ya lo hace» | shadcn **no lo hace**: esa regla es el único portador del foco en casi toda la app. Ver §1.3 y A-06 |
| Tipografía sobre una banda del instrumento de umbral | Medido: 2.29:1 en oscuro. Ver §4.2 regla 1 |
| Dependencias nuevas de UI: `@tailwindcss/typography`, librerías de animación, fuentes fuera de `next/font/google` | ADR-002 pinea el stack. La tipografía de MDX es `.prose-idoneo`, 30 líneas de CSS propio (§12.1) |
| Crear `tailwind.config.js` o `.ts` | Tailwind v4 no lo lee. §2.1 |

### 5.3 Voz

Español de Colombia. Voz activa. Las cosas se nombran por lo que el usuario
controla: «Guardar cambios», no «Enviar». Una acción conserva su nombre en todo
el flujo. **Los errores no se disculpan y nunca son vagos.** Una pantalla vacía es
una invitación a actuar. En una app cuyo progreso vive solo en `localStorage`,
todo mensaje de error o de pantalla vacía dice **explícitamente qué pasó con el
progreso** — es la primera pregunta del usuario y merece respuesta sin que la
haga.

---

## 6. El recuadro de contenido — `<Ojo>`

> Añadida el 2026-07-30 para el Paso 7 como «Los recuadros de contenido», con
> `<Ojo>` y `<AlertaContradiccion>` descritos **como par**.
>
> **Reescrita el 2026-07-30 · ADR-014.** El sistema de erratas se elimina de la
> app: se van `<AlertaContradiccion>`, la ruta `/erratas`, `content/erratas.ts` y
> los tipos `Errata` / `TipoErrata`. El criterio nuevo es que **el contenido
> enseña el dato verdadero, investigado y verificado**; las cartillas son la guía
> del temario, no la fuente de verdad de cada cifra, y **la app no documenta sus
> errores en ningún sitio**. ADR-014 supersede ADR-012 y ADR-013.
>
> **`<Ojo>` queda como el único recuadro de contenido de la teoría.** Los
> subapartados suprimidos (§6.2 y §6.4) **no se renumeran**: hay código y
> documentos que citan §6.1, §6.3, §6.6 y §6.7 por su número, igual que pasa con
> §5.1 y §5.2.

`<Ojo>` es **la voz del autor dentro de la teoría**: «no hay error, pero aquí te
vas a equivocar». Título fijo, prosa libre, y nada más.

### 6.1 La forma — barra lateral, nunca marco

| | `<Ojo>` (§12.3) |
|---|---|
| Marco | **barra lateral izquierda de 4px**, sin borde alrededor |
| Estructura | título fijo + prosa libre |
| Qué es | un **aparte dentro del hilo de lectura**, no una interrupción |

**Regla dura: el `<Ojo>` lleva barra lateral y nunca marco completo.** Hasta
ADR-014 la barra era además la señal que lo separaba de `<AlertaContradiccion>`,
que llevaba marco. Esa contraparte ya no existe, **y la regla se queda por su
propio motivo**: un marco cerrado saca al recuadro del hilo del texto y lo
convierte en pieza aparte —lo correcto para una entrada catalogada, no para un
comentario del autor sobre lo que se acaba de leer—. La barra lateral marca el
pasaje sin encerrarlo.

La consecuencia práctica: **un marco completo queda libre** para el primer
componente futuro que sea de verdad una interrupción del texto. Que hoy no haya
ninguno no es razón para gastarlo en el `<Ojo>`.

### 6.3 El título va en `foreground`, no en `text-aviso` — **decidido por medición**

El título «Ojo con esto» no lleva el color del recuadro, y no es una elección
estética. El número que lo decide es este:

> `text-aviso` sobre `bg-aviso/10` da **4.09:1** en tema claro sobre `background`
> (4.19:1 sobre `card`). **Falla AA para texto normal (4.5).**

No es un problema del alfa elegido: `--aviso` puro sobre `background` ya está en
**4.65:1** — el token con menos margen de toda la paleta, porque D-1 lo bajó
justo hasta el mínimo viable. **Cualquier tinte de aviso en el fondo lo hunde por
debajo de AA.** A `/5` da 4.36; no hay alfa que lo salve.

**Decisión: el título va en `foreground`.** El color se queda donde no tiene
requisito de 4.5:1 — el **icono** (objeto gráfico, 3:1) y la **barra lateral**
(delimitador).

Dos razones más allá de la métrica:

1. **El título es la información**, y §1.2 prohíbe que el color sea su único
   portador. Ponerlo en el color de más bajo contraste de la paleta es lo
   contrario de lo que pide esa regla.
2. El ámbar sigue estando —en el icono y en la barra—, así que el recuadro se
   identifica igual de lejos sin cargar el color sobre el texto.

⚠ **Esta medición es la que sostiene el resto de la sección**, y por eso se deja
escrita aunque el componente que la motivó (el rótulo de la alerta) ya no exista:
cualquier intento futuro de pintar texto en `text-aviso` sobre un fondo tintado de
aviso vuelve a chocar con los mismos 4.09:1.

### 6.5 El ámbar del `<Ojo>` y el veto del crema de §5.1.1

En el sistema, **el ámbar significa «esto se confunde»** y eso es exactamente lo
que dice este recuadro.

**Alternativa evaluada y descartada: neutro** (`bg-muted`, barra `border-border`,
icono en `foreground`). Es la lectura más literal de «no hay nada mal», y resuelve
el contraste sin esfuerzo. Se descarta porque **miente por omisión**: un `<Ojo>`
existe donde hay una trampa real de examen, y un cuadro gris dentro de la teoría
se lee como nota al pie. El brief pide honestidad, no tibieza: el ámbar dice «no
hay error, pero cuidado», que es el mensaje entero.

**No confundir con el veto de §5.1.1.** `bg-aviso/10` en claro compone `#f2ede4`,
cerca del crema `#F4F1EA` que está vetado. El veto es al **fondo de la
aplicación**; aquí es el relleno de un recuadro de ~60 px de alto sobre un lienzo
azulado. No hay conflicto, y queda dicho para que nadie lo «arregle».

### 6.6 Contrastes medidos — AA en los dos temas

Hoy el `<Ojo>` solo aparece sobre `background` (la teoría MDX). **Se conservan
también los pares sobre `card`**: están medidos, no cuestan nada y cubren de
antemano el día en que un panel monte el recuadro sobre una tarjeta. Fondo del
cuadro: `--aviso` compuesto al **10 %** sobre la base.

Método: `oklch` → sRGB (Björn Ottosson) + fórmula de contraste WCAG 2.1, con
composición alfa previa. Los valores de entrada son los de `globals.css` tras D-1
a D-6. Las cifras entre paréntesis son la remedición del `accessibility-auditor`
en navegador sobre el DOM real (coinciden dentro de ±0,10).

**`bg-aviso/10`**

| Escenario | Fondo compuesto | Título y prosa (`foreground`) | Icono (`aviso`) |
|---|---|---|---|
| claro · sobre `background` | `#f2ede4` | **15.03** (14.91) | **4.09** (4.05) |
| claro · sobre `card` | `#f5f0e5` | **15.40** | **4.19** |
| oscuro · sobre `background` | `#23201b` | **13.02** | **7.96** (7.96) |
| oscuro · sobre `card` | `#2a2925` | **11.68** | **7.14** |

| Umbral | Peor caso medido | Margen |
|---|---|---|
| Texto normal (4.5) — título y prosa | **11.68** (oscuro · `card`) | +7.18 |
| Objeto gráfico (3.0) — icono | **4.09** · 4.05 en navegador (claro · `background`) | +1.09 · +1.05 |

**0 fallos.** El par más justo del recuadro es el **icono a 4.09:1**, sobre un
umbral de 3.0.

⚠ **El alfa del fondo se queda en 10 %, pero su justificación medida ya no
existe.** El número que clavaba el 10 % era el `<dt>` de la alerta a 4.71:1
(a `/12` bajaba a 4.57 y a `/15` rompía AA) — y ese `<dt>` desapareció con
ADR-014. Dentro del `<Ojo>` no queda ningún par de texto cerca del límite: el peor
es 11.68 contra 4.5. **La regla se conserva por prudencia, no por medición**, y
está anotada como tal en §6.8: quien quiera subirla tiene que remedir, no basta
con citar esta sección. Lo que sí sigue vivo es el techo de §6.3 — ningún tinte de
aviso admite texto en `text-aviso` encima.

⚠ **Subir texto de 11 a 12px (A-16, §2.5) no mueve ninguna de estas cifras, y
tampoco mueve el umbral.** Conviene dejarlo escrito porque la intuición dice lo
contrario. WCAG 2.1 SC 1.4.3 tiene **exactamente dos umbrales**: 4.5 para texto
normal y 3.0 para texto grande, y «grande» empieza en **24px, o 18.66px en
negrita**. No existe un tercer umbral para texto pequeño del que 11px se pudiera
estar alejando. 12px semibold sigue siendo texto normal, igual que 11px. El mismo
razonamiento cubre el pie de atribución al pasar de 12 a 13px: sigue siendo texto
normal, sigue midiendo **5.49 claro · 6.18 oscuro**, sigue pasando AA con holgura.
Ningún umbral cambia de lado.

**La barra lateral.** Va en `--aviso` puro, no en un alfa: **4.65:1** contra
`background` en claro (§6.3). Aun por debajo de 3:1 sería correcto, por el mismo
criterio con que §1.3 exime a `--border` —es un delimitador, no identifica un
control ni porta información, que va en el título y en la prosa—, pero aquí ni
siquiera hace falta invocar la exención.

### 6.7 Clases exactas — esto es lo que se escribe

Todas literales. No hay mapa de estilos que consultar: **un solo recuadro, un solo
tratamiento.** Es lo que sustituye al `ESTILO_ERRATA` que ADR-014 retiró.

| Pieza | Clases | Por qué |
|---|---|---|
| `<aside>` | `my-5 flex gap-3 rounded-lg border-l-4 border-aviso bg-aviso/10 p-4` | **barra lateral, nunca marco** (§6.1) · `rounded-lg` y `p-4` de §3 · la barra va en `--aviso` puro (§6.6) |
| Icono `Eye` | `mt-0.5 size-5 shrink-0 text-aviso` + `aria-hidden` | el color vive aquí (§6.3). **`aria-hidden`: nunca es el único portador**, el título textual siempre lo acompaña |
| Caja de texto | `text-[0.9375rem] leading-[1.5]` | Inter 15px / 1.5, fila «Cuerpo de interfaz» de §2.3. **Explícito, no heredado**: marca el recuadro como aparte de los 17px de la teoría |
| Título | `mb-1 font-semibold text-foreground` | Inter 600 sobre la caja de 15px. **Nunca `font-titulo`**: Barlow Condensed a ese cuerpo violaría §2.3 regla 1. Y **nunca `text-aviso`**: §6.3 |
| Prosa | hereda de la caja · `[&>p:first-child]:mt-0 [&>p:last-child]:mb-0` | los `<p>` conservan el ritmo de párrafo de `.prose-idoneo` (es prosa del autor); solo se recortan los márgenes contra el borde del recuadro |
| Medida | `.prose-idoneo > aside { max-width: 36rem }` | §3.1, en `globals.css`. No es una clase del componente |

**Nombre accesible — resuelto, no pendiente.** Un `<aside>` es landmark
*complementary*, y un módulo con varios recuadros anunciaría varios
«complementario» idénticos. Se resolvió en el Paso 7 con **`role="note"` +
`aria-label="Ojo con esto"`** (A-09): `note` dice lo que el recuadro es —un aparte
dentro del hilo de lectura, no contenido complementario— y lo saca de la lista de
landmarks sin perder el nombre. Se usa `aria-label` y no `aria-labelledby` porque
el título es fijo y el componente no tiene clave única con la que construir un
`id` sin arriesgar colisiones cuando un módulo monta varios.

### 6.8 Prohibiciones que nacen de esta sección

| Prohibido | Por qué |
|---|---|
| Poner el título del `<Ojo>` en `text-aviso` | 4.09:1 medido (4.05 en navegador). Falla AA para texto normal. §6.3 |
| Usar `font-titulo` en el título | Barlow Condensed a 15px viola la regla dura 1 de §2.3 |
| Subir el fondo del recuadro por encima del 10 % | **Regla conservada por prudencia: su medición murió con ADR-014.** Fijaba el 10 % el `<dt>` de la alerta (4.57 a `/12`), que ya no existe; dentro del `<Ojo>` el peor par de texto está en 11.68. Para subirlo hay que **remedir**, no basta con citar §6.6 |
| Darle marco completo al `<Ojo>` | saca el aparte del hilo de lectura y gasta la única forma que queda libre para un componente futuro que sí sea una interrupción. §6.1 |
| Cambiar `Eye` por un icono de alarma (`TriangleAlert` y parientes) | el `<Ojo>` no afirma que haya un error: dice «aquí te vas a equivocar». Un icono de peligro añade alarma y no añade información |
| Reintroducir un segundo recuadro de contenido sin pasar por §6 | la distinción de forma —barra lateral contra marco— es el presupuesto entero de esta sección. Un tercer tratamiento la anula |

---

## 7. Registro de cambios

| Fecha | Qué | Estado |
|---|---|---|
| 2026-07-29 | Versión inicial. Paleta con contraste verificado (59 pares, 0 fallos), escala tipográfica, instrumento de umbral, 7 desviaciones del blueprint marcadas. | **Aprobada** (ver encabezado; ADR-009) |
| 2026-07-30 | **§2.4 nuevo — el rótulo de bloque pasa a ser regla del sistema**, derivada de §1.2: toda ruta con exactamente un bloque en contexto lo nombra en texto encima de su `h1`, con `RotuloBloque` (Server, props `{ bloque }`). Cierra el hueco que el Paso 5 dejó abierto y la decisión pendiente de `COMPONENTES.md`. Enlazado desde §1.2, §4.3 y §5.2. | Vigente |
| 2026-07-30 | **§4.6 nuevo — A-04 resuelto: se acepta la muesca del contorno de foco sobre la lengüeta activa.** Sin cambio de código; la lengüeta se queda en `top-0` y 4px. Con las tres condiciones que obligarían a revisarlo. | Vigente |
| 2026-07-30 | **§3.1 nueva — A-15 (auditoría del Paso 7): dos medidas dentro de la columna.** El texto que se lee renglón a renglón se capa a **38rem / 608px** (74,8 caracteres por línea, contra 88,5); tablas, `<TablaClave>` y `<Formula>` se quedan a 720px porque estrecharlas adelantaría A-11. **Corrige la propuesta del auditor en un punto:** `<Ojo>` y `<AlertaContradiccion>` pasan también a medida de lectura, porque a 720px su texto interior corría a 91–96 cpl. Una regla CSS en `globals.css` (selector de hijo directo) más una clase en `erratas/page.tsx`. Queda escrito que `ch` no sirve por `tabular-nums`. A 375px no cambia nada. Toca §3. | Vigente |
| 2026-07-30 | **§2.5 nueva — A-16 (auditoría del Paso 7) y la observación heredada del Paso 5 sobre el pie.** La fila «Eyebrow / etiqueta» de §2.3 se parte en **«Antetítulo» (11px)** y **«Clave de campo» (12px)**: el `<dt>` de las fichas estaba en la fila equivocada, no en el tamaño equivocado. Se conservan las versalitas, con argumento. El **pie legal sube de 12 a 13px y la regla 4 de §2.3 pierde su última excepción de lectura**. Verificado en §6.6: el umbral aplicable (4.5) y el peor par (4.71, margen +0.21) **no se mueven** — WCAG solo tiene dos umbrales y «grande» empieza en 24px. Toca §2.3, §2.4, §6.6 y §6.7. | Vigente |
| 2026-07-30 | **§1.3 corregido — A-06.** El párrafo de foco describía un `focus-visible:outline-1 outline-ring` de shadcn que la versión instalada no trae. Ahora describe lo instalado (`outline-none` + `border-ring` + `ring-ring/50`, que no pinta nada sin clase `border`) y deja explícito que la regla de `@layer utilities` de `globals.css` es el **único portador** del foco y no se toca. Con los números medidos y la nota del artefacto de `transition-all`. | Vigente |
| 2026-07-30 | **§3.2 nueva — reverificación del Paso 7, A-11 cerrado de verdad.** El degradado avisa de que la tabla sigue pero **no restituye el dato**: a 375px la tabla de zonas oculta 177px (34 %) y se lee «95 % / 5» donde el valor es «95 % / 5 %». **Por debajo de `sm` (640px), toda tabla de 4+ columnas se presenta como una ficha por fila**, con la clave de cada campo encima de su valor; de `sm` para arriba no cambia nada y el degradado se conserva. El umbral se cuenta con `:has(thead th:nth-child(4))`, así que se aplica solo en los 29 módulos sin que el autor escriba nada. Exige **roles explícitos** en las seis piezas de la tabla (cambiar el `display` borraría la semántica y con ella A-10 y A-12) y **recortar** el `<thead>`, nunca `display:none`. Apagar el degradado abajo devuelve a axe la medición de contraste de 31 celdas que A-18 daba por perdida. Se declina el texto de ayuda «Se desplaza en horizontal»: en la ficha sería falso. CSS en `globals.css` y mapeo en `componentes.tsx`, los dos literales. | Vigente **salvo en el degradado**: la fila de A-22 lo retira entero, también de `sm` para arriba |
| 2026-07-30 | **§3.1 corregida — reverificación del Paso 7: el margen de 38rem era más justo de lo que el documento afirmaba.** «Cinco caracteres de margen» valía para la teoría de 17px (74,4 cpl medidos) pero **no para las tres superficies de 15px**, que salían en **79,2–79,6 cpl**: 0,4 a 0,8 caracteres bajo el 80 de 1.4.8. La medida pasa a definirse **en caracteres (≈75 cpl)** y el píxel a ser su implementación: **38rem para 17px, 36rem para 15px** — los dos recuadros de prosa y la ficha de `/erratas`, que quedan en 74,6–75,0 cpl. Se descarta aceptar el 0,4 (con el ancho de carácter mínimo medido, 6,81px, el texto futuro de los pasos 15–17 cruzaría los 80 sin que nadie lo note) y se descarta 34rem (sobrecorrige a ~70 cpl y abre un escalón visible de 64px). Toca la regla de `globals.css` y la raíz de `FichaErrata`. | Vigente |
| 2026-07-30 | **§3 — retirada la excepción del enlace de licencia del pie al piso táctil de 44px.** Con el pie a 13px (§2.5) el enlace mide **44,0 px exactos** medidos, no 43: cumple por derecho propio y la excepción sobra. La única válvula del piso vuelve a ser `data-compacto` (D-7). Sin cambio de código — el `py-3.5` de `pie.tsx` es lo que produce los 44,0 px y no se toca. De paso se limpia la frase de §2.5 que había quedado colgando de la estimación errónea de «~49 px». | Vigente |
| 2026-07-30 | **§6 nuevo — los recuadros de contenido.** Cierra la decisión que ADR-012 delegó: `'aclaracion'` va en `aviso` (no rojo), `contradiccion` y `errata` siguen en `destructive`, y los tres estrenan icono propio (`Scale` · `CircleX` · `CircleAlert`, se retira `TriangleAlert`). El rótulo pasa a `foreground` **por medición** — `text-aviso` sobre `bg-aviso/10` da 4.09:1 y falla AA — y de paso se corrigen dos usos tipográficos fuera de la escala de §2.3 (`font-titulo` a 14px, `text-sm`/`text-xs`). 16 pares medidos en los dos temas sobre `background` y `card`, 0 fallos. Fija además la regla de forma que separa `<AlertaContradiccion>` de `<Ojo>`: marco completo vs barra lateral. El antiguo §6 (registro de cambios) pasa a §7; §5.1 y §5.2 **no se renumeran** porque hay código y documentos que las citan. | Vigente |
| 2026-07-30 | **§3.2 corregida — A-22: el degradado de A-11 se retira entero, no solo por debajo de `sm`.** §3.2 lo conservaba de 640px para arriba «porque una tabla de 6 columnas todavía puede desbordar a 700px»; medido, **ninguna de las cuatro tablas del fixture desborda en ocho anchos de 640 a 1280px, la de 7 columnas incluida** — `width: 100%` + `table-layout: auto` hacen que las celdas envuelvan. Tampoco desbordan a 375px las de 2 y 3 columnas, que el umbral `:has(...nth-child(4))` dejaba con degradado. Sin ningún viewport donde ayude, conservarlo es CSS muerto que **ciega la comprobación automática de contraste de toda tabla** (49 celdas incompletas a 1280px, 24 a 375px) justo antes de que los pasos 15–17 escriban 28 módulos de tablas. Se retiran los dos bloques de `globals.css` —la regla base y la variante `.dark`, que solo cambiaba el color de la sombra— y el `background-image: none` de la media query, que queda sin objeto. En su lugar, `.prose-idoneo table` estrena **`overflow-wrap: anywhere`**: el caso residual (cadena inquebrable) se **previene** en vez de señalarse; sobre el contenido actual es un no-op. **No se toca nada de accesibilidad:** `overflow-x: auto`, `tabIndex={0}`, `role="group"` y el `aria-labelledby` de A-19 se quedan. Resultado: `/modulos` 49 → 0 incompletas a 1280px y 25 → 1 a 375px. | Vigente |
| 2026-07-30 | **§6 reescrita — ADR-014 elimina el sistema de erratas de la app.** Se van `<AlertaContradiccion>`, `/erratas`, `content/erratas.ts` y los tipos `Errata`/`TipoErrata`: el contenido enseña el dato verdadero y verificado, y la app no documenta sus errores en ningún sitio. **§6 pasa a ser sobre `<Ojo>`, el único recuadro que queda**, y se reescribe entera para no definirlo por oposición a un componente que ya no existe: la barra lateral se justifica ahora por sí misma (un aparte no se encierra en un marco) y el marco completo queda libre para un futuro componente de interrupción. **§6.2 y §6.4 se suprimen y los números NO se reciclan** —ojo.tsx, `globals.css`, `ACCESIBILIDAD.md` y `BITACORA.md` citan §6.1, §6.3, §6.6 y §6.7 por su número—. La medición de §6.3 (`text-aviso` sobre `bg-aviso/10` = 4.09) se conserva: es lo que impide pintar texto sobre cualquier tinte de aviso. §6.6 queda con los 8 pares que aplican al `<Ojo>`, peor caso el icono a 4.09 sobre umbral 3.0. **Una regla queda sin su medición: el tope del 10 % de alfa del fondo** lo fijaba el `<dt>` de la alerta (4.57 a `/12`); se conserva por prudencia y marcado como tal en §6.8. Tocadas además §1.1 (usos de `--destructive`), §2.4 (tabla de rutas), §2.5 (la fila «Clave de campo» se re-ancla en la ficha por fila de §3.2, su único consumidor), §3.1 (la medida de 36rem se queda con un solo consumidor; se retiran las dos filas de `erratas/page.tsx`), §3.2 y el mapa `componentesMdx`. | Vigente |
