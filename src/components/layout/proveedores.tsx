'use client';

// src/components/layout/proveedores.tsx
// Único proveedor de la app: tema + avisos. Es cliente porque ThemeProvider
// usa contexto y escucha el cambio de preferencia del sistema.

import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

export function Proveedores({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Evita que el cambio de tema arrastre las transiciones de color de toda
      // la página, que en gama media se ve como un tirón.
      disableTransitionOnChange
    >
      {children}
      {/* containerAriaLabel: sin él, sonner monta el landmark de la región viva
          con el nombre "Notifications alt+T" — inglés dentro de lang="es-CO"
          (WCAG 3.1.2). Es la región que anunciará todos los avisos desde el
          Paso 9. Ver A-02 en ACCESIBILIDAD.md. */}
      <Toaster position="top-center" containerAriaLabel="Avisos" />
    </ThemeProvider>
  );
}
