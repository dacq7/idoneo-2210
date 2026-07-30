# Inventario de componentes — Idóneo 2210

Qué existe ya, dónde vive, si es Server o Client, qué props recibe y quién lo
usa. **Consultar antes de construir cualquier componente**: es lo que evita que
un paso posterior escriba de nuevo algo que ya está hecho.

Se actualiza en el mismo commit que crea o cambia un componente. La regla de
frontera está en §10.2 del blueprint, y la lista cerrada de archivos con
`"use client"` en §10.3, **ampliada por ADR-009 con dos altas** —
`riel-bloques.tsx` y `app/error.tsx`—. Lo de `encabezado.tsx` **no fue un alta**:
fue aclarar que es Server Component, y §10.3 lista archivos que sí llevan la
directiva. Verificado al cerrar el Paso 8: la lista real son **9 clientes** —los
6 del Paso 5 más `etapas-modulo.tsx`, `marcador-lectura.tsx` y
`mazo-tarjetas.tsx`, los tres previstos por §10.3— y coincide exactamente con
§10.3 + ADR-009, sin desvíos.

> **Cómo contar los clientes sin equivocarse.** `grep "use client"` da falsos
> positivos: varios comentarios mencionaban la cadena para decir que **no** la
> usan, y eso hizo contar 9 clientes donde hay 6. Esos comentarios ya se
> reescribieron, y la forma correcta de medir es buscar la directiva, no la
> cadena:
>
> ```bash
> grep -rlE "^\s*['\"]use client['\"];?\s*$" src/
> ```
>
> Ese comando devuelve **22** al cerrar el Paso 8, no 9: cuenta también los 12
> componentes de `src/components/ui/` (shadcn, generados por el CLI y ajenos a
> §10.3) y `src/hooks/usar-estado.ts`. La cuenta de «clientes» de este documento
> es la de código propio de aplicación, excluyendo `ui/` y `hooks/`:
>
> ```bash
> grep -rlE "^\s*['\"]use client['\"];?\s*$" src/ | grep -v "src/components/ui/\|src/hooks/"
> ```

---

## Armazón y navegación (Paso 5)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `RootLayout` | `src/app/layout.tsx` | Server | `children` | Next |
| `Proveedores` | `src/components/layout/proveedores.tsx` | **Client** | `children` | `layout.tsx` |
| `Shell` | `src/components/layout/shell.tsx` | Server | `children` | `layout.tsx` |
| `Encabezado` | `src/components/layout/encabezado.tsx` | Server | — | `Shell` |
| `RielBloques` | `src/components/layout/riel-bloques.tsx` | **Client** | — | `Encabezado` |
| `InterruptorTema` | `src/components/layout/interruptor-tema.tsx` | **Client** | — | `Encabezado` |
| `BarraLateral` | `src/components/layout/barra-lateral.tsx` | **Client** | — | `Shell` |
| `NavInferior` | `src/components/layout/nav-inferior.tsx` | **Client** | — | `Shell` |
| `Pie` | `src/components/layout/pie.tsx` | Server | — | `Shell` |
| `DESTINOS`, `destinoActivo` | `src/components/layout/destinos.ts` | data | — | `NavInferior`, `BarraLateral` |
| `NoEncontrada` | `src/app/not-found.tsx` | Server | — | Next (404) |
| `ErrorDeRuta` | `src/app/error.tsx` | **Client** | `error`, `reset` | Next (límite de error) |
| `Inicio` | `src/app/page.tsx` | Server | — | ruta `/` · **provisional, se reescribe en el Paso 14.4** |
| `RotuloBloque` | `src/components/layout/rotulo-bloque.tsx` | Server | `bloque: BloqueId`, `className?` | las páginas con bloque en contexto (Paso 7+). Implementa la regla de DISENO.md §2.4 |

### Contratos que hay que respetar al construir encima

- **El armazón ya envuelve todas las rutas.** Una página nueva devuelve solo su
  contenido: no repite `<main>`, ni el pie, ni contenedor de ancho. `Shell` ya da
  `max-w-3xl px-4 sm:px-6 pt-6` y el `<main id="contenido">`.
- **El título de la pantalla es el `<h1>` de la página.** El encabezado no rotula
  la sección, así que cada ruta debe traer exactamente un `h1` y no empezar en
  `h2`. Los tamaños ya vienen de `globals.css` (escala de DISENO.md §2.3): se
  escribe `<h1>`, no `<h1 className="text-3xl …">`.
- **El bloque en contexto lo pinta el riel, pero el nombre lo pone la página.**
  Es **REGLA DEL SISTEMA**, registrada en DISENO.md §2.4 el 2026-07-30 y derivada
  de §1.2 (el color nunca es el único portador). Toda pantalla con **exactamente
  un** bloque en contexto —`/bloques/[id]`, `/modulos/[slug]`,
  `/simulacros/bloque/[id]`, `/resultados/[id]` según su `ambito`— monta
  `<RotuloBloque bloque={…} />` encima de su `<h1>`. No es opcional y no es una
  tarea del Paso 7: aplica a toda ruta con bloque. Las rutas sin bloque no
  muestran nada, sin marcador de posición.
- **El pie se oculta, no se desmonta,** durante un simulacro activo (Paso 11), y
  **`Pie` sigue siendo Server Component**. El mecanismo que decía este archivo
  —`hidden` sobre el `<Pie />` desde `Shell`— **es inviable**: `Shell` es servidor
  y no puede leer `localStorage`. El contrato correcto es un envoltorio cliente
  que reciba el pie como `children`:

  ```tsx
  // src/components/layout/oculta-en-simulacro.tsx  ·  'use client'  ·  Paso 11
  export function OcultaEnSimulacro({ children }: { children: React.ReactNode }) {
    const haySesion = /* suscripción a la clave idoneo2210:sesion */;
    return <div hidden={haySesion}>{children}</div>;
  }
  ```

  y en `Shell`, que es servidor: `<OcultaEnSimulacro><Pie /></OcultaEnSimulacro>`.

  **Por qué así:** `Pie` se renderiza en el servidor y viaja como payload RSC, de
  modo que **el componente que lleva la atribución de ADR-001 nunca entra al
  bundle cliente**. Es el patrón canónico de App Router. El hook de suscripción no
  es coste extra: el `DialogoReanudar` del Paso 11 responde la misma pregunta.
  **Descartado** mutar `document.body.dataset` desde un efecto y ocultar con CSS:
  exige limpieza al desmontar y se rompe en silencio si dos componentes compiten
  por el atributo. **Y descartado** volver `Pie` cliente. El archivo aún no se
  construye: es del Paso 11, y suma **una** alta a §10.3.
