import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Forma de array y con el más específico primero: un alias de string
    // reemplaza por prefijo, así que '@' → src haría que '@/content/estructura'
    // resolviera a 'src/content/estructura', que no existe.
    alias: [
      { find: /^@\/content\//, replacement: path.resolve(__dirname, 'content') + '/' },
      { find: /^@\//, replacement: path.resolve(__dirname, 'src') + '/' },
    ],
  },
  // scripts/ entra porque el validador de banco vive ahí y desde ADR-005 su
  // lógica es una función pura con tests propios.
  test: { environment: 'node', include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
