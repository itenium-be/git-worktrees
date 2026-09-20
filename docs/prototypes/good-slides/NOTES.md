# "and life was good" mood bake-off — PROTOTYPE (throwaway)

**Question:** slides 4 and 6 say *life was good*, but they inherit the FrontMania Halloween backdrop, which says the opposite. Which direction sells "good"?

**How to view:** open `prototypes/good-slides/index.html` in a browser. Bottom bar (or keys `1`–`5`) switches variant; `←`/`→` (or click) toggles between slide 4 and slide 6.

Each variant renders **both** slides at the real 1920×1080 geometry with the real FrontMania speaker bar and badge, so the pair is judged together.

| Key | Variant             | Where the mood lives                                                    | Card    | New asset          |
| --- | ------------------- | ----------------------------------------------------------------------- | ------- | ------------------ |
| A   | Dawn                | Same castle, warmed into sunrise: sun, rays, birds, cream card           | kept    | `backdrop-dawn.jpg` |
| B   | Cozy night          | Still night, but the lantern blooms and fireflies drift; amber-on-brown  | kept    | no                 |
| C   | Sunny flat          | Photo dropped: pastel sky, green hills, the same castle with flags up    | dropped | no                 |
| D   | Spotlight           | World blurred to near-black, warm glow, gold type, sparks rising         | dropped | no                 |
| E   | Happy terminal      | The tool, not the landscape: all-green terminal, tests passing, clean tree | replaced | no                 |

## The constraint that shaped these

`fm-card` covers **94.8% × 78.7%** of the slide (`layouts/fm-content.vue`). Only a ~175px band at the top and thin side strips of backdrop are ever visible. Backdrop-only treatments therefore barely register — A and B carry the mood in the card, and C/D/E remove or replace the card so the treatment has room.

## The dawn backdrop

A uses `images/frontmania/backdrop-dawn.jpg`, built by `tools/make-dawn-backdrop.py` from the
original with both lanterns and all five pairs of glowing pumpkin eyes removed. The autumn
leaves and the lit castle windows are kept. `tools/check-dawn-backdrop.py` asserts it.

Still in the frame, not asked about: the bats, the smoke ghosts, and the bare trees.

## Deviations to notice when judging

- **A and C** lighten the top band enough that the white `fm-speaker` text needs recolouring to dark ink. Both do it; check it still reads as FrontMania chrome.
- **C** abandons conference branding apart from the badge. Biggest tonal cut, biggest laugh, furthest off-template.
- **E** is the only variant continuous with the deck's own visual language (`Terminal` on slides 3/5/7) — the "good" slides become a calm green terminal between two busy ones.

## Verdict

**A (Dawn).** Folded into the deck as `dawn: true` on `fm-content`; slides 4 and 6 carry it.
The other four stay here only until someone wants the comparison again — then this dir goes.
