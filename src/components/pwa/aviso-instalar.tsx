'use client';

// src/components/pwa/aviso-instalar.tsx — Client Component (§10.3).
//
// ══ POR QUÉ NO APARECE EL PRIMER DÍA ══
// §16 lo fija y conviene no relajarlo: el banner sale **al tercer día de racha**,
// no en la primera visita. Un aviso de instalación antes de que la app haya
// demostrado nada es la forma más rápida de que lo cierren para siempre, y
// `beforeinstallprompt` es de un solo uso por visita: gastarlo pronto lo gasta
// mal.
//
// ══ POR QUÉ VIVE EN LA PORTADA Y NO EN `Shell` ══
// Montarlo en el armazón lo pondría en las 20 rutas y volvería a meter
// `almacenamiento.ts` —y con él Zod— en el grafo del **layout raíz**, que es
// exactamente el problema que ADR-021 costó 16 kB gz en todas las rutas.
// La portada ya paga ese grafo, y además es donde se toca la racha.
//
// ══ QUÉ NO HACE ══
// No implementa la instalación en iOS, donde `beforeinstallprompt` no existe y
// hay que usar «Compartir → Añadir a pantalla de inicio». El componente
// simplemente no aparece en Safari, y esa instrucción vive en /ajustes, que es
// donde alguien la busca. Prefiero no aparecer a enseñar un botón que no
// funciona.

import { useCallback, useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { avisoInstalarDescartado, descartarAvisoInstalar } from '@/lib/almacenamiento';

/** Días de racha a partir de los cuales el aviso se considera ganado. */
const DIAS_PARA_OFRECER = 3;

/** El evento no está en lib.dom: Chromium lo define, el estándar no. */
interface EventoInstalacion extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function AvisoInstalar({ diasDeRacha }: { diasDeRacha: number }) {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [oculto, setOculto] = useState(true);

  useEffect(() => {
    // `avisoInstalarDescartado` lee localStorage: en efecto, no en render.
    if (avisoInstalarDescartado()) return;

    const alPoder = (e: Event) => {
      // Sin preventDefault, Chromium enseña su propio mini-infobar y el evento
      // deja de estar disponible para el botón de abajo.
      e.preventDefault();
      setEvento(e as EventoInstalacion);
      setOculto(false);
    };
    window.addEventListener('beforeinstallprompt', alPoder);
    return () => window.removeEventListener('beforeinstallprompt', alPoder);
  }, []);

  const cerrar = useCallback(() => {
    setOculto(true);
    descartarAvisoInstalar();
  }, []);

  const instalar = useCallback(async () => {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice;
    // Se cierra pase lo que pase: el evento ya se consumió y volver a mostrar
    // el banner con un botón muerto sería peor que no mostrarlo.
    setOculto(true);
    descartarAvisoInstalar();
  }, [evento]);

  if (oculto || !evento || diasDeRacha < DIAS_PARA_OFRECER) return null;

  return (
    <aside
      aria-labelledby="instalar-titulo"
      className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4"
    >
      <Download className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 grow space-y-2">
        <p id="instalar-titulo" className="font-medium">
          Instálala en tu teléfono
        </p>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Llevas {diasDeRacha} días seguidos. Instalada abre más rápido, va a pantalla completa y
          funciona sin conexión con lo que ya hayas visitado.
        </p>
        <Button type="button" size="sm" onClick={instalar}>
          Instalar
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 shrink-0"
        onClick={cerrar}
        aria-label="No instalar, y no volver a preguntar"
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
    </aside>
  );
}
