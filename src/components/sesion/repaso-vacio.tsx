// src/components/sesion/repaso-vacio.tsx — pantallas sin sesión de `/repaso`.
//
// Sin directiva de cliente: lo importa `controlador-repaso.tsx`. No es un alta a
// §10.3. Vive aparte para que el controlador no pase de 300 líneas (regla de
// código 1 de CLAUDE.md), igual que `resumen-sesion.tsx` respecto al controlador
// de sesión.
//
// ══ CERO RELLENO ARTIFICIAL (brief §6.1) ══
// Si la cola del día está vacía, aquí NO se inventan elementos para que la
// pantalla «tenga algo». Se dice la verdad, se dice cuándo vuelve a haber
// trabajo, y se ofrece la acción concreta que sí tiene sentido hoy: el siguiente
// módulo sin dominar. Rellenar la cola con tarjetas que el usuario ya domina
// sería exactamente lo que el repaso espaciado existe para evitar.
//
// Son CUATRO pantallas distintas y la diferencia importa, porque el consejo
// correcto es distinto en cada una:
//
//   · cola vacía del todo   → todavía no ha estudiado nada. Se explica cómo
//                             entran las cosas a la cola.
//   · nada pendiente hoy    → va al día. Se dice en cuántos días vuelve a tocar.
//   · cola sin contenido    → tiene ids de módulos que ya no están publicados.
//                             Caso raro, pero deja la cola en un limbo y hay que
//                             decirlo en vez de mostrar una pantalla en blanco.
//   · terminó la sesión     → cuántos supo y cuántos no, sin felicitación vacía.
//
// Retroalimentación honesta (§22 regla 10): el mensaje de «lo supe todo» es el
// más severo del conjunto, por la misma razón que en el mazo de tarjetas.

import Link from 'next/link';
import { CalendarCheck, Inbox, TriangleAlert, WifiOff } from 'lucide-react';
import type { BloqueId } from '@/lib/tipos';
import { CLASES_BLOQUE, cn } from '@/lib/utils';

/** Lo mínimo que el repaso necesita saber de un módulo publicado. Serializable.
 *  Llega por prop desde la página, que es Server Component (ADR-010). */
export interface ModuloPublicado {
  slug: string;
  titulo: string;
  bloque: BloqueId;
}

/**
 * El primer módulo publicado que el usuario todavía no domina, en orden de
 * estudio. `null` si no hay ninguno —o porque no hay contenido publicado, o
 * porque los domina todos—, y las dos situaciones se resuelven con un enlace al
 * índice: no se inventa un módulo para tener algo que ofrecer.
 */
export function siguienteSinDominar(
  modulos: readonly ModuloPublicado[],
  dominados: ReadonlySet<string>,
): ModuloPublicado | null {
  return modulos.find((m) => !dominados.has(m.slug)) ?? null;
}

/** Bloque de acción compartido por las cuatro pantallas. */
export function AccionSiguiente({
  modulo,
  encabezado,
}: {
  modulo: ModuloPublicado | null;
  encabezado: string;
}) {
  if (modulo === null) {
    return (
      <p className="text-muted-foreground">
        {encabezado}{' '}
        <Link
          href="/modulos"
          className="font-medium text-primary underline underline-offset-2"
        >
          Mira el índice de módulos
        </Link>{' '}
        para elegir por dónde seguir.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground">{encabezado}</p>
      <Link
        href={`/modulos/${modulo.slug}`}
        className={cn(
          'flex min-h-11 items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5',
          'transition-colors duration-150 hover:bg-accent sm:px-6',
        )}
      >
        {/* Banda de color de bloque: relleno puro y `aria-hidden`, porque el
            texto de al lado ya nombra el bloque (DISENO.md §1.2). */}
        <span
          className={cn('h-5 w-1 shrink-0', CLASES_BLOQUE[modulo.bloque].fondo)}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.6875rem] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
            Bloque {modulo.bloque} · siguiente sin dominar
          </span>
          <span className="mt-0.5 block font-medium">{modulo.titulo}</span>
        </span>
      </Link>
    </div>
  );
}

