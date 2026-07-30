'use client';

// src/components/modulo/etapas-modulo.tsx — Client Component.
//
// Las cuatro etapas de un módulo (Esencial · Tarjetas · Práctica · Quiz) con el
// estado real del usuario, leído de `useEstado()` (ADR-007: el hook se llama
// `useEstado`, el archivo sigue en español).
//
// Frontera (ADR-010): NO importa `content/`. Todo lo que necesita saber del
// módulo entra por prop, proyectado al subconjunto serializable mínimo
// (`DatosEtapas`), igual que `SegmentoRiel` en el encabezado. Importar
// `content/estructura` desde aquí metería los 29 módulos en el bundle.
//
// Reloj (§22 regla 6): este componente no lee el reloj. No escribe estado: solo
// lo muestra. Quien escribe es `MarcadorLectura` (desde un efecto) y
// `MazoTarjetas` (desde un handler).
//
// Numeración 1–4: autorizada explícitamente por DISENO.md §5.2 — «las 4 etapas
// del módulo y las 5 fases del entrenamiento SÍ son una secuencia real y se
// numeran». Los bloques y los destinos de la nav no.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useEstado } from '@/hooks/usar-estado';
import { estadoModuloInicial, UMBRAL_DOMINIO } from '@/lib/almacenamiento';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import type { BloqueId, EstadoModulo } from '@/lib/tipos';

/** Lo mínimo que las etapas necesitan saber del módulo. Todo serializable. */
export interface DatosEtapas {
  slug: string;
  bloque: BloqueId;
  /** `content/teoria/<slug>.mdx` existe. */
  hayTeoria: boolean;
  /** Cuántas tarjetas tiene publicadas el módulo. 0 = todavía ninguna. */
  totalTarjetas: number;
}

type NumeroEtapa = 1 | 2 | 3 | 4;

interface FilaEtapa {
  numero: NumeroEtapa;
  nombre: string;
  /** `null` = la etapa todavía no tiene a dónde llevar. */
  href: string | null;
  /** Estado en palabras. Nunca solo color: es el portador de la información. */
  texto: string;
  /** Solo refuerza al texto; jamás lo sustituye. */
  hecha: boolean;
  /** Todavía no construida o sin contenido publicado. */
  pendienteDePublicar: boolean;
}

function construirFilas(
  datos: DatosEtapas,
  progreso: EstadoModulo,
  etapaActual: NumeroEtapa | null,
): FilaEtapa[] {
  const { slug, hayTeoria, totalTarjetas } = datos;
  const vistas = Math.min(progreso.tarjetasVistas, totalTarjetas);

  const filas: FilaEtapa[] = [
    {
      numero: 1,
      nombre: 'Esencial',
      href: hayTeoria ? `/modulos/${slug}` : null,
      texto: !hayTeoria ? 'Sin publicar' : progreso.teoriaLeida ? 'Leída' : 'Sin leer',
      hecha: hayTeoria && progreso.teoriaLeida,
      pendienteDePublicar: !hayTeoria,
    },
    {
      numero: 2,
      nombre: 'Tarjetas',
      href: totalTarjetas > 0 ? `/modulos/${slug}/tarjetas` : null,
      texto:
        totalTarjetas === 0
          ? 'Sin publicar'
          : vistas === 0
            ? `${totalTarjetas} por ver`
            : vistas >= totalTarjetas
              ? `Las ${totalTarjetas} vistas`
              : `${vistas} de ${totalTarjetas} vistas`,
      hecha: totalTarjetas > 0 && vistas >= totalTarjetas,
      pendienteDePublicar: totalTarjetas === 0,
    },
    {
      numero: 3,
      nombre: 'Práctica',
      // La ruta nace en el paso siguiente del build, junto con los componentes
      // de ítem. Enlazar hoy daría un 404, así que la fila no es un enlace.
      href: null,
      texto: progreso.practicaCompletada ? 'Completada' : 'Todavía no está lista',
      hecha: progreso.practicaCompletada,
      pendienteDePublicar: !progreso.practicaCompletada,
    },
    {
      numero: 4,
      nombre: 'Quiz',
      href: null,
      texto:
        progreso.mejorQuiz === null
          ? 'Todavía no está listo'
          : `Mejor puntaje: ${progreso.mejorQuiz} de 100`,
      hecha: progreso.mejorQuiz !== null && progreso.mejorQuiz >= UMBRAL_DOMINIO,
      pendienteDePublicar: progreso.mejorQuiz === null,
    },
  ];

  // La etapa en la que ya estás no se enlaza a sí misma.
  return filas.map((fila) =>
    fila.numero === etapaActual ? { ...fila, href: null } : fila,
  );
}

interface Props {
  datos: DatosEtapas;
  /** La etapa que el usuario está viendo ahora mismo, si es alguna. */
  etapaActual?: NumeroEtapa;
}

