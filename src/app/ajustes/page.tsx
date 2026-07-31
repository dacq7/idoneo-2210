// src/app/ajustes/page.tsx — Server Component.
//
// [Paso 18.5] Reemplaza el anticipo del Paso 14, que era una pantalla honesta
// sobre lo que todavía no existía. Se conservan sus dos obligaciones, que ahora
// se cumplen en vez de anunciarse:
//   · exponer la cuarentena de ADR-008 → `components/ajustes/cuarentena.tsx`
//   · avisar de que sin respaldo el progreso se pierde → sigue estando, y ahora
//     con el botón de exportar al lado en vez de con una disculpa.
//
// La página no hace nada más que el encabezado: todo lo que se ve depende de
// `localStorage`, así que el trabajo es del cliente.

import type { Metadata } from 'next';
import Link from 'next/link';
import { PanelAjustes } from '@/components/ajustes/panel-ajustes';

export const metadata: Metadata = {
  title: 'Ajustes',
  robots: { index: false },
};

export default function PaginaAjustes() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Ajustes</h1>
        <p className="text-muted-foreground">
          Tus datos, la apariencia y el respaldo de tu progreso. Todo vive en este navegador: no hay
          cuenta, no hay servidor y nada de esto sale de tu dispositivo.
        </p>
      </header>

      <PanelAjustes />

      <section aria-labelledby="instalar-titulo" className="space-y-2 border-t border-border pt-6">
        <h2 id="instalar-titulo">Instalar la app</h2>
        <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
          Instalada abre más rápido, ocupa la pantalla completa y funciona sin conexión con todo lo
          que ya hayas visitado. En Android y en escritorio, el navegador te ofrecerá instalarla; en
          iPhone se hace a mano, con{' '}
          <strong className="font-medium text-foreground">
            Compartir → Añadir a pantalla de inicio
          </strong>
          .
        </p>
        <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
          Para que funcione sin conexión de verdad, recorre una vez con datos lo que vayas a usar:
          la teoría de cada módulo se guarda al visitarla. Las preguntas y las tarjetas se guardan
          todas desde el principio.
        </p>
        <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
          ¿Vas a compartirla? Manda el enlace y ya está. Quien lo abra empieza sin registrarse y su
          progreso será suyo:{' '}
          <Link href="/" className="font-medium text-primary underline underline-offset-2">
            la portada
          </Link>{' '}
          explica por dónde empezar.
        </p>
      </section>
    </div>
  );
}
