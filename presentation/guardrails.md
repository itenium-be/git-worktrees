---
theme: ./theme
title: "Guardrails & Backpressure"
subTitle: Before you let go of the wheel
transition: fade
session-time: 15min
track: AI
type: Theoretical
aspectRatio: 16/9
layout: fm-cover
speaker: Wouter Van Schandevijl
brand: itenium
speakerTitle: Guardrails & Backpressure
---

guardrails & backpressure

---
layout: fm-content
speakerTitle: The Dark Factory
naked: true
clicks: 6
---

<script setup>
import { series, stagesGuardrails } from './components/guardrailsScenes.mjs'
</script>

<SeriesStrip :talks="series" :stages="stagesGuardrails" :clicks="$clicks" />

<!--
- Three parts, one session
- (click) We start with what you must already have
- Everything after this assumes it is in place
-->

---
layout: fm-content
speakerTitle: The Problem
naked: true
flicker: true
clicks: 2
---

<Storm>
  <div class="storm-box" :class="{ swapped: $clicks >= 2 }">
    <div class="panel problem">
      <h1>AI is going to write code</h1>
      <v-click>
        <p class="aside">(that non-deterministic slop machine)</p>
      </v-click>
    </div>
    <div class="panel solution">
      <h1>Hoe laten we die<br>binnen de lijntjes kleuren</h1>
    </div>
  </div>
</Storm>

<style>
/* Both panels share one grid cell, so the box is sized for the larger and never jumps on the swap. */
.storm-box {
  position: relative;
  z-index: 1;
  display: grid;
  margin: auto;
  padding: 2.5rem 4rem;
  overflow: hidden;
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  text-align: center;
}

.storm-box .panel {
  grid-area: 1 / 1;
  align-self: center;
  transition: transform 700ms ease, opacity 700ms ease;
}

.storm-box .solution {
  transform: translateY(150%);
  opacity: 0;
}

.storm-box.swapped .problem {
  transform: translateY(-150%);
  opacity: 0;
}

.storm-box.swapped .solution {
  transform: none;
  opacity: 1;
}

.storm-box h1 {
  margin: 0;
  font-size: 3rem;
  color: #fff;
}

