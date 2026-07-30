// src/app/not-found.tsx — Server Component.
import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

export default function NoEncontrada() {
  return (
    <section className="space-y-6 py-8">
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          <Compass className="size-4" aria-hidden="true" />
          Error 404
        </p>
        <h1>Esta dirección no existe</h1>
        <p className="text-muted-foreground">
          La ruta que abriste no corresponde a ninguna pantalla de la app. Puede ser un enlace
          viejo, un módulo que se escribe con otro nombre, o una dirección escrita a mano.
        </p>
        <p className="text-muted-foreground">
          <strong className="font-semibold text-foreground">Tu progreso está intacto.</strong> Vive
          en este navegador y no se toca al equivocarse de dirección: nada se borró y nada se
          reinició.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Ir al inicio</Link>
      </Button>
    </section>
  );
}
