// src/components/layout/shell.tsx — Server Component, sin directiva de cliente.
// Armazón único de la app: encabezado con el riel de bloques, columna de
// contenido de max-w-3xl, pie de atribución y las dos barras de navegación.
//
// El pie va después de {children} y antes del hueco de la barra inferior, para
// que en móvil la nav de h-16 no lo tape (§11.7). Aparece en TODAS las rutas:
// es requisito de la licencia CC BY-NC-SA 4.0, no decoración (ADR-001).

import { BarraLateral } from './barra-lateral';
import { Encabezado } from './encabezado';
import { NavInferior } from './nav-inferior';
import { OcultaEnSimulacro } from './oculta-en-simulacro';
import { Pie } from './pie';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Primer elemento enfocable de la página: deja saltar las dos barras de
          navegación sin recorrerlas con el tabulador en cada pantalla. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:flex focus:items-center focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:text-sm focus:font-medium focus:text-foreground"
      >
        Saltar al contenido
      </a>

      <Encabezado />

      <div className="flex grow">
        <BarraLateral />
        <div className="pb-nav flex min-w-0 grow flex-col lg:pb-0">
          {/* tabIndex={-1} es lo que hace que el enlace de salto mueva el foco
              de verdad. Sin él, Chromium solo reubica el punto de partida
              secuencial y activeElement se queda en <body>; en Safari/VoiceOver
              —el iPhone que exige el Paso 18.10— eso no es fiable.
              Ver A-03 en ACCESIBILIDAD.md. */}
          {/* Al activar el salto, el <main> recibe el foco y pinta el contorno
              de 2px de globals.css alrededor de la columna. Es deseable
              (2.4.7: el foco debe verse) y es transitorio. No se intenta
              suprimir con focus-visible:outline-none: esa clase y la regla de
              globals.css están en la misma capa `utilities` con la misma
              especificidad (0,2,0), y la segunda va después, así que gana.
              Sería código que afirma hacer algo que no hace. Ver A-07. */}
          <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-3xl grow px-4 pt-6 sm:px-6">
            {children}
          </main>
          {/* Durante un simulacro cronometrado el pie se oculta, no se
              desmonta (ADR-001). `Pie` sigue siendo Server Component: viaja
              como payload RSC dentro del envoltorio cliente y no entra al
              bundle del navegador. Ver `oculta-en-simulacro.tsx`. */}
          <OcultaEnSimulacro>
            <Pie />
          </OcultaEnSimulacro>
        </div>
      </div>

      <NavInferior />
    </div>
  );
}
