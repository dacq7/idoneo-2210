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
];

export default eslintConfig;
