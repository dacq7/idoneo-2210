'use client';

// src/components/layout/oculta-en-simulacro.tsx — Client Component (§10.3).
//
// Oculta su contenido mientras hay un simulacro cronometrado en curso. Hoy lo
// usa `Shell` para el pie: durante un simulacro compite con el cronómetro y
// estorba, pero **no se desmonta** — la atribución a COLEF/COCED sigue en el DOM
// y visible en las otras 15 rutas, que es lo que exige la licencia (ADR-001).
//
// ══ POR QUÉ RECIBE EL PIE COMO `children` Y NO LO IMPORTA ══
// `COMPONENTES.md` describía otro mecanismo —`hidden` sobre el `<Pie />` desde
// `Shell`— y era **inviable**: `Shell` es Server Component y no puede leer
// `localStorage`. La salida correcta es esta: el envoltorio es cliente, el hijo
// se renderiza en el **servidor** y viaja como payload RSC, de modo que
// `Pie` —el componente que lleva la atribución de ADR-001— **nunca entra al
// bundle del navegador**. Es el patrón canónico de App Router.
//
// Descartado mutar `document.body.dataset` desde un efecto y ocultar con CSS:
// exige limpieza al desmontar y se rompe en silencio si dos componentes compiten
// por el atributo. Y descartado volver `Pie` cliente.
//
// ══ POR QUÉ `hidden` Y NO `display: none` POR CLASE ══
// El atributo `hidden` lo saca del árbol de accesibilidad **y** del orden de
// tabulación, que es justo lo que se busca: durante el simulacro el tabulador no
// debe recorrer cuatro enlaces de pie antes de llegar a la respuesta.

import { useSyncExternalStore } from 'react';
// [ADR-021] De `sesion-activa`, NO de `almacenamiento`: este componente vive en
// el layout raíz, así que lo que importe lo descargan TODAS las rutas. El
// módulo grande arrastra Zod (~13 kB gz) para responder un booleano.
import {
  haySesionEnCurso,
  haySesionEnCursoServidor,
  suscribirSesion,
} from '@/lib/sesion-activa';

export function OcultaEnSimulacro({ children }: { children: React.ReactNode }) {
  // Snapshot booleano y estable: devolver la sesión parseada metería a React en
  // un bucle de renders, porque `JSON.parse` da una referencia nueva cada vez.
  const haySesion = useSyncExternalStore(
    suscribirSesion,
    haySesionEnCurso,
    haySesionEnCursoServidor,
  );

  return <div hidden={haySesion}>{children}</div>;
}
