// src/app/herramientas/page.tsx — Server Component.
//
// La calculadora médico-deportiva (§15.1). Es la ruta que sobrevive al examen:
// las fórmulas de FCmáx y de zonas se siguen usando el lunes siguiente con los
// deportistas de verdad, y eso es lo que hace que la app se recomiende.
//
// ══ NO ESTÁ EN LA BARRA, Y ES CORRECTO ══
// §11.5 fija cinco destinos y A-01 midió que un sexto rompe el AA a 200 % de
// zoom. Se llega desde la portada y desde los enlaces de los módulos C2, C3,
// C5, C7 y D2, que es donde a alguien se le ocurre calcular algo.

import type { Metadata } from 'next';
import { Calculadora } from '@/components/herramientas/calculadora';

export const metadata: Metadata = {
  title: 'Calculadora',
  robots: { index: false },
};

export default function PaginaHerramientas() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Calculadora</h1>
        <p className="text-muted-foreground">
          Las fórmulas que caen en el examen, aplicadas. Cada resultado enseña la operación con tus
          números debajo y enlaza al módulo donde se explica: la idea es que puedas reproducirla en
          un papel, no que te la resuelva.
        </p>
      </header>

      <Calculadora />
    </div>
  );
}
