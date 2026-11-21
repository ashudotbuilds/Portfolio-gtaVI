"""Export the supplied blog covers to the site's AVIF card format."""

from pathlib import Path

from PIL import Image, ImageOps


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
COVERS = (
    "in-love-with-the-machine-not-the-race",
    "are-certificates-dead",
    "understanding-large-language-models-llms",
)


if __name__ == "__main__":
    for index, cover in enumerate(COVERS, start=1):
        source = ASSETS / "source" / "blog" / f"{cover}.png"
        destination = ASSETS / "site" / "blog" / f"post-{index}.avif"
        with Image.open(source) as artwork:
            image = ImageOps.fit(artwork.convert("RGB"), (1672, 941), Image.Resampling.LANCZOS)
            image.save(destination, quality=80)
