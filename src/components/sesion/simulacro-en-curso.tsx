'use client';

// src/components/sesion/simulacro-en-curso.tsx — Client Component (§10.3).
//
// La tanda cronometrada. Vive en su propio archivo para que el controlador no
// pase de 300 líneas (regla de código 1), igual que `resumen-sesion.tsx`.
//
// ══════════════════════════════════════════════════════════════════════════
// LOS DOS INVARIANTES DEL PASO, Y DÓNDE SE CUMPLEN
// ══════════════════════════════════════════════════════════════════════════
//
// 1 · **Cerrar la pestaña no regala tiempo.** No hay ningún contador en
//     memoria: `useCronometro` recalcula cada tick desde `iniciadoEnMs` contra
//     el reloj real, y ese campo se fija UNA vez, al empezar. Reabrir a las dos
//     horas muestra 00:00 y cierra el intento.
//
// 2 · **Reanudar no pierde respuestas.** Se persiste tras CADA respuesta, no
//     cada 30 s. El motivo es concreto y está documentado en ADR-008: la sonda
//     de 1 byte de `hayLocalStorage()` **pasa con el disco casi lleno**, así que
//     antes de aquel arreglo `leerSesion()` devolvía la sesión *vieja* —con cero
//     respuestas— después de haber guardado la nueva. Un guardado periódico
//     encima de eso habría hecho el fallo intermitente e irreproducible.
//
// ══ POR QUÉ LA PERSISTENCIA VIVE EN UN EFECTO Y NO EN EL HANDLER ══
// El estado de la tanda es de `useSesion`, y sus actualizaciones son asíncronas:
// persistir dentro del handler guardaría el valor **anterior** al clic. El
// efecto se dispara cuando el estado ya cambió, que es el único momento en que
// lo que se escribe es lo que el usuario ve.
//
// ══ RELOJ (§22 regla 6) ══
// `Date.now()` no aparece en este archivo. El único que lo lee es
// `useCronometro`, dentro de su intervalo.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { useCronometro } from '@/hooks/usar-cronometro';
import { useSesion, type ResumenSesion as DatosResumen } from '@/hooks/usar-sesion';
import { marcarAvisoVisto, type UmbralAviso } from '@/lib/cronometro';
import { guardarSesion } from '@/lib/almacenamiento';
import type { BloqueId, Item, SesionCronometro } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import { Boton } from './boton';
import { CronometroVisual } from './cronometro-visual';
import { PanelNavegacion, type CeldaNavegacion } from './panel-navegacion';

interface Props {
  /** Ya presentados: las opciones vienen barajadas con la semilla del intento. */
  items: readonly Item[];
  /** La sesión persistida, recién creada o recuperada de `localStorage`. */
  sesion: SesionCronometro;
  /** `null` en el simulacro final: no tiene un bloque único en contexto. */
  bloque: BloqueId | null;
  volver: { href: string; texto: string };
  onCerrar: (resumen: DatosResumen) => void;
}

