# Idóneo 2210 — Blueprint

> Generado por The Architect el 2026-07-27
> Arquetipo: **híbrido** — `saas-webapp` para estado, motores y sesiones cronometradas · `content-platform` **solo** para renderizado MDX y experiencia de lectura
> Fuentes: `briefs/brief-idoneo-2210.md` y `briefs/contenido-y-examenes-idoneo-2210.md`
> Referente de arquitectura: `output/razona-udea-blueprint.md`

---

## Cómo usar este documento

Este blueprint es autocontenido. Un Claude Code sin contexto previo puede construir el proyecto completo leyendo solo este archivo. No necesita las cartillas originales para construir la aplicación; **sí** las necesita para escribir el contenido de los pasos 15–17.

**Orden de lectura para el agente constructor:**
1. §1–§3 para entender qué se construye y dónde va cada cosa.
2. §17 (plan de build) es la fuente de verdad del orden de trabajo. Cada paso apunta a la sección con el código.
3. §22 (reglas no negociables) antes de escribir la primera línea.
4. §21 se copia tal cual a `CLAUDE.md` en la raíz del proyecto nuevo.

**Lo que este blueprint NO deja a interpretación:** los tipos, los esquemas Zod, los cinco motores, el validador de banco y el módulo piloto C5 completo están escritos como código final. Cópialos. No los "mejores" ni los reescribas: los motores tienen invariantes (determinismo, ausencia de `Date.now()`) que se rompen con facilidad.

---

## 1. Resumen del proyecto

### Visión

**Idóneo 2210** es una app web PWA de estudio dirigido y evaluación diagnóstica para entrenadores deportivos colombianos que deben aprobar la Evaluación de Idoneidad exigida por la **Ley 2210 de 2022** (COLEF / COCED). El material oficial son las cuatro cartillas de la *Guía básica del entrenador deportivo* (2025), que la app destila en 29 módulos con teoría, tarjetas, práctica y quiz.

No es un resumen de las cartillas. Es un sistema que le dice al usuario **qué sabe, qué no sabe y qué estudiar hoy**, y se lo demuestra con simulacros cronometrados que replican el formato del examen (100 ítems / 120 min).

Los usuarios son el autor de la app y un grupo de amigos entrenadores. Adultos, no técnicos, estudian **desde el celular**, con conectividad intermitente. De ahí las tres restricciones duras que gobiernan cada decisión: **mobile-first**, **offline**, **cero fricción de registro**.

### Los cuatro pilares

| Pilar | Qué es | Dónde vive |
|---|---|---|
| **Ruta de estudio** | 29 módulos × 4 etapas (Esencial · Tarjetas · Práctica · Quiz) | `/modulos/[slug]/*` |
| **Repaso espaciado** | Cola automática con lo que fallaste, no con lo que ya dominas | `/repaso` + `lib/srs.ts` |
| **Simulacros escalonados** | Quiz de módulo → simulacro de bloque → simulacro final cronometrado | `/simulacros/*` + `lib/simulacro.ts` |
| **Informe diagnóstico** | % de dominio por bloque, módulo y nivel cognitivo + 5 temas prioritarios | `/resultados/[intentoId]` + `lib/informe.ts` |

### El diferenciador: el contenido enseña el dato verdadero

Las cuatro cartillas oficiales **se contradicen entre sí y contienen erratas**. Idóneo 2210 no las reproduce ni las cataloga: **enseña el dato verdadero, investigado y verificado**. Las cartillas son la guía del temario —qué entra en el examen y con qué profundidad—, **no la fuente de verdad de cada cifra**.

Eso obliga a un estándar de redacción que ninguna otra app de preparación paga: cada número que entra al banco está comprobado contra la bibliografía real, y donde la cartilla se equivoca, el contenido dice lo cierto **sin anunciar la discrepancia**. El usuario no tiene que aprenderse la bibliografía de las erratas del material oficial: tiene que aprenderse la fisiología.

Es el activo defendible del producto, porque requiere haber leído las cuatro cartillas con lápiz en mano **y haber ido a verificar lo que no cuadraba**. Ver ADR-014 y `.claude/CONTENIDO.md`, donde vive la investigación ya verificada que los módulos nuevos reutilizan en vez de volver a derivar.

### Objetivos

- Cubrir los 29 módulos con teoría destilada, ≥12 tarjetas y ≥25 ítems validados por módulo.
- Banco de ~750 ítems con los 7 tipos, suficiente para 4 simulacros finales sin repetición notoria.
- Que el usuario pueda instalar la app y estudiar sin conexión.
- Que compartir la app sea mandar un link: cero registro, cero correo, cero contraseña.

### Métricas de éxito

- Un usuario nuevo completa el diagnóstico de 30 ítems y recibe un plan de estudio accionable en <15 min.
- El simulacro final funciona correctamente tras cerrar la pestaña a mitad de camino (el tiempo no se regala).
- La app carga en <3 s en 4G y funciona completa sin red tras la primera visita.
- `npm run build` falla si algún ítem del banco incumple las cuotas de §5.4. Sin excepciones.

### Alcance v1

**Se construye:** los 4 pilares, diagnóstico inicial, plan por días, glosario, exportar/importar JSON, PWA offline, modo claro/oscuro, **calculadora médico-deportiva** (`/herramientas`) y **modo última noche** (`/ultima-noche`).

**No se construye (puertas abiertas, ver §24):** backend, cuentas, sincronización, pagos, contenido generado por IA en runtime, y las actividades originales de las cartillas (crucigramas / sopa de letras / completar espacios) — quedan documentadas como v1.1.

### Licencia y atribución — **requisito legal, no opcional**

El material fuente son las cuatro cartillas de la *Guía básica del entrenador deportivo* (COLEF + COCED, 2025), publicadas bajo **Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)**.

Idóneo 2210 es una **obra derivada** de ese material: destila su contenido en teoría, tarjetas e ítems. Eso obliga a tres cosas, y las tres son entregables verificables del build:

| Obligación | Qué exige | Dónde se cumple |
|---|---|---|
| **BY** — Atribución | Crédito visible a COLEF y COCED como autores del material fuente, con el título de la obra y el enlace a la licencia | Pie de la app en **todas** las rutas (§11.7) + `README.md` (paso 18.9) |
| **NC** — No comercial | La app no puede monetizarse: sin pagos, sin suscripciones, sin publicidad, sin muros de pago, sin patrocinios dentro de la app | Refuerza la decisión de §24 de no construir pagos. No es solo una decisión de producto: es una restricción de licencia |
| **SA** — CompartirIgual | La obra derivada se publica bajo la **misma** licencia CC BY-NC-SA 4.0 | `LICENSE` en la raíz del repo (paso 1) + `README.md` |

**Consecuencia para el roadmap:** cualquier idea futura de monetizar (v2 de pago, plan premium, publicidad) es **incompatible con la licencia del material fuente**. Si algún día se quiere cobrar, hay que reescribir el contenido desde fuentes propias o pedir permiso expreso a COLEF y COCED. Queda registrado en `.claude/ARQUITECTURA.md` como ADR en el paso 1.

**Texto exacto de atribución** (se usa literal en el pie y en el README; no parafrasear):

```
Contenido educativo adaptado de la «Guía básica del entrenador deportivo»
(Cartillas 1 a 4), COLEF Colombia y COCED, 2025, bajo licencia
CC BY-NC-SA 4.0. Idóneo 2210 es una obra derivada sin ánimo de lucro y se
distribuye bajo la misma licencia. No es un producto oficial de COLEF ni de
COCED, y sus veredictos no representan el puntaje oficial de aprobación.
```

La última frase es un deslinde necesario: la atribución no puede leerse como un aval institucional. Va junto a la atribución, siempre.

---

## 2. Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 15** (App Router) | RSC permite leer MDX del disco en el servidor sin API routes. Deploy trivial en Vercel. |
| Lenguaje | **TypeScript strict** | 750 ítems escritos a mano en 7 formas distintas: la unión discriminada del §4 es lo único que evita que un ítem malformado llegue a producción. |
| Estilos | **Tailwind CSS v4** | Configuración CSS-first: los tokens de los 4 bloques viven en `@theme`, no en un archivo JS. Ver §2.1 — **crítico**. |
| Componentes | **shadcn/ui** (New York) | Código en el repo, no dependencia. Se puede modificar el `Dialog` del simulacro sin luchar contra una librería. |
| Iconos | **lucide-react** | Ya viene con shadcn/ui. |
| Contenido teórico | **next-mdx-remote v5** (`/rsc`) | El contenido vive en `content/`, fuera de `app/`. `@next/mdx` solo funciona con `.mdx` dentro de `app/`. |
| Markdown extendido | **remark-gfm** | Tablas. Las cartillas son tablas: sin GFM no hay contenido. |
| Validación | **Zod 3.25** | Valida el banco en `prebuild` y valida el JSON importado en runtime. Un ítem inválido rompe el build, no la app. |
| Gráficas | **recharts** | Barras de dominio por bloque y módulo en el informe. |
| Temas | **next-themes** | Claro/oscuro/sistema sin flash. |
| Persistencia | **localStorage** detrás de `lib/almacenamiento.ts` | Sin backend en v1. Esquema versionado con migraciones. |
| PWA / offline | **Serwist v9** (`@serwist/next`) | `next-pwa` está sin mantenimiento y no soporta App Router. Serwist es su sucesor real. |
| Tests | **Vitest** | Solo para `lib/`. Los cinco motores son funciones puras: el test es barato y ahí un bug silencioso arruina un simulacro. |
| Gestor de paquetes | **npm** | Especificado. |
| Deploy | **Vercel** | Cero variables de entorno, cero configuración. |

**Sin base de datos. Sin autenticación. Sin CMS. Sin servicio de búsqueda. Sin CDN de medios.** Estas ausencias son decisiones, no omisiones — ver §2.2.

### 2.1 Tailwind CSS v4 — reglas obligatorias

Esto es la fuente número uno de errores cuando un agente entrenado con documentación de v3 toca un proyecto v4. **Léelo dos veces.**

| ✅ En v4 se hace así | ❌ Nunca (es v3) |
|---|---|
| `@import "tailwindcss";` al inicio de `globals.css` | `@tailwind base; @tailwind components; @tailwind utilities;` |
| Tokens dentro de un bloque `@theme { ... }` en el CSS | `theme.extend.colors` en `tailwind.config.js` |
| **No existe** `tailwind.config.js` ni `.ts` | Crear o editar `tailwind.config.*` |
| PostCSS: `@tailwindcss/postcss` en `postcss.config.mjs` | `tailwindcss: {}` + `autoprefixer: {}` |
| Modo oscuro: `@custom-variant dark (&:is(.dark *));` | `darkMode: 'class'` en el config JS |
| Colores en `oklch()` | `hsl(var(--x))` con `<alpha-value>` |
| `components.json` con `"tailwind": { "config": "" }` | `"config": "tailwind.config.ts"` |

**Reglas duras:**

1. **Si encuentras un `tailwind.config.js` o `tailwind.config.ts` en el proyecto, bórralo.** `create-next-app` puede generarlo según la versión. Borrarlo es correcto: en v4 no se lee.
2. Verifica después del scaffolding que `package.json` tiene `"tailwindcss": "^4.x"` y `"@tailwindcss/postcss": "^4.x"`. Si aparece `^3.x`, desinstala e instala v4 antes de seguir. Registra el hallazgo en `.claude/BITACORA.md`.
3. Todo token de color nuevo se declara **dos veces**: el valor crudo en `:root` / `.dark`, y su alias en `@theme inline` para que Tailwind genere las utilidades. Ver §11.
4. `npx shadcn@latest init` detecta Tailwind v4 solo si `globals.css` ya tiene `@import "tailwindcss"`. Ejecuta el init **después** de confirmar el punto 2.
5. Los 4 tokens de bloque (`--color-bloque-a` … `--color-bloque-d`) y sus `-contraste` viven en `@theme`, documentados con comentario. Sin ellos, la orientación espacial de la app no funciona.

### 2.2 Decisiones no obvias — copiar a `.claude/ARQUITECTURA.md` en el paso 1

| Decisión | Razón |
|---|---|
| **Teoría en MDX, banco de ítems en TypeScript** (no MDX, no JSON suelto) | La teoría necesita formato rico y componentes. Los ítems necesitan tipado y validación en build. Un ítem malformado debe romper el build, no la app. |
| **Banco en módulos TS importables desde el cliente; teoría en archivos leídos con `fs`** | Consecuencia directa: el banco se puede `import()` dinámicamente desde un Client Component (code splitting real, el simulacro final carga los 750 ítems bajo interacción del usuario). La teoría es server-only. Esta asimetría es intencional. |
| **Zod en `prebuild`** (`scripts/validar-banco.ts`) | Con ~750 ítems escritos a mano en semanas distintas, el error humano es certeza, no riesgo. |
| **`localStorage` siempre detrás de `lib/almacenamiento.ts`** con esquema versionado y migraciones | El acceso directo rompe en Server Components y hace imposible migrar el esquema sin borrar el progreso de la gente. |
| **Los motores no conocen el reloj.** Toda función que necesita "ahora" lo recibe como parámetro (`ahoraISO: string` o `ahoraMs: number`) | Hace los cinco motores puros y testeables sin mocks, y elimina de raíz los errores de hidratación de Next 15. El único código que llama a `Date.now()` es un puñado de handlers y efectos, listados en §10.3. |
| **Semilla determinística por intento** (`semilla = timestamp del inicio`) | Permite reproducir el barajado de opciones de un intento exacto al revisarlo. |
| **Fechas como ISO string, nunca objetos `Date` en `localStorage`** | Serialización predecible entre versiones del esquema. |
| **Módulos con `estadoContenido: 'en-preparacion'`** | Los pasos 14–17 producen contenido durante semanas. El validador solo exige las cuotas a los módulos `'completo'`, así que la app puede desplegarse con 1 módulo terminado y 28 en preparación sin romper el build. Sin esto, el plan de 18 pasos es imposible. |
| **Búsqueda del glosario a mano** (filtro en cliente sobre <400 entradas) | Algolia/Meilisearch para 400 strings es infraestructura absurda. `String.normalize('NFD')` + `includes` resuelve el caso, funciona offline y no cuesta nada. |
| **SEO solo en la portada** | El resto de la app es privada de facto: no hay contenido público que indexar. Sin sitemap de contenido, sin RSS, sin JSON-LD de artículo. |

---

## 3. Estructura de directorios

```
idoneo-2210/
├── .claude/
│   ├── settings.json               ← permisos de Claude Code
│   ├── BITACORA.md                 ← una entrada por paso completado (§23)
│   ├── ARQUITECTURA.md             ← decisiones no obvias y su razón (§23)
│   └── CONTENIDO.md                ← tabla de estado del contenido por módulo (§23)
│
├── content/                        ← TODO el contenido. Ningún componente vive aquí.
│   ├── estructura.ts               ← 4 bloques + 29 módulos (metadatos)          §9.1
│   ├── blueprint-examen.ts         ← los 4 blueprints de examen                  §9.2
│   ├── datos-duros.ts              ← los valores exactos que caen (modo última noche) §9.4
│   ├── glosario.ts                 ← conceptos clave con definición y módulo      §9.5
│   ├── banco/
│   │   ├── indice.ts               ← mapa slug → () => Promise<Item[]>            §9.6
│   │   └── c5-umbrales-zonas.ts    ← 28 ítems del módulo piloto                  §14.3
│   ├── tarjetas/
│   │   ├── indice.ts               ← mapa slug → () => Promise<Tarjeta[]>
│   │   └── c5-umbrales-zonas.ts    ← 15 tarjetas del módulo piloto               §14.2
│   └── teoria/
│       └── c5-umbrales-zonas.mdx   ← teoría del módulo piloto                    §14.1
│
├── scripts/
│   └── validar-banco.ts            ← corre en prebuild. Falla el build.          §8
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← root layout: fuentes, tema, shell
│   │   ├── globals.css             ← Tailwind v4: @import + @theme              §11
│   │   ├── manifest.ts             ← manifiesto PWA                             §16
│   │   ├── sw.ts                   ← service worker de Serwist                  §16
│   │   ├── page.tsx                ← / Inicio
│   │   ├── diagnostico/page.tsx
│   │   ├── plan/page.tsx
│   │   ├── bloques/[bloqueId]/page.tsx
│   │   ├── modulos/[slug]/
│   │   │   ├── page.tsx            ← Etapa 1 · Esencial (MDX)
│   │   │   ├── tarjetas/page.tsx   ← Etapa 2
│   │   │   ├── practica/page.tsx   ← Etapa 3
│   │   │   └── quiz/page.tsx       ← Etapa 4
│   │   ├── repaso/page.tsx
│   │   ├── simulacros/
│   │   │   ├── page.tsx
│   │   │   ├── bloque/[bloqueId]/page.tsx
│   │   │   └── final/page.tsx
│   │   ├── resultados/[intentoId]/page.tsx
│   │   ├── progreso/page.tsx
│   │   ├── glosario/page.tsx
│   │   ├── herramientas/page.tsx   ← calculadora médico-deportiva               §15.1
│   │   ├── ultima-noche/page.tsx   ← datos duros en tarjetas rápidas            §15.2
│   │   ├── ajustes/page.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                     ← shadcn/ui (generado por CLI)
│   │   ├── layout/                 ← shell, nav inferior, barra lateral, tema, pie  §11.7
│   │   ├── mdx/                    ← Dato, Formula, TablaClave, Ojo               §12
│   │   ├── items/                  ← un componente por tipo de ítem (7)          §13
│   │   ├── sesion/                 ← controladores de práctica/quiz/simulacro/diagnóstico
│   │   ├── informe/                ← veredicto, barras, top-5, revisión
│   │   ├── inicio/                 ← continuar, racha, resumen
│   │   ├── modulo/                 ← etapas, marcador de lectura, mazo de tarjetas
│   │   ├── glosario/
│   │   ├── herramientas/
│   │   └── ultima-noche/
│   │
│   ├── lib/
│   │   ├── tipos.ts                ← modelo de datos completo                    §4
│   │   ├── esquemas.ts             ← Zod                                         §5
│   │   ├── almacenamiento.ts       ← wrapper de localStorage                     §6
│   │   ├── fechas.ts               ← helpers de fecha deterministas              §7.1
│   │   ├── srs.ts                  ← motor de repaso espaciado                   §7.2
│   │   ├── simulacro.ts            ← muestreo estratificado + barajado + calificación §7.3
│   │   ├── cronometro.ts           ← tiempo restante, avisos, auto-envío         §7.4
│   │   ├── informe.ts              ← desglose, veredicto, top-5, patrones        §7.5
│   │   ├── plan.ts                 ← plan de estudio por días                    §7.6
│   │   ├── contenido.ts            ← loaders server-only (fs) de MDX
│   │   └── utils.ts                ← cn(), normalizar(), formateadores
│   │
│   └── hooks/
│       ├── usar-estado.ts          ← useSyncExternalStore sobre almacenamiento
│       ├── usar-cronometro.ts
│       └── usar-sesion.ts          ← máquina de estado de práctica/quiz/simulacro
│
├── src/lib/__tests__/              ← Vitest. Solo lib/.                          §19
├── public/
│   ├── icono-192.png  icono-512.png  icono-maskable.png
│   └── og.png
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── LICENSE                         ← CC BY-NC-SA 4.0, texto completo. Paso 1.
├── README.md                       ← atribución a COLEF/COCED visible. Paso 18.9
└── package.json
```

**Regla de ubicación:** si un archivo contiene texto que un entrenador va a leer, va en `content/`. Si contiene lógica, va en `src/lib/`. Si contiene JSX, va en `src/components/` o `src/app/`. No hay excepciones — esto es lo que permite que los pasos 15–17 (producción de contenido) no toquen ni una línea de código.

---

## 4. Modelo de datos — `src/lib/tipos.ts`

**Sin `"use client"`.** Tipos puros: se importan desde Server Components, Client Components, el validador y los tests.

```ts
// src/lib/tipos.ts
// Modelo de datos completo de Idóneo 2210.
// Sin "use client": este archivo solo exporta tipos.

/* ══════════════════════════════════════════════════════════════════
   CONTENIDO
   ══════════════════════════════════════════════════════════════════ */

export type BloqueId = 'A' | 'B' | 'C' | 'D';
export type NivelCognitivo = 'recuerdo' | 'comprension' | 'aplicacion';
export type Dificultad = 1 | 2 | 3;

export type TipoItem =
  | 'unica'
  | 'multiple'
  | 'vf'
  | 'emparejar'
  | 'calculo'
  | 'ordenar'
  | 'caso';

/** Los módulos 'en-preparacion' quedan exentos de las cuotas del validador
 *  y muestran un estado vacío honesto en la app. Ver §2.2. */
export type EstadoContenido = 'completo' | 'en-preparacion';

export interface Bloque {
  id: BloqueId;
  numeroCartilla: 1 | 2 | 3 | 4;
  titulo: string;
  descripcion: string;
  /** Fracción del examen final. La suma de los 4 debe ser 1. */
  pesoExamen: number;
  /** Sufijo del token de color: 'a' | 'b' | 'c' | 'd'. Ver §11. */
  color: 'a' | 'b' | 'c' | 'd';
  /** Slugs de sus módulos, en orden de estudio. */
  modulos: string[];
}

export interface Modulo {
  /** Ej. 'c5-umbrales-zonas'. Es la clave primaria del contenido. */
  slug: string;
  bloque: BloqueId;
  /** Orden dentro del bloque, empezando en 1. */
  orden: number;
  titulo: string;
  subtitulo: string;
  minutosEstimados: number;
  /** 3–5 objetivos, en infinitivo. */
  objetivos: string[];
  /** Alimenta el glosario global. Todo concepto aquí debe tener
   *  entrada en content/glosario.ts si el módulo es 'completo'. */
  conceptosClave: string[];
  /** Slugs de módulos que conviene estudiar antes. Alimenta lib/plan.ts. */
  prerequisitos: string[];
  estadoContenido: EstadoContenido;
}

/* ══════════════════════════════════════════════════════════════════
   ÍTEMS — unión discriminada por `tipo`
   ══════════════════════════════════════════════════════════════════ */

export interface ItemBase {
  /** Formato obligatorio: bloque + número de módulo + consecutivo. Ej. 'C5-014'. */
  id: string;
  /** Slug del módulo. Debe existir en content/estructura.ts. */
  modulo: string;
  bloque: BloqueId;
  nivel: NivelCognitivo;
  dificultad: Dificultad;
  /** Admite markdown en línea (**negrita**, `código`, subíndices con _). */
  enunciado: string;
  /** OBLIGATORIA, mínimo 200 caracteres. Estructura fija:
   *  por qué la correcta lo es → por qué falla el distractor más tentador → dato para recordar. */
  explicacion: string;
  /** Formato: 'Cartilla N, Tema M, Subtema M.X — Título'. */
  referencia: string;
  etiquetas: string[];
}

export interface ItemUnica extends ItemBase {
  tipo: 'unica';
  /** Exactamente 4. */
  opciones: string[];
  /** Índice en `opciones`. */
  correcta: number;
}

export interface ItemMultiple extends ItemBase {
  tipo: 'multiple';
  /** Exactamente 5. */
  opciones: string[];
  /** 2 o 3 índices distintos. */
  correctas: number[];
}

export interface ItemVerdaderoFalso extends ItemBase {
  tipo: 'vf';
  correcta: boolean;
}

export interface ItemEmparejar extends ItemBase {
  tipo: 'emparejar';
  /** 4–6 elementos. */
  izquierda: string[];
  /** Mismo largo que `izquierda`. Se baraja al presentar. */
  derecha: string[];
  /** Pares [índiceIzquierda, índiceDerecha] correctos, uno por elemento. */
  pares: [number, number][];
}

export interface ItemCalculo extends ItemBase {
  tipo: 'calculo';
  respuesta: number;
  /** Tolerancia absoluta, en unidades de `unidad`. Debe ser > 0. */
  tolerancia: number;
  /** 'lpm', 'ml/kg/min', '%', 'm', … */
  unidad: string;
  /** Resolución paso a paso, mostrada tras responder. Mínimo 2 pasos. */
  pasos: string[];
}

export interface ItemOrdenar extends ItemBase {
  tipo: 'ordenar';
  /** SIEMPRE se escriben en el orden correcto. El barajado lo hace el motor. */
  elementos: string[];
  /** En el ítem canónico es [0, 1, 2, …, n-1]. Tras presentarItem() apunta
   *  a las posiciones del array barajado. Ver §7.3. */
  ordenCorrecto: number[];
}

export interface ItemCaso extends ItemBase {
  tipo: 'caso';
  /** Situación de 2–4 líneas. Se muestra antes del enunciado. */
  viñeta: string;
  opciones: string[];
  correcta: number;
}

export type Item =
  | ItemUnica
  | ItemMultiple
  | ItemVerdaderoFalso
  | ItemEmparejar
  | ItemCalculo
  | ItemOrdenar
  | ItemCaso;

/* ══════════════════════════════════════════════════════════════════
   TARJETAS, GLOSARIO, DATOS DUROS
   ══════════════════════════════════════════════════════════════════ */

export interface Tarjeta {
  /** Formato: slug del módulo en mayúsculas + '-T' + consecutivo. Ej. 'C5-T07'. */
  id: string;
  modulo: string;
  frente: string;
  reverso: string;
  tipo: 'definicion' | 'dato' | 'clasificacion' | 'formula';
}

export interface EntradaGlosario {
  termino: string;
  definicion: string;
  /** Slug del módulo donde se explica. Genera el enlace "Ver módulo". */
  modulo: string;
  sinonimos?: string[];
}

export interface DatoDuro {
  id: string;
  categoria: string;
  concepto: string;
  /** El valor exacto que se pregunta. */
  valor: string;
  modulo: string;
}

/* ══════════════════════════════════════════════════════════════════
   BLUEPRINTS DE EXAMEN
   ══════════════════════════════════════════════════════════════════ */

export type TipoIntento = 'diagnostico' | 'quiz' | 'bloque' | 'final';

/** Cómo se reparte el total de ítems. Es la restricción primaria: se satisface
 *  exactamente. Las cuotas de nivel y tipo se satisfacen por aproximación. */
export type RepartoBlueprint =
  | { tipo: 'modulo'; cuotas: Record<string, number> }
  | { tipo: 'bloque'; cuotas: Partial<Record<BloqueId, number>> };

export interface BlueprintExamen {
  id: string;
  titulo: string;
  descripcion: string;
  totalItems: number;
  /** null = sin cronómetro (quiz de módulo). */
  minutos: number | null;
  reparto: RepartoBlueprint;
  porNivel: Record<NivelCognitivo, number>;
  porTipo?: Partial<Record<TipoItem, number>>;
  tiposPermitidos?: TipoItem[];
  dificultadesPermitidas?: Dificultad[];
  /** true = retroalimentación inmediata por ítem (solo la etapa Práctica). */
  feedbackInmediato: boolean;
}

/* ══════════════════════════════════════════════════════════════════
   PROGRESO DEL USUARIO — localStorage
   ══════════════════════════════════════════════════════════════════ */

export interface EstadoModulo {
  teoriaLeida: boolean;
  tarjetasVistas: number;
  practicaCompletada: boolean;
  /** 0–100. Mejor histórico, no el último intento. */
  mejorQuiz: number | null;
  intentosQuiz: number;
  /** mejorQuiz >= 80. */
  dominado: boolean;
  ultimaVisita: string | null;
}

export interface TarjetaSRS {
  /** Id de tarjeta ('C5-T07') o de ítem ('C5-014'). */
  id: string;
  /** Factor de facilidad (EF). Arranca en 2.5, rango [1.3, 2.8]. */
  facilidad: number;
  intervaloDias: number;
  repeticiones: number;
  /** ISO date (solo fecha, sin hora: 'YYYY-MM-DD'). */
  proximaRevision: string;
}

export interface RespuestaItem {
  itemId: string;
  /** Se valida contra el tipo del ítem con lib/simulacro.ts#calificar. */
  respuesta: unknown;
  correcta: boolean;
  segundos: number;
  /** "Revisar después". */
  marcada: boolean;
}

export interface DesgloseIntento {
  porBloque: Record<BloqueId, { correctas: number; total: number }>;
  porModulo: Record<string, { correctas: number; total: number }>;
  porNivel: Record<NivelCognitivo, { correctas: number; total: number }>;
}

export interface IntentoSimulacro {
  /** Igual a la semilla convertida a string. Es la clave de /resultados/[intentoId]. */
  id: string;
  tipo: TipoIntento;
  /** Slug de módulo, id de bloque, o 'global'. */
  ambito: string;
  semilla: number;
  iniciadoEn: string;
  terminadoEn: string;
  segundosUsados: number;
  totalItems: number;
  /** En el orden en que se presentaron. Permite reconstruir el intento sin re-muestrear. */
  itemIds: string[];
  respuestas: RespuestaItem[];
  /** 0–100, redondeado. */
  puntaje: number;
  desglose: DesgloseIntento;
}

export interface Preferencias {
  tema: 'claro' | 'oscuro' | 'sistema';
  sonido: boolean;
  /** ISO date del último respaldo exportado. Alimenta el recordatorio de los 7 días. */
  ultimoRespaldo: string | null;
}

export interface EstadoProgreso {
  version: 1;
  creadoEn: string;
  /** Opcional, solo para saludar. */
  nombre?: string;
  /** ISO date. Alimenta lib/plan.ts. */
  fechaExamen?: string;
  diagnosticoHecho: boolean;
  modulos: Record<string, EstadoModulo>;
  /** Clave = id de tarjeta o de ítem. */
  colaRepaso: Record<string, TarjetaSRS>;
  intentos: IntentoSimulacro[];
  racha: { dias: number; ultimoDiaActivo: string };
  preferencias: Preferencias;
}

/* ══════════════════════════════════════════════════════════════════
   SESIÓN EN CURSO — clave de localStorage separada
   ══════════════════════════════════════════════════════════════════ */

export interface RespuestaEnCurso {
  valor: unknown;
  segundos: number;
  marcada: boolean;
}

export interface SesionCronometro {
  intentoId: string;
  tipo: TipoIntento;
  ambito: string;
  semilla: number;
  /** Epoch ms. El tiempo restante SIEMPRE se recalcula desde aquí contra el
   *  reloj real. Cerrar la pestaña no regala tiempo. */
  iniciadoEnMs: number;
  /** null = sin límite (quiz de módulo). */
  duracionSegundos: number | null;
  /** Orden de presentación. Reconstruye la sesión tras recargar. */
  itemIds: string[];
  respuestas: Record<string, RespuestaEnCurso>;
  /** Segundos-umbral de aviso ya mostrados: [1200, 600, 120]. */
  avisosVistos: number[];
}

/* ══════════════════════════════════════════════════════════════════
   INFORME
   ══════════════════════════════════════════════════════════════════ */

export type ClaveVeredicto = 'riesgo' | 'camino' | 'listo' | 'solido';

export interface Veredicto {
  clave: ClaveVeredicto;
  titulo: string;
  mensaje: string;
  /** Token de color: 'destructive' | 'aviso' | 'primary' | 'exito'. */
  color: string;
}

export interface TemaPrioritario {
  modulo: string;
  titulo: string;
  bloque: BloqueId;
  correctas: number;
  total: number;
  porcentaje: number;
}

export interface Informe {
  intentoId: string;
  tipo: TipoIntento;
  puntaje: number;
  veredicto: Veredicto;
  segundosUsados: number;
  desglose: DesgloseIntento;
  dominioPorBloque: { bloque: BloqueId; titulo: string; porcentaje: number; total: number }[];
  dominioPorModulo: { modulo: string; titulo: string; porcentaje: number; total: number }[];
  temasPrioritarios: TemaPrioritario[];
  /** Mensajes accionables de detección de patrón. Puede venir vacío. */
  patrones: string[];
  /** Delta de puntos porcentuales contra el intento anterior del mismo tipo. */
  deltaPorBloque: Record<BloqueId, number | null> | null;
  sinResponder: number;
}

/* ══════════════════════════════════════════════════════════════════
   PLAN DE ESTUDIO
   ══════════════════════════════════════════════════════════════════ */

export type TareaPlan =
  | { clase: 'modulo'; slug: string; titulo: string; minutos: number }
  | { clase: 'repaso'; descripcion: string; minutos: number }
  | { clase: 'simulacro'; ambito: string; descripcion: string; minutos: number };

export interface DiaPlan {
  /** 'YYYY-MM-DD'. */
  fecha: string;
  /** 1 = hoy. */
  indice: number;
  tareas: TareaPlan[];
  minutosTotales: number;
}

export interface Plan {
  generadoEn: string;
  fechaExamen: string;
  diasDisponibles: number;
  dias: DiaPlan[];
  /** Advertencias honestas: "quedan 5 días para 29 módulos". */
  advertencias: string[];
}
```

---

## 5. Validación — `src/lib/esquemas.ts`

**Sin `"use client"`.** Se importa desde el validador de build (Node) y desde `almacenamiento.ts` (navegador, para el JSON importado).

> **Zod 3, no Zod 4.** Este archivo está escrito contra la API de Zod 3 (`superRefine`, `message`, `z.record` de un argumento). `package.json` pinnea `"zod": "^3.25.0"`. **No migres a Zod 4 durante el build**: el validador es el único guardián de 750 ítems y no vale la pena arriesgarlo por una versión mayor.

