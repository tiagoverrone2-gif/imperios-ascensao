import os
import math
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = r"c:\Users\Tiago Verrone\imperios-ascensao\client\web\public\assets\sprites"
os.makedirs(OUTPUT_DIR, exist_ok=True)

OUTLINE_COLOR = (24, 32, 48, 255) # Cartoon outline escuro

def draw_shadow(draw, cx, cy, rx, ry, opacity=90):
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(12, 16, 25, opacity))

def draw_thick_poly(draw, points, fill, outline=OUTLINE_COLOR, width=3):
    draw.polygon(points, fill=fill)
    draw.line(points + [points[0]], fill=outline, width=width)

# -------------------------------------------------------------
# 1. STAR BASE (Centro de Comando Estelar - Galaxy Life Style)
# -------------------------------------------------------------
def make_starbase():
    w, h = 256, 256
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 128, 210
    draw_shadow(draw, cx, cy - 10, 110, 36, opacity=120)

    # 1. Plataforma de Pouso Hexagonal / Base
    p_base = [
        (cx - 95, cy - 30), (cx, cy - 65), (cx + 95, cy - 30),
        (cx + 95, cy + 10), (cx, cy + 38), (cx - 95, cy + 10)
    ]
    draw_thick_poly(draw, p_base, fill=(195, 215, 230), width=4)
    # Bevel metálico
    draw.polygon([(cx - 95, cy + 10), (cx, cy + 38), (cx, cy + 28), (cx - 95, cy)], fill=(150, 175, 195))
    draw.polygon([(cx, cy + 38), (cx + 95, cy + 10), (cx + 95, cy), (cx, cy + 28)], fill=(120, 145, 168))

    # Luzes de pista de pouso (Neon Cyan e Amarelo)
    for lx, ly in [(cx - 75, cy - 10), (cx - 40, cy + 12), (cx + 40, cy + 12), (cx + 75, cy - 10)]:
        draw.ellipse([lx - 5, ly - 3, lx + 5, ly + 3], fill=(0, 240, 255), outline=(0, 120, 180), width=1)

    # 2. Corpo Central da Cidadela (Bunker Redondo Futurista)
    bld_box = [cx - 68, cy - 130, cx + 68, cy - 20]
    draw.ellipse(bld_box, fill=(235, 245, 255), outline=OUTLINE_COLOR, width=4)
    # Sombra do corpo
    draw.chord([cx - 68, cy - 75, cx + 68, cy - 20], start=0, end=180, fill=(175, 195, 215))

    # Friso metálico laranja/dourado estilo Galaxy Life
    draw.ellipse([cx - 65, cy - 85, cx + 65, cy - 50], outline=(255, 150, 20), width=6)

    # Portão de Acesso Holográfico com Luz Quente
    gate_box = [cx - 24, cy - 50, cx + 24, cy - 14]
    draw.ellipse(gate_box, fill=(255, 215, 60), outline=OUTLINE_COLOR, width=3)
    draw.ellipse([cx - 16, cy - 44, cx + 16, cy - 20], fill=(255, 245, 160))

    # 3. Grande Cúpula de Energia / Dome de Vidro
    dome_box = [cx - 46, cy - 170, cx + 46, cy - 90]
    draw.ellipse(dome_box, fill=(30, 180, 255), outline=OUTLINE_COLOR, width=4)
    # Núcleo de plasma brilhante interno
    draw.ellipse([cx - 28, cy - 155, cx + 28, cy - 105], fill=(130, 235, 255))
    # Brilho especular (Glossy highlight no vidro)
    draw.ellipse([cx - 30, cy - 162, cx - 10, cy - 145], fill=(255, 255, 255))

    # 4. Torre de Radar e Antena de Comunicação
    draw.line([cx, cy - 165, cx, cy - 198], fill=(100, 120, 145), width=5)
    draw.line([cx, cy - 165, cx, cy - 198], fill=(210, 225, 240), width=2)
    # Prato de Radar parabólico
    draw.arc([cx - 25, cy - 205, cx + 25, cy - 185], start=160, end=380, fill=(255, 140, 20), width=5)
    # Luz pisca-pisca vermelha no topo
    draw.ellipse([cx - 6, cy - 208, cx + 6, cy - 196], fill=(255, 50, 60), outline=OUTLINE_COLOR, width=2)
    draw.ellipse([cx - 3, cy - 206, cx + 3, cy - 200], fill=(255, 200, 200))

    img.save(os.path.join(OUTPUT_DIR, "galaxy_starbase.png"))
    print("Salvo: galaxy_starbase.png")

