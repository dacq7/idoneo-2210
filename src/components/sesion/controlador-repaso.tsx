'use client';

// src/components/sesion/controlador-repaso.tsx — Client Component (§10.3).
//
// La cola de repaso espaciado del día. Mezcla dos cosas distintas —tarjetas
// (`C5-T07`) e ítems del banco (`C5-014`)— porque eso es lo que `lib/srs.ts`
// guarda en `colaRepaso`, y las presenta con el gesto que le corresponde a cada
// una: la tarjeta se responde «la sabía / no la sabía», el ítem se responde.
//
// ══════════════════════════════════════════════════════════════════════════
// LA DECISIÓN DEL PASO: DE DÓNDE SALE EL CONTENIDO DE LA COLA
// ══════════════════════════════════════════════════════════════════════════
//
// El problema es real y no lo tiene ninguna otra ruta de la app: **la cola vive
// en `localStorage`, así que el servidor no sabe qué hay que repasar**, pero el
// contenido al que la cola apunta vive en `content/` y la cola MEZCLA MÓDULOS.
// Todas las rutas anteriores conocían su slug por `params` y cargaban su
// contenido en el servidor (ADR-010); aquí no hay slug que valga.
//
// Las tres salidas posibles, y por qué esta:
//
//  1. **El servidor manda todo el contenido por prop y el cliente filtra.** Es
//     lo que hacen `/practica` y `/quiz`, y aquí NO ESCALA. Hoy sería el banco
//     de C5 (28 ítems, ~8 kB gz de carga útil RSC). Con los 29 módulos de los
//     pasos 15–17 son ~750 ítems y ~350 tarjetas en el documento de **la ruta
//     que se visita a diario**, cada vez, aunque la cola tenga tres elementos.
//     El coste crecería con el contenido y no con el uso: exactamente el patrón
//     que ADR-010 existe para impedir. Descartada por medición, no por gusto.
//
//  2. **Import estático de los índices desde este cliente.** Lo prohíbe ADR-010
//     y con razón: metería los 29 loaders y su grafo en el bundle de la ruta.
//
//  3. **`import()` dinámico de `content/banco/indice` y `content/tarjetas/indice`
//     bajo interacción, y carga solo de los módulos que la cola pide.** ← ESTA.
//
// **La 3 no viola ADR-010: es el caso que ADR-010 declara explícitamente
// permitido.** Su párrafo final lo dice con todas las letras: «Esto no
// contradice la asimetría de §2.2 ("el banco es importable desde el cliente"):
// ahí lo que se busca es `import()` **dinámico**, bajo interacción del usuario,
// con code splitting real. Lo que esta regla prohíbe es el import **estático**
// en el grafo del bundle inicial». Y §2.2 y §10.2 regla 4 son aún más
// explícitos: `content/banco/*` y `content/tarjetas/*` son **client-safe a
// propósito**, y `cargarBancoModulo` / `cargarTarjetas` existen exactamente
// para esto. Lo que ADR-010 protege es `content/estructura` —los 29 módulos con
// sus objetivos y conceptos— y eso aquí **sigue entrando por prop**
// (`ModuloPublicado`: tres campos, ni uno más).
//
// **Por qué escala.** El usuario descarga los chunks de los módulos que su cola
// menciona, y solo esos. Una cola de 30 elementos de tres módulos son tres
// chunks; el bundle inicial de `/repaso` no lleva ni un ítem. A 29 módulos el
// coste por visita depende de **qué está estudiando**, no de cuánto contenido
// existe — que es la única forma de que esta ruta siga siendo barata en el paso
// 17.
//
// **Consecuencia que hay que declarar, y se declara:** desde este paso hay
// contenido del banco y de las tarjetas dentro de `.next/static/chunks/`, en
// chunks diferidos. Es la primera vez que ocurre. Los dos canarios de ADR-010
// (`osteomuscular` de `content/estructura.ts` y `Malondialdehído` de
// `content/datos-duros.ts`) siguen sirviendo y siguen limpios, porque ninguno
// sale de `banco/` ni de `tarjetas/` — que es justo el motivo por el que
// COMPONENTES.md ya advertía que las cadenas de esos dos directorios **no
// sirven como canario**. Cualquier sonda que busque cadenas del banco en los
// chunks dará positivo a partir de hoy y hay que retirarla.
//
// ══ ALEATORIEDAD (§22 regla 5) ══
// Cero `Math.random()`. El ORDEN de la sesión no se sortea: lo fija
// `colaDelDia`, que prioriza lo más atrasado y desempata por id. Lo que sí se
// baraja son las opciones de los ítems, con `presentarTanda(items, semilla)` y
// una semilla nacida de `Date.now()` DENTRO del efecto de preparación (§10.4).
// Sin barajar, repasar tres veces el mismo ítem fallado enseña la posición de la
// opción correcta en vez del contenido, que es el fallo clásico del repaso.
//
// ══ RELOJ (§22 regla 6) ══
// El reloj se lee en el efecto de preparación y en el handler de respuesta,
// nunca en el cuerpo del render. El `hoy` que consume el motor es la FECHA
// LOCAL — ver `fechaLocalDe` en `src/lib/fechas.ts`: con UTC la cola se
// adelantaría cinco horas cada tarde y el espaciado se corrompería.
//
// ══ LA SESIÓN SE CONGELA AL EMPEZAR ══
// La lista se calcula una sola vez. Cada respuesta reescribe `colaRepaso`, y si
// se recalculara `colaDelDia` en cada render, el elemento recién respondido
// desaparecería de la lista bajo los pies del usuario y el contador saltaría.
//
// ══ SRS ══
// Este componente NO reimplementa nada: `colaDelDia`, `resumirRepaso` y
// `registrarRevision` son de `lib/srs.ts`, la calificación es `calificar()` de
// `lib/simulacro.ts` y la persistencia es `guardarColaRepaso`.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { Retroalimentacion } from '@/components/items/retroalimentacion';
import { useEstado } from '@/hooks/usar-estado';
import { guardarColaRepaso, leerEstado } from '@/lib/almacenamiento';
import { calificar, presentarTanda, sinResponder } from '@/lib/simulacro';
import { colaDelDia, registrarRevision, resumirRepaso, type ResumenRepaso } from '@/lib/srs';
import type { BloqueId, Item, Tarjeta, TarjetaSRS } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';
import { Boton } from './boton';
import { fechaLocalDe } from '@/lib/fechas';
import {
  CierreRepaso,
  ColaSinContenido,
  ColaSinEstrenar,
  NadaPendienteHoy,
  RepasoSinRed,
  siguienteSinDominar,
  type ModuloPublicado,
} from './repaso-vacio';

