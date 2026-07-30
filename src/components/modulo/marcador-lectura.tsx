'use client';

// src/components/modulo/marcador-lectura.tsx — Client Component.
//
// Marca `teoriaLeida` cuando el usuario llega al final de la teoría. Renderiza
// un centinela de 1px al final del MDX y lo observa con IntersectionObserver.
//
// Frontera (ADR-010): no importa `content/`. Recibe el slug por prop.
//
// Reloj (§22 regla 6 y §10.4): `new Date().toISOString()` se llama DENTRO del
// efecto y del callback del observador, nunca en el cuerpo del render. Es el
// mismo patrón autorizado para `resumen-inicio.tsx`.
//
// Escritura: `marcarTeoriaLeida` es el mutador de `lib/almacenamiento.ts`. Este
// componente nunca toca `localStorage` directamente (§22 regla 5).

import { useEffect, useRef } from 'react';
import { marcarTeoriaLeida } from '@/lib/almacenamiento';

/**
 * Va inmediatamente después del último bloque de teoría. No pinta nada y no
 * anuncia nada: es un sensor, no contenido. `EtapasModulo` refleja el cambio
 * solo porque `guardarEstado` notifica a los suscriptores de
 * `useSyncExternalStore`.
 */
export function MarcadorLectura({ slug }: { slug: string }) {
  const centinela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = centinela.current;
    if (!nodo) return;

    // Se marca una sola vez por visita. Volver a llamar al mutador no rompería
    // nada —`teoriaLeida` ya sería true— pero provocaría una escritura y una
    // notificación por cada intersección.
    let yaMarcado = false;
    const marcar = () => {
      if (yaMarcado) return;
      yaMarcado = true;
      marcarTeoriaLeida(slug, new Date().toISOString());
    };

    if (typeof IntersectionObserver === 'undefined') {
      // Navegador sin soporte: se marca al montar. Perder el matiz de «llegó al
      // final» es preferible a no registrar nunca que el módulo se leyó.
      marcar();
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          marcar();
          observador.disconnect();
        }
      },
      // El centinela tiene que entrar de verdad en la pantalla, no asomar por
      // el borde inferior: se exige que suba al 90 % inferior del viewport.
      { rootMargin: '0px 0px -10% 0px' },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, [slug]);

  return <div ref={centinela} aria-hidden="true" className="h-px w-full" />;
}
