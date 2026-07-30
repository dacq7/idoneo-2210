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
| **Rojo tabla** | `--destructive` | `oklch(0.552 0.19 27)` `#c9312d` | `oklch(0.66 0.18 26)` `#ec5c55` | Respuesta incorrecta, veredicto «En riesgo», cronómetro ≤2 min, `<AlertaContradiccion>`. |
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
| Eyebrow / etiqueta | Inter | 0.6875rem · 11px | = | 600 | 1.1 | +0.08em, `uppercase` |
| `h1` de pantalla | Barlow Cond. | 1.75rem · 28px | 2.25rem · 36px | 700 | 1.08 | −0.005em |
| `h2` de sección | Barlow Cond. | 1.375rem · 22px | 1.5rem · 24px | 600 | 1.15 | 0 |
| `h3` | Barlow Cond. | 1.125rem · 18px | = | 600 | 1.25 | 0 |
| Veredicto | Barlow Cond. | 2rem · 32px | 2.5rem · 40px | 700 | 1.05 | −0.01em |
| Cuerpo de teoría (MDX) | Inter | 1.0625rem · 17px | = | 400 | 1.65 | 0 |
| Cuerpo de interfaz | Inter | 0.9375rem · 15px | = | 400 | 1.5 | 0 |
| Enunciado de ítem | Inter | 1.0625rem · 17px | = | 500 | 1.45 | 0 |
| Opción de ítem | Inter | 0.95rem · 15px | = | 400 | 1.4 | 0 |
| Auxiliar / metadato | Inter | 0.8125rem · 13px | = | 400 | 1.5 | 0 |
| Pie legal | Inter | 0.75rem · 12px | = | 400 | 1.6 | 0 |
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
4. **Ningún tamaño de lectura por debajo de 13px**, salvo el pie legal (12px) y
   las etiquetas de nav y eyebrow (11px), que son etiquetas, no lectura.

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

Estilo, tal cual sale de la escala de §2.3 (fila «Eyebrow / etiqueta»), sin
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
| `/`, `/repaso`, `/simulacros`, `/glosario`, `/ajustes`, `/plan`, `/progreso`, `/erratas`, `/herramientas`, `/ultima-noche`, `/diagnostico`, `/simulacros/final`, 404, `error.tsx` | ❌ | ningún bloque, o los cuatro a la vez |
| `/resultados/[intentoId]` | **depende del `ambito` del intento** | ✅ si el intento es de tipo `bloque` o `quiz` (un solo bloque); ❌ si es `final` o `diagnostico`, que abarcan los cuatro |

**Criterio general, para cualquier ruta futura:** el rótulo aparece si y solo si
hay **exactamente un** bloque en contexto. Varios bloques a la vez ⇒ no hay rótulo,
porque no hay un color de bloque que acompañar.

---

## 3. Espaciado, radio y superficie

Se conserva §11.5 completo. Aquí queda consolidado para no tener que volver al
blueprint.

| Regla | Valor |
|---|---|
| Ancho de contenido | `max-w-3xl` (768px). App de leer y responder, no tablero ancho. |
| Padding horizontal de página | `px-4` móvil · `px-6` desde `sm` |
| Padding de tarjeta | `p-4` móvil · `p-6` desde `sm` |
| Separación entre tarjetas | `gap-3` móvil · `gap-4` desde `sm` |
| Ritmo vertical | múltiplos de 4px. Entre secciones `space-y-6`; dentro de una sección `space-y-3` |
| Radio base | `--radius: 0.625rem` → `sm` 6px · `md` 8px · `lg` 10px · `xl` 14px |
| Radio por elemento | tarjetas `rounded-lg` · botones y opciones `rounded-md` · insignias `rounded-full` · **bandas del instrumento de umbral `rounded-none`** |
| Sombra | `shadow-sm` en tarjetas. Los botones son planos con borde. Cero sombras de color. |
| Táctil | opciones de ítem `min-h-[52px]` · resto de interactivos 44px (forzado en `@layer base`) |
| Barra inferior | `h-16` + `env(safe-area-inset-bottom)` |
| Transiciones | ≤200ms. Por defecto 150ms `ease-out`. Solo `color`, `background-color`, `border-color`, `opacity`, `transform`. **Nunca `all`.** |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce)` anula duraciones a 0.01ms (§11.3) |

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

## 6. Registro de cambios

| Fecha | Qué | Estado |
|---|---|---|
| 2026-07-29 | Versión inicial. Paleta con contraste verificado (59 pares, 0 fallos), escala tipográfica, instrumento de umbral, 7 desviaciones del blueprint marcadas. | **Aprobada** (ver encabezado; ADR-009) |
| 2026-07-30 | **§2.4 nuevo — el rótulo de bloque pasa a ser regla del sistema**, derivada de §1.2: toda ruta con exactamente un bloque en contexto lo nombra en texto encima de su `h1`, con `RotuloBloque` (Server, props `{ bloque }`). Cierra el hueco que el Paso 5 dejó abierto y la decisión pendiente de `COMPONENTES.md`. Enlazado desde §1.2, §4.3 y §5.2. | Vigente |
| 2026-07-30 | **§4.6 nuevo — A-04 resuelto: se acepta la muesca del contorno de foco sobre la lengüeta activa.** Sin cambio de código; la lengüeta se queda en `top-0` y 4px. Con las tres condiciones que obligarían a revisarlo. | Vigente |
| 2026-07-30 | **§1.3 corregido — A-06.** El párrafo de foco describía un `focus-visible:outline-1 outline-ring` de shadcn que la versión instalada no trae. Ahora describe lo instalado (`outline-none` + `border-ring` + `ring-ring/50`, que no pinta nada sin clase `border`) y deja explícito que la regla de `@layer utilities` de `globals.css` es el **único portador** del foco y no se toca. Con los números medidos y la nota del artefacto de `transition-all`. | Vigente |
