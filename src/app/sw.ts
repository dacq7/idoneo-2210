/// <reference lib="webworker" />
// src/app/sw.ts — service worker de Serwist (§16).
//
// No es un Client Component ni corre en la página: es un worker, con su propio
// ámbito global. Por eso declara `self` como ServiceWorkerGlobalScope y no
// puede importar nada de `src/components/` ni tocar el DOM.
//
// La directiva `/// <reference lib="webworker" />` de la primera línea no es
// adorno: `ServiceWorkerGlobalScope` vive en la lib `webworker`, que el
// `tsconfig.json` de la app no carga porque su `lib` es la del navegador. Sin
// ella `npm run build` compila el worker y **falla en la comprobación de
// tipos**, que es un fallo confuso porque el bundle sí se genera.
//
// QUÉ QUEDA CACHEADO, que es la pregunta que importa para una app offline:
//
//  · El bundle entero, y con él **el banco de 752 ítems y las 435 tarjetas**,
//    porque son módulos JS que Next parte en chunks y Serwist precachea. Un
//    usuario que instale la app puede hacer un simulacro completo sin red.
//  · El HTML de cada ruta visitada, por `defaultCache`. La teoría MDX se
//    renderiza en el servidor, así que un módulo queda disponible sin conexión
//    **tras la primera visita**, no antes.
//
// Consecuencia práctica que conviene decirle al usuario: recorrer la ruta una
// vez con datos deja la app utilizable entera sin conexión.

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // La app no tiene sesiones de servidor ni datos compartidos: una versión
  // nueva puede tomar el control de inmediato sin riesgo de dejar dos
  // versiones conviviendo. El progreso vive en localStorage y es independiente
  // del SW que lo sirva.
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
