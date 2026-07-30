# Inventario de componentes — Idóneo 2210

Qué existe ya, dónde vive, si es Server o Client, qué props recibe y quién lo
usa. **Consultar antes de construir cualquier componente**: es lo que evita que
un paso posterior escriba de nuevo algo que ya está hecho.

Se actualiza en el mismo commit que crea o cambia un componente. La regla de
frontera está en §10.2 del blueprint, y la lista cerrada de archivos con
`"use client"` en §10.3, **ampliada por ADR-009 con dos altas** —
`riel-bloques.tsx` y `app/error.tsx`—. Lo de `encabezado.tsx` **no fue un alta**:
fue aclarar que es Server Component, y §10.3 lista archivos que sí llevan la
directiva. Verificado el 2026-07-30: la lista real son 6 clientes y coincide
exactamente con §10.3 + ADR-009, sin desvíos.

> **Cómo contar los clientes sin equivocarse.** `grep "use client"` da falsos
> positivos: varios comentarios mencionaban la cadena para decir que **no** la
> usan, y eso hizo contar 9 clientes donde hay 6. Esos comentarios ya se
> reescribieron, y la forma correcta de medir es buscar la directiva, no la
> cadena:
>
> ```bash
> grep -rlE "^\s*['\"]use client['\"];?\s*$" src/
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
  | `/layout` css | 12.3 kB |
  | `/layout` total | 144.3 kB |
  | chunk `app/layout` solo | 3.2 kB (8 717 B raw) |

  **El comando exacto que las produce.** Cualquier paso que reporte peso usa
  este, sin variantes, o la comparación no vale:

  ```bash
  npm run build && node -e 'const fs=require("fs"),p=require("path"),z=require("zlib");const m=JSON.parse(fs.readFileSync(".next/app-build-manifest.json","utf8")).pages["/layout"];const gz=f=>z.gzipSync(fs.readFileSync(p.join(".next",f))).length;const s=a=>a.reduce((t,f)=>t+gz(f),0);const js=m.filter(f=>f.endsWith(".js")),css=m.filter(f=>f.endsWith(".css"));console.log(`/layout · js ${(s(js)/1000).toFixed(1)} kB gz · css ${(s(css)/1000).toFixed(1)} kB gz · total ${(s(m)/1000).toFixed(1)} kB gz`)'
  ```

  Salida esperada hoy: `/layout · js 132.0 kB gz · css 12.3 kB gz · total 144.3 kB gz`.

  Y la detección rápida de la regresión que ADR-010 previene, que **no depende de
  ninguna cifra** y por eso es la comprobación preferida:

  ```bash
  grep -l "osteomuscular\|conceptosClave" .next/static/chunks/app/layout-*.js
  ```

  Si devuelve algo, un componente cliente volvió a importar `content/`.
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
| `.prose-idoneo` y los 5 componentes MDX (`Dato`, `Formula`, `TablaClave`, `Ojo`, `AlertaContradiccion`) | 7 |
| `EtapasModulo`, `MarcadorLectura`, `MazoTarjetas` | 8 |
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
