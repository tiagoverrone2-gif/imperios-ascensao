import os
import math
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = r"c:\Users\Tiago Verrone\imperios-ascensao\client\web\public\assets\sprites"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def draw_shadow(draw, cx, cy, rx, ry, opacity=90):
    """Desenha sombra projetada no solo elíptica com desfoque"""
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(15, 12, 10, opacity))

# -------------------------------------------------------------
# 1. PALM TREE (Palmeira dos Oásis Persas)
# -------------------------------------------------------------
def create_palm_tree(filename="palm_tree.png"):
    img = Image.new("RGBA", (96, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 48, 114
    # Sombra
    draw_shadow(draw, cx + 8, cy + 2, 28, 12, opacity=110)

    # Tronco texturizado e curvado
    trunk_pts = [(48, 114), (46, 95), (44, 75), (45, 55), (48, 40)]
    for i in range(len(trunk_pts) - 1):
        x1, y1 = trunk_pts[i]
        x2, y2 = trunk_pts[i + 1]
        w = max(4, int(11 - i * 1.5))
        # Casca marrom texturizada
        draw.line([x1, y1, x2, y2], fill=(110 - i * 6, 75 - i * 5, 45 - i * 3), width=w)
        # Anéis do tronco
        draw.line([x1 - w//2, y1, x1 + w//2, y1], fill=(65, 40, 20), width=2)

    # Folhas da palmeira (leques verdes com gradiente)
    leaf_angles = [0, 35, 70, 110, 150, 185, 220, 260, 305, 340]
    head_x, head_y = 48, 40

    for ang in leaf_angles:
        rad = math.radians(ang)
        length = 38
        tip_x = head_x + math.cos(rad) * length
        tip_y = head_y + math.sin(rad) * (length * 0.65) + 12

        mid_x = (head_x + tip_x) / 2 + math.sin(rad) * 6
        mid_y = (head_y + tip_y) / 2 - 8

        # Folha composta
        draw.line([head_x, head_y, mid_x, mid_y], fill=(34, 110, 34), width=3)
        draw.line([mid_x, mid_y, tip_x, tip_y], fill=(70, 160, 45), width=2)

        # Frondes laterais
        for t in range(3, 9):
            fx = head_x + (tip_x - head_x) * (t / 10.0)
            fy = head_y + (tip_y - head_y) * (t / 10.0)
            draw.line([fx, fy, fx + math.sin(rad)*8, fy + 6], fill=(50, 140, 40), width=1)
            draw.line([fx, fy, fx - math.sin(rad)*8, fy + 6], fill=(90, 185, 55), width=1)

    # Cachos de tâmaras
    draw.ellipse([44, 42, 52, 50], fill=(140, 70, 20))
    draw.ellipse([41, 44, 47, 51], fill=(170, 90, 25))

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 2. ROCHA DESÉRTICA / AFLORAMENTO
# -------------------------------------------------------------
def create_rock_formation(filename="desert_rock.png"):
    img = Image.new("RGBA", (100, 70), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Sombra
    draw_shadow(draw, 50, 52, 42, 14, opacity=110)

    # Facetas de rocha com iluminação direcional (Sol superior esquerdo)
    boulder1 = [(20, 50), (12, 40), (22, 22), (48, 16), (62, 30), (58, 52)]
    draw.polygon(boulder1, fill=(130, 115, 95))
    # Face iluminada
    draw.polygon([(22, 22), (48, 16), (42, 35), (25, 40)], fill=(185, 165, 135))
    # Face em sombra
    draw.polygon([(48, 16), (62, 30), (58, 52), (42, 35)], fill=(85, 75, 60))

    # Rocha menor à direita
    boulder2 = [(52, 54), (58, 38), (76, 28), (92, 42), (86, 56)]
    draw.polygon(boulder2, fill=(115, 100, 80))
    draw.polygon([(58, 38), (76, 28), (72, 46), (56, 50)], fill=(160, 140, 115))
    draw.polygon([(76, 28), (92, 42), (86, 56), (72, 46)], fill=(75, 65, 50))

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 3. APADANA IMPERIAL PERSA (Centro Imperial 4x4)
# -------------------------------------------------------------
def create_persian_apadana(filename="persian_apadana.png"):
    w, h = 256, 240
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 128, 195

    # 1. Grande sombra elíptica projetada
    draw_shadow(draw, cx + 25, cy - 10, 115, 45, opacity=120)

    # 2. Fundação / Plataforma de pedra escalonada persa (Isométrica 2:1)
    # Nível 1 Base
    p1 = [(cx, cy - 40), (cx + 105, cy + 12), (cx, cy + 38), (cx - 105, cy + 12)]
    draw.polygon(p1, fill=(135, 118, 90))
    draw.line(p1 + [p1[0]], fill=(70, 58, 42), width=2)

    # Borda vertical da plataforma
    draw.polygon([(cx - 105, cy + 12), (cx, cy + 38), (cx, cy + 48), (cx - 105, cy + 22)], fill=(95, 80, 60))
    draw.polygon([(cx, cy + 38), (cx + 105, cy + 12), (cx + 105, cy + 22), (cx, cy + 48)], fill=(65, 52, 38))

    # Nível 2 Base
    p2 = [(cx, cy - 48), (cx + 92, cy - 2), (cx, cy + 22), (cx - 92, cy - 2)]
    draw.polygon(p2, fill=(165, 145, 115))

    # 3. Paredes do Grande Salão (Apadana)
    wall_left = [(cx - 75, cy - 15), (cx, cy + 8), (cx, cy - 55), (cx - 75, cy - 78)]
    wall_right = [(cx, cy + 8), (cx + 75, cy - 15), (cx + 75, cy - 78), (cx, cy - 55)]
    draw.polygon(wall_left, fill=(180, 155, 120))
    draw.polygon(wall_right, fill=(130, 110, 80))

    # Relevos de tijolos esmaltados azuis e dourados (Típicos de Persépolis / Susa)
    draw.polygon([(cx - 72, cy - 22), (cx - 2, cy - 2), (cx - 2, cy - 15), (cx - 72, cy - 35)], fill=(25, 60, 120))
    draw.polygon([(cx + 2, cy - 2), (cx + 72, cy - 22), (cx + 72, cy - 35), (cx + 2, cy - 15)], fill=(18, 42, 85))
    # Detalhe dourado
    draw.line([(cx - 72, cy - 28), (cx - 2, cy - 8)], fill=(225, 185, 55), width=2)
    draw.line([(cx + 2, cy - 8), (cx + 72, cy - 28)], fill=(200, 160, 45), width=2)

    # 4. Portais Monumentais (Portão de Todas as Nações)
    portal_l = [(cx - 30, cy - 4), (cx - 10, cy + 2), (cx - 10, cy - 36), (cx - 30, cy - 42)]
    draw.polygon(portal_l, fill=(35, 25, 18))
    # Moldura dourada
    draw.line([(cx - 30, cy - 4), (cx - 30, cy - 42), (cx - 10, cy - 36), (cx - 10, cy + 2)], fill=(215, 175, 50), width=3)

    # 5. Colunas Monumentais Aquemênidas (Fluted columns com capitéis duplos de touros)
    col_x = [cx - 65, cx - 42, cx - 18, cx + 18, cx + 42, cx + 65]
    for x in col_x:
        # Altura da coluna
        top_y = cy - 88 + abs(x - cx) * 0.15
        bot_y = cy - 20 + abs(x - cx) * 0.15
        # Coluna de mármore branco/creme estriado
        draw.line([x, bot_y, x, top_y], fill=(235, 228, 215), width=6)
        draw.line([x - 1, bot_y, x - 1, top_y], fill=(255, 250, 240), width=2)
        draw.line([x + 2, bot_y, x + 2, top_y], fill=(160, 145, 130), width=2)
        # Capitel duplo de touro persa dourado
        draw.polygon([(x - 6, top_y), (x + 6, top_y), (x + 4, top_y - 6), (x - 4, top_y - 6)], fill=(218, 178, 55))

    # 6. Friso e Telhado com cúpula de ouro aquemênida
    roof_base = [(cx, cy - 105), (cx + 85, cy - 65), (cx, cy - 40), (cx - 85, cy - 65)]
    draw.polygon(roof_base, fill=(195, 170, 135))
    draw.line(roof_base + [roof_base[0]], fill=(225, 185, 60), width=3)

    # Cúpula Dourada Majestosa
    dome_box = [cx - 36, cy - 138, cx + 36, cy - 82]
    draw.chord(dome_box, start=180, end=0, fill=(225, 180, 45), outline=(150, 110, 20), width=2)
    # Brilho specular na cúpula
    draw.chord([cx - 24, cy - 134, cx + 8, cy - 95], start=200, end=270, fill=(255, 235, 130))
    # Pináculo persa
    draw.line([cx, cy - 138, cx, cy - 152], fill=(240, 210, 60), width=3)
    draw.ellipse([cx - 4, cy - 156, cx + 4, cy - 148], fill=(255, 230, 80))

    # 7. Estandartes Reais Aquemênidas (Carmesim e Ouro com o Falcão de Ciro)
    draw.line([cx - 78, cy - 30, cx - 78, cy - 6], fill=(160, 25, 30), width=7)
    draw.line([cx - 78, cy - 30, cx - 78, cy - 6], fill=(225, 185, 55), width=2)
    draw.line([cx + 78, cy - 30, cx + 78, cy - 6], fill=(160, 25, 30), width=7)
    draw.line([cx + 78, cy - 30, cx + 78, cy - 6], fill=(225, 185, 55), width=2)

    # Tochas acesas na entrada
    for tx in [cx - 38, cx + 38]:
        ty = cy - 2
        draw.line([tx, ty, tx, ty - 12], fill=(90, 70, 50), width=2)
        draw.ellipse([tx - 4, ty - 18, tx + 4, ty - 10], fill=(245, 120, 20))
        draw.ellipse([tx - 2, ty - 16, tx + 2, ty - 12], fill=(255, 230, 80))

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 4. FAZENDA COM QANAT PERSA (3x3)
# -------------------------------------------------------------
def create_persian_farm(filename="persian_farm.png"):
    w, h = 192, 160
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 115
    draw_shadow(draw, cx + 15, cy - 5, 80, 32, opacity=100)

    # Solo arado em sulcos isométricos
    plot = [(cx, cy - 30), (cx + 75, cy + 8), (cx, cy + 32), (cx - 75, cy + 8)]
    draw.polygon(plot, fill=(110, 80, 50))

    # Sulcos agrícolas cultivados (trigo e grãos)
    for i in range(-5, 6, 2):
        sy = cy + i * 4
        draw.line([(cx - 50 + abs(i)*4, sy - 10), (cx + 50 - abs(i)*4, sy + 15)], fill=(155, 130, 45), width=3)
        draw.line([(cx - 50 + abs(i)*4, sy - 9), (cx + 50 - abs(i)*4, sy + 16)], fill=(80, 145, 35), width=2)

    # Canal de irrigação Qanat subterrâneo que aflora
    qanat = [(cx - 20, cy - 25), (cx + 10, cy - 10), (cx - 10, cy + 25), (cx - 40, cy + 10)]
    draw.polygon(qanat, fill=(40, 130, 180))
    draw.line([(cx - 20, cy - 25), (cx - 40, cy + 10)], fill=(70, 180, 230), width=2)

    # Cabana de adobe e palha do agricultor
    house = [(cx + 20, cy - 15), (cx + 55, cy + 2), (cx + 55, cy - 25), (cx + 20, cy - 42)]
    draw.polygon(house, fill=(190, 160, 120))
    draw.polygon([(cx + 20, cy - 42), (cx + 55, cy - 25), (cx + 38, cy - 46), (cx + 5, cy - 55)], fill=(160, 130, 70))
    # Porta e feno
    draw.rectangle([cx + 32, cy - 15, cx + 42, cy], fill=(50, 35, 20))
    draw.ellipse([cx + 46, cy - 5, cx + 56, cy + 4], fill=(210, 180, 70))

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 5. SERRARIA DE CEDRO REAL (3x3)
# -------------------------------------------------------------
def create_persian_sawmill(filename="persian_sawmill.png"):
    w, h = 192, 160
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 115
    draw_shadow(draw, cx + 18, cy - 5, 78, 30, opacity=110)

    # Pátio de terra batida
    plot = [(cx, cy - 28), (cx + 70, cy + 8), (cx, cy + 30), (cx - 70, cy + 8)]
    draw.polygon(plot, fill=(130, 105, 75))

    # Pilha piramidal de toras de cedro
    for layer in range(3):
        ly = cy + 10 - layer * 7
        for lx in range(-3 + layer, 4 - layer):
            tx = cx - 25 + lx * 8
            draw.ellipse([tx - 4, ly - 4, tx + 4, ly + 4], fill=(135, 75, 35), outline=(75, 40, 20))
            draw.point([tx, ly], fill=(195, 140, 80))

    # Galpão de corte aberto com teto de telhas vermelhas
    shed_pillars = [(cx + 10, cy - 10), (cx + 50, cy + 5), (cx + 50, cy - 25), (cx + 10, cy - 40)]
    draw.polygon(shed_pillars, fill=(110, 80, 50))
    draw.polygon([(cx + 5, cy - 45), (cx + 55, cy - 28), (cx + 40, cy - 55), (cx - 10, cy - 65)], fill=(175, 65, 45))

    # Toco de corte com machado
    draw.ellipse([cx - 38, cy - 2, cx - 28, cy + 6], fill=(100, 60, 30))
    draw.line([cx - 33, cy + 2, cx - 28, cy - 10], fill=(180, 180, 190), width=2)

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 6. QUARTEL DA GUARDA REAL (3x3)
# -------------------------------------------------------------
def create_persian_barracks(filename="persian_barracks.png"):
    w, h = 192, 175
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 96, 130
    draw_shadow(draw, cx + 20, cy - 10, 82, 34, opacity=120)

    # Pátio de armas fortificado
    plot = [(cx, cy - 35), (cx + 75, cy + 5), (cx, cy + 32), (cx - 75, cy + 5)]
    draw.polygon(plot, fill=(145, 130, 105))

    # Fortaleza de treino (muralhas com ameias)
    bld_l = [(cx - 55, cy - 10), (cx, cy + 12), (cx, cy - 42), (cx - 55, cy - 62)]
    bld_r = [(cx, cy + 12), (cx + 55, cy - 10), (cx + 55, cy - 62), (cx, cy - 42)]
    draw.polygon(bld_l, fill=(170, 140, 110))
    draw.polygon(bld_r, fill=(120, 100, 75))

    # Ameias (merlons)
    for i in range(5):
        mx = cx - 50 + i * 11
        my = cy - 60 + i * 5
        draw.rectangle([mx, my - 6, mx + 6, my], fill=(185, 155, 125))

    # Porta de carvalho reforçada
    draw.polygon([(cx - 15, cy + 5), (cx + 15, cy - 2), (cx + 15, cy - 24), (cx - 15, cy - 18)], fill=(45, 30, 20))
    draw.line([(cx - 15, cy - 6), (cx + 15, cy - 13)], fill=(180, 150, 60), width=2)

    # Estandarte imperial carmesim
    draw.line([cx - 48, cy - 20, cx - 48, cy], fill=(175, 25, 35), width=6)
    draw.line([cx - 48, cy - 20, cx - 48, cy], fill=(225, 190, 50), width=2)

    # Suporte com lanças e escudos no pátio
    draw.line([cx + 35, cy + 18, cx + 25, cy + 2], fill=(120, 90, 50), width=2)
    draw.line([cx + 38, cy + 18, cx + 32, cy + 1], fill=(120, 90, 50), width=2)
    # Pontas de prata
    draw.point([cx + 25, cy + 2], fill=(220, 220, 230))
    draw.point([cx + 32, cy + 1], fill=(220, 220, 230))
    # Escudo encostado
    draw.ellipse([cx + 30, cy + 10, cx + 42, cy + 22], fill=(180, 140, 50), outline=(80, 30, 20))

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 7. TORRE DE ARQUEIROS DE SUSA (2x2)
# -------------------------------------------------------------
def create_persian_tower(filename="persian_tower.png"):
    w, h = 128, 192
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = 64, 155
    draw_shadow(draw, cx + 18, cy - 5, 45, 20, opacity=120)

    # Base da torre
    base = [(cx, cy - 18), (cx + 38, cy + 2), (cx, cy + 18), (cx - 38, cy + 2)]
    draw.polygon(base, fill=(130, 115, 95))

    # Corpo alto da torre (alvenaria persa)
    tw_l = [(cx - 28, cy), (cx, cy + 12), (cx, cy - 90), (cx - 28, cy - 100)]
    tw_r = [(cx, cy + 12), (cx + 28, cy), (cx + 28, cy - 100), (cx, cy - 90)]
    draw.polygon(tw_l, fill=(185, 160, 125))
    draw.polygon(tw_r, fill=(135, 115, 90))

    # Frestas de tiro de flecha
    draw.rectangle([cx - 16, cy - 45, cx - 12, cy - 25], fill=(35, 25, 20))
    draw.rectangle([cx + 12, cy - 45, cx + 16, cy - 25], fill=(25, 18, 14))
    draw.rectangle([cx - 16, cy - 75, cx - 12, cy - 60], fill=(35, 25, 20))

    # Parapeito superior com ameias
    p_top = [(cx, cy - 110), (cx + 34, cy - 96), (cx, cy - 82), (cx - 34, cy - 96)]
    draw.polygon(p_top, fill=(205, 180, 145))
    # Ameias
    for dx in [-26, -10, 8, 24]:
        draw.rectangle([cx + dx, cy - 116, cx + dx + 5, cy - 108], fill=(215, 190, 155))

    # Arqueiro persa de guarda no topo
    draw.ellipse([cx - 4, cy - 128, cx + 4, cy - 120], fill=(235, 195, 140)) # cabeça
    draw.line([cx, cy - 120, cx, cy - 110], fill=(160, 30, 35), width=4) # túnica
    draw.arc([cx - 10, cy - 126, cx, cy - 112], start=90, end=270, fill=(110, 75, 40), width=2) # arco

    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 8. SOLDADO: IMORTAL PERSA (Animação Isometric Sprite)
# -------------------------------------------------------------
def create_immortal_frames():
    # Cria frames de caminhada para o Imortal
    for frame in range(4):
        w, h = 64, 72
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = 32, 54
        # Sombra sob os pés
        draw_shadow(draw, cx, cy + 4, 14, 6, opacity=110)

        # Pernas em ciclo de caminhada
        leg_offset = int(math.sin(frame * math.pi / 2.0) * 5)
        # Perna esquerda
        draw.line([cx - 4, cy - 12, cx - 5 - leg_offset, cy + 3], fill=(70, 50, 30), width=3)
        draw.ellipse([cx - 7 - leg_offset, cy + 2, cx - 3 - leg_offset, cy + 6], fill=(40, 25, 15)) # bota
        # Perna direita
        draw.line([cx + 4, cy - 12, cx + 5 + leg_offset, cy + 3], fill=(95, 70, 45), width=3)
        draw.ellipse([cx + 3 + leg_offset, cy + 2, cx + 7 + leg_offset, cy + 6], fill=(40, 25, 15))

        # Túnica e Armadura de Escamas Douradas (Lamellar Cuirass)
        draw.polygon([(cx - 9, cy - 24), (cx + 9, cy - 24), (cx + 7, cy - 10), (cx - 7, cy - 10)], fill=(215, 175, 45))
        # Saia da túnica carmesim persa
        draw.polygon([(cx - 7, cy - 10), (cx + 7, cy - 10), (cx + 8, cy - 2), (cx - 8, cy - 2)], fill=(160, 25, 30))
        # Cinturão dourado
        draw.line([cx - 8, cy - 10, cx + 8, cy - 10], fill=(240, 205, 70), width=2)

        # Braços
        arm_swing = int(math.cos(frame * math.pi / 2.0) * 3)

        # Braço esquerdo segurando grande escudo de vime persa (Spara)
        draw.line([cx - 8, cy - 22, cx - 12, cy - 14], fill=(215, 175, 45), width=3)
        # Escudo de vime oval com reforço de bronze
        draw.ellipse([cx - 19, cy - 24, cx - 7, cy], fill=(185, 150, 75), outline=(75, 40, 15), width=2)
        draw.ellipse([cx - 15, cy - 15, cx - 11, cy - 9], fill=(225, 190, 50)) # umbo central de bronze

        # Braço direito segurando lança
        draw.line([cx + 8, cy - 22, cx + 12 + arm_swing, cy - 14], fill=(215, 175, 45), width=3)
        # Haste da lança longa
        draw.line([cx + 12 + arm_swing, cy + 12, cx + 12 + arm_swing, cy - 36], fill=(120, 85, 45), width=2)
        # Ponta de lança em prata / aço
        draw.polygon([
            (cx + 12 + arm_swing, cy - 44),
            (cx + 10 + arm_swing, cy - 36),
            (cx + 14 + arm_swing, cy - 36)
        ], fill=(230, 235, 245))
        # Maçã de prata / ouro na ponta inferior (símbolo dos Imortais)
        draw.ellipse([cx + 10 + arm_swing, cy + 10, cx + 14 + arm_swing, cy + 14], fill=(245, 215, 60))

        # Cabeça com capacete cônico e tiara persa
        draw.ellipse([cx - 5, cy - 34, cx + 5, cy - 24], fill=(235, 195, 140)) # rosto
        # Pano / Barba negra aquemênida
        draw.polygon([(cx - 3, cy - 26), (cx + 3, cy - 26), (cx, cy - 22)], fill=(20, 15, 12))
        # Tiara/Capacete Dourado
        draw.polygon([(cx - 6, cy - 32), (cx + 6, cy - 32), (cx, cy - 40)], fill=(220, 180, 50), outline=(130, 95, 20))

        filename = f"immortal_walk_{frame}.png"
        img.save(os.path.join(OUTPUT_DIR, filename))
        print(f"Salvo: {filename}")

# -------------------------------------------------------------
# 9. ARQUEIRO DE SUSA
# -------------------------------------------------------------
def create_archer_frames():
    for frame in range(3):
        w, h = 64, 70
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        cx, cy = 32, 52
        draw_shadow(draw, cx, cy + 4, 13, 5, opacity=110)

        # Pernas
        leg_offset = int(math.sin(frame * math.pi) * 4)
        draw.line([cx - 3, cy - 10, cx - 4 - leg_offset, cy + 2], fill=(80, 60, 40), width=3)
        draw.line([cx + 3, cy - 10, cx + 4 + leg_offset, cy + 2], fill=(100, 75, 50), width=3)

        # Túnica Azul de Susa
        draw.polygon([(cx - 8, cy - 22), (cx + 8, cy - 22), (cx + 6, cy - 4), (cx - 6, cy - 4)], fill=(30, 70, 135))
        draw.line([cx - 7, cy - 12, cx + 7, cy - 12], fill=(220, 180, 50), width=2)

        # Aljava de flechas nas costas
        draw.line([cx + 4, cy - 26, cx + 10, cy - 12], fill=(90, 55, 30), width=4)
        draw.line([cx + 3, cy - 29, cx + 5, cy - 25], fill=(240, 240, 240), width=1) # penas

        # Arco Composto Recurvo
        draw.arc([cx - 18, cy - 30, cx - 4, cy - 6], start=80, end=280, fill=(115, 75, 40), width=2)

        # Cabeça
        draw.ellipse([cx - 4, cy - 30, cx + 4, cy - 22], fill=(235, 195, 140))
        # Turbante/gorro persa amarelo açafrão
        draw.chord([cx - 5, cy - 35, cx + 5, cy - 27], start=180, end=0, fill=(235, 195, 50))

        filename = f"archer_walk_{frame}.png"
        img.save(os.path.join(OUTPUT_DIR, filename))
        print(f"Salvo: {filename}")

if __name__ == "__main__":
    print("Iniciando geração de sprites RTS estilo Star Wars Galactic Battlegrounds / Age of Empires...")
    create_palm_tree()
    create_rock_formation()
    create_persian_apadana()
    create_persian_farm()
    create_persian_sawmill()
    create_persian_barracks()
    create_persian_tower()
    create_immortal_frames()
    create_archer_frames()
    print("Todos os sprites gerados com sucesso!")
