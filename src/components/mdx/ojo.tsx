// src/components/mdx/ojo.tsx — Server Component. SIN "use client".
//
// Base: §12.3, con la forma que fija DISENO.md §6.1 y la escala de §2.3.
//
// REGLA DURA de §6.1: el <Ojo> lleva **barra lateral de 4px y nunca marco
// completo**; <AlertaContradiccion> lleva **marco completo y nunca barra
// lateral**. Es la única señal estructural que distingue los dos recuadros de la
// teoría, y por eso el ámbar compartido con una `'aclaracion'` no genera
// ambigüedad (§6.5). Intercambiar los marcos borra esa señal.
//
// El icono es `Eye` y no `CircleAlert`: los dos recuadros ámbar llevan iconos
// distintos a propósito (§6.2).
//
// `aria-label` en vez del `aria-labelledby` que recomienda la nota de §6.7: el
// título del <Ojo> es fijo y el componente no tiene ninguna clave única con la
// que construir un `id` sin arriesgar colisiones cuando un módulo monta varios.
// El nombre accesible que resulta es el mismo.

import { Eye } from 'lucide-react';

/** La voz del autor dentro de la teoría: «no hay error, pero aquí te vas a equivocar». */
export function Ojo({ children }: { children: React.ReactNode }) {
  return (
    // role="note" (A-09): un <aside> es landmark `complementary`, y tres <Ojo>
    // en un módulo producían tres landmarks idénticos en la lista del lector.
    // El fondo es que este recuadro NO es contenido complementario: es un aparte
    // dentro del hilo de lectura. `note` lo dice bien y lo saca de la lista sin
    // perder el nombre accesible.
    <aside
      role="note"
      aria-label="Ojo con esto"
      className="my-5 flex gap-3 rounded-lg border-l-4 border-aviso bg-aviso/10 p-4"
    >
      <Eye className="mt-0.5 size-5 shrink-0 text-aviso" aria-hidden="true" />
      {/* 15px / 1.5 es la fila «Cuerpo de interfaz» de §2.3: marca el recuadro
          como aparte de los 17px de la teoría, y hace que el <Ojo> y la alerta
          se lean igual. */}
      <div className="text-[0.9375rem] leading-[1.5] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        <p className="mb-1 font-semibold text-foreground">Ojo con esto</p>
        {children}
      </div>
    </aside>
  );
}
