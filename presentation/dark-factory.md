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
brand: itenium
speakerTitle: Dark Factory
---

dark factory

---
layout: fm-content
speakerTitle: The Dark Factory
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
speakerTitle: But How?
center: true
---

## In the beginning of 2026<br>I was reading blog posts on Dark Factories

<v-click>

## And I was like... Cool

</v-click>

<v-click>

# But mostly I was like: HOW???

</v-click>

<!--
- Dan Shapiro, [The Five Levels: from Spicy Autocomplete to the Dark Factory](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/), 23 Jan 2026
- StrongDM, [Software Factories And The Agentic Moment](https://factory.strongdm.ai), 6 Feb 2026
-->

---
layout: fm-content
speakerTitle: Not My First Rodeo
center: true
---

## Actually, turns out it's pretty easy...

<v-click>

## During an AI workshop at a client in April, I built one

</v-click>

<v-click>

# It was a total failure

</v-click>

---
layout: fm-content
speakerTitle: Take Two
center: true
dawn: 2
---

## Another 4 months later

<v-click>

## I built the second one, mostly by accident

</v-click>

<v-click>

# And... It looks quite promising

</v-click>

---
layout: fm-content
speakerTitle: "Roles: Architects"
naked: true
flicker: true
clicks: 3
---

<script setup>
import { architectWaiting, ziektebriefjeBeads } from './components/darkFactoryScenes.mjs'
</script>

<div class="architect">
<div class="term">
<Terminal :tabs="architectWaiting" :clicks="$clicks" />
</div>
<div class="made">
<ArchitectArtifacts v-click="2" />
<BeadGraph v-click="3" :beads="ziektebriefjeBeads" />
</div>
</div>

<style>
.architect {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2%;
  height: 100%;
}
.term {
  display: flex;
  min-height: 0;
}
.made {
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 5%;
  min-height: 0;
  padding: 1% 0 2%;
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
speakerTitle: "Roles: Implementers"
naked: true
clicks: 8
---

<script setup>
import { implementerBeads, implementerClaiming, implementerGraph } from './components/darkFactoryScenes.mjs'
</script>

<div class="implementer">
<div class="term">
<Terminal :tabs="implementerClaiming" :clicks="$clicks" />
</div>
<div class="live">
<BeadGraph :beads="implementerBeads" :live="implementerGraph" :clicks="$clicks" />
</div>
</div>

<style>
.implementer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2%;
  height: 100%;
}
.term {
  display: flex;
  min-height: 0;
}
.live {
  align-self: center;
  height: 70%;
}
</style>

---
layout: fm-content
speakerTitle: "Roles: Lander"
naked: true
clicks: 5
---

<script setup>
import { welding } from './components/darkFactoryScenes.mjs'
import WeldLanding from './components/WeldLanding.vue'
</script>

<div class="lander">
<div class="term">
<Terminal :tabs="welding" :clicks="$clicks" />
</div>
<div class="git">
<WeldLanding :clicks="$clicks" />
</div>
</div>

<style>
.lander {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2%;
  height: 100%;
}
.term {
  display: flex;
  min-height: 0;
}
.git {
  align-self: center;
  height: 75%;
}
</style>

---
layout: fm-content
speakerTitle: "Roles: Observer"
naked: true
clicks: 6
---

<script setup>
import { sparkArchitect, sparkBeads, sparkSources } from './components/darkFactoryScenes.mjs'
import SparkSweep from './components/SparkSweep.vue'
</script>

<div class="observer">
<SparkSweep :sources="sparkSources" :beads="sparkBeads" :architect="sparkArchitect" :clicks="$clicks" />
</div>

<style>
.observer {
  height: 88%;
  padding: 0 2%;
}
</style>

---
layout: fm-content
speakerTitle: "Bellows: The Dashboard"
naked: true
clicks: 2
---

<script setup>
import { fleetWindows } from './components/darkFactoryScenes.mjs'
import BellowsHub from './components/BellowsHub.vue'
</script>

<BellowsHub :windows="fleetWindows" poked="chisel" :clicks="$clicks" />

<!--
- (click) chisel finishes its bead: the Stop hook clears it, it goes idle
- (click) the tender's next tick finds work in bd ready and pokes it: /work-a-bead
-->

---
layout: fm-content
speakerTitle: The Fleet
bleed: true
spill: true
clicks: 1
---

<script setup>
import { agentSessions } from './components/termScenes.mjs'
import { fleetScreens, fleetScreensDark } from './components/darkFactoryScenes.mjs'
import LightsOut from './components/LightsOut.vue'
</script>

<LightsOut :sessions="agentSessions" :labels="fleetScreens" :dark-labels="fleetScreensDark" :clicks="$clicks" />

<!--
- Everyone at work, lights on
- (click) Turning off the lights: going dark
-->

---
layout: fm-content
speakerTitle: Future?
center: true
---

| Add                      | What it would be                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Stuck detection**      | a window that stops mid-bead, noticed and restarted                                                            |
| **A token budget**       | a concurrency cap, cost per bead                                                                               |
| **Sandboxing**           | permissions, no prod credentials within an agent's reach                                                       |
| **Feature flags**        | land dark, switch on later                                                                                     |
| **Rollback**             | what happens when a landed bead breaks prod                                                                    |
| **Self-improvement**     | a lesson caught by hand becomes a new check or skill                                                           |
| **Storybook & template** | an example of how to build a grid, an edit screen, a dashboard, …<br>different every time, the same every time |
| **Gauge**                | an auditor: reads the whole repo after it landed, files the drift, never fixes                                 |

<!--
- Storybook & template: Thoughtworks Radar vol. 33, [Anchoring coding agents to a reference application](https://www.thoughtworks.com/radar/techniques/anchoring-coding-agents-to-a-reference-application)
- Gauge: each diff is fine on its own, the whole drifts
-->

<style>
table {
  border-collapse: collapse;
  font-size: 1.15rem;
  background: rgba(29, 29, 27, 0.88);
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
}

th {
  color: #5fc3db;
  text-align: left;
}

th, td {
  padding: 0.55rem 1.4rem;
  border-bottom: 1px solid rgba(95, 195, 219, 0.25);
}

tr:last-child td {
  border-bottom: none;
}
</style>

---
layout: fm-end
source: itenium-be/git-worktrees
---

Thanks for your attention
