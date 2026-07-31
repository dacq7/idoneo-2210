# Estado del contenido — Idóneo 2210

Única fuente de verdad sobre qué contenido está listo. Lo mantiene el `technical-writer`;
el `minimal-change-engineer` cierra la columna **Validado** al integrar.

**Regla dura:** un módulo no se marca listo aquí ni en `content/estructura.ts` si no tiene
teoría + ≥12 tarjetas + ≥25 ítems que pasen `npm run validar` + sus conceptos clave en el glosario.

**El bloque C exige 28 ítems, no 25** (ADR-005 hueco 5 y ADR-006): pesa el 33 % del examen.
Aplica a los 9 módulos de C, incluido el piloto C5.

| Módulo | Bloque | Teoría | Tarjetas | Ítems | Glosario | Validado | Notas |
|---|---|---|---|---|---|---|---|
| a1-celula | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| a2-terminologia-anatomica | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| a3-tejidos-organos-sistemas | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| a4-nutrientes | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| a5-sistemas-energeticos-biomarcadores | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| a6-estadistica | A | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b1-fundamentos-pedagogia | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b2-principios | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b3-modelos-pedagogicos | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b4-componentes-didacticos | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b5-estilos-ensenanza | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| b6-aprendizaje-sesion | B | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 17 |
| c1-vias-energeticas | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c2-cardiovascular | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c3-respiratorio-vo2 | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c4-nervioso-digestivo-osteomuscular | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c5-umbrales-zonas | C | ✅ | ✅ 15 | ✅ 28 | ✅ 9 | ✅ | **Módulo piloto — paso 8.** Plantilla de oro. **28 ítems, no los 25 de §14.3** (ADR-006): C5-026 recuerdo/d1/única · C5-027 comprensión/d2/múltiple · C5-028 aplicación/d3/cálculo. Reparto 12/9/7. Cableado, en `'completo'` y con cuotas corriendo. **Paso 8b:** la teoría enseña el dato verdadero en prosa, sin hablar de las cartillas (ADR-014) |
| c6-biomecanica | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c7-nutricion-deportiva | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c8-psicologia-deporte | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| c9-dopaje | C | ⬜ | ⬜ 0 | ⬜ 0 | ⬜ | ⬜ | Pendiente — paso 16 |
| d1-conceptualizacion | D | ✅ | ✅ 15 | ✅ 25 | ✅ 4 | ✅ | **Paso 15 — integrado.** Cableado en los dos índices, en `'completo'` y con cuotas de `cuotasDelBloque('D')` en verde (11/8/6 · dif 5/13/7 · 6 tipos). Glosario integrado desde `/tmp/glosario-d1-d2.ts` |
| d2-carga | D | ✅ | ✅ 15 | ✅ 25 | ✅ 4 | ✅ | **Paso 15 — integrado.** Cuotas en verde (11/8/6 · dif 5/14/6 · 7 tipos, con 4 de cálculo de densidad, tonelaje y carga de sesión). Glosario: se integraron `Carga interna` y `Carga externa`; `Densidad` y `Escala de Borg (RPE)` ya estaban sembrados del paso 6 — **verificado, sin duplicado** |
| d3-fuerza | D | ✅ | ✅ 15 | ✅ 25 | ✅ 3 | ✅ | **Paso 15 — integrado.** Cuotas en verde (11/8/6 · dif 6/13/6 · los 7 tipos). Cubre DD-010, DD-011 y DD-012. **Referencias remapeadas** a `Tema 3, Subtema 3.1.1–3.1.4`: las suyas colisionaban con d6 en `3.4` |
| d4-resistencia | D | ✅ | ✅ 15 | ✅ 25 | ✅ 4 | ✅ | **Paso 15 — integrado.** Cuotas en verde (11/8/6 · dif 6/13/6 · los 7 tipos). Sin datos duros propios en `datos-duros.ts`. **Referencias remapeadas** de `Tema 4, Subtema 4.1–4.4` a `Tema 3, Subtema 3.2.1–3.2.4`: colisionaban con d7 en `4.1` y el Tema estaba mal |
| d5-velocidad | D | ✅ | ✅ 15 | ✅ 25 | ✅ 3 | ✅ | **Paso 15 — integrado.** Cuotas en verde (11/8/6 · dif 6/12/7 · los 7 tipos). Glosario integrado desde `/tmp/glosario-d5-d6.ts` |
| d6-flexibilidad | D | ✅ | ✅ 15 | ✅ 25 | ✅ 4 | ✅ | **Paso 15 — integrado.** Cuotas en verde (11/8/6 · dif 6/12/7 · los 7 tipos). Glosario integrado desde `/tmp/glosario-d5-d6.ts` |
| d7-modelos-planificacion | D | ✅ | ✅ 15 | ✅ 25 | ✅ 3 | ✅ | **Paso 15 — integrado.** Cuotas en verde con `CUOTAS` (11/8/6 · dif 6/12/7 · 7 tipos). Glosario integrado desde `/tmp/glosario-d7-d8.ts` |
| d8-estructuras | D | ✅ | ✅ 15 | ✅ 25 | ✅ 4 | ✅ | **Paso 15 — integrado.** Cuotas en verde con `CUOTAS` (11/8/6 · dif 7/12/6 · 7 tipos). Los 2 ordenar cubren la jerarquía de estructuras y las partes de la sesión. Glosario integrado desde `/tmp/glosario-d7-d8.ts` |