```ts
// src/lib/esquemas.ts
import { z } from 'zod';
import type { Item, NivelCognitivo, TipoItem } from './tipos';

/* ─── Primitivos ──────────────────────────────────────────────────── */

export const esqBloqueId = z.enum(['A', 'B', 'C', 'D']);
export const esqNivel = z.enum(['recuerdo', 'comprension', 'aplicacion']);
export const esqDificultad = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const esqEstadoContenido = z.enum(['completo', 'en-preparacion']);

const RE_ID_ITEM = /^[ABCD]\d{1,2}-\d{3}$/;
const RE_REFERENCIA = /^Cartilla [1-4], Tema \d+/;
const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

const camposBase = {
  id: z.string().regex(RE_ID_ITEM, 'el id debe tener la forma "C5-014"'),
  modulo: z.string().min(3),
  bloque: esqBloqueId,
  nivel: esqNivel,
  dificultad: esqDificultad,
  enunciado: z.string().min(15, 'el enunciado es demasiado corto'),
  explicacion: z
    .string()
    .min(200, 'la explicación debe tener al menos 200 caracteres'),
  referencia: z
    .string()
    .regex(RE_REFERENCIA, 'la referencia debe empezar por "Cartilla N, Tema M"'),
  etiquetas: z.array(z.string().min(2)).min(1, 'al menos una etiqueta'),
};

/* ─── Los 7 tipos de ítem ─────────────────────────────────────────── */

export const esqItemUnica = z
  .object({
    ...camposBase,
    tipo: z.literal('unica'),
    opciones: z.array(z.string().min(1)).length(4, 'única: exactamente 4 opciones'),
    correcta: z.number().int().min(0).max(3),
  })
  .superRefine((it, ctx) => {
    if (new Set(it.opciones).size !== it.opciones.length) {
      ctx.addIssue({ code: 'custom', message: 'hay opciones duplicadas' });
    }
  });

export const esqItemMultiple = z
  .object({
    ...camposBase,
    tipo: z.literal('multiple'),
    opciones: z.array(z.string().min(1)).length(5, 'múltiple: exactamente 5 opciones'),
    correctas: z.array(z.number().int().min(0)).min(2).max(3),
  })
  .superRefine((it, ctx) => {
    if (new Set(it.correctas).size !== it.correctas.length) {
      ctx.addIssue({ code: 'custom', message: 'correctas tiene índices repetidos' });
    }
    if (it.correctas.some((i) => i >= it.opciones.length)) {
      ctx.addIssue({ code: 'custom', message: 'un índice de correctas está fuera de rango' });
    }
  });

export const esqItemVf = z.object({
  ...camposBase,
  tipo: z.literal('vf'),
  correcta: z.boolean(),
});

export const esqItemEmparejar = z
  .object({
    ...camposBase,
    tipo: z.literal('emparejar'),
    izquierda: z.array(z.string().min(1)).min(4).max(6),
    derecha: z.array(z.string().min(1)).min(4).max(6),
    pares: z.array(z.tuple([z.number().int().min(0), z.number().int().min(0)])),
  })
  .superRefine((it, ctx) => {
    if (it.izquierda.length !== it.derecha.length) {
      ctx.addIssue({ code: 'custom', message: 'izquierda y derecha deben tener el mismo largo' });
    }
    if (it.pares.length !== it.izquierda.length) {
      ctx.addIssue({ code: 'custom', message: 'debe haber un par por cada elemento de izquierda' });
    }
    const izq = new Set<number>();
    for (const [i, d] of it.pares) {
      if (i >= it.izquierda.length || d >= it.derecha.length) {
        ctx.addIssue({ code: 'custom', message: `el par [${i},${d}] está fuera de rango` });
      }
      if (izq.has(i)) {
        ctx.addIssue({ code: 'custom', message: `el índice izquierdo ${i} aparece dos veces` });
      }
      izq.add(i);
    }
  });

export const esqItemCalculo = z.object({
  ...camposBase,
  tipo: z.literal('calculo'),
  respuesta: z.number().finite(),
  tolerancia: z.number().positive('la tolerancia debe ser > 0'),
  unidad: z.string().min(1),
  pasos: z.array(z.string().min(3)).min(2, 'cálculo: al menos 2 pasos de resolución'),
});

export const esqItemOrdenar = z
  .object({
    ...camposBase,
    tipo: z.literal('ordenar'),
    elementos: z.array(z.string().min(1)).min(3).max(8),
    ordenCorrecto: z.array(z.number().int().min(0)),
  })
  .superRefine((it, ctx) => {
    if (it.ordenCorrecto.length !== it.elementos.length) {
      ctx.addIssue({ code: 'custom', message: 'ordenCorrecto debe tener un índice por elemento' });
      return;
    }
    const ordenado = [...it.ordenCorrecto].sort((a, b) => a - b);
    if (ordenado.some((v, i) => v !== i)) {
      ctx.addIssue({
        code: 'custom',
        message: 'ordenCorrecto debe ser una permutación de 0..n-1 (en el ítem canónico: [0,1,2,…])',
      });
    }
  });

export const esqItemCaso = z
  .object({
    ...camposBase,
    tipo: z.literal('caso'),
    viñeta: z.string().min(60, 'la viñeta debe describir una situación (mín. 60 caracteres)'),
    opciones: z.array(z.string().min(1)).length(4, 'caso: exactamente 4 opciones'),
    correcta: z.number().int().min(0).max(3),
  })
  .superRefine((it, ctx) => {
    if (new Set(it.opciones).size !== it.opciones.length) {
      ctx.addIssue({ code: 'custom', message: 'hay opciones duplicadas' });
    }
  });

export const esqItem = z.discriminatedUnion('tipo', [
  esqItemUnica,
  esqItemMultiple,
  esqItemVf,
  esqItemEmparejar,
  esqItemCalculo,
  esqItemOrdenar,
  esqItemCaso,
]);

/* ─── Cuotas por módulo (§2.2 del documento de contenido) ─────────── */

export interface ReglasCuota {
  /** Ítems mínimos por módulo. */
  minimoItems: number;
  /** Fracción mínima por nivel cognitivo. */
  minNivel: Record<NivelCognitivo, number>;
  /** Ítems mínimos por cada nivel de dificultad. */
  minPorDificultad: number;
  /** Tipos distintos mínimos representados. */
  minTiposDistintos: number;
}

export const CUOTAS: ReglasCuota = {
  minimoItems: 25,
  minNivel: { recuerdo: 0.4, comprension: 0.3, aplicacion: 0.2 },
  minPorDificultad: 3,
  minTiposDistintos: 4,
};

/** Verifica las cuotas de un módulo. Devuelve la lista de incumplimientos
 *  (vacía = pasa). Se usa en scripts/validar-banco.ts y en los tests. */
export function verificarCuotas(items: Item[], reglas: ReglasCuota = CUOTAS): string[] {
  const fallos: string[] = [];
  const n = items.length;

  if (n < reglas.minimoItems) {
    fallos.push(`tiene ${n} ítems, el mínimo es ${reglas.minimoItems}`);
  }
  if (n === 0) return fallos;

  const porNivel: Record<NivelCognitivo, number> = {
    recuerdo: 0,
    comprension: 0,
    aplicacion: 0,
  };
  const porDificultad: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const tipos = new Set<TipoItem>();

  for (const it of items) {
    porNivel[it.nivel] += 1;
    porDificultad[it.dificultad] += 1;
    tipos.add(it.tipo);
  }

  for (const nivel of ['recuerdo', 'comprension', 'aplicacion'] as NivelCognitivo[]) {
    const fraccion = porNivel[nivel] / n;
    if (fraccion < reglas.minNivel[nivel]) {
      fallos.push(
        `nivel "${nivel}": ${porNivel[nivel]}/${n} = ${(fraccion * 100).toFixed(0)} %, ` +
          `mínimo ${(reglas.minNivel[nivel] * 100).toFixed(0)} %`,
      );
    }
  }

  for (const d of [1, 2, 3]) {
    if (porDificultad[d] < reglas.minPorDificultad) {
      fallos.push(
        `dificultad ${d}: ${porDificultad[d]} ítems, mínimo ${reglas.minPorDificultad}`,
      );
    }
  }

  if (tipos.size < reglas.minTiposDistintos) {
    fallos.push(
      `solo ${tipos.size} tipos distintos (${[...tipos].join(', ')}), mínimo ${reglas.minTiposDistintos}`,
    );
  }

  return fallos;
}

/* ─── Tarjetas, glosario, datos duros ─────────────────────────────── */

export const esqTarjeta = z.object({
  id: z.string().regex(/^[ABCD]\d{1,2}-T\d{2}$/, 'el id de tarjeta debe ser como "C5-T07"'),
  modulo: z.string().min(3),
  frente: z.string().min(5),
  reverso: z.string().min(5),
  tipo: z.enum(['definicion', 'dato', 'clasificacion', 'formula']),
});

export const esqEntradaGlosario = z.object({
  termino: z.string().min(2),
  definicion: z.string().min(40),
  modulo: z.string().min(3),
  sinonimos: z.array(z.string().min(2)).optional(),
});

export const esqDatoDuro = z.object({
  id: z.string().min(3),
  categoria: z.string().min(3),
  concepto: z.string().min(3),
  valor: z.string().min(1),
  modulo: z.string().min(3),
});

export const esqModulo = z.object({
  slug: z.string().regex(/^[a-d]\d{1,2}-[a-z0-9-]+$/, 'slug como "c5-umbrales-zonas"'),
  bloque: esqBloqueId,
  orden: z.number().int().positive(),
  titulo: z.string().min(4),
  subtitulo: z.string().min(10),
  minutosEstimados: z.number().int().min(10).max(90),
  objetivos: z.array(z.string().min(10)).min(3).max(5),
  conceptosClave: z.array(z.string().min(2)).min(3),
  prerequisitos: z.array(z.string().min(3)),
  estadoContenido: esqEstadoContenido,
});

/* ─── Progreso (valida el JSON importado en /ajustes) ─────────────── */

export const esqTarjetaSRS = z.object({
  id: z.string().min(3),
  facilidad: z.number().min(1.3).max(2.8),
  intervaloDias: z.number().int().min(0),
  repeticiones: z.number().int().min(0),
  proximaRevision: z.string().regex(RE_FECHA),
});

export const esqEstadoModulo = z.object({
  teoriaLeida: z.boolean(),
  tarjetasVistas: z.number().int().min(0),
  practicaCompletada: z.boolean(),
  mejorQuiz: z.number().min(0).max(100).nullable(),
  intentosQuiz: z.number().int().min(0),
  dominado: z.boolean(),
  ultimaVisita: z.string().nullable(),
});

const esqConteo = z.object({
  correctas: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const esqIntento = z.object({
  id: z.string().min(1),
  tipo: z.enum(['diagnostico', 'quiz', 'bloque', 'final']),
  ambito: z.string().min(1),
  semilla: z.number(),
  iniciadoEn: z.string(),
  terminadoEn: z.string(),
  segundosUsados: z.number().int().min(0),
  totalItems: z.number().int().min(1),
  itemIds: z.array(z.string()),
  respuestas: z.array(
    z.object({
      itemId: z.string(),
      respuesta: z.unknown(),
      correcta: z.boolean(),
      segundos: z.number().min(0),
      marcada: z.boolean(),
    }),
  ),
  puntaje: z.number().min(0).max(100),
  desglose: z.object({
    porBloque: z.record(esqConteo),
    porModulo: z.record(esqConteo),
    porNivel: z.record(esqConteo),
  }),
});

export const esqEstadoProgreso = z.object({
  version: z.literal(1),
  creadoEn: z.string(),
  nombre: z.string().max(40).optional(),
  fechaExamen: z.string().regex(RE_FECHA).optional(),
  diagnosticoHecho: z.boolean(),
  modulos: z.record(esqEstadoModulo),
  colaRepaso: z.record(esqTarjetaSRS),
  intentos: z.array(esqIntento),
  racha: z.object({ dias: z.number().int().min(0), ultimoDiaActivo: z.string() }),
  preferencias: z.object({
    tema: z.enum(['claro', 'oscuro', 'sistema']),
    sonido: z.boolean(),
    ultimoRespaldo: z.string().nullable(),
  }),
});

export type EstadoProgresoValidado = z.infer<typeof esqEstadoProgreso>;
```

**Por qué `verificarCuotas` es una función y no un `superRefine` de Zod:** las cuotas son propiedades de una *colección* de ítems, no de un ítem. Escribirlas como función pura las hace testeables con Vitest y reutilizables desde `CONTENIDO.md` (el agente puede correrla antes de marcar un módulo como completo).

---
## 6. Persistencia — `src/lib/almacenamiento.ts`

**Sin `"use client"`.** Es un módulo neutro con guardas de SSR: si se importa por accidente desde un Server Component no revienta, devuelve valores seguros. Aun así, **solo debe llamarse desde código cliente** (efectos, handlers, hooks).

Dos claves, deliberadamente separadas:

| Clave | Contenido | Por qué separada |
|---|---|---|
| `idoneo2210:estado` | `EstadoProgreso` completo | Se escribe pocas veces, es grande, se exporta a JSON. |
| `idoneo2210:sesion` | `SesionCronometro \| null` | Se escribe tras cada respuesta durante un simulacro. Mezclarla con el estado grande multiplicaría el costo de cada escritura. |

```ts
// src/lib/almacenamiento.ts
// Único punto de acceso a localStorage. Ver §22, regla 4.
// SIN "use client": módulo neutro con guardas de SSR.

import { esqEstadoProgreso } from './esquemas';
import type {
  EstadoModulo,
  EstadoProgreso,
  IntentoSimulacro,
  SesionCronometro,
  TarjetaSRS,
} from './tipos';

const CLAVE_ESTADO = 'idoneo2210:estado';
const CLAVE_SESION = 'idoneo2210:sesion';
export const VERSION_ESQUEMA = 1 as const;

/** Máximo de intentos que se conservan. FIFO: se descartan los más viejos. */
const MAX_INTENTOS = 30;

/* ─── Acceso crudo con degradación elegante ───────────────────────── */

/** Respaldo en memoria: modo incógnito de Safari lanza al escribir. */
const memoria = new Map<string, string>();
let localStorageUsable: boolean | null = null;

function hayLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorageUsable !== null) return localStorageUsable;
  try {
    const prueba = '__idoneo_prueba__';
    window.localStorage.setItem(prueba, '1');
    window.localStorage.removeItem(prueba);
    localStorageUsable = true;
  } catch {
    localStorageUsable = false;
  }
  return localStorageUsable;
}

function leerCrudo(clave: string): string | null {
  if (typeof window === 'undefined') return null;
  if (!hayLocalStorage()) return memoria.get(clave) ?? null;
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return memoria.get(clave) ?? null;
  }
}

function escribirCrudo(clave: string, valor: string): void {
  if (typeof window === 'undefined') return;
  memoria.set(clave, valor);
  if (!hayLocalStorage()) return;
  try {
    window.localStorage.setItem(clave, valor);
  } catch (error) {
    // QuotaExceededError: el estado sigue vivo en memoria durante la sesión.
    console.warn('[almacenamiento] no se pudo escribir en localStorage:', error);
  }
}

function borrarCrudo(clave: string): void {
  memoria.delete(clave);
  if (typeof window === 'undefined' || !hayLocalStorage()) return;
  try {
    window.localStorage.removeItem(clave);
  } catch {
    /* sin acción */
  }
}

/* ─── Estado inicial y migraciones ────────────────────────────────── */

export function crearEstadoInicial(ahoraISO: string): EstadoProgreso {
  return {
    version: VERSION_ESQUEMA,
    creadoEn: ahoraISO,
    diagnosticoHecho: false,
    modulos: {},
    colaRepaso: {},
    intentos: [],
    racha: { dias: 0, ultimoDiaActivo: '' },
    preferencias: { tema: 'sistema', sonido: true, ultimoRespaldo: null },
  };
}

export function estadoModuloInicial(): EstadoModulo {
  return {
    teoriaLeida: false,
    tarjetasVistas: 0,
    practicaCompletada: false,
    mejorQuiz: null,
    intentosQuiz: 0,
    dominado: false,
    ultimaVisita: null,
  };
}

/**
 * Convierte un objeto de cualquier versión anterior al esquema actual.
 * Devuelve null si el dato es irrecuperable — NO crea un estado nuevo, porque
 * esta función se llama desde el snapshot de React y no puede leer el reloj.
 * Cuando se cree la versión 2, se añade aquí un bloque `if (v.version === 1)`.
 * NUNCA borrar el progreso del usuario por un cambio de esquema.
 */
export function intentarMigrar(bruto: unknown): EstadoProgreso | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const candidato = bruto as Partial<EstadoProgreso>;

  // Sin versión = pre-lanzamiento. Se descarta.
  if (typeof candidato.version !== 'number') return null;

  // if (candidato.version === 1) { ...transformar a 2...; }

  const validado = esqEstadoProgreso.safeParse(candidato);
  if (!validado.success) {
    console.warn('[almacenamiento] estado corrupto, se reinicia:', validado.error.issues);
    return null;
  }
  return validado.data as EstadoProgreso;
}

/** Versión con respaldo. Solo se llama desde efectos y handlers, nunca en render. */
export function migrar(bruto: unknown, ahoraISO: string): EstadoProgreso {
  return intentarMigrar(bruto) ?? crearEstadoInicial(ahoraISO);
}

/* ─── Snapshot cacheado + suscripción (para useSyncExternalStore) ─── */

let snapshot: EstadoProgreso | null = null;
const oyentes = new Set<() => void>();

function notificar(): void {
  for (const oyente of oyentes) oyente();
}

export function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  // Sincroniza entre pestañas del mismo navegador.
  const alCambiarStorage = (e: StorageEvent) => {
    if (e.key === CLAVE_ESTADO) {
      snapshot = null;
      notificar();
    }
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', alCambiarStorage);
  return () => {
    oyentes.delete(oyente);
    if (typeof window !== 'undefined') window.removeEventListener('storage', alCambiarStorage);
  };
}

/** Snapshot estable: devuelve SIEMPRE la misma referencia hasta que hay escritura.
 *  Sin esto, useSyncExternalStore entra en bucle infinito de renders.
 *  No lee el reloj: se ejecuta durante el render. Ver §22, regla 6. */
export function obtenerSnapshot(): EstadoProgreso | null {
  if (snapshot) return snapshot;
  const crudo = leerCrudo(CLAVE_ESTADO);
  if (!crudo) return null;
  try {
    snapshot = intentarMigrar(JSON.parse(crudo));
    return snapshot;
  } catch {
    return null;
  }
}

/** Snapshot del servidor: siempre null. Provoca que el primer render (server y
 *  cliente) sea idéntico y el estado real llegue en el render siguiente. */
export function obtenerSnapshotServidor(): null {
  return null;
}

/* ─── API pública ─────────────────────────────────────────────────── */

/** Lee el estado; si no existe, lo crea y lo persiste. Solo desde cliente. */
export function leerEstado(ahoraISO: string): EstadoProgreso {
  const actual = obtenerSnapshot();
  if (actual) return actual;
  const nuevo = crearEstadoInicial(ahoraISO);
  guardarEstado(nuevo);
  return nuevo;
}

export function guardarEstado(estado: EstadoProgreso): void {
  snapshot = estado;
  escribirCrudo(CLAVE_ESTADO, JSON.stringify(estado));
  notificar();
}

/**
 * Único mutador. Recibe el estado actual y devuelve el nuevo.
 * SIEMPRE devuelve un objeto nuevo (inmutable) para que React detecte el cambio.
 */
export function actualizarEstado(
  ahoraISO: string,
  transformar: (estado: EstadoProgreso) => EstadoProgreso,
): EstadoProgreso {
  const siguiente = transformar(leerEstado(ahoraISO));
  guardarEstado(siguiente);
  return siguiente;
}

export function reiniciarTodo(): void {
  borrarCrudo(CLAVE_ESTADO);
  borrarCrudo(CLAVE_SESION);
  snapshot = null;
  notificar();
}

/* ─── Mutadores de dominio ────────────────────────────────────────── */

function conModulo(
  estado: EstadoProgreso,
  slug: string,
  ahoraISO: string,
  cambio: (m: EstadoModulo) => EstadoModulo,
): EstadoProgreso {
  const actual = estado.modulos[slug] ?? estadoModuloInicial();
  const siguiente = { ...cambio(actual), ultimaVisita: ahoraISO };
  return { ...estado, modulos: { ...estado.modulos, [slug]: siguiente } };
}

export function marcarTeoriaLeida(slug: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({ ...m, teoriaLeida: true })),
  );
}

export function registrarTarjetasVistas(slug: string, cantidad: number, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({
      ...m,
      tarjetasVistas: Math.max(m.tarjetasVistas, cantidad),
    })),
  );
}

export function marcarPracticaCompletada(slug: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => ({ ...m, practicaCompletada: true })),
  );
}

/** Umbral de dominio: 80 %. Definido en §3.2 del documento de contenido. */
export const UMBRAL_DOMINIO = 80;

export function registrarQuiz(slug: string, puntaje: number, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) =>
    conModulo(e, slug, ahoraISO, (m) => {
      const mejor = m.mejorQuiz === null ? puntaje : Math.max(m.mejorQuiz, puntaje);
      return {
        ...m,
        mejorQuiz: mejor,
        intentosQuiz: m.intentosQuiz + 1,
        dominado: mejor >= UMBRAL_DOMINIO,
      };
    }),
  );
}

export function guardarIntento(intento: IntentoSimulacro, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => ({
    ...e,
    diagnosticoHecho: e.diagnosticoHecho || intento.tipo === 'diagnostico',
    intentos: [intento, ...e.intentos].slice(0, MAX_INTENTOS),
  }));
}

export function obtenerIntento(estado: EstadoProgreso, id: string): IntentoSimulacro | null {
  return estado.intentos.find((i) => i.id === id) ?? null;
}

/** Reemplaza la cola de repaso completa. lib/srs.ts calcula el contenido. */
export function guardarColaRepaso(cola: Record<string, TarjetaSRS>, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => ({ ...e, colaRepaso: cola }));
}

export function guardarPreferencias(
  cambios: Partial<EstadoProgreso['preferencias']>,
  ahoraISO: string,
): void {
  actualizarEstado(ahoraISO, (e) => ({
    ...e,
    preferencias: { ...e.preferencias, ...cambios },
  }));
}

export function guardarDatosPersonales(
  cambios: { nombre?: string; fechaExamen?: string },
  ahoraISO: string,
): void {
  actualizarEstado(ahoraISO, (e) => ({ ...e, ...cambios }));
}

/**
 * Racha: +1 si el último día activo fue ayer, se mantiene si fue hoy,
 * se reinicia a 1 en cualquier otro caso. `hoy` en formato 'YYYY-MM-DD'.
 */
export function tocarRacha(hoy: string, ayer: string, ahoraISO: string): void {
  actualizarEstado(ahoraISO, (e) => {
    if (e.racha.ultimoDiaActivo === hoy) return e;
    const dias = e.racha.ultimoDiaActivo === ayer ? e.racha.dias + 1 : 1;
    return { ...e, racha: { dias, ultimoDiaActivo: hoy } };
  });
}

/* ─── Sesión cronometrada ─────────────────────────────────────────── */

export function leerSesion(): SesionCronometro | null {
  const crudo = leerCrudo(CLAVE_SESION);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as SesionCronometro;
  } catch {
    borrarCrudo(CLAVE_SESION);
    return null;
  }
}

export function guardarSesion(sesion: SesionCronometro): void {
  escribirCrudo(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion(): void {
  borrarCrudo(CLAVE_SESION);
}

/* ─── Exportar / importar ─────────────────────────────────────────── */

export function exportarJSON(estado: EstadoProgreso): string {
  return JSON.stringify(estado, null, 2);
}

export function nombreArchivoRespaldo(hoy: string): string {
  return `idoneo-2210-respaldo-${hoy}.json`;
}

export type ResultadoImportacion =
  | { ok: true; estado: EstadoProgreso }
  | { ok: false; error: string };

/**
 * Valida con Zod antes de tocar nada. Un archivo corrupto NUNCA debe
 * destruir el progreso actual: por eso devuelve un resultado en vez de escribir.
 */
export function importarJSON(texto: string): ResultadoImportacion {
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }
  const validado = esqEstadoProgreso.safeParse(bruto);
  if (!validado.success) {
    const primero = validado.error.issues[0];
    return {
      ok: false,
      error: `El archivo no es un respaldo de Idóneo 2210 (${primero.path.join('.') || 'raíz'}: ${primero.message}).`,
    };
  }
  return { ok: true, estado: validado.data as EstadoProgreso };
}

/** Recordatorio de respaldo cada 7 días de uso. */
export function necesitaRespaldo(estado: EstadoProgreso, hoy: string, ayerHace7: string): boolean {
  if (estado.intentos.length === 0) return false;
  if (!estado.preferencias.ultimoRespaldo) return estado.racha.dias >= 7;
  return estado.preferencias.ultimoRespaldo <= ayerHace7 && estado.racha.ultimoDiaActivo === hoy;
}
```

### 6.1 Hook `src/hooks/usar-estado.ts`

```ts
'use client';

import { useSyncExternalStore } from 'react';
import {
  obtenerSnapshot,
  obtenerSnapshotServidor,
  suscribir,
} from '@/lib/almacenamiento';
import type { EstadoProgreso } from '@/lib/tipos';

/**
 * Devuelve null en el primer render (servidor e hidratación) y el estado real
 * a partir del segundo. Todo componente que lo use DEBE renderizar un esqueleto
 * mientras sea null — nunca un valor por defecto que luego "salte".
 */
export function useEstado(): EstadoProgreso | null {
  return useSyncExternalStore(suscribir, obtenerSnapshot, obtenerSnapshotServidor);
}
```

---

## 7. Los cinco motores

Todos viven en `src/lib/`, **ninguno lleva `"use client"`**, y **ninguno llama al reloj**: reciben `ahoraISO` o `ahoraMs` como parámetro. Esto los hace puros, deterministas y testeables sin mocks — y elimina de raíz los errores de hidratación.

### 7.1 `src/lib/fechas.ts`

```ts
// src/lib/fechas.ts
// Helpers de fecha deterministas. Ninguna función llama a Date.now()
// ni a `new Date()` sin argumentos: todas derivan de sus parámetros.

/** 'YYYY-MM-DD' a partir de un ISO completo. */
export function soloFecha(iso: string): string {
  return iso.slice(0, 10);
}

function aUTC(fecha: string): number {
  const [a, m, d] = fecha.slice(0, 10).split('-').map(Number);
  return Date.UTC(a, m - 1, d);
}

/** Días calendario entre dos fechas 'YYYY-MM-DD'. Positivo si `hasta` es posterior. */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUTC(hasta) - aUTC(desde)) / 86_400_000);
}

export function sumarDias(fecha: string, dias: number): string {
  const t = aUTC(fecha) + dias * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** 'sáb 2 ago' — para las cabeceras del plan. */
export function etiquetaCorta(fecha: string): string {
  const t = new Date(`${fecha.slice(0, 10)}T12:00:00Z`);
  return t
    .toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    })
    .replace('.', '');
}

/** 'MM:SS' o 'H:MM:SS' si pasa de una hora. Para el cronómetro. */
export function formatearDuracion(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const dd = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${dd(m)}:${dd(seg)}` : `${dd(m)}:${dd(seg)}`;
}
```

### 7.2 Motor de repaso espaciado — `src/lib/srs.ts`

SM-2 simplificado con calidad binaria. Reglas del brief §6.1, sin desviaciones.

```ts
// src/lib/srs.ts
// SM-2 simplificado, calidad binaria (acertó / falló).
// Funciones puras: reciben `hoy` en formato 'YYYY-MM-DD'.

import { diasEntre, sumarDias } from './fechas';
import type { TarjetaSRS } from './tipos';

export const FACILIDAD_INICIAL = 2.5;
export const FACILIDAD_MIN = 1.3;
export const FACILIDAD_MAX = 2.8;
export const LIMITE_COLA_DIARIA = 30;

export function crearTarjetaSRS(id: string, hoy: string): TarjetaSRS {
  return {
    id,
    facilidad: FACILIDAD_INICIAL,
    intervaloDias: 0,
    repeticiones: 0,
    proximaRevision: hoy,
  };
}

/**
 * Calcula el siguiente estado de una tarjeta tras una respuesta.
 *
 *  Falla   → repeticiones = 0, intervalo = 1 día, EF = max(1.3, EF − 0.2)
 *  Acierta → repeticiones++, EF = min(2.8, EF + 0.1)
 *            intervalo: 1 (1.ª) · 3 (2.ª) · redondear(intervalo × EF) (3.ª+)
 */
export function programarSiguiente(
  tarjeta: TarjetaSRS,
  acerto: boolean,
  hoy: string,
): TarjetaSRS {
  if (!acerto) {
    return {
      ...tarjeta,
      repeticiones: 0,
      intervaloDias: 1,
      facilidad: Math.max(FACILIDAD_MIN, redondear2(tarjeta.facilidad - 0.2)),
      proximaRevision: sumarDias(hoy, 1),
    };
  }

  const repeticiones = tarjeta.repeticiones + 1;
  const facilidad = Math.min(FACILIDAD_MAX, redondear2(tarjeta.facilidad + 0.1));
  const intervaloDias =
    repeticiones === 1 ? 1 : repeticiones === 2 ? 3 : Math.round(tarjeta.intervaloDias * facilidad);

  return {
    ...tarjeta,
    repeticiones,
    facilidad,
    intervaloDias,
    proximaRevision: sumarDias(hoy, intervaloDias),
  };
}

function redondear2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Registra el resultado de una revisión sobre la cola completa. */
export function registrarRevision(
  cola: Record<string, TarjetaSRS>,
  id: string,
  acerto: boolean,
  hoy: string,
): Record<string, TarjetaSRS> {
  const actual = cola[id] ?? crearTarjetaSRS(id, hoy);
  return { ...cola, [id]: programarSiguiente(actual, acerto, hoy) };
}

/**
 * Encola elementos nuevos. Se llama con:
 *  - toda tarjeta vista en la etapa Tarjetas
 *  - todo ítem fallado en práctica, quiz o simulacro
 * Si el elemento ya está en la cola no se toca (no se reinicia su progreso).
 */
export function encolar(
  cola: Record<string, TarjetaSRS>,
  ids: readonly string[],
  hoy: string,
): Record<string, TarjetaSRS> {
  const siguiente = { ...cola };
  for (const id of ids) {
    if (!siguiente[id]) siguiente[id] = crearTarjetaSRS(id, hoy);
  }
  return siguiente;
}

/**
 * Cola del día: vencidas y de hoy, priorizando las más atrasadas.
 * Máximo LIMITE_COLA_DIARIA elementos. Orden determinista (desempate por id).
 */
export function colaDelDia(
  cola: Record<string, TarjetaSRS>,
  hoy: string,
  limite: number = LIMITE_COLA_DIARIA,
): TarjetaSRS[] {
  return Object.values(cola)
    .filter((t) => t.proximaRevision <= hoy)
    .sort((a, b) => {
      const atrasoA = diasEntre(a.proximaRevision, hoy);
      const atrasoB = diasEntre(b.proximaRevision, hoy);
      return atrasoB - atrasoA || a.id.localeCompare(b.id);
    })
    .slice(0, limite);
}

export interface ResumenRepaso {
  pendientesHoy: number;
  totalEnCola: number;
  /** Días hasta el próximo repaso cuando hoy no hay nada. null si la cola está vacía. */
  proximoEnDias: number | null;
}

export function resumirRepaso(cola: Record<string, TarjetaSRS>, hoy: string): ResumenRepaso {
  const todas = Object.values(cola);
  const pendientes = todas.filter((t) => t.proximaRevision <= hoy);
  const futuras = todas
    .filter((t) => t.proximaRevision > hoy)
    .map((t) => diasEntre(hoy, t.proximaRevision))
    .sort((a, b) => a - b);

  return {
    pendientesHoy: pendientes.length,
    totalEnCola: todas.length,
    proximoEnDias: futuras.length > 0 ? futuras[0] : null,
  };
}
```

> **Estado vacío honesto:** si `colaDelDia` devuelve `[]`, la ruta `/repaso` **no** rellena con elementos artificiales. Muestra el mensaje positivo (`"Nada que repasar hoy — tu memoria va al día"`), el `proximoEnDias`, y un enlace al siguiente módulo sin dominar. Regla del brief §6.1, no negociable.

### 7.3 Motor de simulacro — `src/lib/simulacro.ts`

Tres responsabilidades: **muestrear** de forma estratificada y determinista, **presentar** (barajar opciones con la misma semilla) y **calificar**.

```ts
// src/lib/simulacro.ts
// Muestreo estratificado determinista + barajado reproducible + calificación.
// Funciones puras. SIN "use client".

import type {
  BloqueId,
  BlueprintExamen,
  Item,
  NivelCognitivo,
  TipoItem,
} from './tipos';

/* ─── PRNG determinista (mulberry32) ──────────────────────────────── */

export type Rng = () => number;

/** Misma semilla ⇒ misma secuencia, en cualquier navegador y en Node. */
export function crearRng(semilla: number): Rng {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates con el rng inyectado. Nunca usar Math.random(). */
export function barajar<T>(lista: readonly T[], rng: Rng): T[] {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ─── Muestreo estratificado ──────────────────────────────────────── */

interface Unidad {
  clave: string;
  cuota: number;
  pool: Item[];
}

/**
 * Arma un simulacro respetando el blueprint.
 *
 * Restricción PRIMARIA (se satisface exactamente): el reparto por módulo o
 * por bloque. Restricciones SECUNDARIAS (se satisfacen por aproximación
 * codiciosa): las cuotas por nivel cognitivo y por tipo de ítem. No existe
 * una solución exacta simultánea en el caso general — es un problema de flujo —
 * y una heurística codiciosa con déficit da desviaciones de 1–2 ítems, que es
 * irrelevante pedagógicamente y cuesta 40 líneas en vez de 400.
 *
 * `itemsRecientes` son los ítems vistos en los últimos 2 intentos: se penalizan
 * sin prohibirse, para que un segundo simulacro no sea el mismo examen.
 *
 * Determinismo: mismos (blueprint, banco, semilla, itemsRecientes) ⇒ mismo
 * resultado. El orden del banco se normaliza por id antes de muestrear.
 */
export function armarSimulacro(
  bp: BlueprintExamen,
  banco: readonly Item[],
  semilla: number,
  itemsRecientes: readonly string[] = [],
): Item[] {
  const rng = crearRng(semilla);
  const recientes = new Set(itemsRecientes);

  const elegibles = banco
    .filter(
      (it) =>
        (!bp.tiposPermitidos || bp.tiposPermitidos.includes(it.tipo)) &&
        (!bp.dificultadesPermitidas || bp.dificultadesPermitidas.includes(it.dificultad)),
    )
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));

  const deficitNivel: Record<NivelCognitivo, number> = { ...bp.porNivel };
  const deficitTipo = new Map<TipoItem, number>(
    Object.entries(bp.porTipo ?? {}).map(([t, n]) => [t as TipoItem, n as number]),
  );

  const usados = new Set<string>();
  const seleccion: Item[] = [];

  const unidades: Unidad[] =
    bp.reparto.tipo === 'modulo'
      ? Object.entries(bp.reparto.cuotas).map(([slug, cuota]) => ({
          clave: slug,
          cuota,
          pool: elegibles.filter((it) => it.modulo === slug),
        }))
      : Object.entries(bp.reparto.cuotas).map(([bloque, cuota]) => ({
          clave: bloque,
          cuota: cuota as number,
          pool: elegibles.filter((it) => it.bloque === (bloque as BloqueId)),
        }));

  // Primero las unidades con menos margen: si un módulo tiene justo los ítems
  // que le tocan, hay que servirlo antes de que otro le robe candidatos.
  unidades.sort(
    (a, b) =>
      a.pool.length - a.cuota - (b.pool.length - b.cuota) || a.clave.localeCompare(b.clave),
  );

  const tomar = (candidatos: Item[]): Item | null => {
    if (candidatos.length === 0) return null;
    const elegido = elegirMejor(candidatos, deficitNivel, deficitTipo, recientes, rng);
    usados.add(elegido.id);
    seleccion.push(elegido);
    deficitNivel[elegido.nivel] -= 1;
    const dt = deficitTipo.get(elegido.tipo);
    if (dt !== undefined) deficitTipo.set(elegido.tipo, dt - 1);
    return elegido;
  };

  for (const unidad of unidades) {
    for (let n = 0; n < unidad.cuota; n++) {
      if (!tomar(unidad.pool.filter((it) => !usados.has(it.id)))) break;
    }
  }

  // Relleno: si algún módulo no tenía ítems suficientes (contenido en
  // preparación), se completa desde el pool global para no entregar un
  // simulacro corto.
  while (seleccion.length < bp.totalItems) {
    if (!tomar(elegibles.filter((it) => !usados.has(it.id)))) break;
  }

  return barajar(seleccion.slice(0, bp.totalItems), rng);
}

function elegirMejor(
  candidatos: Item[],
  deficitNivel: Record<NivelCognitivo, number>,
  deficitTipo: Map<TipoItem, number>,
  recientes: Set<string>,
  rng: Rng,
): Item {
  let mejor = candidatos[0];
  let mejorPuntaje = -Infinity;
  for (const it of candidatos) {
    const bonoNivel = deficitNivel[it.nivel] > 0 ? 3 : 0;
    const objetivoTipo = deficitTipo.get(it.tipo);
    const bonoTipo = objetivoTipo === undefined ? 0 : objetivoTipo > 0 ? 2 : -1;
    const castigo = recientes.has(it.id) ? 2 : 0;
    // El jitter desempata de forma determinista dada la semilla.
    const puntaje = bonoNivel + bonoTipo - castigo + rng() * 0.9;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = it;
    }
  }
  return mejor;
}

/** Diagnóstico de desviación. Se usa en los tests y en el validador. */
export interface Cobertura {
  total: number;
  porUnidad: Record<string, { obtenido: number; objetivo: number }>;
  porNivel: Record<NivelCognitivo, { obtenido: number; objetivo: number }>;
  porTipo: Partial<Record<TipoItem, { obtenido: number; objetivo: number }>>;
}

export function medirCobertura(bp: BlueprintExamen, items: readonly Item[]): Cobertura {
  const porUnidad: Cobertura['porUnidad'] = {};
  const cuotas = bp.reparto.cuotas as Record<string, number>;
  for (const [clave, objetivo] of Object.entries(cuotas)) {
    const obtenido = items.filter((it) =>
      bp.reparto.tipo === 'modulo' ? it.modulo === clave : it.bloque === clave,
    ).length;
    porUnidad[clave] = { obtenido, objetivo };
  }

  const porNivel = {
    recuerdo: { obtenido: 0, objetivo: bp.porNivel.recuerdo },
    comprension: { obtenido: 0, objetivo: bp.porNivel.comprension },
    aplicacion: { obtenido: 0, objetivo: bp.porNivel.aplicacion },
  };
  for (const it of items) porNivel[it.nivel].obtenido += 1;

  const porTipo: Cobertura['porTipo'] = {};
  for (const [tipo, objetivo] of Object.entries(bp.porTipo ?? {})) {
    porTipo[tipo as TipoItem] = {
      obtenido: items.filter((it) => it.tipo === tipo).length,
      objetivo: objetivo as number,
    };
  }

  return { total: items.length, porUnidad, porNivel, porTipo };
}

/* ─── Presentación (barajado de opciones) ─────────────────────────── */

/**
 * Devuelve una copia del ítem con las opciones barajadas y los índices
 * correctos remapeados. Reproducible: misma semilla ⇒ mismo barajado, lo que
 * permite revisar un intento con exactamente la pantalla que vio el usuario.
 *
 * `vf` y `calculo` se devuelven intactos: no tienen opciones que barajar.
 */
