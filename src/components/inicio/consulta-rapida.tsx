// src/components/inicio/consulta-rapida.tsx — sin directiva de cliente, pero
// su único consumidor es `panel-inicio.tsx`, que SÍ la lleva: se compila para el
// cliente. No es un alta a la lista de §10.3 —no usa estado, ni efectos, ni el
// reloj— y decir «Server Component» a secas sería describir mal la frontera,
// que en este proyecto es invariante y no comentario. Lo levantó el
// code-reviewer.
//
// Las tres rutas del Paso 18 que no caben en la barra: glosario, calculadora y
// última noche.
//
// ══ POR QUÉ ENTRAN POR LA PORTADA (ADR-027) ══
// La barra tiene **cinco** destinos y no puede tener seis: A-01 midió que a
// 200 % de zoom las cinco celdas quedan en 38 px, todas visibles por poco, y
// una sexta las deja en ~31 px reabriendo un fallo AA que costó arreglar. El
// Paso 14 resolvió lo mismo para `/plan` y `/diagnostico` por esta puerta, y
// repetir el patrón es preferible a inventar uno nuevo.
//
// Las tres son de **consulta**, no de estudio: se entra, se mira un dato y se
// sale. Esa es exactamente la jerarquía que justifica que no compitan con
// Módulos o Repaso en la navegación diaria.
//
// ══ «ÚLTIMA NOCHE» CAMBIA DE TEXTO SEGÚN LA FECHA ══
// No cambia de sitio ni aparece y desaparece —una opción que se mueve es una
// opción que no se encuentra— pero su descripción sí dice si es su momento.
// Recomendarle a alguien el modo víspera a seis semanas del examen sería
// empujarlo a memorizar cifras cuando todavía tiene que entender conceptos.

import { EnlaceDestino } from './enlace-destino';

export function ConsultaRapida({
  diasHastaExamen,
  totalGlosario,
  totalDatosDuros,
}: {
  diasHastaExamen: number | null;
  /** Cuenta real del catálogo. Llega por prop porque esta ruta es cliente y no
   *  puede importar `content/` (ADR-010); escribir «123» a mano caduca sola. */
  totalGlosario: number;
  totalDatosDuros: number;
}) {
  const esVispera = diasHastaExamen !== null && diasHastaExamen >= 0 && diasHastaExamen <= 2;

  return (
    <section aria-labelledby="titulo-consulta" className="space-y-3">
      <h2 id="titulo-consulta">Consulta rápida</h2>
      <ul className="divide-y divide-border rounded-lg border border-border">
        <li>
          <EnlaceDestino
            href="/glosario"
            titulo="Glosario"
            detalle={`${totalGlosario} conceptos con su definición y el módulo donde se explican.`}
          />
        </li>
        <li>
          <EnlaceDestino
            href="/herramientas"
            titulo="Calculadora"
            detalle="FCmáx, zonas, densidad, MET e IMC, con la fórmula a la vista."
          />
        </li>
        <li>
          <EnlaceDestino
            href="/ultima-noche"
            titulo="Última noche"
            detalle={
              esVispera
                ? `Es tu momento: los ${totalDatosDuros} valores exactos, sin teoría alrededor.`
                : `Los ${totalDatosDuros} valores exactos, sin teoría. Para la víspera del examen.`
            }
          />
        </li>
      </ul>
    </section>
  );
}
