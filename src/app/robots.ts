// src/app/robots.ts — Server Component (§18.7).
//
// Solo la portada se indexa. El resto de la app es privada de facto: no hay
// contenido público que ofrecer a un buscador, y sí hay 29 módulos de material
// derivado de las cartillas de COLEF/COCED cuyo sitio no es el índice de Google.
//
// ══ NO ES UNA MEDIDA DE SEGURIDAD ══
// `robots.txt` es una petición, no un control de acceso: nada impide leer
// `/modulos/c5-umbrales-zonas` escribiendo la URL. No hace falta que lo impida
// —el contenido es CC BY-NC-SA y se comparte a propósito—; lo que se evita es
// que 20 rutas de una app de estudio compitan en el buscador con la única que
// sirve para presentarla.
//
// El `robots: { index: false }` de cada página es lo que se lo dice al robot
// que sí entra. Este archivo evita que llegue.

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/modulos/',
        '/bloques/',
        '/simulacros/',
        '/resultados/',
        '/diagnostico',
        '/plan',
        '/repaso',
        '/progreso',
        '/glosario',
        '/herramientas',
        '/ultima-noche',
        '/ajustes',
      ],
    },
  };
}
