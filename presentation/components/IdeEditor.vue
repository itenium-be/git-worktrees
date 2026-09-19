<template>
  <div class="ide-win" :style="{ width }">
    <div class="ide-titlebar">
      <div class="ide-lights"><i></i><i></i><i></i></div>
      <span class="ide-winttl">{{ title }}</span>
      <div class="ide-presence">
        <div class="ide-avatar" style="background:#D97757">C</div>
        <div class="ide-avatar" style="background:#2DB88E">Cx</div>
        <div class="ide-avatar" style="background:#8E7CF0">G</div>
      </div>
    </div>

    <div class="ide-tabstrip" v-if="tabs && tabs.length">
      <div v-for="(t, i) in tabs" :key="i" class="ide-tab" :class="{ on: t.active }">
        <span class="ide-dot" :style="{ background: t.color || '#3b4657' }"></span>{{ t.label }}
      </div>
    </div>

    <div class="ide-body">
      <div class="ide-sidebar" v-if="files && files.length">
        <div class="ide-tree">
          <div
            v-for="(f, i) in files"
            :key="i"
            class="ide-row"
            :class="f.cls"
            :style="{ paddingLeft: (10 + (f.indent || 0)) + 'px' }"
          >
            <span class="ide-ico" :style="f.color ? { color: f.color } : null">{{ f.ico || '◇' }}</span>
            <slot :name="'file-' + i">{{ f.label }}</slot>
          </div>
        </div>
        <slot name="sidebar-extra" />
      </div>
      <div class="ide-codewrap"><slot /></div>
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup>
// Reusable collaborative-editor chrome: traffic lights, presence avatars,
// a file-tab strip and an optional file-tree sidebar. The code area is the default slot
// and is `position: relative` so presence cursors can be absolutely placed inside it.
defineProps({
  title: { type: String, default: 'worktrees — main' },
  width: { type: String, default: 'min(980px, 90vw)' },
  tabs: { type: Array, default: () => [] },
  files: { type: Array, default: () => [] },
})
</script>

<style scoped>
.ide-win {
  position: relative;
  background: linear-gradient(180deg, #0f1521, #0b0f18);
  border: 1px solid #1c2431;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 40px 120px -30px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;
}
.ide-titlebar {
  height: 38px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 14px;
  background: linear-gradient(180deg, #141b28, #0e141f);
  border-bottom: 1px solid #1c2431;
}
.ide-lights { display: flex; gap: 8px; }
.ide-lights i { width: 12px; height: 12px; border-radius: 50%; display: block; }
.ide-lights i:nth-child(1) { background: #ff5f57; }
.ide-lights i:nth-child(2) { background: #febc2e; }
.ide-lights i:nth-child(3) { background: #28c840; }
.ide-winttl { font-size: 12px; color: #8592a6; letter-spacing: 0.3px; }
.ide-presence { margin-left: auto; display: flex; align-items: center; }
.ide-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-left: -6px;
  border: 2px solid #0e141f;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b0e14;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.ide-tabstrip {
  display: flex;
  background: #0a0e15;
  border-bottom: 1px solid #1c2431;
  height: 34px;
  overflow: hidden;
}
.ide-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  font-size: 11.5px;
  color: #5a6678;
  border-right: 1px solid #1c2431;
  white-space: nowrap;
  position: relative;
}
.ide-tab.on { color: #c9d4e3; background: #0d1117; }
.ide-dot { width: 8px; height: 8px; border-radius: 50%; }
.ide-tab.on::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: #4c9ffb;
}
.ide-body { display: flex; background: #0d1117; }
.ide-sidebar {
  width: 168px;
  flex: 0 0 168px;
  background: #0f1420;
  border-right: 1px solid #1c2431;
  padding: 10px 6px;
  font-size: 11.5px;
}
.ide-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 5px;
  color: #8592a6;
}
.ide-row.f { color: #5a6678; }
.ide-row.sel { background: rgba(76, 159, 251, 0.1); color: #c9d4e3; }
.ide-ico { opacity: 0.85; }
.ide-codewrap { flex: 1; position: relative; overflow: hidden; }
</style>
