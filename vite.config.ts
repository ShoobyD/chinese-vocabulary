import { writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const DATA_FILE = fileURLToPath(new URL('./src/data/data.json', import.meta.url))

/**
 * Dev-only endpoint backing the editing mode's "Save to data.json". `apply:
 * 'serve'` means it exists in the dev server only — never in a production
 * build, so the editing feature can't write files in prod.
 */
function saveDataPlugin(): Plugin {
  return {
    name: 'save-data',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-data', (req, res, next) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.setEncoding('utf8')
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          try {
            // Match data.json's committed CRLF line endings so a save doesn't
            // rewrite every line (the serializer emits LF).
            writeFileSync(DATA_FILE, body.replace(/\r?\n/g, '\r\n'))
            res.statusCode = 200
            res.end('ok')
          } catch (e) {
            res.statusCode = 500
            res.end(e instanceof Error ? e.message : String(e))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/chinese-vocabulary/',
  plugins: [vue(), saveDataPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
