"""Export the Services card artwork at its existing desktop and mobile crops."""

from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
SCENES = ASSETS / "source" / "scenes"
SERVICES = ASSETS / "site" / "services"


if __name__ == "__main__":
    with Image.open(SCENES / "site-glow-hotel-sign.png") as rescue:
        rescue = rescue.convert("RGB")
        rescue.crop((0, 0, 1641, 887)).save(SERVICES / "card-tall-desktop.avif", quality=82)
        rescue.crop((398, 0, 879, 887)).save(SERVICES / "card-tall-mobile.avif", quality=82)

    with Image.open(SCENES / "rooftop-full-stack.png") as builds:
        builds.convert("RGB").save(SERVICES / "card-short.avif", quality=82)
