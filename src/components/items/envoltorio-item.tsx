'use client';

// src/components/items/envoltorio-item.tsx — Client Component (§10.3).
//
// Despacha por tipo y, antes de eso, pinta lo que los 7 tipos comparten: la
// viñeta del caso y el enunciado. Que el enunciado viva aquí y no en cada
// componente es lo que garantiza que los 7 se presenten igual y lo que permite
// que `caso` ponga su viñeta ANTES de la pregunta, como manda §4.
//
// El enunciado se pinta como texto plano. §4 dice que admite markdown en línea
// (**negrita**, `código`); ningún ítem de C5 lo usa hoy y montar un renderizador
// de markdown en el cliente por eso sería pagar peso por nada. Si un módulo de
// los pasos 15–17 lo necesita, es aquí donde se resuelve, en un solo sitio.

import type {
  ItemCalculo,
  ItemCaso,
  ItemEmparejar,
  ItemMultiple,
  ItemOrdenar,
  ItemUnica,
  ItemVerdaderoFalso,
} from '@/lib/tipos';
import type { PropsItem } from './contrato';
import { Calculo } from './calculo';
import { Caso } from './caso';
import { Emparejar } from './emparejar';
import { OpcionMultiple } from './opcion-multiple';
import { OpcionUnica } from './opcion-unica';
import { Ordenar } from './ordenar';
import { VerdaderoFalso } from './verdadero-falso';

export function EnvoltorioItem(props: PropsItem) {
  const { item } = props;

  return (
    <div className="space-y-4">
      {item.tipo === 'caso' ? (
        <div className="rounded-md border-l-4 border-border bg-secondary/40 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase leading-[1.1] tracking-[0.08em] text-muted-foreground">
            La situación
          </p>
          <p className="mt-1 text-[0.95rem] leading-[1.5]">{item.viñeta}</p>
        </div>
      ) : null}

      {/* Enunciado de ítem: Inter 17px / 500 / 1.45 (DISENO.md §2.3). No es un
          encabezado: es una pregunta, y como <h3> metería un salto de nivel
          dentro de la sesión. */}
      <p className="text-[1.0625rem] font-medium leading-[1.45]">{item.enunciado}</p>

      {/* `key` por ítem: sin ella, dos ítems consecutivos del MISMO tipo reusan
          la instancia hoja y arrastran su estado local. `calculo` mostraría el
          texto tecleado en el ítem anterior con `valor` en `null` —número en
          pantalla, ítem calificado en blanco—, `emparejar` conservaría su
          selección a medias y el efecto de montaje de `ordenar` no volvería a
          registrar el orden inicial. Los comentarios de cabecera de esos tres
          archivos dan este remontaje por hecho. */}
      <Control key={item.id} {...props} />
    </div>
  );
}

/**
 * El ÚNICO cast de tipo del sistema de ítems.
 *
 * `PropsItem` es genérico en el tipo del ítem (ver `contrato.ts`), así que los 7
 * componentes reciben ya su variante y ninguno hace casts en su cuerpo. A
 * cambio, el reparto tiene que afirmar aquí lo que el `switch` acaba de
 * comprobar: TypeScript estrecha `props.item`, pero no estrecha `props` entero
 * a partir de una propiedad suya.
 *
 * El `switch` es exhaustivo sobre `Item['tipo']`: si mañana entra un octavo
 * tipo, el compilador señala este archivo por el `never` del `default`.
 */
function Control(props: PropsItem) {
  switch (props.item.tipo) {
    case 'unica':
      return <OpcionUnica {...(props as PropsItem<number, ItemUnica>)} />;
    case 'caso':
      return <Caso {...(props as PropsItem<number, ItemCaso>)} />;
    case 'multiple':
      return <OpcionMultiple {...(props as PropsItem<number[], ItemMultiple>)} />;
    case 'vf':
      return <VerdaderoFalso {...(props as PropsItem<boolean, ItemVerdaderoFalso>)} />;
    case 'emparejar':
      return <Emparejar {...(props as PropsItem<[number, number][], ItemEmparejar>)} />;
    case 'calculo':
      return <Calculo {...(props as PropsItem<number | null, ItemCalculo>)} />;
    case 'ordenar':
      return <Ordenar {...(props as PropsItem<number[], ItemOrdenar>)} />;
    default:
      // Comprobación de exhaustividad: hoy `props.item` es `never` aquí. El día
      // que exista un octavo tipo de ítem dejará de serlo y el compilador
      // señalará este archivo, que es exactamente donde hay que ir.
      props.item satisfies never;
      return null;
  }
}
