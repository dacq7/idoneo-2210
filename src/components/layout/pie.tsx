// src/components/layout/pie.tsx — Server Component: sin directiva de cliente.
import Link from 'next/link';

/** Atribución obligatoria del material fuente (CC BY-NC-SA 4.0).
 *  No editar el texto sin releer §1 · Licencia y atribución: es un
 *  requisito de la licencia de las cartillas, no una nota de cortesía.
 *  Ver también ADR-001. */
export function Pie() {
  return (
    <footer className="mt-16 border-t border-border px-4 py-8 text-xs leading-relaxed text-muted-foreground">
      <div className="mx-auto max-w-3xl space-y-3">
        <p>
          Contenido educativo adaptado de la{' '}
          <span className="italic">«Guía básica del entrenador deportivo»</span> (Cartillas 1 a 4),{' '}
          <strong className="font-semibold text-foreground">COLEF Colombia</strong> y{' '}
          <strong className="font-semibold text-foreground">COCED</strong>, 2025, bajo licencia{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es"
            target="_blank"
            rel="license noopener noreferrer"
            // py-3.5 conservando `display: inline`: agranda el área de toque a
            // 108×43 px sin tocar la caja de línea, porque el padding vertical
            // de una caja inline no la altera. Con `inline-block` (primer
            // intento, A-05) el párrafo legal pasaba de 97,5 a 122 px y partía
            // «Idóneo / 2210»: ese era A-08. Los 43 px superan de sobra el
            // 24×24 de 2.5.8; el piso de 44 de DISENO.md §3 es norma interna
            // más estricta que la norma. Es el enlace que ADR-001 vuelve
            // requisito legal, así que no se deja en 15 px de alto.
            className="py-3.5 underline underline-offset-2 hover:text-foreground"
          >
            CC BY-NC-SA 4.0
          </a>
          . Idóneo 2210 es una obra derivada sin ánimo de lucro y se distribuye bajo la misma
          licencia.
        </p>
        <p>
          No es un producto oficial de COLEF ni de COCED, y sus veredictos no representan el
          puntaje oficial de aprobación.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 pt-1" aria-label="Enlaces del pie">
          <Link href="/erratas" className="underline underline-offset-2 hover:text-foreground">
            Erratas y contradicciones
          </Link>
          <Link href="/ajustes" className="underline underline-offset-2 hover:text-foreground">
            Ajustes y respaldo
          </Link>
        </nav>
      </div>
    </footer>
  );
}
