# Jadila Survey — مولّد الأصول البصرية
# يعمل بـ:  cd py && uv sync && uv run python generate_assets.py
# الناتج:   ../assets/img/*.png + manifest.json
"""توليد صور flat/vector-like بـ Pillow فقط لتتناسب مع هوية الاستبيان."""
from __future__ import annotations
import json, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

NAVY, MAIN, LIGHT = (51, 73, 122), (74, 111, 165), (111, 143, 194)
WHITE = (255, 255, 255)
INK = (28, 39, 66)

SECTIONS = {
    "social":   {"c1": (51, 73, 122),  "c2": (111, 143, 194), "label": "social"},
    "env":      {"c1": (30, 122, 82),  "c2": (110, 200, 160), "label": "env"},
    "economy":  {"c1": (150, 105, 45), "c2": (225, 185, 120), "label": "economy"},
    "urban":    {"c1": (70, 85, 115),  "c2": (150, 165, 195), "label": "urban"},
    "culture":  {"c1": (110, 80, 140), "c2": (190, 160, 215), "label": "culture"},
    "priority": {"c1": (178, 80, 60),  "c2": (235, 160, 130), "label": "priority"},
}

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def v_gradient(w, h, c_top, c_bottom):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        c = lerp(c_top, c_bottom, y / max(h - 1, 1))
        for x in range(w):
            px[x, y] = c
    return img.convert("RGBA")

def soft_circle(base: Image, cx, cy, r, color, alpha=45):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    return Image.alpha_composite(base, layer)

def dots(base: Image, step=34, r=2, alpha=26):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for y in range(step // 2, base.height, step):
        for x in range(step // 2, base.width, step):
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, alpha))
    return Image.alpha_composite(base, layer)

def rounded_icon_canvas(size, c1, c2):
    img = v_gradient(size, size, c1, c2)
    img = soft_circle(img, size * 0.82, size * 0.15, size * 0.42, (255, 255, 255), 55)
    img = soft_circle(img, size * 0.12, size * 0.9, size * 0.36, (0, 0, 0), 38)
    img = dots(img)
    return img

def draw_social(d: ImageDraw.Draw, s: int):
    u = s / 256
    for cx, r, y in [(128, 30, 88), (78, 22, 100), (178, 22, 100)]:
        d.ellipse([cx - r, y - r, cx + r, y + r], fill=WHITE)
    for cx, w, top in [(128, 96, 128), (78, 70, 132), (178, 70, 132)]:
        d.rounded_rectangle([cx - w / 2, top, cx + w / 2, top + 62 * u + 30], radius=22, fill=WHITE)

def draw_env(d: ImageDraw.Draw, s: int):
    cx, cy = s // 2, s // 2 + 6
    leaf = [(cx - 66, cy + 34), (cx - 30, cy - 44), (cx + 8, cy - 78),
            (cx + 58, cy - 44), (cx + 62, cy + 20), (cx + 10, cy + 62),
            (cx - 40, cy + 62)]
    d.polygon(leaf, fill=WHITE)
    d.line([cx - 44, cy + 44, cx + 34, cy - 52], fill=(30, 122, 82), width=7)
    d.line([cx - 8, cy + 8, cx - 38, cy - 6], fill=(30, 122, 82), width=5)
    d.line([cx + 12, cy - 12, cx + 42, cy - 24], fill=(30, 122, 82), width=5)
    d.line([cx - 52, cy + 52, cx - 52, cy + 92], fill=WHITE, width=10)
    d.ellipse([cx + 30, cy + 46, cx + 78, cy + 94], fill=WHITE)

def draw_economy(d: ImageDraw.Draw, s: int):
    m = 48
    d.rounded_rectangle([m, 120, s - m, s - 48], radius=14, fill=WHITE)
    for i in range(6):
        x0 = m + i * (s - 2 * m) / 6
        d.rectangle([x0, 88, x0 + (s - 2 * m) / 12, 120], fill=WHITE)
        d.rectangle([x0 + (s - 2 * m) / 12, 88, x0 + (s - 2 * m) / 6, 120],
                    fill=(255, 255, 255, 110))
    d.rectangle([s / 2 - 22, 150, s / 2 + 22, s - 48], fill=(0, 0, 0, 60))
    d.ellipse([s / 2 + 52, 150, s / 2 + 84, 182], outline=(0, 0, 0, 70), width=6)

def draw_urban(d: ImageDraw.Draw, s: int):
    d.polygon([(s * .36, s - 40), (s * .64, s - 40), (s * .86, 60), (s * .14, 60)], fill=WHITE)
    for i, t in enumerate([0.15, 0.35, 0.55, 0.75]):
        y = 60 + (s - 100) * t
        w = 6 + 10 * t
        d.rectangle([s / 2 - w / 2, y, s / 2 + w / 2, y + 22 * t + 8], fill=(70, 85, 115))
    d.rectangle([28, 90, 66, 200], fill=WHITE)
    d.rectangle([s - 66, 90, s - 28, 200], fill=WHITE)