- **Ningún Client Component importa `content/`.** Ni `estructura`, ni `erratas`,
  ni `glosario`, ni `datos-duros`, ni `blueprint-examen`, ni los índices de
  `banco/` y `tarjetas/`. Los datos entran **por prop desde un Server Component**,
  reducidos al subconjunto serializable que el componente necesita — como
  `SegmentoRiel` (`{ id, peso, titulo }`), que `Encabezado` proyecta y pasa a
  `RielBloques`. **Medido:** un solo import de `BLOQUES` desde un cliente metía
  los 29 módulos completos en el bundle (5,6 kB gz; chunk del layout de 28 100 a
  8 717 B al arreglarlo). La causa es que `MODULOS_POR_SLUG = new Map(...)` se
  evalúa en el ámbito del módulo y ancla `MODULOS`; `sideEffects: false` **no** lo
  arregla. Con ~750 ítems en los pasos 15–17 el daño escala con el contenido, no
  con el código. Ver **ADR-010**.
- **La métrica de peso: `/layout` gz, NO el `First Load JS` del build.** Next
  **no incluye el chunk del layout raíz** en el `First Load JS` que imprime
  `npm run build`, así que esa cifra **subestima la primera carga en ~30 kB**:
  reportaba 103 kB cuando la real pasa de 130. **No usar los 103 kB en ningún
  paso.**

  Ojo, y esta es la parte que hay que respetar al pie de la letra: **una cifra de
  peso sin su método no es comparable.** Durante el Paso 5 se reportaron 134.4 y
  144.3 kB para el mismo build, y las dos estaban "bien" — cambiaba lo que se
  contaba. Hay dos decisiones que el número esconde:

  | Decisión | Efecto |
  |---|---|
  | ¿Solo `.js`, o también el `.css`? | el CSS son 12.3 kB de los 144.3 |
  | ¿gzip de cada archivo y se suma, o gzip de la concatenación? | concatenar comprime ~2 % mejor y **subestima**: el navegador descarga los archivos por separado |

  **La métrica oficial del proyecto es: solo `.js`, gzip por archivo y sumado**,
  que es lo que de verdad viaja por la red. El CSS se reporta aparte.

  **Cifras de hoy (2026-07-30), tras `npm run build`:**

  | | gz |
  |---|---|
  | **`/layout` js — MÉTRICA OFICIAL** | **132.0 kB** |
  | `/layout` css | 12.3 kB → **12.5 kB** tras el Paso 6 |
  | `/layout` total | 144.3 kB → **144.4 kB** tras el Paso 6 |
  | chunk `app/layout` solo | 3.2 kB (8 717 B raw) |

  El Paso 6 **no movió el js del armazón** (132.0 kB, idéntico: sus dos rutas son
  Server Components puros). Los 0.2 kB son CSS: utilidades nuevas de las fichas.

  **El comando exacto que las produce.** Cualquier paso que reporte peso usa
  este, sin variantes, o la comparación no vale:

  ```bash
  npm run build && node -e 'const fs=require("fs"),p=require("path"),z=require("zlib");const m=JSON.parse(fs.readFileSync(".next/app-build-manifest.json","utf8")).pages["/layout"];const gz=f=>z.gzipSync(fs.readFileSync(p.join(".next",f))).length;const s=a=>a.reduce((t,f)=>t+gz(f),0);const js=m.filter(f=>f.endsWith(".js")),css=m.filter(f=>f.endsWith(".css"));console.log(`/layout · js ${(s(js)/1000).toFixed(1)} kB gz · css ${(s(css)/1000).toFixed(1)} kB gz · total ${(s(m)/1000).toFixed(1)} kB gz`)'
  ```

  Salida esperada hoy (tras el Paso 6): `/layout · js 132.0 kB gz · css 12.5 kB gz · total 144.4 kB gz`.

  Y la detección rápida de la regresión que ADR-010 previene, que **no depende de
  ninguna cifra** y por eso es la comprobación preferida:

  ```bash
  grep -rl "osteomuscular" .next/static/chunks/   # ← ver la nota de más abajo: `conceptosClave` ya NO sirve
  ```

  Si devuelve algo, un componente cliente volvió a importar `content/`.