# -------------------------------------------------------------
# 2. EXTRATOR DE MINÉRIOS (Mineral Extractor)
# -------------------------------------------------------------
def make_extractor():
    w, h = 192, 192
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 155
    draw_shadow(draw, cx, cy - 5, 80, 28, opacity=110)

    # 1. Base com broca e geodo de cristal no chão
    # Fissura e geodo roxo/cyan
    draw.ellipse([cx - 45, cy - 18, cx + 45, cy + 12], fill=(45, 30, 65), outline=OUTLINE_COLOR, width=3)
    # Cristais brilhantes emergindo
    for ox, clr in [(-22, (180, 70, 255)), (-6, (0, 240, 255)), (14, (240, 90, 255)), (28, (0, 210, 255))]:
        draw.polygon([(cx + ox, cy), (cx + ox + 6, cy - 18), (cx + ox + 12, cy)], fill=clr, outline=OUTLINE_COLOR, width=2)

    # 2. Pernas de Suporte Industriais (Tripod Laranja com Faixas Pretas)
    # Perna esquerda
    draw_thick_poly(draw, [(cx - 55, cy + 4), (cx - 42, cy - 55), (cx - 30, cy - 55), (cx - 42, cy + 4)], fill=(255, 140, 20), width=3)
    # Perna direita
    draw_thick_poly(draw, [(cx + 42, cy + 4), (cx + 30, cy - 55), (cx + 42, cy - 55), (cx + 55, cy + 4)], fill=(255, 140, 20), width=3)

    # Listras de aviso industriais (Hazard stripes)
    draw.line([(cx - 50, cy - 15), (cx - 38, cy - 25)], fill=(25, 25, 30), width=4)
    draw.line([(cx + 38, cy - 25), (cx + 50, cy - 15)], fill=(25, 25, 30), width=4)

    # 3. Cilindro Central de Vidro com Líquido Borbulhante
    draw_thick_poly(draw, [(cx - 32, cy - 40), (cx + 32, cy - 40), (cx + 32, cy - 105), (cx - 32, cy - 105)], fill=(30, 45, 65), width=3)
    # Vidro transparente com minerais líquidos
    draw.rectangle([cx - 26, cy - 98, cx + 26, cy - 46], fill=(0, 220, 255), outline=OUTLINE_COLOR, width=2)
    # Bolhas de plasma
    draw.ellipse([cx - 15, cy - 70, cx - 7, cy - 62], fill=(255, 255, 255))
    draw.ellipse([cx + 6, cy - 85, cx + 16, cy - 75], fill=(255, 255, 255))
    draw.ellipse([cx - 4, cy - 56, cx + 2, cy - 50], fill=(255, 255, 255))

    # 4. Pistão / Cabeçote Hidráulico Superior
    draw_thick_poly(draw, [(cx - 38, cy - 105), (cx + 38, cy - 105), (cx + 30, cy - 130), (cx - 30, cy - 130)], fill=(255, 140, 20), width=3)
    draw.ellipse([cx - 22, cy - 136, cx + 22, cy - 122], fill=(255, 200, 50), outline=OUTLINE_COLOR, width=2)

    # Tubo de exaustão com vapor
    draw.line([cx - 26, cy - 120, cx - 42, cy - 138], fill=(120, 140, 160), width=5)
    draw.ellipse([cx - 48, cy - 148, cx - 36, cy - 136], fill=(200, 240, 255, 180))

    img.save(os.path.join(OUTPUT_DIR, "galaxy_extractor.png"))
    print("Salvo: galaxy_extractor.png")

