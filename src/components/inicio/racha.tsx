'use client';

// src/components/inicio/racha.tsx — Client Component (§10.3).
//
// Los días seguidos estudiando. Es el único elemento de la app que se parece a
// una mecánica de juego, así que conviene decir qué hace y qué NO hace.
//
// ══ NO CELEBRA, INFORMA ══
// Sin confeti, sin insignias, sin «¡vas genial!». DISENO.md §1.1: los usuarios
// son entrenadores adultos que estudian de noche después de trabajar, y la app
// no los infantiliza. La racha está porque **volver mañana es la conducta que
// más correlaciona con aprobar**, no porque haya que premiar nada.
//
// ══ Y NO CASTIGA ══
// Una racha rota no se señala en rojo ni se lamenta. Se dice el número y ya:
// quien se saltó tres días lo sabe, y recordárselo con tono de reproche es la
// forma más rápida de que cierre la app y no vuelva.
//
// ══ QUIÉN TOCA LA RACHA ══
// La **portada**, en un efecto, una vez por visita. No este componente: pintar
// un dato y escribirlo son responsabilidades distintas, y si el que pinta
// escribe, cada vez que el componente se remonte —una navegación, un cambio de
// tema— tocaría el progreso otra vez.

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Racha({ dias }: { dias: number }) {
  if (dias <= 0) return null;

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5',
        'text-[0.8125rem]',
      )}
    >
      <Flame className="size-4 shrink-0 text-aviso" aria-hidden="true" />
      {/* El número y su unidad en el mismo texto: un «7» suelto junto a una
          llama obliga a deducir qué mide. */}
      <span>
        <span className="font-mono font-semibold tabular-nums">{dias}</span>{' '}
        {dias === 1 ? 'día seguido' : 'días seguidos'}
      </span>
    </p>
  );
}
