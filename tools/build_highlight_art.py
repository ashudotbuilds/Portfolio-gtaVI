"""Export the four highlight illustrations to the AVIFs used by the site."""

from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
HIGHLIGHTS = ("remote-work", "dev-community", "tech-tambola", "movie-night")


if __name__ == "__main__":
    for highlight in HIGHLIGHTS:
        source = ASSETS / "source" / "banners" / f"{highlight}.png"
        target = ASSETS / "site" / "highlights" / f"{highlight}.avif"
        with Image.open(source) as artwork:
            artwork.convert("RGB").save(target, quality=80)
