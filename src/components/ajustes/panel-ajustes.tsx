'use client';

// src/components/ajustes/panel-ajustes.tsx — Client Component (§10.3).
//
// El armazón de /ajustes. Resuelve el estado una vez y reparte; cada sección
// vive en su archivo porque son cinco preocupaciones sin nada en común salvo la
// pantalla.
//
// ══ EL PATRÓN DE MONTAJE, OTRA VEZ Y POR LA MISMA RAZÓN ══
// `useEstado()` devuelve `null` en dos situaciones distintas —«aún no monté» y
// «no hay nada guardado»— y confundirlas deja el esqueleto puesto para siempre
// en todo usuario nuevo. La bandera `montado` las separa. Está escrito en el
// contrato de `usar-estado.ts` y aquí se cumple.
//
// ══ QUÉ NO SE PINTA, Y POR QUÉ ══
// `EstadoProgreso.preferencias` tiene dos campos que esta pantalla **no**
// expone: `sonido` y `tema`.
//
//  · **sonido** no tiene consumidor: la app no reproduce ningún sonido. Un
//    interruptor que no hace nada es exactamente lo que la versión provisional
//    de esta pantalla prometía no enseñar. El campo se queda en el esquema
//    —quitarlo costaría una migración de versión por un booleano— y el control
//    aparecerá el día que haya algo que silenciar.
//  · **tema** lo gobierna `next-themes`, que ya escribe su propia clave. Que
//    además se copiara al progreso crearía dos fuentes de verdad que pueden
//    discrepar, y obligaría a decidir qué pasa al importar un respaldo del móvil
//    en el portátil. El tema es preferencia **de este dispositivo**, igual que
//    el aviso de instalación: no viaja en el respaldo.

import { useEffect, useState } from 'react';
import { useEstado } from '@/hooks/usar-estado';
import { almacenamientoDegradado, leerIlegible, type EstadoIlegible } from '@/lib/almacenamiento';
import { fechaLocalDe } from '@/lib/fechas';
import { AvisoAlmacenamiento } from './aviso-almacenamiento';
import { Cuarentena } from './cuarentena';
import { DatosPersonales } from './datos-personales';
import { Preferencias } from './preferencias';
import { Respaldo } from './respaldo';
import { ZonaPeligro } from './zona-peligro';

export function PanelAjustes() {
  const estado = useEstado();
  const [montado, setMontado] = useState(false);
  const [ilegible, setIlegible] = useState<EstadoIlegible | null>(null);
  const [degradado, setDegradado] = useState(false);
  // El «hoy» de la pantalla, leído UNA vez en el efecto de montaje. Ningún hijo
  // llama al reloj: §22 regla 6 lo prohíbe en el cuerpo de un render, y además
  // recalcularlo en cada tecla del campo de nombre no aportaba nada.
  const [hoy, setHoy] = useState('');

  useEffect(() => {
    setMontado(true);
    // Las dos son consultas CON efecto y por eso viven aquí y no en el render:
    // `leerIlegible` se autolimpia si el registro está corrupto (PENDIENTES) y
    // `almacenamientoDegradado` escribe una sonda de 1 byte para averiguarlo.
    setIlegible(leerIlegible());
    setDegradado(almacenamientoDegradado());
    setHoy(fechaLocalDe(new Date()));
  }, []);

  if (!montado) {
    return (
      <div className="space-y-4" aria-busy="true">
        <span className="sr-only">Cargando tus ajustes</span>
        <span className="block h-28 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
        <span className="block h-40 w-full animate-pulse rounded-lg bg-accent" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {degradado ? <AvisoAlmacenamiento /> : null}
      {ilegible ? (
        <Cuarentena registro={ilegible} onDescartar={() => setIlegible(null)} />
      ) : null}

      <DatosPersonales estado={estado} />
      <Preferencias />
      <Respaldo estado={estado} hoy={hoy} />
      <ZonaPeligro hayProgreso={estado !== null} />
    </div>
  );
}
