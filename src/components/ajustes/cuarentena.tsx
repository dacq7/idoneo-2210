'use client';

// src/components/ajustes/cuarentena.tsx — Client Component.
//
// ══════════════════════════════════════════════════════════════════════════
// LA UI DE ADR-008. ES OBLIGACIÓN, NO MEJORA
// ══════════════════════════════════════════════════════════════════════════
//
// `apartarIlegible` guarda el progreso que la app no supo leer **antes** de
// pisarlo, en una clave aparte. Sin esta pantalla ese mecanismo existe y nadie
// puede usarlo: el payload queda ahí, inalcanzable, hasta que alguien borre los
// datos del navegador. Tres cosas concretas, las tres exigidas por
// `PENDIENTES.md`: avisar, descargar y descartar.
//
// ══ EL TEXTO DICE LA VERDAD, Y LA VERDAD ES INCÓMODA ══
// La cuarentena hace el progreso **recuperable, no lo restaura**. Un payload
// que no parsea es irrecuperable en el caso general, y prometer lo contrario
// sería peor que no tener la función. Lo que se ofrece es el archivo, para que
// alguien pueda mirarlo fuera de la app.
//
// ══ `version-futura` NO ES «ESTÁ CORRUPTO» ══
// Es el motivo más importante de traducir bien, porque es el único donde el
// progreso está **intacto**: pasa cuando el usuario abrió una versión más nueva
// de la app en otro dispositivo, exportó, e importó aquí. Decirle «corrupto» le
// haría descartar un archivo perfectamente bueno.

import { useState } from 'react';
import { AlertTriangle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { descartarIlegible, type EstadoIlegible, type MotivoIlegible } from '@/lib/almacenamiento';
import { descargarTexto } from '@/lib/descargar-archivo';

/** El motivo técnico, en lenguaje de usuario. Ver PENDIENTES § Paso 18.5. */
const EXPLICACION: Record<MotivoIlegible, string> = {
  'version-futura':
    'viene de una versión más nueva de la app. Tu progreso está intacto: lo que pasa es que esta versión todavía no sabe leer ese formato. Si actualizas la app en este dispositivo, vuelve a intentarlo.',
  'sin-version':
    'viene de una versión de prueba anterior al lanzamiento, que guardaba el progreso sin número de versión.',
  'no-json':
    'no se pudo leer: el texto guardado no es un JSON válido. Suele pasar cuando el navegador interrumpe una escritura, por ejemplo al quedarse sin espacio.',
  invalido:
    'tiene un formato que esta versión no reconoce. El archivo existe y se puede descargar, pero la app no puede reconstruir el progreso a partir de él.',
};

export function Cuarentena({
  registro,
  onDescartar,
}: {
  registro: EstadoIlegible;
  onDescartar: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);

  const descargar = () => {
    const fecha = registro.guardadoEn.slice(0, 10);
    descargarTexto(registro.payload, `idoneo-2210-progreso-apartado-${fecha}.json`);
  };

  const descartar = () => {
    descartarIlegible();
    onDescartar();
  };

  return (
    <section
      aria-labelledby="cuarentena-titulo"
      className="space-y-3 rounded-lg border border-aviso/40 bg-aviso/10 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-aviso" aria-hidden="true" />
        <div className="min-w-0 space-y-2">
          <h2 id="cuarentena-titulo" className="font-titulo text-lg font-semibold">
            Hay un progreso anterior apartado
          </h2>
          <p className="text-[0.875rem] leading-[1.55]">
            Al abrir la app encontramos un progreso guardado que no pudimos leer, así que lo
            apartamos en vez de borrarlo. Ese progreso {EXPLICACION[registro.motivo]}
          </p>
          <p className="text-[0.8125rem] leading-[1.5] text-muted-foreground">
            Se apartó el {registro.guardadoEn.slice(0, 10)}. Puedes descargarlo para guardarlo por
            si acaso — pero conviene saber una cosa:{' '}
            <strong className="font-semibold text-foreground">
              tenerlo apartado lo hace recuperable, no lo restaura
            </strong>
            . La app no puede reconstruir tu progreso a partir de este archivo; lo que te llevas es
            el archivo en sí.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={descargar}>
          <Download className="size-4" aria-hidden="true" />
          Descargar el archivo
        </Button>
        {confirmando ? (
          <>
            <Button type="button" variant="destructive" size="sm" onClick={descartar}>
              <Trash2 className="size-4" aria-hidden="true" />
              Sí, descartarlo
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmando(true)}>
            Descartarlo
          </Button>
        )}
      </div>

      {confirmando ? (
        // `polite` y no `assertive`: el usuario acaba de pulsar, ya está
        // mirando. Un `assertive` interrumpiría la lectura de la propia acción.
        <p aria-live="polite" className="text-[0.8125rem] font-medium">
          Descartarlo borra el archivo apartado y no se puede deshacer. Si no lo has descargado
          todavía, hazlo antes.
        </p>
      ) : null}
    </section>
  );
}
