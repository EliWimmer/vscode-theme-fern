import fs from "fs"
import path from "path"
import { execFileSync } from "child_process"
import { fileURLToPath } from "url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const palettePath = path.join(root, "palette/roles.txt")
const vscodePort = path.join(root, "ports/vscode")

const collapses = new Map([
  ["32302F", "191F1D"],
  ["7C6F64", "7C837E"],
  ["1E2422", "191F1D"],
  ["499764", "499784"],
])

export function loadPalette(file = palettePath) {
  const roles = new Map()
  const byHex = new Map()
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [name, hex] = trimmed.split(/\s+/)
    if (!name || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error(`Bad palette line: ${line}`)
    }
    const value = hex.toUpperCase()
    if (roles.has(name)) throw new Error(`Duplicate role ${name}`)
    if (byHex.has(value)) throw new Error(`Duplicate hex ${value} for ${name}`)
    roles.set(name, value)
    byHex.set(value, name)
  }
  return { roles, byHex }
}

function replaceRgb(input, from, to) {
  const pattern = new RegExp(`#${from}([0-9A-Fa-f]{2})?`, "gi")
  return input.replace(pattern, (_, alpha) => `#${to}${alpha ?? ""}`)
}

export function toRoles(source, { roles, byHex }, { flattenEditorBackground = false } = {}) {
  let text = source
  if (flattenEditorBackground) text = replaceRgb(text, "202725", "191F1D")
  for (const [from, to] of collapses) text = replaceRgb(text, from, to)

  const unknown = new Set()
  text = text.replace(/#([0-9A-Fa-f]{3,8})/g, (full, hex) => {
    if (hex.length !== 6 && hex.length !== 8) {
      unknown.add(full)
      return full
    }
    const rgb = hex.slice(0, 6).toUpperCase()
    const alpha = hex.length === 8 ? hex.slice(6).toLowerCase() : ""
    const role = byHex.get(rgb)
    if (!role) {
      unknown.add(`#${rgb}`)
      return full
    }
    return alpha ? `${role}/${alpha}` : role
  })
  if (unknown.size) {
    throw new Error(`Unmapped colors:\n${[...unknown].sort().join("\n")}`)
  }
  return text
}

function resolveValue(value, roles) {
  if (typeof value !== "string") return value
  const match = value.match(/^([a-z0-9-]+)(?:\/([0-9a-fA-F]{2}))?$/)
  if (!match || !roles.has(match[1])) return value
  return `#${roles.get(match[1])}${match[2] ?? ""}`
}

function resolveTree(node, roles) {
  if (Array.isArray(node)) return node.map((item) => resolveTree(item, roles))
  if (node && typeof node === "object") {
    const out = {}
    for (const [key, value] of Object.entries(node)) out[key] = resolveTree(value, roles)
    return out
  }
  return resolveValue(node, roles)
}

function parseJsonc(source) {
  const cleaned = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/,(\s*[}\]])/g, "$1")
  return JSON.parse(cleaned)
}

function assertHex(value, where) {
  if (typeof value !== "string" || !value.startsWith("#")) {
    throw new Error(`Unresolved color at ${where}: ${value}`)
  }
}

function assertColors(theme, name) {
  for (const [key, value] of Object.entries(theme.colors ?? {})) assertHex(value, `${name} colors.${key}`)
  for (const [key, value] of Object.entries(theme.semanticTokenColors ?? {})) {
    assertHex(value, `${name} semanticTokenColors.${key}`)
  }
  for (const token of theme.tokenColors ?? []) {
    for (const [key, value] of Object.entries(token.settings ?? {})) {
      if (key === "fontStyle") continue
      assertHex(value, `${name} token ${token.scope ?? token.name} ${key}`)
    }
  }
}

function renderGhostty(template, roles) {
  return template.replace(/^(.+?= *)([a-z0-9-]+)$/gm, (line, prefix, role) => {
    if (!roles.has(role)) throw new Error(`Ghostty role not in palette: ${role}`)
    return `${prefix}#${roles.get(role)}`
  })
}

