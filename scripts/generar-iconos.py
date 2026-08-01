#!/usr/bin/env python3
"""Genera los iconos de la PWA y la imagen Open Graph.

Se ejecuta a mano, no en el build: los PNG resultantes están versionados en
`public/` porque son entregables, no artefactos. Vive aquí para que dentro de
un año se sepa CÓMO se hicieron y puedan rehacerse sin adivinar el color.

    python3 scripts/generar-iconos.py

La marca es un cronómetro: aro grueso, corona arriba y una aguja que apunta a
las once. Se eligió por dos razones. Es lo único de la app que se reconoce a
48 px —un texto no cabe—, y nombra lo que la app hace de verdad, que es medir
contra reloj. El color es el `theme_color` del manifiesto, que a su vez es el
`--primary` del tema claro.

El maskable NO es el mismo archivo con otro nombre: Android recorta hasta un
20 % por lado, así que la marca se dibuja dentro del 60 % central y el resto es
fondo. Reutilizar el icono normal como maskable le come la corona.
"""

from PIL import Image, ImageDraw, ImageFont

AZUL = (31, 79, 128)  # #1f4f80 — theme_color del manifiesto
BLANCO = (255, 255, 255)
SUPERMUESTREO = 4  # se dibuja a 4× y se reduce: bordes suaves sin antialias propio


def cronometro(lado: int, fraccion_marca: float) -> Image.Image:
    """Icono cuadrado con el cronómetro centrado.

    `fraccion_marca` es cuánto del lado ocupa la marca. 0.78 para el icono
    normal, 0.60 para el maskable, que debe sobrevivir al recorte de Android.
    """
    grande = lado * SUPERMUESTREO
    img = Image.new("RGB", (grande, grande), AZUL)
    d = ImageDraw.Draw(img)

    centro = grande / 2
    # El aro se centra un poco por debajo del medio para dejar sitio a la corona.
    radio = grande * fraccion_marca / 2
    desplazamiento = radio * 0.10
    cy = centro + desplazamiento
    grosor = max(2, int(radio * 0.16))

    # Aro del dial.
    d.ellipse(
        [centro - radio, cy - radio, centro + radio, cy + radio],
        outline=BLANCO,
        width=grosor,
    )

    # Corona: el botón de arriba, un rectángulo redondeado sobre el aro.
    ancho_corona = radio * 0.40
    alto_corona = radio * 0.22
    tope = cy - radio - alto_corona * 0.55
    d.rounded_rectangle(
        [centro - ancho_corona / 2, tope, centro + ancho_corona / 2, tope + alto_corona],
        radius=alto_corona / 2.5,
        fill=BLANCO,
    )

    # Aguja hacia las once: sale del centro y no llega al aro.
    largo = radio * 0.58
    d.line(
        [centro, cy, centro - largo * 0.50, cy - largo * 0.84],
        fill=BLANCO,
        width=grosor,
    )
    # Eje central, para que la aguja no parezca suelta.
    eje = grosor * 0.9
    d.ellipse([centro - eje, cy - eje, centro + eje, cy + eje], fill=BLANCO)

    return img.resize((lado, lado), Image.LANCZOS)


def og() -> Image.Image:
    """1200×630 para las tarjetas de enlace. Solo la portada la usa (§18.7)."""
    ancho, alto = 1200, 630
    img = Image.new("RGB", (ancho, alto), AZUL)
    d = ImageDraw.Draw(img)

    marca = cronometro(220, 0.86)
    img.paste(marca, (90, 90))

    titulo = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 96)
    cuerpo = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)

    d.text((90, 350), "Idóneo 2210", font=titulo, fill=BLANCO)
    d.text(
        (90, 470),
        "Preparación para la Evaluación de Idoneidad",
        font=cuerpo,
        fill=(198, 216, 236),
    )
    d.text((90, 522), "del Entrenador Deportivo · Ley 2210 de 2022", font=cuerpo, fill=(198, 216, 236))
    return img


if __name__ == "__main__":
    cronometro(192, 0.78).save("public/icono-192.png")
    cronometro(512, 0.78).save("public/icono-512.png")
    cronometro(512, 0.60).save("public/icono-maskable.png")
    og().save("public/og.png")
    print("public/: icono-192.png · icono-512.png · icono-maskable.png · og.png")
