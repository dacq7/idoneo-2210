'use client';

// src/components/ajustes/datos-personales.tsx — Client Component.
//
// Nombre y fecha de examen. Los dos son opcionales y la app funciona entera sin
// ellos: §1 fija cero fricción de registro, y pedir un nombre para empezar
// sería registro con otro nombre.
//
// ══ LA FECHA DE EXAMEN SE ESCRIBE EN DOS SITIOS ══
// Aquí y en `/plan`. No es duplicación por descuido: el Paso 13 puso el campo en
// `/plan` porque el remedio de «sin fecha el plan sigue siendo útil» no podía
// ser un enlace a una ruta que entonces era 404. Los dos escriben por
// `guardarDatosPersonales`, que es el único mutador, así que no hay dos fuentes
// de verdad — hay dos puertas al mismo dato.
//
// ══ SE GUARDA AL SALIR DEL CAMPO, NO EN CADA TECLA ══
// `onBlur` y no `onChange`: escribir «Diego» con `onChange` haría cinco
// escrituras a localStorage y cinco notificaciones a todos los suscriptores del
// estado. El valor visible vive en `useState` mientras se teclea.

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { guardarDatosPersonales } from '@/lib/almacenamiento';
import type { EstadoProgreso } from '@/lib/tipos';

export function DatosPersonales({ estado }: { estado: EstadoProgreso | null }) {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');

  // El estado llega en el render siguiente al montaje: los campos se siembran
  // cuando aparece, y solo entonces.
  useEffect(() => {
    setNombre(estado?.nombre ?? '');
    setFecha(estado?.fechaExamen ?? '');
  }, [estado?.nombre, estado?.fechaExamen]);

  const guardarNombre = () => {
    const limpio = nombre.trim().slice(0, 40);
    if (limpio === (estado?.nombre ?? '')) return;
    guardarDatosPersonales({ nombre: limpio }, new Date().toISOString());
  };

  const guardarFecha = (valor: string) => {
    setFecha(valor);
    if (valor === (estado?.fechaExamen ?? '')) return;
    // Un input de tipo date devuelve '' al borrarlo o 'YYYY-MM-DD' válido: no
    // hace falta parsear nada, pero sí evitar guardar basura si llegara.
    if (valor !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return;
    guardarDatosPersonales({ fechaExamen: valor }, new Date().toISOString());
  };

  return (
    <section aria-labelledby="datos-titulo" className="space-y-4">
      <div className="space-y-1">
        <h2 id="datos-titulo">Tus datos</h2>
        <p className="text-[0.8125rem] leading-[1.45] text-muted-foreground">
          Los dos son opcionales. La app funciona igual sin ellos.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ajustes-nombre" className="text-[0.8125rem]">
          Nombre
        </Label>
        <Input
          id="ajustes-nombre"
          type="text"
          value={nombre}
          maxLength={40}
          autoComplete="given-name"
          placeholder="Como quieras que te salude"
          onChange={(e) => setNombre(e.target.value)}
          onBlur={guardarNombre}
          className="h-11"
        />
        <p className="text-[0.75rem] leading-[1.4] text-muted-foreground">
          Solo se usa para saludarte. No sale de este navegador.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ajustes-fecha" className="text-[0.8125rem]">
          Fecha del examen
        </Label>
        <Input
          id="ajustes-fecha"
          type="date"
          value={fecha}
          onChange={(e) => guardarFecha(e.target.value)}
          className="h-11"
        />
        <p className="text-[0.75rem] leading-[1.4] text-muted-foreground">
          Con ella, tu plan reparte los 29 módulos entre los días que te quedan y reserva los tres
          últimos para simulacro y repaso.
        </p>
      </div>
    </section>
  );
}
