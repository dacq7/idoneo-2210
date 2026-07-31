// src/app/ultima-noche/page.tsx — Server Component.
//
// El modo víspera (§15.2): los 70 datos duros, sin teoría, para el día anterior
// al examen.
//
// ══ NO REGISTRA PROGRESO NI ALIMENTA EL SRS ══
// §15.2 lo fija y hay una razón concreta detrás: meter 70 elementos en la cola
// de repaso espaciado **la víspera del examen** llenaría los próximos días de
// tarjetas que ya no sirven para nada, y arruinaría la cola que el usuario
// construyó en semanas. Es una vista de consulta y se queda en eso.
//
// El contador de «lo sabía / no lo sabía» del modo repaso vive en memoria y
// muere al salir de la pantalla. Es deliberado por lo mismo.

import type { Metadata } from 'next';
import { CATEGORIAS_DATOS_DUROS, DATOS_DUROS } from '@/content/datos-duros';
import { MODULOS_POR_SLUG } from '@/content/estructura';
import { MazoDatosDuros } from '@/components/ultima-noche/mazo-datos-duros';

export const metadata: Metadata = {
  title: 'Última noche',
  robots: { index: false },
};

export default function PaginaUltimaNoche() {
  const datos = DATOS_DUROS.map((d) => ({
    id: d.id,
    categoria: d.categoria,
    concepto: d.concepto,
    valor: d.valor,
    // Solo el bloque: la vista no enlaza al módulo, así que `modulo` y
    // `publicado` viajaban sin que nadie los leyera (ADR-026).
    bloque: MODULOS_POR_SLUG.get(d.modulo)?.bloque ?? 'A',
  }));

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Última noche</h1>
        <p className="text-muted-foreground">
          Los {datos.length} valores que se preguntan con cifra exacta, sin teoría alrededor. Es
          para la víspera: repasar números, no aprender conceptos.
        </p>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Esta pantalla no guarda nada ni añade tarjetas a tu repaso. Llenar la cola de repaso la
          noche anterior no te serviría de nada al día siguiente.
        </p>
      </header>

      <MazoDatosDuros datos={datos} categorias={CATEGORIAS_DATOS_DUROS} />
    </div>
  );
}