function Marco({
  icono: Icono,
  titulo,
  children,
}: {
  icono: typeof Inbox;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby="estado-repaso"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Icono className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <h2 id="estado-repaso" className="min-w-0 flex-1">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** Cola completamente vacía: el usuario todavía no ha estudiado nada. */
export function ColaSinEstrenar({ siguiente }: { siguiente: ModuloPublicado | null }) {
  return (
    <Marco icono={Inbox} titulo="Todavía no hay nada que repasar">
      <p className="text-muted-foreground">
        La cola no se llena sola ni se rellena con material de relleno: aquí solo entra
        lo que ya viste y lo que ya fallaste. Cada tarjeta que respondas en la etapa
        Tarjetas de un módulo entra a la cola, y cada pregunta que falles en la práctica,
        en el quiz o en un simulacro entra también.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Empieza por estudiar un módulo y mañana esta pantalla ya tendrá trabajo."
      />
    </Marco>
  );
}

/** Hay cola, pero hoy no vence nada. El caso bueno. */
export function NadaPendienteHoy({
  totalEnCola,
  proximoEnDias,
  siguiente,
}: {
  totalEnCola: number;
  proximoEnDias: number | null;
  siguiente: ModuloPublicado | null;
}) {
  return (
    <Marco icono={CalendarCheck} titulo="Nada que repasar hoy — tu memoria va al día">
      <p className="text-muted-foreground">
        Tienes {totalEnCola === 1 ? '1 elemento' : `${totalEnCola} elementos`} en la cola y
        ninguno vence hoy.{' '}
        {proximoEnDias === null
          ? 'Todos están al día.'
          : proximoEnDias <= 1
            ? 'El siguiente te toca mañana.'
            : `El siguiente te toca dentro de ${proximoEnDias} días.`}{' '}
        Adelantar un repaso no lo refuerza más: el espaciado funciona porque cuesta
        recordar, y si respondes hoy lo que te toca el jueves, el jueves ya no te costará.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Hoy el tiempo rinde más en material nuevo."
      />
    </Marco>
  );
}

/** La cola apunta a contenido que ya no está publicado. */
export function ColaSinContenido({
  pendientes,
  siguiente,
}: {
  pendientes: number;
  siguiente: ModuloPublicado | null;
}) {
  return (
    <Marco icono={TriangleAlert} titulo="Tu cola apunta a contenido que ya no está">
      <p className="text-muted-foreground">
        Hay {pendientes === 1 ? '1 elemento pendiente' : `${pendientes} elementos pendientes`}{' '}
        de hoy, pero pertenecen a módulos cuyo contenido no está publicado en esta versión
        de la app. No se ha perdido tu progreso: esos elementos siguen guardados y volverán
        a aparecer en cuanto su módulo se publique.
      </p>
      <AccionSiguiente
        modulo={siguiente}
        encabezado="Mientras tanto, esto sí está listo para estudiar."
      />
    </Marco>
  );
}

/**
 * No se pudo descargar el contenido de la cola.
 *
 * Quinta pantalla, y la única que NO es un estado vacío: aquí sí hay algo que
 * repasar y el problema es de red. Por eso no se recicla `ColaSinContenido`, que
 * diría «volverán a aparecer en cuanto su módulo se publique» — una mentira
 * cuando lo que pasa es que el bus entró en un túnel.
 *
 * El contenido de esta app se cachea con el service worker (§16), así que este
 * fallo es de la PRIMERA vez que se abre un módulo sin red. Decirlo es útil: el
 * usuario sabe que la próxima vez sí funcionará.
 */
export function RepasoSinRed({
  intento,
  onReintentar,
}: {
  intento: number;
  onReintentar: () => void;
}) {
  return (
    <Marco icono={WifiOff} titulo="No se pudo cargar el material de hoy">
      <p className="text-muted-foreground">
        Tu cola está intacta —no se ha perdido nada— pero no se pudo descargar el contenido
        que toca repasar. Suele ser la conexión.
      </p>
      <p className="text-muted-foreground">
        Los módulos que ya abriste antes quedan guardados en el dispositivo y funcionan sin
        red. Este es material que aún no habías descargado.
      </p>
      <button
        type="button"
        onClick={onReintentar}
        className="min-h-[44px] w-full rounded-md border border-border bg-card px-4 font-medium transition-colors duration-150 hover:bg-accent sm:w-auto sm:px-6"
      >
        Reintentar
      </button>
      {intento > 1 ? (
        <p className="text-[0.8125rem] text-muted-foreground" role="status">
          {intento} intentos sin conseguirlo. Si sigue igual, vuelve más tarde: la cola te
          espera.
        </p>
      ) : null}
    </Marco>
  );
}

/** Terminó la sesión del día. */
export function CierreRepaso({
  ref,
  total,
  acertadas,
  siguiente,
}: {
  ref: React.Ref<HTMLHeadingElement>;
  total: number;
  acertadas: number;
  siguiente: ModuloPublicado | null;
}) {
  const fallos = total - acertadas;

  return (
    <section
      aria-labelledby="cierre-repaso"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      {/* tabIndex -1: recibe el foco al cerrar la sesión, para que el cambio de
          pantalla se anuncie y no haya que buscar dónde quedó el hilo. */}
      <h2 id="cierre-repaso" ref={ref} tabIndex={-1}>
        Terminaste el repaso de hoy
      </h2>

      <p className="text-[0.9375rem]">
        Repasaste {total === 1 ? '1 elemento' : `${total} elementos`}. Acertaste{' '}
        <strong className="font-semibold">{acertadas}</strong> y fallaste{' '}
        <strong className="font-semibold">{fallos}</strong>.
      </p>

      <p className="text-muted-foreground">
        {fallos === 0
          ? 'Los que acertaste se alejan en el calendario y no vuelven mañana. Ojo con leer esto como que ya te los sabes: acertar hoy lo que viste hace dos días es lo mínimo que el espaciado espera, y la prueba real es acertarlo dentro de tres semanas.'
          : fallos >= total / 2
            ? 'Los que fallaste vuelven mañana, y eso es exactamente lo que tiene que pasar: el intervalo se reinicia hasta que dejen de fallarse. Si un módulo entero se te está cayendo aquí, el problema no es la cola, es que ese módulo hay que releerlo.'
            : 'Los que fallaste vuelven mañana; los que acertaste se alejan. Así es como la cola se va vaciando sola sin que tengas que decidir qué repasar.'}
      </p>

      <AccionSiguiente
        modulo={siguiente}
        encabezado="Ya no queda cola para hoy. Si te sobra tiempo, rinde en material nuevo."
      />
    </section>
  );
}
