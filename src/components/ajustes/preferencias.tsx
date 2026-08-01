'use client';

// src/components/ajustes/preferencias.tsx — Client Component.
//
// El tema, con sus tres estados explícitos.
//
// ══ POR QUÉ TRES BOTONES Y NO EL CICLO DEL ENCABEZADO ══
// `InterruptorTema` rota entre los tres con un solo botón, que es lo correcto
// en una barra donde el espacio manda. En una pantalla de ajustes el patrón
// correcto es el contrario: los tres estados a la vista, con el activo marcado,
// para poder elegir directamente en vez de tener que pulsar dos veces para
// llegar a «oscuro». Son dos controles del mismo dato, no dos fuentes de verdad:
// los dos llaman a `setTheme` de next-themes.
//
// ══ POR QUÉ LA PREFERENCIA NO VIAJA EN EL RESPALDO ══
// El tema lo persiste next-themes en su propia clave, no en `EstadoProgreso`.
// Es preferencia **de este dispositivo**: importar el respaldo del móvil no
// debería poner el portátil en oscuro. Mismo razonamiento que el aviso de
// instalación de la PWA.
//
// `EstadoProgreso.preferencias.tema` queda sin consumidor, y eso está declarado
// en la cabecera de `panel-ajustes.tsx`.

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPCIONES = [
  { valor: 'system', etiqueta: 'El del sistema', Icono: Monitor },
  { valor: 'light', etiqueta: 'Claro', Icono: Sun },
  { valor: 'dark', etiqueta: 'Oscuro', Icono: Moon },
] as const;

export function Preferencias() {
  const { theme, setTheme } = useTheme();
  // El tema real solo se conoce en el cliente. Hasta que monta no se marca
  // ninguno: pintar «sistema» como activo y que luego salte a «oscuro» es el
  // parpadeo que §22 regla 6 prohíbe.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const actual = theme ?? 'system';

  return (
    <section aria-labelledby="tema-titulo" className="space-y-4">
      <div className="space-y-1">
        <h2 id="tema-titulo">Apariencia</h2>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Se guarda en este dispositivo y no viaja en el respaldo.
        </p>
      </div>

      <div role="radiogroup" aria-labelledby="tema-titulo" className="grid grid-cols-3 gap-2">
        {OPCIONES.map(({ valor, etiqueta, Icono }) => {
          const activo = montado && actual === valor;
          return (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setTheme(valor)}
              className={cn(
                'flex min-h-11 flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-[0.8125rem] font-medium transition-colors',
                activo
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icono className="size-5" aria-hidden="true" />
              {etiqueta}
            </button>
          );
        })}
      </div>
    </section>
  );
}
