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
