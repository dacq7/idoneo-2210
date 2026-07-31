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

import { useEffect, useState, type ComponentType } from 'react';
import { TablaDominio, type DominioBloque, type PropsDominio } from './tabla-dominio';

/** Alto de la gráfica. Lo fija el CONTENEDOR, no el componente diferido. */
function altoGrafica(barras: number): number {
  return barras * 44 + 24;
}

/**
 * Carga recharts bajo demanda y **se traga el fallo**.
 *
 * ══ POR QUÉ NO ES `next/dynamic` ══
 * Lo era, y no bastaba. Medido con el chunk de recharts abortado en el
 * navegador —la red que se cae a mitad, que es el escenario que ADR-024 dice
 * haber previsto—: la página entera mostraba «Esta pantalla no se pudo
 * mostrar», **cero tablas y cero encabezados**, después de dos horas de examen.
 *
 * El `ChunkLoadError` de un `dynamic()` sube hasta el límite de error de la
 * ruta y se lleva el informe con él. Y **`loading` no lo absorbe**: se probó
 * restituirlo —era la hipótesis del `accessibility-auditor`— y el fallo se
 * reproduce igual. `loading` pinta mientras carga; no captura.
 *
 * Con un `import()` propio en un efecto, el `catch` es explícito: si el chunk
 * no llega, `Grafica` se queda en `null` y **no se pinta nada más**. La tabla
 * —que es la fuente— ya está en pantalla y no se entera. Eso es lo que ADR-024
 * prometía y ahora sí cumple.
 *
 * El efecto garantiza además que solo corre en el cliente, que es lo que hacía
 * `ssr: false`: recharts mide el contenedor para dibujar y en el servidor
 * produciría un SVG de tamaño equivocado.
 */
function GraficaDiferida({ datos }: { datos: readonly DominioBloque[] }) {
  const [Grafica, setGrafica] = useState<ComponentType<{
    datos: readonly DominioBloque[];
  }> | null>(null);

  useEffect(() => {
    let vivo = true;
    void import('./grafica-dominio')
      .then((m) => {
        if (vivo) setGrafica(() => m.GraficaDominio);
      })
      .catch(() => {
        // Silencio deliberado: no falta ningún dato. La tabla los tiene todos.
      });
    return () => {
      vivo = false;
    };
  }, []);

  return Grafica === null ? null : <Grafica datos={datos} />;
}

export function BarrasDominio({ datos, delta }: PropsDominio) {
  if (datos.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* El hueco se reserva AQUÍ, no dentro del componente diferido: con la
          altura solo dentro, el espacio no existía hasta que recharts llegaba y
          la tabla daba un salto de ~200 px hacia abajo justo cuando el usuario
          empezaba a leerla — en 4G, en la pantalla que este componente existe
          para aligerar.

          Sigue siendo espacio en BLANCO y no un esqueleto: un esqueleto promete
          contenido, y aquí puede no llegar nada. Reservar el sitio no es
          prometer que se llenará; es no mover lo que ya se está leyendo. */}
      <div style={{ minHeight: altoGrafica(datos.length) }}>
        <GraficaDiferida datos={datos} />
      </div>
      <TablaDominio datos={datos} delta={delta} />
    </div>
  );
}