export function SimulacroEnCurso({ items, sesion: sesionBase, bloque, volver, onCerrar }: Props) {
  const inicial = useMemo(
    () => ({
      // El índice NO se persiste: `SesionCronometro` (§4) no tiene campo para
      // él y no se le añade uno. Se DERIVA — el primer ítem sin responder — que
      // además es mejor destino que el último visto: al reanudar, lo que el
      // usuario necesita es lo que le falta, no dónde estaba el cursor.
      //
      // Si respondió todos, vuelve al primero: es la revisión, que es lo único
      // que queda por hacer.
      indice: Math.max(
        0,
        items.findIndex((it) => {
          const r = sesionBase.respuestas[it.id];
          return r === undefined || r.valor === null || r.valor === undefined;
        }),
      ),
      respuestas: Object.fromEntries(
        Object.entries(sesionBase.respuestas).map(([id, r]) => [
          id,
          { valor: r.valor, segundos: r.segundos, marcada: r.marcada },
        ]),
      ),
    }),
    // Solo al montar: la sesión reanudada se lee una vez. Ver `SesionInicial`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const sesion = useSesion(items, inicial);
  const [avisosVistos, setAvisosVistos] = useState<readonly number[]>(sesionBase.avisosVistos);
  const [avisoVisible, setAvisoVisible] = useState<UmbralAviso | null>(null);

  // Guarda de cierre único. El auto-envío del cronómetro y el clic del usuario
  // pueden llegar en el mismo tick, y cerrar dos veces escribiría dos intentos.
  const yaCerrado = useRef(false);

  // [A-32] Al entrar en el simulacro el foco se quedaba en el `<body>`: la
  // portada, o el diálogo de reanudar, desaparecen del DOM con el botón que el
  // usuario acababa de pulsar. Chromium lo disimula con su *starting point*,
  // pero Firefox y Safari reinician el tabulador desde arriba de la página —con
  // el reloj ya corriendo—, así que quien navega con teclado empieza el examen
  // recorriendo el encabezado y la navegación.
  //
  // Es la misma corrección que `CierreSimulacro` ya hacía en la otra punta, y
  // por el mismo motivo. Se enfoca el contenedor, que es lo primero de la
  // pantalla: el lector anuncia el cronómetro y el `Tab` siguiente cae en la
  // primera opción del ítem.
  const refRaiz = useRef<HTMLDivElement>(null);
  useEffect(() => {
    refRaiz.current?.focus();
  }, []);

  const cerrar = useCallback(() => {
    if (yaCerrado.current) return;
    yaCerrado.current = true;
    onCerrar(sesion.terminar());
  }, [sesion, onCerrar]);

  // Objeto estable para el cronómetro: solo cambia cuando cambia algo que le
  // importa. Sin esto, cada respuesta reinstalaría su intervalo.
  const paraCronometro = useMemo<SesionCronometro>(
    () => ({ ...sesionBase, avisosVistos: [...avisosVistos] }),
    [sesionBase, avisosVistos],
  );

  const { restantesSeg, aviso } = useCronometro(paraCronometro, cerrar);

  // Un aviso cruzado se marca y se PERSISTE, así que recargar no lo redispara:
  // `avisoPendiente` ya no lo devuelve porque está en `avisosVistos`.
  useEffect(() => {
    if (aviso === null) return;
    setAvisoVisible(aviso);
    setAvisosVistos((previos) =>
      marcarAvisoVisto({ ...sesionBase, avisosVistos: [...previos] }, aviso).avisosVistos,
    );
  }, [aviso, sesionBase]);

  // ── Persistencia tras cada respuesta ──
  useEffect(() => {
    if (sesion.terminada) return;
    guardarSesion({
      ...sesionBase,
      avisosVistos: [...avisosVistos],
      respuestas: Object.fromEntries(
        Object.entries(sesion.respuestas).map(([id, r]) => [
          id,
          { valor: r.valor, segundos: r.segundos, marcada: r.marcada },
        ]),
      ),
    });
  }, [sesion.respuestas, sesion.terminada, sesionBase, avisosVistos]);

  const { item, indice, total, valor, esUltimo } = sesion;

  const celdas: CeldaNavegacion[] = items.map((it) => {
    const r = sesion.respuestas[it.id];
    if (r?.marcada) return { itemId: it.id, estado: 'marcada' };
    if (r && r.valor !== null && r.valor !== undefined) {
      return { itemId: it.id, estado: 'respondida' };
    }
    return { itemId: it.id, estado: 'sin-responder' };
  });

  if (item === undefined) return null;

  const avance = ((indice + 1) / total) * 100;

  return (
    <div ref={refRaiz} tabIndex={-1} className="space-y-4">
      <CronometroVisual restantesSeg={restantesSeg} avisoVisible={avisoVisible} />

      <div className="space-y-2">
        {/* [A-33] Con nombre, como la de los avisos: la pantalla tiene DOS
            regiones `status` y sin nombre son indistinguibles para quien navega
            por regiones. */}
        <p
          role="status"
          aria-label="Posición en el simulacro"
          className="text-[0.8125rem] text-muted-foreground"
        >
          Ítem {indice + 1} de {total}
        </p>
        {/* Banda del instrumento (DISENO.md §4.2): relleno puro, sin transición
            — `width` es propiedad de layout y §3 no la admite. */}
        <div className="h-1 w-full bg-secondary" aria-hidden="true">
          <div
            className={cn('h-full', bloque === null ? 'bg-primary' : CLASES_BLOQUE[bloque].fondo)}
            style={{ width: `${avance}%` }}
          />
        </div>
      </div>

      <article className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        {/* Sin retroalimentación por ítem: en un simulacro el veredicto llega al
            final. `modo` es siempre 'respondiendo' hasta el cierre. */}
        <EnvoltorioItem
          item={item}
          valor={valor}
          modo="respondiendo"
          onCambio={sesion.responder}
          numero={indice + 1}
          total={total}
        />
      </article>

      <nav aria-label="Avanzar por el simulacro" className="flex flex-wrap items-center gap-2">
        <Boton
          onClick={sesion.retroceder}
          variante="contorno"
          inactivo={indice === 0}
          className="min-h-11"
          aria-label="Ítem anterior"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Anterior
        </Boton>

        <Boton
          onClick={sesion.alternarMarca}
          variante={sesion.marcada ? 'contorno' : 'silencioso'}
          className="min-h-11"
          aria-pressed={sesion.marcada}
        >
          <Flag className={cn('size-4', sesion.marcada && 'text-aviso')} aria-hidden="true" />
          {sesion.marcada ? 'Marcada' : 'Marcar'}
        </Boton>

        <span className="flex-1" />

        {esUltimo ? (
          <Boton onClick={cerrar} className="min-h-11 min-w-[8rem]">
            Terminar y ver el resultado
          </Boton>
        ) : (
          <Boton onClick={sesion.avanzar} className="min-h-11 min-w-[8rem]">
            Siguiente
            <ArrowRight className="size-4" aria-hidden="true" />
          </Boton>
        )}
      </nav>

      <PanelNavegacion celdas={celdas} indiceActual={indice} onIr={sesion.irA} />

      <p className="text-[0.8125rem]">
        {/* `inline-flex`: el enlace es el único contenido de su párrafo, así que
            no le vale la excepción de 2.5.8 para enlaces dentro de una frase
            (A-24). */}
        <Link
          href={volver.href}
          className="inline-flex items-center text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Salir sin terminar
        </Link>{' '}
        <span className="text-muted-foreground">
          — el tiempo sigue corriendo y podrás retomarlo donde ibas.
        </span>
      </p>
    </div>
  );
}