/** Un elemento de la cola, ya resuelto contra su contenido. */
type Elemento =
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

type Vista =
  | { fase: 'cargando' }
  | { fase: 'vacia'; resumen: ResumenRepaso; pendientesHuerfanos: number }
  | { fase: 'sesion'; elementos: readonly Elemento[] }
  // El `import()` del contenido puede rechazar: red caída antes de que el
  // service worker haya cacheado el chunk, o chunk viejo tras un redespliegue.
  // §3 del brief cuenta con conectividad intermitente, así que no es un borde
  // exótico: es el martes por la noche en el bus. Sin esta fase, la vista se
  // quedaba en 'cargando' para siempre.
  | { fase: 'error'; intento: number };

const NOMBRE_TIPO: Record<Tarjeta['tipo'], string> = {
  definicion: 'Definición',
  dato: 'Dato',
  clasificacion: 'Clasificación',
  formula: 'Fórmula',
};

/**
 * Resuelve los ids de la cola contra el contenido, cargándolo con `import()`
 * dinámico y solo de los módulos que la cola menciona. Ver la cabecera.
 *
 * El prefijo del id (`C5-T07` → `c5`) es el prefijo del slug: lo garantiza el
 * validador de banco, que falla el build si un ítem no lo cumple.
 */
async function resolverElementos(
  pendientes: readonly TarjetaSRS[],
  modulos: readonly ModuloPublicado[],
  semilla: number,
): Promise<Elemento[]> {
  const porPrefijo = new Map(modulos.map((m) => [m.slug.split('-')[0], m]));

  const necesarios = new Map<string, ModuloPublicado>();
  for (const { id } of pendientes) {
    const modulo = porPrefijo.get(id.split('-')[0].toLowerCase());
    if (modulo) necesarios.set(modulo.slug, modulo);
  }
  if (necesarios.size === 0) return [];

  const [tarjetasIndice, bancoIndice] = await Promise.all([
    import('@/content/tarjetas/indice'),
    import('@/content/banco/indice'),
  ]);

  const tarjetas = new Map<string, { tarjeta: Tarjeta; modulo: ModuloPublicado }>();
  const items = new Map<string, { item: Item; modulo: ModuloPublicado }>();

  await Promise.all(
    [...necesarios.values()].map(async (modulo) => {
      const [delModulo, delBanco] = await Promise.all([
        tarjetasIndice.cargarTarjetas(modulo.slug),
        bancoIndice.cargarBancoModulo(modulo.slug),
      ]);
      for (const tarjeta of delModulo) tarjetas.set(tarjeta.id, { tarjeta, modulo });
      for (const item of delBanco) items.set(item.id, { item, modulo });
    }),
  );

  // Las opciones se barajan por tanda, no ítem a ítem: `presentarTanda` avanza
  // un solo rng, que es lo que hace el resultado reproducible dada la semilla.
  const enOrden = pendientes.map(({ id }) => items.get(id)).filter((x) => x !== undefined);
  const presentados = presentarTanda(
    enOrden.map((x) => x.item),
    semilla,
  );
  const presentadoPorId = new Map(presentados.map((item) => [item.id, item]));

  const elementos: Elemento[] = [];
  for (const { id } of pendientes) {
    const conTarjeta = tarjetas.get(id);
    if (conTarjeta) {
      elementos.push({
        clase: 'tarjeta',
        id,
        bloque: conTarjeta.modulo.bloque,
        tituloModulo: conTarjeta.modulo.titulo,
        frente: conTarjeta.tarjeta.frente,
        reverso: conTarjeta.tarjeta.reverso,
        tipo: conTarjeta.tarjeta.tipo,
      });
      continue;
    }
    const conItem = items.get(id);
    const presentado = presentadoPorId.get(id);
    // Un id sin contenido no rompe la sesión: se omite. No se purga de la cola,
    // porque el módulo puede publicarse más adelante y el progreso del elemento
    // sigue siendo válido (§22 regla 12).
    if (conItem && presentado) {
      elementos.push({
        clase: 'item',
        id,
        bloque: conItem.modulo.bloque,
        tituloModulo: conItem.modulo.titulo,
        item: presentado,
      });
    }
  }

  return elementos;
}

