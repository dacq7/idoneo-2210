// src/lib/descargar-archivo.ts
// Provocar la descarga de un texto como archivo. Sin `"use client"`: módulo
// neutro con guarda de SSR, como `almacenamiento.ts`.
//
// Lo usan las DOS salidas de datos de /ajustes —el respaldo del progreso y el
// volcado de la cuarentena de ADR-008— y por eso vive fuera de las dos. Que la
// cuarentena pueda descargarse es lo único que hace recuperable un progreso que
// la app ya no sabe leer: si esta función falla, ese payload se pierde.
//
// ══ POR QUÉ NO SE USA UN `data:` URI ══
// Un `href="data:..."` es más corto de escribir y **se rompe con archivos
// grandes** en algunos navegadores, con un límite que no está especificado en
// ninguna parte. Un respaldo con 30 intentos completos pasa de 100 kB sin
// esfuerzo. `Blob` + `createObjectURL` no tiene ese techo.

/**
 * Descarga `contenido` como un archivo llamado `nombre`.
 *
 * Solo desde handlers o efectos: toca `document`. En servidor no hace nada.
 */
export function descargarTexto(contenido: string, nombre: string, tipo = 'application/json'): void {
  if (typeof document === 'undefined') return;

  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  // Firefox exige que el ancla esté en el documento para que el click cuente.
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  // Sin revoke, el Blob queda retenido en memoria hasta que se cierre la
  // pestaña. Con respaldos de cientos de kB y varias descargas seguidas, se
  // nota. El timeout da margen a que el navegador empiece la descarga: en
  // Safari, revocar en el mismo tick la cancela.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
