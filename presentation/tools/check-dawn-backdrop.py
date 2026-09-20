#!/usr/bin/env python3
"""Assert backdrop-dawn.jpg has no lantern or pumpkin-eye glow left.

The autumn leaves on the path are warm too and must survive, so the check only
looks above the leaf line and inside the regions the generator claims to clear.
"""
import pathlib, sys
import cv2
import numpy as np

HERE = pathlib.Path(__file__).resolve().parent.parent
LEAF_LINE = 800  # below this y the warm pixels are fallen leaves, which stay
CLEARED = {  # padded a little past what the generator masks
    'eye-far-left':     (16, 690, 88, 742),
    'eye-path':         (380, 660, 460, 708),
    'eye-mid-right':    (1170, 680, 1232, 725),
    'eye-pumpkin':      (1388, 762, 1518, 830),
    'eye-far-right':    (1688, 688, 1782, 742),
    'lantern-hanging':  (18, 88, 140, 234),
    'lantern-main':     (586, 574, 756, LEAF_LINE),  # below LEAF_LINE the clone brought in leaves
}

img = cv2.cvtColor(cv2.imread(str(HERE / 'images/frontmania/backdrop-dawn.jpg')), cv2.COLOR_BGR2RGB).astype(int)
warm = ((img[..., 0] - img[..., 2] > 55) & (img[..., 0] > 110)).astype(np.uint8)

fails = []
for name, (x0, y0, x1, y1) in CLEARED.items():
    left = int(warm[y0:y1, x0:x1].sum())
    print(f'  {name:18s} warm px = {left}')
    if left:
        fails.append(f'{name}: {left} warm px remain')

n, _, stats, _ = cv2.connectedComponentsWithStats(warm, 8)
strays = [(int(s[4]), int(s[0]), int(s[1])) for s in stats[1:] if s[4] >= 20 and s[1] + s[3] < LEAF_LINE]
known = {(35, 1237, 292), (22, 1420, 331)}  # lit castle windows, deliberately kept
for area, x, y in strays:
    if (area, x, y) not in known:
        fails.append(f'unexpected glow: area={area} at x={x} y={y}')

print('\n'.join(fails) if fails else 'backdrop-dawn.jpg clean')
sys.exit(1 if fails else 0)
