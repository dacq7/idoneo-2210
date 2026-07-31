'use client';

// src/components/sesion/sesion-repaso.tsx — Client Component (§10.3).
//
// La vista de una sesión de repaso: recorre los elementos que la cola trajo y
// los presenta con el gesto que le corresponde a cada uno — la tarjeta se
// responde «la sabía / no la sabía», el ítem se responde y se comprueba.
//
// ══ POR QUÉ VIVE EN SU PROPIO ARCHIVO (Paso 12, obligación de ADR-022) ══
// `controlador-repaso.tsx` medía **414 líneas de código** contra el límite de
// 300, y era el único incumplidor del proyecto. El arreglo no fue cortar por la
// línea 300: el archivo ya estaba separado por dentro y con nombres —un
// cargador (`resolverElementos`), un contenedor (`ControladorRepaso`) y esta
// vista—, así que extraer la pieza que ya tenía identidad propia lo deja
// holgadamente dentro **sin inventar ninguna abstracción**. Es exactamente lo
// que `PENDIENTES.md` prescribía, y es la razón por la que la regla merecía
// conservarse: señaló un archivo que de verdad hospedaba tres cosas.
//
// El contenedor sigue siendo el dueño de QUÉ se repasa (leer la cola, resolver
// el contenido, congelar la sesión); esta vista es dueña de CÓMO se responde.
//
// ══ SRS ══
// No reimplementa nada: `registrarRevision` es de `lib/srs.ts`, la calificación
// es `calificar()` de `lib/simulacro.ts` y la persistencia es
// `guardarColaRepaso`. Escribe elemento a elemento, así que cerrar la pestaña a
// mitad conserva lo respondido.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { Retroalimentacion } from '@/components/items/retroalimentacion';
import { guardarColaRepaso, leerEstado } from '@/lib/almacenamiento';
import { fechaLocalDe } from '@/lib/fechas';
import { calificar, sinResponder } from '@/lib/simulacro';
import { registrarRevision } from '@/lib/srs';
import type { BloqueId, Item, Tarjeta } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import { Boton } from './boton';
import { type ModuloPublicado } from './repaso/accion-siguiente';
import { CierreRepaso } from './repaso/cierre-repaso';

/** Un elemento de la cola, ya resuelto contra su contenido. */
export type Elemento =
  | {
      clase: 'tarjeta';
      id: string;
      bloque: BloqueId;
      tituloModulo: string;
      frente: string;
      reverso: string;
      tipo: Tarjeta['tipo'];
    }
  | { clase: 'item'; id: string; bloque: BloqueId; tituloModulo: string; item: Item };

const NOMBRE_TIPO: Record<Tarjeta['tipo'], string> = {
  definicion: 'Definición',
  dato: 'Dato',
  clasificacion: 'Clasificación',
  formula: 'Fórmula',
};

