'use client';

// src/components/items/calculo.tsx — Client Component (§10.3).
//
// Ítem de cálculo: un campo numérico con la unidad al lado.
//
// Tres reglas que no son negociables y que aquí se cumplen:
//
//  1. `inputMode="decimal"` con `type="text"`. `type="number"` se descarta a
//     propósito: en Android su teclado no siempre trae la coma, la rueda del
//     ratón cambia el valor sin querer y el navegador «limpia» lo que no parsea,
//     borrando lo que el usuario acababa de escribir.
//  2. **Acepta coma y punto.** Un entrenador colombiano escribe «169,6». Se
//     normaliza con `Number(texto.replace(',', '.'))`.
//  3. **La tolerancia la aplica el motor**, no este componente. Aquí no se
//     compara nada con `item.respuesta`: se entrega un número y `calificar()`
//     decide. Lo único que este archivo hace con `tolerancia` es MOSTRARLA en
//     revisión, para que el usuario sepa qué margen tenía.
//
// El valor viaja como `number | null`: `null` es «el campo está vacío o lo
// escrito no es un número», que es exactamente lo que `sinResponder()` entiende
// por no responder. No se envía `NaN`, que contaría como respondido y errado.

import { useState } from 'react';
import type { ItemCalculo } from '@/lib/tipos';
import { editable, enRevision, type PropsItem } from './contrato';

/** Coma o punto decimal. Vacío o ilegible ⇒ `null` (sin responder). */
export function aNumero(texto: string): number | null {
  const limpio = texto.trim().replace(/\s/g, '').replace(',', '.');
  if (limpio === '') return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

/** Sin `toLocaleString`: formateo determinista, sin depender del ICU del entorno. */
function conComa(n: number): string {
  return String(n).replace('.', ',');
}

export function Calculo({ item, valor, modo, onCambio }: PropsItem<number | null, ItemCalculo>) {
  // El texto crudo es estado local porque «117,» y «117,0» son escrituras
  // válidas en curso que no se pueden reconstruir desde el número. El
  // envoltorio remonta el componente por ítem (`key`), así que al volver a un
  // ítem ya respondido el campo se rehidrata desde `valor`.
  const [texto, setTexto] = useState(valor === null || valor === undefined ? '' : conComa(valor));

  const revision = enRevision(modo);
  const puedeEscribir = editable(modo);
  const interpretado = aNumero(texto);
  const ilegible = texto.trim() !== '' && interpretado === null;

  const idCampo = `calculo-${item.id}`;
  const idAyuda = `${idCampo}-ayuda`;
  // La unidad se anuncia porque está en `aria-describedby`, NO porque forme
  // parte del valor ni del nombre del campo: sigue siendo un <span> hermano y el
  // lector la lee como descripción, después de «Tu respuesta». Sin esto la
  // unidad existía solo en pantalla, y ningún enunciado de cálculo de C5 la
  // menciona: quien no ve el sufijo no sabe si responder en lpm, en metros o en
  // ml/kg/min (A-26).
  const idUnidad = `${idCampo}-unidad`;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={idCampo} className="block text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          Tu respuesta
        </label>

        <div className="flex items-stretch gap-2">
          <input
            id={idCampo}
            // type="text" + inputMode="decimal": ver el comentario de cabecera.
            type="text"
            inputMode="decimal"
            autoComplete="off"
            // El teclado de iOS hace zoom con letra menor de 16px, y a mitad de
            // un simulacro eso desorienta. 16px es el piso (DISENO.md §2.3).
            className="min-h-[52px] w-full max-w-[12rem] rounded-md border border-input bg-card px-3 font-mono text-base tabular-nums disabled:opacity-100 read-only:text-muted-foreground"
            value={texto}
            readOnly={!puedeEscribir}
            aria-describedby={`${idUnidad} ${idAyuda}`}
            aria-invalid={ilegible || undefined}
            onChange={(evento) => {
              const nuevo = evento.target.value;
              setTexto(nuevo);
              onCambio(aNumero(nuevo));
            }}
          />
          <span
            id={idUnidad}
            className="flex min-h-[52px] shrink-0 items-center rounded-md border border-border bg-secondary px-3 font-mono text-sm text-secondary-foreground"
          >
            {item.unidad}
          </span>
        </div>

        <p id={idAyuda} className="text-[0.8125rem] text-muted-foreground">
          {ilegible
            ? 'Eso no es un número. Escribe solo cifras; puedes usar coma o punto para los decimales.'
            : 'Puedes escribir la coma decimal como coma o como punto: «169,6» y «169.6» valen igual.'}
        </p>
      </div>

      {revision ? (
        <dl className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[0.8125rem]">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted-foreground">Respondiste:</dt>
            <dd className="font-mono">
              {valor === null || valor === undefined
                ? 'nada'
                : `${conComa(valor)} ${item.unidad}`}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted-foreground">Respuesta correcta:</dt>
            <dd className="font-mono font-semibold">
              {conComa(item.respuesta)} {item.unidad}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted-foreground">Margen aceptado:</dt>
            <dd className="font-mono">
              ± {conComa(item.tolerancia)} {item.unidad}
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
