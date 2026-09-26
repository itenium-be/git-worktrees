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
speakerTitle: Guardrails & Backpressure
---

guardrails & backpressure

---
layout: fm-content
showSpeaker: true
speakerTitle: ""
center: true
---

# Guardrails & Backpressure<br>Before You Let Go Of The Wheel

<v-click>

<p class="aside">(the boring part that makes the rest possible)</p>

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
- Somewhere in a terminal behind me an architect is already working on a feature
- We'll get back to it
- First: the part nobody wants to hear about
-->

---
layout: fm-content
speakerTitle: The Claude Transformation Series
naked: true
clicks: 5
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
center: true
flicker: true
---

# six agents write more diff<br>than you can read

<v-click>

## not more than is comfortable — more than is possible

</v-click>

<!--
- So you do what everyone does: skim, trust the green check, approve
- Full cost of review, and you get a rubber stamp
- The slop gets in anyway, laundered through a passing pipeline and your own fatigue
-->

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
speakerTitle: Guardrails, By When They Fire
naked: true
clicks: 5
---

<script setup>
import { whenTheyFire } from './components/guardrailsScenes.mjs'
</script>

<FinalThoughts :columns="whenTheyFire" :clicks="$clicks" />

<!--
- (click) Before the code exists: conventions, skills, a PreToolUse hook can refuse an edit outright
- (click) At commit: format, lint, secrets — (click) keep it under five seconds or a human --no-verify's it out of existence within a week
- (click) At build: the heavy artillery
- (click) At merge and after: that is the next two decks
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