export function presentarItem(item: Item, rng: Rng): Item {
  switch (item.tipo) {
    case 'unica':
    case 'caso': {
      const idx = barajar(
        item.opciones.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        opciones: idx.map((i) => item.opciones[i]),
        correcta: idx.indexOf(item.correcta),
      };
    }
    case 'multiple': {
      const idx = barajar(
        item.opciones.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        opciones: idx.map((i) => item.opciones[i]),
        correctas: item.correctas.map((c) => idx.indexOf(c)).sort((a, b) => a - b),
      };
    }
    case 'emparejar': {
      const idx = barajar(
        item.derecha.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        derecha: idx.map((i) => item.derecha[i]),
        pares: item.pares.map(([i, d]) => [i, idx.indexOf(d)] as [number, number]),
      };
    }
    case 'ordenar': {
      const idx = barajar(
        item.elementos.map((_, i) => i),
        rng,
      );
      return {
        ...item,
        elementos: idx.map((i) => item.elementos[i]),
        // ordenCorrecto[k] = posición, en el array barajado, del elemento
        // que debe ir en el lugar k.
        ordenCorrecto: item.ordenCorrecto.map((o) => idx.indexOf(o)),
      };
    }
    default:
      return item;
  }
}

/** Presenta una tanda completa. El rng avanza ítem a ítem: el resultado
 *  depende del orden, que es justamente lo que se quiere reproducir. */
export function presentarTanda(items: readonly Item[], semilla: number): Item[] {
  const rng = crearRng(semilla);
  return items.map((it) => presentarItem(it, rng));
}

/* ─── Calificación ────────────────────────────────────────────────── */

/**
 * Forma de `respuesta` según el tipo:
 *   unica | caso  → number (índice)
 *   multiple      → number[] (índices)
 *   vf            → boolean
 *   emparejar     → [number, number][] (pares elegidos)
 *   calculo       → number
 *   ordenar       → number[] (posiciones del array presentado, en el orden
 *                             en que el usuario las colocó)
 * Cualquier otra forma se califica como incorrecta, nunca lanza.
 */
export function calificar(item: Item, respuesta: unknown): boolean {
  switch (item.tipo) {
    case 'unica':
    case 'caso':
      return typeof respuesta === 'number' && respuesta === item.correcta;

    case 'vf':
      return typeof respuesta === 'boolean' && respuesta === item.correcta;

    case 'calculo':
      return (
        typeof respuesta === 'number' &&
        Number.isFinite(respuesta) &&
        Math.abs(respuesta - item.respuesta) <= item.tolerancia
      );

    case 'multiple': {
      if (!Array.isArray(respuesta)) return false;
      const dadas = [...new Set(respuesta.filter((n): n is number => typeof n === 'number'))].sort(
        (a, b) => a - b,
      );
      const esperadas = [...item.correctas].sort((a, b) => a - b);
      return dadas.length === esperadas.length && dadas.every((v, i) => v === esperadas[i]);
    }

    case 'ordenar': {
      if (!Array.isArray(respuesta)) return false;
      return (
        respuesta.length === item.ordenCorrecto.length &&
        respuesta.every((v, i) => v === item.ordenCorrecto[i])
      );
    }

    case 'emparejar': {
      if (!Array.isArray(respuesta)) return false;
      const pares = respuesta as unknown[];
      if (pares.length !== item.pares.length) return false;
      const esperado = new Map(item.pares);
      const vistos = new Set<number>();
      for (const par of pares) {
        if (!Array.isArray(par) || par.length !== 2) return false;
        const [i, d] = par as [unknown, unknown];
        if (typeof i !== 'number' || typeof d !== 'number') return false;
        if (vistos.has(i)) return false;
        vistos.add(i);
        if (esperado.get(i) !== d) return false;
      }
      return true;
    }
  }
}

/** true si el usuario dejó el ítem sin tocar. Distingue "en blanco" de "errado". */
export function sinResponder(respuesta: unknown): boolean {
  if (respuesta === null || respuesta === undefined) return true;
  if (Array.isArray(respuesta)) return respuesta.length === 0;
  if (typeof respuesta === 'string') return respuesta.trim() === '';
  return false;
}

/** Ítems vistos en los últimos N intentos. Alimenta `itemsRecientes`. */
export function itemsDeIntentosRecientes(
  intentos: readonly { itemIds: string[] }[],
  cuantos = 2,
): string[] {
  return [...new Set(intentos.slice(0, cuantos).flatMap((i) => i.itemIds))];
}
```

> **Reproducir un intento para revisarlo** no vuelve a muestrear: `IntentoSimulacro.itemIds` guarda el orden exacto y `semilla` reproduce el barajado de opciones. Re-muestrear daría el mismo resultado solo si el banco no cambió — y el banco cambia entre los pasos 15 y 17. Guardar los ids es lo correcto.

### 7.4 Motor de cronómetro — `src/lib/cronometro.ts`

```ts
// src/lib/cronometro.ts
// Lógica pura del cronómetro. SIN "use client" y SIN Date.now():
// el tiempo actual entra siempre como parámetro `ahoraMs`.

import type { SesionCronometro } from './tipos';

/** Avisos en segundos restantes: 20 min, 10 min, 2 min. Brief §6.3. */
export const UMBRALES_AVISO = [1200, 600, 120] as const;
export type UmbralAviso = (typeof UMBRALES_AVISO)[number];

export const TEXTO_AVISO: Record<UmbralAviso, string> = {
  1200: 'Quedan 20 minutos.',
  600: 'Quedan 10 minutos. Prioriza los ítems sin responder.',
  120: 'Últimos 2 minutos. Se enviará automáticamente al llegar a cero.',
};

/** Segundos transcurridos desde el inicio, según el reloj real. */
export function transcurridos(sesion: SesionCronometro, ahoraMs: number): number {
  return Math.max(0, Math.floor((ahoraMs - sesion.iniciadoEnMs) / 1000));
}

/**
 * Segundos restantes. null si la sesión no tiene límite (quiz de módulo).
 * Se recalcula SIEMPRE contra el reloj real, nunca contra un contador en
 * memoria: cerrar la pestaña no regala tiempo.
 */
export function restantes(sesion: SesionCronometro, ahoraMs: number): number | null {
  if (sesion.duracionSegundos === null) return null;
  return Math.max(0, sesion.duracionSegundos - transcurridos(sesion, ahoraMs));
}

export function seAcabo(sesion: SesionCronometro, ahoraMs: number): boolean {
  const r = restantes(sesion, ahoraMs);
  return r !== null && r <= 0;
}

/**
 * Avisos que deben mostrarse ahora y aún no se mostraron.
 * Devuelve el umbral más pequeño cruzado: si el usuario vuelve tras 15 min de
 * ausencia no se le apilan tres notificaciones, se le muestra la relevante.
 */
export function avisoPendiente(
  sesion: SesionCronometro,
  ahoraMs: number,
): UmbralAviso | null {
  const r = restantes(sesion, ahoraMs);
  if (r === null || r <= 0) return null;
  const cruzados = UMBRALES_AVISO.filter(
    (u) => r <= u && !sesion.avisosVistos.includes(u),
  );
  return cruzados.length > 0 ? cruzados[cruzados.length - 1] : null;
}

export function marcarAvisoVisto(
  sesion: SesionCronometro,
  umbral: UmbralAviso,
): SesionCronometro {
  // Marca también los umbrales mayores: si mostramos el de 10 min,
  // el de 20 ya no tiene sentido.
  const aMarcar = UMBRALES_AVISO.filter((u) => u >= umbral);
  return {
    ...sesion,
    avisosVistos: [...new Set([...sesion.avisosVistos, ...aMarcar])],
  };
}

/** 'normal' | 'atencion' (≤10 min) | 'critico' (≤2 min). Dirige el color. */
export type SeveridadCronometro = 'normal' | 'atencion' | 'critico';

export function severidad(restantesSeg: number | null): SeveridadCronometro {
  if (restantesSeg === null) return 'normal';
  if (restantesSeg <= 120) return 'critico';
  if (restantesSeg <= 600) return 'atencion';
  return 'normal';
}

export interface ResumenNavegacion {
  respondidas: number;
  marcadas: number;
  sinResponder: number;
}

export function resumirNavegacion(sesion: SesionCronometro): ResumenNavegacion {
  let respondidas = 0;
  let marcadas = 0;
  for (const id of sesion.itemIds) {
    const r = sesion.respuestas[id];
    if (r && r.valor !== null && r.valor !== undefined) respondidas += 1;
    if (r?.marcada) marcadas += 1;
  }
  return { respondidas, marcadas, sinResponder: sesion.itemIds.length - respondidas };
}

export type EstadoItemNav = 'sin-responder' | 'respondida' | 'marcada';

export function estadoItem(sesion: SesionCronometro, itemId: string): EstadoItemNav {
  const r = sesion.respuestas[itemId];
  if (r?.marcada) return 'marcada';
  if (r && r.valor !== null && r.valor !== undefined) return 'respondida';
  return 'sin-responder';
}
```

#### Hook `src/hooks/usar-cronometro.ts`

```ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { avisoPendiente, restantes, seAcabo, type UmbralAviso } from '@/lib/cronometro';
import type { SesionCronometro } from '@/lib/tipos';

interface Resultado {
  /** null durante el primer render (evita mismatch de hidratación). */
  restantesSeg: number | null;
  terminado: boolean;
  aviso: UmbralAviso | null;
}

/**
 * Único lugar de la app donde se lee el reloj para el cronómetro.
 * Devuelve null en el primer render: el componente muestra "--:--" y el valor
 * real aparece en el tick siguiente. Ver §22, regla 6.
 */
export function usarCronometro(
  sesion: SesionCronometro | null,
  alTerminar: () => void,
): Resultado {
  const [restantesSeg, setRestantes] = useState<number | null>(null);
  const [aviso, setAviso] = useState<UmbralAviso | null>(null);
  const [terminado, setTerminado] = useState(false);
  const yaEnvie = useRef(false);

  useEffect(() => {
    if (!sesion) return;

    const tick = () => {
      const ahora = Date.now();
      setRestantes(restantes(sesion, ahora));
      setAviso(avisoPendiente(sesion, ahora));
      if (seAcabo(sesion, ahora) && !yaEnvie.current) {
        yaEnvie.current = true;
        setTerminado(true);
        alTerminar();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    // Recalcula al volver de segundo plano: los timers se congelan en móvil.
    const alVolver = () => tick();
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alVolver);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', alVolver);
    };
  }, [sesion, alTerminar]);

  return { restantesSeg, terminado, aviso };
}
```

### 7.5 Motor de informe — `src/lib/informe.ts`

```ts
// src/lib/informe.ts
// Construye el informe diagnóstico. Funciones puras. SIN "use client".

import { sinResponder } from './simulacro';
import type {
  BloqueId,
  Bloque,
  DesgloseIntento,
  Informe,
  IntentoSimulacro,
  Item,
  Modulo,
  NivelCognitivo,
  RespuestaItem,
  TemaPrioritario,
  Veredicto,
} from './tipos';

const BLOQUES: BloqueId[] = ['A', 'B', 'C', 'D'];
const NIVELES: NivelCognitivo[] = ['recuerdo', 'comprension', 'aplicacion'];

/** Mínimo de ítems evaluados para que un módulo pueda entrar al top-5. */
export const MIN_ITEMS_TEMA_PRIORITARIO = 3;

export function calcularDesglose(
  items: readonly Item[],
  respuestas: readonly RespuestaItem[],
): DesgloseIntento {
  const porItem = new Map(items.map((it) => [it.id, it]));

  const porBloque = Object.fromEntries(
    BLOQUES.map((b) => [b, { correctas: 0, total: 0 }]),
  ) as DesgloseIntento['porBloque'];
  const porNivel = Object.fromEntries(
    NIVELES.map((n) => [n, { correctas: 0, total: 0 }]),
  ) as DesgloseIntento['porNivel'];
  const porModulo: DesgloseIntento['porModulo'] = {};

  for (const r of respuestas) {
    const item = porItem.get(r.itemId);
    if (!item) continue;

    porBloque[item.bloque].total += 1;
    porNivel[item.nivel].total += 1;
    porModulo[item.modulo] ??= { correctas: 0, total: 0 };
    porModulo[item.modulo].total += 1;

    if (r.correcta) {
      porBloque[item.bloque].correctas += 1;
      porNivel[item.nivel].correctas += 1;
      porModulo[item.modulo].correctas += 1;
    }
  }

  return { porBloque, porModulo, porNivel };
}

export function calcularPuntaje(respuestas: readonly RespuestaItem[], total: number): number {
  if (total === 0) return 0;
  return Math.round((respuestas.filter((r) => r.correcta).length / total) * 100);
}

/** Escala de §3.4 del documento de contenido. Criterio interno de la app,
 *  NO el puntaje oficial de aprobación de COLEF: el informe lo dice. */
export function calcularVeredicto(puntaje: number): Veredicto {
  if (puntaje >= 85) {
    return {
      clave: 'solido',
      titulo: 'Sólido',
      mensaje:
        'Estás listo. Mantén con repaso diario y un simulacro cada 4 días para no perder filo.',
      color: 'exito',
    };
  }
  if (puntaje >= 75) {
    return {
      clave: 'listo',
      titulo: 'Listo',
      mensaje:
        'Pasarías, pero sin margen. Cierra los 3 módulos más débiles antes de presentar.',
      color: 'primary',
    };
  }
  if (puntaje >= 60) {
    return {
      clave: 'camino',
      titulo: 'En camino',
      mensaje:
        'Todavía no. Tienes la base; te falta precisión en los datos. Necesitas 2 semanas más.',
      color: 'aviso',
    };
  }
  return {
    clave: 'riesgo',
    titulo: 'En riesgo',
    mensaje:
      'No presentes aún. Vuelve al plan por módulos: el simulacro es para medir, no para estudiar.',
    color: 'destructive',
  };
}

export const NOTA_VEREDICTO =
  'Estos cortes son criterios internos de Idóneo 2210, con margen de seguridad. ' +
  'No corresponden al puntaje oficial de aprobación de COLEF.';

function porcentaje(c: { correctas: number; total: number }): number {
  return c.total === 0 ? 0 : Math.round((c.correctas / c.total) * 100);
}

/** Los 5 módulos con peor razón correctas/total y al menos 3 ítems evaluados. */
export function temasPrioritarios(
  desglose: DesgloseIntento,
  modulos: readonly Modulo[],
  maximo = 5,
): TemaPrioritario[] {
  const porSlug = new Map(modulos.map((m) => [m.slug, m]));
  return Object.entries(desglose.porModulo)
    .filter(([, c]) => c.total >= MIN_ITEMS_TEMA_PRIORITARIO)
    .map(([slug, c]) => {
      const modulo = porSlug.get(slug);
      return {
        modulo: slug,
        titulo: modulo?.titulo ?? slug,
        bloque: (modulo?.bloque ?? 'A') as BloqueId,
        correctas: c.correctas,
        total: c.total,
        porcentaje: porcentaje(c),
      };
    })
    .sort((a, b) => a.porcentaje - b.porcentaje || b.total - a.total || a.modulo.localeCompare(b.modulo))
    .slice(0, maximo);
}

/**
 * Detección de patrón. Devuelve mensajes accionables, no felicitaciones.
 * Puede devolver un array vacío: no se inventa un patrón que no existe.
 */
export function detectarPatrones(desglose: DesgloseIntento): string[] {
  const mensajes: string[] = [];
  const rec = desglose.porNivel.recuerdo;
  const apl = desglose.porNivel.aplicacion;
  const com = desglose.porNivel.comprension;

  if (rec.total >= 5 && apl.total >= 5) {
    const dRec = porcentaje(rec);
    const dApl = porcentaje(apl);
    if (dRec - dApl >= 25) {
      mensajes.push(
        'Te sabes las definiciones pero no las estás aplicando. Haz la Práctica de los módulos, no solo la teoría.',
      );
    }
    if (dApl - dRec >= 25) {
      mensajes.push(
        'Razonas bien pero se te escapan los datos exactos. Dedica las tarjetas y el modo Última noche a los valores numéricos.',
      );
    }
  }

  if (com.total >= 5 && porcentaje(com) < 50 && porcentaje(rec) >= 70) {
    mensajes.push(
      'Memorizas listas pero no distingues conceptos parecidos. Fíjate en las explicaciones de los distractores: ahí está la diferencia.',
    );
  }

  const flojos = Object.values(desglose.porBloque).filter((b) => b.total >= 5 && porcentaje(b) < 50);
  if (flojos.length >= 3) {
    mensajes.push(
      'El bajo desempeño es parejo en todos los bloques: no es un tema puntual, es cobertura. Sigue el plan por días en vez de saltar entre módulos.',
    );
  }

  return mensajes;
}

/** Delta en puntos porcentuales contra el intento anterior del mismo tipo. */
export function compararConAnterior(
  actual: DesgloseIntento,
  anterior: DesgloseIntento | null,
): Record<BloqueId, number | null> | null {
  if (!anterior) return null;
  const delta = {} as Record<BloqueId, number | null>;
  for (const b of BLOQUES) {
    const a = actual.porBloque[b];
    const p = anterior.porBloque[b];
    delta[b] = a.total === 0 || p.total === 0 ? null : porcentaje(a) - porcentaje(p);
  }
  return delta;
}

export function construirInforme(
  intento: IntentoSimulacro,
  modulos: readonly Modulo[],
  bloques: readonly Bloque[],
  intentoAnterior: IntentoSimulacro | null,
): Informe {
  const porSlug = new Map(modulos.map((m) => [m.slug, m]));

  return {
    intentoId: intento.id,
    tipo: intento.tipo,
    puntaje: intento.puntaje,
    veredicto: calcularVeredicto(intento.puntaje),
    segundosUsados: intento.segundosUsados,
    desglose: intento.desglose,
    dominioPorBloque: bloques
      .map((b) => ({
        bloque: b.id,
        titulo: b.titulo,
        porcentaje: porcentaje(intento.desglose.porBloque[b.id]),
        total: intento.desglose.porBloque[b.id].total,
      }))
      .filter((b) => b.total > 0),
    dominioPorModulo: Object.entries(intento.desglose.porModulo)
      .map(([slug, c]) => ({
        modulo: slug,
        titulo: porSlug.get(slug)?.titulo ?? slug,
        porcentaje: porcentaje(c),
        total: c.total,
      }))
      .sort((a, b) => a.porcentaje - b.porcentaje || a.modulo.localeCompare(b.modulo)),
    temasPrioritarios: temasPrioritarios(intento.desglose, modulos),
    patrones: detectarPatrones(intento.desglose),
    deltaPorBloque: compararConAnterior(intento.desglose, intentoAnterior?.desglose ?? null),
    sinResponder: intento.respuestas.filter((r) => sinResponder(r.respuesta)).length,
  };
}

/** Último intento del mismo tipo y ámbito, excluyendo el actual. */
export function intentoAnteriorComparable(
  intentos: readonly IntentoSimulacro[],
  actual: IntentoSimulacro,
): IntentoSimulacro | null {
  return (
    intentos.find(
      (i) => i.id !== actual.id && i.tipo === actual.tipo && i.ambito === actual.ambito,
    ) ?? null
  );
}
```

### 7.6 Plan de estudio — `src/lib/plan.ts`

```ts
// src/lib/plan.ts
// Reparte los módulos en los días disponibles hasta la fecha de examen.
// Función pura: recibe `hoy` como parámetro. SIN "use client".

import { diasEntre, sumarDias } from './fechas';
import type {
  Bloque,
  DesgloseIntento,
  DiaPlan,
  Modulo,
  Plan,
  TareaPlan,
} from './tipos';

/** Días finales reservados para simulacro + repaso. Brief §6.5. */
export const DIAS_RESERVADOS = 3;

export interface OpcionesPlan {
  /** 'YYYY-MM-DD'. */
  hoy: string;
  /** 'YYYY-MM-DD'. */
  fechaExamen: string;
  modulos: readonly Modulo[];
  bloques: readonly Bloque[];
  /** Desglose del diagnóstico inicial. null si aún no se hizo. */
  diagnostico: DesgloseIntento | null;
  /** Módulos ya dominados: se colocan al final como repaso ligero. */
  dominados: readonly string[];
}

/**
 * Prioridad = debilidad × peso del bloque.
 * - debilidad: 1 − (aciertos/total del diagnóstico). Sin dato ⇒ 0.6 (ni lo
 *   mejor ni lo peor: los módulos no medidos no se hunden ni se privilegian).
 * - peso: pesoExamen del bloque (A .20 · B .22 · C .33 · D .25).
 * Un módulo dominado baja a la mitad de su prioridad, no a cero: repasar
 * lo dominado sigue valiendo algo.
 */
function prioridad(
  modulo: Modulo,
  bloques: readonly Bloque[],
  diagnostico: DesgloseIntento | null,
  dominados: ReadonlySet<string>,
): number {
  const peso = bloques.find((b) => b.id === modulo.bloque)?.pesoExamen ?? 0.25;
  const conteo = diagnostico?.porModulo[modulo.slug];
  const debilidad =
    conteo && conteo.total > 0 ? 1 - conteo.correctas / conteo.total : 0.6;
  const factor = dominados.has(modulo.slug) ? 0.5 : 1;
  return debilidad * peso * factor;
}

/** Orden respetando prerequisitos: un módulo nunca va antes que el suyo. */
function ordenarPorPrioridadYPrerequisitos(
  modulos: readonly Modulo[],
  puntajes: Map<string, number>,
): Modulo[] {
  const pendientes = new Map(modulos.map((m) => [m.slug, m]));
  const colocados = new Set<string>();
  const resultado: Modulo[] = [];

  while (pendientes.size > 0) {
    const listos = [...pendientes.values()].filter((m) =>
      m.prerequisitos.every((p) => colocados.has(p) || !pendientes.has(p)),
    );
    // Si hay un ciclo de prerequisitos (error de contenido), se desbloquea
    // tomando el de mayor prioridad en vez de colgarse.
    const candidatos = listos.length > 0 ? listos : [...pendientes.values()];
    candidatos.sort(
      (a, b) =>
        (puntajes.get(b.slug) ?? 0) - (puntajes.get(a.slug) ?? 0) ||
        a.bloque.localeCompare(b.bloque) ||
        a.orden - b.orden,
    );
    const elegido = candidatos[0];
    resultado.push(elegido);
    colocados.add(elegido.slug);
    pendientes.delete(elegido.slug);
  }

  return resultado;
}

export function generarPlan(opciones: OpcionesPlan): Plan {
  const { hoy, fechaExamen, modulos, bloques, diagnostico } = opciones;
  const dominados = new Set(opciones.dominados);
  const advertencias: string[] = [];

  const diasDisponibles = Math.max(0, diasEntre(hoy, fechaExamen));

  if (diasDisponibles === 0) {
    return {
      generadoEn: hoy,
      fechaExamen,
      diasDisponibles: 0,
      dias: [
        {
          fecha: hoy,
          indice: 1,
          tareas: [
            {
              clase: 'repaso',
              descripcion: 'Modo Última noche: solo los datos duros. Nada de teoría nueva.',
              minutos: 60,
            },
          ],
          minutosTotales: 60,
        },
      ],
      advertencias: ['El examen es hoy o ya pasó. Solo alcanza a repasar los datos duros.'],
    };
  }

  const puntajes = new Map(
    modulos.map((m) => [m.slug, prioridad(m, bloques, diagnostico, dominados)]),
  );
  const orden = ordenarPorPrioridadYPrerequisitos(modulos, puntajes);

  const diasEstudio = Math.max(1, diasDisponibles - DIAS_RESERVADOS);
  const minutosTotales = orden.reduce((s, m) => s + m.minutosEstimados, 0);
  const objetivoDiario = Math.ceil(minutosTotales / diasEstudio);

  if (objetivoDiario > 150) {
    advertencias.push(
      `Quedan ${diasDisponibles} días para ${orden.length} módulos: son ~${objetivoDiario} min diarios. ` +
        'Considera mover la fecha del examen o aceptar que llegarás con los bloques de menor peso sin cubrir.',
    );
  }
  if (diasDisponibles <= DIAS_RESERVADOS) {
    advertencias.push(
      'No alcanzan los días para reservar los 3 finales de repaso. El plan concentra el estudio y deja solo el último día para el simulacro.',
    );
  }

  const dias: DiaPlan[] = [];
  let indice = 1;
  let acumulado = 0;
  let tareasDia: TareaPlan[] = [];

  const cerrarDia = () => {
    dias.push({
      fecha: sumarDias(hoy, indice - 1),
      indice,
      tareas: tareasDia,
      minutosTotales: acumulado,
    });
    indice += 1;
    acumulado = 0;
    tareasDia = [];
  };

  for (const modulo of orden) {
    // Se cierra el día cuando ya se pasó del objetivo y quedan días por usar.
    if (acumulado >= objetivoDiario && indice < diasEstudio) cerrarDia();
    tareasDia.push({
      clase: 'modulo',
      slug: modulo.slug,
      titulo: modulo.titulo,
      minutos: modulo.minutosEstimados,
    });
    acumulado += modulo.minutosEstimados;
  }
  if (tareasDia.length > 0) cerrarDia();

  // Los días de estudio que sobraron se llenan con repaso espaciado.
  while (indice <= diasEstudio) {
    tareasDia = [
      {
        clase: 'repaso',
        descripcion: 'Cola de repaso espaciado del día + tarjetas de los módulos flojos.',
        minutos: 30,
      },
    ];
    acumulado = 30;
    cerrarDia();
  }

  // Los 3 días reservados, en orden fijo.
  const reservados: TareaPlan[][] = [
    [
      { clase: 'simulacro', ambito: 'global', descripcion: 'Simulacro final: 100 ítems, 120 min, sin pausas.', minutos: 120 },
    ],
    [
      { clase: 'repaso', descripcion: 'Revisión ítem por ítem de los errores del simulacro final.', minutos: 60 },
      { clase: 'repaso', descripcion: 'Los 5 temas prioritarios del informe.', minutos: 60 },
    ],
    [
      { clase: 'repaso', descripcion: 'Tarjetas de toda la cola + modo Última noche.', minutos: 60 },
    ],
  ];

  for (const tareas of reservados) {
    if (indice > diasDisponibles) break;
    dias.push({
      fecha: sumarDias(hoy, indice - 1),
      indice,
      tareas,
      minutosTotales: tareas.reduce((s, t) => s + t.minutos, 0),
    });
    indice += 1;
  }

  return { generadoEn: hoy, fechaExamen, diasDisponibles, dias, advertencias };
}

/** Tareas de hoy. Alimenta la tarjeta "Continuar donde ibas" de la portada. */
export function tareasDeHoy(plan: Plan, hoy: string): TareaPlan[] {
  return plan.dias.find((d) => d.fecha === hoy)?.tareas ?? [];
}
```

---

## 8. Validador de banco — `scripts/validar-banco.ts`

Corre en `prebuild`. **Si falla, el build falla.** Es el único mecanismo que mantiene el estándar en 750 ítems escritos en semanas distintas.

```ts
// scripts/validar-banco.ts
// Se ejecuta con `tsx scripts/validar-banco.ts` desde el hook prebuild.
// Salida: código 0 (pasa) o 1 (falla el build).

import { BLOQUES, MODULOS } from '../content/estructura';
import { BLUEPRINTS } from '../content/blueprint-examen';
import { DATOS_DUROS } from '../content/datos-duros';
import { GLOSARIO } from '../content/glosario';
import { BANCO } from '../content/banco/indice';
import { TARJETAS } from '../content/tarjetas/indice';
import {
  esqDatoDuro,
  esqEntradaGlosario,
  esqItem,
  esqModulo,
  esqTarjeta,
  verificarCuotas,
} from '../src/lib/esquemas';
import type { Item, Tarjeta } from '../src/lib/tipos';

const MIN_TARJETAS_POR_MODULO = 12;

const errores: string[] = [];
const avisos: string[] = [];

const err = (ambito: string, mensaje: string) => errores.push(`${ambito} — ${mensaje}`);
const avi = (ambito: string, mensaje: string) => avisos.push(`${ambito} — ${mensaje}`);

async function main(): Promise<void> {
  /* ── 1. Estructura ─────────────────────────────────────────────── */

  const slugs = new Set<string>();
  for (const modulo of MODULOS) {
    const r = esqModulo.safeParse(modulo);
    if (!r.success) {
      for (const i of r.error.issues) err(`estructura/${modulo.slug}`, `${i.path.join('.')}: ${i.message}`);
      continue;
    }
    if (slugs.has(modulo.slug)) err('estructura', `slug duplicado: ${modulo.slug}`);
    slugs.add(modulo.slug);
  }

  if (MODULOS.length !== 29) {
    err('estructura', `hay ${MODULOS.length} módulos declarados, deben ser 29`);
  }

  const sumaPesos = BLOQUES.reduce((s, b) => s + b.pesoExamen, 0);
  if (Math.abs(sumaPesos - 1) > 0.001) {
    err('estructura', `los pesos de los bloques suman ${sumaPesos}, deben sumar 1`);
  }

  for (const bloque of BLOQUES) {
    for (const slug of bloque.modulos) {
      if (!slugs.has(slug)) err(`bloque ${bloque.id}`, `referencia al módulo inexistente "${slug}"`);
    }
  }

  for (const modulo of MODULOS) {
    for (const pre of modulo.prerequisitos) {
      if (!slugs.has(pre)) err(`estructura/${modulo.slug}`, `prerequisito inexistente "${pre}"`);
    }
  }

  /* ── 2. Glosario y datos duros ─────────────────────────────────── */

  const terminosGlosario = new Set<string>();
  for (const g of GLOSARIO) {
    const r = esqEntradaGlosario.safeParse(g);
    if (!r.success) {
      for (const i of r.error.issues) err(`glosario/${g.termino}`, `${i.path.join('.')}: ${i.message}`);
      continue;
    }
    const clave = normalizar(g.termino);
    if (terminosGlosario.has(clave)) err('glosario', `término duplicado: ${g.termino}`);
    terminosGlosario.add(clave);
    if (!slugs.has(g.modulo)) err(`glosario/${g.termino}`, `módulo inexistente "${g.modulo}"`);
  }

  for (const d of DATOS_DUROS) {
    const r = esqDatoDuro.safeParse(d);
    if (!r.success) {
      for (const i of r.error.issues) err(`datos-duros/${d.id}`, `${i.path.join('.')}: ${i.message}`);
      continue;
    }
    if (!slugs.has(d.modulo)) err(`datos-duros/${d.id}`, `módulo inexistente "${d.modulo}"`);
  }

  /* ── 3. Banco de ítems ─────────────────────────────────────────── */

  const idsGlobales = new Set<string>();
  const conteoPorModulo = new Map<string, number>();

  for (const modulo of MODULOS) {
    const cargar = BANCO[modulo.slug];
    const completo = modulo.estadoContenido === 'completo';

    if (!cargar) {
      if (completo) err(`banco/${modulo.slug}`, 'módulo marcado "completo" pero no tiene banco');
      else avi(`banco/${modulo.slug}`, 'en preparación, sin banco todavía');
      continue;
    }

    let items: Item[];
    try {
      items = await cargar();
    } catch (e) {
      err(`banco/${modulo.slug}`, `no se pudo cargar: ${(e as Error).message}`);
      continue;
    }

    conteoPorModulo.set(modulo.slug, items.length);
    const validos: Item[] = [];

    for (const item of items) {
      const r = esqItem.safeParse(item);
      if (!r.success) {
        for (const i of r.error.issues) {
          err(`banco/${modulo.slug}/${item?.id ?? '??'}`, `${i.path.join('.')}: ${i.message}`);
        }
        continue;
      }

      if (idsGlobales.has(item.id)) err('banco', `id de ítem duplicado: ${item.id}`);
      idsGlobales.add(item.id);

      if (item.modulo !== modulo.slug) {
        err(`banco/${modulo.slug}/${item.id}`, `campo modulo dice "${item.modulo}"`);
      }
      if (item.bloque !== modulo.bloque) {
        err(`banco/${modulo.slug}/${item.id}`, `campo bloque dice "${item.bloque}", debe ser "${modulo.bloque}"`);
      }
      const prefijo = item.id.split('-')[0].toLowerCase();
      if (!modulo.slug.startsWith(`${prefijo}-`)) {
        err(`banco/${modulo.slug}/${item.id}`, `el prefijo del id no corresponde al módulo`);
      }
      const cartilla = Number(item.referencia.match(/^Cartilla (\d)/)?.[1]);
      const cartillaEsperada = BLOQUES.find((b) => b.id === item.bloque)?.numeroCartilla;
      if (cartilla && cartillaEsperada && cartilla !== cartillaEsperada) {
        avi(
          `banco/${modulo.slug}/${item.id}`,
          `referencia a la Cartilla ${cartilla} desde el bloque ${item.bloque} (esperada: ${cartillaEsperada}). Correcto si es intencional.`,
        );
      }

      validos.push(item);
    }

    if (completo) {
      for (const fallo of verificarCuotas(validos)) {
        err(`banco/${modulo.slug}`, `cuota incumplida: ${fallo}`);
      }
    }
  }

  /* ── 4. Tarjetas ───────────────────────────────────────────────── */

  const idsTarjeta = new Set<string>();
  for (const modulo of MODULOS) {
    const cargar = TARJETAS[modulo.slug];
    const completo = modulo.estadoContenido === 'completo';

    if (!cargar) {
      if (completo) err(`tarjetas/${modulo.slug}`, 'módulo "completo" sin tarjetas');
      continue;
    }

    let tarjetas: Tarjeta[];
    try {
      tarjetas = await cargar();
    } catch (e) {
      err(`tarjetas/${modulo.slug}`, `no se pudo cargar: ${(e as Error).message}`);
      continue;
    }

    for (const t of tarjetas) {
      const r = esqTarjeta.safeParse(t);
      if (!r.success) {
        for (const i of r.error.issues) err(`tarjetas/${modulo.slug}/${t?.id ?? '??'}`, `${i.path.join('.')}: ${i.message}`);
        continue;
      }
      if (idsTarjeta.has(t.id)) err('tarjetas', `id duplicado: ${t.id}`);
      idsTarjeta.add(t.id);
      if (t.modulo !== modulo.slug) err(`tarjetas/${modulo.slug}/${t.id}`, `campo modulo dice "${t.modulo}"`);
    }

    if (completo && tarjetas.length < MIN_TARJETAS_POR_MODULO) {
      err(`tarjetas/${modulo.slug}`, `${tarjetas.length} tarjetas, el mínimo es ${MIN_TARJETAS_POR_MODULO}`);
    }
  }

  /* ── 5. Conceptos clave ↔ glosario ─────────────────────────────── */

  for (const modulo of MODULOS) {
    if (modulo.estadoContenido !== 'completo') continue;
    for (const concepto of modulo.conceptosClave) {
      if (!terminosGlosario.has(normalizar(concepto))) {
        err(`glosario/${modulo.slug}`, `el concepto clave "${concepto}" no tiene entrada en el glosario`);
      }
    }
  }

  /* ── 6. Viabilidad de los blueprints ───────────────────────────── */

  for (const bp of Object.values(BLUEPRINTS)) {
    const cuotas = bp.reparto.cuotas as Record<string, number>;
    const suma = Object.values(cuotas).reduce((s, n) => s + n, 0);
    if (suma !== bp.totalItems) {
      err(`blueprint/${bp.id}`, `el reparto suma ${suma} y totalItems es ${bp.totalItems}`);
    }
    const sumaNivel = Object.values(bp.porNivel).reduce((s, n) => s + n, 0);
    if (sumaNivel !== bp.totalItems) {
      err(`blueprint/${bp.id}`, `las cuotas por nivel suman ${sumaNivel} y totalItems es ${bp.totalItems}`);
    }
    if (bp.porTipo) {
      const sumaTipo = Object.values(bp.porTipo).reduce((s, n) => s + (n ?? 0), 0);
      if (sumaTipo !== bp.totalItems) {
        err(`blueprint/${bp.id}`, `las cuotas por tipo suman ${sumaTipo} y totalItems es ${bp.totalItems}`);
      }
    }

    if (bp.reparto.tipo === 'modulo') {
      for (const [slug, cuota] of Object.entries(cuotas)) {
        if (!slugs.has(slug)) {
          err(`blueprint/${bp.id}`, `módulo inexistente "${slug}"`);
          continue;
        }
        const disponibles = conteoPorModulo.get(slug) ?? 0;
        if (disponibles < cuota) {
          avi(
            `blueprint/${bp.id}`,
            `${slug} necesita ${cuota} ítems y hay ${disponibles} (se rellenará desde otros módulos hasta que el contenido esté listo)`,
          );
        }
      }
    }
  }

  /* ── Informe ───────────────────────────────────────────────────── */

  const totalItems = [...conteoPorModulo.values()].reduce((s, n) => s + n, 0);
  const completos = MODULOS.filter((m) => m.estadoContenido === 'completo').length;

  console.log('');
  console.log('  Validación del banco — Idóneo 2210');
  console.log(`  Módulos: ${MODULOS.length} (${completos} completos, ${MODULOS.length - completos} en preparación)`);
  console.log(`  Ítems: ${totalItems} · Tarjetas: ${idsTarjeta.size} · Glosario: ${terminosGlosario.size}`);
  console.log('');

  if (avisos.length > 0) {
    console.log(`  ${avisos.length} aviso(s):`);
    for (const a of avisos) console.log(`    · ${a}`);
    console.log('');
  }

  if (errores.length > 0) {
    console.error(`  ${errores.length} ERROR(ES) — el build se detiene:`);
    for (const e of errores) console.error(`    ✗ ${e}`);
    console.error('');
    process.exit(1);
  }

  console.log('  Todo en orden.');
  console.log('');
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .trim();
}

