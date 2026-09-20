---
theme: ./theme
title: "Payoff bake-off"
subTitle: Slide 9 — three directions
aspectRatio: 16/10
layout: fm-content
speaker: Wouter Van Schandevijl
speakerTitle: payoff bake-off
center: true
---

# Slide 9, three ways

Today · A Resurrection · B Split hero · C Terminal

---
layout: fm-content
speakerTitle: TODAY — git worktrees
---

<v-clicks>

- In git for **over a decade** — and only now a killer feature
- Your harness already knows them: `isolation: worktree` on a subagent
- Already baked into agent frameworks like **Superpowers**

</v-clicks>

<!-- The current slide, kept for comparison. -->

---
layout: fm-content
speakerTitle: A — git worktrees
naked: true
clicks: 4
---

<script setup>
import { cures } from './components/payoffScenes.mjs'
</script>

<Graveyard :stones="cures" :calm-at="1" :clicks="$clicks" />

<!-- Click 1 stops the rain and the lightning and rights the first stone. One stone per click after that: it travels straight up and the engraving morphs into its cure. -->

---
layout: fm-content
speakerTitle: B — git worktrees
bleed: true
clicks: 4
---

<script setup>
import { trees, splitFacts } from './components/payoffScenes.mjs'
</script>

<PayoffSplit :trees="trees" :facts="splitFacts" :clicks="$clicks" />

<!-- Click 1: three working trees fan out of the one .git core. Clicks 2-4 add the three facts. -->

---
layout: fm-content
speakerTitle: C — git worktrees
bleed: true
clicks: 3
---

<script setup>
import { payoffTerminal } from './components/payoffScenes.mjs'
</script>

<Terminal :tabs="payoffTerminal" :clicks="$clicks" />

<!-- The three facts are the pane labels: the command, the harness flag, the Superpowers agent. -->

