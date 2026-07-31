// src/app/repaso/page.tsx — Server Component.
//
// La cola de repaso espaciado del día. Es el tercer destino de las dos barras de
// navegación y, a partir de aquí, la ruta que el usuario abre a diario.
//
// Frontera (ADR-010): esta página importa `content/estructura` —es servidor— y
// pasa al cliente **solo** `{ slug, titulo, bloque }` de los módulos publicados.
// Ni objetivos, ni conceptos clave, ni minutos: el subconjunto mínimo, como
// `SegmentoRiel` en el encabezado.
//
// Lo que esta página NO puede hacer, y es lo que define el paso: **cargar el
// contenido de la cola**. La cola vive en `localStorage`, así que el servidor no
// sabe qué elementos hay que repasar ni de qué módulos son. El razonamiento
// completo de cómo se resuelve —`import()` dinámico de los índices de `banco/` y
// `tarjetas/`, solo de los módulos que la cola menciona— está en la cabecera de
// `controlador-repaso.tsx`.
//
// DISENO.md §2.4: NO monta `<RotuloBloque>`. La regla exige exactamente un
// bloque en contexto, y la cola mezcla módulos de los cuatro. El bloque de cada
// elemento se comunica dentro de la sesión, elemento a elemento.

import type { Metadata } from 'next';
import { MODULOS } from '@/content/estructura';
import { ControladorRepaso } from '@/components/sesion/controlador-repaso';
import type { ModuloPublicado } from '@/components/sesion/repaso/accion-siguiente';

export const metadata: Metadata = {
  title: 'Repaso',
  // La app es privada de facto: solo la portada se indexa (§10.1).
  robots: { index: false },
};

export default function PaginaRepaso() {
  // En orden de estudio, que es el de `MODULOS`. El cliente elige de aquí el
  // primero sin dominar para el estado vacío: cuál está dominado solo lo sabe
  // el navegador.
  const publicados: ModuloPublicado[] = MODULOS.filter(
    (modulo) => modulo.estadoContenido === 'completo',
  ).map((modulo) => ({ slug: modulo.slug, titulo: modulo.titulo, bloque: modulo.bloque }));

  return (
    <div className="space-y-8 py-2">
      <header className="space-y-3">
        <h1>Repaso del día</h1>
        <p className="text-muted-foreground">
          Aquí solo aparece lo que ya viste y lo que ya fallaste, el día en que toca
          volver a verlo. Lo que aciertas se aleja en el calendario; lo que fallas vuelve
          mañana. No hay nada que elegir: si la cola está vacía, es que hoy no toca.
        </p>
      </header>

      <ControladorRepaso modulos={publicados} />
    </div>
  );
}
