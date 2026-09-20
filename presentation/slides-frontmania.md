---
theme: ./theme
title: "Git Worktrees"
subTitle: One Repo, N Coding Agents
transition: fade
session-time: 20min
track: Git
type: Theoretical
first: 2026-10-06
aspectRatio: 16/9
layout: fm-cover
speaker: Wouter Van Schandevijl
speakerTitle: Git Worktrees
---

<!-- Cover: conference branding only, as in the FrontMania template. -->

---
layout: fm-content
showSpeaker: true
center: true
---

# One Repo, N Coding Agents

<v-click>

<p class="aside">(yet another AI talk)</p>

</v-click>

<style>
.aside {
  margin-top: 1.5rem;
  font-size: 1.4rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

---
layout: fm-content
speakerTitle: The Claude Transformation Series
naked: true
clicks: 7
---

<script setup>
import { series, seriesStages } from './components/termScenes.mjs'
</script>

<SeriesStrip :talks="series" :stages="seriesStages" :clicks="$clicks" />

<!-- Three talks, one thread. Two of them are somebody else's evening — dim them and move on. Then the Dark Factory opens up and the whole series arc is on one line: the guardrails are the price of admission and they are assumed from here on, the middle box is the next twenty minutes, and the fleet is what it buys. -->

---
layout: fm-content
speakerTitle: Before the AI craze
bleed: true
clicks: 3
---

<script setup>
import { beforeAI } from './components/termScenes.mjs'
</script>

<Terminal :tabs="beforeAI" :clicks="$clicks" />

<!-- One developer, one machine, three panes. Name them one at a time: the frontend build, the API on watch, and the terminal you actually type in. -->

---
layout: fm-content
speakerTitle: Before the AI craze
center: true
dawn: true
---

# life was good

---
layout: fm-content
speakerTitle: Claude Entered The Scene
bleed: true
clicks: 3
---

<script setup>
import { handover } from './components/termScenes.mjs'
</script>

<Terminal :tabs="handover" :clicks="$clicks" />

<!-- Same window, same three panes. Name them again — and the third one is no longer you. -->

---
layout: fm-content
speakerTitle: Claude Entered The Scene
center: true
dawn: true
---

# life was still good

<v-click>

## maybe, even better?

</v-click>

---
layout: fm-content
speakerTitle: Claude Took Center Stage
bleed: true
clicks: 3
---

<script setup>
import { takeover } from './components/termScenes.mjs'
</script>

<Terminal :tabs="takeover" :clicks="$clicks" />

<!-- Click 1 switches to the Ubuntu tab, then each agent is named in turn. Two agents, one repository, no supervision. -->

---
layout: fm-content
speakerTitle: Here Lieth My Working Tree
flicker: true
naked: true
clicks: 4
---

<script setup>
import { graves } from './components/termScenes.mjs'
</script>

<Graveyard :stones="graves" :clicks="$clicks" />

<!-- One stone rises per click, crooked, out of the storm. Lightning strikes on its own every few seconds — do not wait for it. -->

---
layout: fm-content
speakerTitle: "The Resurrection: git worktree"
naked: true
clicks: 4
---

<script setup>
import { risen } from './components/termScenes.mjs'
</script>

<Graveyard :stones="risen" :weather="$clicks" :clicks="$clicks" />

<!-- One stone per click, and the weather lets up with it: lightning, then rain, then the sky itself. Each stone stands up straight, grows a spire, and its engraving dissolves into the cure. Landed July 29, 2015, in git 2.5 — a plumbing command nobody needed became the answer to the question nobody had yet. -->

---
layout: fm-content
speakerTitle: And Finally Claude Took Over Completely
bleed: true
spill: true
clicks: 3
---

<script setup>
import { agentSessions } from './components/termScenes.mjs'
</script>

<Screens :sessions="agentSessions" :clicks="$clicks" />

<!-- Two agents, then four, then a second screen. Nothing on this slide is a new idea — it is the same idea, six times, and that is the joke. -->

---
layout: fm-content
speakerTitle: A New Problem Surfaces
flicker: true
naked: true
clicks: 7
---

<script setup>
import { mergeRace } from './components/termScenes.mjs'
</script>

<MergeRace :lines="mergeRace" :clicks="$clicks" />

<!-- One agent, one branch, and a main that will not hold still. Every lap is green; none of them lands. It gives up on click 6 and asks to be told when it is safe; click 7 is me saying so by hand. That hand-signal is the merge queue, and it is the next slide. -->

---
layout: fm-content
speakerTitle: Serialize The Landing
dawn: true
bleed: true
---

<script setup>
import { branchPool } from './components/termScenes.mjs'
</script>

<QueueLine :branches="branchPool" />

<!-- Runs on its own — talk over it. One lane, one branch at a time, and main only ever grows. Bors did this in 2014; GitHub, Mergify and Graphite sell it; a session told it is the only one allowed to touch main is the same thing. -->

---
layout: fm-end
---

Thanks for your attention
