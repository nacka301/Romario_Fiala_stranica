"""Generira favicon set, apple-touch-icon, logo i og:image za Fiala Mont.

Pokretanje: python scripts/make-brand-assets.py   (treba Pillow)
Izlaz: public/ (favicon.ico, favicon-48.png, icon-192.png, icon-512.png,
       apple-touch-icon.png, logo.png) i public/og-image.jpg (1200x630).
Logo je pojednostavljena oznaka (parket romb) - zamijeni logo.png/ikone
originalnim logotipom kad bude dostupan.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
CREAM = (243, 233, 216)
DARK = (74, 42, 20)
TILE_A = (139, 90, 43)
TILE_B = (181, 126, 70)
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"


def mark(size, bg=True):
    """Parket romb: 4x4 mreza rombova u dvije nijanse, supersampling 4x."""
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if bg:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.2), fill=CREAM)
    cx = cy = s / 2
    r = s * (0.36 if bg else 0.48)  # polovica dijagonale velikog romba
    n = 4
    # romb se sastoji od n x n manjih rombova (rotirana mreza)
    for i in range(n):
        for j in range(n):
            def p(u, v):
                u, v = u / n * 2 - 1, v / n * 2 - 1  # [-1,1]
                return (cx + (u - v) * r / 1.0 * 0.5 * 1.0 + 0, cy + (u + v) * r * 0.5)
            pts = [p(i, j), p(i + 1, j), p(i + 1, j + 1), p(i, j + 1)]
            d.polygon(pts, fill=TILE_A if (i + j) % 2 == 0 else TILE_B, outline=CREAM, width=max(2, s // 100))
    return img.resize((size, size), Image.LANCZOS)


def main():
    for name, size in [("favicon-48.png", 48), ("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)]:
        mark(size).save(PUB / name)
    mark(256).save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    # logo.png: oznaka + naziv (za JSON-LD logo)
    logo = Image.new("RGBA", (600, 600), CREAM + (255,))
    logo.paste(mark(380, bg=False), (110, 60), mark(380, bg=False))
    d = ImageDraw.Draw(logo)
    f = ImageFont.truetype(FONT_BOLD, 74)
    text = "FIALA MONT"
    w = d.textlength(text, font=f)
    d.text(((600 - w) / 2, 470), text, font=f, fill=DARK)
    logo.convert("RGB").save(PUB / "logo.png", optimize=True)

    # og-image 1200x630 iz postojece fotografije + tamni sloj + naziv
    src = Image.open(ROOT / "public/images/posao_3/IMG-20251028-WA0014.jpg").convert("RGB")
    tw, th = 1200, 630
    ratio = max(tw / src.width, th / src.height)
    src = src.resize((int(src.width * ratio) + 1, int(src.height * ratio) + 1), Image.LANCZOS)
    left, top = (src.width - tw) // 2, (src.height - th) // 2
    og = src.crop((left, top, left + tw, top + th))
    og = ImageEnhance.Brightness(og).enhance(0.55)
    d = ImageDraw.Draw(og)
    og.paste(mark(150), (70, 70), mark(150))
    d.text((70, 300), "FIALA MONT", font=ImageFont.truetype(FONT_BOLD, 110), fill=(255, 255, 255))
    d.text((74, 440), "Parket, laminat, vinil i brušenje · Daruvar", font=ImageFont.truetype(FONT_BOLD, 40), fill=(243, 233, 216))
    og.save(PUB / "og-image.jpg", quality=82, optimize=True, progressive=True)
    print("OK")


if __name__ == "__main__":
    main()
