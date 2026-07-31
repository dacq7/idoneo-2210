// src/app/diagnostico/page.tsx — Server Component.
//
// El diagnóstico inicial: 30 ítems en 35 minutos que producen el plan de
// estudio. Es la puerta de entrada del producto — un usuario nuevo debería
// llegar aquí antes que a ningún módulo.
//
// ══ POR QUÉ REUTILIZA `ControladorSimulacro` ══
// El diagnóstico ES un simulacro cronometrado: mismo muestreo, mismo reloj,
// misma persistencia, misma reanudación, mismo auto-envío. Lo único que cambia
// son tres cosas que ya viajan por prop —el blueprint, el `tipo` y a dónde
// lleva el cierre—, así que un controlador propio sería una copia con otro
// nombre. `guardarIntento` pone `diagnosticoHecho` al ver `tipo: 'diagnostico'`
// (§6), de modo que marcar el hito no necesita código nuevo.
//
// ══ EL CENSO VA FILTRADO, Y ESO ES LA OBLIGACIÓN HEREDADA DEL PASO 11 ══
// `DIAGNOSTICO` es el primer blueprint que filtra: solo `unica`, `emparejar` y
// `caso`, y solo dificultades 1 y 2. Con el censo de ítems *publicados*, la
// viabilidad era una **cota superior** —podía decir «viable» y no serlo—, así
// que aquí se pide `censarModulosPara`, que cuenta aplicando el filtro. Ver
// ADR-025.

import type { Metadata } from 'next';
import { DIAGNOSTICO } from '@/content/blueprint-examen';
import { MODULOS } from '@/content/estructura';
import { ControladorSimulacro } from '@/components/sesion/controlador-simulacro';
import { censarModulosPara, moduloAlternativo } from '@/lib/censo';

export const metadata: Metadata = {
  title: 'Diagnóstico inicial',
  robots: { index: false },
};

export default async function PaginaDiagnostico() {
  const slugs = MODULOS.map((m) => m.slug);
  const [censo, alternativa] = await Promise.all([
    censarModulosPara(DIAGNOSTICO, slugs),
    moduloAlternativo(),
  ]);

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Diagnóstico inicial</h1>
        <p className="text-muted-foreground">
          30 preguntas en 35 minutos para saber por dónde empezar. No se estudia para esto y no
          cuenta como nota: cuanto más honesto sea el resultado, más útil será el plan que sale
          de él.
        </p>
      </header>

      <ControladorSimulacro
        blueprint={DIAGNOSTICO}
        censo={censo}
        slugs={slugs}
        tipo="diagnostico"
        ambito="global"
        bloque={null}
        alternativa={alternativa}
        volver={{ href: '/', texto: 'Volver al inicio' }}
        // Lo que el usuario acaba de ganar es un PLAN, no un porcentaje. El
        // informe completo sigue estando, enlazado desde el plan y desde
        // /progreso.
        destinoCierre={{ href: '/plan', texto: 'Ver mi plan de estudio' }}
      />
    </div>
  );
}
