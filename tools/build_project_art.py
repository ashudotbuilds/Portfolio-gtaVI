"""Export the project poster masters to the AVIFs used by the site."""

from pathlib import Path

from PIL import Image, ImageOps


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
PROJECTS = ("monster-app", "book-my-ticket", "portfolio-website")


if __name__ == "__main__":
    for project in PROJECTS:
        source = ASSETS / "source" / "projects" / f"{project}.png"
        target = ASSETS / "site" / "meet-the-developer" / f"{project}.avif"
        with Image.open(source) as poster:
            poster.convert("RGB").save(target, quality=80)

    source = ASSETS / "source" / "banners" / "project-showcase.png"
    output = ASSETS / "site" / "meet-the-developer"
    with Image.open(source) as artwork:
        artwork = artwork.convert("RGB")
        desktop_width = min(1600, artwork.width, int(artwork.height * 2.5))
        mobile_height = min(900, artwork.height)
        desktop = ImageOps.fit(
            artwork, (desktop_width, round(desktop_width / 2.5)), Image.Resampling.LANCZOS
        )
        mobile = ImageOps.fit(
            artwork,
            (round(mobile_height * 0.8), mobile_height),
            Image.Resampling.LANCZOS,
            centering=(0.77, 0.5),
        )
        desktop.save(output / "project-showcase-desktop.avif", quality=80)
        mobile.save(output / "project-showcase-mobile.avif", quality=80)
