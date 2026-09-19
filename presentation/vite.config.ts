import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // The repo lives on a DrvFs mount (/mnt/c); inotify never fires there, so edits
    // are invisible to the watcher without polling.
    watch: { usePolling: true, interval: 300 },
  },
})