- **Segunda métrica, obligatoria: el js gz POR RUTA.** El `grep` de arriba tiene
  un **punto ciego**: solo vigila `content/`. No detecta ninguna otra fuga con la
  misma forma —un import que parece gratis y arrastra un grafo—, y ya hay una
  **14 veces más grande** que la que motivó ADR-010: el barrel de `radix-ui`,
  77.5 kB gz (ver **ADR-011**). Por eso la vigilancia no puede ser por carpeta:
  tiene que ser por **desproporción**.

  ```bash
  npm run build && node -e 'const fs=require("fs"),p=require("path"),z=require("zlib");const pg=JSON.parse(fs.readFileSync(".next/app-build-manifest.json","utf8")).pages;const gz=f=>z.gzipSync(fs.readFileSync(p.join(".next",f))).length;const s=a=>a.reduce((t,f)=>t+gz(f),0);for(const k of Object.keys(pg).sort()){const js=pg[k].filter(f=>f.endsWith(".js"));console.log(`${k.padEnd(30)} ${(s(js)/1000).toFixed(1).padStart(6)} kB gz · ${js.length} chunks`);}'
  ```

  **Línea base del 2026-07-30, tras el Paso 6:**

  | Ruta | js gz | chunks | Tipo |
  |---|---|---|---|
  | `/page` | 102.8 kB | 5 | servidor puro |
  | `/_not-found/page` | 102.8 kB | 5 | servidor puro |
  | `/modulos/page` | **106.2 kB** | 6 | servidor puro |
  | `/bloques/[bloqueId]/page` | **106.2 kB** | 6 | servidor puro |
  | `/error` | 118.9 kB | 7 | cliente obligado por Next |
  | `/layout` | 132.0 kB | 8 | armazón (métrica principal) |
  | `/not-found` | **183.8 kB** | 7 | ⚠️ **anomalía conocida**, ADR-011 |

  **Referencia de un tipo de ruta:**
  - **servidor puro ≈ 103–107 kB gz.** Es el piso: React, el runtime del router y
    el CSS compartido. Una ruta hecha solo de Server Components debe caer aquí.
  - **+ un cliente pequeño propio:** unos pocos kB más. Nada que se acerque a 20.
  - **`/not-found` a 183.8 kB no es una licencia**, es el caso patológico
    documentado en ADR-011. No se copia su patrón ni se usa como referencia.

  ### La regla

  > **Si una ruta nueva supera la línea base de su tipo y no hay una explicación
  > escrita, se investiga ANTES de cerrar el paso.** Un salto de +20 kB gz sobre
  > el piso de servidor puro no es «así es Next»: es un import que arrastró algo.
  > Se localiza por diferencia de chunks contra una ruta sana, no adivinando:

  ```bash
  node -e 'const fs=require("fs"),p=require("path"),z=require("zlib");const pg=JSON.parse(fs.readFileSync(".next/app-build-manifest.json","utf8")).pages;const gz=f=>z.gzipSync(fs.readFileSync(p.join(".next",f))).length;const sana=new Set(pg["/modulos/page"]);const rara=process.argv[1];for(const f of pg[rara].filter(f=>f.endsWith(".js")))if(!sana.has(f))console.log((gz(f)/1000).toFixed(1).padStart(7),"kB gz ",f)' "/not-found"
  ```

  Y para saber **qué** hay dentro del chunk culpable, se busca un símbolo
  reconocible: `node -e "console.log(require('fs').readFileSync('.next/<chunk>','utf8').includes('DismissableLayer'))"`.

  **Cuándo se mide:** al cerrar cualquier paso que añada una ruta o un componente
  cliente. Las dos métricas —`/layout` js gz y el js gz por ruta— van en la
  entrada de bitácora de ese paso, con su cifra, no con un «sin cambios».
- **Foco de teclado:** no hace falta añadir clases de foco a nada.
  `globals.css` pinta 2px sólidos a `--ring` completo sobre todo elemento
  interactivo. Solo se sobrescribe el `outline-offset` cuando el contorno se
  recorta (la barra inferior fija usa `focus-visible:-outline-offset-2`).
- **Tamaño táctil:** el piso de 44px es automático. Para saltárselo hace falta
  `data-compacto`, y solo está autorizado en la cuadrícula del `panel-navegacion`
  (Paso 11) y los `TabsTrigger` de `/herramientas` (D-8 de ADR-009).
- **`text-muted-foreground` sobre `bg-accent` no es AA en tema oscuro** (4.47:1
  medido). Si un elemento cambia a `hover:bg-accent`, tiene que subir el texto a
  `text-foreground` en el mismo estado, como hacen las dos barras de navegación.

---

## Índices de bloques y módulos (Paso 6)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaBloque` | `src/app/bloques/[bloqueId]/page.tsx` | Server | `params: Promise<{ bloqueId }>` | ruta `/bloques/[bloqueId]` · los 4 ids se prerenderizan con `generateStaticParams` |
| `PaginaModulos` | `src/app/modulos/page.tsx` | Server | — | ruta `/modulos`, destino «Módulos» de las dos barras |
| `TarjetaModulo` | `src/components/modulo/tarjeta-modulo.tsx` | Server | `modulo: ModuloEnLista`, `bloque: BloqueId` | `ListaModulos` |
| `aModuloEnLista` | `src/components/modulo/tarjeta-modulo.tsx` | proyección | `Modulo` → `ModuloEnLista` | las dos páginas |
| `ListaModulos` | `src/components/modulo/lista-modulos.tsx` | Server | `modulos: readonly ModuloEnLista[]`, `bloque: BloqueId` | las dos páginas |
| `MetaBloque` | `src/components/modulo/meta-bloque.tsx` | Server | `pesoExamen`, `numeroCartilla`, `totalModulos` (`DatosMetaBloque`) | las dos páginas |

Los tres componentes viven en `src/components/modulo/` —carpeta que ya existía en
§3 del blueprint— y no en una carpeta `bloques/` nueva: la pantalla de bloque
**es** un índice de módulos acotado, y el reparto real es «una ficha de módulo y
su lista», no «cosas de bloque». Sin carpeta nueva, sin ADR.

### Contratos de este paso

- **`TarjetaModulo` no recibe un `Modulo`, recibe un `ModuloEnLista`.** Es Server
  Component, así que ADR-010 no la obligaría, pero la proyección la deja
  reutilizable desde cualquier página y hace explícito qué se muestra. La regla de
  `enPreparacion` (`estadoContenido !== 'completo'`) vive **solo** en
  `aModuloEnLista`: si un paso futuro la duplica, las dos rutas divergirán.
- **La insignia sale de `estadoContenido`, no del progreso del usuario.** Hoy los
  29 módulos están `'en-preparacion'` (ADR-004), así que las 29 fichas llevan
  «En preparación». Ninguna cifra está escrita a mano: la portada del índice dice
  «Los {MODULOS.length} módulos» y el conteo de publicados se calcula, así que el
  texto se corrige solo cuando el Paso 8 voltee C5.
