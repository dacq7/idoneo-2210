'use client';

// src/components/ajustes/respaldo.tsx — Client Component.
//
// ══════════════════════════════════════════════════════════════════════════
// ES LO QUE MÁS FALTA PARA PODER COMPARTIR LA APP
// ══════════════════════════════════════════════════════════════════════════
//
// Sin backend, el respaldo JSON es el ÚNICO camino entre dos dispositivos y el
// único seguro contra «borré los datos del navegador». Hasta este paso, un
// entrenador que estudiara dos meses en el móvil no tenía forma de pasar nada
// al portátil, ni de recuperarse de un borrado accidental.
//
// ══ IMPORTAR NUNCA DESTRUYE SIN CONFIRMAR ══
// §22 regla 12. El flujo es de tres tiempos y ninguno se puede saltar:
//   1. Se lee el archivo y se valida con Zod (`importarJSON`). Un archivo
//      inválido se rechaza AQUÍ, con su motivo, y no toca nada.
//   2. Se enseña **qué hay dentro** —cuándo se creó, cuántos intentos, cuántos
//      módulos— y **qué se va a perder**, con las cifras de lo que hay ahora.
//   3. Solo entonces aparece el botón que sobrescribe.
// Un archivo corrupto no puede destruir el progreso actual, porque el progreso
// actual no se toca hasta el paso 3.
//
// ══ EXPORTAR ANOTA LA FECHA ══
// `guardarPreferencias({ ultimoRespaldo })` es lo que apaga el recordatorio de
// los 7 días. Se escribe DESPUÉS de disparar la descarga, no antes: si el
// navegador la bloquea, el recordatorio debe seguir sonando.

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  exportarJSON,
  guardarEstado,
  guardarPreferencias,
  importarJSON,
  necesitaRespaldo,
  nombreArchivoRespaldo,
} from '@/lib/almacenamiento';
import { descargarTexto } from '@/lib/descargar-archivo';
import { fechaLocalDe, sumarDias } from '@/lib/fechas';
import type { EstadoProgreso } from '@/lib/tipos';

