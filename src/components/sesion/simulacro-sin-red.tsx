// src/components/sesion/simulacro-sin-red.tsx — estado de error de la carga.
//
// Sin directiva de cliente: lo importa `controlador-simulacro.tsx`, así que se
// compila para el cliente igual. No es un alta a §10.3.
//
// El `import()` del banco puede rechazar: red caída antes de que el service
// worker haya cacheado el chunk, o chunk viejo tras un redespliegue. §3 del
// brief cuenta con conectividad intermitente, así que no es un borde exótico.
// Sin esta pantalla, la vista se quedaría en el esqueleto para siempre.
//
// Gemelo de `RepasoSinRed` del Paso 10, con un mensaje propio: aquí lo que se
// pierde es un examen cronometrado y el usuario necesita saber que **no** ha
// arrancado el reloj.

import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { Boton } from './boton';

export function SimulacroSinRed({
  intento,
  onReintentar,
}: {
  intento: number;
  onReintentar: () => void;
}) {
  return (
    <section
      aria-labelledby="titulo-sin-red"
      className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      {/* [A-35] Un `<h2>` de verdad, no un `<span>` dentro de un `<p>`: era el
          único estado de esta pantalla que no aparecía en el índice de
          encabezados, que es como se recorre una página con lector. */}
      <h2 id="titulo-sin-red" className="flex items-start gap-2 text-base">
        <WifiOff className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        No se pudieron cargar las preguntas
      </h2>

      <p className="text-muted-foreground">
        {intento === 1
          ? 'Puede ser la conexión. El simulacro no ha empezado y el cronómetro no ha arrancado: no has perdido tiempo.'
          : 'Sigue sin cargar. Si acabas de instalar la app, abre una vez cualquier módulo con conexión para que el contenido quede guardado y funcione después sin red.'}
      </p>

      <Boton onClick={onReintentar} className="min-h-[52px] w-full text-[0.9375rem]">
        Reintentar
      </Boton>

      <p className="text-[0.8125rem]">
        <Link
          href="/simulacros"
          className="inline-flex items-center text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Volver a los simulacros
        </Link>
      </p>
    </section>
  );
}