- **El enlace estirado, y el falso positivo que va a producir en la auditoría.**
  La ficha es un `<article class="group relative">` con el `<Link>` dentro del
  `<h3>` y `after:absolute after:inset-0`. Así el **nombre accesible del enlace es
  solo el título del módulo** (un `<Link>` envolviendo la ficha leería también
  subtítulo, minutos e insignia) y a la vez **toda la tarjeta es el objetivo
  táctil**. Consecuencia: `getBoundingClientRect()` sobre el `<a>` devuelve 22 px
  de alto y **cualquier auditoría que mida cajas lo va a reportar como objetivo
  pequeño**. No lo es: verificado con `document.elementFromPoint` en las cuatro
  esquinas y el centro de la ficha —los cinco puntos caen dentro del `<a>`— y con
  un clic real en la esquina inferior derecha, que navega a `/modulos/<slug>`.
- **`group-hover:text-foreground` en los dos textos apagados de la ficha es
  obligatorio, no estético.** La tarjeta pasa a `hover:bg-accent`, y
  `text-muted-foreground` sobre `bg-accent` mide 4.47:1 en tema oscuro. Misma
  solución que las dos barras de navegación. Si alguien quita el `hover:bg-accent`,
  puede quitar los dos `group-hover`; nunca uno sin el otro.
- **El código del módulo (`C5`) es el portador no-cromático del color de bloque en
  la ficha.** Chip con `CLASES_BLOQUE[bloque].fondo` + `text-bloque-contraste`, en
  JetBrains Mono `rounded-md size-8` — el mismo tratamiento que la letra de opción
  de un ítem (DISENO.md §2.1), **no** una insignia (que serían `rounded-full`). El
  código empieza por la letra del bloque, así que color y letra viajan en el mismo
  elemento y §1.2 se cumple sin texto extra. Contraste ya verificado en §1.3:
  4.84:1 en el peor caso (C). Y no es la numeración decorativa que veta §5.2: es
  el prefijo real de los ids de ítem (`C5-014`).
- **Bandas de color de bloque, `h-1 w-8 rounded-none`, `aria-hidden`.** En
  `/modulos` cada grupo lleva una encima de su `<h2>`; en «Los otros bloques» de
  la página de bloque va vertical (`h-5 w-1`). Es el vocabulario que ya existe —la
  lengüeta de 4 px del destino activo (§4.5) y los segmentos del riel (§4.3)—, no
  un instrumento nuevo: relleno puro, esquinas rectas, sin tipografía encima. Son
  decorativas porque el texto contiguo siempre dice «Bloque X · Título».
- **Jerarquía de encabezados, medida en las 5 rutas:** `/modulos` es
  `h1 → h2` por bloque `→ h3` por módulo; `/bloques/[id]` es `h1 → h2` («Módulos,
  en orden de estudio» y «Los otros bloques») `→ h3` por módulo. Sin saltos y con
  un solo `h1`. Si un paso posterior añade una sección a estas rutas, entra como
  `h2`.
- **`/bloques/[bloqueId]` tolera minúsculas** (`/bloques/c` → bloque C), igual que
  `bloqueDeRuta` para el riel: así la página y el riel del encabezado no pueden
  contradecirse. Un id ajeno (`/bloques/Z`) responde **404** con `notFound()`.
- **`/modulos` NO monta `RotuloBloque`** (DISENO.md §2.4: solo con **exactamente
  un** bloque en contexto). `/bloques/[bloqueId]` **sí**, y por eso su `<h1>`
  repite el título del bloque que ya dice el rótulo: la redundancia la prescribe
  §2.4 y es deliberada.
- **Ninguna de las dos rutas del Paso 6 lee el progreso del usuario.** Ni racha,
  ni dominio, ni `mejorQuiz`: eso llega en los Pasos 8 y 14 y **no debe colarse
  aquí** por conveniencia — la ficha es Server Component y leer progreso la
  volvería cliente, lo que la haría importar `content/` desde el navegador o
  duplicar props. Cuando el Paso 8 quiera marcar «dominado», el patrón correcto es
  un envoltorio cliente por ficha, como el de `OcultaEnSimulacro`.

### ⚠ Hallazgo de peso: `Badge` y `Button` arrastran el barrel de `radix-ui`

Medido en este paso, con el comando oficial de más abajo:

| Ruta | js gz | Qué la infla |
|---|---|---|
| `/page` (portada, sin shadcn) | 102.8 kB | — |
| `/modulos` y `/bloques/[id]` **con `<Badge>`** | **183.4 kB** | chunk de **76 kB gz** (259 kB raw) de `radix-ui` |
| `/modulos` y `/bloques/[id]` **sin `<Badge>`** | **106.2 kB** | — |
| `/not-found` (usa `<Button asChild>`) | **183.8 kB** | el mismo chunk |

La causa: `badge.tsx` y `button.tsx` hacen `import { Slot } from "radix-ui"` —el
**paquete paraguas**, que reexporta todas las primitivas— y `Slot` es cliente, así
que la frontera se abre y el barrel entero entra al bundle de esa ruta. No es
`content/`, así que el `grep` de ADR-010 no lo detecta.

**Decisión de este paso:** la insignia «En preparación» se escribe con marcado
propio (`<span>` con las mismas clases que `badgeVariants.secondary`), idéntica en
pantalla y sin el barrel. **76 kB gz en la ruta más visitada del estudio, a cambio
de una píldora de texto, no se paga.** No se editaron los 18 archivos de
`src/components/ui/`.

**Deuda que queda abierta, con dueño:** `/not-found` paga hoy esos 76 kB por un
`<Button asChild>` (Paso 5). Cuando alguna pantalla necesite `Button`, `Dialog` o
`Select` de verdad —Pasos 9, 11, 18— conviene decidir si se cambian los imports de
`radix-ui` a los paquetes por primitiva (`@radix-ui/react-slot`), que es un cambio
mecánico en `src/components/ui/` y **sí** requiere registrar la excepción a «no se
editan a mano». Mientras el barrel entre por una sola ruta secundaria, no urge.

---

