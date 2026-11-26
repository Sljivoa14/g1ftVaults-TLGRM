"""
GiftVault image prep: cuts the background off your AI images and makes
small transparent WebP files the app can float.

Folder layout (all inside your giftvault folder):
    gifts_raw/   <- your original images: panda.jpg, fox.jpg, ...
    gifts/       <- the cut-out .webp files appear here

Run it by pressing the play button, or:
    python prepare_gifts.py
"""
from pathlib import Path

from PIL import Image
from rembg import new_session, remove


MODEL = "isnet-general-use"

HERE = Path(__file__).parent          # the folder this script lives in
RAW = HERE / "gifts_raw"
OUT = HERE / "gifts"
MAX_SIZE = 512                        # longest side of the final image

OUT.mkdir(exist_ok=True)

if not RAW.exists():
    RAW.mkdir()
    print("Created gifts_raw/. Put your images in it and run this again.")
    raise SystemExit

files = sorted(p for p in RAW.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"))

if not files:
    print("No images found in gifts_raw/")
    raise SystemExit

session = new_session(MODEL)

for path in files:
    print("Processing", path.name)

    img = Image.open(path).convert("RGBA")
    img.thumbnail((768, 768), Image.LANCZOS)     # smaller input = less memory

    cut = remove(img, session=session)           # background removed

    # trim the empty transparent border so the character fills the image
    bbox = cut.split()[-1].getbbox()
    if bbox:
        cut = cut.crop(bbox)

    cut.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

    out_path = OUT / (path.stem.lower() + ".webp")
    cut.save(out_path, "WEBP", quality=90, method=6)
    print("  saved", out_path.name, cut.size)

print("Done. Commit and push the gifts folder.")