# -------------------------------------------------------------
# 3. BANCO ESTELAR / SILO (Gold & Mineral Bank)
# -------------------------------------------------------------
def make_bank():
    w, h = 192, 192
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 155
    draw_shadow(draw, cx, cy - 5, 80, 28, opacity=110)

    # 1. Base Octogonal Reforçada
    draw_thick_poly(draw, [
        (cx - 70, cy - 15), (cx - 45, cy - 35), (cx + 45, cy - 35), (cx + 70, cy - 15),
        (cx + 70, cy + 12), (cx + 45, cy + 24), (cx - 45, cy + 24), (cx - 70, cy + 12)
    ], fill=(60, 75, 95), width=3)

    # 2. Cofre Esférico Futurista (Amarelo / Dourado e Chrome)
    draw.ellipse([cx - 60, cy - 125, cx + 60, cy - 15], fill=(255, 195, 30), outline=OUTLINE_COLOR, width=4)
    # Sombreamento inferior
    draw.chord([cx - 60, cy - 75, cx + 60, cy - 15], start=0, end=180, fill=(215, 145, 15))

    # Visor de Vidro mostrando montanhas de ouro dentro
    draw.ellipse([cx - 36, cy - 95, cx + 36, cy - 40], fill=(255, 235, 90), outline=OUTLINE_COLOR, width=3)
    # Moedas e barras brilhando dentro
    draw.ellipse([cx - 24, cy - 65, cx + 24, cy - 46], fill=(255, 255, 160))
    # Brilho do vidro
    draw.ellipse([cx - 26, cy - 90, cx - 10, cy - 76], fill=(255, 255, 255))

    # Porta de Cofre de Alta Segurança com Volante Giratório
    draw.ellipse([cx + 20, cy - 75, cx + 45, cy - 50], fill=(160, 180, 200), outline=OUTLINE_COLOR, width=2)
    draw.line([(cx + 25, cy - 62), (cx + 40, cy - 62)], fill=(40, 50, 65), width=3)
    draw.line([(cx + 32, cy - 70), (cx + 32, cy - 55)], fill=(40, 50, 65), width=3)

    # 3. Domo Superior e Luz de Status (Verde Aprovado)
    draw.ellipse([cx - 25, cy - 138, cx + 25, cy - 118], fill=(225, 240, 255), outline=OUTLINE_COLOR, width=3)
    draw.ellipse([cx - 6, cy - 145, cx + 6, cy - 133], fill=(0, 255, 120), outline=OUTLINE_COLOR, width=2)
    draw.ellipse([cx - 2, cy - 143, cx + 2, cy - 139], fill=(200, 255, 220))

    img.save(os.path.join(OUTPUT_DIR, "galaxy_bank.png"))
    print("Salvo: galaxy_bank.png")

# -------------------------------------------------------------
# 4. QUARTEL GALÁCTICO (Starling Barracks)
# -------------------------------------------------------------
def make_barracks():
    w, h = 192, 192
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 155
    draw_shadow(draw, cx, cy - 5, 82, 30, opacity=110)

    # 1. Hangar Militar com Formato Cúbico Arredondado
    draw_thick_poly(draw, [
        (cx - 65, cy - 25), (cx, cy - 55), (cx + 65, cy - 25),
        (cx + 65, cy + 15), (cx, cy + 38), (cx - 65, cy + 15)
    ], fill=(45, 60, 80), width=4)

    # Paredes do Bunker (Aço Azul Escuro e Vermelho Alerta)
    draw_thick_poly(draw, [
        (cx - 55, cy - 20), (cx, cy + 5), (cx, cy - 65), (cx - 55, cy - 88)
    ], fill=(220, 50, 60), width=3) # Parede esquerda vermelha

    draw_thick_poly(draw, [
        (cx, cy + 5), (cx + 55, cy - 20), (cx + 55, cy - 88), (cx, cy - 65)
    ], fill=(180, 30, 40), width=3) # Parede direita vermelha escura

    # Portão de Hangar Metálico com Trilhos
    gate = [(cx - 25, cy - 8), (cx + 25, cy - 8), (cx + 25, cy - 48), (cx - 25, cy - 48)]
    draw_thick_poly(draw, gate, fill=(20, 28, 40), width=3)
    # Listras de pista iluminadas dentro
    draw.line([(cx, cy - 10), (cx, cy - 45)], fill=(0, 240, 255), width=3)

    # 2. Teto do Hangar com Escudo de Aliança
    roof = [(cx, cy - 105), (cx + 60, cy - 75), (cx, cy - 48), (cx - 60, cy - 75)]
    draw_thick_poly(draw, roof, fill=(210, 225, 245), width=3)

    # Espadas cruzadas / Símbolo Militar no teto
    draw.line([(cx - 16, cy - 84), (cx + 16, cy - 68)], fill=(255, 195, 20), width=4)
    draw.line([(cx + 16, cy - 84), (cx - 16, cy - 68)], fill=(255, 195, 20), width=4)

    # Antena de Rádio e Holo-bandeira
    draw.line([cx + 38, cy - 85, cx + 38, cy - 125], fill=(120, 140, 160), width=3)
    draw.polygon([(cx + 38, cy - 125), (cx + 58, cy - 115), (cx + 38, cy - 105)], fill=(0, 240, 255))

    img.save(os.path.join(OUTPUT_DIR, "galaxy_barracks.png"))
    print("Salvo: galaxy_barracks.png")

