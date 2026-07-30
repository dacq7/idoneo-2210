import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo afecta a desarrollo. Se activa ahora, y no en el paso 18.1, para que
  // el doble disparo de efectos aparezca mientras es barato: el auto-envío de
  // usar-cronometro (paso 11) y el IntersectionObserver de marcador-lectura
  // (paso 8) son justo el código donde ese bug es caro de encontrar tarde.
  // El paso 18.1 reescribe este archivo con withSerwist: debe conservarse.
  reactStrictMode: true,
};

export default nextConfig;
