'use client';

// src/components/ajustes/zona-peligro.tsx — Client Component.
//
// Empezar de cero, con doble confirmación (§18.5 · §22 regla 12).
//
// ══ QUÉ CUENTA COMO «DOBLE CONFIRMACIÓN» ══
// No dos botones seguidos que digan lo mismo: eso se pulsa dos veces sin leer.
// El segundo paso pide **escribir la palabra BORRAR**, que es la única forma de
// que la acción no se pueda completar por inercia ni por un toque accidental en
// el bolsillo. Es irreversible y no hay servidor del que recuperarlo.
//
// ══ SE OFRECE EL RESPALDO EN EL MISMO SITIO ══
// El momento en que alguien va a borrar su progreso es exactamente el momento
// en que debería exportarlo. Enlazar a la sección de arriba en vez de asumir
// que ya lo hizo.
//
// ══ QUÉ BORRA ══
// `reiniciarTodo` limpia las tres claves: progreso, sesión en curso y la
// cuarentena de ADR-008. Que incluya la cuarentena es intencional —«todo» es
// todo— y por eso el texto lo dice.

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reiniciarTodo } from '@/lib/almacenamiento';

const PALABRA = 'BORRAR';

export function ZonaPeligro({ hayProgreso }: { hayProgreso: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState('');
  const [hecho, setHecho] = useState(false);

  const borrar = () => {
    reiniciarTodo();
    setAbierto(false);
    setTexto('');
    setHecho(true);
  };

  return (
    <section
      aria-labelledby="peligro-titulo"
      className="space-y-4 rounded-lg border border-destructive/30 p-4"
    >
      <div className="space-y-1">
        <h2 id="peligro-titulo">Empezar de cero</h2>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Borra tu progreso, la sesión que tengas a medias y cualquier progreso apartado. No se
          puede deshacer y no hay copia en ningún servidor: si no has exportado, no hay vuelta.
        </p>
      </div>

      {hecho ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-exito/40 bg-exito/10 p-3 text-[0.8125rem]"
        >
          Listo. Estás como el primer día.
        </p>
      ) : !abierto ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setAbierto(true)}
          disabled={!hayProgreso}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Empezar de cero
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-[0.875rem] font-medium">
            Para confirmar, escribe {PALABRA} en el campo.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="confirmar-borrado" className="text-[0.8125rem]">
              Confirmación
            </Label>
            <Input
              id="confirmar-borrado"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
              placeholder={PALABRA}
              className="h-11 font-mono"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={borrar}
              disabled={texto.trim().toUpperCase() !== PALABRA}
            >
              Borrar todo mi progreso
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setAbierto(false);
                setTexto('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {!hayProgreso && !hecho ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          No hay nada guardado todavía, así que no hay nada que borrar.
        </p>
      ) : null}
    </section>
  );
}
