// content/blueprint-examen.ts
// Un solo archivo parametriza los cuatro exámenes. Si aparece información
// oficial del formato real, se cambia este archivo y nada más: el motor no se
// toca. Es la mitigación del riesgo "no se conoce el formato exacto del examen".
//
// Vacío a propósito: el paso 6 copia §9.2 completo (DIAGNOSTICO, FINAL,
// blueprintBloque, blueprintQuiz, blueprintPractica y el mapa BLUEPRINTS).
// No adelantarlo: §9.2 codifica los 29 slugs y las cuotas por módulo, y el
// validador los cruza contra el banco, que todavía no existe.

import type { BlueprintExamen } from '@/lib/tipos';

/** Los blueprints estáticos que el validador comprueba en cada build. */
export const BLUEPRINTS: Record<string, BlueprintExamen> = {};
