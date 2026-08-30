"""Generate aligned prototype hero layers from the canonical 1536x1024 day plate.

Run from the repository root with the bundled Python/Pillow environment:
  python scripts/generate_hero_layers.py

The masks are intentionally polygonal and editable. Generated assets are rough
compositing prototypes, not production-quality scene extraction.
"""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "hero" / "athens-coder-loft-day.webp"
OUT = ROOT / "public" / "hero" / "layers"
WIDTH, HEIGHT = 1536, 1024
PHASES = ("dawn", "day", "goldenHour", "dusk", "night")

# Glass panes share one coordinate system. Mullions are gaps between polygons.
PANES = [
    [(278, 168), (544, 168), (544, 516), (278, 516)],
    [(553, 168), (690, 168), (690, 516), (553, 516)],
    [(699, 168), (839, 168), (839, 516), (699, 516)],
    [(848, 168), (981, 168), (981, 516), (848, 516)],
    [(990, 168), (1100, 168), (1100, 516), (990, 516)],
    [(1109, 168), (1202, 168), (1202, 516), (1109, 516)],
]

# One attached workstation group: lamps, monitors, desk, developer and chair.
FOREGROUND_POLYGONS = [
    [(368, 474), (1115, 474), (1130, 704), (1010, 718), (990, 654), (770, 650), (750, 875), (550, 895), (545, 690), (370, 688)],
    [(580, 440), (780, 440), (800, 690), (555, 690)],
    [(800, 420), (1055, 420), (1060, 690), (790, 690)],
    [(520, 535), (780, 535), (820, 905), (535, 915)],
    [(330, 455), (430, 455), (450, 630), (315, 640)],
    [(1060, 480), (1160, 480), (1180, 700), (1045, 700)],
]

LAYER_REGIONS = {
    "sky": [(260, 155), (1218, 155), (1218, 365), (260, 365)],
    "distant-terrain": [(260, 315), (1218, 315), (1218, 425), (260, 425)],
    "acropolis": [(535, 320), (830, 320), (830, 445), (535, 445)],
    "background-city": [(260, 365), (1218, 365), (1218, 515), (260, 515)],
    "near-buildings": [(260, 430), (1218, 430), (1218, 570), (260, 570)],
}


def polygon_mask(polygons, blur=0):
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon(polygon, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(blur)) if blur else mask


def window_mask():
    panes = polygon_mask(PANES)
    foreground = polygon_mask(FOREGROUND_POLYGONS, 2)
    return ImageChops.subtract(panes, foreground)


def grade(image, phase):
    if phase == "day":
        return image.copy()
    factors = {
        "dawn": ((96, 116, 150), 0.28, 0.78, 0.92),
        "goldenHour": ((236, 142, 65), 0.34, 1.05, 0.88),
        "dusk": ((57, 72, 112), 0.48, 0.76, 0.67),
        "night": ((19, 35, 58), 0.68, 0.62, 0.38),
    }
    tint, amount, saturation, brightness = factors[phase]
    base = ImageEnhance.Color(image).enhance(saturation)
    base = ImageEnhance.Brightness(base).enhance(brightness)
    overlay = Image.new("RGBA", image.size, (*tint, 255))
    graded = Image.blend(base.convert("RGBA"), overlay, amount)
    if phase in ("dawn", "goldenHour", "dusk"):
        glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        horizon = {"dawn": (255, 173, 132, 75), "goldenHour": (255, 146, 55, 95), "dusk": (226, 113, 88, 55)}[phase]
        gd.rectangle((0, 330, WIDTH, 520), fill=horizon)
        glow = glow.filter(ImageFilter.GaussianBlur(70))
        graded = Image.alpha_composite(graded, glow)
    if phase == "night":
        lights = Image.new("RGBA", image.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(lights)
        for x, y in ((320,445),(382,472),(456,438),(526,465),(615,430),(718,449),(806,474),(914,440),(1035,467),(1140,430)):
            ld.rectangle((x, y, x + 4, y + 3), fill=(255, 194, 104, 180))
        ld.ellipse((620, 350, 760, 410), fill=(255, 199, 112, 45))
        graded = Image.alpha_composite(graded, lights.filter(ImageFilter.GaussianBlur(2)))
    return graded


def save_layer(image, mask, path):
    layer = image.copy().convert("RGBA")
    layer.putalpha(mask)
    layer.save(path, "WEBP", quality=82, method=4)


def svg_masks():
    panes = "".join(f'<polygon points="{" ".join(f"{x},{y}" for x,y in p)}"/>' for p in PANES)
    blockers = "".join(f'<polygon points="{" ".join(f"{x},{y}" for x,y in p)}"/>' for p in FOREGROUND_POLYGONS)
    exterior = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}">
  <mask id="exterior"><g fill="white">{panes}</g><g fill="black">{blockers}</g></mask>
  <rect width="{WIDTH}" height="{HEIGHT}" fill="white" mask="url(#exterior)"/>
