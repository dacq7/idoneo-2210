'use client';

// src/components/modulo/mazo-tarjetas.tsx — Client Component.
//
// Etapa 2 de un módulo. Una tarjeta a la vez: frente → «Ver la respuesta» →
// reverso → «La sabía» / «No la sabía».
//
// Frontera (ADR-010): NO importa `content/tarjetas/indice`. Las tarjetas las
// carga la PÁGINA en el servidor con `cargarTarjetas(slug)` y las pasa ya
// proyectadas a `TarjetaEnMazo` (sin el campo `modulo`, que el mazo no usa).
//
// Reloj (§22 regla 6 y §10.4): `new Date().toISOString()` solo dentro del
// handler de respuesta. En el cuerpo del render no se lee el reloj.
//
// Aleatoriedad: NINGUNA (§22 regla 5). El mazo va en el orden en que el autor
// escribió las tarjetas, que es un orden pedagógico. Barajar exigiría
// `crearRng(semilla)` y una semilla que aquí no significa nada.
//
// SRS: este componente registra `tarjetasVistas` y NADA MÁS. La cola de repaso
// espaciado es de un paso posterior y no se adelanta aquí.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, RotateCcw, X } from 'lucide-react';
import { registrarTarjetasVistas } from '@/lib/almacenamiento';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId, Tarjeta } from '@/lib/tipos';

/** Lo que el mazo necesita de una `Tarjeta`. Todo serializable. */
export interface TarjetaEnMazo {
  id: string;
  frente: string;
  reverso: string;
  tipo: Tarjeta['tipo'];
}

const NOMBRE_TIPO: Record<Tarjeta['tipo'], string> = {
  definicion: 'Definición',
  dato: 'Dato',
  clasificacion: 'Clasificación',
  formula: 'Fórmula',
};

type ObjetivoFoco = 'revelar' | 'reverso' | 'resumen' | null;

interface Props {
  slug: string;
  bloque: BloqueId;
  /** Siempre con al menos una tarjeta: el estado vacío lo resuelve la página. */
  tarjetas: readonly TarjetaEnMazo[];
}

