"""Render the layered Services and Indore illustrations as scroll-scrubbable video."""

import argparse
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


ASSETS = Path(__file__).resolve().parents[1] / "src" / "assets"
SOURCE = ASSETS / "source" / "backdrops"
FPS = 24

SCENES = (
    ("services", "roof", "coupe", "backdrop", 34),
    ("highlights", "street", "bike", "city", 149),
)

# Each pose is (background zoom, horizontal pan, subject height, x center,
# ground line). Coordinates and subject height are fractions of the frame.
CAMERA = {
    ("services", "desktop"): ((1.05, 0.42, 0.74, 0.53, 0.90), (1.17, 0.60, 0.85, 0.50, 0.97)),
    ("services", "portrait"): ((1.08, 0.46, 0.52, 0.49, 0.78), (1.20, 0.53, 0.60, 0.49, 0.82)),
    ("highlights", "desktop"): ((1.20, 0.64, 0.93, 0.58, 1.00), (1.03, 0.52, 0.60, 0.61, 0.83)),
    ("highlights", "portrait"): ((1.21, 0.56, 0.71, 0.46, 0.90), (1.02, 0.51, 0.44, 0.52, 0.77)),
}


def camera_frame(background, size, zoom, pan):
    width, height = size
    scale = max(width / background.width, height / background.height) * zoom
    crop_width, crop_height = width / scale, height / scale
    return background.transform(
        size,
        Image.Transform.AFFINE,
        (1 / scale, 0, (background.width - crop_width) * pan,
         0, 1 / scale, (background.height - crop_height) * 0.53),
        Image.Resampling.BICUBIC,
    )


def paint_contact(frame, layer, x, ground):
    width, height = frame.size
    shadow = Image.new("L", frame.size)
    pad = round(layer.width * 0.12)
    ImageDraw.Draw(shadow).ellipse(
        (x + pad, ground - 0.012 * height, x + layer.width - pad, ground + 0.021 * height),
        fill=166,
    )
    frame.paste("#180d24", (0, 0, width, height), shadow.filter(ImageFilter.GaussianBlur(height * 0.012)))

    depth = min(round(height * 0.085), max(0, height - ground))
    if depth:
        reflection = ImageOps.flip(layer.crop((0, max(0, layer.height - depth * 3), layer.width, layer.height)))
        reflection = reflection.resize((layer.width, depth), Image.Resampling.BILINEAR)
        fade = Image.linear_gradient("L").transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        fade = fade.resize(reflection.size).point(lambda value: round(value * 0.24))
        alpha = ImageChops.multiply(reflection.getchannel("A"), fade)
        frame.paste(reflection.filter(ImageFilter.GaussianBlur(1.8)), (x, ground), alpha)


def render_frame(background, subject, size, pose):
    zoom, pan, subject_height, center, line = pose
    frame = camera_frame(background, size, zoom, pan)
    height = round(size[1] * subject_height)
    width = round(subject.width * height / subject.height)
    layer = subject.resize((width, height), Image.Resampling.LANCZOS)
    x = round(size[0] * center - width / 2)
    ground = round(size[1] * line)
    paint_contact(frame, layer, x, ground)
    frame.paste(layer, (x, ground - height), layer)
    return frame


def encode(ffmpeg, destination, background, subject, size, frames, poses):
    initial, final = poses
    command = [
        ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
        "-pixel_format", "rgb24", "-video_size", f"{size[0]}x{size[1]}",
        "-framerate", str(FPS), "-i", "pipe:0", "-an", "-c:v", "libx264",
        "-pix_fmt", "yuv420p", "-profile:v", "high", "-preset", "medium",
        "-threads", "4", "-crf", "25", "-g", "1", "-movflags", "+faststart",
        str(destination),
    ]
    with subprocess.Popen(command, stdin=subprocess.PIPE) as encoder:
        for index in range(frames):
            progress = index / (frames - 1)
            eased = progress * progress * (3 - 2 * progress)
            pose = tuple(start + (end - start) * eased for start, end in zip(initial, final, strict=True))
            encoder.stdin.write(render_frame(background, subject, size, pose).tobytes())
        encoder.stdin.close()
        if encoder.wait():
            raise RuntimeError(f"Could not encode {destination.name}")


def export(ffmpeg, folder, background_name, subject_name, poster_name, frames):
    with Image.open(SOURCE / f"{background_name}.webp") as backdrop:
        background = backdrop.convert("RGB")
    with Image.open(SOURCE / f"{subject_name}.webp") as layer:
        subject = layer.convert("RGBA")
    subject = subject.crop(subject.getchannel("A").getbbox())
    target = ASSETS / "site" / folder

    with TemporaryDirectory(dir=target) as staging:
        stage = Path(staging)
        for orientation, size in (("desktop", (960, 540)), ("portrait", (540, 960))):
            video = stage / f"motion-{orientation}.mp4"
            encode(ffmpeg, video, background, subject, size, frames, CAMERA[folder, orientation])
            first = stage / "first.png"
            subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
                            "-i", str(video), "-frames:v", "1", str(first)], check=True)
            with Image.open(first) as poster:
                poster.save(stage / f"{poster_name}-{orientation}.avif", quality=86)
        for path in stage.iterdir():
            if path.suffix in {".avif", ".mp4"}:
                path.replace(target / path.name)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    args = parser.parse_args()
    for scene in SCENES:
        export(args.ffmpeg, *scene)