main().catch((e) => {
  console.error('  El validador reventó:', e);
  process.exit(1);
});
```

**Qué distingue error de aviso:** un **error** es algo que un humano puede arreglar ya y que degradaría la app (ítem malformado, id duplicado, cuota incumplida en un módulo `completo`). Un **aviso** es un estado transitorio esperado durante los pasos 14–17 (módulo en preparación, blueprint que aún no tiene ítems suficientes). Los avisos no rompen el build; si lo hicieran, el plan de 18 pasos sería imposible.

---
## 9. Contenido estructural

Todo lo de esta sección son **datos**, no lógica. Vive en `content/` y se escribe una sola vez en el paso 6. Los pasos 15–17 solo añaden archivos a `content/banco/`, `content/tarjetas/` y `content/teoria/`.

### 9.1 `content/estructura.ts` — 4 bloques y 29 módulos

```ts
// content/estructura.ts
// Fuente de verdad de la ruta de estudio. 4 bloques · 29 módulos.
// Los módulos arrancan en 'en-preparacion'; se pasan a 'completo' SOLO cuando
// tienen teoría + ≥12 tarjetas + ≥25 ítems que pasan el validador. Ver §23.

import type { Bloque, Modulo } from '@/lib/tipos';

export const BLOQUES: Bloque[] = [
  {
    id: 'A',
    numeroCartilla: 1,
    titulo: 'Ciencias Básicas',
    descripcion: 'Biología celular, anatomía, nutrición, sistemas energéticos y estadística aplicada al deporte.',
    pesoExamen: 0.2,
    color: 'a',
    modulos: [
      'a1-celula',
      'a2-terminologia-anatomica',
      'a3-tejidos-organos-sistemas',
      'a4-nutrientes',
      'a5-sistemas-energeticos-biomarcadores',
      'a6-estadistica',
    ],
  },
  {
    id: 'B',
    numeroCartilla: 2,
    titulo: 'Pedagogía y Didáctica',
    descripcion: 'Cómo se enseña el deporte: principios, modelos, estilos y estructura de la sesión.',
    pesoExamen: 0.22,
    color: 'b',
    modulos: [
      'b1-fundamentos-pedagogia',
      'b2-principios',
      'b3-modelos-pedagogicos',
      'b4-componentes-didacticos',
      'b5-estilos-ensenanza',
      'b6-aprendizaje-sesion',
    ],
  },
  {
    id: 'C',
    numeroCartilla: 3,
    titulo: 'Ciencias Aplicadas',
    descripcion: 'Fisiología del ejercicio, sistemas corporales, biomecánica, nutrición deportiva, psicología y dopaje.',
    pesoExamen: 0.33,
    color: 'c',
    modulos: [
      'c1-vias-energeticas',
      'c2-cardiovascular',
      'c3-respiratorio-vo2',
      'c4-nervioso-digestivo-osteomuscular',
      'c5-umbrales-zonas',
      'c6-biomecanica',
      'c7-nutricion-deportiva',
      'c8-psicologia-deporte',
      'c9-dopaje',
    ],
  },
  {
    id: 'D',
    numeroCartilla: 4,
    titulo: 'Entrenamiento Deportivo',
    descripcion: 'Metodología, carga, capacidades físicas y planificación del entrenamiento.',
    pesoExamen: 0.25,
    color: 'd',
    modulos: [
      'd1-conceptualizacion',
      'd2-carga',
      'd3-fuerza',
      'd4-resistencia',
      'd5-velocidad',
      'd6-flexibilidad',
      'd7-modelos-planificacion',
      'd8-estructuras',
    ],
  },
];