.storm-box .aside {
  margin: 1.2rem 0 0;
  font-size: 1.4rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

---
layout: fm-content
speakerTitle: These and other Prayers
flicker: true
naked: true
clicks: 4
---

<script setup>
import { suggestions } from './components/guardrailsScenes.mjs'
</script>

<Graveyard :stones="suggestions" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: "The Resurrection: Backpressure"
naked: true
clicks: 4
---

<script setup>
import { answered } from './components/guardrailsScenes.mjs'
</script>

<Graveyard :stones="answered" :weather="$clicks" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: "LSP: Language Server Protocol"
bleed: true
clicks: 2
---

<script setup>
import { lspDiagnostics } from './components/guardrailsScenes.mjs'
</script>

<Terminal :tabs="lspDiagnostics" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: Becoming Deterministic
naked: true
clicks: 10
---

<script setup>
import { hookStages, hookChecks, hookMoral } from './components/guardrailsScenes.mjs'
</script>

<HookMatrix :stages="hookStages" :checks="hookChecks" :moral="hookMoral" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: Your Arsenal
naked: true
flicker: true
clicks: 4
---

<script setup>
import { arsenal } from './components/guardrailsScenes.mjs'
</script>

<ArsenalInventory :weapons="arsenal" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: 'The LLM Is Trained To Be "Helpful"'
naked: true
center: true
---

<div class="help-box">
  <div class="lead">It gets creative with those guardrails</div>
  <v-click>
    <div class="punch">It needs to be chained — deterministically</div>
  </v-click>
</div>

<style>
.help-box {
  margin: auto;
  padding: 2.5rem 4rem;
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  text-align: center;
  white-space: nowrap;
  font-family: var(--font-heading);
}

.lead {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}

.punch {
  margin-top: 1.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #5fc3db;
}
</style>

---
layout: fm-content
speakerTitle: Hardening The Guardrails
bleed: true
clicks: 3
---

<script setup>
import { noVerify } from './components/guardrailsScenes.mjs'
</script>

<Terminal :tabs="noVerify" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: Guarding The Guardrails
bleed: true
clicks: 4
---

<script setup>
import { guarding } from './components/guardrailsScenes.mjs'
</script>

<Terminal :tabs="guarding" :clicks="$clicks" />

---
layout: fm-content
speakerTitle: Guarding The Guardrails
naked: true
center: true
---

<div class="watch">You'll have to monitor the squirming</div>

<div class="watch-row">
  <div v-click class="watch-box">Be Creative</div>
  <div v-click class="watch-box"><span>Balancing<br>"get shit done"<br>vs<br>"going off the rails"</span></div>
</div>

<style>
.watch {
  padding: 2rem 3rem;
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.watch-row {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
}

.watch-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem 1.8rem;
  border: 2px solid #5fc3db;
  border-radius: 1.25rem;
  background: rgba(29, 29, 27, 0.88);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: #5fc3db;
  text-align: center;
}
</style>

---
layout: fm-content
speakerTitle: The Problem
center: true
---

# so: stop reading the code

<v-click>

## not nihilism — reallocation

</v-click>

---
layout: fm-content
speakerTitle: Reallocate The Attention
naked: true
clicks: 8
---

<script setup>
import { reallocation } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="reallocation" :clicks="$clicks" />

<!--
- Human attention is the only scarce resource left
- (click ×3) the machine takes everything cheap to fix
- (click ×4) the human keeps what compounds
- A badly named variable is a five-minute fix, forever
- A leaked credential, a published API, a wrong seam — compound interest
-->

---
layout: fm-content
speakerTitle: We're Not Complete Animals
center: true
dawn: true
---

# giving up line-by-line review<br>is not giving up on quality

<v-click>

## it moves quality from a human bottleneck<br>to a mechanical one

</v-click>

---
layout: fm-content
speakerTitle: Two Rules
naked: true
clicks: 7
---

<script setup>
import { twoRules } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="twoRules" :clicks="$clicks" />

<!--
- Backpressure: the agent cannot proceed, not that it feels discouraged
- When I catch something by hand, the lesson is never "review more"
-->

---
layout: fm-content
speakerTitle: Lint & tsc, Dialed To 11
naked: true
clicks: 6
---

<script setup>
import { dialedTo11 } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="dialedTo11" :clicks="$clicks" />

<!--
- This is Portal, the app being built live behind me
- Every rule a human would find annoying, an agent does not
- An agent never argues with the linter; it just fixes it
-->

---
layout: fm-content
speakerTitle: The Guardrail Explains Itself
bleed: true
clicks: 2
---

<script setup>
import { bannedSymbols } from './components/guardrailsScenes.mjs'
</script>

<Terminal :tabs="bannedSymbols" :clicks="$clicks" />

<!--
- BannedSymbols.txt: every entry carries its reason
- (click) The build says no
- (click) And the error message is the prompt — the agent reads why, and fixes it the right way
- A rule without a reason gets worked around; a rule with one gets followed
-->

---
layout: fm-content
speakerTitle: Architecture, As A Test
naked: true
clicks: 5
---

<script setup>
import { archTests } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="archTests" :clicks="$clicks" />

<!--
- The controller reaching straight into the database, because the short path was shorter
- Now that path does not compile into a green suite
-->

---
layout: fm-content
speakerTitle: Tests That Test Something
naked: true
clicks: 6
---

<script setup>
import { testing } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="testing" :clicks="$clicks" />

<!--
- (click 5) The one that matters against agents
- They mock the unit under test and produce a test that passes forever
- Mutation testing answers the only question left: did these tests test anything?
-->

---
layout: fm-content
speakerTitle: Security
center: true
flicker: true
---

# security is the absence of behaviour

<v-click>

## and the agent optimises for behaviour

</v-click>

<!--
- Auth on every endpoint except the one added last Tuesday
- Loads the record by id from the request, never checks who owns it
- Nothing fails when the authorisation check is missing — the feature works, the tests pass, the demo is great
- There is no signal in the agent's definition of done, so it has to be mechanical
-->

---
layout: fm-content
speakerTitle: Architecture
center: true
flicker: true
---

# the agent has local context<br>and no taste

<v-click>

## it sees the files it opened, not the system

</v-click>

<v-click>

<p class="aside">hold that thought</p>

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
- Writes a second UserService because it never found the first
- Architecture is a global property, agents operate locally
- Not a knowledge problem, a vantage point problem — a better prompt does not fix it
- (click) A role whose whole job is the global view: that is the dark factory
-->

---
layout: fm-content
speakerTitle: Where The Memory Lives
center: true
dawn: true
---

# told an agent something twice?<br>it belongs in the repo

<v-click>

## and better than prose: a check that fails

</v-click>

<!--
- Sessions end; a lesson in session context dies with it
- A convention that is merely documented is optional
- Guardrails are not just quality control — they are how the system remembers
-->

---
layout: fm-end
source: itenium-be/git-worktrees
---

Next: worktrees & merge queues
