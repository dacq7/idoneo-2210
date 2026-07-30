'use client';

// src/components/layout/interruptor-tema.tsx
// Un solo botón que rota entre los tres estados de next-themes. No es un
// interruptor de dos posiciones a propósito: «sistema» es el valor por defecto
// y tiene que poder recuperarse sin entrar a /ajustes.
//
// La preferencia persistida en EstadoProgreso.preferencias.tema es del Paso
// 18.5; aquí manda next-themes, que ya escribe su propia clave.

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CICLO = [
  { valor: 'system', nombre: 'sistema', Icono: Monitor },
  { valor: 'light', nombre: 'claro', Icono: Sun },
  { valor: 'dark', nombre: 'oscuro', Icono: Moon },
] as const;

export function InterruptorTema() {
  const { theme, setTheme } = useTheme();
  // El tema real solo se conoce en el cliente: hasta que monta, se pinta el
  // estado neutro para que el primer render del servidor y el del cliente
  // coincidan. Ver §22 regla 6.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const indice = Math.max(
    0,
    CICLO.findIndex((t) => t.valor === (theme ?? 'system')),
  );
  const actual = CICLO[indice];
  const siguiente = CICLO[(indice + 1) % CICLO.length];
  const Icono = montado ? actual.Icono : Monitor;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={() => setTheme(siguiente.valor)}
      aria-label={
        montado
          ? `Tema ${actual.nombre}. Cambiar a tema ${siguiente.nombre}.`
          : 'Cambiar el tema'
      }
      title={montado ? `Tema ${actual.nombre}` : 'Cambiar el tema'}
    >
      <Icono className="size-5" aria-hidden="true" />
    </Button>
  );
}
