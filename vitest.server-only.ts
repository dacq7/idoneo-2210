// vitest.server-only.ts
//
// Sustituto vacío de `server-only` para Vitest. Ver el alias en
// `vitest.config.ts`: el paquete real lo resuelve el compilador de Next y no
// existe en `node_modules`, así que sin esto los tests de cualquier módulo
// marcado como server-only fallan al importarlo.
//
// La barrera de verdad la aplica el build de Next, que sigue corriendo.
export {};