## Teoría MDX y registro de erratas (Paso 7)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaModulo` | `src/app/modulos/[slug]/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]` · los 29 slugs se prerenderizan |
| `PaginaErratas` | `src/app/erratas/page.tsx` | Server | — | ruta `/erratas`, enlazada desde el pie de todas las rutas |
| `FichaErrata` | `src/app/erratas/page.tsx` (local) | Server | `errata: Errata` | `PaginaErratas` |
| `RenderizadorMdx` | `src/components/mdx/renderizador.tsx` | Server **async** | `fuente: string` | `PaginaModulo` |
| `componentesMdx` | `src/components/mdx/componentes.tsx` | mapa | — | `RenderizadorMdx` |
| `Dato` | `src/components/mdx/dato.tsx` | Server | `etiqueta`, `valor`, `nota?` | el MDX de teoría |
| `Formula` | `src/components/mdx/formula.tsx` | Server | `children`, `nota?` | el MDX de teoría |
| `TablaClave` | `src/components/mdx/tabla-clave.tsx` | Server | `titulo?`, `children` | el MDX de teoría |
| `Ojo` | `src/components/mdx/ojo.tsx` | Server | `children` | el MDX de teoría |
| `AlertaContradiccion` | `src/components/mdx/alerta-contradiccion.tsx` | Server | `id: string` | el MDX de teoría · Paso 9 (panel de retroalimentación) |
| `ESTILO_ERRATA`, `CLASES_DT_ERRATA` | `src/components/mdx/alerta-contradiccion.tsx` | data | — | `AlertaContradiccion`, `PaginaErratas`, `PaginaModulo` |
| `leerTeoria`, `existeTeoria` | `src/lib/contenido.ts` | **server-only** | `slug: string` | `PaginaModulo` |

**Ninguno lleva `"use client"`.** El Paso 7 no añade ni una alta a §10.3: siguen
siendo 6 clientes. Todo lo de esta tabla se renderiza en el servidor y viaja
como HTML.

### Contratos de este paso

- **`src/lib/contenido.ts` es `server-only` y no está en `package.json`.** Next 15
  alias `server-only` a `next/dist/compiled/server-only` en su configuración de
  webpack, así que la directiva funciona sin instalar el paquete y sin añadir una
  dependencia (ADR-002). Importarlo desde un Client Component rompe el build con
  un mensaje explícito, que es exactamente para lo que está.
- **El vocabulario de las erratas vive en un solo sitio: `ESTILO_ERRATA`.** Mapea
  los tres tipos de ADR-012 a su rótulo, icono, marco, fondo y tinte, según
  DISENO.md §6.2 y §6.7. Lo consumen los tres sitios que muestran una errata
  —la alerta de la teoría, `/erratas` y la lista del pie de un módulo—. Si un
  paso futuro necesita un cuarto, **importa el mapa, no lo reescribe.** Las
  clases son literales a propósito: Tailwind no genera `border-${x}/60`.
- **La regla de forma de §6.1 es la que separa los dos recuadros:** el `<Ojo>`
  lleva **barra lateral de 4px y nunca marco**; `<AlertaContradiccion>` lleva
  **marco completo y nunca barra lateral**. Es la única señal estructural entre
  ellos, y es lo que permite que una `'aclaracion'` comparta el ámbar del `<Ojo>`
  sin ambigüedad. Intercambiarlas borra la distinción.
- **`.prose-idoneo` solo pone ritmo, no tamaños de encabezado.** Los de `h2` y
  `h3` ya los fija `@layer base` desde la escala de DISENO.md §2.3; §12.1 proponía
  `text-2xl`/`text-xl`, que los sacaría de esa escala. **Si un paso futuro añade
  una regla a `.prose-idoneo`, no repite tamaños de encabezado.**
- **El MDX de un módulo empieza en `##`.** El `<h1>` lo pone la página desde
  `content/estructura.ts` (§14.1). Verificado en las dos rutas nuevas:
  `/modulos/[slug]` es `h1 → h2` (objetivos, teoría, conceptos clave, erratas del
  módulo) `→ h3` (los del MDX); `/erratas` es `h1 → h2` (los tres tipos) `→ h3`
  (el tema de cada ficha). Sin saltos y con un solo `h1`.
- **Toda tabla del MDX se envuelve en `.tabla-desliz`,** un `<div>` con
  `overflow-x: auto` y **`tabIndex={0}`**. Lo pone el mapeo de `table` en
  `componentes.tsx`, así que aplica también a las tablas sueltas: el autor del
  contenido no tiene que acordarse de envolverlas. El `tabIndex` no es opcional
  —un contenedor con `overflow` no es alcanzable con el teclado en Chromium, y
  sin él la mitad derecha de la tabla de zonas queda fuera del alcance de quien
  no usa ratón (WCAG 2.1.1)—. Dentro de `<TablaClave>` el marco (`.marco-tabla`)
  le cede el margen al envoltorio, con dos reglas de la misma capa CSS y no con
  dos utilidades de margen compitiendo, cuyo orden Tailwind decide.
- **Los `<p>` estructurales de `<AlertaContradiccion>` llevan `my-0` / `mb-0`
  explícitos.** El cuadro vive dentro de `.prose-idoneo`, que da `margin-block:
  1rem` a todo `<p>`. El `<Ojo>` **no** los lleva, y es deliberado: su contenido
  sí es prosa del autor y debe conservar el ritmo de párrafo.
- **Los dos recuadros van a 15px / 1.5** («Cuerpo de interfaz» de §2.3), con
  `leading-[1.5]` explícito en la alerta: sin él heredaría 1.65 dentro de un
  módulo y 1.5 en `/erratas`, y el mismo componente se vería distinto en cada
  sitio.
- **Los `<aside>` llevan nombre accesible.** Es la nota de §6.7: un módulo con
  cinco recuadros anunciaría cinco landmarks *complementary* idénticos. La alerta
  usa `aria-labelledby` sobre el `<p>` del rótulo (`alerta-{id}`), que es único
  por errata; el `<Ojo>` usa `aria-label="Ojo con esto"` porque su título es fijo
  y no tiene ninguna clave con la que construir un `id` sin arriesgar colisiones.
