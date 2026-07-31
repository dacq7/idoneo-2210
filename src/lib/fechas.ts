// src/lib/fechas.ts
// Helpers de fecha deterministas. Ninguna función llama a Date.now()
// ni a `new Date()` sin argumentos: todas derivan de sus parámetros.

/** 'YYYY-MM-DD' a partir de un ISO completo. */
export function soloFecha(iso: string): string {
  return iso.slice(0, 10);
}

function aUTC(fecha: string): number {
  const [a, m, d] = fecha.slice(0, 10).split('-').map(Number);
  return Date.UTC(a, m - 1, d);
}

/** Días calendario entre dos fechas 'YYYY-MM-DD'. Positivo si `hasta` es posterior. */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUTC(hasta) - aUTC(desde)) / 86_400_000);
}

export function sumarDias(fecha: string, dias: number): string {
  const t = aUTC(fecha) + dias * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** 'sáb 2 ago' — para las cabeceras del plan. */
export function etiquetaCorta(fecha: string): string {
  const t = new Date(`${fecha.slice(0, 10)}T12:00:00Z`);
  return t
    .toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    })
    .replace('.', '');
}

/** 'MM:SS' o 'H:MM:SS' si pasa de una hora. Para el cronómetro. */
export function formatearDuracion(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const dd = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${dd(m)}:${dd(seg)}` : `${dd(m)}:${dd(seg)}`;
}

/**
 * `2026-07-30` a partir de un `Date`, en la zona horaria del DISPOSITIVO.
 *
 * Es el «hoy» del repaso espaciado, y no puede ser `soloFecha(iso)`. Todo
 * `src/lib/srs.ts` trabaja sobre cadenas 'YYYY-MM-DD' y es agnóstico de zona:
 * lo único que decide de qué día habla es quién calcula este valor.
 * `soloFecha(new Date().toISOString())` devuelve la fecha **UTC**, y Colombia es
 * UTC−5 — a las 19:00 en Bogotá, UTC ya está en el día siguiente.
 *
 * Con la fecha UTC la cola del día se adelantaría cinco horas cada tarde, justo
 * en la franja en que el usuario de esta app estudia (de noche, después de
 * trabajar): una tarjeta programada para mañana aparecería hoy a las 7 p. m. y
 * el intervalo real del SM-2 se acortaría un día de forma sistemática. No es un
 * detalle de formato: corrompe el espaciado, que es el único mecanismo del que
 * depende `/repaso`.
 *
 * A mano y no con `toLocaleDateString('en-CA')`: así el resultado no depende de
 * qué datos de ICU traiga el navegador.
 *
 * NO lee el reloj (§22 regla 6): recibe el `Date` ya construido, y quien lo
 * construye es un handler o un efecto, que es donde §10.4 lo autoriza.
 */
export function fechaLocalDe(momento: Date): string {
  const dosDigitos = (n: number) => String(n).padStart(2, '0');
  return `${momento.getFullYear()}-${dosDigitos(momento.getMonth() + 1)}-${dosDigitos(momento.getDate())}`;
}
