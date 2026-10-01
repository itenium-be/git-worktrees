<template>
  <div class="artifacts">
    <figure class="mocks">
      <div class="stack">
        <div v-for="mock in mocks" :key="mock.title" class="screen" :class="mock.kind">
          <div class="page">
            <div class="title">{{ mock.title }}</div>

            <template v-if="mock.kind === 'form'">
              <div class="card form">
                <div class="row">
                  <div class="field"><label>Van</label><span>06/10/2026</span></div>
                  <div class="field"><label>Tot en met</label><span>08/10/2026</span></div>
                </div>
                <div class="drop">Sleep je ziektebriefje hierheen of blader</div>
                <div class="field wide"><label>Opmerking</label><span /></div>
                <span class="btn">Indienen</span>
              </div>
            </template>

            <template v-else>
              <div class="tabs">
                <span class="tab on">Te verwerken <b>4</b></span>
                <span class="tab">Verwerkt</span>
              </div>
            </template>

            <div class="card table">
              <div v-for="row in mock.rows" :key="row[0]" class="tr">
                <span v-for="cell in row" :key="cell">{{ cell }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption>mockups/ziektebriefje-*.html</figcaption>
    </figure>

    <figure class="spec">
      <div class="paper">
        <div class="h1"># Ziektebriefje indienen</div>
        <div class="h2">## Acceptance</div>
        <div v-for="c in criteria" :key="c" class="li">- {{ c }}</div>
      </div>
      <figcaption>specs/2026-10-06-ziektebriefje-design.md</figcaption>
    </figure>
  </div>
</template>

<script setup>
// Admin first, so it renders behind the consultant mock.
const mocks = [
  {
    title: 'ZIEKTEBRIEFJES',
    kind: 'table',
    rows: [
      ['Stijn D.', '22/09 – 24/09', 'Markeer als verwerkt'],
      ['Ann V.', '19/09 – 22/09', 'Markeer als verwerkt'],
      ['Koen M.', '15/09 – 15/09', 'Markeer als verwerkt'],
      ['Lies P.', '08/09 – 10/09', 'Markeer als verwerkt'],
      ['Tom B.', '02/09 – 03/09', 'Markeer als verwerkt'],
    ],
  },
  {
    title: 'ZIEKTEBRIEFJE INDIENEN',
    kind: 'form',
    rows: [
      ['22/09 – 24/09', '3 dagen', 'Ontvangen'],
      ['01/09 – 01/09', '1 dag', 'Verwerkt'],
    ],
  },
]

const criteria = [
  'end before start: inline error, Indienen disabled',
  'a >10 MB file is refused before upload',
  'after Indienen the row is on top, status Ontvangen',
  'Markeer als verwerkt records who and when',
]
</script>

<style scoped>
.artifacts {
  --navy: #10233f;
  --teal: #1d6b6b;
  position: relative;
  height: 100%;
}

figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

figcaption {
  margin-top: 0.35rem;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.55rem;
  color: #cfc6d4;
  white-space: nowrap;
}

.mocks {
  width: 58%;
  height: 100%;
}

.stack {
  position: relative;
  flex: 1;
  min-height: 0;
}

.screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 0.35rem;
  background: #f5f7f8;
  box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.5);
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 0.42rem;
  color: var(--navy);
}

.screen.form {
  inset: 16% 20% 0 0;
}

/* Peeks out from behind the consultant mock. */
.screen.table {
  inset: 6% 0 14% 18%;
  transform: rotate(5deg);
  filter: brightness(0.82);
}

.page {
  padding: 0.4rem 0.5rem;
}

.title {
  margin-bottom: 0.35rem;
  font-size: 0.55rem;
  font-weight: 800;
}

.card {
  margin-bottom: 0.35rem;
  padding: 0.35rem;
  border-radius: 0.25rem;
  background: #fff;
}

.row {
  display: flex;
  gap: 0.3rem;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-bottom: 0.3rem;
}

.field label {
  font-weight: 600;
}

.field span {
  min-height: 0.5rem;
  padding: 0.1rem 0.2rem;
  border: 1px solid #d5dce2;
  border-radius: 0.15rem;
}

.drop {
  margin-bottom: 0.3rem;
  padding: 0.35rem;
  border: 1px dashed var(--teal);
  border-radius: 0.2rem;
  text-align: center;
  color: var(--teal);
}

.btn {
  display: inline-block;
  padding: 0.12rem 0.45rem;
  border-radius: 0.15rem;
  background: var(--teal);
  color: #fff;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.tab {
  padding-bottom: 0.1rem;
  opacity: 0.6;
}

.tab.on {
  border-bottom: 1px solid var(--teal);
  opacity: 1;
}

.tab b {
  padding: 0 0.2rem;
  border-radius: 0.5rem;
  background: #e78200;
  color: #fff;
}

.tr {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  padding: 0.12rem 0;
  border-bottom: 1px solid #edf0f2;
}

.tr span:last-child {
  color: var(--teal);
}

.spec {
  position: absolute;
  right: 1%;
  bottom: 0;
  width: 42%;
  transform: rotate(2deg);
}

.paper {
  padding: 0.6rem 0.7rem;
  border-radius: 0.3rem;
  background: #fffaf8;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.6);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.48rem;
  line-height: 1.5;
  color: #2d2a28;
}

.h1 {
  font-weight: 700;
  color: var(--navy);
}

.h2 {
  margin-top: 0.3rem;
  font-weight: 700;
  color: var(--teal);
}

.spec figcaption {
  align-self: flex-end;
}
</style>
