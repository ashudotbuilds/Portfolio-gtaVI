"""Export the responsive Meet the Developer artwork as AVIF."""

from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE = ASSETS / "source" / "scenes"
DESTINATION = ASSETS / "site" / "meet-the-developer"


def main():
    for source, filename, max_size in (
        ("meet-indore-desktop.webp", "scene.avif", (1920, 1200)),
        ("meet-indore-portrait.webp", "scene-portrait.avif", (1080, 1920)),
    ):
        with Image.open(SOURCE / source) as master:
            image = master.convert("RGB")
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
            image.save(DESTINATION / filename, quality=77)


if __name__ == "__main__":
    main()
