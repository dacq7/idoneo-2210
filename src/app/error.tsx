'use client';

// src/app/error.tsx — Next exige que el límite de error sea Client Component.
// Alta a la lista cerrada de §10.3 registrada en ADR-009: no es una elección.

import { useEffect } from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorDeRuta({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sin backend no hay a dónde reportar: queda en la consola del dispositivo,
    // que es lo único disponible para diagnosticar en un teléfono real.
    console.error('[idoneo-2210] error de ruta:', error);
  }, [error]);

  return (
    <section className="space-y-6 py-8">
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-destructive">
          <TriangleAlert className="size-4" aria-hidden="true" />
          Fallo de la aplicación
        </p>
        <h1>Esta pantalla no se pudo mostrar</h1>
        <p className="text-muted-foreground">
          Algo falló al construir esta pantalla. No es un problema de conexión: la app corre en tu
          dispositivo.
        </p>
        <p className="text-muted-foreground">
          <strong className="font-semibold text-foreground">Tu progreso no se perdió.</strong> Los
          módulos, la cola de repaso y los intentos guardados siguen en este navegador; un fallo al
          pintar una pantalla no los borra. Si estabas en un simulacro cronometrado, el tiempo se
          sigue contando contra el reloj real, así que reintenta pronto.
        </p>
        <p className="text-muted-foreground">
          Si vuelve a fallar en el mismo sitio, exporta tu respaldo desde Ajustes antes de seguir
          probando.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>

      {error.digest ? (
        <p className="font-mono text-xs text-muted-foreground">
          Referencia técnica: {error.digest}
        </p>
      ) : null}
    </section>
  );
}
