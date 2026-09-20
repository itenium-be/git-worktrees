---
theme: ./theme
title: "Git Worktrees"
subTitle: One Repo, N Coding Agents
transition: fade
session-time: 20min
track: AI
type: Theoretical
first: 2026-10-06
aspectRatio: 16/9
layout: fm-cover
speaker: Wouter Van Schandevijl
speakerTitle: Git Worktrees
---

git worktrees & merge queues

---
layout: fm-content
showSpeaker: true
speakerTitle: ""
center: true
---

# Git worktrees<br>One Repo, N Coding Agents

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
clicks: 5
---

<script setup>
import { series, seriesStages } from './components/termScenes.mjs'
</script>

<SeriesStrip :talks="series" :stages="seriesStages" :clicks="$clicks" />

<!--
-->

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


---
layout: fm-content
speakerTitle: "The Resurrection: git worktree"
center: true
dawn: true
---

# and life was good again

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


---
layout: fm-content
speakerTitle: Final Thoughts
naked: true
clicks: 8
---

<script setup>
import { finalThoughts } from './components/termScenes.mjs'
</script>

<FinalThoughts :columns="finalThoughts" :clicks="$clicks" />


---
layout: fm-end
source: itenium-be/git-worktrees
---

Thanks for your attention
