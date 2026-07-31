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
- **El pie se oculta, no se desmonta,** durante un simulacro activo. ✅
  **CONSTRUIDO en el Paso 11** tal como se especificó aquí, y **`Pie` sigue
  siendo Server Component**. El mecanismo que decía antes este archivo —`hidden`
  sobre el `<Pie />` desde `Shell`— **era inviable**: `Shell` es servidor y no
  puede leer `localStorage`. El contrato correcto es un envoltorio cliente que
  recibe el pie como `children`:

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
  por el atributo. **Y descartado** volver `Pie` cliente. Suma **una** alta a
  §10.3.

  **Lo que el Paso 11 añadió al contrato, y no estaba previsto:** el envoltorio
  importa `@/lib/sesion-activa`, **no** `@/lib/almacenamiento`. Vive en `Shell`,
  o sea en el **layout raíz**, así que lo que importe lo descargan TODAS las
  rutas: con el módulo grande, Zod y `esqEstadoProgreso` entraban en la primera
  carga de la portada y `/layout` subía de 132.0 a **148.4 kB gz**. Con el módulo
  pequeño, +0.5. Ver **ADR-021**. La lección es general: **antes de importar algo
  desde un componente del layout raíz, mira qué arrastra** — el canario de
  ADR-010 no lo detecta, porque vigila contenido y esto es una dependencia.
- **Ningún Client Component importa `content/`.** Ni `estructura`,
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

## Teoría MDX (Paso 7)

> **Actualizada tras ADR-014 (Paso 8b).** El registro de erratas se eliminó de la
> app: se fueron `PaginaErratas`, `FichaErrata`, `AlertaContradiccion` y el mapa
> `ESTILO_ERRATA` / `CLASES_DT_ERRATA`, junto con la ruta `/erratas` y
> `content/erratas.ts`. **`Ojo` es el único recuadro de contenido de la teoría.**

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaModulo` | `src/app/modulos/[slug]/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]` · los 29 slugs se prerenderizan |
| `RenderizadorMdx` | `src/components/mdx/renderizador.tsx` | Server **async** | `fuente: string` | `PaginaModulo` |
| `componentesMdx` | `src/components/mdx/componentes.tsx` | mapa | — | `RenderizadorMdx` |
| `Dato` | `src/components/mdx/dato.tsx` | Server | `etiqueta`, `valor`, `nota?` | el MDX de teoría |
| `Formula` | `src/components/mdx/formula.tsx` | Server | `children`, `nota?` | el MDX de teoría |
| `TablaClave` | `src/components/mdx/tabla-clave.tsx` | Server | `titulo?`, `children` | el MDX de teoría |
| `Ojo` | `src/components/mdx/ojo.tsx` | Server | `children` | el MDX de teoría |
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
- **`<Ojo>` lleva barra lateral de 4px y nunca marco completo** (DISENO.md §6.1).
  Hasta ADR-014 la barra era además lo que lo separaba de `<AlertaContradiccion>`;
  hoy se sostiene por su propio motivo: un aparte dentro del hilo de lectura no se
  encierra. **El marco completo queda libre** para el primer componente futuro que
  sea de verdad una interrupción del texto — y ese componente pasa antes por §6.
  Sus clases son literales y viven en el propio archivo: ya no hay mapa de estilos
  que importar.
- **`.prose-idoneo` solo pone ritmo, no tamaños de encabezado.** Los de `h2` y
  `h3` ya los fija `@layer base` desde la escala de DISENO.md §2.3; §12.1 proponía
  `text-2xl`/`text-xl`, que los sacaría de esa escala. **Si un paso futuro añade
  una regla a `.prose-idoneo`, no repite tamaños de encabezado.**
- **El MDX de un módulo empieza en `##`.** El `<h1>` lo pone la página desde
  `content/estructura.ts` (§14.1). `/modulos/[slug]` es `h1 → h2` (etapas,
  objetivos, teoría, conceptos clave) `→ h3` (los del MDX). Sin saltos y con un
  solo `h1`. **ADR-014 retiró la sección «Ojo con las cartillas en este módulo»**,
  que era otro `h2`: la jerarquía no cambia de forma, solo pierde un hermano.
- **Toda tabla del MDX se envuelve en `.tabla-desliz`,** un `<div>` con
  `overflow-x: auto` y **`tabIndex={0}`**. Lo pone el mapeo de `table` en
  `componentes.tsx`, así que aplica también a las tablas sueltas: el autor del
  contenido no tiene que acordarse de envolverlas. El `tabIndex` no es opcional
  —un contenedor con `overflow` no es alcanzable con el teclado en Chromium, y
  sin él la mitad derecha de la tabla de zonas queda fuera del alcance de quien
  no usa ratón (WCAG 2.1.1)—. Dentro de `<TablaClave>` el marco (`.marco-tabla`)
  le cede el margen al envoltorio, con dos reglas de la misma capa CSS y no con
  dos utilidades de margen compitiendo, cuyo orden Tailwind decide.
