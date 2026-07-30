// content/datos-duros.ts
// Los valores que se preguntan con número exacto. Cada uno DEBE existir
// también como tarjeta y como al menos un ítem del banco.

import type { DatoDuro } from '@/lib/tipos';

export const DATOS_DUROS: DatoDuro[] = [
  /* ── Vías energéticas ── */
  { id: 'DD-001', categoria: 'Vías energéticas', concepto: 'ATP almacenado en el músculo', valor: '2–3 s', modulo: 'c1-vias-energeticas' },
  { id: 'DD-002', categoria: 'Vías energéticas', concepto: 'Sistema fosfágeno (PCr)', valor: '5–15 s de esfuerzo máximo · depende de la intensidad y de las reservas de PCr', modulo: 'c1-vias-energeticas' },
  { id: 'DD-003', categoria: 'Vías energéticas', concepto: 'Reacción de la fosfocreatina', valor: 'PCr + ADP → Creatina + ATP · enzima: creatina quinasa', modulo: 'c1-vias-energeticas' },
  { id: 'DD-004', categoria: 'Vías energéticas', concepto: 'Glucólisis anaeróbica', valor: '30 s – 2 min · produce lactato', modulo: 'c1-vias-energeticas' },
  { id: 'DD-005', categoria: 'Vías energéticas', concepto: 'Glucólisis, fase citoplasmática', valor: '2 ATP netos + 2 NADH', modulo: 'c1-vias-energeticas' },
  { id: 'DD-006', categoria: 'Vías energéticas', concepto: 'ATP total por glucosa en aerobiosis', valor: '30–32 ATP · 30 en músculo esquelético', modulo: 'c1-vias-energeticas' },
  { id: 'DD-007', categoria: 'Vías energéticas', concepto: 'Oxidación del palmitato', valor: '≈129 ATP', modulo: 'c1-vias-energeticas' },
  { id: 'DD-008', categoria: 'Vías energéticas', concepto: 'Dónde ocurre cada fase', valor: 'Glucólisis → citoplasma · Krebs → matriz mitocondrial · Cadena de transporte → membrana interna mitocondrial', modulo: 'c1-vias-energeticas' },

  /* ── Fuerza y %1RM ── */
  { id: 'DD-010', categoria: 'Fuerza y %1RM', concepto: 'Fuerza máxima (aláctico)', valor: '>85 % 1RM · <15 s · <6 reps · 2–5 min de descanso', modulo: 'd3-fuerza' },
  { id: 'DD-011', categoria: 'Fuerza y %1RM', concepto: 'Hipertrofia (láctico)', valor: '70–85 % 1RM · 20–40 s · 6–12 reps · 30 s–1\'30" de descanso', modulo: 'd3-fuerza' },
  { id: 'DD-012', categoria: 'Fuerza y %1RM', concepto: 'Resistencia muscular (aeróbico)', valor: '≥45 s · ≥15 reps · ≤30 s de descanso', modulo: 'd3-fuerza' },

  /* ── Cardiovascular ── */
  { id: 'DD-020', categoria: 'Cardiovascular', concepto: 'FC en reposo normal', valor: '50–100 lpm', modulo: 'c2-cardiovascular' },
  { id: 'DD-021', categoria: 'Cardiovascular', concepto: 'Fox et al. (1971)', valor: 'FCmáx = 220 − edad', modulo: 'c2-cardiovascular' },
  { id: 'DD-022', categoria: 'Cardiovascular', concepto: 'Astrand (1952)', valor: 'FCmáx = 216,6 − (0,84 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-023', categoria: 'Cardiovascular', concepto: 'Tanaka et al. (2001)', valor: 'FCmáx = 208 − (0,7 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-024', categoria: 'Cardiovascular', concepto: 'Gellish et al. (2007)', valor: 'FCmáx = 207 − (0,7 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-025', categoria: 'Cardiovascular', concepto: 'Gulati et al. (2010) — mujeres', valor: 'FCmáx = 206 − (0,88 × edad)', modulo: 'c2-cardiovascular' },
  { id: 'DD-026', categoria: 'Cardiovascular', concepto: 'FC de reserva', valor: 'FCmáx − FC en reposo', modulo: 'c2-cardiovascular' },
  { id: 'DD-027', categoria: 'Cardiovascular', concepto: 'Gasto cardíaco', valor: 'GC = FC × volumen sistólico', modulo: 'c2-cardiovascular' },
  { id: 'DD-028', categoria: 'Cardiovascular', concepto: 'Conversión de pulso a lpm', valor: '×4 (15 s) · ×6 (10 s) · ×10 (6 s)', modulo: 'c2-cardiovascular' },
  { id: 'DD-029', categoria: 'Cardiovascular', concepto: 'Adaptación por tipo de esfuerzo', valor: 'Dinámico/resistencia → dilatación → ↑volumen sistólico · Isométrico/fuerza → hipertrofia → ↑fuerza de contracción', modulo: 'c2-cardiovascular' },

  /* ── Respiratorio ── */
  { id: 'DD-030', categoria: 'Respiratorio', concepto: '1 MET', valor: '3,5 ml O₂ · kg⁻¹ · min⁻¹', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-031', categoria: 'Respiratorio', concepto: 'VO₂', valor: 'VO₂ = gasto cardíaco × diferencia arteriovenosa', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-032', categoria: 'Respiratorio', concepto: 'Diferencia a-vO₂ en reposo', valor: '5 ml O₂ / 100 ml de sangre', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-033', categoria: 'Respiratorio', concepto: 'Diferencia a-vO₂ en ejercicio', valor: '15–17 ml O₂ / 100 ml de sangre', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-034', categoria: 'Respiratorio', concepto: 'VO₂máx hombres sedentarios 20–40 a', valor: '35–45 ml/kg/min', modulo: 'c3-respiratorio-vo2' },
  { id: 'DD-035', categoria: 'Respiratorio', concepto: 'VO₂máx mujeres sedentarias 20–40 a', valor: '30–40 ml/kg/min', modulo: 'c3-respiratorio-vo2' },

  /* ── Umbrales y zonas ── */
  { id: 'DD-040', categoria: 'Umbrales y zonas', concepto: 'R0 — recuperación', valor: '<65 % · calentamiento, recuperación activa, eliminación de desechos', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-041', categoria: 'Umbrales y zonas', concepto: 'R1 · VT1 — umbral aeróbico', valor: '65–75 % · 99 % aeróbico / 1 % anaeróbico · 20–40 % grasas y 60–80 % HC', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-042', categoria: 'Umbrales y zonas', concepto: 'R2 · VT2 — umbral anaeróbico', valor: '75–85 % del VO₂máx · 80–90 % de la FCmáx · 95 % aeróbico / 5 % anaeróbico · contiene el MLSS', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-043', categoria: 'Umbrales y zonas', concepto: 'R3 / R3+ — VO₂máx', valor: '90–95 % · 65 % aeróbico / 35 % anaeróbico · sustrato: glucógeno · aquí van HIIT y SIT', modulo: 'c5-umbrales-zonas' },
  { id: 'DD-044', categoria: 'Umbrales y zonas', concepto: 'Modelos de distribución', valor: 'Baja intensidad/alto volumen (90 % bajo VT1) · Alta intensidad/bajo volumen · Entre umbrales (tempo) · Polarizado (evita la zona 2)', modulo: 'c5-umbrales-zonas' },

  /* ── Nutrición deportiva ── */
  { id: 'DD-050', categoria: 'Nutrición deportiva', concepto: 'Hidratación previa', valor: '250–500 ml de agua', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-051', categoria: 'Nutrición deportiva', concepto: 'Sesión <60 min', valor: 'Agua es suficiente', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-052', categoria: 'Nutrición deportiva', concepto: 'Sesión >60 min', valor: 'Bebida deportiva con CHO y electrolitos', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-053', categoria: 'Nutrición deportiva', concepto: 'Comida rica en CHO previa', valor: '2–4 h antes', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-054', categoria: 'Nutrición deportiva', concepto: 'Reposición de glucógeno', valor: 'CHO de alto índice glucémico, 30–60 min post', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-055', categoria: 'Nutrición deportiva', concepto: 'Proteína post-entrenamiento', valor: '20–40 g de alta calidad', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-056', categoria: 'Nutrición deportiva', concepto: 'Proporción de recuperación', valor: 'CHO : proteína = 3:1 o 4:1', modulo: 'c7-nutricion-deportiva' },
  { id: 'DD-057', categoria: 'Nutrición deportiva', concepto: 'Ultra-resistencia (>4 h)', valor: 'Único caso donde se consume proteína durante el esfuerzo', modulo: 'c7-nutricion-deportiva' },

  /* ── Biomarcadores ── */
  { id: 'DD-060', categoria: 'Biomarcadores', concepto: 'Glucosa en ayunas', valor: '70–100 mg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-061', categoria: 'Biomarcadores', concepto: 'Hemoglobina', valor: '♂ 13,8–17,2 · ♀ 12,1–15,1 g/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-062', categoria: 'Biomarcadores', concepto: 'Hematocrito', valor: '♂ 40–52 % · ♀ 36–48 %', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-063', categoria: 'Biomarcadores', concepto: 'Ferritina', valor: '♂ 20–250 · ♀ 12–150 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-064', categoria: 'Biomarcadores', concepto: 'Lactato en reposo', valor: '0,5–2,2 mmol/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-065', categoria: 'Biomarcadores', concepto: 'Creatina quinasa (CK)', valor: '♂ 55–170 · ♀ 30–135 U/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-066', categoria: 'Biomarcadores', concepto: 'Mioglobina', valor: '10–95 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-067', categoria: 'Biomarcadores', concepto: 'Proteína C reactiva', valor: '<3 mg/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-068', categoria: 'Biomarcadores', concepto: 'Cortisol matutino', valor: '6–23 µg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-069', categoria: 'Biomarcadores', concepto: 'Testosterona total', valor: '♂ 270–1070 · ♀ 15–70 ng/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-070', categoria: 'Biomarcadores', concepto: 'Relación testosterona/cortisol', valor: '>30 (por debajo indica sobrecarga)', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-071', categoria: 'Biomarcadores', concepto: 'IGF-1', valor: '100–300 ng/mL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-072', categoria: 'Biomarcadores', concepto: 'Ácido úrico', valor: '3,5–7,2 mg/dL', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-073', categoria: 'Biomarcadores', concepto: 'Malondialdehído (MDA)', valor: '1–2 µmol/L', modulo: 'a5-sistemas-energeticos-biomarcadores' },
  { id: 'DD-074', categoria: 'Biomarcadores', concepto: 'Relación GSH/GSSG', valor: '>10', modulo: 'a5-sistemas-energeticos-biomarcadores' },

  /* ── Estadística ── */
  { id: 'DD-080', categoria: 'Estadística', concepto: 'Media', valor: 'Σx / n', modulo: 'a6-estadistica' },
  { id: 'DD-081', categoria: 'Estadística', concepto: 'Mediana (n impar)', valor: 'Posición (N+1)/2 de la lista ordenada', modulo: 'a6-estadistica' },
  { id: 'DD-082', categoria: 'Estadística', concepto: 'Mediana (n par)', valor: 'Promedio de las posiciones N/2 y (N/2)+1', modulo: 'a6-estadistica' },
  { id: 'DD-083', categoria: 'Estadística', concepto: 'Varianza', valor: 'Σ(x − x̄)² / n', modulo: 'a6-estadistica' },
  { id: 'DD-084', categoria: 'Estadística', concepto: 'Desviación estándar', valor: '√varianza', modulo: 'a6-estadistica' },
  { id: 'DD-085', categoria: 'Estadística', concepto: 'Rango', valor: 'máximo − mínimo', modulo: 'a6-estadistica' },
  { id: 'DD-086', categoria: 'Estadística', concepto: 'Porcentaje de aumento', valor: '((nuevo − viejo) / viejo) × 100', modulo: 'a6-estadistica' },

  /* ── Carga ── */
  { id: 'DD-090', categoria: 'Carga', concepto: 'Densidad', valor: 'Tiempo de trabajo activo / tiempo total', modulo: 'd2-carga' },
  { id: 'DD-091', categoria: 'Carga', concepto: 'Ejemplo de densidad', valor: '30 s trabajo + 60 s descanso → 30/90 = 0,33 (33 %). Con 30 s de descanso → 30/60 = 0,5 (50 %)', modulo: 'd2-carga' },
  { id: 'DD-092', categoria: 'Carga', concepto: 'Escala de esfuerzo percibido', valor: 'Escala de Borg (RPE)', modulo: 'd2-carga' },

  /* ── Ley 2210 y dopaje ── */
  { id: 'DD-100', categoria: 'Ley 2210 y dopaje', concepto: 'Requisitos de idoneidad', valor: '>18 años · ≥12 meses de experiencia · aprobar la evaluación en una categoría', modulo: 'd1-conceptualizacion' },
  { id: 'DD-101', categoria: 'Ley 2210 y dopaje', concepto: 'Niveles de la Ley 2210', valor: 'Formación · perfeccionamiento · altos logros', modulo: 'd1-conceptualizacion' },
  { id: 'DD-102', categoria: 'Ley 2210 y dopaje', concepto: 'Estrategias del programa antidopaje', valor: 'Educación · disuasión · detección', modulo: 'c9-dopaje' },
  { id: 'DD-103', categoria: 'Ley 2210 y dopaje', concepto: 'Infracciones del Artículo 2', valor: '11 infracciones', modulo: 'c9-dopaje' },
  { id: 'DD-104', categoria: 'Ley 2210 y dopaje', concepto: 'Localización fallida (2.4)', valor: 'Dentro de un período de doce meses (memorizar como está en la cartilla)', modulo: 'c9-dopaje' },
];

export const CATEGORIAS_DATOS_DUROS = [...new Set(DATOS_DUROS.map((d) => d.categoria))];
