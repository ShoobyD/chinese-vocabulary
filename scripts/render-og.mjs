// Renders public/og-image.html -> public/og-image.png at 1200x630 using headless Chrome.
// Usage: node scripts/render-og.mjs
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = resolve(root, 'scripts/og-image.html')
const output = resolve(root, 'public/og-image.png')

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].filter(Boolean)

const chrome = candidates.find((p) => existsSync(p))
if (!chrome) {
  console.error('No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser.')
  process.exit(1)
}

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  `--screenshot=${output}`,
  `file://${input}`,
], { stdio: 'inherit' })

console.log(`Rendered ${output}`)
