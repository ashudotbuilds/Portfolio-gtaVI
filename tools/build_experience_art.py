"""Export the Work Experience illustrations as AVIF."""

from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE = ASSETS / "source" / "experience"
DESTINATION = ASSETS / "site" / "experience"


if __name__ == "__main__":
    DESTINATION.mkdir(exist_ok=True)
    for name in ("codeshor", "cstep"):
        with Image.open(SOURCE / f"{name}.webp") as artwork:
            artwork.convert("RGB").save(DESTINATION / f"{name}.avif", quality=79)