- **Las fichas de `/erratas` son `<article>`, no `<aside>`.** Ahí son el contenido
  principal, no una interrupción de la lectura. Conservan el ancla `id={errata.id}`
  —`<AlertaContradiccion>` enlaza a `/erratas#X-02` y `DD-001` llega a `#X-03`— y
  compensan el encabezado pegajoso con
  `scroll-mt-[calc(var(--alto-encabezado)+1rem)]`. Verificado: al abrir
  `/erratas#E-09` la ficha queda a 76px del borde, con el encabezado de 60px
  encima.
- **`/modulos/[slug]` monta `RotuloBloque`; `/erratas` no.** Regla de DISENO.md
  §2.4: exactamente un bloque en contexto. Las erratas tocan módulos de los
  cuatro.
- **Ninguna de las dos rutas lee el progreso del usuario.** Las etapas del módulo
  (tarjetas, práctica, quiz) y el marcador de lectura llegan en los Pasos 8 y 9;
  el estado vacío de hoy no debe rellenarse con nada de eso por conveniencia.
- **El estado vacío de la teoría se corrige solo.** El texto ofrece un módulo
  publicado cuando lo hay (`MODULOS.find(estadoContenido === 'completo')`) y dice
  la verdad cuando no lo hay, que es lo de hoy: los 29 están en preparación.
  Cuando el Paso 8 voltee C5, la línea empieza a ofrecerlo sin tocar código.

### Peso — las dos métricas, medidas al cerrar el paso

| | gz |
|---|---|
| **`/layout` js — MÉTRICA OFICIAL** | **132.0 kB** (idéntico al Paso 6) |
| `/layout` css | 12.5 kB → **13.0 kB** |
| `/layout` total | 144.4 kB → **145.0 kB** |

| Ruta | js gz | chunks | Tipo |
|---|---|---|---|
| `/erratas/page` | **106.9 kB** | 6 | servidor puro |
| `/modulos/[slug]/page` | **106.9 kB** | 6 | servidor puro |

Las dos rutas nuevas caen dentro del piso de servidor puro (103–107 kB), así que
no hay nada que investigar. Los +0.5 kB del CSS son `.prose-idoneo`; el js del
armazón **no se movió**, que es lo esperado de un paso sin un solo componente
cliente. El `grep` de ADR-010 sigue sin encontrar nada, y tampoco aparece
contenido de erratas (`diceLaCartilla`, «Las cartillas se contradicen») en
`.next/static/chunks/`.

---

## Etapas del módulo y mazo de tarjetas (Paso 8)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaTarjetas` | `src/app/modulos/[slug]/tarjetas/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]/tarjetas` · los 29 slugs se prerenderizan |
| `EtapasModulo` | `src/components/modulo/etapas-modulo.tsx` | **Client** | `datos: DatosEtapas`, `etapaActual?: 1\|2\|3\|4` | `PaginaModulo` (etapa 1) y `PaginaTarjetas` (etapa 2) |
| `DatosEtapas` | idem (tipo) | tipo | `{ slug, bloque, hayTeoria, totalTarjetas }` | las dos páginas lo construyen en el servidor |
| `MarcadorLectura` | `src/components/modulo/marcador-lectura.tsx` | **Client** | `slug: string` | `PaginaModulo`, justo después del MDX |
| `MazoTarjetas` | `src/components/modulo/mazo-tarjetas.tsx` | **Client** | `slug`, `bloque`, `tarjetas: readonly TarjetaEnMazo[]` | `PaginaTarjetas` |
| `TarjetaEnMazo` | idem (tipo) | tipo | `{ id, frente, reverso, tipo }` | la página proyecta ahí el `Tarjeta[]` de `cargarTarjetas` |

**Tres altas a la lista cerrada de §10.3**, las tres previstas por el blueprint
(`etapas-modulo.tsx`, `marcador-lectura.tsx`, `mazo-tarjetas.tsx`). Con ellas la
app pasa de **6 a 9 clientes**. Comprobación:
`grep -rlE "^\s*['\"]use client['\"];?\s*$" src/`.

### Contratos de este paso

- **La página carga el contenido; el cliente lo recibe proyectado.** `cargarTarjetas(slug)`
  se llama **en el servidor**, desde `PaginaTarjetas` y desde `PaginaModulo` (esta
  última solo para el `.length`). `MazoTarjetas` recibe `TarjetaEnMazo[]` sin el
  campo `modulo`, que la ruta ya conoce. Ningún cliente importa `content/`
  (ADR-010): verificado con el canario, ver más abajo.
- **`useEstado()` devuelve `null` en dos situaciones distintas y hay que
  distinguirlas.** Además del primer render (servidor e hidratación), devuelve
  `null` **de forma permanente mientras el usuario no tenga nada guardado**:
  `obtenerSnapshot` lee `localStorage` y no escribe. Un componente que trate
  `null` como «cargando» deja el esqueleto puesto **para siempre** en todo
  usuario nuevo — que son todos, la primera vez. `EtapasModulo` lo resuelve con
  una bandera `montado` (`useState` + `useEffect` vacío): antes del efecto,
  esqueleto; después, `estado?.modulos[slug] ?? estadoModuloInicial()`. Eso **no**
  es «un valor por defecto que luego salta»: cero progreso guardado es cero
  progreso. **Todo componente que lea el progreso en los Pasos 9–14 tiene el
  mismo problema y debe copiar este patrón.**
- **El esqueleto solo cubre lo que depende del estado.** Los nombres de las
  cuatro etapas y sus enlaces son estáticos y se pintan desde el servidor; lo
  único que se sustituye por una barra es la celda de estado. Sin salto de
  layout y sin pantalla en blanco.
- **Las etapas 3 y 4 no enlazan a ninguna parte.** Sus rutas nacen en el Paso 9;
  enlazarlas hoy daría un 404. La fila es un `<div>`, no un botón deshabilitado,
  y dice su estado en palabras («Todavía no está lista»), con una nota debajo que
  explica qué sí se puede hacer hoy. Verificado en navegador: cero `href` hacia
  `/practica` o `/quiz`. **Cuando el Paso 9 cree las rutas, basta con darles
  `href` en `construirFilas`.**
- **La flecha de las filas enlazadas es afordancia, no adorno.** Sin ella, en
  táctil —donde no hay hover— una fila que navega y una que no se ven idénticas.
  Va **solo** en las filas con `href`, así que la señal no depende del color.
