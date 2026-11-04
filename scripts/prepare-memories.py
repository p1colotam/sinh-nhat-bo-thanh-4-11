"""Prepare the numbered family photos for the birthday album."""

from pathlib import Path
from PIL import Image, ImageOps


SOURCE = Path("D:/411/ảnh")
DESTINATION = Path(__file__).resolve().parents[1] / "public" / "media" / "memories"
FILENAMES = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6..jpg", "7..jpg",
    "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.png", "13.jpg",
    "14.jpg", "15.jpg", "16.jpg",
]


def main():
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for index, filename in enumerate(FILENAMES, start=1):
        with Image.open(SOURCE / filename) as original:
            photo = ImageOps.exif_transpose(original).convert("RGB")
            photo.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            output = DESTINATION / f"{index:02d}.webp"
            photo.save(output, "WEBP", quality=85, method=6)
            print(f"{index:02d}: {photo.width}x{photo.height}, {output.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
