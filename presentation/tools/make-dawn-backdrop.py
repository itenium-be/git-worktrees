#!/usr/bin/env python3
"""Strip the lanterns and glowing pumpkin eyes out of the FrontMania backdrop.

Produces images/frontmania/backdrop-dawn.jpg, the asset the "life was good"
slides use. Rerun after any change to images/frontmania/backdrop.jpg.
"""
import pathlib, sys
import cv2
import numpy as np

HERE = pathlib.Path(__file__).resolve().parent.parent
SRC = HERE / 'images/frontmania/backdrop.jpg'
DST = HERE / 'images/frontmania/backdrop-dawn.jpg'

# Small, high-contrast spots that diffusion inpainting fills without visible smearing.
EYES = {
    'eye-far-left':  (26, 700, 78, 732),
    'eye-path':      (390, 670, 450, 698),
    'eye-mid-right': (1180, 690, 1222, 715),
    'eye-pumpkin':   (1398, 772, 1508, 820),
    'eye-far-right': (1698, 698, 1772, 732),
}
# The hanging lantern needs a mask well wider than the lantern itself: masking only the
# glass leaves the surrounding halo behind as a pink bar.
HANGING = (28, 98, 130, 224)
# The foreground lantern is far too large for inpainting at any mask size — it fans a cone
# of its own glow across the path. It gets clean terrain cloned over it instead.
LANTERN = (586, 574, 756, 892)
CLONE_DX = 270  # same y, far enough right to clear the lantern's own light pool


def main() -> int:
    img = cv2.imread(str(SRC))
    if img is None:
        print(f'cannot read {SRC}', file=sys.stderr)
        return 1
    h, w = img.shape[:2]

    def erase(src, boxes, grow, radius):
        mask = np.zeros((h, w), np.uint8)
        for x0, y0, x1, y1 in boxes:
            mask[y0:y1, x0:x1] = 255
        mask = cv2.dilate(mask, np.ones((grow, grow), np.uint8))
        return cv2.inpaint(src, mask, radius, cv2.INPAINT_TELEA)

    out = erase(img, EYES.values(), 9, 10)
    out = erase(out, [HANGING], 15, 14)

    lx0, ly0, lx1, ly1 = LANTERN
    pw, ph = lx1 - lx0, ly1 - ly0
    patch = out[ly0:ly1, lx0 + CLONE_DX:lx0 + CLONE_DX + pw].copy()

    # Feathered so Poisson blending has a soft seam to match colour across.
    pmask = np.zeros((ph, pw), np.uint8)
    cv2.rectangle(pmask, (6, 6), (pw - 7, ph - 7), 255, -1)
    pmask = np.where(cv2.GaussianBlur(pmask, (31, 31), 0) > 40, 255, 0).astype(np.uint8)

    out = cv2.seamlessClone(patch, out, pmask, ((lx0 + lx1) // 2, (ly0 + ly1) // 2), cv2.NORMAL_CLONE)

    cv2.imwrite(str(DST), out, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(f'wrote {DST.relative_to(HERE)}  {w}x{h}  {DST.stat().st_size // 1024} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