export function SesionRepaso({
  elementos,
  siguiente,
}: {
  elementos: readonly Elemento[];
  siguiente: ModuloPublicado | null;
}) {
  const [indice, setIndice] = useState(0);
  const [revelada, setRevelada] = useState(false);
  const [valor, setValor] = useState<unknown>(null);
  const [comprobado, setComprobado] = useState(false);
  const [acertadas, setAcertadas] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const refPrincipal = useRef<HTMLButtonElement>(null);
  const refReverso = useRef<HTMLDivElement>(null);
  const refCierre = useRef<HTMLHeadingElement>(null);
  const objetivoFoco = useRef<'principal' | 'reverso' | 'cierre' | null>(null);

  // Foco explícito en las transiciones: el control que lo tenía desaparece del
  // DOM y sin esto caería al <body>. Mismo mecanismo que el mazo de tarjetas.
  useEffect(() => {
    const objetivo = objetivoFoco.current;
    if (objetivo === null) return;
    objetivoFoco.current = null;
    if (objetivo === 'principal') refPrincipal.current?.focus();
    else if (objetivo === 'reverso') refReverso.current?.focus();
    else refCierre.current?.focus();
  });

  const elemento = elementos[indice];
  const total = elementos.length;

  /** Escribe la revisión en la cola, elemento a elemento. Cerrar la pestaña a
   *  mitad conserva lo respondido, igual que en el mazo. */
  const registrar = useCallback((id: string, acerto: boolean) => {
    // Handler: el reloj se lee aquí (§10.4).
    const ahora = new Date();
    const ahoraISO = ahora.toISOString();
    // `leerEstado` y no el snapshot del render: dentro de un mismo tick el
    // snapshot puede ir un paso por detrás, y la cola es acumulativa.
    const cola = leerEstado(ahoraISO).colaRepaso;
    guardarColaRepaso(registrarRevision(cola, id, acerto, fechaLocalDe(ahora)), ahoraISO);
  }, []);

  const responder = useCallback(
    (acerto: boolean) => {
      if (elemento === undefined) return;
      registrar(elemento.id, acerto);
      if (acerto) setAcertadas((n) => n + 1);

      if (indice + 1 >= total) {
        objetivoFoco.current = 'cierre';
        setTerminado(true);
        return;
      }
      objetivoFoco.current = 'principal';
      setRevelada(false);
      setValor(null);
      setComprobado(false);
      setIndice((i) => i + 1);
    },
    [elemento, indice, total, registrar],
  );

  // Atajos de teclado: AYUDA secundaria, nunca la vía de uso. Escuchan en
  // `window` —no en un contenedor sin `tabIndex`, que fue el fallo del Paso 8— y
  // guardan contra campos de texto (el ítem de cálculo tiene uno) y contra los
  // modificadores. Los `1`–`4` de los ítems los aporta el propio componente de
  // opción; aquí solo van los de la tarjeta y el `Enter` de avance.
  useEffect(() => {
    if (terminado || elemento === undefined) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const foco = document.activeElement;
      if (
        foco instanceof HTMLElement &&
        (foco.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(foco.tagName))
      ) {
        return;
      }

      if (elemento.clase === 'tarjeta' && revelada && (evento.key === '1' || evento.key === '2')) {
        evento.preventDefault();
        responder(evento.key === '1');
        return;
      }

      if (evento.key !== 'Enter') return;
      // Sobre un botón o un enlace `Enter` ya activa lo enfocado: interceptarlo
      // dispararía dos cosas.
      if (foco instanceof HTMLElement && /^(BUTTON|A)$/.test(foco.tagName)) return;
      evento.preventDefault();
      if (elemento.clase === 'tarjeta') {
        if (!revelada) {
          objetivoFoco.current = 'reverso';
          setRevelada(true);
        }
        return;
      }
      if (!comprobado) setComprobado(true);
      else responder(calificar(elemento.item, valor));
    };

    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  });

  if (terminado) {
    return (
      <CierreRepaso ref={refCierre} total={total} acertadas={acertadas} siguiente={siguiente} />
    );
  }

  if (elemento === undefined) return null;

  const veredicto = elemento.clase === 'item' && comprobado ? calificar(elemento.item, valor) : false;
  const avance = ((indice + 1) / total) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p role="status" className="text-[0.8125rem] text-muted-foreground">
          Elemento {indice + 1} de {total} ·{' '}
          {elemento.clase === 'tarjeta' ? 'tarjeta' : 'pregunta'} de {elemento.tituloModulo}
        </p>
        {/* Banda del instrumento (DISENO.md §4.2): relleno puro, esquinas rectas,
            sin tipografía encima y sin transición — `width` es propiedad de
            layout y §3 no la admite. */}
        <div className="h-1 w-full bg-secondary" aria-hidden="true">
          <div
            className={cn('h-full', CLASES_BLOQUE[elemento.bloque].fondo)}
            style={{ width: `${avance}%` }}
          />
        </div>
      </div>

      <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        {elemento.clase === 'tarjeta' ? (
          <>
            <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
              Tarjeta · {NOMBRE_TIPO[elemento.tipo]}
            </p>
            <p className="mt-2 text-[1.0625rem] font-medium leading-[1.45]">{elemento.frente}</p>
            {revelada ? (
              <div ref={refReverso} tabIndex={-1} className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
                  Respuesta
                </p>
                <p className="mt-1.5 leading-[1.5]">{elemento.reverso}</p>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
              Pregunta que fallaste
            </p>
            <EnvoltorioItem
              item={elemento.item}
              valor={valor}
              modo={
                comprobado
                  ? veredicto
                    ? 'revision-correcta'
                    : 'revision-incorrecta'
                  : 'respondiendo'
              }
              onCambio={setValor}
              numero={indice + 1}
              total={total}
            />
          </>
        )}
      </article>

      {/* La región viva está SIEMPRE montada, aunque esté vacía: un contenedor
          `aria-live` que aparece junto con su contenido no se anuncia de forma
          fiable. */}
      <div aria-live="polite">
        {elemento.clase === 'item' && comprobado ? (
          <Retroalimentacion
            item={elemento.item}
            correcta={veredicto}
            respondida={!sinResponder(valor)}
          />
        ) : null}
      </div>

      {/* Acción primaria a 52 px: esto se estudia en el celular y el objetivo
          táctil manda (DISENO.md §3, medida reservada a la respuesta de un
          ítem — que es exactamente lo que son estos botones). */}
      {elemento.clase === 'tarjeta' && revelada ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Boton
            onClick={() => responder(true)}
            variante="contorno"
            className="min-h-[52px] flex-1 text-[0.9375rem]"
          >
            <Check className="size-4" aria-hidden="true" />
            La sabía
          </Boton>
          <Boton
            onClick={() => responder(false)}
            variante="contorno"
            className="min-h-[52px] flex-1 text-[0.9375rem]"
          >
            <X className="size-4" aria-hidden="true" />
            No la sabía
          </Boton>
        </div>
      ) : (
        <Boton
          ref={refPrincipal}
          onClick={() => {
            if (elemento.clase === 'tarjeta') {
              objetivoFoco.current = 'reverso';
              setRevelada(true);
              return;
            }
            // Comprobar sin haber respondido es «no sé esta»: acción legítima en
            // un repaso, y cuenta como fallo, que es la verdad.
            if (!comprobado) setComprobado(true);
            else responder(calificar(elemento.item, valor));
          }}
          className="min-h-[52px] w-full text-[0.9375rem]"
        >
          {elemento.clase === 'tarjeta'
            ? 'Ver la respuesta'
            : !comprobado
              ? 'Comprobar'
              : indice + 1 >= total
                ? 'Terminar el repaso'
                : 'Siguiente'}
        </Boton>
      )}

      <p className="hidden text-[0.8125rem] leading-[1.45] text-muted-foreground [@media(any-pointer:fine)]:block">
        {elemento.clase === 'tarjeta' ? (
          <>
            Atajos: <Tecla>1</Tecla> si la sabías, <Tecla>2</Tecla> si no.
          </>
        ) : (
          <>
            Atajos: <Tecla>Enter</Tecla> comprueba y avanza.
          </>
        )}
      </p>
    </div>
  );
}

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-input bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  );
}
