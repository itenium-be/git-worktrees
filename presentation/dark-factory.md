---
theme: ./theme
title: "Dark Factory"
subTitle: Lights out, nobody watching
transition: fade
session-time: 20min
track: AI
type: Theoretical
aspectRatio: 16/9
layout: fm-cover
speaker: Wouter Van Schandevijl
speakerTitle: Dark Factory
---

dark factory

---
layout: fm-content
showSpeaker: true
speakerTitle: ""
center: true
---

# Dark Factory<br>Lights Out, Nobody Watching

<v-click>

<p class="aside">I wanted a merge queue, I ended up with a dark factory</p>

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
clicks: 5
---

<script setup>
import { series, stagesDarkFactory } from './components/darkFactoryScenes.mjs'
</script>

<SeriesStrip :talks="series" :stages="stagesDarkFactory" :clicks="$clicks" />

<!--
- Guardrails: done. Worktrees and a merge queue: done.
- (click 5) What you end up building once you admit you are no longer driving
-->

---
layout: fm-content
speakerTitle: Meanwhile
naked: true
clicks: 4
---

<script setup>
import { demoTimeline } from './components/darkFactoryScenes.mjs'
</script>

<FinalThoughts :columns="demoTimeline" :clicks="$clicks" />

<!--
- Remember the mockups that popped up at the start
- (click) Prompt one: the mocks
- (click) Prompt two: the beads
- (click) The rest of the backlog is deferred, so the fleet has exactly one thing to do
- (click) We'll look at where it is at the end
-->

---
layout: fm-content
speakerTitle: The Realisation
center: true
flicker: true
---

# I had built a control loop

<v-click>

## and appointed myself its scheduler

</v-click>

<v-click>

<p class="aside">the slowest component in a system I had accidentally designed</p>

</v-click>

<style>
.aside {
  margin-top: 1.5rem;
  font-size: 1.4rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

<!--
- Count what was running by the end of the worktrees deck
- Something deciding what to build, several things building it, something merging, something repairing main
- Roles, signals, retries, repair: a control loop
- A scheduler holds every task's state at once, switches context for free, never sleeps
- I can do none of those things
-->

---
layout: fm-content
speakerTitle: The System
naked: true
clicks: 7
---

<script setup>
import { loopNodes, loopFeedback } from './components/darkFactoryScenes.mjs'
</script>

<FactoryLoop :nodes="loopNodes" :feedback="loopFeedback" :scar-at="7" :clicks="$clicks" />

<!--
- (click ×5) left to right
- (click 6) and the loop closes: spark reads what the deploys are doing and files beads
- (click 7) Every box on this diagram is a scar
- None of it was designed; each box was added the week something broke
-->

---
layout: fm-content
speakerTitle: Minds, Tools, One Act
naked: true
clicks: 8
---

<script setup>
import { roles } from './components/darkFactoryScenes.mjs'
</script>

<FinalThoughts :columns="roles" :clicks="$clicks" />

<!--
- (click 2) The architect can always phrase crisp criteria for something it invented
- Crisp is worse than vague: the implementer builds exactly that, the reviewer passes it
- I first see the decision at verify, after it merged
- (click 3) So it enumerates every decision the source did not name, and asks about the ones that add surface
-->

---
layout: fm-content
speakerTitle: The Graph Is The Source Of Truth
bleed: true
clicks: 2
---

<script setup>
import { graph } from './components/darkFactoryScenes.mjs'
</script>

<Terminal :tabs="graph" :clicks="$clicks" />

<!--
- Beads: bd — a dependency graph with atomic claims and an out-of-process CLI
- (click) The architect writes edges and acceptance criteria, cites the design file
- (click) An implementer claims what is ready, and nothing else
- Two agents racing a claim each get a different bead
-->

---
layout: fm-content
speakerTitle: Architects And Implementers
center: true
dawn: true
---

# decomposition stopped being a design preference

<v-click>

## and became my parallelism strategy

</v-click>

<!--
- Callback: the agent has local context and no taste — so one role holds the global view and nothing else
- If everything routes through one 4000-line service, the architect can hand out one slice, and you have one implementer
- The number of agents you can usefully run is a readout of how well your codebase decomposes
-->

---
layout: fm-content
speakerTitle: Keeping It Running
naked: true
clicks: 8
---

<script setup>
import { tender } from './components/darkFactoryScenes.mjs'
</script>

<FinalThoughts :columns="tender" :clicks="$clicks" />

<!--
- Idle agents polling is the most expensive way in the system to learn that nothing happened
- Reset at every bead: the reset unit is a session, not a summary
- (click 5) The merge-on-build idea from the worktrees deck, as policy
-->

---
layout: fm-content
speakerTitle: Push Is The Deploy
center: true
---

# only weld touches main

<v-click>

## and an app's main is pushed by a human

</v-click>

<!--
- Libraries: weld pushes, a release blocks five consumers
- Apps: weld merges into local main and stops; origin/main trails by everything not yet deployed
- Every land lands in my verify queue first
-->

---
layout: fm-content
speakerTitle: The Dashboard
center: true
dawn: true
---

# I stopped watching six terminals

<v-click>

## and started watching one system

</v-click>

<!--
- Switch to Bellows
- /plan: the ziektebriefje epic, beads greying out as they land
- fleet panel: who holds what
- /verify: what is waiting for me
-->

---
layout: fm-content
speakerTitle: Honesty
naked: true
clicks: 4
---

<script setup>
import { stillBroken } from './components/darkFactoryScenes.mjs'
</script>

<FinalThoughts :columns="stillBroken" :clicks="$clicks" />

<!--
- Do not end on "it all works great"
- (click 4) the strongest one, and the setup for the close
-->

---
layout: fm-content
speakerTitle: The Close
center: true
---

# AI didn't invent new problems

<v-click>

## it turned the dial from five developers to fifty

</v-click>

<v-click>

<p class="aside">agent speed → filesystem → machine → merge throughput → review → architecture</p>

</v-click>

<style>
.aside {
  margin-top: 1.5rem;
  font-size: 1.3rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

<!--
- Worktrees are per-developer checkouts. A merge queue is Bors, 2013.
- Every fix in these three decks was invented for human teams, decades ago, and half-adopted
- (click) Watch where the bottleneck went
- You can buy your way out of the first four; the last one you cannot
-->

---
layout: fm-content
speakerTitle: The Close
center: true
dawn: true
---

# your codebase's parallelism ceiling<br>is your architecture

<v-click>

## AI just found it

</v-click>

---
layout: fm-content
speakerTitle: Push
center: true
---

# git push

<v-click>

<p class="aside">portal.itenium.be — ziektebriefje indienen</p>

</v-click>

<style>
.aside {
  margin-top: 1.5rem;
  font-size: 1.4rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

<!--
- Bellows /repos → Portal → Push
- Coolify builds on push; open the portal once it goes green
- (click) Submit one, switch to the admin, mark it verwerkt
-->

---
layout: fm-content
speakerTitle: ""
center: true
dawn: true
---

# I stopped reviewing code

<v-click>

## I review the system that writes it now

</v-click>

---
layout: fm-end
source: itenium-be/git-worktrees
---

Thanks for your attention
