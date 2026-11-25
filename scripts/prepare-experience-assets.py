"""Prepare registered Experience assets from the supplied, already-lit handoff.

Requires the existing Pillow/numpy tooling, not application dependencies.
Run from the repository root with the extracted handoff directory as argument.
The original plates remain authoritative; generated overlays only attenuate light.
"""
import hashlib
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

source = Path(sys.argv[1])
target = Path("public/environments/floor-01-experience")
target.mkdir(parents=True, exist_ok=True)
report = {"method": "Same-pixel attenuation of baked illumination; not physical OFF reconstruction", "profiles": {}}

# Coordinates belong to each native plate, never to a viewport or another profile.
profiles = {
    "desktop": ("backgrounds/desktop/desktop-candidate-a.png", (220, 236, 30, 45), (1170, 162, 152, 18), (220, 894, 120, 44), (1170, 892, 190, 42)),
    "tablet": ("backgrounds/tablet/tablet-environment.png", (186, 251, 27, 44), (1034, 163, 139, 18), (184, 974, 100, 74), (1020, 966, 177, 74)),
    "mobile": ("backgrounds/mobile/mobile-environment.png", (156, 287, 25, 43), (682, 228, 116, 18), (155, 1450, 80, 170), (663, 1440, 140, 150)),
}

for profile, (filename, wall, ceiling, wall_reflection, ceiling_reflection) in profiles.items():
    original = Image.open(source / filename).convert("RGB")
    base_path = target / f"floor-01-experience-wall-base-{profile}.webp"
    original.save(base_path, quality=90, method=6)
    # Derive from decoded deployment pixels, avoiding compression differences on dim.
    base = Image.open(base_path).convert("RGB")
    pixels = np.asarray(base, dtype=np.float32)
    height, width = pixels.shape[:2]
    yy, xx = np.mgrid[:height, :width]
    warm = np.clip((pixels[:, :, 0] - pixels[:, :, 2] * 1.12) / 80, 0, 1)

    def ellipse(cx, cy, rx, ry):
        distance = ((xx-cx)/rx)**2 + ((yy-cy)/ry)**2
        return np.maximum(0, 1-distance)**2

    assets = []
    for channel, emitter, reflection in [("wall", wall, wall_reflection), ("ceiling", ceiling, ceiling_reflection)]:
        cx, cy, rx, ry = emitter
        emission = ellipse(cx, cy, rx * 1.2, ry * 1.2) * .93
        spill = ellipse(cx, cy + ry, rx * (4.5 if channel == "wall" else 1.2), ry * (4 if channel == "wall" else 10)) * warm * .38
        reflected = ellipse(*reflection) * warm * .48
        # Keep emitter out of the surface pass so attenuation does not double there.
        spill = np.maximum(spill, reflected) * (1 - np.clip(emission / .93, 0, 1))
        for kind, amount in [("emission", emission), ("spill", spill)]:
            # Transparent black attenuates the existing pixels without adding geometry.
            alpha = Image.fromarray(np.uint8(np.clip(amount, 0, 1) * 255))
            bbox = alpha.getbbox()
            patch = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            patch.putalpha(alpha)
            name = f"floor-01-experience-{channel}-{kind}-{profile}.png"
            patch.crop(bbox).save(target / name, optimize=True)
            assets.append({"channel": channel, "kind": kind, "file": name, "bounds": list(bbox), "canvas": [width, height]})

    # Quiet, low-contrast wall texture, mirrored to make both tile edges continuous.
    crop = base.crop((int(width*.40), int(height*.40), int(width*.62), int(height*.62)))
    crop = crop.resize((192, 192), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(2))
    crop = ImageEnhance.Contrast(crop).enhance(.45)
    crop = ImageEnhance.Brightness(crop).enhance(.65)
    tile = Image.new("RGB", (384, 384))
    tile.paste(crop, (0, 0)); tile.paste(ImageOps.mirror(crop), (192, 0))
    tile.paste(ImageOps.flip(crop), (0, 192)); tile.paste(ImageOps.flip(ImageOps.mirror(crop)), (192, 192))
    tile.save(target / f"floor-01-experience-wall-continuation-{profile}.webp", quality=85, method=6)
    report["profiles"][profile] = {"source": filename, "source_sha256": hashlib.sha256((source / filename).read_bytes()).hexdigest(), "dimensions": [width, height], "passes": assets}

report["exports"] = [{"file": p.name, "bytes": p.stat().st_size, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(target.iterdir()) if p.suffix in (".webp", ".png")]
(target / "manifest.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
runtime = {profile: {"dimensions": data["dimensions"], "passes": data["passes"]} for profile, data in report["profiles"].items()}
Path("src/config/experienceEnvironment.json").write_text(json.dumps(runtime, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
