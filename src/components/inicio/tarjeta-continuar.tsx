'use client';

// src/components/inicio/tarjeta-continuar.tsx — Client Component (§10.3).
//
// «Continuar donde ibas»: la única pregunta que la portada tiene que responder.
//
// ══════════════════════════════════════════════════════════════════════════
// UNA SOLA ACCIÓN PRIMARIA, ELEGIDA POR PRIORIDAD
// ══════════════════════════════════════════════════════════════════════════
//
// La portada no ofrece cinco caminos con el mismo peso: elige **uno** y lo pone
// grande. El usuario abre la app de noche, cansado, con quince minutos: decidir
// por dónde empezar es trabajo que la app puede hacerle.
//
// El orden de prioridad, y cada escalón tiene su razón:
//
//  1. **Un examen a medias.** Si su cronómetro sigue vivo, cualquier otra cosa
//     que le ofrezcamos le está costando tiempo de examen. Si ya venció, el
//     escalón sigue ganando —hay que cerrarlo— pero **lo dice**: afirmar que el
//     reloj corre sobre un examen agotado hace tres días es falso.
//  2. **El examen es hoy o ya pasó.** Ese día no se estudia materia nueva, y el
//     plan lo dice con esas palabras: la portada no puede contradecirlo.
//  3. **El diagnóstico, si no lo ha hecho.** Es lo que convierte el plan genérico
//     en uno suyo, y cuanto antes lo haga, más días de plan aprovecha.
//  4. **Lo que toca hoy según el plan.** El plan ya resolvió el orden; repetir
//     aquí ese cálculo sería tener dos fuentes de verdad.
//  5. **La cola de repaso**, si hay algo vencido.
//  6. **El siguiente módulo sin dominar**, en el orden del plan.
//  7. **Nada publicado todavía** — hoy, con 28 de 29 módulos en preparación,
//     este es un escalón real y no un caso teórico.
//
// **El repaso va DESPUÉS del módulo del día, y es deliberado.** Una versión
// anterior de este comentario decía lo contrario —«lo que estás a punto de
// olvidar vale más que lo que aún no has visto»— y defendía un orden que el
// código no tenía. El orden correcto es el que está: el plan ya pesó qué toca
// hoy contando debilidad, peso del bloque y prerequisitos, y saltárselo por una
// tarjeta vencida desordena el estudio. Lo que sí gana al plan es el repaso
// cuando el módulo del día **ya está dominado**, y eso lo resuelve el escalón 4
// saltándose los dominados.

import Link from 'next/link';
import { ArrowRight, BookOpen, ClipboardCheck, RotateCcw, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AccionPrincipal {
  href: string;
  /** El titular de la tarjeta. Dice QUÉ es, no «continuar». */
  titulo: string;
  /** Una frase que dice por qué esto y no otra cosa. */
  porque: string;
  /** Texto del botón. Verbo en infinitivo. */
  accion: string;
  clase: 'simulacro' | 'diagnostico' | 'plan' | 'repaso' | 'modulo' | 'vacio';
}

const ICONO: Record<AccionPrincipal['clase'], LucideIcon> = {
  simulacro: Timer,
  diagnostico: ClipboardCheck,
  plan: BookOpen,
  repaso: RotateCcw,
  modulo: BookOpen,
  vacio: BookOpen,
};

export function TarjetaContinuar({ accion }: { accion: AccionPrincipal }) {
  const Icono = ICONO[accion.clase];

  return (
    <section
      aria-labelledby="titulo-continuar"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Icono className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0 space-y-1">
          <h2 id="titulo-continuar">{accion.titulo}</h2>
          <p className="text-muted-foreground">{accion.porque}</p>
        </div>
      </div>

      {/* 52 px: es la acción principal de la app y se pulsa con el pulgar
          (DISENO.md §3, la medida reservada a la respuesta de un ítem — y esto
          lo es en importancia). */}
      <Link
        href={accion.href}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-[0.9375rem] font-medium text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90"
      >
        {accion.accion}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
