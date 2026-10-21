"""Draws Pip the owl and writes every icon and splash asset Expo needs.

Run from the project root:  python3 scripts/generate-assets.py
Everything is drawn at 4x and downsampled, so edges stay smooth.
"""

import math
from pathlib import Path

from PIL import Image, ImageDraw

ASSETS = Path(__file__).resolve().parent.parent / "assets"
SS = 4  # supersampling factor

FOREST = (31, 111, 80)
FOREST_LIGHT = (46, 139, 98)
FOREST_DARK = (19, 74, 53)
MEADOW = (234, 247, 228)

OWL = {
    "body": (160, 103, 58),
    "wing": (122, 74, 40),
    "belly": (243, 217, 164),
    "face": (246, 231, 200),
    "eye": (255, 255, 255),
    "pupil": (29, 43, 36),
    "shine": (255, 255, 255),
    "beak": (242, 169, 0),
    "feet": (242, 169, 0),
    "leaf": (123, 198, 126),
    "stem": (31, 111, 80),
}

# Monochrome (Android themed icon): white silhouette, eye whites cut out.
WHITE = (255, 255, 255, 255)
CLEAR = (0, 0, 0, 0)
MONO = {k: WHITE for k in OWL} | {"eye": CLEAR, "shine": CLEAR}


def draw_owl(img, cx, cy, h, palette=OWL):
    """Draws the owl centred at (cx, cy) with total height h (leaf tip to feet)."""
    d = ImageDraw.Draw(img)
    u = h  # one unit = owl height

    def P(x, y):
        return (cx + x * u, cy + y * u)

    def ellipse(x, y, w, hh, color):
        d.ellipse([P(x - w / 2, y - hh / 2), P(x + w / 2, y + hh / 2)], fill=color)

    def poly(points, color):
        d.polygon([P(x, y) for x, y in points], fill=color)

    # Leaf sprout on the head: a pointed leaf traced along its midrib.
    d.line([P(0, -0.34), P(0.02, -0.44)], fill=palette["stem"], width=int(0.025 * u))
    base, tip = (0.02, -0.44), (0.21, -0.5)
    dx, dy = tip[0] - base[0], tip[1] - base[1]
    nx, ny = -dy, dx  # perpendicular to the midrib
    steps = 24
    side = [math.sin(math.pi * i / steps) * 0.32 for i in range(steps + 1)]
    upper = [(base[0] + dx * i / steps + nx * w, base[1] + dy * i / steps + ny * w) for i, w in enumerate(side)]
    lower = [(base[0] + dx * i / steps - nx * w, base[1] + dy * i / steps - ny * w) for i, w in enumerate(side)]
    poly(upper + lower[::-1], palette["leaf"])

    # Ear tufts.
    poly([(-0.33, -0.2), (-0.3, -0.42), (-0.12, -0.3)], palette["body"])
    poly([(0.33, -0.2), (0.3, -0.42), (0.12, -0.3)], palette["body"])

    # Wings behind the body, body, belly.
    ellipse(-0.33, 0.12, 0.2, 0.46, palette["wing"])
    ellipse(0.33, 0.12, 0.2, 0.46, palette["wing"])
    ellipse(0, 0.05, 0.7, 0.78, palette["body"])
    ellipse(0, 0.2, 0.42, 0.42, palette["belly"])

    # Belly feather marks.
    for x, y in [(-0.08, 0.16), (0.08, 0.16), (0, 0.25), (-0.1, 0.3), (0.1, 0.3)]:
        d.arc([P(x - 0.045, y - 0.03), P(x + 0.045, y + 0.03)], 20, 160, fill=palette["wing"], width=int(0.014 * u))

    # Face disc and eyes.
    ellipse(-0.14, -0.1, 0.32, 0.3, palette["face"])
    ellipse(0.14, -0.1, 0.32, 0.3, palette["face"])
    ellipse(-0.14, -0.1, 0.24, 0.24, palette["eye"])
    ellipse(0.14, -0.1, 0.24, 0.24, palette["eye"])
    ellipse(-0.12, -0.08, 0.13, 0.13, palette["pupil"])
    ellipse(0.12, -0.08, 0.13, 0.13, palette["pupil"])
    ellipse(-0.1, -0.11, 0.045, 0.045, palette["shine"])
    ellipse(0.14, -0.11, 0.045, 0.045, palette["shine"])

    # Beak and feet.
    poly([(-0.05, 0.0), (0.05, 0.0), (0, 0.09)], palette["beak"])
    ellipse(-0.11, 0.44, 0.13, 0.06, palette["feet"])
    ellipse(0.11, 0.44, 0.13, 0.06, palette["feet"])


def vertical_gradient(size, top, bottom):
    img = Image.new("RGBA", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)) + (255,))
    return img


def glow(img, cx, cy, r, color, alpha):
    layer = Image.new("RGBA", img.size, CLEAR)
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    return Image.alpha_composite(img, layer)


def save(img, name, size):
    out = img.resize((size, size), Image.LANCZOS)
    out.save(ASSETS / name)
    print(f"wrote assets/{name} ({size}x{size})")


def background(size):
    bg = vertical_gradient(size, FOREST_LIGHT, FOREST_DARK)
    return glow(bg, size / 2, size * 0.52, size * 0.36, (123, 198, 126), 70)


def main():
    n = 1024 * SS

    # iOS / universal icon: opaque, full bleed, no rounded corners (the OS masks it).
    icon = background(n)
    draw_owl(icon, n / 2, n * 0.54, n * 0.74)
    save(icon.convert("RGB"), "icon.png", 1024)

    # Android adaptive icon: the foreground must sit inside the central 66% safe zone.
    fg = Image.new("RGBA", (n, n), CLEAR)
    draw_owl(fg, n / 2, n * 0.53, n * 0.5)
    save(fg, "android-icon-foreground.png", 1024)
    save(background(n), "android-icon-background.png", 1024)

    mono = Image.new("RGBA", (n, n), CLEAR)
    draw_owl(mono, n / 2, n * 0.53, n * 0.5, MONO)
    save(mono, "android-icon-monochrome.png", 1024)

    # Splash: transparent owl, the background colour comes from the splash-screen plugin.
    splash = Image.new("RGBA", (n, n), CLEAR)
    draw_owl(splash, n / 2, n * 0.54, n * 0.86)
    save(splash, "splash-icon.png", 1024)

    favicon = background(n)
    draw_owl(favicon, n / 2, n * 0.54, n * 0.8)
    save(favicon.convert("RGB"), "favicon.png", 48)


if __name__ == "__main__":
    main()