- **`MarcadorLectura` no marca la teoría si el usuario salta al final.** El
  centinela se observa con `rootMargin: '0px 0px -10% 0px'`, de modo que tiene
  que entrar de verdad en pantalla. Un salto instantáneo al pie (tecla `Fin`,
  arrastrar la barra) va de «debajo del viewport» a «encima» en un solo frame,
  el ratio nunca cambia de 0 y el observador no dispara. **Es deliberado, no un
  fallo:** quien salta el texto no lo leyó. Verificado en navegador en los dos
  sentidos: lectura gradual marca `teoriaLeida`, salto directo no.
- **El mazo registra `tarjetasVistas` y nada más.** La cola de repaso espaciado
  es del Paso 10. Verificado en navegador: tras recorrer las 15 tarjetas,
  `colaRepaso` sigue en `{}` y `practicaCompletada`/`mejorQuiz` sin tocar. En la
  pasada de repaso de las falladas **no** se registra: el mazo es un
  subconjunto y `Math.max` no bajaría el valor, pero la escritura no aporta nada.
- **El progreso se registra tarjeta a tarjeta, no al final.** Cerrar la pestaña a
  mitad del mazo conserva lo visto.
- **Cero aleatoriedad.** El mazo va en el orden en que el autor escribió las
  tarjetas, que es pedagógico. Barajar exigiría `crearRng(semilla)` y una semilla
  que aquí no significa nada (§22 regla 5).
- **Foco explícito en las tres transiciones del mazo.** Al revelar, al avanzar y
  al terminar, el elemento que tenía el foco desaparece del DOM y el foco caería
  al `<body>`. Se mueve a mano: revelar → la caja del reverso (`tabIndex={-1}`,
  para que el lector de pantalla lea la respuesta y los dos botones queden justo
  después); avanzar → el botón «Ver la respuesta»; terminar → el resumen. Las
  tres verificadas en navegador.
- **Teclado completo, sin listener global.** `Enter`/`Espacio` son nativos de los
  botones; `1` y `2` los captura un `onKeyDown` **en el contenedor**, no en
  `window`, así que solo actúan cuando el foco ya está dentro del mazo y no le
  roban teclas al resto de la app. El atajo se anuncia en pantalla desde `sm`.
- **El contador es `role="status"`.** Es lo que anuncia el avance sin recargar y
  sin robar el foco. La banda de avance es `aria-hidden`: relleno puro,
  `rounded-none`, sin tipografía encima y **sin transición** — `width` es
  propiedad de layout y DISENO.md §3 no la admite (§4.2 regla 6: movimiento, uno
  o ninguno).
- **El resumen no felicita.** Tres mensajes según el resultado, y el de cero
  fallos es el más severo: reconocer una respuesta al verla no es producirla en
  el examen (§22 regla 10).
- **El botón del mazo es marcado propio, no `Button` de shadcn.** Misma decisión
  que la insignia del Paso 6 y por la misma razón: `button.tsx` importa el barrel
  `radix-ui` (77.5 kB gz, ADR-011) y esta es una ruta de estudio diaria. Las
  clases son las de `buttonVariants`, menos el `transition-all` que §5.2 prohíbe.
  `Skeleton` sí sería gratis (no importa radix), pero el esqueleto son cuatro
  celdas y se resolvió con un `<span>` y `animate-pulse`.
- **El enlace al módulo del subtítulo de `/tarjetas` mide 41,5 px, y es correcto.**
  Es una caja `inline` dentro de un párrafo, el caso que DISENO.md §3.1 declara
  exento (`min-height` no aplica a cajas inline), igual que los prerequisitos que
  el Paso 7 ya envió. No es la única vía de vuelta: están también la fila
  «Esencial» de las etapas y el «Volver al módulo» del resumen.
- **Jerarquía verificada en las dos rutas.** `/modulos/[slug]`: un solo `h1` y
  `h2` para etapas, objetivos, teoría, conceptos y erratas. `/modulos/[slug]/tarjetas`:
  `h1` «Tarjetas» → `h2` «Las cuatro etapas». **El frente de la tarjeta es un
  `<p>`, no un encabezado**: es una pregunta, y como `h3` metería un salto antes
  del primer `h2`.

### ⚠ El canario de ADR-010 tiene un falso positivo desde este paso

El comando que documenta este archivo es:

```bash
grep -l "osteomuscular\|conceptosClave" .next/static/chunks/app/layout-*.js
```

**`conceptosClave` ya no sirve como canario.** Es también un campo de `esqModulo`
en `src/lib/esquemas.ts`, y `esquemas.ts` entra legítimamente al bundle cliente
desde el Paso 8: `almacenamiento.ts` importa `esqEstadoProgreso` para
`intentarMigrar`, que corre en `obtenerSnapshot` en cada cliente que usa
`useEstado()`. Lo mismo pasa con `diceLaCartilla`, `estadoContenido` y
`minutosEstimados`: son **nombres de campo de esquemas**, no datos.

**El canario fiable es `osteomuscular`** — texto de un título de módulo real, que
solo existe en `content/estructura.ts`:

```bash
grep -rl "osteomuscular" .next/static/chunks/    # limpio al cerrar el Paso 8
```

### Peso — las dos métricas, medidas al cerrar el paso

| | gz |
|---|---|
| **`/layout` js — MÉTRICA OFICIAL** | **131.9 kB** (132.0 en los Pasos 6 y 7: sin cambio real) |
| `/layout` css | 13.0 kB → **13.5 kB** |
| `/layout` total | 145.0 kB → **145.4 kB** |

| Ruta | js gz | chunks | Antes |
|---|---|---|---|
| `/modulos/[slug]/page` | **134.0 kB** | 9 | 106.9 kB (Paso 7) |
| `/modulos/[slug]/tarjetas/page` | **135.8 kB** | 9 | — (nueva) |

**+27 kB gz sobre el piso de servidor puro. Investigado antes de cerrar, como
manda la regla, y explicado — no es un import accidental.** Diferencia de chunks
contra `/modulos/page`, con el gzip por archivo:

