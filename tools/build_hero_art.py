"""Rebuild the desktop and mobile homepage AVIFs from the hero source art."""

from base64 import b64encode
from html import escape
from io import BytesIO
from pathlib import Path
from shutil import copyfile
from tempfile import TemporaryDirectory

from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
SOURCE = ASSETS / "source" / "hero-illustrations"
MASKS = ASSETS / "source" / "hero-masks"
OUTPUT = ASSETS / "site" / "hero"
FRAME = "#25172d"

# Each entry gives the illustration and its crop anchor for that numbered mask.
DESKTOP = (
    ("coffee", (0.5, 0.28)),
    ("builder", (0.5, 0.09)),
    ("rooftop", (0.5, 0.12)),
    ("city", (0.5, 0.5)),
    ("sketches", (0.5, 0.5)),
    ("systems", (0.5, 0.5)),
    ("keyboard", (0.5, 0.5)),
    ("motorbike", (0.5, 0.5)),
    ("coupe", (0.5, 0.5)),
    ("skyline", (0.5, 0.58)),
)
MOBILE = (
    ("coupe", (0.5, 0.5)),
    ("builder", (0.5, 0.08)),
    ("city", (0.5, 0.5)),
    ("coffee", (0.5, 0.28)),
    ("rooftop", (0.5, 0.18)),
    ("skyline", (0.5, 0.58)),
    ("keyboard", (0.5, 0.5)),
    ("sketches", (0.5, 0.5)),
    ("systems", (0.5, 0.5)),
    ("motorbike", (0.5, 0.5)),
)


def render_collage(device, slots, canvas_size, poster_size, destination):
    canvas = Image.new("RGBA", canvas_size, FRAME)
    for number, (name, anchor) in enumerate(slots, start=1):
        stem = f"shard-{number:02}"
        with Image.open(MASKS / device / f"{stem}.png") as mask_file:
            mask = mask_file.convert("L")
        if mask.size != canvas_size:
            raise ValueError(f"Unexpected canvas size for {device}/{stem}: {mask.size}")

        left, top, right, bottom = mask.getbbox()
        size = (right - left, bottom - top)
        with Image.open(SOURCE / f"{name}.webp") as art:
            panel = ImageOps.fit(art.convert("RGB"), size, Image.Resampling.LANCZOS, centering=anchor)
        panel.putalpha(mask.crop((left, top, right, bottom)))

        layer = Image.new("RGBA", canvas_size)
        layer.paste(panel, (left, top))
        layer.save(destination / f"{stem}.avif", quality=78)
        canvas.alpha_composite(panel, (left, top))

    poster = canvas.convert("RGB").resize(poster_size, Image.Resampling.LANCZOS)
    poster.save(destination / "poster.avif", quality=84)


def render_logos(browser, canvas_size, destination, mobile):
    width, height = canvas_size
    mark = b64encode((ROOT / "public" / "favicon.svg").read_bytes()).decode()
    font = b64encode((ASSETS / "fonts" / "barlow-condensed-900.woff2").read_bytes()).decode()
    name = escape("Ashutosh Singh")
    mark_width = 36 if mobile else 28
    name_size = 11.5 if mobile else 8.3
    page = browser.new_page(viewport={"width": width, "height": height})
    try:
        page.set_content(f"""
          <style>
            @font-face {{
              font-family: Barlow;
              src: url(data:font/woff2;base64,{font}) format('woff2');
              font-weight: 900;
            }}
            body {{ margin: 0; }}
            .layer {{ position: absolute; inset: 0; display: grid; place-items: center; }}
            .mark img {{
              width: {mark_width}vw;
              transform: translateY(-50%);
              filter: drop-shadow(0 .7vw 1.2vw #16091d99);
              opacity: .8;
            }}
            .name span {{
              width: min-content;
              transform: translateY(40%);
              color: #fff4f4;
              font: 900 {name_size}vw/.87 Barlow;
              letter-spacing: -.015em;
              text-align: center;
              text-transform: uppercase;
              text-shadow: 0 .08em .15em #16091d, 0 0 .45em #16091d;
            }}
          </style>
          <div class="layer mark"><img src="data:image/svg+xml;base64,{mark}" alt=""></div>
          <div class="layer name"><span>{name}</span></div>
        """)
        page.evaluate("document.fonts.ready")
        layers = []
        for selector, hidden, filename in (
            (".mark", ".name", "logo-vi.avif"),
            (".name", ".mark", "logo-gta.avif"),
        ):
            page.locator(selector).evaluate("(element) => element.style.visibility = 'visible'")
            page.locator(hidden).evaluate("(element) => element.style.visibility = 'hidden'")
            with Image.open(BytesIO(page.screenshot(omit_background=True))) as png:
                layer = png.convert("RGBA")
            layer.save(destination / filename, quality=90)
            layers.append(layer)
        Image.alpha_composite(*layers).save(destination / "poster-logo.avif", quality=90)
    finally:
        page.close()


def main():
    layouts = (
        ("desktop", DESKTOP, (2560, 1440), (2560, 1440)),
        ("mobile", MOBILE, (1366, 1366), (640, 640)),
    )
    with TemporaryDirectory() as staging, sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        for device, slots, canvas_size, poster_size in layouts:
            destination = Path(staging) / device
            destination.mkdir()
            render_collage(device, slots, canvas_size, poster_size, destination)
            render_logos(browser, canvas_size, destination, mobile=device == "mobile")
        browser.close()

        for device, *_ in layouts:
            for file in (Path(staging) / device).glob("*.avif"):
                copyfile(file, OUTPUT / device / file.name)


if __name__ == "__main__":
    main()
