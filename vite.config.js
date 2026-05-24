import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const legacyStaticPaths = ['assets', 'images', 'js', 'sounds', 'star']

function copyLegacyStaticAssets() {
  return {
    name: 'copy-legacy-static-assets',
    apply: 'build',
    closeBundle() {
      for (const path of legacyStaticPaths) {
        const source = resolve(path)
        if (existsSync(source)) {
          cpSync(source, resolve('dist', path), { recursive: true })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), copyLegacyStaticAssets()],
})