export function ControladorRepaso({ modulos }: { modulos: readonly ModuloPublicado[] }) {
  const estado = useEstado();

  // `useEstado()` devuelve null en el primer render (servidor e hidratación) Y
  // TAMBIÉN de forma permanente mientras no haya nada guardado. En `/repaso` ese
  // es el caso NORMAL de un usuario nuevo, así que tratar `null` como «cargando»
  // dejaría el esqueleto puesto para siempre — el patrón es el de
  // `etapas-modulo.tsx` y aquí importa más que en ningún otro sitio.
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    setMontado(true);
  }, []);

  const [vista, setVista] = useState<Vista>({ fase: 'cargando' });
  const preparando = useRef(false);

  useEffect(() => {
    // La sesión se congela: una vez armada, ninguna escritura la recalcula.
    if (!montado || vista.fase === 'sesion' || preparando.current) return;

    const cola = estado?.colaRepaso ?? {};
    // Efecto: aquí sí se puede leer el reloj (§10.4).
    const ahora = new Date();
    const hoy = fechaLocalDe(ahora);
    const resumen = resumirRepaso(cola, hoy);
    const pendientes = colaDelDia(cola, hoy);

    if (pendientes.length === 0) {
      setVista({ fase: 'vacia', resumen, pendientesHuerfanos: 0 });
      return;
    }

    preparando.current = true;
    let vivo = true;
    void resolverElementos(pendientes, modulos, ahora.getTime())
      .then((elementos) => {
        if (!vivo) return;
        preparando.current = false;
        setVista(
          elementos.length > 0
            ? { fase: 'sesion', elementos }
            : { fase: 'vacia', resumen, pendientesHuerfanos: pendientes.length },
        );
      })
      .catch(() => {
        if (!vivo) return;
        // Liberar la guarda es la mitad del arreglo: sin esto, `preparando`
        // se queda en true y NINGUNA escritura posterior vuelve a intentarlo.
        preparando.current = false;
        setVista((previa) => ({
          fase: 'error',
          intento: previa.fase === 'error' ? previa.intento + 1 : 1,
        }));
      });

    return () => {
      vivo = false;
      preparando.current = false;
    };
  }, [montado, estado, modulos, vista.fase]);

  const dominados = new Set(
    Object.entries(estado?.modulos ?? {})
      .filter(([, m]) => m.dominado)
      .map(([slug]) => slug),
  );
  const siguiente = montado ? siguienteSinDominar(modulos, dominados) : null;

  if (vista.fase === 'cargando') return <Esqueleto />;

  if (vista.fase === 'error') {
    return (
      <RepasoSinRed
        intento={vista.intento}
        // Volver a 'cargando' relanza el efecto: `vista.fase` es una de sus deps.
        onReintentar={() => setVista({ fase: 'cargando' })}
      />
    );
  }

  if (vista.fase === 'vacia') {
    if (vista.pendientesHuerfanos > 0) {
      return <ColaSinContenido pendientes={vista.pendientesHuerfanos} siguiente={siguiente} />;
    }
    if (vista.resumen.totalEnCola === 0) return <ColaSinEstrenar siguiente={siguiente} />;
    return (
      <NadaPendienteHoy
        totalEnCola={vista.resumen.totalEnCola}
        proximoEnDias={vista.resumen.proximoEnDias}
        siguiente={siguiente}
      />
    );
  }

  return <SesionRepaso elementos={vista.elementos} siguiente={siguiente} />;
}

function Esqueleto() {
  return (
    <div className="space-y-4">
      <span className="sr-only">Cargando tu cola de repaso</span>
      <span className="block h-1 w-full bg-secondary" aria-hidden="true" />
      <span
        className="block h-40 w-full animate-pulse rounded-lg bg-accent"
        aria-hidden="true"
      />
    </div>
  );
}

function SesionRepaso({
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