function chezmoiSource() {
  try {
    return execFileSync("chezmoi", ["source-path"], { encoding: "utf8" }).trim()
  } catch {
    return null
  }
}

const plainText = new Set(["font_style", "appearance", "name", "author", "$schema"])

function assertZed(theme) {
  const walk = (node, where) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${where}[${index}]`))
      return
    }
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) walk(value, `${where}.${key}`)
      return
    }
    if (typeof node !== "string") return
    const key = where.slice(where.lastIndexOf(".") + 1)
    if (plainText.has(key) || node.startsWith("http")) return
    if (!/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(node)) {
      throw new Error(`Unresolved color at ${where}: ${node}`)
    }
  }
  if (theme.name !== "Fern" || theme.themes?.[0]?.name !== "Fern") {
    throw new Error("Zed theme must be named Fern")
  }
  walk(theme, "zed")
}

function selectFern(settings) {
  const next = settings.replace(/("theme"\s*:\s*\{[^}]*?"dark"\s*:\s*")[^"]*(")/, "$1Fern$2")
  if (!/"dark"\s*:\s*"Fern"/.test(next)) throw new Error("Zed settings have no theme.dark to set")
  return next
}

function build() {
  const { roles } = loadPalette()
  const workbenchDir = path.join(vscodePort, "workbenches")
  const themeDir = path.join(vscodePort, "themes")
  fs.mkdirSync(themeDir, { recursive: true })

  for (const [sourceName, outName] of [
    ["fern.json", "fern.json"],
    ["fern-flat.json", "fern-flat.json"],
  ]) {
    const source = fs.readFileSync(path.join(workbenchDir, sourceName), "utf8")
    const rendered = resolveTree(parseJsonc(source), roles)
    assertColors(rendered, outName)
    fs.writeFileSync(path.join(themeDir, outName), `${JSON.stringify(rendered, null, 2)}\n`)
  }

  const source = chezmoiSource()
  if (!source) {
    console.log("chezmoi source not found, skipped Ghostty and Zed installs")
    return
  }

  const ghosttyTemplate = fs.readFileSync(path.join(root, "ports/ghostty/fern"), "utf8")
  const ghostty = `${renderGhostty(ghosttyTemplate, roles).trim()}\n`
  const ghosttyDir = path.join(source, "dot_config/ghostty")
  fs.mkdirSync(path.join(ghosttyDir, "themes"), { recursive: true })
  fs.writeFileSync(path.join(ghosttyDir, "themes/fern"), ghostty)
  const stale = path.join(ghosttyDir, "themes/fern-ghostty")
  if (fs.existsSync(stale)) fs.rmSync(stale)
  const configPath = path.join(ghosttyDir, "config")
  const config = fs.readFileSync(configPath, "utf8").replace(/^theme = .*$/m, "theme = fern")
  fs.writeFileSync(configPath, config)
  console.log(`Installed Ghostty theme into ${ghosttyDir}`)

  const zedDir = path.join(source, "dot_config/zed")
  const settingsPath = path.join(zedDir, "settings.json")
  if (!fs.existsSync(settingsPath)) {
    console.log("chezmoi zed config not found, skipped Zed install")
    return
  }
  const zedSource = fs.readFileSync(path.join(root, "ports/zed/fern.json"), "utf8")
  const zed = resolveTree(parseJsonc(zedSource), roles)
  assertZed(zed)
  fs.mkdirSync(path.join(zedDir, "themes"), { recursive: true })
  fs.writeFileSync(path.join(zedDir, "themes/fern.json"), `${JSON.stringify(zed, null, 2)}\n`)
  fs.writeFileSync(settingsPath, selectFern(fs.readFileSync(settingsPath, "utf8")))
  console.log(`Installed Zed theme into ${zedDir}`)
}

const command = process.argv[2]
if (command === "roles") {
  const { roles, byHex } = loadPalette()
  const input = fs.readFileSync(process.argv[3], "utf8")
  const flatten = process.argv.includes("--flat")
  process.stdout.write(toRoles(input, { roles, byHex }, { flattenEditorBackground: flatten }))
} else if (command === "build" || !command) {
  build()
}
