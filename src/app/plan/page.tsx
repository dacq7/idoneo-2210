// src/app/plan/page.tsx — Server Component.
//
// El plan de estudio: qué estudiar hoy y en qué orden hasta el examen.
//
// Frontera (ADR-010): se proyecta a `ModuloDelPlan` —los **seis** campos que
// `generarPlan` lee— y a `BloqueDelPlan`. La primera versión pasaba los
// `Modulo` completos alegando que proyectar «ahorraría poco», y esa cifra
// nunca se midió: son **4 457 B gz, un 75 %** de la carga útil de esta ruta
// (ADR-026). Viajaban `objetivos`, `conceptosClave`, `subtitulo` y
// `estadoContenido`, que el motor no lee nunca.
//
// NO monta `RotuloBloque`: el plan cruza los cuatro bloques (DISENO.md §2.4).

import type { Metadata } from 'next';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { VistaPlan } from '@/components/plan/vista-plan';

export const metadata: Metadata = {
  title: 'Tu plan de estudio',
  robots: { index: false },
};

export default function PaginaPlan() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Tu plan de estudio</h1>
        <p className="text-muted-foreground">
          Los 29 módulos repartidos hasta tu examen, ordenados por lo que más te conviene estudiar
          primero: lo que fallaste, lo que más pesa en el examen y lo que hay que saber antes de
          otra cosa.
        </p>
      </header>

      <VistaPlan
        modulos={MODULOS.map((m) => ({
          slug: m.slug,
          titulo: m.titulo,
          bloque: m.bloque,
          orden: m.orden,
          minutosEstimados: m.minutosEstimados,
          prerequisitos: m.prerequisitos,
        }))}
        bloques={BLOQUES.map((b) => ({ id: b.id, pesoExamen: b.pesoExamen }))}
      />
    </div>
  );
}
