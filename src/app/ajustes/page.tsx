// src/app/ajustes/page.tsx — Server Component.
//
// ══════════════════════════════════════════════════════════════════════════
// ESTO ES UN ANTICIPO DELIBERADO, Y CONVIENE SABER POR QUÉ EXISTE
// ══════════════════════════════════════════════════════════════════════════
//
// La ruta de ajustes completa es del **paso 18.5**: tema, nombre, fecha de
// examen, exportar/importar JSON, reiniciar, y la cuarentena de ADR-008. Nada
// de eso está aquí.
//
// Lo que hay es una pantalla que **dice la verdad sobre lo que todavía no
// existe**, y está porque `/ajustes` es el **quinto destino de la barra de
// navegación** desde el Paso 5 —y del pie, o sea presente en las 18 rutas—,
// mientras la ruta devolvía **404**.
//
// Con la app a medio construir eso era tolerable. Este paso la declara
// compartible: un entrenador que reciba el enlace y toque «Ajustes» —que es lo
// que uno toca cuando quiere entender una app nueva— aterrizaba en «Esta
// dirección no existe», que parece una app rota, no una app en construcción.
//
// Las dos alternativas eran peores. **Retirar «Ajustes» de `DESTINOS`** deja la
// barra en cuatro destinos y obliga a devolverlo en el 18.5, moviendo la
// navegación bajo los pies de quien ya se acostumbró; además el pie seguiría
// enlazando ahí. **Dejar el 404** es decirle al usuario que se equivocó él.
//
// El 18.5 reemplaza este archivo entero. Lo único que debe conservar es la
// obligación que ya está en `PENDIENTES.md`: exponer la cuarentena de ADR-008.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Palette, RotateCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ajustes',
  robots: { index: false },
};

const LO_QUE_VIENE = [
  {
    icono: Palette,
    titulo: 'Tema y sonido',
    detalle: 'Claro, oscuro o el del sistema. Ahora mismo la app sigue al de tu dispositivo.',
  },
  {
    icono: Download,
    titulo: 'Exportar e importar tu progreso',
    detalle:
      'Un archivo con todo lo tuyo, para pasarlo a otro dispositivo o guardarlo por si acaso.',
  },
  {
    icono: RotateCcw,
    titulo: 'Empezar de cero',
    detalle: 'Borrar el progreso y volver al primer día, con confirmación.',
  },
];

export default function PaginaAjustes() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Ajustes</h1>
        <p className="text-muted-foreground">
          Esta pantalla todavía no está construida. No es un error de la app ni algo que hayas
          hecho mal: es lo siguiente que falta, y preferimos decirlo a enseñarte controles que no
          hacen nada.
        </p>
      </header>

      <section aria-labelledby="lo-que-viene" className="space-y-3">
        <h2 id="lo-que-viene">Lo que habrá aquí</h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {LO_QUE_VIENE.map(({ icono: Icono, titulo, detalle }) => (
            <li key={titulo} className="flex items-start gap-3 px-3 py-3">
              <Icono className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="min-w-0 space-y-0.5">
                <span className="block font-medium">{titulo}</span>
                <span className="block text-[0.8125rem] leading-[1.45] text-muted-foreground">
                  {detalle}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mientras-tanto" className="space-y-3">
        <h2 id="mientras-tanto">Mientras tanto</h2>
        <p className="text-muted-foreground">
          Tu progreso se guarda solo, en este navegador, sin que tengas que hacer nada. Lo que sí
          puedes cambiar ya es{' '}
          <Link href="/plan" className="font-medium text-primary underline underline-offset-2">
            la fecha de tu examen
          </Link>
          , que está en tu plan de estudio y reorganiza el reparto de módulos.
        </p>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Aviso importante hasta que exista el respaldo: como todo vive en este navegador, borrar
          los datos de navegación o usar modo incógnito hace que se pierda. No hay copia en ningún
          servidor.
        </p>
      </section>
    </div>
  );
}