**Total:** 9 de 29 módulos completos (C5 + los 8 del bloque D) · 228 ítems · 135 tarjetas ·
49 términos de glosario · 70 datos duros.

C5 y los 8 módulos del bloque D están cableados en `content/banco/indice.ts` y
`content/tarjetas/indice.ts`, en `estadoContenido: 'completo'`, y el validador les corre las cuotas
de `cuotasDelBloque(...)` en verde: 28 ítems para C5 (bloque C) y 25 para cada módulo de D.

**Numeración de referencias del bloque D** (fijada al integrar el paso 15, porque los cuatro
escritores la habían asignado por separado y colisionaba): Tema 1 → d1 · Tema 2 → d2 ·
**Tema 3 = capacidades físicas** (3.1 fuerza · 3.2 resistencia · 3.3 velocidad · 3.4 flexibilidad) ·
**Tema 4 = planificación** (4.1 modelos · 4.2 estructuras). Quien escriba un módulo nuevo que cite
la Cartilla 4 se ciñe a este mapa.

## EL CRITERIO — ADR-014 · léelo antes de escribir una sola línea

**El contenido enseña el dato verdadero, investigado y verificado.** Las cuatro cartillas son **la guía del
temario, no la fuente de verdad de cada cifra**. Donde la cartilla se equivoque, el contenido dice lo cierto
**sin anunciar la discrepancia**: no hay cuadros de errata, no hay ruta `/erratas`, no hay campo
`contradiccion`, y ninguna explicación de ítem dice «la cartilla dice» ni compara versiones.

Esto **sube el estándar de redacción**. Hasta el paso 8 bastaba con destilar bien la cartilla; desde ADR-014,
**cada cifra que entra al banco tiene que estar verificada**. Si al escribir un módulo te encuentras un dato
que no cuadra, la salida es investigarlo y enseñar lo cierto — nunca reproducir el dato dudoso ni documentar
el conflicto.

### Investigación ya verificada, con fuentes — úsala, no la vuelvas a derivar

Esto se verificó al escribir C5 y se conserva aquí porque los módulos que lo necesitan **aún no existen**.
Son puntos donde la cartilla se equivoca o se queda corta, así que derivarlos de nuevo del material fuente
reintroduce el error.