| Chunk | gz | Qué es | Quién lo trae |
|---|---|---|---|
| `565-*` | **13.0 kB** | **Zod** (`ZodError`, `invalid_type`) | `almacenamiento.ts` → `esquemas.ts` → `esqEstadoProgreso.safeParse` en `intentarMigrar` |
| `5-*` | **9.3 kB** | **tailwind-merge** (26,9 kB en crudo, export `QP`) + el runtime de los iconos de lucide | `cn()` de `src/lib/utils.ts` |
| `571-*` | 5.0 kB | `almacenamiento.ts` + `usar-estado.ts` + los tres componentes del paso + **todas** las definiciones de esquema | este paso |
| `page-*` | 0.5 kB | la propia ruta | este paso |

**Los dos grandes son un escalón de una sola vez, no un coste por ruta.** Zod y
`tailwind-merge` los paga **el primer Client Component que lee el progreso**, y
el Paso 8 es ese momento: `useEstado()` no puede funcionar sin `almacenamiento.ts`,
y `almacenamiento.ts` valida el estado guardado con Zod al leerlo, que es el
diseño de §6 del blueprint. `cn()` es el ayudante estándar del proyecto y lo usan
los 6 clientes que ya existían. Los Pasos 9–14 añaden clientes **sin volver a
pagar estos 22 kB**: ya están en chunks compartidos.

**Lo que sí queda como deuda medible, con dueño y con cifra:** `esquemas.ts` es
**un solo módulo** y los esquemas de Zod se construyen en el ámbito del módulo,
así que importar `esqEstadoProgreso` arrastra también `esqItem`, `esqTarjeta`,
`esqErrata`, `esqModulo`, `esqDatoDuro` y `esqEntradaGlosario` —los siete tipos
de ítem incluidos— al navegador, donde **ninguno se usa**: solo los consume
`scripts/validar-banco.ts`, que corre en Node. Partirlo en
`esquemas-progreso.ts` (lo que el navegador necesita) y `esquemas-contenido.ts`
(lo que solo necesita el validador) recortaría buena parte de los 5,0 kB del
chunk `571` y podría reducir el árbol de Zod que sobrevive al tree-shaking.
**No se hace en este paso:** §5 del blueprint dicta `src/lib/esquemas.ts` como un
archivo único y §22 regla 2 manda copiarlo tal cual; partirlo es una desviación
que necesita ADR. Decidirlo junto con la deuda del barrel de `radix-ui`
(`PENDIENTES.md` → Pasos 9 y 11), que es el mismo tipo de problema y se toca en
el mismo momento.

---

## Ayudantes de UI en `src/lib/utils.ts`

| Función | Qué hace | Test |
|---|---|---|
| `cn(...)` | Une clases y resuelve conflictos de Tailwind | ✅ |
| `CLASES_BLOQUE` | Mapa **estático** bloque → clases (`bg-`, `text-`, `border-`, `-suave`). Tailwind no genera clases interpoladas | ✅ |
| `claseAcentoBloque(bloque)` | Clase de relleno del acento de contexto: color del bloque, o `bg-primary` si no hay bloque | ✅ |
| `bloqueDeRuta(pathname)` | Bloque en contexto a partir de la ruta, o `null`. Probado contra los 29 slugs reales | ✅ |

> `bloqueDeRuta` solo se usa desde Client Components, y es **la única vía** de
> conocer el bloque en el encabezado: el layout raíz **no recibe los `params`** de
> las rutas hijas, así que ahí no existe forma de servidor de leer la ruta. En una
> **página** no se usa — la página conoce su bloque por `params` y lo pasa como
> prop (regla de DISENO.md §2.4).
| `normalizar(texto)` | Quita tildes y baja a minúsculas | ✅ |
| `porcentaje(c, t)` | Redondea sin dividir por cero | ✅ |

---

## Componentes de shadcn/ui disponibles

En `src/components/ui/`, generados por el CLI en el Paso 1. **No se editan a
mano** salvo decisión registrada: `accordion`, `alert`, `badge`, `button`,
`card`, `dialog`, `input`, `label`, `progress`, `scroll-area`, `select`,
`separator`, `sheet`, `skeleton`, `sonner`, `switch`, `tabs`, `tooltip`.

Deuda conocida, sin resolver aquí porque implicaría editar los 18 archivos: sus
variantes traen `transition-all`, que DISENO.md §5.2 prohíbe (anima propiedades
de layout y produce tirones en gama media). Revisar cuando alguna pantalla lo
note.

---

## Todavía no existe (no volver a inventarlo, buscar su paso)

| Qué | Paso |
|---|---|
| Los 7 componentes de ítem, `EnvoltorioItem`, `Retroalimentacion`, `ControladorSesion` | 9 |
| `ControladorRepaso` | 10 |
| `CronometroVisual`, `PanelNavegacion`, `DialogoReanudar` | 11 |
| `VistaInforme`, `BarrasDominio`, `TemasPrioritarios`, `RevisionItems` y la **escala de umbral** de DISENO.md §4.4 | 12 |
| `VistaPlan` | 13 |
| Portada real: `TarjetaContinuar`, `Racha`, `ResumenInicio` | 14.4 |
| `AvisoInstalar` (PWA), `BuscadorGlosario`, `Calculadora`, `MazoDatosDuros`, `PanelAjustes`, `AvisoRespaldo` | 18 |

---

## Decisiones ya cerradas

- **¿Dónde vive el rótulo del bloque?** Resuelto el 2026-07-30 como **regla del
  sistema** en DISENO.md **§2.4**: lo monta la página con `<RotuloBloque>`, encima
  de su `<h1>`. Ya no es una decisión pendiente ni una tarea de un paso concreto.
  Ver el contrato correspondiente más arriba.
- **El foco se funde con la lengüeta del destino activo** (A-04 de
  `ACCESIBILIDAD.md`): aceptado sin cambio de código, DISENO.md **§4.6**, con las
  tres condiciones que obligarían a reabrirlo.