# -------------------------------------------------------------
# 5. CANHÃO DE PLASMA / DEFESA (Plasma Cannon Tower)
# -------------------------------------------------------------
def make_cannon():
    w, h = 128, 160
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 64, 130
    draw_shadow(draw, cx, cy - 4, 45, 18, opacity=110)

    # 1. Base em Anel de Aço Reforçado
    draw.ellipse([cx - 40, cy - 30, cx + 40, cy + 10], fill=(60, 75, 95), outline=OUTLINE_COLOR, width=3)
    draw.ellipse([cx - 28, cy - 22, cx + 28, cy + 4], fill=(40, 50, 68), outline=OUTLINE_COLOR, width=2)

    # 2. Cúpula Giratória da Torre (Azul Metálico e Amarelo)
    draw.ellipse([cx - 26, cy - 65, cx + 26, cy - 15], fill=(255, 150, 20), outline=OUTLINE_COLOR, width=3)
    draw.ellipse([cx - 18, cy - 58, cx + 18, cy - 24], fill=(255, 195, 50))

    # 3. Canos Duplos de Plasma (Dual Plasma Railguns)
    # Cano esquerdo
    draw_thick_poly(draw, [(cx - 14, cy - 50), (cx - 26, cy - 90), (cx - 16, cy - 94), (cx - 6, cy - 52)], fill=(120, 140, 165), width=2)
    # Cano direito
    draw_thick_poly(draw, [(cx + 6, cy - 52), (cx + 16, cy - 94), (cx + 26, cy - 90), (cx + 14, cy - 50)], fill=(120, 140, 165), width=2)

    # Bocais de energia brilhante azul neon
    draw.ellipse([cx - 28, cy - 96, cx - 14, cy - 88], fill=(0, 240, 255), outline=OUTLINE_COLOR, width=2)
    draw.ellipse([cx + 14, cy - 96, cx + 28, cy - 88], fill=(0, 240, 255), outline=OUTLINE_COLOR, width=2)

    # Núcleo de mira central
    draw.ellipse([cx - 6, cy - 45, cx + 6, cy - 33], fill=(255, 50, 60), outline=OUTLINE_COLOR, width=2)

    img.save(os.path.join(OUTPUT_DIR, "galaxy_cannon.png"))
    print("Salvo: galaxy_cannon.png")