| Dato | Lo verificado | Módulo que lo necesita |
|---|---|---|
| ATP por molécula de glucosa | **30–32**, no 36–38. Los 36–38 salen de razones P/O viejas (3 ATP/NADH, 2/FADH₂); las actuales son **2,5 y 1,5**. Dentro del rango decide la lanzadera: malato-aspartato (corazón, hígado, riñón) **32**; glicerol-3-fosfato (músculo esquelético y cerebro) **30**. En músculo esquelético son **30** | `c1-vias-energeticas`, `a5-sistemas-energeticos-biomarcadores` |
| Sistema fosfágeno | **5–15 s**, y es un rango real: depende de la intensidad y de las reservas basales de PCr. No hay número único que enseñar | `c1-vias-energeticas` |
| ATP libre | **2–3 s**. Es magnitud distinta del sistema fosfágeno completo: el ATP libre es el que ya está en la fibra; el sistema incluye la PCr que lo regenera | `c1-vias-energeticas` |
| Procariotas | Solo **bacterias y arqueas**. Protozoos y hongos son eucariotas **siempre**. Con «algas» hay matiz: «alga» no es un taxón — las algas eucariotas lo son, pero las **cianobacterias** (las antiguas algas verdeazuladas) son bacterias, y por tanto procariotas | `a1-celula` |
| Célula muscular y pulmonar | La célula muscular es la **fibra muscular / miocito**; el **sarcómero** es su unidad contráctil. La célula pulmonar es el **neumocito**; el **alvéolo** es una estructura, no una célula | `a1-celula`, `c4-nervioso-digestivo-osteomuscular` |
| Cartílago articular | Reduce la fricción y **distribuye y amortigua cargas**. Lo indiscutido es la superficie de fricción bajísima y el reparto de carga; **no** es el amortiguador principal de la articulación — buena parte de la energía la disipan el hueso subcondral y el trabajo excéntrico | `a3-tejidos-organos-sistemas` |
| Bursa vs menisco | La **bursa** es el saco con líquido sinovial que reduce el roce entre tendón y hueso. El menisco es fibrocartílago | `a3-tejidos-organos-sistemas` |
| Vitamina B2 (riboflavina) | Fuentes: lácteos, huevos, carne magra, almendras, hígado. **«Vegetales de hoja verde» no discrimina** — es el descriptor icónico del folato (B9). Sello exclusivo de B2: **se inactiva con la luz**, por eso la leche va en envase opaco | `a4-nutrientes` |
| Porcentaje de aumento | `((nuevo − viejo) / viejo) × 100`. De 50 a 75: el nuevo valor es el **150 %** del viejo y el **aumento es del 50 %**. Son cosas distintas y se confunden | `a6-estadistica` |
| Mediana con n par | Promedio de las posiciones **N/2** y **(N/2)+1** de la lista **ordenada**. Ordenar primero es el paso que más se olvida | `a6-estadistica` |
| Adaptaciones cardiovasculares al entrenamiento de resistencia | ↓FC en reposo · ↑volemia · ↑volumen sistólico · ↑gasto cardíaco máximo. **La FCmáx NO cambia**: depende de la edad, no del estado de forma | `c2-cardiovascular`, `c3-respiratorio-vo2` |
| Ley 2210 | **23 de mayo de 2022**. Ninguna otra fecha | `d1-conceptualizacion`, `b1-fundamentos-pedagogia` |
| Test de Cooper | 12 min · **VO₂máx = (metros − 504,9) / 44,73**. Las dos constantes van juntas y la distancia entra **en metros**: en kilómetros el resultado sale negativo. Es estimación indirecta de ritmo libre, así que la dosificación del evaluado forma parte de la prueba | `c3-respiratorio-vo2`, escrito ya en `d4-resistencia` |
| Course Navette | 20 m entre líneas · arranca en **8,5 km/h** y sube **0,5 km/h** por palier de 1 min → velocidad = 8,5 + 0,5 × (palier − 1). El incremento de 1 km/h que a veces se ve acortaría el test a la mitad de paliers | `c3-respiratorio-vo2`, escrito ya en `d4-resistencia` |
| Potencia máxima y carga | **P = F × v**, así que el máximo de potencia cae con **cargas medias**, no con el 1RM: con la carga máxima la velocidad se desploma y el producto con ella. Por eso el trabajo explosivo se prescribe por velocidad de ejecución, no por peso | `c6-biomecanica`, escrito ya en `d3-fuerza` y `d5-velocidad` |
| Estimación indirecta del 1RM | Epley `peso × (1 + reps/30)` y Brzycki `peso / (1,0278 − 0,0278 × reps)` coinciden hasta unas **10 repeticiones** y se separan por encima (60 kg × 12 → 84 vs 86,4 kg). Más repeticiones dan **menos** precisión, no más | escrito ya en `d3-fuerza` |

El glosario y los datos duros se sembraron en el paso 6 desde §9.4–§9.5 (transcripción del
blueprint, no contenido de autor). **Tras el paso 15, los 9 módulos completos —c5 y los ocho del
bloque D— tienen sus `conceptosClave` cubiertos al 100 %**, que es lo que el validador exige para
marcarlos `'completo'`. Los 20 en preparación tienen cobertura parcial y su columna Glosario se
cierra al escribir el módulo.

Orden de producción (por densidad de retorno, no alfabético):
C5 (paso 8) → bloque D (paso 15) → resto del bloque C (paso 16) → bloque B y bloque A (paso 17).


---

## Antes de escribir un módulo — la regla que el build mide

Además de las cuotas (§5.4) y de la checklist de §14.4, el validador comprueba el
**sesgo de longitud de la opción correcta**, y **falla el build si un módulo pasa del 50 %**.

| | |
|---|---|
| Azar esperado | **28,2 %** |
| Aviso | 40 % |
| **Error de build** | **50 %** |

Cómo medirlo mientras escribes:

```ts
import { medirSesgoLongitud } from '@/lib/esquemas';
const s = medirSesgoLongitud(ITEMS);
// { proporcion, correctaMasLarga, conOpciones, ids, largoMedioCorrecta, largoMedioDistractor }
```

`ids` devuelve exactamente los ítems donde la correcta es la más larga: son los que hay que tocar.

**El arreglo es engordar los distractores, nunca acortar la correcta.** Recortar la correcta le quita
la precisión que la hace correcta. Un distractor plausible tiene el mismo nivel de detalle que la
respuesta: si es más corto, casi siempre es porque está peor escrito. Y un **empate** de longitud no
cuenta como sesgo — dos opciones igual de largas no distinguen nada, así que igualar basta.

**Ojo con pasarse de frenada.** El objetivo es **parecerse al azar (28 %), no minimizar**. Dejar la correcta
sistemáticamente más corta es el mismo exploit al revés —«descarta la más larga» acierta casi siempre— y el
validador avisa por debajo del **12 %**.

**Por qué es una compuerta y no un consejo:** §14.4 pedía «longitud pareja» desde el primer módulo, y
el banco llegó igualmente al 66 % con C5 —la plantilla de oro— en el 80 %. Una regla escrita que
nadie mide no se cumple. A 750 ítems, la pista es explotable: se aprende a marcar la larga sin leer.
