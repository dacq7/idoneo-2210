// src/components/sesion/resumen-sesion.tsx — pantalla de cierre de una tanda.
//
// Sin directiva de cliente: lo importa `controlador-sesion.tsx`. No es un alta a
// §10.3. Vive en su propio archivo para que el controlador no pase de 300
// líneas (regla de código 1 de CLAUDE.md).
//
// Retroalimentación honesta (§22 regla 10): ni felicitación vacía ni consuelo.
// El mensaje de 100 % es el más severo del conjunto, por la misma razón que en
// el mazo de tarjetas: acertar 10 preguntas del módulo que acabas de leer no es
// aprobar un examen de 100 sobre 29 módulos.
//
// Aquí NO se dibuja la escala de umbral de DISENO.md §4.4 aunque el dato la
// pida a gritos: ese instrumento se construye en los Pasos 12 y 14, y
// adelantarlo con otro criterio garantiza que las dos versiones diverjan. Lo
// que sí se respeta es la prohibición de §4.5: cero barras de progreso
// redondeadas y cero anillos con el porcentaje en el centro.

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { EnvoltorioItem } from '@/components/items/envoltorio-item';
import { Retroalimentacion } from '@/components/items/retroalimentacion';
import type { ResumenSesion as Datos } from '@/hooks/usar-sesion';
import { UMBRAL_DOMINIO } from '@/lib/almacenamiento';
import { Boton } from './boton';

interface Props {
  ref: React.Ref<HTMLHeadingElement>;
  resumen: Datos;
  /** Qué era esta tanda. Cambia el titular y el mensaje, no el formato. */
  clase: 'practica' | 'quiz' | 'suelta';
  volver: { href: string; texto: string };
  siguiente?: { href: string; texto: string } | null;
  onRepetir: () => void;
}

function mensajeQuiz(puntaje: number): string {
  if (puntaje >= UMBRAL_DOMINIO) {
    return `Con ${UMBRAL_DOMINIO} o más el módulo cuenta como dominado y sale de tu lista de pendientes. Ojo con lo que eso significa: son 10 preguntas del módulo que acabas de leer, no el examen. Vuelve dentro de unos días y repite el quiz; si el puntaje aguanta sin haber releído nada, ahí sí lo sabes.`;
  }
  if (puntaje >= 60) {
    return `Todavía no llega a ${UMBRAL_DOMINIO}, que es donde el módulo cuenta como dominado. Tienes la idea general y te fallan los datos exactos: repasa abajo las que fallaste, fíjate en por qué el distractor que elegiste era tentador, y vuelve al quiz.`;
  }
  return `Esto no es cuestión de repetir el quiz hasta que salga: con menos de 60 lo que falta es la lectura. Vuelve a la teoría del módulo y a las tarjetas, y deja el quiz para después. El quiz mide, no enseña.`;
}

function mensajePractica(correctas: number, total: number): string {
  if (correctas === total) {
    return 'La práctica no mide, así que este resultado no dice que domines el módulo: dice que las explicaciones te cuadraron mientras las tenías delante. La medición es el quiz.';
  }
  if (correctas >= total / 2) {
    return 'Aquí es donde se aprende: cada fallo vino con su explicación y con la referencia a la cartilla. Repasa abajo los que fallaste antes de pasar al quiz.';
  }
  return 'Fallar la mayoría en la práctica es señal de que la teoría todavía no está asentada, no de que este módulo se te dé mal. Vuelve al Esencial y a las tarjetas, y repite la práctica antes del quiz.';
}

export function ResumenSesion({ ref, resumen, clase, volver, siguiente, onRepetir }: Props) {
  const { correctas, total, puntaje, sinResponder } = resumen;

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
        {/* tabIndex -1: recibe el foco al cerrar la tanda, para que el cambio de
            pantalla se anuncie y no haya que buscar dónde quedó el hilo. */}
        <h2 ref={ref} tabIndex={-1}>
          {clase === 'quiz' ? 'Terminaste el quiz' : 'Terminaste la práctica'}
        </h2>

        <p className="text-[0.9375rem]">
          Acertaste <strong className="font-semibold">{correctas}</strong> de {total}
          {clase === 'quiz' ? (
            <>
              {' '}
              · <span className="font-mono font-semibold">{puntaje}</span> de 100
            </>
          ) : null}
          {sinResponder > 0 ? (
            <>
              {' '}
              ·{' '}
              {sinResponder === 1
                ? 'dejaste 1 sin responder'
                : `dejaste ${sinResponder} sin responder`}
            </>
          ) : null}
          .
        </p>

        <p className="text-muted-foreground">
          {clase === 'quiz' ? mensajeQuiz(puntaje) : mensajePractica(correctas, total)}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Boton onClick={onRepetir} variante="contorno" className="min-h-11 flex-1">
            <RotateCcw className="size-4" aria-hidden="true" />
            {clase === 'quiz' ? 'Repetir el quiz' : 'Repetir la práctica'}
          </Boton>
          {siguiente ? (
            <Link
              href={siguiente.href}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 ease-out hover:bg-primary/90"
            >
              {siguiente.texto}
            </Link>
          ) : null}
        </div>

        {/* `inline-flex` por lo mismo que en el controlador (A-24): enlace solo
            en su párrafo ⇒ sin excepción de 2.5.8, y en `inline` el
            `min-height: 44px` de @layer base no se aplica. */}
        <p>
          <Link
            href={volver.href}
            className="inline-flex items-center font-medium text-primary underline underline-offset-2"
          >
            {volver.texto}
          </Link>
        </p>
      </section>

      <section aria-labelledby="revision" className="space-y-4">
        <h2 id="revision">Revisión, ítem por ítem</h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          Tu respuesta, la correcta y por qué. La referencia al final de cada explicación es
          para que puedas ir a verificarlo en la cartilla.
        </p>

        <ol className="space-y-6">
          {resumen.detalle.map((resultado, i) => (
            <li
              key={resultado.item.id}
              className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6"
            >
              <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
                Ítem {i + 1} de {resumen.detalle.length}
                {resultado.marcada ? ' · lo marcaste para revisar' : ''}
              </p>

              <EnvoltorioItem
                item={resultado.item}
                valor={resultado.valor}
                modo={resultado.correcta ? 'revision-correcta' : 'revision-incorrecta'}
                // En revisión nada se puede cambiar: los componentes ya ignoran
                // el clic en ese modo, y este handler vacío lo hace explícito.
                onCambio={() => {}}
                numero={i + 1}
                total={resumen.detalle.length}
              />

              <Retroalimentacion
                item={resultado.item}
                correcta={resultado.correcta}
                respondida={resultado.respondida}
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
