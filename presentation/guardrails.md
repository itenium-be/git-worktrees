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

<!--
- Backpressure: the agent cannot proceed
- Not "is told to", not "is warned" — a warning is documentation
-->

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

<!--
- It *chose* to fix them — still a prayer
- Next: make it not a choice
-->

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

<!--
- reviewer: e.g. AI review in CI — sees the whole diff, not one tool call
- lint-budget: ratchet — disable count may only go down
- (click) Did it win, or did we?
-->

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
speakerTitle: More Guardrails?
naked: true
center: true
dawn: true
---

<div class="sun-box">

# Compounding Engineering

<v-click>

## Keep your prompts DRY

</v-click>

</div>

<!--
- Stop repeating the same correction in prompts
- Compounding Engineering: every mistake becomes a guardrail, so it can't recur
- `<select>` isn't themeable → BannedSymbols
- `<a>`/`<button>` without pointer cursor → frontend test
-->

<style>
.sun-box {
  padding: 2rem 3rem;
  border: 2px solid #E8A33D;
  border-radius: 1.25rem;
  background: rgba(255, 249, 238, 0.72);
  box-shadow: 0 1.5em 4em rgba(90, 50, 20, 0.35);
}
</style>

---
layout: fm-content
speakerTitle: Code Review
center: true
---

<div class="qa">
  <v-click at="1">
    <div>
      <p class="q">Do you care about CSS?</p>
      <v-click at="2">
        <p class="a">As long as it looks exactly like you want?</p>
      </v-click>
    </div>
  </v-click>
  <v-click at="3">
    <div>
      <p class="q">Do you care about Frontend?</p>
      <v-click at="4">
        <p class="a">As long as it does exactly what you want?</p>
      </v-click>
    </div>
  </v-click>
  <v-click at="5">
    <div>
      <p class="q">Do you care about the Database?</p>
      <v-click at="6">
        <p class="a">As long as it's performant and normalized?</p>
      </v-click>
    </div>
  </v-click>
</div>

<v-click at="7">

# I don't care and I'm not looking

</v-click>

<v-click at="8">
  <p class="aside">(maybe do keep an eye on the database)</p>
</v-click>

<style>
.qa {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.4rem;
}

.qa .q {
  margin: 0;
  line-height: 1.2;
  font-size: 1.6rem;
  font-weight: 700;
  color: #5fc3db;
}

.qa .a {
  margin: 0;
  line-height: 1.2;
  font-size: 1.2rem;
  font-style: italic;
  opacity: 0.6;
}

h1 {
  font-size: 2.4rem !important;
}

.aside {
  margin: 0;
  font-size: 1.2rem;
  font-style: italic;
  opacity: 0.55;
}
</style>

---
layout: fm-content
speakerTitle: Code Review
center: true
---

<v-click at="1">
  <p class="q">Do you care about Backend?</p>
</v-click>
<v-click at="2">
  <p class="a">Uhm... I'm not sure.</p>
</v-click>

<v-click at="3">
  <p class="lead">I know I do care about:</p>
</v-click>

<div class="cares">
  <v-click at="4">
    <div class="care">
      <div class="title">Security</div>
      <div class="line">Does that really work as intended?</div>
    </div>
  </v-click>
  <v-click at="5">
    <div class="care">
      <div class="title">API Surface</div>
      <div class="line">How chatty or chunky are we?</div>
    </div>
  </v-click>
  <v-click at="6">
    <div class="care">
      <div class="title">Architecture</div>
      <div class="line">Can we continue building at this speed?</div>
    </div>
  </v-click>
</div>

<v-click at="7">
  <p class="outro">But how some function or class is implemented? /care</p>
</v-click>

<style>
.q {
  margin: 0;
  line-height: 1.2;
  font-size: 1.6rem;
  font-weight: 700;
  color: #5fc3db;
}

.a {
  margin: 0;
  line-height: 1.2;
  font-size: 1.2rem;
  font-style: italic;
  opacity: 0.6;
}

.lead {
  margin: 2rem 0 1rem;
  font-size: 1.4rem;
  font-weight: 700;
}

.cares {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
}

.care {
  height: 100%;
  box-sizing: border-box;
  padding: 1.2rem 1rem;
  border: 2px solid #5fc3db;
  border-radius: 1rem;
  background: rgba(95, 195, 219, 0.07);
}

.care .title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f5b642;
}

.care .line {
  margin-top: 0.4rem;
  font-size: 1.05rem;
  opacity: 0.8;
}

.outro {
  margin: 1.6rem 0 0;
  font-size: 1.2rem;
  font-style: italic;
  opacity: 0.6;
}
</style>

---
layout: fm-end
source: itenium-be/git-worktrees
---

Next: worktrees & merge queues
