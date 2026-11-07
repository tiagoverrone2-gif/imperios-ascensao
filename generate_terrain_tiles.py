import os
import random
from PIL import Image, ImageDraw

OUTPUT_DIR = r"c:\Users\Tiago Verrone\imperios-ascensao\client\web\public\assets\sprites"

def create_isometric_tile(filename, base_color, noise_colors, is_road=False, is_water=False):
    w, h = 64, 32
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Polígono em diamante isométrico 2:1
    diamond = [(32, 0), (63, 16), (32, 31), (0, 16)]
    draw.polygon(diamond, fill=base_color)

    # Ruído e textura orgânica
    random.seed(42)
    for _ in range(120):
        rx = random.randint(2, 61)
        ry = random.randint(2, 29)
        # Verifica se ponto está dentro do losango
        if abs(rx - 32) * 0.5 + abs(ry - 16) <= 15:
            nc = random.choice(noise_colors)
            draw.point([rx, ry], fill=nc)

    if is_road:
        # Pavimentação em blocos de pedra da Estrada Real
        for y_step in [8, 16, 24]:
            draw.line([(32 - y_step, 16 - y_step//2), (32 + y_step, 16 + y_step//2)], fill=(90, 80, 70), width=1)
            draw.line([(32 - y_step, 16 + y_step//2), (32 + y_step, 16 - y_step//2)], fill=(110, 100, 90), width=1)

    if is_water:
        # Linhas de brilho de onda
        draw.arc([16, 8, 48, 24], start=200, end=340, fill=(120, 210, 250), width=1)
        draw.arc([10, 12, 40, 26], start=210, end=330, fill=(150, 230, 255), width=1)

    # Borda sutil de tile para visual RTS nítido
    draw.line(diamond + [diamond[0]], fill=(base_color[0]-25, base_color[1]-25, base_color[2]-25, 120), width=1)

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Tile salvo: {filename}")

if __name__ == "__main__":
    # 1. Areia persa
    create_isometric_tile("tile_sand.png", (210, 180, 135), [(190, 160, 120), (225, 195, 150), (175, 145, 110)])
    # 2. Água do Oásis
    create_isometric_tile("tile_water.png", (35, 125, 175), [(25, 105, 155), (50, 150, 200), (20, 90, 140)], is_water=True)
    # 3. Estrada Real de Pedra
    create_isometric_tile("tile_road.png", (145, 135, 120), [(120, 110, 95), (165, 155, 140), (100, 90, 80)], is_road=True)
    # 4. Terra Fértil do Qanat
    create_isometric_tile("tile_fertile.png", (75, 95, 45), [(60, 80, 35), (90, 115, 55), (50, 70, 30)])
    print("Tiles de terreno gerados com sucesso!")