# -------------------------------------------------------------
# 6. STARLINGS (O habitante icônico de Galaxy Life - Animado)
# -------------------------------------------------------------
def make_starlings():
    # Cria 4 frames de marcha e salto do simpático Starling Laranja
    for frame in range(4):
        w, h = 80, 80
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = 40, 62
        bounce = int(math.sin(frame * math.pi / 2.0) * 5)
        cy -= bounce

        # Sombra sob os pés (diminui quando pula)
        shadow_rx = max(8, 16 - bounce)
        draw_shadow(draw, 40, 66, shadow_rx, 5, opacity=110)

        # Patinhas / Sapatinhos brancos
        foot_offset = int(math.sin(frame * math.pi) * 4)
        draw.ellipse([cx - 14, cy + 4 - foot_offset, cx - 4, cy + 12 - foot_offset], fill=(240, 245, 255), outline=OUTLINE_COLOR, width=2)
        draw.ellipse([cx + 4, cy + 4 + foot_offset, cx + 14, cy + 12 + foot_offset], fill=(240, 245, 255), outline=OUTLINE_COLOR, width=2)

        # Corpo Redondinho Laranja Vibrante
        draw.ellipse([cx - 22, cy - 32, cx + 22, cy + 8], fill=(255, 125, 10), outline=OUTLINE_COLOR, width=3)
        # Bochechas e barriguinha mais clara
        draw.ellipse([cx - 14, cy - 10, cx + 14, cy + 6], fill=(255, 180, 60))

        # Olhos Grandes e Expressivos Cartoon
        # Olho esquerdo
        draw.ellipse([cx - 14, cy - 24, cx - 2, cy - 10], fill=(255, 255, 255), outline=OUTLINE_COLOR, width=2)
        draw.ellipse([cx - 9, cy - 20, cx - 4, cy - 13], fill=(20, 25, 35))
        draw.ellipse([cx - 8, cy - 19, cx - 6, cy - 17], fill=(255, 255, 255)) # Brilho

        # Olho direito
        draw.ellipse([cx + 2, cy - 24, cx + 14, cy - 10], fill=(255, 255, 255), outline=OUTLINE_COLOR, width=2)
        draw.ellipse([cx + 4, cy - 20, cx + 9, cy - 13], fill=(20, 25, 35))
        draw.ellipse([cx + 5, cy - 19, cx + 7, cy - 17], fill=(255, 255, 255))

        # Sorriso simpático
        draw.arc([cx - 6, cy - 10, cx + 6, cy - 2], start=20, end=160, fill=OUTLINE_COLOR, width=2)

        # Anteninha fofa com esfera amarela no topo
        draw.line([cx, cy - 32, cx, cy - 44], fill=OUTLINE_COLOR, width=3)
        draw.ellipse([cx - 5, cy - 52, cx + 5, cy - 42], fill=(255, 225, 40), outline=OUTLINE_COLOR, width=2)

        # Mãozinhas brancas balançando
        hand_y = cy - 8 + (bounce // 2)
        draw.ellipse([cx - 25, hand_y, cx - 17, hand_y + 8], fill=(240, 245, 255), outline=OUTLINE_COLOR, width=2)
        draw.ellipse([cx + 17, hand_y, cx + 25, hand_y + 8], fill=(240, 245, 255), outline=OUTLINE_COLOR, width=2)

        filename = f"galaxy_starling_{frame}.png"
        img.save(os.path.join(OUTPUT_DIR, filename))
        print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 7. STARLING MARINE (Soldado com Capacete Espacial e Laser Blaster)
# -------------------------------------------------------------
def make_soldiers():
    for frame in range(4):
        w, h = 80, 80
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = 40, 62
        bounce = int(math.sin(frame * math.pi / 2.0) * 4)
        cy -= bounce

        draw_shadow(draw, 40, 66, 16, 5, opacity=110)

        # Botas táticas
        draw.ellipse([cx - 14, cy + 5, cx - 4, cy + 13], fill=(50, 65, 85), outline=OUTLINE_COLOR, width=2)
        draw.ellipse([cx + 4, cy + 5, cx + 14, cy + 13], fill=(50, 65, 85), outline=OUTLINE_COLOR, width=2)

        # Corpo com Armadura Vermelha Tática
        draw.ellipse([cx - 22, cy - 30, cx + 22, cy + 8], fill=(225, 45, 55), outline=OUTLINE_COLOR, width=3)
        draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 4], fill=(255, 120, 130))

        # Capacete Espacial com Visor Vidro Cyan Espelhado
        draw.ellipse([cx - 18, cy - 26, cx + 18, cy - 4], fill=(0, 220, 255), outline=OUTLINE_COLOR, width=3)
        # Brilho no visor
        draw.ellipse([cx - 12, cy - 24, cx + 2, cy - 16], fill=(255, 255, 255))

        # Antena tática militar
        draw.line([cx - 14, cy - 26, cx - 22, cy - 38], fill=(120, 140, 160), width=3)
        draw.ellipse([cx - 25, cy - 42, cx - 19, cy - 36], fill=(255, 50, 60))

        # Arma Laser Blaster empunhada
        draw_thick_poly(draw, [(cx + 12, cy - 6), (cx + 28, cy - 6), (cx + 28, cy), (cx + 12, cy + 4)], fill=(40, 50, 65), width=2)
        draw.ellipse([cx + 26, cy - 8, cx + 32, cy - 2], fill=(0, 255, 240)) # Ponta laser

        filename = f"galaxy_soldier_{frame}.png"
        img.save(os.path.join(OUTPUT_DIR, filename))
        print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 8. TERRENO PLANETÁRIO E ESTRADAS HIGH-TECH (Galaxy Life)
