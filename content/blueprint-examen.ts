// content/blueprint-examen.ts
// Un solo archivo parametriza los cuatro exámenes. Si aparece información
// oficial del formato real, se cambia este archivo y nada más: el motor no se
// toca. Es la mitigación del riesgo "no se conoce el formato exacto del examen".

import type { BloqueId, BlueprintExamen } from '@/lib/tipos';
import { BLOQUES, modulosDelBloque } from './estructura';

/** Reparto proporcional con método de mayores restos: la suma da exacto. */
function repartirProporcional(claves: string[], total: number): Record<string, number> {
  const base = Math.floor(total / claves.length);
  const resto = total - base * claves.length;
  const salida: Record<string, number> = {};
  claves.forEach((c, i) => {
    salida[c] = base + (i < resto ? 1 : 0);
  });
  return salida;
}

/* ─── Diagnóstico: 30 ítems · 35 min ──────────────────────────────── */

export const DIAGNOSTICO: BlueprintExamen = {
  id: 'diagnostico',
  titulo: 'Diagnóstico inicial',
  descripcion:
    '30 ítems en 35 minutos. Sin retroalimentación durante la prueba. Al terminar recibes un mapa de calor por bloque y tu plan de estudio.',
  totalItems: 30,
  minutos: 35,
  reparto: { tipo: 'bloque', cuotas: { A: 6, B: 7, C: 10, D: 7 } },
  porNivel: { recuerdo: 14, comprension: 10, aplicacion: 6 },
  tiposPermitidos: ['unica', 'emparejar', 'caso'],
  dificultadesPermitidas: [1, 2],
  feedbackInmediato: false,
};

/* ─── Simulacro final: 100 ítems · 120 min ────────────────────────── */

export const FINAL: BlueprintExamen = {
  id: 'final',
  titulo: 'Simulacro final',
  descripcion:
    '100 ítems en 120 minutos, con la misma distribución del examen real. Se envía solo al llegar a cero.',
  totalItems: 100,
  minutos: 120,
  reparto: {
    tipo: 'modulo',
    cuotas: {
      // Bloque A — 20
      'a1-celula': 3,
      'a2-terminologia-anatomica': 3,
      'a3-tejidos-organos-sistemas': 5,
      'a4-nutrientes': 4,
      'a5-sistemas-energeticos-biomarcadores': 3,
      'a6-estadistica': 2,
      // Bloque B — 22
      'b1-fundamentos-pedagogia': 4,
      'b2-principios': 5,
      'b3-modelos-pedagogicos': 3,
      'b4-componentes-didacticos': 4,
      'b5-estilos-ensenanza': 3,
      'b6-aprendizaje-sesion': 3,
      // Bloque C — 33
      'c1-vias-energeticas': 5,
      'c2-cardiovascular': 4,
      'c3-respiratorio-vo2': 4,
      'c4-nervioso-digestivo-osteomuscular': 4,
      'c5-umbrales-zonas': 4,
      'c6-biomecanica': 3,
      'c7-nutricion-deportiva': 3,
      'c8-psicologia-deporte': 3,
      'c9-dopaje': 3,
      // Bloque D — 25
      'd1-conceptualizacion': 2,
      'd2-carga': 5,
      'd3-fuerza': 4,
      'd4-resistencia': 4,
      'd5-velocidad': 3,
      'd6-flexibilidad': 3,
      'd7-modelos-planificacion': 2,
      'd8-estructuras': 2,
    },
  },
  porNivel: { recuerdo: 40, comprension: 35, aplicacion: 25 },
  porTipo: { unica: 65, caso: 10, calculo: 8, multiple: 7, emparejar: 5, ordenar: 3, vf: 2 },
  feedbackInmediato: false,
};

/* ─── Simulacro de bloque: 40 ítems · 50 min ──────────────────────── */

export function blueprintBloque(bloqueId: BloqueId): BlueprintExamen {
  const bloque = BLOQUES.find((b) => b.id === bloqueId);
  const slugs = modulosDelBloque(bloqueId).map((m) => m.slug);
  return {
    id: `bloque-${bloqueId}`,
    titulo: `Simulacro del bloque ${bloqueId} — ${bloque?.titulo ?? ''}`,
    descripcion: '40 ítems en 50 minutos, repartidos entre los módulos del bloque.',
    totalItems: 40,
    minutos: 50,
    reparto: { tipo: 'modulo', cuotas: repartirProporcional(slugs, 40) },
    porNivel: { recuerdo: 16, comprension: 14, aplicacion: 10 },
    feedbackInmediato: false,
  };
}

/* ─── Quiz de módulo: 10 ítems · sin cronómetro ───────────────────── */

export function blueprintQuiz(slug: string): BlueprintExamen {
  return {
    id: `quiz-${slug}`,
    titulo: 'Quiz del módulo',
    descripcion: '10 ítems sin cronómetro. La retroalimentación llega al final, no ítem por ítem.',
    totalItems: 10,
    minutos: null,
    reparto: { tipo: 'modulo', cuotas: { [slug]: 10 } },
    porNivel: { recuerdo: 4, comprension: 3, aplicacion: 3 },
    feedbackInmediato: false,
  };
}

/* ─── Práctica de módulo: 8 ítems · feedback inmediato ────────────── */

export function blueprintPractica(slug: string): BlueprintExamen {
  return {
    id: `practica-${slug}`,
    titulo: 'Práctica del módulo',
    descripcion: 'Ítems con explicación inmediata. Aquí se aprende, no se mide.',
    totalItems: 8,
    minutos: null,
    reparto: { tipo: 'modulo', cuotas: { [slug]: 8 } },
    porNivel: { recuerdo: 3, comprension: 3, aplicacion: 2 },
    feedbackInmediato: true,
  };
}

/** Los blueprints estáticos que el validador comprueba en cada build. */
export const BLUEPRINTS: Record<string, BlueprintExamen> = {
  diagnostico: DIAGNOSTICO,
  final: FINAL,
  'bloque-A': blueprintBloque('A'),
  'bloque-B': blueprintBloque('B'),
  'bloque-C': blueprintBloque('C'),
  'bloque-D': blueprintBloque('D'),
};
