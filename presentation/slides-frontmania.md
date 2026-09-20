---
theme: ./theme
title: "Git Worktrees"
subTitle: One Repo, N Coding Agents
transition: fade
session-time: 10min
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
---

# and life was good

---
layout: fm-content
speakerTitle: Pro Claude Code Subscription
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
speakerTitle: Pro Claude Code Subscription
center: true
---

# and life was still good

<v-click>

## maybe, even better?

</v-click>

---
layout: fm-content
speakerTitle: and then Claude basically took over all coding
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
speakerTitle: this is when troubles started
flicker: true
naked: true
clicks: 4
---

<script setup>
import { graves } from './components/termScenes.mjs'
</script>

<Graveyard :stones="graves" :clicks="$clicks" />

<!-- One stone rises out of the fog per click. The title carries a candle flicker. -->

---
layout: fm-content
speakerTitle: and then things started to get out of control
bleed: true
clicks: 2
---

<script setup>
import { agentSessions } from './components/termScenes.mjs'
</script>

<Screens :sessions="agentSessions" :clicks="$clicks" />

<!-- Two agents, then four, then a second screen. Nothing on this slide is a new idea — it is the same idea, six times, and that is the joke. -->

---
layout: fm-content
speakerTitle: git worktrees
---

<v-clicks>

- In git for **over a decade** — and only now a killer feature
- Your harness already knows them: `isolation: worktree` on a subagent
- Already baked into agent frameworks like **Superpowers**

</v-clicks>

<!-- Landed July 29, 2015, in git 2.5. A plumbing command nobody needed became the answer to the question nobody had yet. -->

---
layout: fm-content
speakerTitle: worktree challenges
---

<v-clicks depth="2">

- `node_modules` is gitignored — every tree installs from scratch
  - pnpm or bun: one content-addressed store, hardlinked per tree
- Every tree wants `:5173`
  - derive the port from the tree name
- `.env` never comes along — git never tracked it
  - `.worktreeinclude`, applied on create

</v-clicks>

<!-- Worktrees isolate what git tracks. Everything your app needs to actually run is the stuff git ignores. -->

---
layout: fm-end
---

Thanks for your attention
