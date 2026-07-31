import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // [Paso 18.1] Artefactos de Serwist: los escribe `next build` en public/,
      // están en .gitignore y son bundles minificados. Lintarlos daba 85 avisos
      // y un error por código que nadie escribió ni puede arreglar.
      "public/sw.js",
      "public/swe-worker-*.js",
    ],
  },
  {
    // ADR-011 · el paquete paraguas `radix-ui` NO se sacude. Su `dist/index.mjs`
    // hace `import * as Dialog from "@radix-ui/react-dialog"` para 55 primitivas:
    // son NAMESPACE imports, no reexportaciones planas, así que el bundler no
    // puede eliminar las que no se usan por mucho que el paquete declare
    // `sideEffects: false`. Los subpaths (`radix-ui/slot`, `radix-ui/dialog`, …)
    // sí: cada uno es un `export * from "@radix-ui/react-*"` de una línea. Mismo
    // paquete, misma versión, cero dependencias nuevas.
    //
    // Esta regla es la CONDICIÓN DE CIERRE del ADR: `npx shadcn@2 add` escribe el
    // barrel y no se puede configurar para que no lo haga, así que el arreglo se
    // deshace solo la próxima vez que alguien añada un componente. No se puede
    // impedir que lo escriba; sí que sobreviva a `npm run lint`.
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "radix-ui",
              message:
                'Usa el subpath: `import * as X from "radix-ui/dialog"` en vez del paquete paraguas. El barrel arrastra las 55 primitivas al bundle (ADR-011). Si esto salta tras `npx shadcn@2 add`, reescribe el import del componente recién añadido.',
            },
          ],
        },
      ],
    },
  },
  // ── Regla 1 de CLAUDE.md §21, con dientes (ADR-022) ──
  //
  // «Máximo 300 líneas de código», contadas como las cuenta esta regla:
  // `skipComments` y `skipBlankLines`. La unidad la fijó ADR-022 después de que
  // tres mediciones honestas del mismo archivo dieran cuatro resultados
  // distintos — una regla en una unidad indefinida no se puede cumplir ni
  // aplicar, solo invocar.
  //
  // **Se enciende en el Paso 12, no antes, y eso es parte de la decisión.** Al
  // decidir la regla el proyecto tenía un incumplidor (`controlador-repaso.tsx`,
  // 414 líneas) y encenderla habría dejado el lint rojo. Las dos salidas para
  // evitarlo —subir el número hasta que nadie incumpla, o un `eslint-disable` en
  // la cabecera— son las dos formas de recrear la enfermedad que ADR-022 cura,
  // así que se esperó a arreglar el archivo. Si algún día esta regla vuelve a
  // saltar, el arreglo es extraer la responsabilidad que sobra, no tocar este
  // número.
  //
  // El alcance es el que declara ADR-022. Fuera quedan `content/` (son datos:
  // el banco de C5 son 594 líneas de ítems), `src/lib/` (motores que §22 regla 2
  // manda copiar literalmente del blueprint; su criterio de partición es
  // ADR-021), `src/components/ui/` (generado por el CLI de shadcn) y los tests,
  // donde el tamaño es cobertura y no diseño.
  //
  // La OTRA mitad de la regla 1 —«un componente exportado por archivo»— no tiene
  // compuerta y no se le inventa una: distinguir un componente de un helper
  // exportado exige criterio, no una expresión regular.
  {
    files: ["src/components/**/*.tsx", "src/hooks/**/*.ts", "src/app/**/*.tsx"],
    ignores: ["src/components/ui/**"],
    rules: {
      "max-lines": ["error", { max: 300, skipComments: true, skipBlankLines: true }],
    },
  },
];


export default eslintConfig;