export function MazoTarjetas({ slug, bloque, tarjetas }: Props) {
  /** El mazo de la pasada actual. Puede ser el completo o solo las falladas. */
  const [mazo, setMazo] = useState<readonly TarjetaEnMazo[]>(tarjetas);
  const [esRepaso, setEsRepaso] = useState(false);
  const [indice, setIndice] = useState(0);
  const [revelada, setRevelada] = useState(false);
  const [falladas, setFalladas] = useState<readonly TarjetaEnMazo[]>([]);
  const [acertadas, setAcertadas] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const refRevelar = useRef<HTMLButtonElement>(null);
  const refReverso = useRef<HTMLDivElement>(null);
  const refResumen = useRef<HTMLParagraphElement>(null);
  const objetivoFoco = useRef<ObjetivoFoco>(null);

  // Foco explícito: al revelar y al avanzar, el botón que tenía el foco
  // desaparece del DOM. Sin esto el foco cae al <body> y quien navega con
  // teclado o lector de pantalla pierde el hilo a mitad del mazo.
  useEffect(() => {
    const objetivo = objetivoFoco.current;
    if (objetivo === null) return;
    objetivoFoco.current = null;

    if (objetivo === 'revelar') refRevelar.current?.focus();
    else if (objetivo === 'reverso') refReverso.current?.focus();
    else refResumen.current?.focus();
  });

  const tarjeta = mazo[indice];
  const total = mazo.length;

  function revelar() {
    objetivoFoco.current = 'reverso';
    setRevelada(true);
  }

  function responder(sabia: boolean) {
    if (!revelada || tarjeta === undefined) return;

    if (sabia) setAcertadas((n) => n + 1);
    else setFalladas((lista) => [...lista, tarjeta]);

    // Solo la pasada completa cuenta como «tarjetas vistas» del módulo. En una
    // pasada de repaso el mazo es un subconjunto y el número sería menor;
    // `registrarTarjetasVistas` aplica Math.max, así que no bajaría el valor
    // guardado, pero la escritura no aportaría nada.
    if (!esRepaso) {
      registrarTarjetasVistas(slug, indice + 1, new Date().toISOString());
    }

    if (indice + 1 >= total) {
      objetivoFoco.current = 'resumen';
      setTerminado(true);
      return;
    }

    objetivoFoco.current = 'revelar';
    setRevelada(false);
    setIndice((i) => i + 1);
  }

  function empezar(nuevoMazo: readonly TarjetaEnMazo[], repaso: boolean) {
    objetivoFoco.current = 'revelar';
    setMazo(nuevoMazo);
    setEsRepaso(repaso);
    setIndice(0);
    setRevelada(false);
    setFalladas([]);
    setAcertadas(0);
    setTerminado(false);
  }

  function alPulsarTecla(evento: React.KeyboardEvent<HTMLDivElement>) {
    if (terminado || !revelada) return;
    if (evento.key === '1') {
      evento.preventDefault();
      responder(true);
    } else if (evento.key === '2') {
      evento.preventDefault();
      responder(false);
    }
  }

  if (terminado) {
    return (
      <Resumen
        ref={refResumen}
        slug={slug}
        total={total}
        acertadas={acertadas}
        falladas={falladas}
        esRepaso={esRepaso}
        onRepasarFalladas={() => empezar(falladas, true)}
        onEmpezarDeNuevo={() => empezar(tarjetas, false)}
      />
    );
  }

  if (tarjeta === undefined) return null;

  const avance = ((indice + 1) / total) * 100;

  return (
    <div className="space-y-4" onKeyDown={alPulsarTecla}>
      <div className="space-y-2">
        {/* El contador es el portador accesible del avance; la banda solo lo
            refuerza. role="status" lo anuncia al pasar de tarjeta sin robar el
            foco, que en ese momento va al botón «Ver la respuesta». */}
        <p role="status" className="text-[0.8125rem] text-muted-foreground">
          Tarjeta {indice + 1} de {total}
          {esRepaso ? ' · repaso de las que no sabías' : null}
        </p>

        {/* Banda del instrumento (DISENO.md §4): relleno puro, rounded-none,
            sin tipografía encima y sin barra redondeada de progreso. */}
        <div className="h-1 w-full bg-secondary" aria-hidden="true">
          <div
            // Sin transición: `width` es una propiedad de layout y DISENO.md §3
            // restringe las transiciones a color, fondo, borde, opacidad y
            // transform. §4.2 regla 6 remata: movimiento, uno o ninguno.
            className={cn('h-full', CLASES_BLOQUE[bloque].fondo)}
            style={{ width: `${avance}%` }}
          />
        </div>
      </div>

      <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
          {NOMBRE_TIPO[tarjeta.tipo]}
        </p>

        <p className="mt-2 text-[1.0625rem] font-medium leading-[1.45]">{tarjeta.frente}</p>

        {revelada ? (
          <div
            ref={refReverso}
            // tabIndex -1 para poder darle el foco al revelar: así el lector de
            // pantalla lee la respuesta y los dos botones quedan justo después
            // en el orden de tabulación.
            tabIndex={-1}
            className="mt-4 border-t border-border pt-4"
          >
            <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
              Respuesta
            </p>
            <p className="mt-1.5 leading-[1.5]">{tarjeta.reverso}</p>
          </div>
        ) : null}
      </article>

      {revelada ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Boton onClick={() => responder(true)} variante="contorno" className="flex-1">
            <Check className="size-4" aria-hidden="true" />
            La sabía
          </Boton>
          <Boton onClick={() => responder(false)} variante="contorno" className="flex-1">
            <X className="size-4" aria-hidden="true" />
            No la sabía
          </Boton>
        </div>
      ) : (
        <Boton ref={refRevelar} onClick={revelar} variante="principal" className="w-full">
          Ver la respuesta
        </Boton>
      )}

      <p className="hidden text-[0.8125rem] text-muted-foreground sm:block">
        Con el teclado: <Tecla>Enter</Tecla> para ver la respuesta, <Tecla>1</Tecla> si la
        sabías y <Tecla>2</Tecla> si no.
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

function Resumen({
  ref,
  slug,
  total,
  acertadas,
  falladas,
  esRepaso,
  onRepasarFalladas,
  onEmpezarDeNuevo,
}: {
  ref: React.Ref<HTMLParagraphElement>;
  slug: string;
  total: number;
  acertadas: number;
  falladas: readonly TarjetaEnMazo[];
  esRepaso: boolean;
  onRepasarFalladas: () => void;
  onEmpezarDeNuevo: () => void;
}) {
  const fallos = falladas.length;

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* tabIndex -1: recibe el foco al terminar el mazo, para que el cambio de
          pantalla se anuncie y no haya que buscar dónde quedó el hilo. */}
      <p ref={ref} tabIndex={-1} className="font-titulo text-[1.375rem] font-semibold leading-[1.15]">
        {esRepaso ? 'Terminaste el repaso' : 'Terminaste el mazo'}
      </p>

      <p>
        Viste {total === 1 ? 'una tarjeta' : `las ${total} tarjetas`}. Dijiste que sabías{' '}
        <strong className="font-semibold">{acertadas}</strong> y que no sabías{' '}
        <strong className="font-semibold">{fallos}</strong>.
      </p>

      {/* Retroalimentación honesta (§22 regla 10): ni felicitación vacía cuando
          sale todo bien, ni consuelo cuando sale mal. */}
      <p className="text-muted-foreground">
        {fallos === 0
          ? 'No te confíes con esto: reconocer una respuesta al verla es mucho más fácil que producirla en el examen. La prueba de verdad es el quiz del módulo.'
          : fallos >= total / 2
            ? 'Es normal en la primera pasada y no dice nada malo de ti: estas tarjetas son datos exactos y los datos exactos se aprenden repitiéndolos, no entendiéndolos una vez.'
            : 'Esas son las que rinden ahora. Repasar el mazo entero otra vez es gastar tiempo en lo que ya sabías.'}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        {fallos > 0 ? (
          <Boton onClick={onRepasarFalladas} variante="principal" className="flex-1">
            <RotateCcw className="size-4" aria-hidden="true" />
            Repasar {fallos === 1 ? 'la que no sabía' : `las ${fallos} que no sabía`}
          </Boton>
        ) : null}
        <Boton onClick={onEmpezarDeNuevo} variante="contorno" className="flex-1">
          Empezar el mazo de nuevo
        </Boton>
      </div>

      <p>
        <Link
          href={`/modulos/${slug}`}
          className="font-medium text-primary underline underline-offset-2"
        >
          Volver al módulo
        </Link>
      </p>
    </div>
  );
}

/**
 * Botón con marcado propio, no el `Button` de shadcn.
 *
 * `src/components/ui/button.tsx` hace `import { Slot } from "radix-ui"` —el
 * paquete paraguas— y eso mete el barrel entero (77.5 kB gz, ADR-011) en el
 * bundle de la ruta. Es exactamente la decisión que ya tomó el Paso 6 con la
 * insignia «En preparación», y esta es una ruta de estudio: se usa a diario y
 * desde el celular. Las clases son las de `buttonVariants`, menos el
 * `transition-all` que DISENO.md §5.2 prohíbe.
 */
function Boton({
  ref,
  variante,
  className,
  children,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  variante: 'principal' | 'contorno';
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium',
        'transition-colors duration-150 ease-out',
        variante === 'principal'
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