# -------------------------------------------------------------
def make_terrain():
    tw, th = 64, 32
    # 1. Grama Esmeralda de Planeta Alienígena
    img_grass = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d_g = ImageDraw.Draw(img_grass)
    diamond = [(32, 0), (63, 16), (32, 31), (0, 16)]
    d_g.polygon(diamond, fill=(72, 195, 60)) # Verde vibrante
    # Detalhes de flores e relevo cartoon
    d_g.ellipse([26, 12, 34, 18], fill=(95, 220, 75))
    d_g.line(diamond + [diamond[0]], fill=(50, 150, 40), width=1)
    img_grass.save(os.path.join(OUTPUT_DIR, "galaxy_tile_planet.png"))

    # 2. Caminho Metálico com Conduíte de Neon
    img_road = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d_r = ImageDraw.Draw(img_road)
    d_r.polygon(diamond, fill=(75, 90, 115))
    # Conduíte de energia central
    d_r.line([(0, 16), (63, 16)], fill=(0, 240, 255), width=2)
    d_r.line(diamond + [diamond[0]], fill=(45, 55, 75), width=1)
    img_road.save(os.path.join(OUTPUT_DIR, "galaxy_tile_road.png"))

    # 3. Solo de Mineração / Cratera Cósmica
    img_crater = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d_c = ImageDraw.Draw(img_crater)
    d_c.polygon(diamond, fill=(90, 60, 120))
    d_c.ellipse([22, 10, 42, 22], fill=(60, 35, 85))
    d_c.line(diamond + [diamond[0]], fill=(50, 30, 70), width=1)
    img_crater.save(os.path.join(OUTPUT_DIR, "galaxy_tile_crater.png"))

    # 4. Água / Plasma Líquido Cósmico
    img_water = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    d_w = ImageDraw.Draw(img_water)
    d_w.polygon(diamond, fill=(20, 175, 245))
    d_w.arc([16, 8, 48, 24], start=210, end=330, fill=(150, 235, 255), width=2)
    d_w.line(diamond + [diamond[0]], fill=(10, 130, 200), width=1)
    img_water.save(os.path.join(OUTPUT_DIR, "galaxy_tile_water.png"))

    print("Tiles planetários salvos!")

# -------------------------------------------------------------
# 9. BOLHAS FLUTUANTES DE COLETA (Floating Resource Bubbles)
# -------------------------------------------------------------
def make_bubbles():
    # 1. Bolha de Moeda de Ouro
    img_gold = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(img_gold)
    d.ellipse([4, 4, 76, 76], fill=(255, 255, 255, 230), outline=(255, 180, 20), width=4)
    # Moeda de Ouro 3D
    d.ellipse([16, 16, 64, 64], fill=(255, 200, 30), outline=(200, 130, 10), width=3)
    d.ellipse([24, 24, 56, 56], fill=(255, 230, 80))
    d.text((34, 25), "$", fill=(170, 100, 10))
    img_gold.save(os.path.join(OUTPUT_DIR, "galaxy_bubble_gold.png"))

    # 2. Bolha de Mineral / Energia
    img_min = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(img_min)
    d.ellipse([4, 4, 76, 76], fill=(255, 255, 255, 230), outline=(0, 210, 255), width=4)
    # Cristal de Energia
    crystal = [(40, 16), (58, 34), (40, 64), (22, 34)]
    draw_thick_poly(d, crystal, fill=(0, 230, 255), outline=(0, 130, 180), width=3)
    d.polygon([(40, 16), (48, 34), (40, 64), (32, 34)], fill=(180, 250, 255))
    img_min.save(os.path.join(OUTPUT_DIR, "galaxy_bubble_mineral.png"))

    print("Bolhas de coleta salvas!")

# -------------------------------------------------------------
# 10. RETRATOS DE SELEÇÃO CARTOON (HUD Cards)
# -------------------------------------------------------------
def make_portraits():
    for name, icon_char, color_bg in [
        ('portrait_starbase.png', '🚀', (25, 45, 75)),
        ('portrait_extractor.png', '⛏️', (75, 45, 20)),
        ('portrait_bank.png', '🪙', (75, 60, 15)),
        ('portrait_barracks.png', '⚔️', (65, 25, 30)),
        ('portrait_cannon.png', '💥', (40, 50, 70)),
        ('portrait_starling.png', '👽', (75, 40, 10))
    ]:
        img = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([4, 4, 96, 96], radius=16, fill=color_bg, outline=(255, 195, 30), width=4)
        d.ellipse([20, 20, 80, 80], fill=(255, 255, 255, 40))
        img.save(os.path.join(OUTPUT_DIR, name))
        print(f"Retrato salvo: {name}")

if __name__ == "__main__":
    print("Gerando Suíte Visual Completa Estilo Galaxy Life...")
    make_starbase()
    make_extractor()
    make_bank()
    make_barracks()
    make_cannon()
    make_starlings()
    make_soldiers()
    make_terrain()
    make_bubbles()
    make_portraits()
    print("SUCESSO: Todos os ativos estilo Galaxy Life foram gerados com perfeição!")
