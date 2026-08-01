# Idóneo 2210

Preparación para la **Evaluación de Idoneidad del Entrenador Deportivo** en Colombia
(Ley 2210 de 2022 · COLEF / COCED). 29 módulos con teoría, tarjetas, práctica y quiz;
752 preguntas; repaso espaciado; y simulacros cronometrados que replican el formato del
examen real —100 ítems en 120 minutos—.

PWA instalable que funciona sin conexión. **Sin backend, sin cuentas, sin registro:** todo
el progreso vive en el navegador y se mueve entre dispositivos con un archivo JSON.

No es un resumen de las cartillas. Es un sistema que dice **qué sabes, qué no sabes y qué
estudiar hoy**, y lo demuestra con un informe diagnóstico por bloque, por módulo y por
nivel cognitivo.

---

## Cómo correrlo

```bash
npm install
npm run dev
```

Nada más: **cero variables de entorno**. No hay base de datos, ni autenticación, ni
servicios externos.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción. Dispara `prebuild` → validador de banco |
| `npm run validar` | Valida los 752 ítems con Zod. Si falla, el build falla |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest sobre `src/lib/` y los componentes |
| `npm run lint` | ESLint |
| `npm run canario` | Comprueba que ningún chunk de carga ansiosa lleva contenido (ADR-010). Correr **después** de `build` |

`npm run build` no compila si un solo ítem incumple las cuotas de contenido, tiene la
explicación demasiado corta o presenta un sesgo de longitud explotable en la opción
correcta. Es a propósito: con 752 ítems escritos a mano durante semanas, el error humano es
certeza y no riesgo.

## Cómo está hecho

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui · next-mdx-remote ·
Zod 3 · Serwist (PWA) · Vitest · Vercel.

- **`content/`** — todo el contenido: la teoría en MDX, el banco de ítems y las tarjetas en
  TypeScript, el glosario y los datos duros. Ningún componente vive aquí.
- **`src/lib/`** — los cinco motores (repaso espaciado, simulacro, cronómetro, informe,
  plan), sin JSX y sin reloj: reciben el «ahora» como parámetro, lo que los hace puros y
  testeables sin mocks.
- **`src/app/`** — las rutas. Todas las páginas son Server Components.
- **`.claude/`** — bitácora de construcción, decisiones de arquitectura (ADR), estado del
  contenido, diseño y accesibilidad.

## Estado del contenido

Los **29 módulos** están publicados: 752 ítems, 435 tarjetas y 123 términos de glosario.
El detalle módulo a módulo está en [`.claude/CONTENIDO.md`](.claude/CONTENIDO.md).

## Reportar un error de contenido

Abre un issue con la etiqueta `contenido` citando el id del ítem (`C5-014`, `A6-023`…).

El contenido de esta app **enseña el dato verificado, no lo que repite el material
oficial**: las cartillas son la guía del temario, no la fuente de verdad de cada cifra. Si
encuentras una cifra que no cuadra con la bibliografía, es un error nuestro y se corrige.

## Privacidad

No hay servidor que reciba nada. El progreso —módulos leídos, respuestas, intentos, racha—
se guarda en el `localStorage` del navegador y no se envía a ninguna parte. No hay
analítica, ni cookies de terceros, ni telemetría.

La contrapartida es que **borrar los datos del navegador borra el progreso**. Por eso
`/ajustes` tiene exportar e importar: ese archivo es la única copia que existe.

## Licencia y atribución

Contenido educativo adaptado de la «Guía básica del entrenador deportivo» (Cartillas 1 a 4),
**COLEF Colombia** y **COCED**, 2025, publicada bajo licencia
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).

Idóneo 2210 es una **obra derivada sin ánimo de lucro** y se distribuye bajo la **misma
licencia CC BY-NC-SA 4.0** (ver [`LICENSE`](LICENSE)). Esto implica tres cosas, y las tres
son obligaciones, no cortesías:

- **Atribución** — se acredita a COLEF y COCED como autores del material fuente, en este
  README y en el pie de todas las pantallas de la app.
- **NoComercial** — la app no se monetiza: sin pagos, sin suscripciones, sin publicidad,
  sin patrocinios. Cualquier uso comercial requiere permiso expreso de COLEF y COCED.
- **CompartirIgual** — cualquier derivado de este repositorio debe conservar esta misma
  licencia.

**No es un producto oficial de COLEF ni de COCED.** Los cortes de veredicto de los
simulacros son criterios internos de la app, con margen de seguridad, y no representan el
puntaje oficial de aprobación.

El código de la aplicación —todo lo que está fuera de `content/`— se ofrece bajo la misma
licencia por simplicidad y para evitar cualquier ambigüedad sobre la obra combinada.
