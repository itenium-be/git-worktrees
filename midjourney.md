Midjourney prompts
==================

Cover art for the three decks on [dev.itenium.be/Presentations](https://dev.itenium.be/Presentations/).
Every fenced block below is one prompt, submitted as-is by the `midjourney-submit` skill.

Art direction follows the site's cover style guide (`presentation/theme/MigrationSkill.md`) and
the existing covers (MicroServices, UnitTesting, ntier-onion-hex): one central emblem, glowing
orange and gold on a near-black ground, geometric, faint grunge texture, portrait 2:3.
The three are a series, so pick one look and append `--sref <winning image URL> --sw 100` to the
other two.

| Deck              | Saved as                                         |
|-------------------|--------------------------------------------------|
| `slides.md`       | `presentation/images/cover-art.jpg`              |
| `guardrails.md`   | `presentation/images/cover-art-guardrails.jpg`   |
| `dark-factory.md` | `presentation/images/cover-art-dark-factory.jpg` |

```bash
bun run presentation/theme/scripts/resize-image.ts <download> cover-art-guardrails --width 800 --height 1200
```

# Guardrails & Backpressure

```
A narrow glowing golden path spiralling down a dark mountain, lined on both sides by bright amber guardrails, a single spark of light racing safely along it, warm orange and gold against a deep charcoal background, stylized geometric digital art, clean and modern --ar 2:3 --v 6.1 --no text words letters
```

```
Abstract illustration of a torrent of luminous orange particles forced through a funnel of concentric golden rings, the flow compressed into one orderly beam, pressure glowing where it meets resistance, dark background, symmetrical geometric digital illustration, subtle grunge texture --ar 2:3 --v 6.1 --no text words letters
```

```
A crystalline core shielded by nested hexagonal barriers, each layer a thin glowing amber line, sparks deflecting off the outermost ring, warm orange and amber palette with dark background, stylized geometric digital art, minimal, elegant --ar 2:3 --v 6.1 --no text words letters
```

# Git Worktrees & Merge Queues

```
A single luminous golden tree whose trunk splits into many glowing branches, each branch ending in a small bright cube, all branches curving back down to rejoin one radiant root, warm orange and gold against a deep twilight background, abstract geometric digital illustration, symmetrical, clean lines --ar 2:3 --v 6.1 --no text words letters
```

```
Many parallel streams of amber light descending from above, converging one at a time through a narrow glowing golden gate into a single bright beam, orderly and rhythmic, dark background, stylized geometric digital art, subtle grunge texture, clean and modern --ar 2:3 --v 6.1 --no text words letters
```

```
A tall column of identical translucent glass chambers stacked vertically, each lit warm orange from within, thin golden threads running from every chamber into one shared glowing core at the base, warm orange and gold against a dark background, abstract geometric digital illustration, minimal, elegant --ar 2:3 --v 6.1 --no text words letters
```

# Dark Factory

```
A vast dark factory hall seen in symmetrical perspective, rows of robotic arms silhouetted in total darkness, only tiny amber welding sparks and status lights revealing them, warm orange accents on deep black, stylized geometric digital art, cinematic, subtle grunge texture --ar 2:3 --v 6.1 --no text words letters
```

```
A massive glowing golden gear at the centre of a pitch-black space, smaller gears and conveyor lines radiating outward and turning on their own, no light source but the machinery itself, warm orange and gold against a dark background, abstract geometric digital illustration, symmetrical, elegant --ar 2:3 --v 6.1 --no text words letters
```

```
An empty chair in front of a dim control panel, beyond it an endless automated assembly line glowing faint amber in the dark, quiet and unattended, warm orange and amber palette with near-black background, stylized geometric digital art, minimal, clean lines --ar 2:3 --v 6.1 --no text words letters
```
