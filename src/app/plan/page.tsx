// src/app/plan/page.tsx — Server Component.
//
// El plan de estudio: qué estudiar hoy y en qué orden hasta el examen.
//
// Frontera (ADR-010): aquí SÍ se pasan los `Modulo` completos, y es la
// excepción razonada del proyecto. `generarPlan` necesita `prerequisitos`,
// `minutosEstimados`, `orden` y `bloque` de los 29 —no un subconjunto de tres
// campos como el informe—, así que proyectar no ahorraría gran cosa y obligaría
// a inventar un tipo paralelo que hay que mantener en sincronía con `Modulo`.
//
// Lo que ADR-010 prohíbe es el import ESTÁTICO de `content/` desde un Client
// Component, que metería los 29 módulos en el bundle. Aquí viajan como carga
// útil RSC de una sola ruta, medida y declarada en la bitácora del paso.
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

      <VistaPlan modulos={MODULOS} bloques={BLOQUES} />
    </div>
  );
}
