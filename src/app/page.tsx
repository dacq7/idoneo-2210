// src/app/page.tsx — Server Component.
//
// PROVISIONAL. La portada real es del Paso 14.4 (continuar donde ibas, racha,
// resumen de progreso, cola de repaso, acceso al diagnóstico). Aquí solo hay
// contenido suficiente para verificar el armazón del Paso 5, y a propósito no
// se adelanta nada de esa pantalla.

export default function Inicio() {
  return (
    <section className="space-y-6 py-2">
      <div className="space-y-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Ley 2210 de 2022 · COLEF / COCED
        </p>
        <h1>Preparación para la Evaluación de Idoneidad</h1>
        <p className="text-muted-foreground">
          29 módulos con teoría, tarjetas, práctica y quiz; repaso espaciado con lo que fallaste, y
          simulacros cronometrados con el formato del examen. Todo el progreso vive en este
          navegador: sin cuentas, sin correo, sin contraseña.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2>Esta pantalla todavía no es la definitiva</h2>
        <p className="mt-2 text-muted-foreground">
          El armazón de navegación ya está listo. La portada con «continuar donde ibas», la racha y
          el resumen de progreso se construyen en el Paso 14.4, cuando exista el estado que tienen
          que mostrar.
        </p>
      </div>
    </section>
  );
}