export function Respaldo({ estado, hoy }: { estado: EstadoProgreso | null; hoy: string }) {
  const entrada = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState<EstadoProgreso | null>(null);
  const [hecho, setHecho] = useState<string | null>(null);

  const exportar = () => {
    if (!estado) return;
    // Aquí sí se lee el reloj: es un handler, y la fecha del respaldo tiene que
    // ser la del momento de descargarlo, no la del montaje de la pantalla.
    const ahora = new Date();
    const fecha = fechaLocalDe(ahora);
    descargarTexto(exportarJSON(estado), nombreArchivoRespaldo(fecha));
    guardarPreferencias({ ultimoRespaldo: fecha }, ahora.toISOString());
    setHecho(`Respaldo descargado el ${fecha}.`);
  };

  const elegirArchivo = async (archivo: File) => {
    setError(null);
    setHecho(null);
    const texto = await archivo.text();
    const resultado = importarJSON(texto);
    if (!resultado.ok) {
      setError(resultado.error);
      setPendiente(null);
      return;
    }
    setPendiente(resultado.estado);
  };

  const confirmarImportacion = () => {
    if (!pendiente) return;
    guardarEstado(pendiente);
    setPendiente(null);
    setHecho('Progreso importado. Lo que ves ahora viene del archivo.');
  };

  // `hoy` llega por prop desde `PanelAjustes`, que lo calcula en su efecto de
  // montaje. Leer el reloj aquí violaba §22 regla 6 —era el único caso en todo
  // el proyecto— y además se recalculaba en cada tecla que alguien escribiera
  // en el campo de nombre de la sección de arriba. Lo levantó el code-reviewer.
  const avisar = estado !== null && necesitaRespaldo(estado, sumarDias(hoy, -7));

  return (
    <section aria-labelledby="respaldo-titulo" className="space-y-4">
      <div className="space-y-1">
        <h2 id="respaldo-titulo">Respaldo</h2>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Tu progreso vive solo en este navegador y no hay copia en ningún servidor. Un archivo de
          respaldo es lo único que lo mueve a otro dispositivo o lo salva de un borrado.
        </p>
      </div>

      {avisar ? (
        <p className="rounded-lg border border-aviso/40 bg-aviso/10 p-3 text-[0.8125rem] leading-[1.5]">
          Hace más de una semana que no haces un respaldo, y ya tienes intentos guardados. Es buen
          momento.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={exportar} disabled={!estado}>
          <Download className="size-4" aria-hidden="true" />
          Exportar mi progreso
        </Button>
        <Button type="button" variant="outline" onClick={() => entrada.current?.click()}>
          <Upload className="size-4" aria-hidden="true" />
          Importar un respaldo
        </Button>
        <input
          ref={entrada}
          type="file"
          accept="application/json,.json"
          // [A-54] `sr-only` lo saca de la vista pero lo deja en el árbol y en
          // el orden de foco: era una segunda parada anónima justo detrás del
          // botón que sí tiene nombre. Es el disparador del botón de al lado,
          // no un control propio, así que se retira de las dos cosas.
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          // Se limpia el valor tras leer: sin esto, elegir el MISMO archivo dos
          // veces seguidas no dispara `change` y parece que el botón se rompió.
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (archivo) void elegirArchivo(archivo);
            e.target.value = '';
          }}
        />
      </div>

      {!estado ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          Todavía no hay nada que exportar. En cuanto empieces un módulo o un simulacro, aquí
          aparecerá tu progreso.
        </p>
      ) : null}

      {/* Las tres salidas del flujo se anuncian. `polite`: ninguna es urgente y
          todas ocurren tras una pulsación del usuario, que ya está mirando. */}
      <div aria-live="polite" className="space-y-3">
        {error ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-[0.8125rem] leading-[1.5]">
            No se pudo importar: {error} Tu progreso actual no se ha tocado.
          </p>
        ) : null}

        {hecho ? (
          <p className="rounded-lg border border-exito/40 bg-exito/10 p-3 text-[0.8125rem]">
            {hecho}
          </p>
        ) : null}

        {pendiente ? (
          <ConfirmarImportacion
            entrante={pendiente}
            actual={estado}
            onConfirmar={confirmarImportacion}
            onCancelar={() => setPendiente(null)}
          />
        ) : null}
      </div>
    </section>
  );
}

/** El paso 2 del flujo: qué trae el archivo y qué se pierde al aceptarlo. */
function ConfirmarImportacion({
  entrante,
  actual,
  onConfirmar,
  onCancelar,
}: {
  entrante: EstadoProgreso;
  actual: EstadoProgreso | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const resumir = (e: EstadoProgreso) =>
    `${e.intentos.length} ${e.intentos.length === 1 ? 'intento' : 'intentos'} · ` +
    `${Object.keys(e.modulos).length} ${Object.keys(e.modulos).length === 1 ? 'módulo tocado' : 'módulos tocados'} · ` +
    `desde el ${e.creadoEn.slice(0, 10)}`;

  return (
    <div className="space-y-3 rounded-lg border border-aviso/40 bg-aviso/10 p-4">
      <p className="font-medium">El archivo es válido. Antes de aplicarlo:</p>
      <dl className="space-y-2 text-[0.8125rem] leading-[1.5]">
        <div>
          <dt className="font-medium">Lo que trae el archivo</dt>
          <dd className="text-muted-foreground">{resumir(entrante)}</dd>
        </div>
        <div>
          <dt className="font-medium">Lo que tienes ahora, y se va a perder</dt>
          <dd className="text-muted-foreground">
            {actual ? resumir(actual) : 'Nada: este navegador no tiene progreso guardado.'}
          </dd>
        </div>
      </dl>
      <p className="text-[0.8125rem] leading-[1.5]">
        Importar <strong className="font-semibold">sustituye</strong> tu progreso por el del
        archivo. No se mezclan.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onConfirmar}>
          Sustituir mi progreso
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