</svg>'''
    interior = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}">
  <mask id="interior"><rect width="{WIDTH}" height="{HEIGHT}" fill="white"/><g fill="black">{panes}</g><g fill="white">{blockers}</g></mask>
  <rect width="{WIDTH}" height="{HEIGHT}" fill="white" mask="url(#interior)"/>
</svg>'''
    (OUT / "exterior-window-mask.svg").write_text(exterior, encoding="utf-8")
    (OUT / "interior-occlusion-mask.svg").write_text(interior, encoding="utf-8")


def overlay_svgs():
    lighting = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}">
 <defs><radialGradient id="monitor"><stop stop-color="#89e9ff" stop-opacity=".28"/><stop offset="1" stop-color="#89e9ff" stop-opacity="0"/></radialGradient><radialGradient id="warm"><stop stop-color="#ffc06f" stop-opacity=".22"/><stop offset="1" stop-color="#ffc06f" stop-opacity="0"/></radialGradient></defs>
 <ellipse cx="750" cy="610" rx="310" ry="230" fill="url(#monitor)"/><ellipse cx="360" cy="235" rx="210" ry="230" fill="url(#warm)"/><ellipse cx="1280" cy="520" rx="230" ry="260" fill="url(#monitor)"/>
</svg>'''
    (OUT / "interior-lighting-overlay.svg").write_text(lighting, encoding="utf-8")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (WIDTH, HEIGHT):
        raise SystemExit(f"Canonical source must be {WIDTH}x{HEIGHT}; got {source.size}")
    windows = polygon_mask(PANES)
    exterior = window_mask()
    foreground = polygon_mask(FOREGROUND_POLYGONS, 1)
    shell = ImageChops.subtract(Image.new("L", (WIDTH, HEIGHT), 255), windows)
    # Window structure is an editable set of strips in the gaps between panes.
    frame_mask = Image.new("L", (WIDTH, HEIGHT), 0); fd = ImageDraw.Draw(frame_mask)
    fd.rectangle((270, 154, 1210, 168), fill=255); fd.rectangle((270, 516, 1210, 529), fill=255)
    for left, right in ((270, 278), (544, 553), (690, 699), (839, 848), (981, 990), (1100, 1109), (1202, 1210)):
        fd.rectangle((left, 145, right, 535), fill=255)
    save_layer(source, shell, OUT / "office-shell.webp")
    save_layer(source, foreground, OUT / "workstation-foreground.webp")
    save_layer(source, frame_mask, OUT / "window-frame.webp")
    for phase in PHASES:
        graded = grade(source, phase)
        for name, region in LAYER_REGIONS.items():
            region_mask = polygon_mask([region], 3)
            mask = ImageChops.multiply(exterior, region_mask)
            save_layer(graded, mask, OUT / f"{name}-{phase}.webp")
    svg_masks(); overlay_svgs()
    print(f"Generated {len(PHASES) * len(LAYER_REGIONS) + 5} aligned prototype assets in {OUT}")


if __name__ == "__main__":
    main()
