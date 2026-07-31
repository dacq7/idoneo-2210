import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // JSX automático para el proyecto `componentes`: los .tsx no importan React
  // (Next lo inyecta) y esbuild, por defecto, emite `React.createElement`.
  esbuild: { jsx: 'automatic' },
  resolve: {
    // Forma de array y con el más específico primero: un alias de string
    // reemplaza por prefijo, así que '@' → src haría que '@/content/estructura'
    // resolviera a 'src/content/estructura', que no existe.
    alias: [
      { find: /^@\/content\//, replacement: path.resolve(__dirname, 'content') + '/' },
      { find: /^@\//, replacement: path.resolve(__dirname, 'src') + '/' },
      // `server-only` lo resuelve el compilador de Next, no npm: no existe en
      // `node_modules`, así que fuera de Next el import falla. Aquí se
      // neutraliza con un módulo vacío.
      //
      // Neutralizarlo NO desactiva la barrera donde importa: `server-only`
      // existe para que el BUILD falle si un Client Component importa un
      // módulo de servidor, y ese build sigue corriendo igual. Los tests son
      // código de servidor por definición —Node, sin DOM ni bundle—, así que
      // aplicarles la barrera solo impediría probar `censo.ts` y `contenido.ts`.
      { find: /^server-only$/, replacement: path.resolve(__dirname, 'vitest.server-only.ts') },
    ],
  },
  test: {
    // Dos entornos, separados por extensión (ADR-016). `.test.ts` corre en node:
    // son los motores puros de §19 y montar un DOM para ellos sería 300 ms de
    // arranque por nada. `.test.tsx` corre en jsdom: son los tests de componente
    // que existen para una sola clase de defecto —los que solo se ven al montar,
    // desmontar y volver a montar—, y esa clase no se puede probar con funciones.
    projects: [
      {
        extends: true,
        test: {
          name: 'motores',
          environment: 'node',
          // scripts/ entra porque el validador de banco vive ahí y desde ADR-005
          // su lógica es una función pura con tests propios.
          include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'componentes',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