export function EtapasModulo({ datos, etapaActual }: Props) {
  const estado = useEstado();

  // `useEstado()` devuelve null en el primer render (servidor e hidratación) Y
  // TAMBIÉN de forma permanente mientras el usuario no tenga nada guardado:
  // `obtenerSnapshot` lee localStorage y no escribe nada. Sin esta bandera, un
  // usuario nuevo se quedaría con el esqueleto puesto para siempre.
  //
  // Con ella el ciclo es el correcto: servidor e hidratación pintan esqueleto,
  // y tras el efecto de montaje se pinta el progreso real — que para un usuario
  // nuevo es `estadoModuloInicial()`, que no es un valor por defecto que luego
  // «salta»: es la verdad (cero progreso guardado).
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    setMontado(true);
  }, []);

  const progreso = montado ? (estado?.modulos[datos.slug] ?? estadoModuloInicial()) : null;
  const filas =
    progreso === null ? null : construirFilas(datos, progreso, etapaActual ?? null);

  const hayPendientes = filas?.some((f) => f.pendienteDePublicar) ?? false;

  return (
    <section aria-labelledby="etapas" className="space-y-3">
      <h2 id="etapas">Las cuatro etapas</h2>
      <p className="text-[0.8125rem] text-muted-foreground">
        Van en orden: lees lo esencial, memorizas con tarjetas, practicas con explicación
        inmediata y al final te mides.
      </p>

      <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {(filas ?? ESQUELETO).map((fila) => (
          <li key={fila.numero}>
            <Fila
              fila={fila}
              bloque={datos.bloque}
              esActual={fila.numero === etapaActual}
              cargando={filas === null}
            />
          </li>
        ))}
      </ol>

      {hayPendientes ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          Las etapas marcadas como «todavía no está lista» aún no existen en la app: llegan
          con las preguntas del módulo. Lo que ya puedes hacer es leer la teoría y darle a
          las tarjetas hasta que no falles ninguna.
        </p>
      ) : null}
    </section>
  );
}

/** Filas de relleno mientras no se sabe el progreso. Los nombres sí se saben. */
const ESQUELETO: FilaEtapa[] = [
  { numero: 1, nombre: 'Esencial', href: null, texto: '', hecha: false, pendienteDePublicar: false },
  { numero: 2, nombre: 'Tarjetas', href: null, texto: '', hecha: false, pendienteDePublicar: false },
  { numero: 3, nombre: 'Práctica', href: null, texto: '', hecha: false, pendienteDePublicar: false },
  { numero: 4, nombre: 'Quiz', href: null, texto: '', hecha: false, pendienteDePublicar: false },
];

function Fila({
  fila,
  bloque,
  esActual,
  cargando,
}: {
  fila: FilaEtapa;
  bloque: BloqueId;
  esActual: boolean;
  cargando: boolean;
}) {
  const esEnlace = fila.href !== null;

  const contenido = (
    <>
      {/* Chip del número: color de bloque solo cuando la etapa está hecha, y
          siempre acompañado del texto de estado a la derecha. El color nunca es
          el único portador (DISENO.md §1.2). Mismo tratamiento que el código de
          módulo de `TarjetaModulo`: JetBrains Mono, rounded-md, size-8. */}
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-md font-mono text-sm font-medium',
          fila.hecha
            ? cn(CLASES_BLOQUE[bloque].fondo, 'text-bloque-contraste')
            : 'bg-secondary text-secondary-foreground',
        )}
        aria-hidden="true"
      >
        {fila.numero}
      </span>

      <span className="min-w-0 flex-1">
        <span className="sr-only">Etapa {fila.numero}: </span>
        {fila.nombre}
        {esActual ? (
          <span className="text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
            {' '}
            · Estás aquí
          </span>
        ) : null}
      </span>

      {cargando ? (
        <>
          <span className="sr-only">Cargando tu progreso</span>
          <span
            className="h-4 w-24 shrink-0 animate-pulse rounded-md bg-accent"
            aria-hidden="true"
          />
        </>
      ) : (
        <span className="flex shrink-0 items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          {fila.texto}
          {fila.hecha ? <Check className="size-4 text-exito" aria-hidden="true" /> : null}
        </span>
      )}

      {/* Sin la flecha, una fila que enlaza y una que no se ven idénticas: en
          táctil no hay hover que las distinga. Va en las filas enlazadas y solo
          en ellas, así que la afordancia no depende del color. */}
      <ArrowRight
        className={cn('size-4 shrink-0 text-muted-foreground', esEnlace ? null : 'invisible')}
        aria-hidden="true"
      />
    </>
  );

  const clases = 'flex w-full items-center gap-3 px-4 py-2.5 text-left sm:px-6';

  if (fila.href === null) {
    return (
      <div
        className={cn('group', clases, 'min-h-11')}
        aria-current={esActual ? 'step' : undefined}
      >
        {contenido}
      </div>
    );
  }

  return (
    <Link href={fila.href} className={cn('group', clases, 'transition-colors duration-150 hover:bg-accent')}>
      {contenido}
    </Link>
  );
}
