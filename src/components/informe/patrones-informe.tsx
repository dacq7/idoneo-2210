// src/components/informe/patrones-informe.tsx
//
// Sin directiva de cliente: lo importa `vista-informe.tsx`. No es un alta a §10.3.
//
// La detección de patrón: qué dice el resultado sobre CÓMO estás estudiando,
// no sobre cuánto sabes. Es lo que distingue un informe de una nota.
//
// ══ PUEDE NO MOSTRARSE, Y ESO ES LA FUNCIÓN ══
// `detectarPatrones` devuelve `[]` cuando los datos no sostienen ninguna
// afirmación, y entonces esta sección **no se renderiza**. No se rellena con un
// «¡buen trabajo!»: un informe que siempre encuentra algo que decir enseña al
// usuario a saltárselo, y el día que tenga algo importante que decir no lo va a
// leer.
//
// El desglose por nivel cognitivo sí se muestra siempre que haya datos, porque
// es el dato del que sale el patrón — y con él el usuario puede ver el
// razonamiento en vez de tener que creerse la conclusión.

import { Lightbulb } from 'lucide-react';
import type { DesgloseIntento, NivelCognitivo } from '@/lib/tipos';

const ROTULO: Record<NivelCognitivo, string> = {
  recuerdo: 'Recuerdo',
  comprension: 'Comprensión',
  aplicacion: 'Aplicación',
};

const EXPLICACION: Record<NivelCognitivo, string> = {
  recuerdo: 'datos y definiciones exactas',
  comprension: 'distinguir conceptos parecidos',
  aplicacion: 'usarlo en un caso concreto',
};

export function PatronesInforme({
  patrones,
  desglose,
}: {
  patrones: readonly string[];
  desglose: DesgloseIntento;
}) {
  const niveles = (['recuerdo', 'comprension', 'aplicacion'] as NivelCognitivo[])
    .map((n) => ({ nivel: n, ...desglose.porNivel[n] }))
    .filter((n) => n.total > 0);

  if (niveles.length === 0 && patrones.length === 0) return null;

  return (
    <section aria-labelledby="titulo-patrones" className="space-y-3">
      <h2 id="titulo-patrones">Cómo estás fallando</h2>

      {niveles.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Aciertos por nivel cognitivo: qué tipo de pregunta se te da mejor
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b-2 border-border px-3 py-2 text-left font-semibold">
                  Nivel
                </th>
                <th scope="col" className="border-b-2 border-border px-3 py-2 text-right font-semibold">
                  Aciertos
                </th>
                <th scope="col" className="border-b-2 border-border px-3 py-2 text-right font-semibold">
                  Dominio
                </th>
              </tr>
            </thead>
            <tbody>
              {niveles.map((n) => (
                <tr key={n.nivel}>
                  <th scope="row" className="border-b border-border px-3 py-2 text-left font-normal">
                    <span className="font-medium">{ROTULO[n.nivel]}</span>{' '}
                    <span className="text-muted-foreground">— {EXPLICACION[n.nivel]}</span>
                  </th>
                  <td className="border-b border-border px-3 py-2 text-right font-mono tabular-nums">
                    {n.correctas}/{n.total}
                  </td>
                  <td className="border-b border-border px-3 py-2 text-right font-mono font-semibold tabular-nums">
                    {Math.round((n.correctas / n.total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {patrones.length > 0 ? (
        <ul className="space-y-2">
          {patrones.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-md border-l-4 border-primary bg-primary/5 p-3 text-[0.9375rem] leading-[1.5]"
            >
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">
          No hay un patrón claro en cómo fallaste: los errores están repartidos entre los tres
          niveles. Con más simulacros el informe podrá decir algo más fino.
        </p>
      )}
    </section>
  );
}