- **`overflow-wrap` va por rol de celda, no en la tabla entera.**
  *(Corregido en el Paso 8b — corrige A-22.)* A-22 puso `overflow-wrap: anywhere`
  en `.prose-idoneo table` contando con la herencia. Lo que no midió es que
  `anywhere` **no solo autoriza el corte al maquetar: rebaja la anchura mínima
  intrínseca de la celda a UN carácter**, y `table-layout: auto` la toma como
  suelo de columna. Con ese suelo, la cabecera de la tabla de zonas de C5 se leía
  **«Zon/a», «Aeróbi/co», «Sustrat/o»**. El reparto que queda:

  | Selector | Valor | Por qué |
  |---|---|---|
  | `.prose-idoneo table` | — (se retira) | la herencia era el problema |
  | `.prose-idoneo th` | `normal` | un rótulo no se parte nunca; y como el suelo de una columna es el **máximo** de los de sus celdas, el `<th>` pasa a sostener la columna |
  | `.prose-idoneo td` | `break-word` | el propósito de A-22 —que una cadena inquebrable envuelva en vez de desbordar— acotado a los **valores** |
  | `td::before` en la ficha (§3.2) | `normal` | en la ficha el **rótulo vive dentro de un `<td>`** (es el texto del `<th>` recortado, servido por `--et-N`), así que la regla de `th` no lo alcanza |

  **`break-word` y no `anywhere` en el `<td>`, y la diferencia se midió:** con
  `anywhere` ya acotado a la celda de datos, a 640 px **«exclusivamente» seguía
  partiéndose** en la tabla de zonas. `break-word` no toca el mínimo intrínseco
  —el suelo sigue siendo la palabra más larga— y solo parte cuando la palabra por
  sí sola no cabe en su línea, que es el caso residual que A-22 quería cubrir.
  Lo que se cede: si algún día una cadena monstruosa hace que la tabla no quepa,
  el desbordamiento vuelve a `.tabla-desliz`, que existe para eso y ya es
  enfocable (A-10/A-19). **Se prefiere un desbordamiento hipotético en un
  contenedor diseñado para desbordarse antes que un corte real y presente en la
  tabla de más valor de la app.**

  **Cómo se verifica** (es reproducible y no depende del ojo): se envuelve cada
  palabra de cada celda en un `Range` y se cuentan las filas distintas de sus
  `getClientRects()`; más de una fila = palabra partida. Y se repite la medición
  forzando `overflow-wrap: normal !important` en las celdas: un corte que aparece
  en **las dos** pasadas es un corte tipográfico natural (UAX#14) y no culpa de
  la hoja. Medido en 9 anchos (360 → 1280 px) sobre las dos tablas de C5, 35
  celdas y 188 palabras por ancho: **0 palabras partidas por la hoja**, en ficha
  y en retícula, y **0 desbordamientos** de documento y de contenedor. El único
  corte que queda es `80–90` a partir de 768 px, presente también en el control:
  es el salto tras el signo `–`, comportamiento normal de línea.
- **Los `<p>` del `<Ojo>` NO llevan `my-0` / `mb-0`, y es deliberado.** El
  recuadro vive dentro de `.prose-idoneo`, que da `margin-block: 1rem` a todo
  `<p>`; su contenido es prosa del autor y debe conservar el ritmo de párrafo.
  Solo se recortan los márgenes contra el borde del recuadro
  (`[&>p:first-child]:mt-0` / `[&>p:last-child]:mb-0`).
- **El recuadro va a 15px / 1.5** («Cuerpo de interfaz» de §2.3), con
  `leading-[1.5]` **explícito**: sin él heredaría el 1.65 de la teoría y el
  recuadro dejaría de leerse como aparte.
- **El `<aside>` lleva nombre accesible y sale de la lista de landmarks.** Es A-09:
  un módulo con varios recuadros anunciaría varios *complementary* idénticos. Se
  resuelve con `role="note"` + `aria-label="Ojo con esto"` —`aria-label` y no
  `aria-labelledby` porque el título es fijo y no hay clave única con la que
  construir un `id` sin arriesgar colisiones cuando un módulo monta varios.
- **`/modulos/[slug]` monta `RotuloBloque`.** Regla de DISENO.md §2.4: aparece
  porque hay exactamente un bloque en contexto (`modulo.bloque`).
- **La ruta no lee el progreso del usuario.** Las etapas del módulo
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
| `/modulos/[slug]/page` | **106.9 kB** | 6 | servidor puro |

La ruta nueva cae dentro del piso de servidor puro (103–107 kB), así que no hay
nada que investigar. Los +0.5 kB del CSS son `.prose-idoneo`; el js del armazón
**no se movió**, que es lo esperado de un paso sin un solo componente cliente. El
`grep` de ADR-010 sigue sin encontrar nada.

> ⚠ **Las cifras de este bloque son la línea base del Paso 7 y ADR-014 la movió.**
> La tabla traía además `/erratas/page` (**106.9 kB gz**, 6 chunks), ruta que ya no
> existe; y el CSS del layout perdió las reglas que solo servían a la alerta y a la
> ficha. **Los números de arriba se conservan como registro histórico del Paso 7 —
> no son la base contra la que comparar el Paso 9.** La remedición va con el cierre
> del Paso 8b.

---

## Etapas del módulo y mazo de tarjetas (Paso 8)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaTarjetas` | `src/app/modulos/[slug]/tarjetas/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]/tarjetas` · los 29 slugs se prerenderizan |
| `EtapasModulo` | `src/components/modulo/etapas-modulo.tsx` | **Client** | `datos: DatosEtapas`, `etapaActual?: 1\|2\|3\|4` | las **cuatro** páginas de etapa (el Paso 9 añadió práctica y quiz) |
| `DatosEtapas` | idem (tipo) | tipo | `{ slug, bloque, hayTeoria, totalTarjetas, totalItems }` | las cuatro páginas lo construyen en el servidor · `totalItems` lo añadió el Paso 9 |
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
- ~~**Las etapas 3 y 4 no enlazan a ninguna parte.**~~ **Resuelto en el Paso 9**,
  exactamente como este contrato anticipaba: se les dio `href` en `construirFilas`,
  condicionado a `totalItems > 0`. Lo que sigue describe el estado del Paso 8 y se
  conserva porque explica por qué la fila es un `<div>` cuando no hay a dónde ir.
  **Las etapas 3 y 4 no enlazan a ninguna parte.** Sus rutas nacen en el Paso 9;
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
- ~~**El mazo registra `tarjetasVistas` y nada más.**~~ **Cambiado en el Paso 10:**
  cada tarjeta respondida entra además a la cola de repaso con
  `registrarRevision` (no con `encolar` — ver la sección del Paso 10). Lo que
  **no** cambió es la regla del subconjunto: en la pasada de repaso de las
  falladas (`esRepaso`) no se escribe ni `tarjetasVistas` ni la cola.
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
- **La acción primaria son los botones, a 52px; el teclado es ayuda secundaria.**
  *(Corregido en el Paso 8b. Antes la única línea de instrucción de la pantalla
  era «Con el teclado: Enter / 1 / 2», y este mazo se estudia desde el celular —
  mobile-first es restricción dura del brief.)* «Ver la respuesta», «La sabía» y
  «No la sabía» llevan `min-h-[52px]`, la medida que DISENO.md §3 reserva para
  las **opciones de ítem**, porque eso es exactamente lo que son: la respuesta a
  la tarjeta. Los dos botones del resumen se quedan en el piso general de 44px:
  son navegación, no respuesta. Medido en navegador: 343×52 px a 375 px de ancho.
- **El atajo escucha en `window`, y eso corrige un fallo real.** Vivía en un
  `<div onKeyDown>` **sin `tabIndex`** — un div no enfocable no recibe teclado,
  así que `1`/`2` solo funcionaban mientras el foco siguiera dentro por
  casualidad, y bastaba pulsar una zona neutra (foco al `<body>`) para que el
  mazo dejara de responder. Es el hallazgo que el `code-reviewer` dejó abierto en
  el Paso 8 y **no se resuelve solo** al agrandar los botones: la gestión de foco
  ya era correcta, el agujero estaba en el foco perdido. Ahora es un
  `useEffect` + `window.addEventListener('keydown', …)`, el patrón de §13 del
  blueprint (`opcion-unica.tsx`). Verificado en navegador: con el foco forzado a
  `<body>`, `1` avanza de «Tarjeta 1 de 15» a «Tarjeta 2 de 15» y `2` de la 2 a
  la 3. Y el recorrido completo de las 15 tarjetas sale **sin un solo clic**.
  - El efecto **no toca `Enter`**: la activación del botón enfocado ya es nativa
    y duplicarla dispararía dos veces. Por eso el atajo anunciado es solo `1`/`2`.
  - Guarda contra `INPUT`/`TEXTAREA`/`SELECT`/`contentEditable` y contra
    `alt`/`ctrl`/`meta`. Hoy el mazo no tiene campos de texto; un atajo global que
    se comiera el «1» de un input sería un fallo carísimo de encontrar.
- **La ayuda de teclado se muestra por MODALIDAD, no por ancho.**
  `[@media(any-pointer:fine)]:block` en vez del `hidden sm:block` anterior.
  `sm:` era un proxy de ancho para una pregunta de entrada, y fallaba en los dos
  sentidos. Medido con emulación de dispositivo: **Pixel 5 y iPhone 12 → oculta**
  (`any-pointer: coarse`); **escritorio a 375 px y a 1280 px → visible**
  (`any-pointer: fine`). Coste en CSS: 0 B gz medidos. El caso que queda fuera es
  la tableta táctil con teclado externo sin ratón — el atajo sigue funcionando,
  solo no se anuncia; no hay media query para «hay teclado».
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
  `h2` para etapas, objetivos, teoría y conceptos. `/modulos/[slug]/tarjetas`:
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
`useEstado()`. Lo mismo pasa con `estadoContenido` y `minutosEstimados`: son
**nombres de campo de esquemas**, no datos.

**Regla del canario, para no volver a elegir mal: tiene que ser un VALOR de
contenido, nunca un nombre de campo** —los nombres de campo viajan legítimamente
dentro de los esquemas de Zod— **y tiene que salir de un archivo de `content/` que
ningún Client Component pueda importar jamás** (los datos entran por prop desde un
Server Component; ver ADR-010).

**Los dos canarios vigentes:**

```bash
grep -rl "osteomuscular"    .next/static/chunks/   # content/estructura.ts
grep -rl "Malondialdehído"  .next/static/chunks/   # content/datos-duros.ts
```

| Canario | De dónde sale | Por qué sirve |
|---|---|---|
| `osteomuscular` | título de módulo de `content/estructura.ts` | limpio al cerrar el Paso 8. Es el que ya documentaba este archivo |
| `Malondialdehído` | valor de `DD-073` en `content/datos-duros.ts` | **sustituye a la sonda de erratas** (`diceLaCartilla`, «Las cartillas se contradicen»), que ADR-014 dejó sin objeto. Cadena única: no aparece en ningún otro archivo del repo, ni en `content/` ni en `src/` |

**No sirven como canario** las cadenas de `content/banco/` ni de
`content/tarjetas/`: esos módulos **sí** entran al bundle cliente a propósito, con
`import()` dinámico bajo interacción, desde el Paso 11. Un canario ahí daría falso
positivo el día que el simulacro funcione bien.

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

> **Remedida al cerrar el Paso 8b** (mismo comando, misma métrica):
> `/layout` js **131.9 kB gz** (131 913 B) · css **13.5 kB gz** (13 542 B) ·
> total **145.5 kB gz** — el js no se mueve, el css sube **11 B gz** medidos, que
> es lo que cuestan las tres declaraciones de `overflow-wrap` por rol de celda.
> `/modulos/[slug]/page` **134.0 kB gz**, sin cambio.
> `/modulos/[slug]/tarjetas/page` **136.0 kB gz**, **+0.2 kB** sobre los 135.8.
> **Los 8 chunks compartidos son byte a byte los mismos** (mismos hashes que
> `/modulos/[slug]`): todo el delta está en el chunk propio de la ruta,
> `app/modulos/[slug]/tarjetas/page-*.js`, que pasa de **2.36 a 2.57 kB gz**. Lo
> paga el `useEffect` con el listener de `window` y su guarda contra campos de
> texto —que sustituye a un `onKeyDown` de tres líneas— más las clases de tamaño
> de los tres botones. **Cero dependencias nuevas y cero imports nuevos**; el
> canario de ADR-010 sigue limpio.

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
`esqModulo`, `esqDatoDuro` y `esqEntradaGlosario` —los siete tipos de ítem
incluidos— al navegador, donde **ninguno se usa**: solo los consume
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

## Los 7 tipos de ítem y la sesión (Paso 9)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaPractica` | `src/app/modulos/[slug]/practica/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]/practica` · los 29 slugs se prerenderizan |
| `PaginaQuiz` | `src/app/modulos/[slug]/quiz/page.tsx` | Server | `params: Promise<{ slug }>` | ruta `/modulos/[slug]/quiz` · ídem |
| `ModoItem`, `PropsItem`, `enRevision`, `editable` | `src/components/items/contrato.ts` | tipos | — | los 7 componentes, el envoltorio y el controlador |
| `BotonOpcion`, `LETRAS`, `useAtajoNumerico` | `src/components/items/opcion.tsx` | pieza compartida | ver abajo | `unica`, `caso`, `multiple`, `vf` |
| `OpcionUnica`, `GrupoOpcionUnica` | `src/components/items/opcion-unica.tsx` | **Client** | `PropsItem<number, ItemUnica \| ItemCaso>` | `EnvoltorioItem`, `Caso` |
| `Caso` | `src/components/items/caso.tsx` | **Client** | `PropsItem<number, ItemCaso>` | `EnvoltorioItem` |
| `OpcionMultiple` | `src/components/items/opcion-multiple.tsx` | **Client** | `PropsItem<number[], ItemMultiple>` | `EnvoltorioItem` |
| `VerdaderoFalso` | `src/components/items/verdadero-falso.tsx` | **Client** | `PropsItem<boolean, ItemVerdaderoFalso>` | `EnvoltorioItem` |
| `Emparejar` | `src/components/items/emparejar.tsx` | **Client** | `PropsItem<[number,number][], ItemEmparejar>` | `EnvoltorioItem` |
| `Calculo`, `aNumero` | `src/components/items/calculo.tsx` | **Client** | `PropsItem<number \| null, ItemCalculo>` | `EnvoltorioItem` |
| `Ordenar` | `src/components/items/ordenar.tsx` | **Client** | `PropsItem<number[], ItemOrdenar>` | `EnvoltorioItem` |
| `EnvoltorioItem` | `src/components/items/envoltorio-item.tsx` | **Client** | `PropsItem` | `ControladorSesion`, `ResumenSesion` |
| `Retroalimentacion` | `src/components/items/retroalimentacion.tsx` | **Client** | `item`, `correcta`, `respondida` | `ControladorSesion`, `ResumenSesion` |
| `useSesion`, `ResumenSesion` (tipo), `ResultadoItem` | `src/hooks/usar-sesion.ts` | **Client** | `(items: readonly Item[]) => Sesion` | `ControladorSesion` |
| `ControladorSesion`, `RegistroSesion` | `src/components/sesion/controlador-sesion.tsx` | **Client** | ver contrato abajo | las dos páginas nuevas |
| `ResumenSesion` (componente) | `src/components/sesion/resumen-sesion.tsx` | pieza compartida | `resumen`, `clase`, `volver`, `siguiente?`, `onRepetir`, `ref` | `ControladorSesion` |
| `Boton` | `src/components/sesion/boton.tsx` | pieza compartida | `variante?`, `onClick`, `inactivo?`, `className?` | el controlador y el resumen |

**Once altas a la lista cerrada de §10.3**, las once previstas por el blueprint: los
7 componentes de ítem, `envoltorio-item.tsx`, `retroalimentacion.tsx`,
`controlador-sesion.tsx` y `usar-sesion.ts`. En la cuenta de «clientes propios» de
este documento son **10** —`usar-sesion.ts` vive en `hooks/` y queda fuera del
filtro, igual que `usar-estado.ts`—, así que la app pasa de **9 a 19**:

```bash
grep -rlE "^\s*['\"]use client['\"];?\s*$" src/ | grep -v "src/components/ui/\|src/hooks/"   # 19
grep -rlE "^\s*['\"]use client['\"];?\s*$" src/                                              # 33
```

`opcion.tsx`, `boton.tsx` y `resumen-sesion.tsx` **no llevan la directiva y no son
altas**: §10.3 lista los archivos que la declaran, y un módulo importado desde un
Client Component ya se compila para el cliente sin declararla. Existen para que la
misma opción, el mismo botón y la pantalla de cierre no se escriban cuatro veces.

### Contratos de este paso

- **`PropsItem` es genérico en el tipo del ítem**, a diferencia de §13 del
  blueprint, que declara `item: Item` y hace `item as ItemUnica` dentro de cada
  componente. Con el genérico, los 7 componentes reciben ya su variante y **no
  llevan ni un cast**; el único del sistema vive en el `switch` de
  `envoltorio-item.tsx`, que es donde el compilador puede vigilarlo (su `default`
  comprueba exhaustividad con `satisfies never`: un octavo tipo de ítem rompe ahí
  y en ningún otro sitio).
- **El enunciado y la viñeta los pinta `EnvoltorioItem`, no los componentes.** Es
  lo que garantiza que los 7 tipos se presenten igual y lo que permite que `caso`
  ponga su viñeta **antes** de la pregunta, como manda §4. Consecuencia:
  `caso.tsx` es un adaptador sobre `GrupoOpcionUnica`, porque su control es
  idéntico al de `unica`. Mantener dos copias las habría desincronizado.
- **Los cuatro modos, y el que todavía no tiene productor.** `respondiendo`,
  `revision-correcta` y `revision-incorrecta` se usan hoy. **`bloqueado` no lo
  produce nadie**: nace con el simulacro cronometrado del Paso 11 (respondió, la
  respuesta queda fija, aún sin veredicto). Está implementado en los 7 porque
  añadirlo después obligaría a volver a los siete archivos.
- **La calificación nunca la decide un componente.** La hace `calificar()` de
  `src/lib/simulacro.ts` y llega a la interfaz convertida en `modo`. En
  `calculo` eso incluye la **tolerancia**: el componente entrega un número y solo
  *muestra* el margen en revisión; no compara nada.
- **`calculo` acepta coma y punto** (`Number(texto.replace(',', '.'))`, expuesto
  como `aNumero`) y viaja como `number | null`. `null` es «vacío o ilegible», que
  es lo que `sinResponder()` entiende por no responder: **nunca se manda `NaN`**,
  que contaría como respondido y errado. El campo es `type="text"` con
  `inputMode="decimal"` — `type="number"` no trae coma en varios teclados Android
  y borra en silencio lo que no parsea.
- **Ni `emparejar` ni `ordenar` tienen arrastrar y soltar, ni siquiera como
  añadido.** Emparejar es tocar izquierda → tocar derecha; ordenar son botones
  ↑ ↓ de 44 × 44. No es una alternativa accesible pegada al lado del mecanismo
  bueno: **es el mecanismo**, y por eso funciona igual con el pulgar, con teclado
  y con lector de pantalla, sin modo aparte. Verificado en navegador:
  `[draggable=true]` devuelve **0** elementos.
- **El portador no cromático de cada tipo.** `emparejar` numera las parejas y el
  número aparece en los dos lados; `ordenar` numera la posición; las opciones
  llevan icono (Check/X) **y** texto solo para lector de pantalla («Esta era la
  correcta», «Incorrecta, y es la que elegiste»). El color nunca va solo
  (DISENO.md §1.2).
- **En revisión, `emparejar` cambia de presentación.** Deja las dos columnas y
  muestra «izquierda → lo que elegiste», con la correcta debajo cuando falló.
  Colorear las dos columnas obligaría al usuario a reconstruir de memoria qué unió
  con qué.
- **`aria-disabled` en vez de `disabled`, en todos los controles inertes.** Un
  botón deshabilitado sale del orden de tabulación, y en revisión quien navega con
  teclado tiene que poder recorrer las opciones para leer cuál era la correcta. El
  clic se ignora en el handler.
- **La región `aria-live="polite"` está SIEMPRE montada**, en el controlador, y la
  retroalimentación entra dentro. Una región viva que aparece en el DOM junto con
  su contenido no se anuncia de forma fiable: el lector necesita haber visto la
  región vacía antes.
- **La explicación no existe hasta que se responde.** Verificado en navegador en
  las 8 posiciones de una tanda y en los 7 tipos: `section[aria-label="Explicación
  de la respuesta"]` tiene **count 0** antes de «Comprobar».
- **El teclado es ayuda secundaria, igual que en el mazo de tarjetas.** Los
  botones de 52 px son la vía primaria; los atajos se anuncian en una línea
  discreta y solo bajo `[@media(any-pointer:fine)]`. `useAtajoNumerico` escucha en
  `window` —no en un contenedor sin `tabIndex`, que fue el fallo del Paso 8— y
  guarda contra `INPUT/TEXTAREA/SELECT/contentEditable` y contra los
  modificadores: el ítem de cálculo **tiene** un campo de texto, así que un atajo
  que se comiera el «1» sería un fallo real, no hipotético.
- **`Enter` avanza; `Enter` NO cierra la tanda.** Terminar es irreversible dentro
  del intento y merece un clic deliberado. Y hay una asimetría a propósito:
  **«Comprobar» funciona sin haber respondido** —es «no sé esta, muéstrame la
  respuesta», acción legítima en la etapa donde se aprende, y la
  retroalimentación lo dice con esas palabras: «La dejaste sin responder»— pero
  **`Enter` exige haber respondido**, para que nadie queme un ítem por apoyarse en
  la tecla. Bloquear el botón, que era la primera versión, dejaba al usuario
  atrapado en un ítem que no sabe.
- **`ControladorSesion` sirve a las cuatro sesiones.** Lo que cambia viaja en el
  `blueprint` (cuántos ítems, de dónde, con cronómetro o sin él,
  `feedbackInmediato`) y en `registro`, que dice qué se escribe al terminar:
  `{clase:'practica'|'quiz', slug}` o `{clase:'suelta'}` para las que guardan un
  `IntentoSimulacro` por otra vía. **El Paso 11 no debería tener que tocar su
  contrato**, solo añadir cronómetro y persistencia de `SesionCronometro`.
- **La semilla nace en el handler de «Empezar»** (`Date.now()`, §10.4) y de ella
  salen las dos cosas aleatorias: `armarSimulacro` y `presentarTanda`. Por eso hay
  pantalla previa: sin ella habría que sortear en el render. Repetir la tanda
  genera semilla nueva y **remonta la sesión con `key={semilla}`**, que es lo que
  garantiza que no sobreviva ni una respuesta ni un foco del intento anterior.
- **El quiz escribe `registrarQuiz(slug, puntaje, ahora)` y nada más.** NO guarda
  un `IntentoSimulacro`: eso exige el desglose por bloque, módulo y nivel de
  `src/lib/informe.ts`, que nace en el Paso 12 junto con `/resultados/[intentoId]`.
  Guardar hoy un intento a medias dejaría registros que ese paso tendría que
  migrar. La práctica escribe `marcarPracticaCompletada`.
- **El puntaje se calcula en `usar-sesion.ts` con `Math.round(correctas/total*100)`,
  y es deuda declarada.** Es la fórmula de `calcularPuntaje` (§7.5), que todavía no
  existe: **el Paso 12 es su dueño** y cuando cree `src/lib/informe.ts` esa línea se
  sustituye por la llamada. Está marcada con comentario en el archivo.
- ~~**Nada de esto encola en el SRS todavía.**~~ **Resuelto en el Paso 10**, en el
  punto que este contrato anticipaba: el handler `cerrar` de
  `controlador-sesion.tsx` encola con `encolar()` los `detalle[]` con
  `correcta === false`. Ver la sección del Paso 10 para el porqué de `encolar` y
  no `registrarRevision`, y para el comportamiento en `clase: 'suelta'`.
- **Las etapas 3 y 4 ya enlazan.** `DatosEtapas` gana **`totalItems`** y
  `construirFilas` da `href` a las dos etapas cuando el módulo tiene banco. Las
  cuatro páginas que montan `EtapasModulo` pasan el campo, así que **añadir un
  campo nuevo a `DatosEtapas` obliga a tocar las cuatro** — es el precio de que el
  cliente no importe `content/` (ADR-010). El texto de las etapas sin contenido
  pasó de «Todavía no está lista» a «Sin publicar», que es lo que de verdad ocurre.
- **El enunciado se pinta como texto plano.** §4 dice que admite markdown en línea;
  ningún ítem de C5 lo usa y montar un renderizador en el cliente costaría peso por
  nada. Si un módulo de los pasos 15–17 lo necesita, se resuelve en
  `envoltorio-item.tsx`, en un solo sitio.
- **ADR-014, y lo que NO se construyó.** El panel de retroalimentación muestra
  veredicto → `explicacion` → `pasos` si es cálculo → `referencia`, y **nada más**.
  §13 del blueprint describe además un cuadro de contradicción entre cartillas: no
  se montó, `<AlertaContradiccion>` no existe y el campo `contradiccion` de
  `ItemBase` tampoco.

### Peso — las dos métricas, medidas al cerrar el paso

| | gz |
|---|---|
| **`/layout` js — MÉTRICA OFICIAL** | **131.9 kB** (131.9 en el Paso 8b: **sin cambio**) |
| `/layout` css | 13.5 kB → **13.6 kB** |
| `/layout` total | 145.5 kB → **145.5 kB** |

| Ruta | js gz | chunks | Antes |
|---|---|---|---|
| `/modulos/[slug]/page` | **133.9 kB** | 9 | 134.0 kB (Paso 8b) |
| `/modulos/[slug]/tarjetas/page` | **136.0 kB** | 9 | 136.0 kB |
| `/modulos/[slug]/practica/page` | **143.4 kB** | 10 | — (nueva) |
| `/modulos/[slug]/quiz/page` | **143.4 kB** | 10 | — (nueva) |

**+7.4 kB gz sobre `/tarjetas`, que es la ruta comparable. Investigado antes de
cerrar, como manda la regla, y explicado — no es un import accidental.** Diferencia
de chunks contra `/modulos/[slug]/tarjetas/page`:

| Chunk | gz | Qué es |
|---|---|---|
| `429-*` | **9.9 kB** (33.0 kB crudos) | todo el código cliente del Paso 9 |
| `page-*` | 0.1 kB | la propia ruta |

Verificado por sondeo de cadenas dentro del chunk: contiene `crearRng`
(`0x6d2b79f5`), el muestreo de `armarSimulacro`, los textos de los 7 componentes
(«Ya formaste las», «Margen aceptado», «Terminaste el quiz») y los trazados de los
iconos nuevos de lucide. Es decir: **`src/lib/simulacro.ts` completo + los 7
componentes de ítem + envoltorio + retroalimentación + controlador + resumen +
hook + botón**, por 9.9 kB gz.

`lib/simulacro.ts` viaja al cliente **por diseño, no por descuido**: la semilla
nace de `Date.now()` en un handler (§22 reglas 5 y 6), así que el muestreo y el
barajado ocurren en el navegador. Y es un escalón de una sola vez: **las dos rutas
comparten el mismo chunk `429`** —la segunda cuesta 0.1 kB— y los simulacros del
Paso 11 lo reutilizan entero.

**Lo que no se ve en esta métrica y hay que decir: la carga útil RSC.** Como la
página carga el banco en el servidor y lo pasa por prop (ADR-010), los 28 ítems de
C5 viajan en el documento: `/practica` pesa **17.1 kB gz de HTML** contra los
9.1 kB de `/tarjetas`. Son ~8 kB gz por documento, en la carga útil, **no en los
chunks JS**. Es el precio de que ningún Client Component importe `content/`, y el
canario lo confirma: `grep -rl "osteomuscular"` y `grep -rl "Malondialdehído"`
sobre `.next/static/chunks/` siguen **limpios**, igual que una sonda del propio
banco (`"creatina quinasa\|MLSS"`). Cuando el Paso 11 arme simulacros de 100 ítems
sobre 29 módulos, esta vía no escala y ahí sí toca el `import()` dinámico bajo
interacción que §2.2 previó — **decisión del Paso 11, con el caso difícil
delante.**

### Verificado en navegador, a 375 px, sobre el build de producción

- **Los 7 tipos, recorridos de verdad** (14 tandas hasta que salieron todos):
  opción a 52–86 px de alto según el texto · campo de cálculo 52 px con
  `inputMode=decimal` y coma aceptada · botones ↑ ↓ a 44 px exactos, el elemento
  sube y **el foco se repone** en el botón contrario cuando el que se pulsó
  desaparece al llegar al extremo · emparejar cierra las 4 parejas a toque·toque y
  el estado pasa de «Ahora toca su pareja» a «Ya formaste las 4 parejas» · el
  contador de múltiple va de «Llevas 0 de 2» a «Llevas 2 de 2».
- **Cero desbordamiento horizontal** en los cuatro tipos de más riesgo (`ordenar`,
  `emparejar`, `calculo`, `multiple`) con el ítem en estado interactivo.
- **La explicación llega después y nunca antes**, con su referencia a la cartilla
  en los 7 tipos y con los 4 `pasos` en el de cálculo.
- **Teclado, sin tocar la pantalla:** con el foco forzado al `<body>`, `1` elige,
  `Enter` comprueba y el siguiente `Enter` pasa de «Ítem 1 de 8» a «Ítem 2 de 8».
- **Foco al cerrar:** `document.activeElement` queda en «Terminaste la práctica».
- **Quiz:** no hay botón «Comprobar» ni explicación durante la tanda (count 0 las
  dos), «Marcar» conmuta a «Marcada», la revisión final trae las 10 explicaciones
  y señala el ítem marcado, y el progreso guardado queda
  `{practicaCompletada: true, mejorQuiz: 0, intentosQuiz: 1, dominado: false}`
  tras una pasada en blanco deliberada.

---

## Repaso espaciado — `/repaso` (Paso 10)

| Componente | Archivo | S/C | Props | Quién lo usa |
|---|---|---|---|---|
| `PaginaRepaso` | `src/app/repaso/page.tsx` | Server | — | ruta `/repaso`, destino «Repaso» de las dos barras |
| `ControladorRepaso` | `src/components/sesion/controlador-repaso.tsx` | **Client** | `modulos: readonly ModuloPublicado[]` | `PaginaRepaso` |
| `ModuloPublicado` | `src/components/sesion/repaso-vacio.tsx` | tipo | `{ slug, titulo, bloque }` | la página lo proyecta desde `MODULOS` |
| `siguienteSinDominar`, `AccionSiguiente` | idem | pieza compartida | ver abajo | las cuatro pantallas sin sesión |
| `ColaSinEstrenar`, `NadaPendienteHoy`, `ColaSinContenido`, `CierreRepaso` | idem | pieza compartida | ver el archivo | `ControladorRepaso` |
| `fechaLocalDe` | `src/components/sesion/fecha-local.ts` | pieza compartida | `(momento: Date) => 'YYYY-MM-DD'` | `ControladorRepaso`, `ControladorSesion`, `MazoTarjetas` |

**Un alta a la lista cerrada de §10.3** —`controlador-repaso.tsx`, prevista por el
blueprint—. La app pasa de **19 a 20** clientes propios (34 con `ui/` y `hooks/`):

```bash
grep -rlE "^\s*['\"]use client['\"];?\s*$" src/ | grep -v "src/components/ui/\|src/hooks/"   # 20
grep -rlE "^\s*['\"]use client['\"];?\s*$" src/                                              # 34
```

`repaso-vacio.tsx` y `fecha-local.ts` **no llevan la directiva y no son altas**:
los importa un Client Component y se compilan con él, igual que `boton.tsx` y
`resumen-sesion.tsx`.

### El problema del paso: de dónde sale el contenido de la cola

Es el único caso de la app en que el servidor **no puede** cargar el contenido:
la cola vive en `localStorage`, así que solo el navegador sabe qué hay que
repasar, y la cola **mezcla módulos**. Las rutas anteriores conocían su slug por
`params`.

**Resuelto con `import()` dinámico de `content/tarjetas/indice` y
`content/banco/indice` desde el cliente, cargando solo los módulos que la cola
menciona.** El razonamiento completo, con las dos alternativas descartadas, está
en la cabecera de `controlador-repaso.tsx`. En corto:

- **No viola ADR-010, es el caso que ADR-010 declara permitido.** Su párrafo
  final distingue el import **estático** (prohibido, mete el grafo en el bundle
  inicial) del **dinámico bajo interacción** (que es para lo que §2.2 y §10.2
  regla 4 hicieron `banco/` y `tarjetas/` client-safe). Lo que ADR-010 protege
  es `content/estructura`, y eso **sigue entrando por prop**: `ModuloPublicado`
  son tres campos.
- **La alternativa «el servidor lo manda todo por prop»** —lo que hacen
  `/practica` y `/quiz`— se descartó por medición: hoy costaría ~8 kB gz de carga
  útil RSC, pero a 29 módulos serían ~750 ítems y ~350 tarjetas **en el documento
  de la ruta que se abre a diario**, aunque la cola tenga tres elementos. El
  coste crecería con el contenido y no con el uso.
- **A 29 módulos** el usuario descarga los chunks de los módulos que su cola
  menciona y solo esos. El bundle inicial de `/repaso` no lleva ni un ítem.

### ⚠ Desde este paso HAY contenido del banco en `.next/static/chunks/`

Es la primera vez. Medido en este build:

| Chunk | gz | Qué es | ¿En algún manifest inicial? |
|---|---|---|---|
| `329.*.js` | **9.6 kB** (34.6 kB raw) | `content/banco/c5-umbrales-zonas.ts` | **no** — diferido |
| `886.*.js` | **1.8 kB** (4.8 kB raw) | `content/tarjetas/c5-umbrales-zonas.ts` | **no** — diferido |

Ninguno entra en la primera carga de ninguna ruta: se descargan cuando `/repaso`
resuelve una cola que menciona C5.

**Los dos canarios de ADR-010 siguen siendo válidos y siguen limpios**
(`osteomuscular` → 0, `Malondialdehído` → 0), porque ninguno sale de `banco/` ni
de `tarjetas/` — que es exactamente el motivo por el que este documento ya
advertía que las cadenas de esos dos directorios **no sirven como canario**.
**Cualquier sonda que busque cadenas del banco en los chunks da positivo desde
hoy y hay que retirarla:** `grep -rl "creatina quinasa\|MLSS" .next/static/chunks/`
devuelve ahora los dos chunks de arriba, y eso es lo correcto, no una fuga.

### Contratos de este paso

- **La sesión se congela al empezar.** `colaDelDia` se llama **una vez**, en el
  efecto de preparación. Si se recalculara en cada render, el elemento recién
  respondido desaparecería de la lista bajo los pies del usuario y el contador
  saltaría de «3 de 8» a «3 de 7».
- **`useEstado()` null es el caso NORMAL aquí**, no un estado transitorio: un
  usuario nuevo no tiene nada guardado. Se usa la bandera `montado` de
  `EtapasModulo`; sin ella el esqueleto se queda puesto para siempre en la ruta
  que más gente abre en blanco. Cubierto por test (`controlador-repaso.test.tsx`).
- **El «hoy» del SRS es la FECHA LOCAL, no `soloFecha(...toISOString())`.** Es
  `fechaLocalDe(momento)`, y el porqué está en la cabecera de `fecha-local.ts`:
  Colombia es UTC−5, así que con la fecha UTC la cola del día se adelantaría
  cinco horas cada tarde — justo la franja en la que este usuario estudia—, y el
  intervalo real del SM-2 se acortaría un día de forma sistemática. **Deuda
  declarada:** el helper pertenece a `src/lib/fechas.ts`, junto a `soloFecha` y
  `sumarDias`; no se creó allí porque el Paso 10 tenía `src/lib/` reservado al
  motor. Moverlo no exige tocar nada más.
- **Dos entradas a la cola, y NO usan la misma función del motor.** La diferencia
  es de comportamiento, no de estilo:

  | Punto de enganche | Función | Efecto | Por qué |
  |---|---|---|---|
  | `mazo-tarjetas.tsx`, cada tarjeta respondida | `registrarRevision` | crea si no existe **y programa**: cae a 1 día | con `encolar` (`proximaRevision = hoy`) las 15 tarjetas recién vistas reaparecerían en `/repaso` un minuto después, que es lo contrario del espaciado |
  | `controlador-sesion.tsx`, handler `cerrar` | `encolar` | nace con `proximaRevision = hoy` | §7.2 lo dice expresamente para los ítems fallados, y el efecto es el correcto: lo que fallas hoy se repasa hoy |

  Verificado en navegador: `C5-T01` («no la sabía») queda con `facilidad 2.3` y
  `C5-T02` («la sabía») con `2.6`, las dos a `2026-07-31`; los 8 ítems dejados en
  blanco quedan a `2026-07-30`.
- **Los acertados NO entran a la cola** (brief §6.1: la cola es lo que fallaste,
  no lo que ya dominas). Los dejados en blanco **sí**: `correcta` ya es `false`
  y no responder tampoco es saberlo.
- **La pasada de repaso del mazo (`esRepaso`) no escribe en el SRS.** Registrar
  dos revisiones del mismo elemento con un minuto de diferencia infla
  `repeticiones` y alarga el intervalo sin que haya habido espaciado real. Es el
  mismo criterio que ya aplicaba `registrarTarjetasVistas`.
- **El encolado de ítems no depende de `registro.clase`**, así que el diagnóstico
  y los simulacros del Paso 11 —que entran como `'suelta'`— lo heredan sin tocar
  nada, que es lo que §7.2 pide.
- **`leerEstado(ahoraISO)` y no el snapshot del render** en los tres puntos de
  escritura. La cola es acumulativa y en `cerrar()` hay dos escrituras previas
  (`registrarQuiz` / `marcarPracticaCompletada`): partir de un snapshot de render
  podría perder una.
- **Cuatro pantallas sin sesión, no una.** Cola sin estrenar · nada pendiente hoy
  (con el `proximoEnDias` de `resumirRepaso`) · cola que apunta a contenido no
  publicado · cierre de la sesión. El consejo correcto es distinto en cada una y
  **ninguna rellena la cola con nada**. Las cuatro llevan la misma acción
  concreta: `siguienteSinDominar`, el primer módulo publicado que el usuario no
  domina, en orden de estudio; si no hay ninguno, enlace al índice — no se
  inventa un módulo para tener algo que ofrecer.
- **Un id de la cola sin contenido publicado se omite de la sesión y NO se purga
  de la cola.** El módulo puede publicarse en los pasos 15–17 y su progreso sigue
  siendo válido (§22 regla 12). Si TODOS los pendientes son huérfanos se muestra
  la tercera pantalla, nunca una en blanco.
- **El orden de la sesión no se sortea; las opciones de los ítems sí.** El orden
  lo fija `colaDelDia` (más atrasado primero, desempate por `localeCompare`), que
  es determinista. Las opciones pasan por `presentarTanda(items, semilla)` con
  semilla de `Date.now()` **dentro del efecto** (§10.4): sin barajar, repasar tres
  veces el mismo ítem fallado enseña la posición de la correcta, no el contenido.
  Cero `Math.random()`.
- **`/repaso` NO monta `RotuloBloque`** (DISENO.md §2.4: exige exactamente un
  bloque en contexto). El bloque se comunica elemento a elemento: la banda de
  avance toma el color del bloque del elemento en pantalla y el contador dice de
  qué módulo es.
- **El contador `role="status"` dice también QUÉ se está repasando**: «Elemento 3
  de 8 · tarjeta de Umbrales y zonas de entrenamiento» / «· pregunta de …». La
  cola mezcla dos cosas con gestos distintos y el usuario tiene que saber cuál
  tiene delante antes de tocar.
- **La calificación de un ítem la hace `calificar()`**, nunca el componente, igual
  que en la sesión. «Comprobar» sin haber respondido es «no sé esta» y cuenta
  como fallo, que es la verdad.
- **Teclado igual que el mazo y la sesión:** listener en `window` con guarda
  contra `INPUT/TEXTAREA/SELECT/contentEditable` y modificadores; `1`/`2` solo
  cuando hay una tarjeta revelada; `Enter` comprueba y avanza; la ayuda se anuncia
  bajo `[@media(any-pointer:fine)]`. Los `1`–`4` de los ítems los aportan los
  propios componentes de opción, sin código nuevo.

### Peso — las dos métricas, medidas al cerrar el paso

| | gz |
|---|---|
| **`/layout` js — MÉTRICA OFICIAL** | **132.0 kB** (131 999 B · 131 913 B en el Paso 9: **+86 B**, churn de hash por el resplit de chunks) |
| `/layout` css | **13.6 kB** (13 599 B, sin cambio) |
| `/layout` total | **145.6 kB** |

| Ruta | js gz | chunks | Antes |
|---|---|---|---|
| `/repaso/page` | **144.0 kB** | 10 | — (nueva) |
| `/modulos/[slug]/page` | 134.2 kB | 9 | 133.9 kB |
| `/modulos/[slug]/tarjetas/page` | 136.6 kB | 9 | 136.0 kB |
| `/modulos/[slug]/practica/page` | **145.1 kB** | 11 | 143.5 kB |
| `/modulos/[slug]/quiz/page` | **145.1 kB** | 11 | 143.5 kB |

**`/repaso` a 144.0 kB no es una anomalía y se explica por diferencia de chunks**
contra `/practica`, que es la ruta comparable: comparte **todo** menos su propio
`page-*.js` de **4.9 kB gz**. El chunk compartido `201-*` (**7.1 kB gz**) trae los
7 componentes de ítem, la retroalimentación, `lib/simulacro.ts` y `lib/srs.ts`; el
`429-*` (5.8 kB gz) es solo de práctica y quiz (`controlador-sesion` +
`resumen-sesion`). Es decir: **`/repaso` reutiliza el sistema de ítems entero y
paga 4.9 kB propios.**

**El +1.6 kB gz de práctica y quiz también se investigó, como manda la regla.** No
es un import accidental: es el **resplit** del antiguo chunk `429` de 9.9 kB en
`201` (7.1, compartido con `/repaso`) + `429` (5.8, exclusivo) = 12.9 kB, más
`lib/srs.ts` y `fecha-local.ts`. Gzip comprime peor dos archivos que uno; a cambio,
`/repaso` no duplica el sistema de ítems. El chunk `201` es el que la app entera
va a compartir a partir del Paso 11.

### Verificado en navegador, a 375 px, sobre el build de producción

- **Usuario nuevo:** `h2` «Todavía no hay nada que repasar», **0 esqueletos
  vivos** y un enlace al siguiente módulo. Es el bug que el contrato de
  `useEstado()` anuncia, y no ocurre.
- **El mazo encola de verdad:** tras 3 tarjetas, `colaRepaso` trae `C5-T01`
  (facilidad 2.3, «no la sabía»), `C5-T02` y `C5-T03` (2.6), las tres a mañana.
- **La práctica encola de verdad:** 8 ítems dejados en blanco entran los 8, todos
  con `proximaRevision` = hoy, y **las 3 tarjetas quedan intactas**.
- **Sesión mixta:** contador «Elemento 1 de 8 · pregunta de Umbrales y zonas de
  entrenamiento»; con una cola de tarjetas, «· tarjeta de …» y botón «Ver la
  respuesta».
- **Teclado, con el foco forzado al `<body>`:** `Enter` comprueba —aparece la
  explicación— y el segundo `Enter` pasa de «Elemento 1 de 8» a «Elemento 2 de 8».
  Con tarjeta, `1` avanza de «Elemento 1 de 2» a «Elemento 2 de 2» y `2` cierra.
- **Foco en las tres transiciones:** al revelar va a la caja de la respuesta, al
  avanzar al botón «Ver la respuesta», al cerrar al `h2` «Terminaste el repaso de
  hoy».
- **Táctil:** «La sabía» / «No la sabía» miden **343 × 52 px**; con
  `any-pointer: coarse` la línea de atajos **no se muestra**.
- **Segunda visita el mismo día:** «Nada que repasar hoy — tu memoria va al día ·
  Tienes 11 elementos en la cola y ninguno vence hoy. El siguiente te toca
  mañana.» Cero relleno.
- **Cero desborde horizontal** a 375 px en las tres pantallas, y jerarquía
  `h1 → h2` sin saltos.

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

---

## Simulacros (Paso 11)

Contratos que un paso posterior necesita respetar. El razonamiento largo vive en
las cabeceras de cada archivo y en ADR-019 a ADR-021.

### La pantalla puede negarse a empezar

`diagnosticarViabilidad(blueprint, censo)` responde **antes de cargar contenido**
si el banco alcanza. Si no alcanza, `PortadaSimulacro` **no ofrece el botón**:
dice qué falta con cifras y por qué no se arma uno más corto.

No es una cortesía, es la diferencia entre un instrumento de medida y un número
inventado: `armarSimulacro` rellena desde el pool cuando falta contenido, así que
sin esta guarda un «final de 100 ítems» devolvería los 28 de C5 presentados como
el examen completo. Los pasos 15–17 lo verán encenderse y apagarse solo.

- El **censo** son tres campos por módulo (`slug`, `bloque`, `disponibles`) y lo
  produce `src/lib/censo.ts` en el **servidor**. No es el banco: mandar el banco
  por prop a esta ruta es justo lo que ADR-010 prohíbe.
- `exacto: false` cuando el blueprint filtra por tipo o dificultad. Hoy no afecta
  a nadie; el diagnóstico del Paso 13 será el primero, y ahí el veredicto sería
  una **cota superior**. Está anotado en `PENDIENTES.md`.

### El banco entra con `import()`, no por prop

`/practica` y `/quiz` reciben su banco por prop porque conocen su slug. El
simulacro **no**: carga con `import()` en el handler de «Empezar». Medido: el
HTML de `/simulacros/final` no contiene ni una cadena del banco, frente a los
17.1 kB gz de carga útil RSC que ya pesaba `/practica` con **un** módulo.

### El cronómetro: dos canales, nunca uno

**Regla dura: la cifra del cronómetro NO puede estar en una región `aria-live`.**
Un lector de pantalla interrumpiría al usuario 120 veces por minuto durante dos
horas, pisando la lectura del enunciado. El reparto correcto:

| Canal | Marcado | Cuándo habla |
|---|---|---|
| La cifra | `role="timer"` + `aria-live="off"` | nunca sola; el usuario la consulta |
| Los avisos | `role="status"` con `aria-label="Avisos del tiempo"` | 3 veces por sesión (20, 10 y 2 min) |

El `aria-label` del `timer` va en **minutos**, no en `MM:SS`: algunos lectores
releen el nombre accesible al recibir el foco, y con segundos dentro esa relectura
sería distinta cada vez. El nombre lleva `aria-label` porque la pantalla tiene
**otra** región `role="status"` —el «Ítem 3 de 100»— y sin nombre son
indistinguibles al navegar por regiones.

### Persistencia: tras cada respuesta, no cada N segundos

`SesionCronometro` se reescribe en cada cambio, desde un **efecto** (no desde el
handler: el estado de `useSesion` es asíncrono y el handler guardaría el valor
anterior al clic). El motivo de no usar un guardado periódico es ADR-008: la
sonda de 1 byte de `hayLocalStorage()` pasa con el disco casi lleno, y un
guardado a intervalos encima de eso habría hecho la pérdida de respuestas
intermitente e irreproducible.

El tiempo restante **nunca** sale de un contador en memoria: se recalcula desde
`iniciadoEnMs` contra el reloj real en cada tick, y también al volver de segundo
plano (`visibilitychange` y `focus`, porque los timers se congelan en móvil).

### Reanudar: reconstrucción fiel o nada

`itemIds` guarda el orden exacto y `semilla` reproduce el barajado de opciones —
no se vuelve a muestrear, porque el banco cambia entre los pasos 15 y 17. Si
**algún** ítem guardado ya no existe en el banco publicado, `DialogoReanudar` no
ofrece continuar: antes que calificar una tanda distinta de la que el usuario
respondió, se dice la verdad y se descarta.

`DialogoReanudar` **no es un modal** aunque §11.5 lo llame «diálogo»: es un panel
en el flujo. Un modal exigiría trampa de foco y un destino para `Escape`, y aquí
no hay opción neutra — las dos salidas son irreversibles.

### El panel de navegación y la válvula `data-compacto` (D-8)

Es el único consumidor de D-8 junto con los `TabsTrigger`, y la pantalla para la
que se aprobó en el Paso 5. Celdas de **36 px** con `gap-2`, o sea **44 px de
objetivo efectivo** contando la mitad del hueco a cada lado — que es el criterio
con el que D-8 se aprobó y lo que satisface el espaciado de objetivo de 2.5.8.

Las dos condiciones que lo legitiman, y que un paso futuro no puede erosionar:

1. **El panel es un atajo, no la única vía.** «Anterior» y «Siguiente» miden 44 px
   y llegan a cualquier ítem.
2. **Los tres estados se distinguen sin color**: vacío · relleno · relleno con
   punto, además del `aria-label` («Ítem 7, marcada para revisar»). El recuento
   va en texto encima de la cuadrícula.

Con 100 ítems a 44 px la cuadrícula ocuparía ~900 px a 375 px de ancho: dos
pantallas y media solo para el índice, que es justo lo que el panel existe para
evitar.
