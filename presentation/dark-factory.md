---
theme: ./theme
title: "Dark Factory"
subTitle: Lights out, nobody watching
transition: fade
session-time: 20min
track: AI
type: Theoretical
first: 2026-10-01
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
speakerTitle: "The Future: Bellows"
naked: true
clicks: 6
---

<script setup>
import { bellowsQuestions } from './components/darkFactoryScenes.mjs'
import { bellowsTui } from './components/bellowsTui.mjs'
import BellowsFuture from './components/BellowsFuture.vue'
</script>

<BellowsFuture :questions="bellowsQuestions" :tui="bellowsTui" :clicks="$clicks" />

<!--
- (click ×5) the questions Bellows has to answer; each dial is the page that half-answers it today
- (click) a cockpit, the thousand mile view: I am experimenting with a WebUI and a TUI
-->

---
layout: fm-content
speakerTitle: "The Future: Reference Application"
naked: true
clicks: 4
---

<div class="ref-hub">
  <div v-click="1" class="ref-role ref-arch">
    <div class="ref-name">Architect</div>
    <div class="ref-does">plans a grid like the reference grid</div>
  </div>
  <div v-click="1" class="ref-arrow">→</div>
  <div class="ref-core">
    <div class="ref-title">Reference Application</div>
    <div class="ref-parts"><span>Itenium.Template</span><span>Storybook</span></div>
    <div class="ref-examples">grid · edit screen · dashboard · …</div>
  </div>
  <div v-click="2" class="ref-arrow">←</div>
  <div v-click="2" class="ref-role ref-impl">
    <div class="ref-name">Implementers</div>
    <div class="ref-does">build it like the one that already works</div>
  </div>
  <div v-click="3" class="ref-down">↓ go / no-go</div>
  <div v-click="3" class="ref-role ref-gauge">
    <div class="ref-name">Gauge</div>
    <div class="ref-does">holds every repo against it, files the drift</div>
  </div>
</div>

<div v-click="4" class="ref-tagline">different every time → the same every time</div>

<!--
- Thoughtworks Radar vol. 33: [Anchoring coding agents to a reference application](https://www.thoughtworks.com/radar/techniques/anchoring-coding-agents-to-a-reference-application)
- A live, compilable codebase is the source of truth, not prompt examples
- (click) the architect plans from it instead of inventing
- (click) implementers copy what already works
- (click) Gauge: each diff is fine on its own, the whole drifts
-->

<style>
.ref-hub {
  display: grid;
  grid-template-columns: 1fr auto 1.3fr auto 1fr;
  grid-template-rows: auto auto auto;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.6rem;
  margin-top: 3rem;
  color: #fff;
}

.ref-role,
.ref-core {
  padding: 0.9rem 1rem;
  border: 2px solid var(--ref-c);
  border-radius: 0.9rem;
  background: rgba(29, 29, 27, 0.92);
}

.ref-arch { --ref-c: #d9ad0b; }
.ref-impl { --ref-c: #d97757; }

.ref-gauge {
  --ref-c: #8fae9a;
  grid-column: 3;
  border-style: dashed;
}

.ref-core {
  --ref-c: #5fc3db;
  padding: 1.6rem 1.2rem;
  text-align: center;
  box-shadow: 0 0 2rem rgba(95, 195, 219, 0.35);
}

.ref-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ref-c);
}

.ref-does {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #cfc6d4;
}

.ref-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #5fc3db;
}

.ref-parts {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 0.8rem;
}

.ref-parts span {
  padding: 0.2rem 0.6rem;
  border: 1px solid rgba(95, 195, 219, 0.55);
  border-radius: 0.4rem;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.75rem;
}

.ref-examples {
  margin-top: 0.7rem;
  font-size: 0.75rem;
  color: #9a8fa3;
}

.ref-arrow {
  font-size: 2rem;
  font-weight: 700;
  color: #5fc3db;
}

.ref-down {
  grid-column: 3;
  text-align: center;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.8rem;
  color: #8fae9a;
}


.ref-tagline {
  margin-top: calc(2.5rem + 30px);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #5fc3db;
}
</style>

---
layout: fm-content
speakerTitle: Future?
naked: true
center: true
---

| Add                     | What it would be                                        | Who                                                                                         |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Stuck detection**     | a window that stops mid-bead, noticed and restarted     | <span class="role bellows">Bellows</span>                                                   |
| **Session handoff**     | a full context window hands its bead to a fresh session | <span class="role implementer">Implementers</span>                                          |
| **A token budget**      | a concurrency cap, cost per bead, a model per role      | <span class="role bellows">Bellows</span>                                                   |
| **Sandboxing**          | permissions, no prod credentials                        | <span class="role implementer">Implementers</span> <span class="role observer">Spark</span> |
| **Rollback**            | what happens when a landed bead breaks prod             | <span class="role lander">Weld</span>                                                       |
| **Self-improvement**    | a lesson caught by hand becomes a new check or skill    | <span class="role architect">Architects</span>                                              |
| **Measure the factory** | lead time, cost per bead, bounce rate, reviewer rejects | <span class="role bellows">Bellows</span>                                                   |
| **Federation**          | factories share a wanted board of open beads            | <span class="role bellows">Bellows</span>                                                   |

<style>
/* A collapsed table ignores border-radius. */
table {
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  font-size: 1.15rem;
  background: rgba(29, 29, 27, 0.88);
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
}

table th {
  color: #5fc3db;
}

table th, table td {
  padding: 0.55rem 1.4rem;
  text-align: left;
  border-bottom: 1px solid rgba(95, 195, 219, 0.25);
}

tr:last-child td {
  border-bottom: none;
}

table td:last-child, table th:last-child {
  width: 1%;
  padding-left: 0.4rem;
  white-space: nowrap;
}

.role {
  display: inline-block;
  padding: 0.05rem 0.55rem;
  border: 1px solid var(--role);
  border-radius: 999px;
  font-size: 0.7rem;
  color: var(--role);
}

.role.bellows { --role: #5fc3db; }
.role.architect { --role: #d9ad0b; }
.role.implementer { --role: #d97757; }
.role.lander { --role: #827dbd; }
.role.observer { --role: #6a9bcc; }
</style>

---
layout: fm-end
source: itenium-be/git-worktrees
---

Thanks for your attention