def draw_culture(d: ImageDraw.Draw, s: int):
    cx = s // 2
    d.pieslice([cx - 62, 66, cx + 62, 190], start=180, end=360, fill=WHITE)
    d.rectangle([cx - 62, 128, cx + 62, 200], fill=WHITE)
    d.rectangle([cx - 8, 44, cx + 8, 90], fill=WHITE)
    d.ellipse([cx - 14, 30, cx + 14, 58], outline=WHITE, width=6)
    d.rectangle([52, 100, 72, 200], fill=WHITE)
    d.rectangle([s - 72, 100, s - 52, 200], fill=WHITE)
    d.ellipse([48, 84, 76, 112], fill=WHITE)
    d.ellipse([s - 76, 84, s - 48, 112], fill=WHITE)

def draw_priority(d: ImageDraw.Draw, s: int):
    cx = cy = s // 2
    for r, fill in [(78, WHITE), (56, (178, 80, 60)), (34, WHITE)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)
    d.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=(178, 80, 60))

ICON_DRAWERS = {
    "social": draw_social, "env": draw_env, "economy": draw_economy,
    "urban": draw_urban, "culture": draw_culture, "priority": draw_priority,
}

def make_section_icon(key: str, size=512):
    c1, c2 = SECTIONS[key]["c1"], SECTIONS[key]["c2"]
    img = rounded_icon_canvas(size, c1, c2)
    d = ImageDraw.Draw(img)
    ICON_DRAWERS[key](d, size)
    img = img.filter(ImageFilter.SmoothMore) if hasattr(ImageFilter, "SmoothMore") else img
    return img.convert("RGB")

def make_hero(w=1600, h=560):
    img = v_gradient(w, h, NAVY, MAIN)
    img = soft_circle(img, int(w * 0.12), int(h * 0.1), 260, (255, 255, 255), 34)
    img = soft_circle(img, int(w * 0.88), int(h * 0.95), 300, (255, 255, 255), 30)
    img = soft_circle(img, int(w * 0.72), int(h * 0.2), 130, (255, 255, 255), 46)
    img = soft_circle(img, int(w * 0.3), int(h * 0.85), 170, (0, 0, 0), 40)
    img = dots(img, step=40, r=2, alpha=30)
    d = ImageDraw.Draw(img)
    for i in range(5):
        y = h - 26 - i * 9
        d.line([40, y, 220 - i * 22, y], fill=(255, 255, 255, 60 - i * 8), width=3)
    return img.convert("RGB")

def make_success(size=512):
    img = v_gradient(size, size, (21, 128, 61), (75, 180, 120))
    img = soft_circle(img, size // 2, size // 2, size // 2 - 24, (255, 255, 255), 40)
    d = ImageDraw.Draw(img)
    r = 120
    cx = cy = size // 2
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE)
    d.line([cx - 58, cy + 2, cx - 14, cy + 48], fill=(21, 128, 61), width=26, joint="curve")
    d.line([cx - 14, cy + 48, cx + 62, cy - 48], fill=(21, 128, 61), width=26, joint="curve")
    return img.convert("RGB")

def make_og(w=1200, h=630):
    img = v_gradient(w, h, NAVY, LIGHT)
    img = soft_circle(img, 1020, 120, 260, (255, 255, 255), 40)
    img = soft_circle(img, 140, 540, 220, (0, 0, 0), 40)
    img = dots(img, step=44, r=3, alpha=34)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([80, 150, 560, 480], radius=36, fill=WHITE)
    for i, wd in enumerate([380, 340, 260]):
        d.rounded_rectangle([120, 220 + i * 62, 120 + wd, 248 + i * 62], radius=14,
                            fill=(51, 73, 122) if i == 0 else (200, 212, 232))
    icon = make_section_icon("social", 300)
    mask = Image.new("L", (300, 300), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 300, 300], radius=72, fill=255)
    img.paste(icon, (760, 165), mask)
    return img.convert("RGB")

def main():
    manifest = {"files": []}
    hero = make_hero(); hero.save(OUT / "hero-bg.png", optimize=True); manifest["files"].append("hero-bg.png")
    og = make_og(); og.save(OUT / "og-cover.png", optimize=True); manifest["files"].append("og-cover.png")
    ok = make_success(); ok.save(OUT / "success.png", optimize=True); manifest["files"].append("success.png")
    for key in SECTIONS:
        im = make_section_icon(key)
        name = f"sec-{key}.png"
        im.save(OUT / name, optimize=True)
        manifest["files"].append(name)
        small = im.resize((128, 128), Image.LANCZOS)
        small.save(OUT / name.replace("sec-", "icon-"), optimize=True)
        manifest["files"].append(name.replace("sec-", "icon-"))
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum((OUT / f).stat().st_size for f in manifest["files"]) / 1024
    print(f"OK: {len(manifest['files'])} files -> {OUT} ({total:.0f} KB)")

if __name__ == "__main__":
    main()