export const MODULOS: Modulo[] = [
  /* ══════════ BLOQUE A — Ciencias Básicas ══════════ */
  {
    slug: 'a1-celula',
    bloque: 'A',
    orden: 1,
    titulo: 'Célula: estructura, tipos y división',
    subtitulo: 'Eucariota vs procariota, orgánulos y las etapas de la mitosis.',
    minutosEstimados: 25,
    objetivos: [
      'Distinguir célula procariota de eucariota y saber qué organismos son cada una',
      'Identificar qué orgánulos tiene la célula vegetal y no la animal, y viceversa',
      'Nombrar la función de cada orgánulo',
      'Ordenar las etapas de la mitosis y diferenciarla de la meiosis',
    ],
    conceptosClave: ['Célula procariota', 'Célula eucariota', 'Mitosis', 'Meiosis', 'Orgánulo'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'a2-terminologia-anatomica',
    bloque: 'A',
    orden: 2,
    titulo: 'Terminología anatómica y planos',
    subtitulo: 'El idioma con el que se describe el movimiento.',
    minutosEstimados: 25,
    objetivos: [
      'Describir los 3 planos anatómicos y qué divide cada uno',
      'Aplicar los 8 términos de posición sobre un caso concreto',
      'Diferenciar flexión, extensión, rotación, abducción y aducción',
    ],
    conceptosClave: ['Posición anatómica', 'Plano sagital', 'Plano frontal', 'Plano transversal', 'Abducción'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'a3-tejidos-organos-sistemas',
    bloque: 'A',
    orden: 3,
    titulo: 'Tejidos, órganos y sistemas',
    subtitulo: 'De los 4 tejidos a los 11 sistemas del cuerpo.',
    minutosEstimados: 40,
    objetivos: [
      'Nombrar los 4 tejidos y su función',
      'Diferenciar osteoblasto, osteocito y osteoclasto',
      'Describir las estructuras de una articulación y su función',
      'Relacionar cada uno de los 11 sistemas con sus órganos',
    ],
    conceptosClave: ['Tejido óseo', 'Osteoblasto', 'Hueso esponjoso', 'Articulación sinovial', 'Hematopoyesis'],
    prerequisitos: ['a1-celula'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'a4-nutrientes',
    bloque: 'A',
    orden: 4,
    titulo: 'Macronutrientes y micronutrientes',
    subtitulo: 'Qué hace cada nutriente y de dónde sale.',
    minutosEstimados: 35,
    objetivos: [
      'Clasificar los carbohidratos en mono, di y polisacáridos con ejemplos',
      'Diferenciar proteína de alto y bajo valor biológico',
      'Distinguir grasas saturadas, monoinsaturadas, poliinsaturadas y trans por su efecto',
      'Relacionar vitaminas y minerales con su función',
    ],
    conceptosClave: ['Monosacárido', 'Valor biológico', 'Grasa trans', 'Micronutriente'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'a5-sistemas-energeticos-biomarcadores',
    bloque: 'A',
    orden: 5,
    titulo: 'Sistemas aeróbico y anaeróbico · Biomarcadores',
    subtitulo: 'De dónde sale la energía y cómo se mide el estado del deportista.',
    minutosEstimados: 35,
    objetivos: [
      'Diferenciar el sistema anaeróbico aláctico del láctico por duración, sustrato y subproducto',
      'Comparar el metabolismo aeróbico con el anaeróbico',
      'Clasificar los biomarcadores en rendimiento, salud, estrés oxidativo y hormonales',
      'Reconocer los valores normales de los biomarcadores más preguntados',
    ],
    conceptosClave: ['Sistema aláctico', 'Sistema láctico', 'Biomarcador', 'Relación testosterona/cortisol'],
    prerequisitos: ['a1-celula'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'a6-estadistica',
    bloque: 'A',
    orden: 6,
    titulo: 'Estadística descriptiva y calidad de pruebas',
    subtitulo: 'Media, mediana, desviación y las tres propiedades de un test.',
    minutosEstimados: 45,
    objetivos: [
      'Calcular media, mediana, moda, rango, varianza y desviación estándar',
      'Explicar la ventaja y la desventaja de cada medida de tendencia central',
      'Diferenciar validez, fiabilidad y objetividad con ejemplos de campo',
      'Resolver problemas de regla de tres y porcentaje de aumento',
    ],
    conceptosClave: ['Media aritmética', 'Mediana', 'Desviación estándar', 'Validez', 'Fiabilidad', 'Objetividad'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },

  /* ══════════ BLOQUE B — Pedagogía y Didáctica ══════════ */
  {
    slug: 'b1-fundamentos-pedagogia',
    bloque: 'B',
    orden: 1,
    titulo: 'Fundamentos de la pedagogía del deporte',
    subtitulo: 'El vocabulario base: deporte, entrenamiento, entrenabilidad, competición.',
    minutosEstimados: 35,
    objetivos: [
      'Definir deporte, pedagogía, entrenamiento, entrenabilidad y competición',
      'Identificar las manifestaciones del deporte (vital, físico, táctico, técnico)',
      'Diferenciar las 3 clases de entrenador y su efecto en el deportista',
      'Nombrar los fundamentos específicos: carga, fatiga, recuperación, adaptación, forma deportiva',
    ],
    conceptosClave: ['Entrenabilidad', 'Forma deportiva', 'Capacidad motriz', 'Adaptación'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'b2-principios',
    bloque: 'B',
    orden: 2,
    titulo: 'Principios pedagógicos, infanto-juveniles y biológicos',
    subtitulo: 'Los 12 principios biológicos son el corazón del bloque B.',
    minutosEstimados: 40,
    objetivos: [
      'Nombrar los 4 principios pedagógicos y aplicarlos a una sesión',
      'Enumerar los 8 principios para niños y jóvenes',
      'Diferenciar especificidad, especialización, sobrecarga y progresión',
      'Distinguir supercompensación, variabilidad, multilateralidad y retornos en disminución',
    ],
    conceptosClave: ['Multilateralidad', 'Especificidad', 'Sobrecarga', 'Supercompensación', 'Retornos en disminución'],
    prerequisitos: ['b1-fundamentos-pedagogia'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'b3-modelos-pedagogicos',
    bloque: 'B',
    orden: 3,
    titulo: 'Modelos pedagógicos del deporte',
    subtitulo: 'Del modelo tradicional al comprensivo, y quién propuso cada uno.',
    minutosEstimados: 35,
    objetivos: [
      'Diferenciar modelos básicos de modelos emergentes',
      'Describir los 6 modelos como estrategia de intervención',
      'Relacionar cada modelo por autor con su propuesta',
    ],
    conceptosClave: ['Modelo comprensivo', 'Modelo constructivista', 'Modelo integrado técnico-táctico'],
    prerequisitos: ['b1-fundamentos-pedagogia'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'b4-componentes-didacticos',
    bloque: 'B',
    orden: 4,
    titulo: 'Componentes didácticos y principios de enseñanza',
    subtitulo: 'Las 5 fases del entrenamiento y los elementos de la acción motora.',
    minutosEstimados: 35,
    objetivos: [
      'Diferenciar didáctica, metodología, método y objetivo',
      'Ordenar las 5 fases del entrenamiento',
      'Definir volumen, intensidad, frecuencia, duración y densidad como elementos de la acción motora',
      'Enumerar los 9 principios de enseñanza',
    ],
    conceptosClave: ['Didáctica', 'Método', 'Tarea deportiva', 'Programación'],
    prerequisitos: ['b1-fundamentos-pedagogia'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'b5-estilos-ensenanza',
    bloque: 'B',
    orden: 5,
    titulo: 'Estilos de enseñanza',
    subtitulo: 'Las 4 categorías y qué estilo pertenece a cada una.',
    minutosEstimados: 35,
    objetivos: [
      'Clasificar cada estilo en tradicional, participación, implicación cognitiva u organización',
      'Diferenciar asignación de tareas de los estilos de participación',
      'Elegir el estilo adecuado según el nivel y el objetivo de la sesión',
    ],
    conceptosClave: ['Mando directo', 'Microenseñanza', 'Descubrimiento guiado', 'Enseñanza modular'],
    prerequisitos: ['b4-componentes-didacticos'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'b6-aprendizaje-sesion',
    bloque: 'B',
    orden: 6,
    titulo: 'Fases del aprendizaje y sesión de entrenamiento',
    subtitulo: 'De la coordinación gruesa a la fina, y cómo cambia la sesión por nivel.',
    minutosEstimados: 35,
    objetivos: [
      'Ordenar las 4 fases del aprendizaje de la técnica',
      'Diferenciar las 3 fases del aprendizaje autorregulado',
      'Explicar qué son las fases sensibles y por qué importan',
      'Describir la estructura de la sesión en formación, perfeccionamiento y altos logros',
    ],
    conceptosClave: ['Coordinación gruesa', 'Coordinación fina', 'Fase sensible', 'Fase asociativa'],
    prerequisitos: ['b4-componentes-didacticos'],
    estadoContenido: 'en-preparacion',
  },

  /* ══════════ BLOQUE C — Ciencias Aplicadas ══════════ */
  {
    slug: 'c1-vias-energeticas',
    bloque: 'C',
    orden: 1,
    titulo: 'Vías energéticas y fisiología del ejercicio',
    subtitulo: 'Fosfocreatina, glucólisis y el ATP por molécula de glucosa.',
    minutosEstimados: 45,
    objetivos: [
      'Escribir la reacción de la fosfocreatina y nombrar su enzima',
      'Diferenciar glucólisis anaeróbica de aeróbica por producto y duración',
      'Ubicar dónde ocurre cada etapa de la glucólisis aeróbica',
      'Relacionar %1RM con vía energética, repeticiones y descanso',
    ],
    conceptosClave: ['Fosfocreatina', 'Creatina quinasa', 'Glucólisis', 'Ciclo de Krebs'],
    prerequisitos: ['a5-sistemas-energeticos-biomarcadores'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c2-cardiovascular',
    bloque: 'C',
    orden: 2,
    titulo: 'Sistema cardiovascular',
    subtitulo: 'Las 5 fórmulas de FCmáx con su autor y su población.',
    minutosEstimados: 40,
    objetivos: [
      'Convertir una toma de pulso a latidos por minuto',
      'Aplicar las 5 fórmulas de FCmáx e identificar la población de cada una',
      'Calcular frecuencia cardíaca de reserva y gasto cardíaco',
      'Diferenciar la adaptación por dilatación de la adaptación por hipertrofia',
    ],
    conceptosClave: ['Frecuencia cardíaca máxima', 'Frecuencia cardíaca de reserva', 'Gasto cardíaco', 'Volumen sistólico'],
    prerequisitos: ['a3-tejidos-organos-sistemas'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c3-respiratorio-vo2',
    bloque: 'C',
    orden: 3,
    titulo: 'Sistema respiratorio y VO₂máx',
    subtitulo: '1 MET = 3,5 ml/kg/min. Ese número cae.',
    minutosEstimados: 40,
    objetivos: [
      'Describir los 3 procesos ventilatorios',
      'Calcular VO₂ a partir del gasto cardíaco y la diferencia arteriovenosa',
      'Convertir entre MET y ml/kg/min',
      'Ubicar un valor de VO₂máx en los baremos por sexo y edad',
    ],
    conceptosClave: ['VO₂máx', 'MET', 'Diferencia arteriovenosa', 'Ventilación'],
    prerequisitos: ['c2-cardiovascular'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c4-nervioso-digestivo-osteomuscular',
    bloque: 'C',
    orden: 4,
    titulo: 'Sistemas nervioso, digestivo y osteomuscular',
    subtitulo: 'Propiocepción, tipos de contracción y los 7 pasos de la contracción muscular.',
    minutosEstimados: 45,
    objetivos: [
      'Relacionar husos musculares, órganos tendinosos de Golgi y corpúsculos de Pacini con lo que detecta cada uno',
      'Diferenciar contracción isotónica concéntrica, excéntrica e isométrica',
      'Ordenar los 7 pasos de la contracción muscular',
      'Comparar fibras tipo I y tipo II',
    ],
    conceptosClave: ['Propiocepción', 'Huso muscular', 'Contracción excéntrica', 'Fibra tipo II'],
    prerequisitos: ['a3-tejidos-organos-sistemas'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c5-umbrales-zonas',
    bloque: 'C',
    orden: 5,
    titulo: 'Umbrales y zonas de entrenamiento',
    subtitulo: 'R0 a R3+, VT1 y VT2, MLSS y los 4 modelos de distribución de la carga.',
    minutosEstimados: 45,
    objetivos: [
      'Ubicar las zonas R0, R1, R2 y R3 por su porcentaje de FCmáx y de VO₂máx',
      'Explicar el objetivo fisiológico y las adaptaciones de cada zona',
      'Definir MLSS y situarlo respecto a VT1 y VT2',
      'Diferenciar los 4 modelos de distribución de la intensidad',
      'Prescribir la zona correcta a partir de un objetivo de entrenamiento',
    ],
    conceptosClave: [
      'Umbral aeróbico (VT1)',
      'Umbral anaeróbico (VT2)',
      'MLSS',
      'IMTG',
      'VAM',
      'Potencia aeróbica',
      'Entrenamiento polarizado',
      'HIIT',
      'SIT',
    ],
    prerequisitos: ['c1-vias-energeticas', 'c2-cardiovascular', 'c3-respiratorio-vo2'],
    estadoContenido: 'completo',
  },
  {
    slug: 'c6-biomecanica',
    bloque: 'C',
    orden: 6,
    titulo: 'Biomecánica',
    subtitulo: 'Palancas, centro de gravedad y eficiencia en la carrera.',
    minutosEstimados: 40,
    objetivos: [
      'Diferenciar cinética de cinemática',
      'Clasificar palancas y aplicarlas al cuerpo humano',
      'Relacionar centro de gravedad y base de sustentación con el equilibrio',
      'Explicar los factores de eficiencia en la carrera',
    ],
    conceptosClave: ['Cinética', 'Cinemática', 'Centro de gravedad', 'Cadena cinemática'],
    prerequisitos: ['a2-terminologia-anatomica'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c7-nutricion-deportiva',
    bloque: 'C',
    orden: 7,
    titulo: 'Nutrición deportiva',
    subtitulo: 'Qué comer, cuánto y sobre todo cuándo.',
    minutosEstimados: 35,
    objetivos: [
      'Determinar el momento de consumo de CHO, grasas y proteínas antes, durante y después',
      'Aplicar la proporción CHO:proteína de recuperación',
      'Decidir la estrategia de hidratación según la duración del esfuerzo',
      'Calcular índices antropométricos básicos',
    ],
    conceptosClave: ['Índice glucémico', 'Ventana de recuperación', 'Bebida isotónica', 'Gasto energético total'],
    prerequisitos: ['a4-nutrientes'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c8-psicologia-deporte',
    bloque: 'C',
    orden: 8,
    titulo: 'Psicología del deporte',
    subtitulo: 'Teorías del aprendizaje y qué aplicar en cada fase de la sesión.',
    minutosEstimados: 35,
    objetivos: [
      'Relacionar cada etapa del ciclo vital con lo que predomina en ella',
      'Asociar cada teoría del aprendizaje con su autor',
      'Elegir la técnica psicológica adecuada según la fase de la sesión',
    ],
    conceptosClave: ['Condicionamiento operante', 'Aprendizaje vicario', 'Refuerzo positivo', 'Activación mental'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'c9-dopaje',
    bloque: 'C',
    orden: 9,
    titulo: 'Prevención y control del dopaje',
    subtitulo: 'Las 11 infracciones del Artículo 2 del Código Mundial Antidopaje.',
    minutosEstimados: 35,
    objetivos: [
      'Describir las 3 estrategias del programa antidopaje',
      'Identificar las 11 infracciones del Artículo 2',
      'Explicar el principio de responsabilidad estricta',
      'Resumir el Artículo 3: carga de la prueba, muestra B y TAD',
    ],
    conceptosClave: ['Responsabilidad estricta', 'AMA/WADA', 'Localización fallida', 'Asociación prohibida'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },

  /* ══════════ BLOQUE D — Entrenamiento Deportivo ══════════ */
  {
    slug: 'd1-conceptualizacion',
    bloque: 'D',
    orden: 1,
    titulo: 'Conceptualización y metodología del entrenamiento',
    subtitulo: 'Los 5 componentes y los 3 niveles de la Ley 2210.',
    minutosEstimados: 25,
    objetivos: [
      'Definir entrenamiento deportivo y metodología del entrenamiento',
      'Nombrar los 5 componentes del entrenamiento',
      'Ordenar las fases del proceso: planificación, programación, ejecución, control y evaluación',
      'Relacionar los 3 niveles de la Ley 2210 con principiante, intermedio y avanzado',
    ],
    conceptosClave: ['Metodología del entrenamiento', 'Nivel de formación', 'Altos logros', 'Ley 2210 de 2022'],
    prerequisitos: [],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd2-carga',
    bloque: 'D',
    orden: 2,
    titulo: 'La carga y sus componentes',
    subtitulo: 'Volumen, intensidad, densidad y la relación inversa que lo explica todo.',
    minutosEstimados: 45,
    objetivos: [
      'Definir carga y sus cinco componentes',
      'Explicar la relación inversa entre volumen e intensidad',
      'Calcular la densidad de una sesión',
      'Diferenciar carga interna de carga externa y aplicar la escala de Borg',
    ],
    conceptosClave: ['Densidad', 'Carga interna', 'Carga externa', 'Escala de Borg (RPE)'],
    prerequisitos: ['d1-conceptualizacion'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd3-fuerza',
    bloque: 'D',
    orden: 3,
    titulo: 'Capacidad física: fuerza',
    subtitulo: 'Clasificación, métodos y tests de fuerza.',
    minutosEstimados: 35,
    objetivos: [
      'Definir fuerza y clasificar sus manifestaciones',
      'Elegir el método de entrenamiento según el objetivo',
      'Aplicar los tests de fuerza más usados',
    ],
    conceptosClave: ['Fuerza máxima', 'Fuerza explosiva', 'Test de 1RM'],
    prerequisitos: ['d2-carga'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd4-resistencia',
    bloque: 'D',
    orden: 4,
    titulo: 'Capacidad física: resistencia',
    subtitulo: 'Métodos continuos, fraccionados, de repeticiones y de competición.',
    minutosEstimados: 35,
    objetivos: [
      'Clasificar la resistencia por duración, metabolismo y masa muscular implicada',
      'Diferenciar los métodos continuos de los fraccionados',
      'Aplicar los tests de Cooper y Course Navette',
    ],
    conceptosClave: ['Resistencia aeróbica', 'Método interválico', 'Test de Cooper', 'Course Navette'],
    prerequisitos: ['d2-carga', 'c5-umbrales-zonas'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd5-velocidad',
    bloque: 'D',
    orden: 5,
    titulo: 'Capacidad física: velocidad',
    subtitulo: 'Reacción, desplazamiento, gestual y resistencia a la velocidad.',
    minutosEstimados: 30,
    objetivos: [
      'Definir velocidad como frecuencia y amplitud por unidad de tiempo',
      'Clasificar los tipos de velocidad',
      'Seleccionar métodos y tests de velocidad',
    ],
    conceptosClave: ['Velocidad de reacción', 'Velocidad gestual', 'Resistencia a la velocidad'],
    prerequisitos: ['d2-carga'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd6-flexibilidad',
    bloque: 'D',
    orden: 6,
    titulo: 'Capacidad física: flexibilidad',
    subtitulo: 'Movilidad, elasticidad y flexibilidad no son lo mismo.',
    minutosEstimados: 30,
    objetivos: [
      'Diferenciar movilidad, elasticidad y flexibilidad',
      'Comparar procedimientos estáticos y dinámicos',
      'Describir la facilitación neuromuscular propioceptiva',
      'Aplicar los tests de sit and reach y goniometría',
    ],
    conceptosClave: ['Movilidad articular', 'Elasticidad muscular', 'FNP', 'Sit and reach'],
    prerequisitos: ['d2-carga'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd7-modelos-planificacion',
    bloque: 'D',
    orden: 7,
    titulo: 'Modelos de planificación',
    subtitulo: 'Tradicional, contemporáneo y cíclico: cuándo usar cada uno.',
    minutosEstimados: 35,
    objetivos: [
      'Describir las 4 características del modelo tradicional',
      'Diferenciar el modelo contemporáneo por flexibilidad, multifuncionalidad e individualización',
      'Elegir el modelo adecuado según el nivel del deportista y el calendario',
    ],
    conceptosClave: ['Modelo tradicional', 'Modelo contemporáneo', 'Pico de rendimiento'],
    prerequisitos: ['d1-conceptualizacion'],
    estadoContenido: 'en-preparacion',
  },
  {
    slug: 'd8-estructuras',
    bloque: 'D',
    orden: 8,
    titulo: 'Estructuras de la planificación',
    subtitulo: 'Macro, meso, micro y sesión: qué se define en cada nivel.',
    minutosEstimados: 35,
    objetivos: [
      'Diferenciar macroestructura, mesoestructura, microestructura y estructura de sesión',
      'Indicar la duración típica de cada nivel',
      'Describir las partes de una sesión de entrenamiento',
    ],
    conceptosClave: ['Macrociclo', 'Mesociclo', 'Microciclo', 'Vuelta a la calma'],
    prerequisitos: ['d7-modelos-planificacion'],
    estadoContenido: 'en-preparacion',
  },
];

/* ─── Helpers de consulta ─────────────────────────────────────────── */

export const MODULOS_POR_SLUG = new Map(MODULOS.map((m) => [m.slug, m]));
export const BLOQUES_POR_ID = new Map(BLOQUES.map((b) => [b.id, b]));

export function modulosDelBloque(bloqueId: string) {
  return MODULOS.filter((m) => m.bloque === bloqueId).sort((a, b) => a.orden - b.orden);
}

export function moduloSiguiente(slug: string) {
  const i = MODULOS.findIndex((m) => m.slug === slug);
  return i >= 0 && i < MODULOS.length - 1 ? MODULOS[i + 1] : null;
}
```

### 9.2 `content/blueprint-examen.ts`

Un solo archivo parametriza los cuatro exámenes. Si aparece información oficial del formato real, **se cambia este archivo y nada más** — el motor no se toca. Es la mitigación del riesgo "no se conoce el formato exacto del examen".

```ts
// content/blueprint-examen.ts

import type { BloqueId, BlueprintExamen } from '@/lib/tipos';
import { BLOQUES, modulosDelBloque } from './estructura';

/** Reparto proporcional con método de mayores restos: la suma da exacto. */
function repartirProporcional(claves: string[], total: number): Record<string, number> {
  const base = Math.floor(total / claves.length);
  const resto = total - base * claves.length;
  const salida: Record<string, number> = {};
  claves.forEach((c, i) => {
    salida[c] = base + (i < resto ? 1 : 0);
  });
  return salida;
}

/* ─── Diagnóstico: 30 ítems · 35 min ──────────────────────────────── */

export const DIAGNOSTICO: BlueprintExamen = {
  id: 'diagnostico',
  titulo: 'Diagnóstico inicial',
  descripcion:
    '30 ítems en 35 minutos. Sin retroalimentación durante la prueba. Al terminar recibes un mapa de calor por bloque y tu plan de estudio.',
  totalItems: 30,
  minutos: 35,
  reparto: { tipo: 'bloque', cuotas: { A: 6, B: 7, C: 10, D: 7 } },
  porNivel: { recuerdo: 14, comprension: 10, aplicacion: 6 },
  tiposPermitidos: ['unica', 'emparejar', 'caso'],
  dificultadesPermitidas: [1, 2],
  feedbackInmediato: false,
};

/* ─── Simulacro final: 100 ítems · 120 min ────────────────────────── */

export const FINAL: BlueprintExamen = {
  id: 'final',
  titulo: 'Simulacro final',
  descripcion:
    '100 ítems en 120 minutos, con la misma distribución del examen real. Se envía solo al llegar a cero.',
  totalItems: 100,
  minutos: 120,
  reparto: {
    tipo: 'modulo',
    cuotas: {
      // Bloque A — 20
      'a1-celula': 3,
      'a2-terminologia-anatomica': 3,
      'a3-tejidos-organos-sistemas': 5,
      'a4-nutrientes': 4,
      'a5-sistemas-energeticos-biomarcadores': 3,
      'a6-estadistica': 2,
      // Bloque B — 22
      'b1-fundamentos-pedagogia': 4,
      'b2-principios': 5,
      'b3-modelos-pedagogicos': 3,
      'b4-componentes-didacticos': 4,
      'b5-estilos-ensenanza': 3,
      'b6-aprendizaje-sesion': 3,
      // Bloque C — 33
      'c1-vias-energeticas': 5,
      'c2-cardiovascular': 4,
      'c3-respiratorio-vo2': 4,
      'c4-nervioso-digestivo-osteomuscular': 4,
      'c5-umbrales-zonas': 4,
      'c6-biomecanica': 3,
      'c7-nutricion-deportiva': 3,
      'c8-psicologia-deporte': 3,
      'c9-dopaje': 3,
      // Bloque D — 25
      'd1-conceptualizacion': 2,
      'd2-carga': 5,
      'd3-fuerza': 4,
      'd4-resistencia': 4,
      'd5-velocidad': 3,
      'd6-flexibilidad': 3,
      'd7-modelos-planificacion': 2,
      'd8-estructuras': 2,
    },
  },
  porNivel: { recuerdo: 40, comprension: 35, aplicacion: 25 },
  porTipo: { unica: 65, caso: 10, calculo: 8, multiple: 7, emparejar: 5, ordenar: 3, vf: 2 },
  feedbackInmediato: false,
};

/* ─── Simulacro de bloque: 40 ítems · 50 min ──────────────────────── */

export function blueprintBloque(bloqueId: BloqueId): BlueprintExamen {
  const bloque = BLOQUES.find((b) => b.id === bloqueId);
  const slugs = modulosDelBloque(bloqueId).map((m) => m.slug);
  return {
    id: `bloque-${bloqueId}`,
    titulo: `Simulacro del bloque ${bloqueId} — ${bloque?.titulo ?? ''}`,
    descripcion: '40 ítems en 50 minutos, repartidos entre los módulos del bloque.',
    totalItems: 40,
    minutos: 50,
    reparto: { tipo: 'modulo', cuotas: repartirProporcional(slugs, 40) },
    porNivel: { recuerdo: 16, comprension: 14, aplicacion: 10 },
    feedbackInmediato: false,
  };
}

/* ─── Quiz de módulo: 10 ítems · sin cronómetro ───────────────────── */

export function blueprintQuiz(slug: string): BlueprintExamen {
  return {
    id: `quiz-${slug}`,
    titulo: 'Quiz del módulo',
    descripcion: '10 ítems sin cronómetro. La retroalimentación llega al final, no ítem por ítem.',
    totalItems: 10,
    minutos: null,
    reparto: { tipo: 'modulo', cuotas: { [slug]: 10 } },
    porNivel: { recuerdo: 4, comprension: 3, aplicacion: 3 },
    feedbackInmediato: false,
  };
}

/* ─── Práctica de módulo: 8 ítems · feedback inmediato ────────────── */

export function blueprintPractica(slug: string): BlueprintExamen {
  return {
    id: `practica-${slug}`,
    titulo: 'Práctica del módulo',
    descripcion: 'Ítems con explicación inmediata. Aquí se aprende, no se mide.',
    totalItems: 8,
    minutos: null,
    reparto: { tipo: 'modulo', cuotas: { [slug]: 8 } },
    porNivel: { recuerdo: 3, comprension: 3, aplicacion: 2 },
    feedbackInmediato: true,
  };
}

/** Los blueprints estáticos que el validador comprueba en cada build. */
export const BLUEPRINTS: Record<string, BlueprintExamen> = {
  diagnostico: DIAGNOSTICO,
  final: FINAL,
  'bloque-A': blueprintBloque('A'),
  'bloque-B': blueprintBloque('B'),
  'bloque-C': blueprintBloque('C'),
  'bloque-D': blueprintBloque('D'),
};
```

### 9.4 `content/datos-duros.ts` — alimenta el modo Última noche

```ts
// content/datos-duros.ts
// Los valores que se preguntan con número exacto. Cada uno DEBE existir
// también como tarjeta y como al menos un ítem del banco.

import type { DatoDuro } from '@/lib/tipos';

export const DATOS_DUROS: DatoDuro[] = [
  /* ── Vías energéticas ── */
  { id: 'DD-001', categoria: 'Vías energéticas', concepto: 'ATP almacenado en el músculo', valor: '2–3 s', modulo: 'c1-vias-energeticas' },
  { id: 'DD-002', categoria: 'Vías energéticas', concepto: 'Sistema fosfágeno (PCr)', valor: '5–15 s de esfuerzo máximo · depende de la intensidad y de las reservas de PCr', modulo: 'c1-vias-energeticas' },
  { id: 'DD-003', categoria: 'Vías energéticas', concepto: 'Reacción de la fosfocreatina', valor: 'PCr + ADP → Creatina + ATP · enzima: creatina quinasa', modulo: 'c1-vias-energeticas' },
  { id: 'DD-004', categoria: 'Vías energéticas', concepto: 'Glucólisis anaeróbica', valor: '30 s – 2 min · produce lactato', modulo: 'c1-vias-energeticas' },
  { id: 'DD-005', categoria: 'Vías energéticas', concepto: 'Glucólisis, fase citoplasmática', valor: '2 ATP netos + 2 NADH', modulo: 'c1-vias-energeticas' },
  { id: 'DD-006', categoria: 'Vías energéticas', concepto: 'ATP total por glucosa en aerobiosis', valor: '30–32 ATP · 30 en músculo esquelético', modulo: 'c1-vias-energeticas' },
  { id: 'DD-007', categoria: 'Vías energéticas', concepto: 'Oxidación del palmitato', valor: '≈129 ATP', modulo: 'c1-vias-energeticas' },
  { id: 'DD-008', categoria: 'Vías energéticas', concepto: 'Dónde ocurre cada fase', valor: 'Glucólisis → citoplasma · Krebs → matriz mitocondrial · Cadena de transporte → membrana interna mitocondrial', modulo: 'c1-vias-energeticas' },

  /* ── Fuerza y %1RM ── */
  { id: 'DD-010', categoria: 'Fuerza y %1RM', concepto: 'Fuerza máxima (aláctico)', valor: '>85 % 1RM · <15 s · <6 reps · 2–5 min de descanso', modulo: 'd3-fuerza' },
  { id: 'DD-011', categoria: 'Fuerza y %1RM', concepto: 'Hipertrofia (láctico)', valor: '70–85 % 1RM · 20–40 s · 6–12 reps · 30 s–1\'30" de descanso', modulo: 'd3-fuerza' },
  { id: 'DD-012', categoria: 'Fuerza y %1RM', concepto: 'Resistencia muscular (aeróbico)', valor: '≥45 s · ≥15 reps · ≤30 s de descanso', modulo: 'd3-fuerza' },

  /* ── Cardiovascular ── */
  { id: 'DD-020', categoria: 'Cardiovascular', concepto: 'FC en reposo normal', valor: '50–100 lpm', modulo: 'c2-cardiovascular' },
  { id: 'DD-021', categoria: 'Cardiovascular', concepto: 'Fox et al. (1971)', valor: 'FCmáx = 220 − edad', modulo: 'c2-cardiovascular' },
  { id: 'DD-022', categoria: 'Cardiovascular', concepto: 'Astrand (1952)', valor: 'FCmáx = 216,6 − (0,84 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-023', categoria: 'Cardiovascular', concepto: 'Tanaka et al. (2001)', valor: 'FCmáx = 208 − (0,7 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-024', categoria: 'Cardiovascular', concepto: 'Gellish et al. (2007)', valor: 'FCmáx = 207 − (0,7 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-025', categoria: 'Cardiovascular', concepto: 'Gulati et al. (2010) — mujeres', valor: 'FCmáx = 206 − (0,88 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-026', categoria: 'Cardiovascular', concepto: 'FC de reserva', valor: 'FCmáx − FC en reposo', modulo: 'c2-cardiovascular' },
  { id: 'DD-027', categoria: 'Cardiovascular', concepto: 'Gasto cardíaco', valor: 'GC = FC × volumen sistólico', modulo: 'c2-cardiovascular' },
  { id: 'DD-028', categoria: 'Cardiovascular', concepto: 'Conversión de pulso a lpm', valor: '×4 (15 s) · ×6 (10 s) · ×10 (6 s)', modulo: 'c2-cardiovascular' },
  { id: 'DD-029', categoria: 'Cardiovascular', concepto: 'Adaptación por tipo de esfuerzo', valor: 'Dinámico/resistencia → dilatación → ↑volumen sistólico · Isométrico/fuerza → hipertrofia → ↑fuerza de contracción', modulo: 'c2-cardiovascular' },

  /* ── Respiratorio ── */
  { id: 'DD-030', categoria: 'Respiratorio', concepto: '1 MET', valor: '3,5 ml O₂ · kg⁻¹ · min⁻¹', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-031', categoria: 'Respiratorio', concepto: 'VO₂', valor: 'VO₂ = gasto cardíaco × diferencia arteriovenosa', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-032', categoria: 'Respiratorio', concepto: 'Diferencia a-vO₂ en reposo', valor: '5 ml O₂ / 100 ml de sangre', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-033', categoria: 'Respiratorio', concepto: 'Diferencia a-vO₂ en ejercicio', valor: '15–17 ml O₂ / 100 ml de sangre', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-034', categoria: 'Respiratorio', concepto: 'VO₂máx hombres sedentarios 20–40 a', valor: '35–45 ml/kg/min', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-035', categoria: 'Respiratorio', concepto: 'VO₂máx mujeres sedentarias 20–40 a', valor: '30–40 ml/kg/min', modulo: 'c3-respiratorio-vo2' },

  /* ── Umbrales y zonas ── */
  { id: 'DD-040', categoria: 'Umbrales y zonas', concepto: 'R0 — recuperación', valor: '<65 % · calentamiento, recuperación activa, eliminación de desechos', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-041', categoria: 'Umbrales y zonas', concepto: 'R1 · VT1 — umbral aeróbico', valor: '65–75 % · 99 % aeróbico / 1 % anaeróbico · 20–40 % grasas y 60–80 % HC', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-042', categoria: 'Umbrales y zonas', concepto: 'R2 · VT2 — umbral anaeróbico', valor: '75–85 % del VO₂máx · 80–90 % de la FCmáx · 95 % aeróbico / 5 % anaeróbico · contiene el MLSS', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-043', categoria: 'Umbrales y zonas', concepto: 'R3 / R3+ — VO₂máx', valor: '90–95 % · 65 % aeróbico / 35 % anaeróbico · sustrato: glucógeno · aquí van HIIT y SIT', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-044', categoria: 'Umbrales y zonas', concepto: 'Modelos de distribución', valor: 'Baja intensidad/alto volumen (90 % bajo VT1) · Alta intensidad/bajo volumen · Entre umbrales (tempo) · Polarizado (evita la zona 2)', modulo: 'c5-umbrales-zonas' },

  /* ── Nutrición deportiva ── */
  { id: 'DD-050', categoria: 'Nutrición deportiva', concepto: 'Hidratación previa', valor: '250–500 ml de agua', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-051', categoria: 'Nutrición deportiva', concepto: 'Sesión <60 min', valor: 'Agua es suficiente', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-052', categoria: 'Nutrición deportiva', concepto: 'Sesión >60 min', valor: 'Bebida deportiva con CHO y electrolitos', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-053', categoria: 'Nutrición deportiva', concepto: 'Comida rica en CHO previa', valor: '2–4 h antes', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-054', categoria: 'Nutrición deportiva', concepto: 'Reposición de glucógeno', valor: 'CHO de alto índice glucémico, 30–60 min post', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-055', categoria: 'Nutrición deportiva', concepto: 'Proteína post-entrenamiento', valor: '20–40 g de alta calidad', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-056', categoria: 'Nutrición deportiva', concepto: 'Proporción de recuperación', valor: 'CHO : proteína = 3:1 o 4:1', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-057', categoria: 'Nutrición deportiva', concepto: 'Ultra-resistencia (>4 h)', valor: 'Único caso donde se consume proteína durante el esfuerzo', modulo: 'c7-nutricion-deportiva' },

  /* ── Biomarcadores ── */
  { id: 'DD-060', categoria: 'Biomarcadores', concepto: 'Glucosa en ayunas', valor: '70–100 mg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-061', categoria: 'Biomarcadores', concepto: 'Hemoglobina', valor: '♂ 13,8–17,2 · ♀ 12,1–15,1 g/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-062', categoria: 'Biomarcadores', concepto: 'Hematocrito', valor: '♂ 40–52 % · ♀ 36–48 %', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-063', categoria: 'Biomarcadores', concepto: 'Ferritina', valor: '♂ 20–250 · ♀ 12–150 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-064', categoria: 'Biomarcadores', concepto: 'Lactato en reposo', valor: '0,5–2,2 mmol/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-065', categoria: 'Biomarcadores', concepto: 'Creatina quinasa (CK)', valor: '♂ 55–170 · ♀ 30–135 U/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-066', categoria: 'Biomarcadores', concepto: 'Mioglobina', valor: '10–95 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-067', categoria: 'Biomarcadores', concepto: 'Proteína C reactiva', valor: '<3 mg/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-068', categoria: 'Biomarcadores', concepto: 'Cortisol matutino', valor: '6–23 µg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-069', categoria: 'Biomarcadores', concepto: 'Testosterona total', valor: '♂ 270–1070 · ♀ 15–70 ng/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-070', categoria: 'Biomarcadores', concepto: 'Relación testosterona/cortisol', valor: '>30 (por debajo indica sobrecarga)', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-071', categoria: 'Biomarcadores', concepto: 'IGF-1', valor: '100–300 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-072', categoria: 'Biomarcadores', concepto: 'Ácido úrico', valor: '3,5–7,2 mg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-073', categoria: 'Biomarcadores', concepto: 'Malondialdehído (MDA)', valor: '1–2 µmol/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-074', categoria: 'Biomarcadores', concepto: 'Relación GSH/GSSG', valor: '>10', modulo: 'a5-sistemas-energeticos-biomarcadores' },

  /* ── Estadística ── */
  { id: 'DD-080', categoria: 'Estadística', concepto: 'Media', valor: 'Σx / n', modulo: 'a6-estadistica' },
  { id: 'DD-081', categoria: 'Estadística', concepto: 'Mediana (n impar)', valor: 'Posición (N+1)/2 de la lista ordenada', modulo: 'a6-estadistica' },
  { id: 'DD-082', categoria: 'Estadística', concepto: 'Mediana (n par)', valor: 'Promedio de las posiciones N/2 y (N/2)+1', modulo: 'a6-estadistica' },
  { id: 'DD-083', categoria: 'Estadística', concepto: 'Varianza', valor: 'Σ(x − x̄)² / n', modulo: 'a6-estadistica' },
  { id: 'DD-084', categoria: 'Estadística', concepto: 'Desviación estándar', valor: '√varianza', modulo: 'a6-estadistica' },
  { id: 'DD-085', categoria: 'Estadística', concepto: 'Rango', valor: 'máximo − mínimo', modulo: 'a6-estadistica' },
  { id: 'DD-086', categoria: 'Estadística', concepto: 'Porcentaje de aumento', valor: '((nuevo − viejo) / viejo) × 100', modulo: 'a6-estadistica' },

  /* ── Carga ── */
  { id: 'DD-090', categoria: 'Carga', concepto: 'Densidad', valor: 'Tiempo de trabajo activo / tiempo total', modulo: 'd2-carga' },
  { id: 'DD-091', categoria: 'Carga', concepto: 'Ejemplo de densidad', valor: '30 s trabajo + 60 s descanso → 30/90 = 0,33 (33 %). Con 30 s de descanso → 30/60 = 0,5 (50 %)', modulo: 'd2-carga' },
  { id: 'DD-092', categoria: 'Carga', concepto: 'Escala de esfuerzo percibido', valor: 'Escala de Borg (RPE)', modulo: 'd2-carga' },

  /* ── Ley 2210 y dopaje ── */
  { id: 'DD-100', categoria: 'Ley 2210 y dopaje', concepto: 'Requisitos de idoneidad', valor: '>18 años · ≥12 meses de experiencia · aprobar la evaluación en una categoría', modulo: 'd1-conceptualizacion' },
  { id: 'DD-101', categoria: 'Ley 2210 y dopaje', concepto: 'Niveles de la Ley 2210', valor: 'Formación · perfeccionamiento · altos logros', modulo: 'd1-conceptualizacion' },
  { id: 'DD-102', categoria: 'Ley 2210 y dopaje', concepto: 'Estrategias del programa antidopaje', valor: 'Educación · disuasión · detección', modulo: 'c9-dopaje' },
  { id: 'DD-103', categoria: 'Ley 2210 y dopaje', concepto: 'Infracciones del Artículo 2', valor: '11 infracciones', modulo: 'c9-dopaje' },
  { id: 'DD-104', categoria: 'Ley 2210 y dopaje', concepto: 'Localización fallida (2.4)', valor: 'Dentro de un período de doce meses (memorizar como está en la cartilla)', modulo: 'c9-dopaje' },
];

export const CATEGORIAS_DATOS_DUROS = [...new Set(DATOS_DUROS.map((d) => d.categoria))];
```

### 9.5 `content/glosario.ts`

```ts
// content/glosario.ts
// Unión de las "cajas de conceptos clave" de las cuatro cartillas.
// REGLA: todo conceptoClave de un módulo marcado 'completo' debe tener entrada
// aquí, o el build falla. Al terminar un módulo, se añaden sus términos.

import type { EntradaGlosario } from '@/lib/tipos';

export const GLOSARIO: EntradaGlosario[] = [
  /* ── C5 · Umbrales y zonas (módulo piloto) ── */
  {
    termino: 'Umbral aeróbico (VT1)',
    definicion:
      'Primer umbral ventilatorio. Intensidad, en torno al 65–75 % de la FCmáx, a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Marca el techo del trabajo puramente aeróbico y la zona de máxima oxidación de grasas.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT1', 'Primer umbral ventilatorio'],
  },
  {
    termino: 'Umbral anaeróbico (VT2)',
    definicion:
      'Segundo umbral ventilatorio, entre el 75–85 % del VO₂máx (80–90 % de la FCmáx). Por encima de él el lactato se acumula más rápido de lo que se elimina y el esfuerzo deja de ser sostenible. Contiene el MLSS.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['VT2', 'Segundo umbral ventilatorio', 'Umbral láctico'],
  },
  {
    termino: 'MLSS',
    definicion:
      'Máximo estado estable de lactato: la intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo. Es el punto de referencia práctico del umbral anaeróbico y define el techo del trabajo continuo prolongado.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Máximo estado estable de lactato'],
  },
  {
    termino: 'IMTG',
    definicion:
      'Triglicéridos intramusculares: depósitos de grasa almacenados dentro de la fibra muscular. El entrenamiento continuo en R1 los aumenta, lo que mejora la disponibilidad de sustrato lipídico en esfuerzos largos.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Triglicéridos intramusculares'],
  },
  {
    termino: 'VAM',
    definicion:
      'Velocidad aeróbica máxima: la velocidad de desplazamiento más baja a la que se alcanza el VO₂máx. Sirve para prescribir intervalos en porcentaje de VAM en vez de en porcentaje de frecuencia cardíaca.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Velocidad aeróbica máxima'],
  },
  {
    termino: 'Potencia aeróbica',
    definicion:
      'Capacidad de trabajar cerca del VO₂máx. Se entrena en R3 (90–95 %) y produce aumento de densidad capilar, densidad mitocondrial y actividad de las enzimas oxidativas.',
    modulo: 'c5-umbrales-zonas',
  },
  {
    termino: 'Entrenamiento polarizado',
    definicion:
      'Modelo de distribución de la intensidad que concentra el volumen por debajo del VT1 y el resto por encima del VT2, evitando deliberadamente la zona intermedia (R2). Busca alto estímulo con baja fatiga acumulada.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Modelo polarizado'],
  },
  {
    termino: 'HIIT',
    definicion:
      'Entrenamiento interválico de alta intensidad: series submáximas cercanas al VO₂máx con recuperaciones incompletas. Se ubica en R3/R3+.',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Entrenamiento interválico de alta intensidad'],
  },
  {
    termino: 'SIT',
    definicion:
      'Sprint interval training: repeticiones de muy corta duración a intensidad máxima o supramáxima con recuperaciones largas. Aunque el esfuerzo es de sprint, su objetivo adaptativo se ubica en el trabajo de potencia aeróbica (R3+).',
    modulo: 'c5-umbrales-zonas',
    sinonimos: ['Sprint interval training'],
  },

  /* ── Términos transversales de alto rendimiento en el examen ── */
  {
    termino: 'MET',
    definicion:
      'Equivalente metabólico. 1 MET equivale a 3,5 ml de O₂ por kilogramo de peso por minuto: el consumo aproximado en reposo. Se usa para expresar la intensidad de una actividad como múltiplo del reposo.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'VO₂máx',
    definicion:
      'Máximo volumen de oxígeno que el organismo puede captar, transportar y utilizar por unidad de tiempo. Se calcula como gasto cardíaco por diferencia arteriovenosa y se expresa en ml/kg/min.',
    modulo: 'c3-respiratorio-vo2',
  },
  {
    termino: 'Frecuencia cardíaca de reserva',
    definicion:
      'Diferencia entre la frecuencia cardíaca máxima y la de reposo. Representa el margen de trabajo cardíaco disponible y es la base del método de Karvonen para prescribir intensidades.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Gasto cardíaco',
    definicion:
      'Volumen de sangre que el corazón expulsa por minuto. Es el producto de la frecuencia cardíaca por el volumen sistólico.',
    modulo: 'c2-cardiovascular',
  },
  {
    termino: 'Densidad',
    definicion:
      'Relación entre el tiempo de trabajo activo y el tiempo total de la sesión o serie. Reducir el descanso sube la densidad y aumenta la exigencia sin tocar el peso ni el volumen.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Escala de Borg (RPE)',
    definicion:
      'Escala de esfuerzo percibido con la que el deportista califica subjetivamente la intensidad. Es el instrumento estándar para estimar la carga interna cuando no hay medición objetiva.',
    modulo: 'd2-carga',
  },
  {
    termino: 'Multilateralidad',
    definicion:
      'Principio biológico que defiende una preparación multifacética, con variedad de conductas motrices, técnicas y métodos. Es especialmente pertinente en las primeras etapas de la vida deportiva.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Especificidad',
    definicion:
      'Principio biológico según el cual las adaptaciones responden a las características concretas del estímulo aplicado. Se aplica después de haber desarrollado las cualidades básicas.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Supercompensación',
    definicion:
      'Restablecimiento del organismo por encima del nivel inicial tras el agotamiento provocado por una carga y su recuperación. Es el mecanismo que explica la mejora del rendimiento.',
    modulo: 'b2-principios',
  },
  {
    termino: 'Objetividad',
    definicion:
      'Grado en que los resultados de una prueba están libres de sesgos o influencias ajenas al atributo medido. Se garantiza con procedimientos e instrumentos estandarizados.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Fiabilidad',
    definicion:
      'Consistencia de una prueba: si se repite en las mismas condiciones, arroja resultados equivalentes. Una prueba puede ser fiable sin ser válida.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Validez',
    definicion:
      'Grado en que una prueba mide efectivamente lo que dice medir. Sin validez, la precisión y la consistencia no sirven de nada.',
    modulo: 'a6-estadistica',
  },
  {
    termino: 'Responsabilidad estricta',
    definicion:
      'Principio del Artículo 2.1 del Código Mundial Antidopaje: el deportista responde por cualquier sustancia prohibida hallada en su muestra, sin que sea necesario demostrar intención. La intención puede influir en la sanción, no en la existencia de la infracción.',
    modulo: 'c9-dopaje',
  },
];

/** Filtro del glosario en cliente. <400 entradas: no necesita índice. */
export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buscarGlosario(consulta: string): EntradaGlosario[] {
  const q = normalizarBusqueda(consulta);
  if (q.length === 0) return GLOSARIO;
  return GLOSARIO.filter((e) => {
    const campos = [e.termino, e.definicion, ...(e.sinonimos ?? [])];
    return campos.some((c) => normalizarBusqueda(c).includes(q));
  });
}
```

### 9.6 Índices de carga diferida

```ts
// content/banco/indice.ts
// Cada módulo se carga con import() dinámico: el bundle inicial no lleva
// 750 ítems. El simulacro final los pide todos, pero bajo interacción.

import type { Item } from '@/lib/tipos';

export const BANCO: Record<string, () => Promise<Item[]>> = {
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.ITEMS),
  // Los 28 módulos restantes se añaden aquí en los pasos 15–17.
};

export async function cargarBancoModulo(slug: string): Promise<Item[]> {
  const cargar = BANCO[slug];
  return cargar ? cargar() : [];
}

export async function cargarBancoBloque(slugs: readonly string[]): Promise<Item[]> {
  const tandas = await Promise.all(slugs.map(cargarBancoModulo));
  return tandas.flat();
}

/** Solo para el simulacro final y el diagnóstico. Se llama desde un handler
 *  de click, nunca en render ni al montar. */
export async function cargarBancoCompleto(): Promise<Item[]> {
  const tandas = await Promise.all(Object.values(BANCO).map((c) => c()));
  return tandas.flat();
}
```

```ts
// content/tarjetas/indice.ts
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS: Record<string, () => Promise<Tarjeta[]>> = {
  'c5-umbrales-zonas': () => import('./c5-umbrales-zonas').then((m) => m.TARJETAS_MODULO),
};

export async function cargarTarjetas(slug: string): Promise<Tarjeta[]> {
  const cargar = TARJETAS[slug];
  return cargar ? cargar() : [];
}

/** Para la cola de repaso, que mezcla tarjetas de varios módulos. */
export async function cargarTarjetasDe(slugs: readonly string[]): Promise<Tarjeta[]> {
  const tandas = await Promise.all(slugs.map(cargarTarjetas));
  return tandas.flat();
}
```

### 9.7 `src/lib/contenido.ts` — loaders server-only

```ts
// src/lib/contenido.ts
import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

const DIR_TEORIA = path.join(process.cwd(), 'content', 'teoria');

/** Devuelve el MDX crudo, o null si el módulo aún no tiene teoría escrita.
 *  null NO es un error: es el estado normal de un módulo en preparación. */
export async function leerTeoria(slug: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(DIR_TEORIA, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }
}

export async function existeTeoria(slug: string): Promise<boolean> {
  return (await leerTeoria(slug)) !== null;
}
```

---

## 10. Mapa de rutas y frontera Server / Client

### 10.1 Rutas

| Ruta | Qué hace | Página | Controlador cliente |
|---|---|---|---|
| `/` | Estado general, "continuar donde ibas", racha | Server | `ResumenInicio`, `TarjetaContinuar`, `Racha` |
| `/diagnostico` | 30 ítems · 35 min → plan personalizado | Server | `ControladorSesion` |
| `/plan` | Plan de estudio por días hasta el examen | Server | `VistaPlan` |
| `/bloques/[bloqueId]` | Índice del bloque, progreso de sus módulos | Server | `ProgresoModulos` |
| `/modulos/[slug]` | Etapa 1 · Esencial (MDX) | Server | `MarcadorLectura`, `EtapasModulo` |
| `/modulos/[slug]/tarjetas` | Etapa 2 · Tarjetas | Server | `MazoTarjetas` |
| `/modulos/[slug]/practica` | Etapa 3 · Retroalimentación inmediata | Server | `ControladorSesion` |
| `/modulos/[slug]/quiz` | Etapa 4 · 10 ítems, feedback al final | Server | `ControladorSesion` |
| `/repaso` | Cola de repaso espaciado del día | Server | `ControladorRepaso` |
| `/simulacros` | Selector de simulacros | Server | `EstadoSimulacros` |
| `/simulacros/bloque/[bloqueId]` | 40 ítems · 50 min | Server | `ControladorSesion` |
| `/simulacros/final` | 100 ítems · 120 min · auto-envío | Server | `ControladorSesion` |
| `/resultados/[intentoId]` | Informe + revisión ítem por ítem | Server | `VistaInforme` |
| `/progreso` | Dominio por bloque/módulo, historial | Server | `PanelProgreso` |
| `/glosario` | Conceptos clave, buscable | Server | `BuscadorGlosario` |
| `/herramientas` | Calculadora médico-deportiva | Server | `Calculadora` |
| `/ultima-noche` | Datos duros en tarjetas rápidas | Server | `MazoDatosDuros` |
| `/ajustes` | Tema, nombre, fecha de examen, exportar/importar, reiniciar | Server | `PanelAjustes` |

**SEO:** metadata completa (title, description, OG) **solo** en `/`. El resto exporta `metadata` con título y `robots: { index: false }`. No hay sitemap de contenido, ni RSS, ni JSON-LD de artículo: no hay contenido público que indexar.

**Next 15 — APIs asíncronas.** `params`, `searchParams`, `cookies()` y `headers()` son promesas. Siempre:

```tsx
// src/app/modulos/[slug]/page.tsx  — Server Component
import { notFound } from 'next/navigation';
import { MODULOS, MODULOS_POR_SLUG } from '@/content/estructura';
import { leerTeoria } from '@/lib/contenido';

export function generateStaticParams() {
  return MODULOS.map((m) => ({ slug: m.slug }));
}

export default async function PaginaModulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;                 // ← await obligatorio en Next 15
  const modulo = MODULOS_POR_SLUG.get(slug);
  if (!modulo) notFound();

  const mdx = await leerTeoria(slug);
  // …
}
```

```tsx
// Con searchParams — p. ej. /glosario?q=umbral
export default async function PaginaGlosario({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  // …
}
```

### 10.2 Regla de frontera

1. **Server Component por defecto.** Se añade `"use client"` solo cuando el componente necesita estado, eventos, `localStorage`, temporizador o API del navegador.
2. **La página siempre es Server Component.** Lee el MDX y los metadatos, y delega la interactividad a un controlador cliente al que le pasa los datos como props.
3. **`src/lib/contenido.ts` es server-only** (`import 'server-only'`). Nunca se importa desde cliente.
4. **`content/banco/*` y `content/tarjetas/*` son client-safe**: son módulos TS puros. Es lo que permite el `import()` dinámico bajo interacción.

### 10.3 Archivos con `"use client"`

Estos y **solo** estos. Si un archivo no está en la lista y llevas la directiva, algo se diseñó mal.

```
src/components/layout/proveedores.tsx        ← ThemeProvider + Toaster
src/components/layout/nav-inferior.tsx       ← usePathname
src/components/layout/barra-lateral.tsx      ← usePathname
src/components/layout/interruptor-tema.tsx
src/components/layout/aviso-respaldo.tsx

src/components/inicio/resumen-inicio.tsx
src/components/inicio/tarjeta-continuar.tsx
src/components/inicio/racha.tsx

src/components/modulo/etapas-modulo.tsx      ← lee estado del módulo
src/components/modulo/marcador-lectura.tsx   ← IntersectionObserver
src/components/modulo/mazo-tarjetas.tsx

src/components/items/opcion-unica.tsx
src/components/items/opcion-multiple.tsx
src/components/items/verdadero-falso.tsx
src/components/items/emparejar.tsx
src/components/items/calculo.tsx
src/components/items/ordenar.tsx
src/components/items/caso.tsx
src/components/items/envoltorio-item.tsx
src/components/items/retroalimentacion.tsx

src/components/sesion/controlador-sesion.tsx  ← práctica, quiz, diagnóstico, simulacros
src/components/sesion/cronometro-visual.tsx
src/components/sesion/panel-navegacion.tsx
src/components/sesion/dialogo-reanudar.tsx
src/components/sesion/controlador-repaso.tsx

src/components/informe/vista-informe.tsx
src/components/informe/barras-dominio.tsx     ← recharts
src/components/informe/temas-prioritarios.tsx
src/components/informe/revision-items.tsx

src/components/progreso/panel-progreso.tsx
src/components/glosario/buscador-glosario.tsx
src/components/herramientas/calculadora.tsx
src/components/ultima-noche/mazo-datos-duros.tsx
src/components/ajustes/panel-ajustes.tsx
src/components/pwa/aviso-instalar.tsx

src/hooks/usar-estado.ts
src/hooks/usar-cronometro.ts
src/hooks/usar-sesion.ts
```

**Sin `"use client"` (importante que quede claro):** `src/lib/*.ts` completo, incluido `almacenamiento.ts`; los componentes MDX de `src/components/mdx/`; todos los `page.tsx` y `layout.tsx`.

### 10.4 Dónde se lee el reloj

Cero `new Date()` sin argumentos y cero `Date.now()` en el cuerpo de un render. `new Date(unaCadenaISO)` sí está permitido: es determinista.

| Lugar | Llamada | Por qué es seguro |
|---|---|---|
| `usar-cronometro.ts` | `Date.now()` dentro de `setInterval` y del listener de visibilidad | Está en un efecto, nunca en render |
| `controlador-sesion.tsx` | `Date.now()` al pulsar "Empezar" (genera la semilla) | Handler de evento |
| `usar-sesion.ts` | `new Date().toISOString()` al guardar una respuesta o cerrar un intento | Handler de evento |
| `resumen-inicio.tsx` | `new Date().toISOString()` dentro de `useEffect` para calcular racha y cola del día | Efecto |
| `panel-ajustes.tsx` | `new Date().toISOString()` al exportar el respaldo | Handler |

Todo lo demás recibe la fecha como parámetro.

---

## 11. Sistema de diseño

### 11.1 Identidad

Deportiva sobria. Los usuarios son entrenadores adultos que estudian de noche después de trabajar: la app no los infantiliza ni los premia con confeti. **Retroalimentación honesta** — si sacó 52, se le dice qué significa y qué hacer.

- **Referencias:** el panel de datos de un entrenador (denso pero legible), no una app de idiomas.
- **Color por bloque** para orientación espacial: el usuario debe saber en qué bloque está sin leer el título.
- **Mobile-first real:** se diseña a 375 px y se escala. Barra inferior de navegación en móvil, barra lateral desde `lg`.
- **Transiciones ≤200 ms.** Nada de animaciones de celebración.

### 11.2 Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Títulos | **Barlow** 600/700 | Encabezados, veredicto, números grandes. Condensada y atlética sin ser agresiva. |
| Cuerpo | **Inter** 400/500/600 | Teoría, enunciados, opciones. Con `font-variant-numeric: tabular-nums`. |
| Numérico / fórmulas | **JetBrains Mono** 400/500 | Cronómetro, valores de la calculadora, fórmulas del componente `<Formula>`. Tabular obligatorio: sin él, el cronómetro "salta" cada segundo. |

Se cargan con `next/font/google` y se exponen como variables CSS.

```tsx
// src/app/layout.tsx  — Server Component, SIN "use client"
import type { Metadata, Viewport } from 'next';
import { Barlow, Inter, JetBrains_Mono } from 'next/font/google';
import { Proveedores } from '@/components/layout/proveedores';
import { Shell } from '@/components/layout/shell';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--fuente-cuerpo', display: 'swap' });
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--fuente-titulo',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--fuente-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Idóneo 2210', template: '%s · Idóneo 2210' },
  description:
    'Preparación para la Evaluación de Idoneidad del Entrenador Deportivo (Ley 2210 de 2022). 29 módulos, simulacros cronometrados y repaso espaciado.',
  applicationName: 'Idóneo 2210',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Idóneo 2210' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1116' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CO"
      suppressHydrationWarning
      className={`${inter.variable} ${barlow.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Proveedores>
          <Shell>{children}</Shell>
        </Proveedores>
      </body>
    </html>
  );
}
```

### 11.3 `src/app/globals.css` — Tailwind v4

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ══════════════════════════════════════════════════════════════════
   Tokens crudos. Se declaran aquí y se alían en @theme inline abajo.
   Formato oklch: L C H. Contraste verificado AA sobre su fondo.
   ══════════════════════════════════════════════════════════════════ */

:root {
  --radius: 0.625rem;

  --background: oklch(0.991 0.002 250);
  --foreground: oklch(0.215 0.018 255);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.215 0.018 255);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.215 0.018 255);

  --primary: oklch(0.48 0.12 250);            /* azul acero profundo */
  --primary-foreground: oklch(0.985 0.004 250);
  --secondary: oklch(0.962 0.006 250);
  --secondary-foreground: oklch(0.29 0.03 255);
  --muted: oklch(0.955 0.006 250);
  --muted-foreground: oklch(0.515 0.02 255);
  --accent: oklch(0.94 0.022 250);
  --accent-foreground: oklch(0.35 0.06 255);

  --destructive: oklch(0.552 0.19 27);
  --destructive-foreground: oklch(0.99 0 0);
  --exito: oklch(0.52 0.125 152);
  --exito-foreground: oklch(0.99 0 0);
  --aviso: oklch(0.66 0.145 72);
  --aviso-foreground: oklch(0.20 0.02 255);

  --border: oklch(0.902 0.008 250);
  --input: oklch(0.902 0.008 250);
  --ring: oklch(0.48 0.12 250);

  /* ── Color por bloque. Orientación espacial: el usuario sabe dónde
        está sin leer el título. Cuatro matices bien separados. ── */
  --bloque-a: oklch(0.60 0.125 72);           /* A · Ciencias Básicas — ámbar */
  --bloque-a-suave: oklch(0.955 0.035 78);
  --bloque-b: oklch(0.52 0.155 295);          /* B · Pedagogía — violeta */
  --bloque-b-suave: oklch(0.955 0.03 295);
  --bloque-c: oklch(0.53 0.105 172);          /* C · Ciencias Aplicadas — verde azulado */
  --bloque-c-suave: oklch(0.955 0.03 172);
  --bloque-d: oklch(0.55 0.145 40);           /* D · Entrenamiento — terracota */
  --bloque-d-suave: oklch(0.955 0.03 45);
  --bloque-contraste: oklch(0.99 0 0);

  /* Gráficas del informe (recharts). */
  --chart-1: var(--bloque-a);
  --chart-2: var(--bloque-b);
  --chart-3: var(--bloque-c);
  --chart-4: var(--bloque-d);
  --chart-5: var(--muted-foreground);
}

.dark {
  --background: oklch(0.175 0.014 255);
  --foreground: oklch(0.925 0.008 250);
  --card: oklch(0.218 0.016 255);
  --card-foreground: oklch(0.925 0.008 250);
  --popover: oklch(0.218 0.016 255);
  --popover-foreground: oklch(0.925 0.008 250);

  --primary: oklch(0.70 0.13 248);
  --primary-foreground: oklch(0.17 0.02 255);
  --secondary: oklch(0.262 0.018 255);
  --secondary-foreground: oklch(0.90 0.01 250);
  --muted: oklch(0.262 0.018 255);
  --muted-foreground: oklch(0.665 0.018 255);
  --accent: oklch(0.30 0.035 252);
  --accent-foreground: oklch(0.90 0.02 250);

  --destructive: oklch(0.66 0.18 26);
  --destructive-foreground: oklch(0.16 0.01 255);
  --exito: oklch(0.68 0.14 152);
  --exito-foreground: oklch(0.16 0.01 255);
  --aviso: oklch(0.78 0.14 76);
  --aviso-foreground: oklch(0.18 0.02 255);

  --border: oklch(0.305 0.018 255);
  --input: oklch(0.305 0.018 255);
  --ring: oklch(0.70 0.13 248);

  --bloque-a: oklch(0.76 0.13 76);
  --bloque-a-suave: oklch(0.28 0.045 76);
  --bloque-b: oklch(0.72 0.145 295);
  --bloque-b-suave: oklch(0.28 0.05 295);
  --bloque-c: oklch(0.72 0.105 172);
  --bloque-c-suave: oklch(0.27 0.04 172);
  --bloque-d: oklch(0.73 0.135 45);
  --bloque-d-suave: oklch(0.28 0.05 45);
  --bloque-contraste: oklch(0.16 0.01 255);
}

/* ══════════════════════════════════════════════════════════════════
   @theme inline — aquí es donde Tailwind v4 genera las utilidades.
   Sin esta sección, `bg-bloque-c` o `text-exito` NO existen.
   ══════════════════════════════════════════════════════════════════ */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-exito: var(--exito);
  --color-exito-foreground: var(--exito-foreground);
  --color-aviso: var(--aviso);
  --color-aviso-foreground: var(--aviso-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-bloque-a: var(--bloque-a);
  --color-bloque-a-suave: var(--bloque-a-suave);
  --color-bloque-b: var(--bloque-b);
  --color-bloque-b-suave: var(--bloque-b-suave);
  --color-bloque-c: var(--bloque-c);
  --color-bloque-c-suave: var(--bloque-c-suave);
  --color-bloque-d: var(--bloque-d);
  --color-bloque-d-suave: var(--bloque-d-suave);
  --color-bloque-contraste: var(--bloque-contraste);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --font-sans: var(--fuente-cuerpo), ui-sans-serif, system-ui, sans-serif;
  --font-titulo: var(--fuente-titulo), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--fuente-mono), ui-monospace, monospace;

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-variant-numeric: tabular-nums;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-titulo);
    letter-spacing: -0.01em;
  }
  /* Todo elemento interactivo cumple el mínimo táctil. Ver §22, regla 8. */
  button, [role='button'], a[href], input, select, textarea {
    min-height: 44px;
  }
  /* Área segura para la barra inferior en iPhone. */
  .pb-nav {
    padding-bottom: calc(4rem + env(safe-area-inset-bottom));
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11.4 Cómo se usa el color de bloque

Tailwind no genera clases a partir de variables construidas en tiempo de ejecución (`bg-bloque-${id}` no funciona). Se usa un mapa estático:

```ts
// src/lib/utils.ts  (fragmento)
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BloqueId } from './tipos';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Mapa estático: Tailwind necesita ver las clases completas en el código. */
export const CLASES_BLOQUE: Record<BloqueId, { fondo: string; texto: string; borde: string; suave: string }> = {
  A: { fondo: 'bg-bloque-a', texto: 'text-bloque-a', borde: 'border-bloque-a', suave: 'bg-bloque-a-suave' },
  B: { fondo: 'bg-bloque-b', texto: 'text-bloque-b', borde: 'border-bloque-b', suave: 'bg-bloque-b-suave' },
  C: { fondo: 'bg-bloque-c', texto: 'text-bloque-c', borde: 'border-bloque-c', suave: 'bg-bloque-c-suave' },
  D: { fondo: 'bg-bloque-d', texto: 'text-bloque-d', borde: 'border-bloque-d', suave: 'bg-bloque-d-suave' },
};

export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function porcentaje(correctas: number, total: number): number {
  return total === 0 ? 0 : Math.round((correctas / total) * 100);
}
```

### 11.5 Espaciado y layout

- Ancho máximo de contenido: `max-w-3xl` (768 px). Es una app de lectura y respuesta, no un dashboard ancho.
- Padding de tarjeta: `p-4` móvil, `p-6` desde `sm`.
- Separación entre tarjetas: `gap-3` móvil, `gap-4` desde `sm`.
- Radio: `rounded-lg` tarjetas, `rounded-md` botones, `rounded-full` insignias.
- Sombras: `shadow-sm` en tarjetas. Los botones son planos con borde.
- **Tamaños táctiles:** opciones de ítem `min-h-[52px]`; el resto de interactivos `min-h-[44px]` (ya forzado en `@layer base`).
- Barra inferior: `h-16`, cinco destinos — Inicio, Módulos, Repaso, Simulacros, Ajustes.

### 11.6 `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

`"config": ""` es la marca de Tailwind v4. Si el CLI escribe una ruta ahí, el proyecto quedó en v3: vuelve a §2.1.

Componentes shadcn a instalar: `button card badge progress separator tabs dialog sheet alert input label switch select skeleton scroll-area sonner accordion tooltip`.

### 11.7 `src/components/layout/pie.tsx` — atribución CC BY-NC-SA

Cumple la obligación **BY** de §1 · Licencia y atribución. Va dentro de `Shell`, así que aparece en **todas** las rutas sin excepción. Es un Server Component: texto estático, sin estado, sin reloj.

```tsx
// src/components/layout/pie.tsx  — Server Component. SIN "use client".
import Link from 'next/link';

/** Atribución obligatoria del material fuente (CC BY-NC-SA 4.0).
 *  No editar el texto sin releer §1 · Licencia y atribución: es un
 *  requisito de la licencia de las cartillas, no una nota de cortesía. */
export function Pie() {
  return (
    <footer className="mt-16 border-t border-border px-4 py-8 text-xs leading-relaxed text-muted-foreground">
      <div className="mx-auto max-w-3xl space-y-3">
        <p>
          Contenido educativo adaptado de la{' '}
          <span className="italic">«Guía básica del entrenador deportivo»</span> (Cartillas 1 a 4),{' '}
          <strong className="font-semibold text-foreground">COLEF Colombia</strong> y{' '}
          <strong className="font-semibold text-foreground">COCED</strong>, 2025, bajo licencia{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es"
            target="_blank"
            rel="license noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            CC BY-NC-SA 4.0
          </a>
          . Idóneo 2210 es una obra derivada sin ánimo de lucro y se distribuye bajo la misma
          licencia.
        </p>
        <p>
          No es un producto oficial de COLEF ni de COCED, y sus veredictos no representan el
          puntaje oficial de aprobación.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          <Link href="/ajustes" className="underline underline-offset-2 hover:text-foreground">
            Ajustes y respaldo
          </Link>
        </nav>
      </div>
    </footer>
  );
}
```

**Cableado en `shell.tsx`:** el pie va después de `{children}` y **antes** del hueco de la barra inferior, para que en móvil no quede tapado por la nav de `h-16`:

```tsx
// src/components/layout/shell.tsx  — Server Component. Extracto.
<main className="mx-auto w-full max-w-3xl px-4 pt-4">{children}</main>
<Pie />
<div className="h-16 md:hidden" aria-hidden="true" />  {/* hueco de nav-inferior */}
```

**Excepción única:** durante un simulacro cronometrado (`/simulacros/*` y `/diagnostico` con intento activo) el pie estorba y compite con el cronómetro. En esas rutas se oculta con `hidden` mientras el intento está en curso — **no** se elimina del árbol. La atribución sigue presente en el DOM y visible en las otras 15 rutas, que es lo que la licencia exige.

---

## 12. Pipeline MDX y componentes de contenido

### 12.1 Renderizador

```tsx
// src/components/mdx/renderizador.tsx  — Server Component, async. SIN "use client".
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { componentesMdx } from './componentes';

export async function RenderizadorMdx({ fuente }: { fuente: string }) {
  return (
    <div className="prose-idoneo">
      <MDXRemote
        source={fuente}
        components={componentesMdx}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
```

`prose-idoneo` es una clase propia definida en `globals.css` (no se instala `@tailwindcss/typography`: son 30 líneas de CSS y evita otra dependencia con su propia migración a v4).

```css
/* añadir a globals.css */
@layer components {
  .prose-idoneo { @apply text-[1.0625rem] leading-relaxed; }
  .prose-idoneo h2 { @apply mt-8 mb-3 font-titulo text-2xl font-semibold; }
  .prose-idoneo h3 { @apply mt-6 mb-2 font-titulo text-xl font-semibold; }
  .prose-idoneo p { @apply my-4; }
  .prose-idoneo ul { @apply my-4 list-disc space-y-1 pl-5; }
  .prose-idoneo ol { @apply my-4 list-decimal space-y-1 pl-5; }
  .prose-idoneo strong { @apply font-semibold text-foreground; }
  .prose-idoneo code { @apply rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]; }
  .prose-idoneo a { @apply text-primary underline underline-offset-2; }
  .prose-idoneo table { @apply w-full border-collapse text-sm; }
  .prose-idoneo th { @apply border-b-2 border-border px-3 py-2 text-left font-semibold; }
  .prose-idoneo td { @apply border-b border-border px-3 py-2 align-top; }
}
```

### 12.2 `<Dato>` y `<Formula>`

```tsx
// src/components/mdx/dato.tsx — Server Component
export function Dato({ etiqueta, valor, nota }: { etiqueta: string; valor: string; nota?: string }) {
  return (
    <span className="my-1 inline-flex flex-wrap items-baseline gap-x-2 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{etiqueta}</span>
      <span className="font-mono text-sm font-semibold text-foreground">{valor}</span>
      {nota ? <span className="text-xs text-muted-foreground">{nota}</span> : null}
    </span>
  );
}
```

```tsx
// src/components/mdx/formula.tsx — Server Component
export function Formula({ children, nota }: { children: React.ReactNode; nota?: string }) {
  return (
    <figure className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/50 px-4 py-3">
      <div className="whitespace-nowrap font-mono text-base">{children}</div>
      {nota ? <figcaption className="mt-2 text-xs text-muted-foreground">{nota}</figcaption> : null}
    </figure>
  );
}
```

### 12.3 `<TablaClave>` y `<Ojo>`

```tsx
// src/components/mdx/tabla-clave.tsx — Server Component
// Envuelve una tabla markdown. En MDX se escribe con líneas en blanco alrededor.
export function TablaClave({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <div className="my-6">
      {titulo ? (
        <p className="mb-2 font-titulo text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {titulo}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-border">{children}</div>
    </div>
  );
}
```

```tsx
// src/components/mdx/ojo.tsx — Server Component
import { Eye } from 'lucide-react';

export function Ojo({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-5 flex gap-3 rounded-lg border-l-4 border-aviso bg-aviso/10 p-4">
      <Eye className="mt-0.5 size-5 shrink-0 text-aviso" aria-hidden />
      <div className="text-sm [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        <p className="mb-1 font-semibold">Ojo con esto</p>
        {children}
      </div>
    </aside>
  );
}
```

```tsx
// src/components/mdx/componentes.tsx
import type { MDXComponents } from 'mdx/types';
import { Dato } from './dato';
import { Formula } from './formula';
import { Ojo } from './ojo';
import { TablaClave } from './tabla-clave';

export const componentesMdx: MDXComponents = {
  Dato,
  Formula,
  TablaClave,
  Ojo,
};
```

---

## 13. Componentes de ítem

Uno por tipo. Todos llevan `"use client"` y comparten el mismo contrato, de modo que el controlador de sesión no necesita saber con qué tipo está tratando.

```ts
// src/components/items/contrato.ts
import type { Item } from '@/lib/tipos';

export type ModoItem =
  | 'respondiendo'      // el usuario puede cambiar su respuesta
  | 'bloqueado'         // respondió, aún sin feedback (quiz, simulacro)
  | 'revision-correcta' // feedback: acertó
  | 'revision-incorrecta';

export interface PropsItem<T = unknown> {
  item: Item;
  valor: T | null;
  modo: ModoItem;
  onCambio: (valor: T) => void;
  /** Índice 1-based, para el aria-label y el encabezado. */
  numero: number;
  total: number;
}
```

Los cuatro estados por tipo:

| Tipo | Interacción | Estado de revisión |
|---|---|---|
| `unica`, `caso` | 4 botones grandes (`min-h-[52px]`), teclado 1–4 | Verde la correcta, roja la elegida si falló, resto neutro |
| `multiple` | 5 casillas, contador "elegiste 2 de 2" | Marca correctas no elegidas y elegidas incorrectas |
| `vf` | 2 botones grandes | Igual que única |
| `emparejar` | Selección en dos columnas: tocar izquierda → tocar derecha. Sin drag-and-drop (imposible en móvil con el pulgar) | Línea/insignia verde o roja por par |
| `ordenar` | Botones ↑ ↓ por elemento. Sin drag-and-drop, por la misma razón | Numera la posición correcta al lado de cada elemento |
| `calculo` | `<input type="text" inputMode="decimal">` + sufijo de unidad. **Acepta coma y punto decimal** | Muestra los `pasos` uno a uno |

**Reglas transversales:**

1. **Coma decimal.** Los usuarios escriben `126,2`. Normalizar siempre: `Number(texto.replace(',', '.'))`.
2. **Teclado.** En `unica`, `caso` y `vf`, las teclas `1`–`4` seleccionan y `Enter` avanza. Es lo que hace la app usable en escritorio a velocidad de estudio.
3. **`aria-live="polite"`** en el panel de retroalimentación; `role="group"` con `aria-labelledby` en el conjunto de opciones.
4. **Nunca deshabilitar visualmente lo elegido.** En modo `bloqueado` se mantiene el contraste: el usuario debe poder releer su respuesta.

```tsx
// src/components/items/opcion-unica.tsx  (patrón que replican los demás)
'use client';

import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropsItem } from './contrato';
import type { ItemCaso, ItemUnica } from '@/lib/tipos';

const LETRAS = ['A', 'B', 'C', 'D'] as const;

export function OpcionUnica({ item, valor, modo, onCambio, numero, total }: PropsItem<number>) {
  const datos = item as ItemUnica | ItemCaso;
  const revisando = modo === 'revision-correcta' || modo === 'revision-incorrecta';

  useEffect(() => {
    if (modo !== 'respondiendo') return;
    const alPulsar = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < datos.opciones.length) onCambio(i);
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [modo, datos.opciones.length, onCambio]);

  return (
    <div role="group" aria-label={`Pregunta ${numero} de ${total}`} className="space-y-2">
      {datos.opciones.map((texto, i) => {
        const elegida = valor === i;
        const esCorrecta = revisando && i === datos.correcta;
        const esFallo = revisando && elegida && i !== datos.correcta;

        return (
          <button
            key={i}
            type="button"
            disabled={modo !== 'respondiendo'}
            onClick={() => onCambio(i)}
            aria-pressed={elegida}
            className={cn(
              'flex w-full min-h-[52px] items-center gap-3 rounded-md border px-3 py-2.5 text-left text-[0.95rem] transition-colors duration-150',
              'disabled:cursor-default disabled:opacity-100',
              elegida && !revisando && 'border-primary bg-primary/10',
              !elegida && !revisando && 'border-border hover:bg-accent',
              esCorrecta && 'border-exito bg-exito/12',
              esFallo && 'border-destructive bg-destructive/12',
              revisando && !esCorrecta && !esFallo && 'border-border opacity-70',
            )}
          >
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded font-mono text-xs font-semibold',
                elegida && !revisando ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                esCorrecta && 'bg-exito text-exito-foreground',
                esFallo && 'bg-destructive text-destructive-foreground',
              )}
            >
              {esCorrecta ? <Check className="size-4" /> : esFallo ? <X className="size-4" /> : LETRAS[i]}
            </span>
            <span>{texto}</span>
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// src/components/items/envoltorio-item.tsx — despacha por tipo
'use client';

import type { PropsItem } from './contrato';
import { Calculo } from './calculo';
import { Caso } from './caso';
import { Emparejar } from './emparejar';
import { OpcionMultiple } from './opcion-multiple';
import { OpcionUnica } from './opcion-unica';
import { Ordenar } from './ordenar';
import { VerdaderoFalso } from './verdadero-falso';

export function EnvoltorioItem(props: PropsItem) {
  switch (props.item.tipo) {
    case 'unica':
      return <OpcionUnica {...(props as PropsItem<number>)} />;
    case 'caso':
      return <Caso {...(props as PropsItem<number>)} />;
    case 'multiple':
      return <OpcionMultiple {...(props as PropsItem<number[]>)} />;
    case 'vf':
      return <VerdaderoFalso {...(props as PropsItem<boolean>)} />;
    case 'emparejar':
      return <Emparejar {...(props as PropsItem<[number, number][]>)} />;
    case 'calculo':
      return <Calculo {...(props as PropsItem<number>)} />;
    case 'ordenar':
      return <Ordenar {...(props as PropsItem<number[]>)} />;
  }
}
```

El panel de retroalimentación (`retroalimentacion.tsx`) muestra, en este orden: veredicto del ítem → `explicacion` → `pasos` si es cálculo → `referencia` en pequeño. Esa referencia es lo que permite al usuario ir a verificar en la cartilla: no es decorativa.

---
## 14. Módulo piloto C5 — la plantilla de oro

Este es el módulo completo. **Los otros 28 se escriben replicando exactamente esta estructura, este tono y este nivel de exigencia.** Si un módulo nuevo no se parece a este, está mal hecho.

Qué define el estándar:
- La teoría **no resume la cartilla**: destila lo que cae, con los números exactos y las tablas que se preguntan.
- Cada ítem tiene una explicación de ≥200 caracteres con la estructura fija: *por qué la correcta lo es* → *por qué falla el distractor más tentador* → *dato para recordar*.
- Los distractores son conceptos del mismo campo semántico que se confunden en la práctica real.
- Las tarjetas cubren cada dato duro del módulo.

### 14.1 `content/teoria/c5-umbrales-zonas.mdx`

````mdx
Todo entrenador sabe decir "hoy toca suave" o "hoy toca fuerte". La diferencia entre un entrenador con criterio y uno sin él es poder decir **a qué porcentaje**, **qué adaptación busca** y **por qué esa y no otra**. Eso son las zonas de entrenamiento.

Las zonas se delimitan con dos referencias fisiológicas: el **umbral aeróbico (VT1)** y el **umbral anaeróbico (VT2)**. Entre ellos y alrededor de ellos se ordenan cuatro zonas de trabajo.

## Los dos umbrales

El **umbral aeróbico o primer umbral ventilatorio (VT1)** es la intensidad a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Por debajo de él, todo el esfuerzo se sostiene con metabolismo aeróbico y el lactato se mantiene en valores de reposo.

El **umbral anaeróbico o segundo umbral ventilatorio (VT2)** es la intensidad por encima de la cual el lactato se acumula más rápido de lo que el organismo lo elimina. Es el techo del esfuerzo sostenible: por encima, el reloj corre en contra.

<Ojo>
Los umbrales no son un interruptor. Son puntos de una curva continua. Que la cartilla los presente como rangos de porcentaje es una simplificación operativa, muy útil para prescribir, pero un deportista no "entra" en anaerobiosis al pasar del 84 % al 86 %.
</Ojo>

## Las cuatro zonas

<TablaClave titulo="Zonas de entrenamiento — la tabla que hay que saberse">

| Zona | % FCmáx / VO₂máx | Objetivo | Aeróbico / Anaeróbico | Sustrato dominante |
|---|---|---|---|---|
| **R0** | < 65 % | Calentamiento, recuperación activa, eliminación de desechos | — | — |
| **R1 · VT1** | 65–75 % | Eficiencia aeróbica, máxima oxidación de lípidos, ↑ IMTG | 99 % / 1 % | 20–40 % grasas · 60–80 % HC |
| **R2 · VT2** | 75–85 % VO₂máx · 80–90 % FCmáx | Oxidación del glucógeno, ↑ volemia, ↑ volumen sistólico, ↑ gasto cardíaco máximo. Contiene el **MLSS** | 95 % / 5 % | Casi exclusivamente hidratos de carbono |
| **R3 / R3+** | 90–95 % | Potencia aeróbica; ↑ densidad capilar y mitocondrial, ↑ enzimas oxidativas. Aquí van **HIIT y SIT** | 65 % / 35 % | Glucógeno |

</TablaClave>

<Ojo>
Fíjate en la fila de R2: **75–85 % está expresado en porcentaje del VO₂máx y 80–90 % en porcentaje de la FCmáx.** No son dos versiones contradictorias de la misma cifra, son dos escalas distintas. Es el error que más se cobra en el examen.
</Ojo>

### R0 — recuperación

Por debajo del 65 %. No busca adaptación: busca **retirar desechos metabólicos y facilitar la recuperación**. Es la zona del calentamiento, de la vuelta a la calma y de la sesión regenerativa del día después de competir. Prescribirla no es "perder el tiempo": es lo que permite que la sesión dura del día siguiente rinda.

### R1 — el umbral aeróbico (VT1)

Entre el 65 y el 75 %. Es la zona de la **máxima oxidación de lípidos**: la intensidad es lo bastante alta para movilizar ácidos grasos y lo bastante baja para que el aporte de oxígeno alcance a oxidarlos. Participación: <Dato etiqueta="R1" valor="99 % aeróbico / 1 % anaeróbico" />.

El sustrato se reparte entre <Dato etiqueta="grasas" valor="20–40 %" /> y <Dato etiqueta="hidratos" valor="60–80 %" />.

Su adaptación característica es el aumento de los **triglicéridos intramusculares (IMTG)**: depósitos de grasa dentro de la propia fibra muscular, que mejoran la disponibilidad de sustrato lipídico en esfuerzos largos. Es la zona del fondo largo del maratonista.

### R2 — el umbral anaeróbico (VT2)

75–85 % del VO₂máx, o 80–90 % de la FCmáx. Aquí el sustrato es **casi exclusivamente hidrato de carbono** y la participación anaeróbica sube al 5 %.

Es la zona donde vive el **MLSS (máximo estado estable de lactato)**: la intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo. Por encima del MLSS el lactato ya no se estabiliza, sube hasta obligar a parar.

Sus adaptaciones son cardiovasculares y centrales, y van las cuatro juntas: sube la volemia, sube el volumen sistólico, sube el gasto cardíaco máximo y **baja la frecuencia cardíaca en reposo**. La cadena es una sola: más sangre en circulación llena mejor el ventrículo, un ventrículo mejor llenado expulsa más sangre por latido, y con más sangre por latido el corazón mueve lo mismo con menos latidos.

Lo que **no** sube con el entrenamiento es la FCmáx. Es un techo que depende de la edad, no del estado de forma: lo que se entrena es cuánta sangre mueves en cada latido, no cuántos latidos alcanzas.

### R3 y R3+ — potencia aeróbica

90–95 %. La participación anaeróbica salta al 35 % y el sustrato es glucógeno. El objetivo es la **potencia aeróbica**: trabajar cerca del VO₂máx para elevarlo.

Sus adaptaciones son periféricas y enzimáticas: aumento de la densidad capilar, de la densidad mitocondrial y de la actividad de las enzimas oxidativas.

Aquí se ubican los dos métodos interválicos de moda:

- **HIIT** (*high intensity interval training*): series submáximas cercanas al VO₂máx con recuperaciones incompletas.
- **SIT** (*sprint interval training*): repeticiones muy cortas a intensidad máxima o supramáxima con recuperaciones largas.

<Ojo>
El SIT parece trabajo de sprint, y sin embargo se clasifica en R3+ junto al HIIT. La razón es el **objetivo adaptativo**, no la sensación: la repetición del estímulo con recuperaciones largas lleva el consumo de oxígeno cerca del VO₂máx sesión tras sesión. No lo confundas con el trabajo del sistema fosfágeno.
</Ojo>

Y ya que sale el sistema fosfágeno, conviene tener claro cuánto dura, porque es el otro extremo de la escala. Sostiene el esfuerzo máximo entre <Dato etiqueta="sistema fosfágeno" valor="5–15 s" /> y ese rango es un rango de verdad, no un número redondeado a la fuerza: dónde caiga tu deportista depende de la intensidad real a la que trabaje y de cuánta fosfocreatina tenga acumulada ese día. Un velocista descansado y con depósitos llenos se acerca a los 15 s; el mismo velocista en la cuarta repetición, con las reservas a medias, se apaga antes de los 10.

Eso es distinto del **ATP libre**, el que ya está en la fibra listo para gastarse sin regenerar nada: ese alcanza para <Dato etiqueta="ATP libre" valor="2–3 s" /> y se agota casi al arrancar. La fosfocreatina es la que estira esos 2–3 s hasta el rango de 5–15.

## La VAM

La **velocidad aeróbica máxima (VAM)** es la velocidad de desplazamiento más baja a la que ya se alcanza el VO₂máx. Sirve para prescribir intervalos en porcentaje de velocidad en lugar de en porcentaje de frecuencia cardíaca, que responde con retraso en esfuerzos cortos.

<Formula nota="Ejemplo: VAM de 18 km/h al 90 % → 16,2 km/h = 270 m/min. Una repetición de 3 min recorre 810 m.">
distancia = VAM × %prescrito × tiempo
</Formula>

## Los cuatro modelos de distribución de la intensidad

Saberse las zonas no basta: el examen pregunta **cómo se reparte el volumen entre ellas a lo largo de la semana**.

<TablaClave titulo="Modelos de distribución">

| Modelo | Cómo reparte el volumen |
|---|---|
| **Baja intensidad / alto volumen** | Alrededor del 90 % del volumen por debajo del VT1 |
| **Alta intensidad / bajo volumen** | Prioriza el trabajo por encima del VT2, con volumen total reducido |
| **Entre umbrales** | Concentra el trabajo en la zona intermedia entre VT1 y VT2 (el clásico *tempo*, la "zona 2" del lenguaje de gimnasio) |
| **Polarizado** | Mucho volumen por debajo de VT1 y el resto por encima de VT2, **evitando deliberadamente la zona intermedia** |

</TablaClave>

La diferencia entre "entre umbrales" y "polarizado" es exactamente la contraria: el primero vive en la zona intermedia, el segundo la evita. Si el examen pregunta cuál "evita la zona 2", la respuesta es polarizado.

## Cómo prescribir en la práctica

1. Estima la FCmáx con la fórmula que corresponda a la población (Fox, Astrand, Tanaka, Gellish o Gulati — ver el módulo C2).
2. Multiplica por el porcentaje de la zona objetivo.
3. Verifica con la sensación y, si puedes, con lactato o con la prueba de hablar.

<Formula nota="Fox para 40 años: FCmáx = 220 − 40 = 180 lpm. Límite inferior de R1: 180 × 0,65 = 117 lpm.">
FC objetivo = FCmáx × % de la zona
</Formula>

## Lo mínimo que tienes que llevarte

- Los cuatro rangos de porcentaje, de memoria.
- Que R2 se expresa **75–85 % en VO₂máx** y **80–90 % en FCmáx**.
- Que el MLSS está en R2, no en R1.
- Que la máxima oxidación de grasas es R1, no R0.
- Que HIIT y SIT van en R3/R3+.
- Que el modelo polarizado es el que **evita** la zona intermedia.
- Que con el entrenamiento de resistencia **baja la FC en reposo** y **suben** volemia, volumen sistólico y gasto cardíaco máximo. La FCmáx no se mueve.
- Que el sistema fosfágeno da **5–15 s** y el ATP libre solo **2–3 s**.
````

> **Nota para quien escriba los otros 28 módulos:** el archivo MDX **no lleva un `# Título`** de primer nivel — el título, el subtítulo y los objetivos los renderiza la página desde `content/estructura.ts`. Empezar el MDX con `#` duplicaría el encabezado.
>
> **El contenido enseña el dato verdadero (ADR-014).** La teoría afirma lo cierto y punto: sin recuadros de errata, sin «la cartilla dice», sin comparar versiones. Donde el material oficial se equivoque, se enseña lo correcto **sin anunciar la discrepancia** — la app no documenta los errores de las cartillas en ningún sitio. Antes de escribir un módulo, lee `.claude/CONTENIDO.md`: recoge la investigación ya verificada para los puntos donde la cartilla falla, y volver a derivarlos del material fuente reintroduce el error.

### 14.2 `content/tarjetas/c5-umbrales-zonas.ts` — 15 tarjetas

```ts
// content/tarjetas/c5-umbrales-zonas.ts
import type { Tarjeta } from '@/lib/tipos';

export const TARJETAS_MODULO: Tarjeta[] = [
  {
    id: 'C5-T01',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es un umbral en el entrenamiento de resistencia?',
    reverso:
      'Una intensidad de referencia a partir de la cual cambia el comportamiento fisiológico del organismo. Los dos que se usan para zonificar son VT1 (umbral aeróbico) y VT2 (umbral anaeróbico).',
  },
  {
    id: 'C5-T02',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R0: porcentaje y objetivo',
    reverso:
      'Por debajo del 65 %. Calentamiento, recuperación activa y eliminación de desechos metabólicos. No busca adaptación, busca recuperación.',
  },
  {
    id: 'C5-T03',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R1 (VT1): porcentaje, objetivo y sustrato',
    reverso:
      '65–75 %. Eficiencia aeróbica y máxima oxidación de lípidos; aumenta los IMTG. Participación 99 % aeróbica / 1 % anaeróbica. Sustrato: 20–40 % grasas y 60–80 % hidratos.',
  },
  {
    id: 'C5-T04',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R2 (VT2): porcentaje, objetivo y sustrato',
    reverso:
      '75–85 % del VO₂máx · 80–90 % de la FCmáx. Oxidación del glucógeno; aumenta volemia, volumen sistólico y gasto cardíaco máximo. Contiene el MLSS. Participación 95 % / 5 %. Sustrato: casi exclusivamente hidratos.',
  },
  {
    id: 'C5-T05',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Zona R3 / R3+: porcentaje, objetivo y sustrato',
    reverso:
      '90–95 %. Potencia aeróbica; aumenta densidad capilar, densidad mitocondrial y enzimas oxidativas. Participación 65 % aeróbica / 35 % anaeróbica. Sustrato: glucógeno. Aquí van HIIT y SIT.',
  },
  {
    id: 'C5-T06',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué marca el VT1 (umbral aeróbico)?',
    reverso:
      'La intensidad a partir de la cual la ventilación empieza a crecer más rápido que el consumo de oxígeno. Por debajo, el lactato se mantiene en valores de reposo.',
  },
  {
    id: 'C5-T07',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué marca el VT2 (umbral anaeróbico)?',
    reverso:
      'La intensidad por encima de la cual el lactato se acumula más rápido de lo que se elimina. Es el techo del esfuerzo sostenible en el tiempo.',
  },
  {
    id: 'C5-T08',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es el MLSS y en qué zona está?',
    reverso:
      'Máximo estado estable de lactato: la intensidad más alta a la que el lactato en sangre se mantiene constante en el tiempo. Está en R2, en el entorno del VT2 — nunca en R1.',
  },
  {
    id: 'C5-T09',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'Sustrato dominante por zona',
    reverso:
      'R1 → mezcla con máxima participación de grasas (20–40 %). R2 → casi exclusivamente hidratos de carbono. R3 → glucógeno. A más intensidad, más peso del hidrato.',
  },
  {
    id: 'C5-T10',
    modulo: 'c5-umbrales-zonas',
    tipo: 'dato',
    frente: 'Participación aeróbica / anaeróbica por zona',
    reverso: 'R1: 99 % / 1 %. R2: 95 % / 5 %. R3: 65 % / 35 %.',
  },
  {
    id: 'C5-T11',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué son los IMTG y qué zona los aumenta?',
    reverso:
      'Triglicéridos intramusculares: depósitos de grasa dentro de la fibra muscular. El trabajo continuo en R1 los aumenta y mejora la disponibilidad de sustrato lipídico en esfuerzos largos.',
  },
  {
    id: 'C5-T12',
    modulo: 'c5-umbrales-zonas',
    tipo: 'definicion',
    frente: '¿Qué es la VAM?',
    reverso:
      'Velocidad aeróbica máxima: la velocidad más baja a la que ya se alcanza el VO₂máx. Permite prescribir intervalos en porcentaje de velocidad en vez de porcentaje de frecuencia cardíaca.',
  },
  {
    id: 'C5-T13',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'Los 4 modelos de distribución de la intensidad',
    reverso:
      '1) Baja intensidad / alto volumen: ~90 % por debajo de VT1. 2) Alta intensidad / bajo volumen: prioriza por encima de VT2. 3) Entre umbrales: concentra en la zona intermedia (tempo). 4) Polarizado: mucho por debajo de VT1 y el resto por encima de VT2, EVITANDO la zona intermedia.',
  },
  {
    id: 'C5-T14',
    modulo: 'c5-umbrales-zonas',
    tipo: 'clasificacion',
    frente: 'HIIT y SIT: qué son y dónde se ubican',
    reverso:
      'HIIT: series submáximas cerca del VO₂máx con recuperación incompleta. SIT: repeticiones muy cortas a intensidad máxima con recuperación larga. Los dos se ubican en R3/R3+ porque su objetivo adaptativo es la potencia aeróbica.',
  },
  {
    id: 'C5-T15',
    modulo: 'c5-umbrales-zonas',
    tipo: 'formula',
    frente: '¿Cómo se calcula la frecuencia objetivo de una zona?',
    reverso:
      'FC objetivo = FCmáx × % de la zona. Ejemplo con Fox a los 40 años: FCmáx = 220 − 40 = 180 lpm; límite inferior de R1 (65 %) = 180 × 0,65 = 117 lpm.',
  },
];
```

### 14.3 `content/banco/c5-umbrales-zonas.ts` — 28 ítems, los 7 tipos

> **Corrección — ADR-006.** El código de esta sección trae **25** ítems, pero C5 es del
> bloque C, que exige **28** (§14.4 y el entregable del paso 16). Desde ADR-005 el validador
> lo enforza, así que con 25 el build **rompe** al voltear C5 a `'completo'`. Hay que escribir
> tres ítems más, y su nivel **no es libre**: al pasar de 25 a 28 los umbrales de
> `verificarCuotas` se mueven y recuerdo pasa a exigir 12 (no 11) y comprensión 9 (no 8).
>
> | Id | Nivel | Dificultad | Tipo |
> |---|---|---|---|
> | `C5-026` | recuerdo | 1 | única |
> | `C5-027` | comprensión | 2 | múltiple |
> | `C5-028` | aplicación | 3 | cálculo |
>
> Reparto final: **12 recuerdo · 9 comprensión · 7 aplicación** (42,9 / 32,1 / 25,0 %).
> Reetiquetar uno de los tres no sirve: recuerdo volvería a 11/28 y el build rompe igual.

La tabla siguiente verifica los **25 ítems escritos abajo** contra las cuotas de §5.4:

| Dimensión | Reparto | Regla | ✓ |
|---|---|---|---|
| Nivel | 11 recuerdo (44 %) · 8 comprensión (32 %) · 6 aplicación (24 %) | ≥40 / ≥30 / ≥20 % | sí |
| Dificultad | 7 de nivel 1 · 11 de nivel 2 · 7 de nivel 3 | ≥3 de cada uno | sí |
| Tipos | 13 única · 3 caso · 3 cálculo · 2 múltiple · 2 emparejar · 1 ordenar · 1 V/F | ≥4 tipos distintos | sí |

```ts
// content/banco/c5-umbrales-zonas.ts
// Módulo piloto. PLANTILLA DE ORO para los otros 28 módulos.
import type { Item } from '@/lib/tipos';

export const ITEMS: Item[] = [
  {
    id: 'C5-001',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es el objetivo del trabajo en la zona R0?',
    opciones: [
      'Calentamiento, recuperación activa y eliminación de desechos metabólicos',
      'Optimizar la oxidación de las grasas como sustrato principal',
      'Aumentar la tolerancia a la acumulación de lactato',
      'Desarrollar la potencia aeróbica máxima',
    ],
    correcta: 0,
    explicacion:
      'R0 es la zona por debajo del 65 %: no busca adaptación, busca recuperación. Se usa en el calentamiento, en la vuelta a la calma y en la sesión regenerativa del día siguiente a competir. El distractor más tentador es la oxidación de grasas, que corresponde a R1 (65–75 %): mucha gente asume que "más suave = más grasa", pero la máxima oxidación de lípidos exige una intensidad mínima que R0 no alcanza. Dato para recordar: R0 no entrena, prepara y recupera.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['R0', 'recuperación activa', 'zonas'],
  },
  {
    id: 'C5-002',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿En qué rango porcentual se ubica la zona R1, correspondiente al umbral aeróbico o VT1?',
    opciones: ['65–75 %', 'Por debajo del 65 %', '80–90 %', '90–95 %'],
    correcta: 0,
    explicacion:
      'R1 corresponde al umbral aeróbico (VT1) y se ubica entre el 65 y el 75 %. Los tres distractores son los rangos de las otras tres zonas: por debajo del 65 % es R0, el 80–90 % de la FCmáx es R2 y el 90–95 % es R3. El error más común es confundir R1 con R0 porque las dos se perciben como "suaves"; la diferencia es que R1 sí produce adaptación aeróbica y R0 no. Dato para recordar: R1 es la zona del fondo largo del maratonista.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'VT1', 'umbral aeróbico'],
  },
  {
    id: 'C5-003',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Cuál es el sustrato energético dominante en el trabajo de zona R3?',
    opciones: [
      'El glucógeno',
      'Los triglicéridos intramusculares',
      'Los ácidos grasos libres del tejido adiposo',
      'La fosfocreatina muscular',
    ],
    correcta: 0,
    explicacion:
      'En R3 (90–95 %) el sustrato dominante es el glucógeno: la intensidad es demasiado alta para que la oxidación de lípidos, que es un proceso lento, aporte energía al ritmo requerido. Los triglicéridos intramusculares son el distractor más tentador porque son grasa dentro del músculo, pero su uso es característico de R1, no de R3. La fosfocreatina cubre esfuerzos máximos de segundos, no series de minutos cerca del VO₂máx. Dato para recordar: a más intensidad, más peso del hidrato de carbono.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['R3', 'glucógeno', 'sustrato'],
  },
  {
    id: 'C5-004',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'vf',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado:
      'El máximo estado estable de lactato (MLSS) se ubica dentro de la zona R1, por debajo del umbral aeróbico.',
    correcta: false,
    explicacion:
      'Falso. El MLSS está en R2, en el entorno del umbral anaeróbico (VT2), no en R1. Es la intensidad más alta a la que el lactato en sangre se mantiene constante en el tiempo; por debajo del VT1 el lactato ni siquiera se eleva sobre los valores de reposo, así que hablar de "estado estable máximo" ahí no tiene sentido. La confusión nace de asociar "estable" con "suave". Dato para recordar: MLSS y VT2 viven en la misma vecindad, en R2.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['MLSS', 'R2', 'VT2'],
  },
  {
    id: 'C5-005',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado:
      '¿Cuál es la participación aeróbica y anaeróbica aproximada del trabajo realizado en la zona R2?',
    opciones: ['95 % aeróbico / 5 % anaeróbico', '99 % aeróbico / 1 % anaeróbico', '80 % aeróbico / 20 % anaeróbico', '65 % aeróbico / 35 % anaeróbico'],
    correcta: 0,
    explicacion:
      'En R2 la participación es de 95 % aeróbica y 5 % anaeróbica. El distractor más tentador es 99 % / 1 %, que corresponde a R1: la diferencia parece mínima pero marca el paso del trabajo puramente aeróbico al trabajo que ya genera lactato de forma apreciable. El 65 % / 35 % corresponde a R3. Dato para recordar: la serie de participación anaeróbica sube 1 % → 5 % → 35 % al pasar de R1 a R2 y a R3; el salto grande está entre R2 y R3.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'participación aeróbica', 'VT2'],
  },
  {
    id: 'C5-006',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada zona de entrenamiento con su objetivo principal.',
    izquierda: ['R0', 'R1 (VT1)', 'R2 (VT2)', 'R3'],
    derecha: [
      'Recuperación activa y eliminación de desechos metabólicos',
      'Eficiencia aeróbica y máxima oxidación de lípidos',
      'Oxidación del glucógeno y mejora de las adaptaciones cardíacas centrales',
      'Potencia aeróbica: densidad capilar, mitocondrial y enzimas oxidativas',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'La confusión más frecuente es intercambiar R1 y R2: se asume que "quemar grasa" es lo mismo que "trabajo aeróbico duro", cuando la máxima oxidación de lípidos ocurre en R1 y R2 pasa a depender casi exclusivamente del hidrato de carbono. La otra confusión es asignar a R0 alguna adaptación: R0 no adapta nada, solo facilita la recuperación. Dato para recordar: la progresión de objetivos es recuperar → oxidar grasa → oxidar glucógeno → elevar el techo aeróbico.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['zonas', 'objetivos', 'clasificación'],
  },
  {
    id: 'C5-007',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un fondista entrena de forma continua al 70 % de su VO₂máx. ¿Qué adaptación busca prioritariamente ese trabajo?',
    opciones: [
      'Optimizar la oxidación de grasas y aumentar los triglicéridos intramusculares',
      'Aumentar la tolerancia al lactato por encima del MLSS',
      'Incrementar la potencia aeróbica máxima trabajando cerca del VO₂máx',
      'Reponer los depósitos de fosfocreatina tras esfuerzos explosivos',
    ],
    correcta: 0,
    explicacion:
      'El 70 % del VO₂máx cae en R1, la zona del umbral aeróbico (VT1), donde el uso de lípidos como sustrato es máximo. El entrenamiento continuo en esta intensidad mejora la eficiencia aeróbica y aumenta el depósito de triglicéridos intramusculares (IMTG). La opción de tolerancia al lactato corresponde a R2 (75–85 % del VO₂máx), y la de potencia aeróbica a R3 (90–95 %). La fosfocreatina no es la vía dominante en trabajo continuo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'VT1', 'umbral aeróbico', 'IMTG'],
  },
  {
    id: 'C5-008',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      'Un entrenador anota que la zona R2 va del 75 al 85 % y otro que va del 80 al 90 %. Ninguno se equivocó. ¿Cómo se explica la diferencia?',
    opciones: [
      'El primer rango está expresado en porcentaje del VO₂máx y el segundo en porcentaje de la FCmáx',
      'El primer rango corresponde al umbral aeróbico y el segundo al umbral anaeróbico',
      'El primer rango se aplica a deportistas entrenados y el segundo a personas sedentarias',
      'El segundo rango incluye parte de la zona R3 dentro del cálculo',
    ],
    correcta: 0,
    explicacion:
      'R2 se expresa como 75–85 % del VO₂máx y como 80–90 % de la FCmáx: son dos escalas distintas para la misma zona, no dos versiones en conflicto. La frecuencia cardíaca y el consumo de oxígeno no crecen en paralelo perfecto, así que un mismo esfuerzo ocupa posiciones distintas en cada escala. El distractor de "entrenados vs sedentarios" es tentador porque sí existen diferencias individuales, pero no explican este par concreto de rangos. Dato para recordar: antes de aplicar un porcentaje, pregunta siempre porcentaje de qué.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'FCmáx', 'VO₂máx', 'prescripción'],
  },
  {
    id: 'C5-009',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿En qué zona de entrenamiento se ubican el HIIT y el SIT?',
    opciones: ['R3 / R3+', 'R0', 'R1', 'R2'],
    correcta: 0,
    explicacion:
      'La cartilla ubica tanto el HIIT como el SIT en R3/R3+ (90–95 %), la zona de la potencia aeróbica. El distractor más tentador es R2, porque el trabajo interválico duro "se siente" como un esfuerzo sostenido de umbral; la diferencia está en que el HIIT busca acercarse al VO₂máx, no sostenerse por debajo del MLSS. Dato para recordar: R2 es el techo de lo sostenible, R3 es donde se rompe ese techo a intervalos.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['HIIT', 'SIT', 'R3'],
  },
  {
    id: 'C5-010',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Seleccione las DOS adaptaciones que corresponden al trabajo en la zona R3.',
    opciones: [
      'Aumento de la densidad capilar',
      'Aumento de la densidad mitocondrial y de la actividad de las enzimas oxidativas',
      'Aumento de los triglicéridos intramusculares',
      'Aumento de la volemia y del volumen sistólico',
      'Eliminación acelerada de desechos metabólicos tras el esfuerzo',
    ],
    correctas: [0, 1],
    explicacion:
      'R3 produce adaptaciones periféricas y enzimáticas: más capilares, más mitocondrias y más actividad de las enzimas oxidativas, que son las que permiten elevar el VO₂máx. Los tres distractores son adaptaciones reales pero de otras zonas: los IMTG corresponden a R1, la volemia y el volumen sistólico a R2, y la eliminación de desechos a R0. Ese es justamente el patrón que hay que dominar. Dato para recordar: R2 adapta el centro (el corazón), R3 adapta la periferia (el músculo).',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['R3', 'adaptaciones', 'densidad mitocondrial'],
  },
  {
    id: 'C5-011',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 1,
    enunciado:
      'Un entrenador de 40 años quiere trabajar en el límite inferior de la zona R1, es decir al 65 % de su frecuencia cardíaca máxima. Calcule esa frecuencia usando la fórmula de Fox et al. (1971).',
    respuesta: 117,
    tolerancia: 1,
    unidad: 'lpm',
    pasos: [
      'Fox et al. (1971): FCmáx = 220 − edad',
      'FCmáx = 220 − 40 = 180 lpm',
      'Límite inferior de R1 = 65 % de la FCmáx',
      'FC objetivo = 180 × 0,65 = 117 lpm',
    ],
    explicacion:
      'La fórmula de Fox es la más conocida y la más simple: 220 menos la edad. El error habitual es aplicar el porcentaje sobre la frecuencia de reserva en lugar de sobre la FCmáx: eso sería el método de Karvonen y daría un valor distinto, más alto. Aquí el enunciado pide explícitamente porcentaje de la FCmáx. Dato para recordar: 65 % de la FCmáx es el piso de R1 y a la vez el techo de R0.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Tabla 2',
    etiquetas: ['FCmáx', 'Fox', 'R1', 'prescripción'],
  },
  {
    id: 'C5-012',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 2,
    enunciado:
      '¿Qué distingue al modelo de distribución polarizado del modelo "entre umbrales"?',
    opciones: [
      'El polarizado concentra el volumen por debajo del VT1 y el resto por encima del VT2, evitando la zona intermedia',
      'El polarizado reparte el volumen de forma pareja entre las cuatro zonas de entrenamiento',
      'El polarizado concentra el trabajo justamente en la zona situada entre VT1 y VT2',
      'El polarizado prioriza el volumen total sobre la intensidad en todas las sesiones',
    ],
    correcta: 0,
    explicacion:
      'El modelo polarizado evita deliberadamente la zona intermedia: mucho volumen por debajo de VT1 y el resto por encima de VT2. El distractor más tentador es el tercero, que describe exactamente el modelo contrario ("entre umbrales", el clásico trabajo de tempo): son opuestos, y el examen los presenta juntos precisamente por eso. El cuarto describe el modelo de baja intensidad y alto volumen. Dato para recordar: si la pregunta dice "evita la zona 2", la respuesta es polarizado.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['polarizado', 'entre umbrales', 'distribución'],
  },
  {
    id: 'C5-013',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 2,
    viñeta:
      'Una corredora prepara su primer maratón. Su entrenador le programa cinco sesiones semanales, todas a un ritmo exigente en el que ella solo puede decir frases cortas. A las tres semanas llega fatigada a cada sesión y no logra completar los fondos largos. El objetivo declarado del bloque era mejorar el uso de las grasas como combustible.',
    enunciado: '¿Qué ajuste corresponde hacer al plan?',
    opciones: [
      'Bajar la mayoría de las sesiones a R1, la zona donde la oxidación de lípidos es máxima',
      'Subir las sesiones a R3 para elevar la potencia aeróbica y así mejorar el uso de grasas',
      'Mantener la intensidad pero reducir el número de sesiones semanales a tres',
      'Cambiar los fondos largos por series cortas a intensidad máxima con recuperación completa',
    ],
    correcta: 0,
    explicacion:
      'El ritmo descrito, en el que solo caben frases cortas, es propio de R2. Si el objetivo del bloque es mejorar la oxidación de lípidos, la zona correcta es R1 (65–75 %), donde el aporte de grasa como sustrato alcanza su máximo y la fatiga acumulada es baja. El distractor más tentador es reducir el número de sesiones manteniendo la intensidad: resolvería la fatiga pero no el objetivo, porque en R2 el sustrato sigue siendo casi exclusivamente hidrato de carbono. Dato para recordar: el problema no era el volumen, era la zona.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'prescripción', 'oxidación de lípidos', 'fondo'],
  },
  {
    id: 'C5-014',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: '¿Qué describe el máximo estado estable de lactato (MLSS)?',
    opciones: [
      'La intensidad más alta a la que la concentración de lactato en sangre se mantiene constante en el tiempo',
      'La concentración de lactato que se alcanza al final de un esfuerzo máximo',
      'La intensidad a la que el lactato en sangre vuelve a los valores de reposo tras el esfuerzo',
      'La cantidad de lactato que el hígado puede reconvertir en glucosa por minuto',
    ],
    correcta: 0,
    explicacion:
      'El MLSS es una intensidad, no una concentración: la más alta a la que producción y eliminación de lactato se equilibran y la cifra en sangre deja de subir. El distractor más tentador es el segundo, que confunde el MLSS con el lactato pico de un test máximo; ese valor puede ser muy alto y no dice nada sobre sostenibilidad. Dato para recordar: MLSS responde a "hasta dónde puedo sostener", no a "cuánto lactato tengo".',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['MLSS', 'lactato', 'VT2'],
  },
  {
    id: 'C5-015',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'ordenar',
    nivel: 'comprension',
    dificultad: 2,
    enunciado: 'Ordene las siguientes intensidades de trabajo de menor a mayor.',
    elementos: [
      'R0 — por debajo del 65 %: recuperación activa y eliminación de desechos',
      'R1 (VT1) — 65–75 %: máxima oxidación de lípidos',
      'R2 (VT2) — 80–90 % de la FCmáx: contiene el MLSS',
      'R3 — 90–95 %: potencia aeróbica, HIIT y SIT',
      'Esfuerzo supramáximo — por encima del VO₂máx: predominio anaeróbico',
    ],
    ordenCorrecto: [0, 1, 2, 3, 4],
    explicacion:
      'La secuencia de intensidad es R0 → R1 → R2 → R3 → supramáximo. El punto que más se confunde es la posición de R2 respecto a R1: como R2 se expresa a veces en porcentaje del VO₂máx (75–85 %) y R1 en porcentaje de la FCmáx, hay quien los cruza al compararlos sin fijarse en la escala. Otro error es colocar el trabajo supramáximo dentro de R3: R3 es potencia aeróbica, por encima ya no se sostiene el consumo de oxígeno. Dato para recordar: la participación anaeróbica crece 1 %, 5 %, 35 % a lo largo de la escala.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6 — Zonas de entrenamiento',
    etiquetas: ['zonas', 'intensidad', 'secuencia'],
  },
  {
    id: 'C5-016',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: '¿Por qué la zona R1 es donde la oxidación de lípidos alcanza su máximo?',
    opciones: [
      'Porque la intensidad basta para movilizar ácidos grasos y sigue siendo baja para que el oxígeno disponible alcance a oxidarlos',
      'Porque a esa intensidad el músculo agota primero el glucógeno y se ve obligado a recurrir a la grasa',
      'Porque por debajo del 65 % los ácidos grasos no se pueden movilizar desde el tejido adiposo',
      'Porque la producción de lactato bloquea la entrada de glucosa a la fibra muscular',
    ],
    correcta: 0,
    explicacion:
      'La oxidación de grasas requiere oxígeno y es un proceso lento. En R1 se cumplen las dos condiciones: la intensidad es suficiente para movilizar ácidos grasos y todavía lo bastante baja para que el aporte de oxígeno cubra su oxidación. Por encima, el sistema recurre al hidrato porque produce ATP más rápido. El distractor del agotamiento de glucógeno es tentador porque describe algo real en esfuerzos de varias horas, pero no explica por qué la grasa domina desde el minuto uno en R1. Dato para recordar: en R1 la grasa aporta 20–40 % y el hidrato 60–80 %.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.1 — Umbral Ventilatorio 1',
    etiquetas: ['R1', 'oxidación de lípidos', 'sustrato'],
  },
  {
    id: 'C5-017',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 2,
    enunciado:
      'Un futbolista de 28 años debe trabajar en el límite superior de la zona R2, es decir al 90 % de su frecuencia cardíaca máxima. Calcule esa frecuencia usando la fórmula de Tanaka et al. (2001).',
    respuesta: 169.6,
    tolerancia: 0.6,
    unidad: 'lpm',
    pasos: [
      'Tanaka et al. (2001): FCmáx = 208 − (0,7 × edad)',
      'FCmáx = 208 − (0,7 × 28) = 208 − 19,6 = 188,4 lpm',
      'Límite superior de R2 = 90 % de la FCmáx',
      'FC objetivo = 188,4 × 0,90 = 169,56 ≈ 169,6 lpm',
    ],
    explicacion:
      'Tanaka se validó en hombres y mujeres sanos y da valores más altos que Fox a partir de los 40 años, más bajos antes. Aquí el error más frecuente es aplicar Fox por costumbre: 220 − 28 = 192, y el 90 % daría 172,8 lpm, tres latidos por encima. Tres latidos parecen poco, pero en el límite superior de R2 marcan la diferencia entre sostener la serie y romperla. Dato para recordar: cada fórmula tiene autor y población; usa la que pida el enunciado.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.1 — Tabla 2',
    etiquetas: ['FCmáx', 'Tanaka', 'R2', 'prescripción'],
  },
  {
    id: 'C5-018',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'emparejar',
    nivel: 'recuerdo',
    dificultad: 2,
    enunciado: 'Relacione cada modelo de distribución de la intensidad con su descripción.',
    izquierda: [
      'Baja intensidad / alto volumen',
      'Alta intensidad / bajo volumen',
      'Entre umbrales',
      'Polarizado',
    ],
    derecha: [
      'Cerca del 90 % del volumen por debajo del VT1',
      'Prioriza el trabajo por encima del VT2 con volumen total reducido',
      'Concentra el trabajo en la zona intermedia entre VT1 y VT2',
      'Mucho volumen bajo VT1 y el resto sobre VT2, evitando la zona intermedia',
    ],
    pares: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explicacion:
      'El par que más se falla es "entre umbrales" con "polarizado": son estrategias opuestas respecto a la misma zona. El modelo entre umbrales vive en la zona intermedia; el polarizado la evita a propósito. También se confunde "baja intensidad / alto volumen" con "polarizado", porque los dos acumulan mucho volumen suave; la diferencia es que el polarizado añade deliberadamente trabajo por encima del VT2. Dato para recordar: los cuatro modelos se distinguen por qué hacen con la zona intermedia.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['modelos de distribución', 'polarizado', 'clasificación'],
  },
  {
    id: 'C5-019',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'El trabajo sostenido en R2 se asocia con aumento de la volemia, del volumen sistólico y del gasto cardíaco máximo. ¿Qué explica que esas tres adaptaciones aparezcan juntas?',
    opciones: [
      'Más volumen de sangre permite un mayor llenado ventricular, que eleva el volumen sistólico y con él el gasto cardíaco máximo',
      'El aumento del gasto cardíaco máximo obliga al corazón a hipertrofiarse, y esa hipertrofia eleva la volemia',
      'La acumulación de lactato estimula la producción de glóbulos rojos, lo que eleva directamente el volumen sistólico',
      'El entrenamiento eleva la frecuencia cardíaca máxima y esta arrastra al gasto cardíaco y al volumen sistólico',
    ],
    correcta: 0,
    explicacion:
      'La cadena va del volumen de sangre al llenado ventricular, de ahí al volumen sistólico y finalmente al gasto cardíaco máximo, que es el producto de frecuencia por volumen sistólico. El distractor más tentador es el último, porque suena razonable que "el corazón entrenado llegue más alto": en realidad la frecuencia cardíaca máxima no aumenta con el entrenamiento, es la frecuencia de reposo la que baja. Dato para recordar: con entrenamiento de resistencia baja la FC de reposo y suben el volumen sistólico y el gasto cardíaco máximo.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['R2', 'volumen sistólico', 'gasto cardíaco', 'adaptaciones'],
  },
  {
    id: 'C5-020',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'aplicacion',
    dificultad: 3,
    viñeta:
      'Un ciclista de fondo entrena 12 horas semanales. Su entrenador quiere pasarlo a un modelo polarizado. Actualmente reparte el volumen así: 3 h en R1, 8 h en la zona intermedia entre VT1 y VT2, y 1 h en R3.',
    enunciado: '¿Qué reparto semanal es coherente con el modelo polarizado?',
    opciones: [
      'Alrededor de 9,5 h por debajo de VT1 y 2,5 h por encima de VT2, sin trabajo en la zona intermedia',
      'Alrededor de 6 h por debajo de VT1, 4 h en la zona intermedia y 2 h por encima de VT2',
      'Reducir el volumen total a 6 h y concentrarlas todas por encima del VT2',
      'Mantener las 12 h repartidas por igual entre las cuatro zonas de entrenamiento',
    ],
    correcta: 0,
    explicacion:
      'El modelo polarizado concentra la mayor parte del volumen por debajo del VT1 y destina el resto a trabajo por encima del VT2, dejando vacía la zona intermedia. La primera opción hace exactamente eso. El distractor más tentador es el segundo reparto, que sí aumenta el volumen suave pero conserva 4 h en la zona intermedia: eso ya no es polarizado, es una distribución piramidal. La tercera opción describe el modelo de alta intensidad y bajo volumen. Dato para recordar: lo que define al polarizado es lo que NO tiene, no lo que tiene.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['polarizado', 'distribución', 'planificación'],
  },
  {
    id: 'C5-021',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'recuerdo',
    dificultad: 1,
    enunciado: '¿Qué es la velocidad aeróbica máxima (VAM)?',
    opciones: [
      'La velocidad de desplazamiento más baja a la que ya se alcanza el VO₂máx',
      'La velocidad máxima que un deportista puede sostener durante una hora',
      'La velocidad a la que se sitúa el umbral aeróbico o VT1',
      'La velocidad punta alcanzada en un sprint de 30 metros lanzados',
    ],
    correcta: 0,
    explicacion:
      'La VAM es la velocidad más baja a la que ya se alcanza el consumo máximo de oxígeno. Sirve para prescribir intervalos en porcentaje de velocidad, más práctico que el porcentaje de frecuencia cardíaca en esfuerzos cortos, donde la FC responde con retraso. El distractor más tentador es "la velocidad sostenible durante una hora", que corresponde aproximadamente al umbral anaeróbico, no a la VAM. Dato para recordar: VAM es el punto donde se toca el techo aeróbico, no donde se sostiene.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.5 — Velocidad aeróbica máxima',
    etiquetas: ['VAM', 'VO₂máx', 'prescripción'],
  },
  {
    id: 'C5-022',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'multiple',
    nivel: 'comprension',
    dificultad: 3,
    enunciado: 'Seleccione las TRES afirmaciones correctas sobre los umbrales ventilatorios.',
    opciones: [
      'El VT1 marca el punto en que la ventilación empieza a crecer más rápido que el consumo de oxígeno',
      'Por encima del VT2 el lactato se acumula más rápido de lo que el organismo lo elimina',
      'El MLSS se sitúa en el entorno del VT2',
      'En deportistas entrenados el VT2 se ubica por debajo del VT1',
      'Por debajo del VT1 el sustrato dominante es el glucógeno muscular',
    ],
    correctas: [0, 1, 2],
    explicacion:
      'Las tres primeras describen correctamente el comportamiento de los umbrales. La cuarta invierte el orden: el VT2 siempre está por encima del VT1, en cualquier nivel de entrenamiento; lo que cambia con el entrenamiento es a qué porcentaje del VO₂máx aparecen, no su orden. La quinta confunde las zonas: por debajo del VT1 el aporte de grasas es máximo, y es en R2, por encima del VT1, donde el hidrato pasa a ser casi exclusivo. Dato para recordar: VT1 siempre antes que VT2; el MLSS acompaña al VT2.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.2 — Umbral Ventilatorio 2',
    etiquetas: ['VT1', 'VT2', 'MLSS', 'umbrales'],
  },
  {
    id: 'C5-023',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'calculo',
    nivel: 'aplicacion',
    dificultad: 3,
    enunciado:
      'Una corredora tiene una velocidad aeróbica máxima (VAM) de 18 km/h. El plan indica repeticiones de 3 minutos al 90 % de su VAM. ¿Qué distancia recorre en cada repetición?',
    respuesta: 810,
    tolerancia: 10,
    unidad: 'm',
    pasos: [
      'Velocidad de trabajo = 90 % de la VAM = 18 × 0,90 = 16,2 km/h',
      'Convertir a metros por minuto: 16,2 km/h = 16 200 m / 60 min = 270 m/min',
      'Distancia = velocidad × tiempo = 270 m/min × 3 min',
      'Distancia = 810 m',
    ],
    explicacion:
      'El paso que más se falla es la conversión de km/h a m/min: hay que multiplicar por 1000 y dividir entre 60, no dividir entre 3,6 (eso da m/s, y con 4,5 m/s × 180 s se llega igual a 810 m, pero mezclando unidades es fácil equivocarse). Prescribir en porcentaje de VAM tiene la ventaja de que la distancia sale directamente, sin esperar a que la frecuencia cardíaca se estabilice. Dato para recordar: al 100 % de VAM, 1 minuto equivale a la VAM en km/h dividida entre 0,06 metros.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.5 — Velocidad aeróbica máxima',
    etiquetas: ['VAM', 'cálculo', 'intervalos'],
  },
  {
    id: 'C5-024',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'unica',
    nivel: 'comprension',
    dificultad: 3,
    enunciado:
      'El SIT emplea repeticiones muy cortas a intensidad máxima, y sin embargo se ubica junto al HIIT en el trabajo de R3/R3+. ¿Cuál es la razón?',
    opciones: [
      'Su objetivo adaptativo es la potencia aeróbica: la repetición del estímulo con recuperaciones largas lleva el consumo de oxígeno cerca del VO₂máx',
      'Cada repetición se sostiene con el sistema anaeróbico aláctico, que también forma parte del metabolismo aeróbico',
      'Durante el sprint la frecuencia cardíaca se mantiene entre el 65 y el 75 % de la máxima',
      'El sustrato dominante durante cada sprint son los triglicéridos intramusculares',
    ],
    correcta: 0,
    explicacion:
      'Las zonas se definen por el objetivo adaptativo, no por la sensación del esfuerzo aislado. Aunque cada repetición de SIT sea supramáxima, la sesión completa acumula tiempo cerca del VO₂máx y produce las adaptaciones propias de R3: densidad capilar, densidad mitocondrial y enzimas oxidativas. El distractor más tentador afirma que el sistema aláctico forma parte del metabolismo aeróbico, lo cual es falso: es anaeróbico por definición. Dato para recordar: clasifica por adaptación buscada, no por cuánto duele la repetición.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.3 — Zona R3',
    etiquetas: ['SIT', 'HIIT', 'R3', 'potencia aeróbica'],
  },
  {
    id: 'C5-025',
    modulo: 'c5-umbrales-zonas',
    bloque: 'C',
    tipo: 'caso',
    nivel: 'comprension',
    dificultad: 3,
    viñeta:
      'Un corredor de 5000 m lleva ocho meses entrenando casi todas las sesiones a un ritmo cómodamente duro, entre su VT1 y su VT2. Ha mejorado en los primeros meses pero lleva doce semanas estancado en la misma marca, y llega a las series de calidad sin frescura.',
    enunciado: '¿Qué explica mejor el estancamiento desde el punto de vista de la distribución de la intensidad?',
    opciones: [
      'Acumula fatiga suficiente para comprometer las sesiones duras, pero no estímulo suficiente para elevar el techo aeróbico',
      'Trabaja por debajo del VT1, de modo que el estímulo es demasiado suave para producir adaptación',
      'La zona intermedia impide por completo la oxidación de grasas y agota las reservas de glucógeno',
      'Al no superar nunca el 65 % de su FCmáx no llega a activar las adaptaciones cardiovasculares',
    ],
    correcta: 0,
    explicacion:
      'Vivir en la zona intermedia deja al deportista en la peor combinación posible: acumula fatiga como si entrenara duro, pero no llega a la intensidad que eleva el VO₂máx ni descansa lo suficiente para asimilar. Es justamente el problema que el modelo polarizado busca resolver. Los otros tres distractores describen mal el escenario: el corredor no trabaja bajo el VT1 ni por debajo del 65 %, y la oxidación de grasas se reduce en esa zona pero no se anula. Dato para recordar: entre umbrales es una zona útil, no un lugar donde vivir.',
    referencia: 'Cartilla 3, Tema 2, Subtema 2.6.4 — Modelos de distribución',
    etiquetas: ['entre umbrales', 'polarizado', 'estancamiento', 'distribución'],
  },
];
```

### 14.4 Cómo replicar esto en los otros 28 módulos

Checklist obligatoria antes de marcar `estadoContenido: 'completo'`:

1. `content/teoria/<slug>.mdx` escrito, sin `#` de primer nivel, con al menos una `<TablaClave>` y el cierre "Lo mínimo que tienes que llevarte".
2. `content/tarjetas/<slug>.ts` con ≥12 tarjetas cubriendo **todos** los datos duros del módulo que aparezcan en `content/datos-duros.ts`.
3. `content/banco/<slug>.ts` con ≥25 ítems (28 en el bloque C) que pasen `verificarCuotas`.
4. Los `conceptosClave` del módulo añadidos a `content/glosario.ts`.
5. Registros añadidos en `content/banco/indice.ts` y `content/tarjetas/indice.ts`.
6. `npm run validar` en verde.
7. Fila actualizada en `.claude/CONTENIDO.md`.

Reglas de redacción, no negociables:

**Del enunciado.** Se entiende sin leer las opciones. Nada de "¿cuál de las siguientes afirmaciones es correcta?" sin contexto. Las negaciones se evitan; si son inevitables van en **negrita**. Sin pistas gramaticales: el artículo o el género del enunciado no debe delatar la correcta. Lenguaje de entrenador de campo, no de académico.

**De los distractores.** Los tres son plausibles: conceptos del mismo campo semántico que se confunden en la práctica. Longitud pareja — la correcta nunca puede ser la más larga y detallada. Cada distractor corresponde a un error real de quien estudió a medias. Prohibido "todas las anteriores" y "ninguna de las anteriores".

**De la explicación.** Estructura fija: *por qué la correcta lo es* → *por qué falla el distractor más tentador* → *dato para recordar*. Mínimo 200 caracteres. Cita cartilla y subtema en `referencia`, que es el mapa del temario. El cuerpo de la explicación **no habla de las cartillas**: enseña el dato verdadero (ADR-014).

**Orden de producción** (por densidad de retorno, no alfabético): C5 → bloque D completo → resto del bloque C → bloque B → bloque A. Un bloque temático por sesión de Claude Code, nunca módulos sueltos de bloques distintos: mantiene el tono y el criterio de dificultad consistentes.

---
## 15. Extras de v1

Dos rutas que no estaban en el brief original y que entran en v1 porque cuestan poco y sostienen el uso de la app **después** del examen — que es lo que hace que un amigo la recomiende.

### 15.1 `/herramientas` — calculadora médico-deportiva

Funciones puras en `src/lib/calculos.ts` (sin `"use client"`), UI en `src/components/herramientas/calculadora.tsx` (con `"use client"`).

```ts
// src/lib/calculos.ts
// Todas las fórmulas del examen, en un solo lugar. Puras y testeables.

export type AutorFCmax = 'fox' | 'astrand' | 'tanaka' | 'gellish' | 'gulati';

export const FORMULAS_FCMAX: Record<
  AutorFCmax,
  { etiqueta: string; poblacion: string; calcular: (edad: number) => number }
> = {
  fox: { etiqueta: 'Fox et al. (1971)', poblacion: 'General', calcular: (e) => 220 - e },
  astrand: { etiqueta: 'Astrand (1952)', poblacion: 'General', calcular: (e) => 216.6 - 0.84 * e },
  tanaka: { etiqueta: 'Tanaka et al. (2001)', poblacion: 'Hombres y mujeres sanos', calcular: (e) => 208 - 0.7 * e },
  gellish: { etiqueta: 'Gellish et al. (2007)', poblacion: 'Adultos activos', calcular: (e) => 207 - 0.7 * e },
  gulati: { etiqueta: 'Gulati et al. (2010)', poblacion: 'Mujeres asintomáticas de mediana edad', calcular: (e) => 206 - 0.88 * e },
};

export function fcReserva(fcMax: number, fcReposo: number): number {
  return fcMax - fcReposo;
}

/** Método de Karvonen: FC objetivo = FCR + (FC de reserva × intensidad). */
export function karvonen(fcMax: number, fcReposo: number, intensidad: number): number {
  return fcReposo + fcReserva(fcMax, fcReposo) * intensidad;
}

export interface ZonaCalculada {
  zona: 'R0' | 'R1' | 'R2' | 'R3';
  etiqueta: string;
  desde: number;
  hasta: number;
}

/** Zonas en lpm a partir de la FCmáx, con los rangos de porcentaje de FC. */
export function zonasEnLpm(fcMax: number): ZonaCalculada[] {
  const p = (x: number) => Math.round(fcMax * x);
  return [
    { zona: 'R0', etiqueta: 'Recuperación · <65 %', desde: 0, hasta: p(0.65) },
    { zona: 'R1', etiqueta: 'Umbral aeróbico (VT1) · 65–75 %', desde: p(0.65), hasta: p(0.75) },
    { zona: 'R2', etiqueta: 'Umbral anaeróbico (VT2) · 80–90 %', desde: p(0.8), hasta: p(0.9) },
    { zona: 'R3', etiqueta: 'Potencia aeróbica · 90–95 %', desde: p(0.9), hasta: p(0.95) },
  ];
}

export function gastoCardiaco(fc: number, volumenSistolicoMl: number): number {
  return (fc * volumenSistolicoMl) / 1000; // litros por minuto
}

export function densidad(trabajoSeg: number, descansoSeg: number): number {
  const total = trabajoSeg + descansoSeg;
  return total === 0 ? 0 : trabajoSeg / total;
}

export const ML_KG_MIN_POR_MET = 3.5;

export function metsDesdeVo2(vo2MlKgMin: number): number {
  return vo2MlKgMin / ML_KG_MIN_POR_MET;
}

export function vo2DesdeMets(mets: number): number {
  return mets * ML_KG_MIN_POR_MET;
}

export function imc(pesoKg: number, estaturaM: number): number {
  return estaturaM === 0 ? 0 : pesoKg / (estaturaM * estaturaM);
}

export function indiceCinturaCadera(cinturaCm: number, caderaCm: number): number {
  return caderaCm === 0 ? 0 : cinturaCm / caderaCm;
}

/** Convierte una toma de pulso a latidos por minuto. */
export function pulsoALpm(latidos: number, segundos: 6 | 10 | 15 | 30): number {
  return latidos * (60 / segundos);
}
```

La UI son cinco pestañas: **FC y zonas · Cardio · Carga · MET y VO₂ · Antropometría**. Cada resultado muestra la fórmula usada debajo del número, en `font-mono`: la calculadora también enseña.

**Regla:** cada valor calculado enlaza al módulo donde se explica (`/modulos/c2-cardiovascular`, etc.). La herramienta es una puerta de entrada al estudio, no un atajo para no estudiar.

### 15.2 `/ultima-noche` — modo víspera

Vista de solo datos duros, sin teoría, para el día anterior al examen. Lee `content/datos-duros.ts`, agrupa por `categoria` y presenta cada dato como tarjeta rápida (concepto → valor) con un control de "ocultar valores" para autoevaluarse.

- Filtro por categoría y por bloque.
- **No registra progreso ni alimenta el SRS.** Es una vista de consulta: meter esto en la cola de repaso la víspera del examen sería contraproducente.
- Botón "Modo repaso": recorre los datos de la categoría uno a uno, valor oculto, con "lo sabía / no lo sabía" — solo como contador de sesión, sin persistir.

---

## 16. PWA y offline — Serwist

```bash
npm i @serwist/next serwist
```

```ts
// next.config.ts
import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // En desarrollo el service worker estorba: cachea lo que acabas de cambiar.
  disable: process.env.NODE_ENV === 'development',
});

const config: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
};

export default withSerwist(config);
```

```ts
// src/app/sw.ts
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
```

```ts
// src/app/manifest.ts  — Server Component
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Idóneo 2210 — Evaluación de Idoneidad del Entrenador Deportivo',
    short_name: 'Idóneo 2210',
    description:
      '29 módulos, simulacros cronometrados y repaso espaciado para aprobar la Evaluación de Idoneidad (Ley 2210 de 2022).',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfd',
    theme_color: '#1f4f80',
    lang: 'es-CO',
    orientation: 'portrait',
    icons: [
      { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icono-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

Añadir a `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "types": ["@serwist/next/typings"]
  },
  "exclude": ["node_modules", "public/sw.js"]
}
```

Y a `.gitignore`: `public/sw.js` y `public/swe-worker-*.js`.

**Qué queda cacheado:** todo el bundle (que incluye el banco de ítems y las tarjetas, porque son módulos JS) y las páginas visitadas. La teoría MDX se renderiza en el servidor, así que el HTML de un módulo queda en caché tras la primera visita. Un usuario que recorra la ruta con datos una vez podrá repasarla completa sin conexión.

**Aviso de instalación:** `src/components/pwa/aviso-instalar.tsx` escucha `beforeinstallprompt`, y aparece una sola vez, al tercer día de racha. No al primer segundo: mostrar un banner de instalación antes de que la app haya demostrado algo es la forma más rápida de que lo cierren para siempre.

---

## 17. Plan de build — 18 pasos

**Instrucción para el agente constructor:** sigue los pasos en orden. No saltes ninguno. Cada paso termina con la app corriendo sin errores (`npm run dev` y `npm run build` en verde) y una entrada en `.claude/BITACORA.md`. Si tomas una decisión que otro desarrollador cuestionaría, regístrala en `.claude/ARQUITECTURA.md`.

**Punto de corte usable: paso 14.** Ahí la app ya sirve para estudiar un módulo completo y hacer simulacros. Los pasos 15–17 son producción de contenido y se pueden repartir en sesiones separadas.

---

### Paso 1 — Andamiaje

```bash
npx create-next-app@latest idoneo-2210 \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-turbopack

cd idoneo-2210

# VERIFICAR Tailwind v4 antes de seguir (ver §2.1)
node -e "const p=require('./package.json');console.log('tailwind:',p.devDependencies?.tailwindcss||p.dependencies?.tailwindcss)"
# Si no es ^4.x:
#   npm rm tailwindcss postcss autoprefixer
#   npm i -D tailwindcss@latest @tailwindcss/postcss@latest
# Y borrar tailwind.config.* si existe.

npm i next-mdx-remote remark-gfm zod@^3.25.0 recharts lucide-react next-themes \
  clsx tailwind-merge class-variance-authority
npm i -D tsx vitest @types/node tw-animate-css

npx shadcn@latest init      # New York · neutral · CSS variables
npx shadcn@latest add button card badge progress separator tabs dialog sheet \
  alert input label switch select skeleton scroll-area sonner accordion tooltip

mkdir -p content/{banco,tarjetas,teoria} scripts \
  src/components/{layout,mdx,items,sesion,informe,inicio,modulo,glosario,herramientas,ultima-noche,progreso,ajustes,pwa} \
  src/hooks src/lib/__tests__ .claude
```

`package.json` — scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "npm run validar",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "validar": "tsx scripts/validar-banco.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

`.claude/settings.json`:

```json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Bash(npx:*)", "Bash(mkdir:*)", "Read", "Write", "Edit", "Glob", "Grep"]
  }
}
```

Crear `.claude/BITACORA.md`, `.claude/ARQUITECTURA.md` y `.claude/CONTENIDO.md` con los encabezados de §23. Copiar a `ARQUITECTURA.md` la tabla de §2.2 de este blueprint.

**Licencia (obligatorio en este paso, no al final):**

1. Crear `LICENSE` en la raíz con el **texto completo** del *legal code* de Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional, descargado de la fuente oficial:

```bash
curl -sL https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt -o LICENSE
# Si el curl falla, copiar el texto desde
# https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.es
# NO redactar un resumen propio: la licencia es el texto completo o no es nada.
```

2. Añadir al `package.json` — npm reconoce el identificador SPDX:

```json
"license": "CC-BY-NC-SA-4.0",
"private": true,
```

`"private": true` bloquea una publicación accidental a npm y es coherente con la cláusula NoComercial.

3. Registrar el ADR en `.claude/ARQUITECTURA.md` con el formato de §23:

> **ADR-001 — La app no puede monetizarse nunca.** El material fuente (4 cartillas de COLEF/COCED) es CC BY-NC-SA 4.0. La cláusula NC prohíbe el uso comercial de la obra derivada, y la cláusula SA obliga a licenciarla igual. Consecuencia: cualquier v2 de pago, plan premium o publicidad es ilegal sin reescribir el contenido desde fuentes propias o sin permiso expreso de COLEF y COCED. La ausencia de pagos en §24 no es solo una decisión de producto: es una restricción de licencia.

**Entregable:** `npm run dev` levanta. Tailwind v4 confirmado. shadcn/ui funcionando. Estructura de carpetas y `.claude/` creados. `LICENSE` en la raíz con el texto completo de CC BY-NC-SA 4.0 y ADR-001 escrito.

---

### Paso 2 — Tipos y esquemas

1. `src/lib/tipos.ts` — copiar §4 **completo**, sin omitir nada.
2. `src/lib/esquemas.ts` — copiar §5 completo.
3. `src/lib/fechas.ts` — copiar §7.1.
4. `src/lib/utils.ts` — copiar §11.4.
5. `vitest.config.ts` con alias `@` → `src`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

6. Tests: `src/lib/__tests__/esquemas.test.ts` — un ítem válido de cada uno de los 7 tipos pasa; un ítem con explicación de 100 caracteres falla; `verificarCuotas` detecta un módulo con 100 % recuerdo.

**Entregable:** `npm run typecheck` y `npm test` en verde. Cero `any`.

---

### Paso 3 — Validador de banco

1. `scripts/validar-banco.ts` — copiar §8.
2. Crear `content/estructura.ts`, `content/glosario.ts`, `content/datos-duros.ts` y `content/blueprint-examen.ts` **vacíos pero con la forma correcta** (arrays vacíos y exports nombrados) para que el validador compile. Se llenan en el paso 6.
3. Verificar que `npm run validar` corre y que `npm run build` lo dispara mediante `prebuild`.
4. Prueba de fuego: mete a mano un ítem con `explicacion` de 50 caracteres y confirma que `npm run build` **falla**. Bórralo después.

**Entregable:** el build falla ante un ítem inválido. Registrar la prueba en `BITACORA.md`.

---

### Paso 4 — Almacenamiento

1. `src/lib/almacenamiento.ts` — copiar §6.
2. `src/hooks/usar-estado.ts` — copiar §6.1.
3. Tests `src/lib/__tests__/almacenamiento.test.ts`: `migrar` con un objeto sin versión devuelve estado inicial; `migrar` con un estado válido lo conserva; `importarJSON` rechaza un JSON con `version: 2`; `tocarRacha` suma 1 si el último día fue ayer y reinicia a 1 si fue anteayer.

**Entregable:** `npm test` en verde. Cero referencias a `window` fuera de una guarda.

---

### Paso 5 — Layout y navegación

1. `src/app/globals.css` — copiar §11.3 **entero**. Verificar que `bg-bloque-c` genera color.
2. `src/app/layout.tsx` — copiar §11.2.
3. `src/components/layout/proveedores.tsx` (`"use client"`): `ThemeProvider` de next-themes (`attribute="class"`, `defaultTheme="system"`) + `<Toaster />` de sonner.
4. `src/components/layout/shell.tsx` (Server): contenedor `max-w-3xl`, barra superior con título de sección, `<Pie />` tras `{children}`, y el hueco de la nav en móvil. Ver el extracto de cableado en §11.7.
5. `src/components/layout/nav-inferior.tsx` (`"use client"`): 5 destinos — Inicio, Módulos, Repaso, Simulacros, Ajustes. `usePathname` para el activo. `h-16` + área segura.
6. `src/components/layout/barra-lateral.tsx` (`"use client"`): visible desde `lg`, 240 px.
7. `src/components/layout/interruptor-tema.tsx`.
8. `src/components/layout/pie.tsx` (Server) — copiar §11.7 **literal**. Es la atribución a COLEF y COCED que exige la licencia CC BY-NC-SA 4.0 del material fuente. No es decorativo y no se deja para el paso 18.
9. `src/app/error.tsx` y `src/app/not-found.tsx`.

**Entregable:** app navegable con rutas vacías, tema claro/oscuro sin flash, barra inferior utilizable con el pulgar a 375 px, y la atribución a COLEF/COCED visible al final de cada ruta, con contraste AA también en modo oscuro.

---

### Paso 6 — Datos de bloques y módulos

1. `content/estructura.ts` — copiar §9.1 completo (4 bloques, 29 módulos).
2. `content/blueprint-examen.ts` — copiar §9.2.
3. `content/datos-duros.ts` — copiar §9.4.
4. `content/glosario.ts` — copiar §9.5.
5. `content/banco/indice.ts` y `content/tarjetas/indice.ts` — copiar §9.6 (con el registro de C5 comentado hasta el paso 8).
6. `src/app/bloques/[bloqueId]/page.tsx` y una ruta `/modulos` de índice: listado de los 29 módulos agrupados por bloque, con el color de bloque y una insignia "En preparación" en los 28 pendientes.

**Entregable:** `npm run validar` en verde con 29 módulos declarados y 0 ítems. Los 4 bloques navegables con su color.

---

### Paso 7 — Renderizado MDX

1. `src/lib/contenido.ts` — copiar §9.7.
2. `src/components/mdx/` — copiar §12 completo: `renderizador.tsx`, `dato.tsx`, `formula.tsx`, `tabla-clave.tsx`, `ojo.tsx`, `componentes.tsx`.
3. Añadir la clase `.prose-idoneo` a `globals.css`.
4. `src/app/modulos/[slug]/page.tsx` (Server, con `await params`): encabezado desde `estructura.ts` (título, subtítulo, objetivos, minutos, prerequisitos), teoría MDX si existe, y estado vacío honesto si `leerTeoria` devuelve `null`.

**Entregable:** una ruta de módulo renderiza MDX con los 4 componentes personalizados.

---

### Paso 8 — Módulo piloto C5 (contenido + etapas 1 y 2)

1. `content/teoria/c5-umbrales-zonas.mdx` — copiar §14.1.
2. `content/tarjetas/c5-umbrales-zonas.ts` — copiar §14.2 (15 tarjetas).
3. `content/banco/c5-umbrales-zonas.ts` — copiar §14.3 y **escribir 3 ítems más hasta 28**: el bloque C exige 28 y el reparto por nivel queda forzado en 12 recuerdo / 9 comprensión / 7 aplicación. Ver **ADR-006** y `.claude/PENDIENTES.md`.
4. Registrar C5 en los dos índices de `content/*/indice.ts`.
5. Cambiar `estadoContenido` de `c5-umbrales-zonas` a `'completo'` en `estructura.ts`.
6. `src/components/modulo/etapas-modulo.tsx` (`"use client"`): las 4 etapas con su estado leído de `useEstado()`; esqueleto mientras el estado es `null`.
7. `src/components/modulo/marcador-lectura.tsx` (`"use client"`): `IntersectionObserver` sobre un centinela al final; marca `teoriaLeida`.
8. `src/app/modulos/[slug]/tarjetas/page.tsx` + `src/components/modulo/mazo-tarjetas.tsx` (`"use client"`): tarjeta con frente/reverso, "la sabía / no la sabía", contador. Al terminar registra `tarjetasVistas` y encola las tarjetas en el SRS (la cola se activa en el paso 10).

> **Dependencia declarada:** las etapas 3 y 4 (práctica y quiz) necesitan los componentes de ítem del paso 9. Este paso deja C5 con contenido completo, validado, y las etapas 1 y 2 funcionando de punta a punta.

**Entregable:** `npm run validar` en verde con 28 ítems y 15 tarjetas. C5 legible y con tarjetas. `CONTENIDO.md` actualizado.

---

### Paso 9 — Componentes de ítem

1. `src/components/items/contrato.ts` — copiar §13.
2. Los 7 componentes + `envoltorio-item.tsx` + `retroalimentacion.tsx`.
3. `src/hooks/usar-sesion.ts` (`"use client"`): máquina de estado de una tanda — índice actual, respuestas, marcadas, avanzar, retroceder, enviar.
4. `src/components/sesion/controlador-sesion.tsx` (`"use client"`): recibe `blueprint` e `items` como props y sirve para práctica, quiz, diagnóstico y los dos simulacros. `feedbackInmediato` decide si se muestra la retroalimentación tras cada ítem.
5. Cerrar las etapas 3 y 4 de C5: `src/app/modulos/[slug]/practica/page.tsx` y `.../quiz/page.tsx`.
6. Tests `src/lib/__tests__/simulacro.test.ts`: `calificar` para los 7 tipos, incluyendo respuesta malformada (`null`, string, array corto) → `false` sin lanzar.

**Entregable:** los 4 estados de cada tipo de ítem funcionando. C5 jugable de punta a punta. `npm test` en verde.

---

### Paso 10 — Motor SRS y `/repaso`

1. `src/lib/srs.ts` — copiar §7.2.
2. `src/app/repaso/page.tsx` + `src/components/sesion/controlador-repaso.tsx` (`"use client"`).
3. Conectar: al ver una tarjeta y al fallar un ítem en práctica, quiz o simulacro, entra a la cola.
4. Estado vacío honesto cuando `colaDelDia` devuelve `[]`.
5. Tests `src/lib/__tests__/srs.test.ts`: fallar reinicia repeticiones y baja EF sin bajar de 1,3; tres aciertos dan intervalos 1, 3 y `round(3 × EF)`; `colaDelDia` respeta el límite de 30 y prioriza las más atrasadas; `encolar` no reinicia un elemento existente.

**Entregable:** `/repaso` funcional con las tarjetas y errores de C5. `npm test` en verde.

---

### Paso 11 — Motor de simulacro, cronómetro y auto-envío

1. `src/lib/simulacro.ts` — copiar §7.3.
2. `src/lib/cronometro.ts` — copiar §7.4. `src/hooks/usar-cronometro.ts` — copiar el hook.
3. `src/components/sesion/cronometro-visual.tsx` (`"use client"`): `font-mono`, cambia a `text-aviso` a los 10 min y a `text-destructive` a los 2 min. Muestra `--:--` mientras `restantesSeg` es `null`.
4. `src/components/sesion/panel-navegacion.tsx` (`"use client"`): cuadrícula de ítems con los tres estados. Scroll horizontal en móvil.
5. `src/components/sesion/dialogo-reanudar.tsx` (`"use client"`): al montar `/simulacros/*`, si hay `SesionCronometro` guardada ofrece continuar mostrando el tiempo restante real, o empezar de nuevo.
6. `src/app/simulacros/page.tsx`, `.../bloque/[bloqueId]/page.tsx`, `.../final/page.tsx`. La carga del banco ocurre en el handler del botón "Empezar" (`await cargarBancoCompleto()`), nunca al montar.
7. Persistir la sesión tras **cada** respuesta, no cada 30 s.
8. Tests `src/lib/__tests__/simulacro.test.ts` (ampliar) y `cronometro.test.ts`:
   - `crearRng(42)` produce la misma secuencia en dos llamadas.
   - `armarSimulacro` con la misma semilla devuelve los mismos ids en el mismo orden.
   - `armarSimulacro` no repite ítems y respeta el reparto por módulo cuando hay banco suficiente.
   - `presentarItem` + `calificar` son consistentes para los 7 tipos: barajar y luego responder el índice correcto devuelve `true`.
   - `restantes` con una sesión iniciada hace 10 min y 120 min de duración devuelve 6600.
   - `avisoPendiente` devuelve 600 y no 1200 cuando quedan 9 minutos y ninguno se mostró.

**Entregable:** simulacro final completo. Recargar a mitad no regala tiempo. Auto-envío al llegar a cero. Avisos a 20, 10 y 2 minutos.

---

### Paso 12 — Motor de informe y `/resultados/[intentoId]`

1. `src/lib/informe.ts` — copiar §7.5.
2. `src/app/resultados/[intentoId]/page.tsx` (Server, `await params`) + `src/components/informe/vista-informe.tsx` (`"use client"`).
3. `barras-dominio.tsx` con recharts, usando `--color-chart-1..4`. Contenedor responsive, altura fija, sin animación de entrada.
4. `temas-prioritarios.tsx`: top-5 con botón **"Estudiar esto"** que lleva a `/modulos/[slug]`.
5. `revision-items.tsx`: ítem por ítem con la respuesta dada, la correcta, la `explicacion` y la `referencia`.
6. Mostrar `NOTA_VEREDICTO` bajo el veredicto. No es opcional: la app no puede insinuar que sus cortes son los de COLEF.
7. `src/app/progreso/page.tsx`: dominio por bloque y módulo, historial de intentos.
8. Tests `src/lib/__tests__/informe.test.ts`: `calcularVeredicto` en los cuatro tramos y en las fronteras 59/60/74/75/84/85; `temasPrioritarios` excluye módulos con menos de 3 ítems; `detectarPatrones` devuelve el mensaje de aplicación cuando recuerdo 90 % y aplicación 40 %, y `[]` cuando no hay patrón.

**Entregable:** informe completo tras un simulacro. Gráficas legibles a 375 px.

---

### Paso 13 — Diagnóstico y plan

1. `src/app/diagnostico/page.tsx`: usa `DIAGNOSTICO` y el controlador de sesión. Al terminar guarda el intento, marca `diagnosticoHecho` y redirige a `/plan`.
2. `src/lib/plan.ts` — copiar §7.6.
3. `src/app/plan/page.tsx` + `src/components/plan/vista-plan.tsx` (`"use client"`): pide la fecha de examen si falta, agenda por días, marca el día de hoy, muestra las advertencias.
4. Conectar `tareasDeHoy` con la tarjeta "Continuar donde ibas" de la portada.
5. Tests `src/lib/__tests__/plan.test.ts`: nunca coloca un módulo antes que su prerequisito; reserva los 3 últimos días; con 5 días para 29 módulos emite advertencia y no revienta; con el examen hoy devuelve el plan de un solo día.

**Entregable:** flujo completo de usuario nuevo — diagnóstico → plan → primer módulo.

---

### Paso 14 — Esqueleto de los 28 módulos restantes · **punto de corte usable**

1. Verificar que todas las rutas de módulo funcionan para los 28 en preparación: `/modulos/[slug]`, `/tarjetas`, `/practica`, `/quiz`.
2. Estado vacío honesto en cada una: *"Contenido en preparación. Este módulo estará listo pronto — mientras tanto, C5 ya está completo."* con enlace a un módulo disponible. **Nunca una pantalla en blanco ni un crash.**
3. Verificar que el simulacro final se arma sin reventar cuando la mayoría de módulos no tiene ítems (el relleno de `armarSimulacro` cubre el caso) y que el aviso del validador lo explica.
4. `src/app/page.tsx` (Inicio) completo: continuar donde ibas, racha, resumen de progreso, cola de repaso pendiente, acceso al diagnóstico si no se ha hecho.
5. Prueba manual del recorrido completo en un dispositivo real.

**Entregable:** la app es usable de punta a punta con C5. Se puede desplegar y compartir. `BITACORA.md` con el hito.

---

### Paso 15 — Contenido del bloque D (8 módulos)

Los 8 módulos de Entrenamiento Deportivo, siguiendo la checklist de §14.4. Se empieza por D porque es el bloque más denso en datos memorizables y el más cercano al oficio del usuario: engancha.

Orden: D2 (carga) → D3 → D4 → D5 → D6 → D7 → D8 → D1.

**Entregable:** 8 módulos `completo`. `npm run validar` en verde. `CONTENIDO.md` con 9 filas completas.

---

### Paso 16 — Contenido del resto del bloque C (8 módulos)

C1, C2, C3, C4, C6, C7, C8, C9. Es el bloque de mayor peso en el examen (33 %) y el que más ítems de `calculo` admite: C2 y C3 concentran las fórmulas.

**Entregable:** bloque C completo (9/9 módulos, ≥28 ítems cada uno).

---

### Paso 17 — Contenido de los bloques A y B (12 módulos)

Bloque B primero (22 %, muy nominal: ideal para `emparejar` y `caso`), luego bloque A (20 %, el más "escolar" y el más rápido de producir por la cantidad de tablas directas).

**Entregable:** los 29 módulos en `completo`. Banco de ~750 ítems. `npm run validar` en verde sin avisos de blueprint.

---

### Paso 18 — Extras, PWA y salida

**18.1 · PWA.** Serwist según §16. Iconos 192, 512 y maskable. `manifest.ts`. Probar instalación en Android y en iOS.

**18.2 · `/glosario`.** Buscador cliente con `buscarGlosario` (§9.5). Sin librería de búsqueda. Filtro por bloque, enlace "Ver módulo" en cada entrada.

**18.3 · `/herramientas`.** Calculadora de §15.1 con sus tests unitarios en `src/lib/__tests__/calculos.test.ts` (FCmáx por las 5 fórmulas, densidad 45/15 = 75 %, MET ↔ ml/kg/min, IMC).

**18.4 · `/ultima-noche`.** Modo víspera de §15.2.

**18.5 · `/ajustes`.** Nombre, fecha de examen, tema, sonido. Exportar JSON (descarga con `nombreArchivoRespaldo`), importar con validación Zod y confirmación explícita antes de sobrescribir, reiniciar todo con doble confirmación. Recordatorio de respaldo según `necesitaRespaldo`.

**18.7 · SEO mínimo.** Metadata completa y OG solo en `/`. `robots: { index: false }` en el resto. `src/app/robots.ts` permitiendo solo la portada.

**18.8 · Deploy.** `vercel` → `vercel --prod`. Cero variables de entorno. Verificar que el build en Vercel dispara `prebuild` y que el validador corre allí.

**18.9 · `README.md` con la atribución.** El `LICENSE` se creó en el paso 1; aquí se escribe el README. La sección de licencia y atribución **no es opcional**: es la segunda obligación BY de §1 · Licencia y atribución. Estructura mínima:

```markdown
# Idóneo 2210

Preparación para la Evaluación de Idoneidad del Entrenador Deportivo en Colombia
(Ley 2210 de 2022 · COLEF / COCED). 29 módulos, ~750 ítems, simulacros
cronometrados y repaso espaciado. PWA instalable, funciona sin conexión.

Sin backend, sin cuentas, sin registro: todo el progreso vive en el navegador y se
respalda con exportar/importar JSON.

## Cómo correrlo

    npm install
    npm run dev

`npm run build` corre `prebuild`, que valida los ~750 ítems del banco con Zod.
Si un ítem incumple las cuotas, el build falla. Es a propósito.

## Estado del contenido

Ver `.claude/CONTENIDO.md` — una fila por módulo con teoría, tarjetas, ítems y
estado de revisión.

## Reportar un error de contenido

Abre un issue con la etiqueta `contenido`, citando el id del ítem. El contenido
enseña el dato verificado, no lo que repite el material oficial: si encuentras
una cifra que no cuadra con la bibliografía, es un error nuestro y se corrige.

## Licencia y atribución

Contenido educativo adaptado de la «Guía básica del entrenador deportivo»
(Cartillas 1 a 4), **COLEF Colombia** y **COCED**, 2025, publicada bajo licencia
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).

Idóneo 2210 es una **obra derivada sin ánimo de lucro** y se distribuye bajo la
**misma licencia CC BY-NC-SA 4.0** (ver `LICENSE`). Esto implica:

- **Atribución** — se acredita a COLEF y COCED como autores del material fuente,
  en este README y en el pie de todas las pantallas de la app.
- **NoComercial** — la app no se monetiza: sin pagos, sin suscripciones, sin
  publicidad, sin patrocinios. Cualquier uso comercial requiere permiso expreso
  de COLEF y COCED.
- **CompartirIgual** — cualquier derivado de este repositorio debe conservar esta
  misma licencia.

**No es un producto oficial de COLEF ni de COCED.** Los cortes de veredicto de los
simulacros son criterios internos de la app con margen de seguridad, no el puntaje
oficial de aprobación.

El código de la aplicación (todo lo que está fuera de `content/`) se ofrece bajo la
misma licencia por simplicidad y para evitar ambigüedad sobre la obra combinada.
```

Verificación: el enlace a la licencia debe resolver, y el README debe nombrar a COLEF y COCED con el enlace a CC BY-NC-SA 4.0. Si falta cualquiera de los dos, el paso 18 no está cerrado.

**18.10 · Prueba en 3 dispositivos reales.** Como mínimo un Android de gama media, un iPhone y un escritorio. Checklist:
- Simulacro final: empezar, responder 5, cerrar la pestaña, esperar 2 min, reabrir → el tiempo restante bajó correctamente.
- Auto-envío: con la duración temporalmente en 30 s, confirmar el envío automático.
- Instalar la PWA, activar modo avión, abrirla y completar la práctica de C5.
- Exportar el progreso en un dispositivo e importarlo en otro.
- Navegación con el pulgar a 375 px sin zoom accidental.
- El pie con la atribución a COLEF/COCED es legible en los tres dispositivos, en claro y en oscuro, y el enlace a la licencia abre.

**Entregable:** app en producción, instalable y funcional sin conexión. `LICENSE` y `README.md` con la atribución en su sitio. `BITACORA.md` cerrada con la entrada de despliegue.

---

## 18. Dependencias, entorno y despliegue

### Prerrequisitos

- Node.js 20 LTS o superior.
- npm 10+.
- Nada más. **Cero variables de entorno**: no hay backend, ni base de datos, ni servicios externos.

### Dependencias

| Paquete | Versión | Para qué |
|---|---|---|
| `next` | `^15.5.0` | Framework |
| `react` / `react-dom` | `^19.0.0` | UI |
| `tailwindcss` | `^4.1.0` | Estilos. **v4, no v3** |
| `@tailwindcss/postcss` | `^4.1.0` | Plugin PostCSS de v4 |
| `next-mdx-remote` | `^5.0.0` | MDX fuera de `app/` (variante `/rsc`) |
| `remark-gfm` | `^4.0.0` | Tablas en MDX |
| `zod` | `^3.25.0` | Validación. **v3, ver §5** |
| `recharts` | `^2.15.0` | Gráficas del informe |
| `lucide-react` | `^0.470.0` | Iconos |
| `next-themes` | `^0.4.4` | Claro/oscuro |
| `clsx` · `tailwind-merge` · `class-variance-authority` | — | Utilidades de shadcn/ui |
| `serwist` · `@serwist/next` | `^9.0.0` | Service worker / PWA |

Dev: `typescript` `^5.7`, `@types/node`, `@types/react`, `tsx` `^4.19` (ejecuta el validador), `vitest` `^3.0`, `tw-animate-css` `^1.0`, `eslint`, `eslint-config-next`.

### Despliegue

```bash
npx vercel          # primera vez, vincula el proyecto
npx vercel --prod   # producción
```

Vercel detecta Next.js automáticamente. `npm run build` dispara `prebuild` → el validador corre en cada despliegue: **un ítem malformado nunca llega a producción.** Cada push genera un preview; merge a `main` es producción.

---

## 19. Estrategia de tests

Vitest **solo para `src/lib/`**. Los cinco motores son funciones puras y deterministas: el test es barato y es exactamente donde un bug silencioso arruina un simulacro de 120 minutos. La UI no se testea automáticamente en v1; se verifica con la checklist manual del paso 18.10.

| Archivo | Qué cubre |
|---|---|
| `esquemas.test.ts` | Los 7 tipos válidos pasan · explicación corta falla · `verificarCuotas` detecta desbalance de nivel, de dificultad y falta de tipos |
| `almacenamiento.test.ts` | `migrar` con datos sin versión, corruptos y válidos · `importarJSON` rechaza esquemas ajenos · `tocarRacha` en los tres casos |
| `srs.test.ts` | Fallo y acierto sobre EF e intervalo · límites 1,3 y 2,8 · `colaDelDia` con límite y prioridad · `encolar` idempotente |
| `simulacro.test.ts` | Determinismo del RNG y de `armarSimulacro` · sin repeticiones · reparto por módulo · `presentarItem` + `calificar` consistentes en los 7 tipos · `calificar` con basura devuelve `false` sin lanzar |
| `cronometro.test.ts` | `restantes` con reloj inyectado · `seAcabo` · `avisoPendiente` devuelve el umbral más pequeño cruzado · `marcarAvisoVisto` marca también los mayores |
| `informe.test.ts` | Veredicto en las 6 fronteras · `temasPrioritarios` con el mínimo de 3 ítems · `detectarPatrones` positivo y negativo |
| `plan.test.ts` | Prerequisitos respetados · 3 días reservados · advertencias · examen hoy |
| `calculos.test.ts` | Las 5 fórmulas de FCmáx · densidad · MET · IMC · conversión de pulso |

**Regla:** ninguna de estas pruebas usa mocks de fecha. Todas las funciones reciben `ahora` como parámetro — ese es el motivo del diseño.

---

## 20. Skills recomendadas durante el build

| Skill | En qué paso | Para qué |
|---|---|---|
| `/shadcn-ui` | 1, 5, 9, 12 | Instalar y componer los componentes de shadcn sin salir a buscar documentación |
| `/frontend-design` | 5, 9, 12 | Las tres pantallas de mayor carga visual: shell y navegación, componentes de ítem, informe con gráficas |
| `/playwright-cli` | 18.10 | Automatizar la checklist de verificación en distintos viewports, si se quiere ir más allá de la prueba manual |

Deliberadamente **no** se recomiendan: `/seo-audit` (la app es privada salvo la portada), `/deep-research` (el stack está fijado), `/humanizer` (el contenido lo escribe una persona con las cartillas al lado).

---

## 21. `CLAUDE.md` para el proyecto destino

Copiar tal cual a la raíz de `idoneo-2210/`.

````markdown
# Idóneo 2210

App web PWA de preparación para la Evaluación de Idoneidad del Entrenador Deportivo en Colombia (Ley 2210 de 2022, COLEF/COCED). 29 módulos, ~750 ítems, simulacros cronometrados y repaso espaciado. Sin backend: todo el estado vive en localStorage.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (dispara `prebuild` → validador de banco)
- `npm run validar` — valida el banco de ítems con Zod. Si falla, el build falla
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest sobre `src/lib/`
- `npm run lint` — ESLint

## Stack

Next.js 15 App Router · TypeScript strict · Tailwind CSS **v4** · shadcn/ui (New York) · next-mdx-remote · Zod 3 · recharts · lucide-react · Serwist (PWA) · npm · Vercel.

**Sin base de datos, sin autenticación, sin CMS, sin servicio de búsqueda.** Son decisiones, no pendientes.

## Tailwind v4 — no mezclar con v3

- `globals.css` empieza con `@import "tailwindcss";`. Nunca `@tailwind base/components/utilities`.
- **No existe `tailwind.config.js` ni `.ts`.** Si aparece uno, bórralo.
- Los tokens van en `@theme inline` dentro de `globals.css`, no en un config JS.
- Modo oscuro: `@custom-variant dark (&:is(.dark *));`.
- Colores en `oklch()`.
- `components.json` tiene `"tailwind": { "config": "" }`.

## Arquitectura

### Carpetas

- `content/` — TODO el contenido. `estructura.ts` (4 bloques, 29 módulos), `banco/` (ítems en TS), `tarjetas/`, `teoria/` (MDX), `datos-duros.ts`, `glosario.ts`, `blueprint-examen.ts`.
- `src/lib/` — tipos, esquemas Zod, almacenamiento y los 5 motores. Cero JSX.
- `src/app/` — rutas. Todas las páginas son Server Components.
- `src/components/` — `ui/` (shadcn), `mdx/`, `items/` (7 tipos), `sesion/`, `informe/`, `layout/`.
- `src/hooks/` — `usar-estado`, `usar-cronometro`, `usar-sesion`.
- `scripts/validar-banco.ts` — guardián del banco.
- `.claude/` — BITACORA, ARQUITECTURA, CONTENIDO.

### Flujo de datos

Server Component lee metadatos de `content/estructura.ts` y la teoría MDX con `fs` (`src/lib/contenido.ts`, `server-only`) → pasa los datos como props a un controlador cliente → el controlador lee y escribe progreso con `src/lib/almacenamiento.ts`.

El banco de ítems y las tarjetas son **módulos TS importables desde el cliente**: se cargan con `import()` dinámico bajo interacción del usuario (`cargarBancoCompleto()` en el handler de "Empezar simulacro"). La teoría MDX es **server-only**. Esa asimetría es intencional.

### Patrones clave

- Server Component por defecto. `"use client"` solo con estado, eventos, localStorage, temporizador o API del navegador.
- Los motores de `src/lib/` **no llaman al reloj**: reciben `ahoraISO: string` o `ahoraMs: number`. Solo efectos y handlers leen `Date.now()`.
- Todo acceso a localStorage pasa por `src/lib/almacenamiento.ts`. Esquema versionado con `migrar()`.
- `useEstado()` devuelve `null` en el primer render. Todo componente que lo use muestra un esqueleto mientras tanto.
- Aleatoriedad: `crearRng(semilla)` de `src/lib/simulacro.ts`. **Nunca `Math.random()`.**

## Reglas de código

1. Un componente por archivo, máximo **300 líneas de código**: sin comentarios ni líneas en blanco, tal como las cuenta ESLint `max-lines` con `skipComments` y `skipBlankLines`. Los comentarios **no** cuentan — este proyecto los cultiva a propósito. Alcance: `src/components/**` (salvo `ui/`), `src/hooks/**` y `src/app/**`; quedan fuera `content/**` (son datos), `src/lib/**` (motores copiados por §22 regla 2; su criterio de partición es ADR-021) y los tests. Pasarse no se arregla cortando por tamaño, sino extrayendo la responsabilidad que el archivo ya tiene con nombre propio. Ver **ADR-022**.
2. Alias `@/` para `src/`. `@/content/*` funciona vía `tsconfig.paths`.
3. Sin barrel exports: importa desde el archivo fuente.
4. Cero `any`. Si no sabes el tipo, `unknown` + type guard.
5. Nombres en español, igual que el dominio (`armarSimulacro`, `colaDelDia`, `verificarCuotas`).
6. Antes de acceder a `items[0]`, comprueba `items.length > 0`. Estado vacío digno, nunca un crash.

## Sistema de diseño

Colores en `oklch` dentro de `globals.css`. Primario azul acero `oklch(0.48 0.12 250)`. Un color por bloque: A ámbar, B violeta, C verde azulado, D terracota — con `--color-bloque-a..d`. Usa el mapa `CLASES_BLOQUE` de `src/lib/utils.ts`: Tailwind no genera clases dinámicas.

Tipografía: Barlow (títulos), Inter (cuerpo, con `tabular-nums`), JetBrains Mono (cronómetro, valores, fórmulas).

Radio `0.625rem`. Contenido `max-w-3xl`. Transiciones ≤200 ms. Táctil: opciones `min-h-[52px]`, resto `min-h-[44px]`.

## Reglas No Negociables

1. **TypeScript strict, cero `any`.**
2. **Tailwind v4.** No crear `tailwind.config.*`. No usar sintaxis de v3.
3. **Cero `Math.random()`** en toda la app. Aleatoriedad solo con `crearRng(semilla)`.
4. **Cero `new Date()` sin argumentos y cero `Date.now()` en el cuerpo de un render.** Solo en efectos y handlers, en los archivos listados en el blueprint. `new Date(isoString)` sí está permitido.
5. **localStorage solo a través de `src/lib/almacenamiento.ts`.** Nunca `window.localStorage` directo en un componente.
6. **`src/lib/contenido.ts` es `server-only`.** Jamás importarlo desde un Client Component.
7. **Toda explicación de ítem tiene ≥200 caracteres** y sigue la estructura: por qué la correcta lo es → por qué falla el distractor más tentador → dato para recordar.
8. **Un módulo no se marca `'completo'`** sin teoría + ≥12 tarjetas + ≥25 ítems que pasen `npm run validar`.
9. **El cronómetro se recalcula siempre contra el reloj real** desde `iniciadoEnMs`. Cerrar la pestaña no regala tiempo.
10. **Retroalimentación honesta.** Nada de felicitaciones vacías. Si sacó 52, se dice qué significa y qué hacer.
11. **Cero pantallas en blanco.** Todo estado vacío tiene mensaje y acción.
12. **Actualizar `.claude/BITACORA.md` al terminar cada paso.** Es parte del entregable, no un extra.
13. **La atribución a COLEF y COCED no se toca.** El material fuente es CC BY-NC-SA 4.0: el pie de `src/components/layout/pie.tsx` debe estar visible en todas las rutas, y `LICENSE` + la sección de licencia del `README.md` deben conservarse. No borrar el pie "porque estorba", no acortar el texto, no quitar el enlace a la licencia.
14. **La app no se monetiza.** La cláusula NoComercial de la licencia del material fuente lo prohíbe: sin pagos, sin suscripciones, sin publicidad, sin patrocinios. Ver ADR-001 en `.claude/ARQUITECTURA.md`.
15. **El contenido enseña el dato verdadero, verificado (ADR-014).** Las cartillas son la guía del temario, no la fuente de verdad de cada cifra. La app **no documenta sus errores en ningún sitio**: ni ruta, ni componente, ni campo, ni «la cartilla dice» dentro de una explicación. Antes de escribir un módulo, lee `.claude/CONTENIDO.md`, que recoge la investigación ya verificada.

## Licencia

Contenido adaptado de la «Guía básica del entrenador deportivo» (Cartillas 1 a 4), COLEF Colombia y COCED, 2025, bajo CC BY-NC-SA 4.0. Esta app es una obra derivada sin ánimo de lucro, licenciada igual. No es un producto oficial de COLEF ni de COCED.
````

---

## 22. Reglas No Negociables (del blueprint)

1. **Seguir los 18 pasos en orden.** El plan está ordenado por dependencias reales, no por comodidad.
2. **Copiar el código de las secciones §4 a §8 tal cual.** Los motores tienen invariantes (determinismo, ausencia de reloj) que se rompen al "mejorarlos".
3. **Tailwind v4 en todo el proyecto.** Ninguna sintaxis de v3, ningún `tailwind.config.*`. Ver §2.1.
4. **Todo acceso a `localStorage` pasa por `src/lib/almacenamiento.ts`** con esquema versionado y migraciones.
5. **Cero `Math.random()`.** La aleatoriedad se genera con `crearRng(semilla)` y la semilla se guarda en el intento.
6. **Cero `new Date()` sin argumentos y cero `Date.now()` en el cuerpo de un render.** Solo en los efectos y handlers de §10.4.
7. **Server Components por defecto.** `"use client"` solo en los archivos listados en §10.3.
8. **Mobile-first real.** Estilos base para 375 px; `md:` y `lg:` después, nunca al revés. Opciones de ítem `min-h-[52px]`.
9. **El validador nunca se relaja.** Si un ítem no pasa, se arregla el ítem — no se baja el umbral ni se añade una excepción.
10. **El módulo C5 es la plantilla de oro.** Un módulo nuevo que no se le parezca en profundidad, tono y calidad de distractores está mal hecho.
11. **La app dice la verdad sobre sus veredictos.** `NOTA_VEREDICTO` se muestra siempre: los cortes son criterios internos, no el puntaje oficial de COLEF.
12. **Nunca destruir el progreso del usuario.** Ni al migrar el esquema, ni al importar un JSON inválido, ni al reiniciar sin doble confirmación.
13. **La atribución CC BY-NC-SA 4.0 es entregable, no adorno.** `LICENSE` en el paso 1, el pie de §11.7 en el paso 5, la sección de licencia del `README.md` en el paso 18.9. Un paso no está cerrado si falta su parte de la licencia. Ver §1 · Licencia y atribución.
14. **La app no se monetiza jamás.** La cláusula NoComercial del material fuente lo prohíbe. Cualquier propuesta de cobrar exige reescribir el contenido desde fuentes propias o permiso expreso de COLEF y COCED.
15. **El contenido enseña el dato verdadero (ADR-014).** Este documento se escribió cuando la app catalogaba las erratas del material fuente; esa decisión se revocó. Si encuentras aquí un resto del sistema de erratas —un tipo, un campo, una ruta, un componente—, **no lo construyas**: está desactualizado y manda el ADR.

---

## 23. Sistema `.claude/`

Tres archivos, tres funciones distintas. Se crean vacíos en el paso 1 con estos encabezados.

### `.claude/BITACORA.md`

Registro cronológico de construcción. **Una entrada por paso completado, siempre.**

```markdown
# Bitácora — Idóneo 2210

## Paso N — [Nombre del paso] — [YYYY-MM-DD]
**Estado:** ✅ Completado · ⚠️ Completado con ajustes · 🚧 Parcial
**Archivos:** rutas creadas o modificadas
**Verificación:** qué se comprobó (`npm run build`, `npm test`, prueba manual)
**Pendiente:** lo que quedó abierto y en qué paso se cierra
**Notas:** problemas encontrados, decisiones menores
```

**Cuándo escribir:** al terminar cualquier paso numerado del build order. No es opcional.

### `.claude/ARQUITECTURA.md`

Solo decisiones no obvias y su razón. Máximo tres frases por decisión.

```markdown
# Decisiones de arquitectura — Idóneo 2210

## ADR-NNN — [Título] — [YYYY-MM-DD]
**Decisión:** qué se decidió
**Alternativas consideradas:** qué más se evaluó
**Razón:** por qué esta
```

**Cuándo escribir:** cuando la decisión podía haberse tomado de dos o más formas plausibles y elegiste una. Ejemplo válido: "el banco de ítems en TS y no en JSON, para que sea importable desde el cliente con code splitting". Ejemplo inválido: "usé Tailwind para los estilos" (es el stack, no una decisión).

El paso 1 arranca este archivo copiando la tabla de §2.2 de este blueprint.

### `.claude/CONTENIDO.md`

Estado del contenido, una fila por módulo. Es la única fuente de verdad sobre qué está listo.

```markdown
# Estado del contenido — Idóneo 2210

| Módulo | Bloque | Teoría | Tarjetas | Ítems | Glosario | Validado | Notas |
|---|---|---|---|---|---|---|---|
| c5-umbrales-zonas | C | ✅ | ✅ 15 | ✅ 25 | ✅ 9 | ✅ | Plantilla de oro |
| d2-carga | D | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 15 |
```

**Cuándo escribir:** cada vez que se crea o modifica un archivo de `content/`. Se actualiza la tabla; no se añaden párrafos.

**Regla dura:** un módulo **no** se marca como completo aquí ni en `estructura.ts` si no tiene teoría + ≥12 tarjetas + ≥25 ítems que pasen `npm run validar` + sus conceptos clave en el glosario.

---

## 24. Fuera de alcance v1 — puertas abiertas

Documentado para que nadie lo construya por iniciativa propia, y para que la v2 sepa por dónde entrar.

| Fuera de v1 | Cuándo reconsiderarlo | Qué habría que tocar |
|---|---|---|
| **Backend y cuentas de usuario** | Si más de 15 personas la usan y piden ranking o sincronización | Supabase + auth. `EstadoProgreso` ya es serializable y versionado: la migración es subir el mismo objeto a una tabla. |
| **Actividades originales de las cartillas** (crucigramas, sopa de letras, completar espacios) | v1.1, tras el paso 18 | Tres componentes nuevos no triviales + transcripción manual del contenido. Alto valor percibido, costo real alto. |
| **Contenido generado por IA en runtime** | Nunca en esta forma | Todo el contenido es estático y revisado. Un ítem inventado en vivo destruiría la confianza en el banco. |
| **Pagos** | **Nunca — puerta cerrada, no abierta** | La cláusula **NoComercial** de la licencia CC BY-NC-SA 4.0 del material fuente lo prohíbe. No es que la app sea gratis por generosidad: monetizar una obra derivada de las cartillas de COLEF/COCED sería una violación de licencia. Reabrir esta puerta exige reescribir todo el contenido desde fuentes propias o un permiso expreso. Ver §1 · Licencia y atribución y ADR-001. |
| **Búsqueda con Algolia o Meilisearch** | Si el glosario superara ~2000 entradas | Hoy son <400: un filtro en cliente es más rápido, funciona offline y no cuesta nada. |
| **CMS (Sanity, Contentful, Keystatic)** | Si alguien sin acceso al repo tuviera que escribir contenido | Hoy el contenido lo escribe el desarrollador con las cartillas al lado. Un CMS solo añadiría latencia y una capa de fallo. |
| **Tests E2E con Playwright** | Si aparecieran colaboradores externos | Con un solo desarrollador, la checklist manual del paso 18.10 cubre los tres flujos críticos a un costo mucho menor. |

---

*Blueprint generado por The Architect · 2026-07-27 · Fuentes: `brief-idoneo-2210.md` y `contenido-y-examenes-idoneo-2210.md`*
