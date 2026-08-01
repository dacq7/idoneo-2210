'use client';

// src/components/herramientas/campo-numero.tsx — Client Component.
//
// El campo numérico que usan los cinco paneles de la calculadora. Existe como
// pieza propia porque hay ~14 y todos comparten tres decisiones que no son
// obvias:
//
//  1. `type="text"` con `inputMode="decimal"`, NO `type="number"`. El número
//     nativo tiene rueda del ratón que cambia el valor sin querer, flechas que
//     ocupan sitio, y —lo que decide— **rechaza la coma decimal** en varios
//     navegadores: el usuario teclea «1,75» y el campo se queda vacío sin decir
//     por qué. El teclado del móvil sale igual de numérico con `inputMode`.
//  2. El sufijo de unidad va DENTRO del campo, a la derecha. Fuera, a 375 px,
//     se lleva una línea entera por campo. **Y se anuncia**: entra en el
//     `aria-describedby` junto a la ayuda. Llevaba `aria-hidden` con el
//     argumento de que «la unidad ya va en la etiqueta», y el
//     `accessibility-auditor` lo midió campo a campo: era falso en 10 de 14
//     —«Peso» no dice kg, «FC máxima» no dice lpm—. Un lector anunciaba «Peso,
//     edición de texto» y el usuario no sabía si teclear kilos o libras. Es la
//     misma corrección que A-26 dictaminó para el ítem de `calculo`. Ver A-46.
//  3. La etiqueta es `<Label>` de verdad, asociada por `htmlFor`. Un
//     `placeholder` no es una etiqueta: desaparece al escribir y los lectores
//     de pantalla no lo anuncian como nombre del control.

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CampoNumero({
  etiqueta,
  valor,
  onCambio,
  unidad,
  ayuda,
  placeholder,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  /** Sufijo que se pinta dentro del campo: 'años', 'lpm', 'kg'… */
  unidad?: string;
  /** Texto de apoyo bajo el campo. Se asocia con aria-describedby. */
  ayuda?: string;
  placeholder?: string;
}) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idUnidad = `${id}-unidad`;
  // El orden importa: primero la unidad, después la ayuda. El lector las lee
  // seguidas y «kilogramos» antes que la explicación es lo que hace falta para
  // empezar a teclear.
  const descrito = [unidad ? idUnidad : null, ayuda ? idAyuda : null].filter(Boolean).join(' ');

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[0.8125rem]">
        {etiqueta}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          // La coma decimal es lo que escribe la gente en Colombia. `aNumero`
          // la normaliza; el patrón solo orienta al teclado del navegador.
          pattern="[0-9]*[.,]?[0-9]*"
          autoComplete="off"
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          placeholder={placeholder}
          aria-describedby={descrito === '' ? undefined : descrito}
          className="h-11 font-mono"
          style={unidad ? { paddingRight: `${unidad.length * 0.62 + 1.5}rem` } : undefined}
        />
        {unidad ? (
          <span
            id={idUnidad}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.8125rem] text-muted-foreground"
          >
            {unidad}
          </span>
        ) : null}
      </div>
      {ayuda ? (
        <p id={idAyuda} className="text-[0.75rem] leading-[1.4] text-muted-foreground">
          {ayuda}
        </p>
      ) : null}
    </div>
  );
}
