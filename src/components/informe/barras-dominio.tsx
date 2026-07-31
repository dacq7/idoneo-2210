'use client';

// src/components/informe/barras-dominio.tsx — Client Component (§10.3).
//
// Compone el dominio por bloque: la **tabla** (la fuente) y la **gráfica** (el
// resumen visual). Nada más.
//
// ══════════════════════════════════════════════════════════════════════════
// RECHARTS SE CARGA DIFERIDO, Y ESO ES UNA DECISIÓN DE PRODUCTO
// ══════════════════════════════════════════════════════════════════════════
//
// Medido: con recharts en el bundle de la ruta, `/resultados/[intentoId]`
// pesaba **244.9 kB gz** contra los ~135–150 del resto de la app. Es la
// pantalla que el usuario abre justo después de dos horas de examen, muchas
// veces en 4G, y la app promete cargar en menos de 3 s (§3).
//
// Diferirlo es correcto aquí **porque la gráfica no lleva información propia**:
// la tabla tiene los mismos números y se renderiza de inmediato. El usuario ve
// su desglose completo sin esperar a recharts, y la gráfica aparece cuando
// llega. Si no llegara —red que se cae a mitad—, no falta ningún dato.
//
// Esa es también la razón por la que el hueco reservado NO es un esqueleto que
// promete contenido: es espacio en blanco. Un esqueleto donde puede no llegar
// nada estaría mintiendo.
//
// `ssr: false` porque recharts mide el contenedor para dibujar: renderizarlo en
// el servidor produce un SVG de tamaño equivocado que salta al hidratar.

import dynamic from 'next/dynamic';
import { TablaDominio, type PropsDominio } from './tabla-dominio';

const GraficaDominio = dynamic(
  () => import('./grafica-dominio').then((m) => m.GraficaDominio),
  {
    ssr: false,
    loading: () => null,
  },
);

export function BarrasDominio({ datos, delta }: PropsDominio) {
  if (datos.length === 0) return null;

  return (
    <div className="space-y-4">
      <GraficaDominio datos={datos} />
      <TablaDominio datos={datos} delta={delta} />
    </div>
  );
}
