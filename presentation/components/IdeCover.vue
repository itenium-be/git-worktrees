<template>
  <div class="ide-cover">
    <IdeEditor
      title="worktrees — main"
      width="min(1120px, 90vw)"
      :tabs="tabs"
    >
      <div class="ide-cover-code">
        <div class="ide-cover-rise">
          <div class="ide-comment">// a 20-minute talk</div>
          <h1 class="ide-cover-title">Git Worktrees</h1>
          <div class="ide-cover-sub">One Repo, <b>N&nbsp;Coding&nbsp;Agents</b></div>
          <div class="ide-cover-prompt">
            <span class="pfx">$</span> git worktree add&nbsp;&nbsp;·&nbsp;&nbsp;<span class="pfx">$</span> claude&nbsp;-w
          </div>
        </div>
        <IdeCursor
          v-for="c in cursors"
          :key="c.name"
          :color="c.color"
          :name="c.name"
          :x="c.x"
          :y="c.y"
        />
      </div>
    </IdeEditor>
  </div>
</template>

<script setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'

const tabs = [
  { label: 'README.md', color: '#4c9ffb', active: true },
  { label: 'auth.ts', color: '#D97757' },
  { label: 'api.ts', color: '#2DB88E' },
]

const cursors = reactive([
  { name: 'Claude', color: '#D97757', x: 120, y: 60, home: [120, 60] },
  { name: 'Codex', color: '#2DB88E', x: 460, y: 190, home: [460, 190] },
  { name: 'Gemini', color: '#8E7CF0', x: 760, y: 90, home: [760, 90] },
])

let timer = null
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches

function drift() {
  cursors.forEach((c, i) => {
    const dx = (Math.random() - 0.5) * 90
    const dy = (Math.random() - 0.5) * 50
    c.x = c.home[0] + dx
    c.y = c.home[1] + dy
  })
}

onMounted(() => {
  if (reduce) return
  timer = setInterval(drift, 2200)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.ide-cover {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1200px 700px at 78% -10%, rgba(76, 159, 251, 0.1), transparent 60%),
    radial-gradient(1000px 600px at 15% 110%, rgba(142, 124, 240, 0.1), transparent 60%),
    #0b0e14;
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
}
.ide-cover-code {
  position: relative;
  padding: 40px 34px 48px;
  min-height: 300px;
}
.ide-cover-rise > * {
  opacity: 0;
  transform: translateY(24px);
  animation: ide-rise 0.8s cubic-bezier(0.16, 0.84, 0.32, 1) forwards;
}
.ide-cover-rise > *:nth-child(1) { animation-delay: 0.05s; }
.ide-cover-rise > *:nth-child(2) { animation-delay: 0.18s; }
.ide-cover-rise > *:nth-child(3) { animation-delay: 0.32s; }
.ide-cover-rise > *:nth-child(4) { animation-delay: 0.46s; }
@keyframes ide-rise { to { opacity: 1; transform: none; } }

.ide-comment { font-size: 15px; color: #5a6678; margin-bottom: 8px; }
.ide-cover-title {
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 0.98;
  font-size: clamp(46px, 8vw, 104px);
  margin: 6px 0 4px;
  background: linear-gradient(120deg, #fff 10%, #c9d4e3 40%, #D97757 72%, #8E7CF0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ide-cover-sub { font-size: clamp(15px, 2vw, 22px); color: #8592a6; letter-spacing: 0.5px; }
.ide-cover-sub b { color: #c9d4e3; }
.ide-cover-prompt { font-size: clamp(13px, 1.6vw, 17px); color: #2DB88E; margin-top: 22px; }
.ide-cover-prompt .pfx { color: #5a6678; }

@media (prefers-reduced-motion: reduce) {
  .ide-cover-rise > * { animation-duration: 0.001s; }
}
</style>
