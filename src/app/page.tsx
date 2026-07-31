// src/app/page.tsx — Server Component. La portada.
//
// Reemplaza la provisional del Paso 5. Responde una sola pregunta —«¿qué hago
// ahora?»— y todo lo demás de la pantalla existe para justificar la respuesta.
//
// ══ ES LA ÚNICA RUTA CON SEO (§10.1) ══
// El resto de la app es privada de facto: no hay contenido público que indexar,
// así que las demás rutas exportan `robots: { index: false }`. Aquí sí hay
// metadata completa, porque compartir la app es mandar un link y ese link
// aterriza en esta pantalla.
//
// ══ FRONTERA (ADR-010 · ADR-026) ══
// Los módulos se proyectan a los siete campos que el panel necesita. Pasar los
// `Modulo` completos costaría 4 457 B gz por nada — la lección de ADR-026, que
// nació de haber escrito «ahorraría poco» sin medirlo.

import type { Metadata } from 'next';
import { BLOQUES, MODULOS } from '@/content/estructura';
import { PanelInicio } from '@/components/inicio/panel-inicio';

export const metadata: Metadata = {
  title: 'Idóneo 2210 — Evaluación de Idoneidad del Entrenador Deportivo',
  description:
    'Preparación para la Evaluación de Idoneidad exigida por la Ley 2210 de 2022 (COLEF/COCED). 29 módulos con teoría, tarjetas y quiz, repaso espaciado y simulacros cronometrados. Funciona sin conexión y sin registro.',
  openGraph: {
    title: 'Idóneo 2210',
    description:
      'Estudio dirigido y simulacros cronometrados para la Evaluación de Idoneidad del Entrenador Deportivo (Ley 2210 de 2022).',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function Inicio() {
  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          Ley 2210 de 2022 · COLEF / COCED
        </p>
        <h1>Idóneo 2210</h1>
        <p className="text-muted-foreground">
          Estudio dirigido para la Evaluación de Idoneidad del Entrenador Deportivo. Todo tu
          progreso vive en este navegador: sin cuentas, sin correo, sin contraseña.
        </p>
      </header>

      <PanelInicio
        modulos={MODULOS.map((m) => ({
          slug: m.slug,
          titulo: m.titulo,
          bloque: m.bloque,
          orden: m.orden,
          minutosEstimados: m.minutosEstimados,
          prerequisitos: m.prerequisitos,
          publicado: m.estadoContenido === 'completo',
        }))}
        bloques={BLOQUES.map((b) => ({ id: b.id, pesoExamen: b.pesoExamen }))}
      />
    </div>
  );
}
