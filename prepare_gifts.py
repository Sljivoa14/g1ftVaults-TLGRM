
from pathlib import Path

from PIL import Image
from rembg import remove

RAW = Path("gifts_raw")
OUT = Path("gifts")
MAX_SIZE = 512  # longest side in pixels, keeps the files small and fast

OUT.mkdir(exist_ok=True)

if not RAW.exists():
    RAW.mkdir()
    print("Created gifts_raw/. Put your images in it and run this again.")
    raise SystemExit

files = sorted(p for p in RAW.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"))

if not files:
    print("No images found in gifts_raw/")
    raise SystemExit

for path in files:
    print("Processing", path.name)

    img = Image.open(path).convert("RGBA")
    cut = remove(img)  # background removed, transparent PNG-style image

    # trim the empty transparent border so the character fills the image
    bbox = cut.split()[-1].getbbox()
    if bbox:
        cut = cut.crop(bbox)

    cut.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

    out_path = OUT / (path.stem.lower() + ".webp")
    cut.save(out_path, "WEBP", quality=90, method=6)
    print("  saved", out_path, cut.size)

print("Done. Commit and push the gifts folder.")