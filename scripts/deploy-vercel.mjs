import { execFile, spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const cwd = process.cwd()
const PROD_URL = process.env.CARD_PROD_URL || 'https://card-nine-livid.vercel.app'
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const isWindows = process.platform === 'win32'
const bins = {
  git: 'git',
  npm: isWindows ? 'npm.cmd' : 'npm',
  vercel: isWindows ? 'vercel.cmd' : 'vercel',
}

function quoteCmdArg(value) {
  const text = String(value)
  if (/^[A-Za-z0-9_.:=/-]+$/.test(text)) {
    return text
  }
  return `"${text.replace(/"/g, '""')}"`
}

function commandForPlatform(command, args) {
  if (!isWindows || !command.endsWith('.cmd')) {
    return { command, args }
  }

  const commandLine = [command, ...args.map(quoteCmdArg)].join(' ')
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', commandLine],
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const executable = commandForPlatform(command, args)
    const child = execFile(executable.command, executable.args, {
      cwd,
      maxBuffer: 1024 * 1024 * 8,
      windowsHide: true,
      ...options,
    }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
        return
      }
      resolve({ stdout, stderr })
    })

    if (options.input) {
      child.stdin.end(options.input)
    }
  })
}

function stream(command, args) {
  return new Promise((resolve, reject) => {
    const executable = commandForPlatform(command, args)
    const child = spawn(executable.command, executable.args, {
      cwd,
      stdio: 'inherit',
      windowsHide: true,
    })
    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

function log(message) {
  console.log(`[deploy] ${message}`)
}

async function readDotEnv() {
  const content = await readFile(join(cwd, '.env'), 'utf8')
  const env = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (!match) continue
    env[match[1].trim()] = match[2].trim()
  }

  for (const name of REQUIRED_ENV) {
    if (!env[name]) {
      throw new Error(`Missing ${name} in .env`)
    }
  }

  return env
}

async function assertCleanGit() {
  const { stdout } = await run(bins.git, ['status', '--short'])
  if (stdout.trim()) {
    throw new Error(`Git working tree is not clean:\n${stdout}`)
  }
}

async function assertVercelLogin() {
  const { stdout } = await run(bins.vercel, ['whoami'])
  log(`Vercel account: ${stdout.trim().split(/\r?\n/).at(-1)}`)
}

async function syncVercelEnv(env) {
  for (const name of REQUIRED_ENV) {
    for (const target of ['production', 'preview']) {
      await run(bins.vercel, ['env', 'update', name, target, '--yes'], {
        input: env[name],
      })
      log(`Updated ${name} for ${target} (${env[name].length} chars)`)
    }
  }
}

async function verifyProductionBundle() {
  const htmlResponse = await fetch(PROD_URL)
  if (!htmlResponse.ok) {
    throw new Error(`Production URL returned ${htmlResponse.status}`)
  }

  const html = await htmlResponse.text()
  const scriptMatch = html.match(/<script[^>]+src="([^"]+\.js)"/)
  if (!scriptMatch) {
    throw new Error('No production JS bundle found')
  }

  const scriptUrl = new URL(scriptMatch[1], PROD_URL)
  const scriptResponse = await fetch(scriptUrl)
  if (!scriptResponse.ok) {
    throw new Error(`Production bundle returned ${scriptResponse.status}`)
  }

  const js = await scriptResponse.text()
  const hasSupabaseUrl = /supabase\.co/.test(js)
  const hasPublishableKey = /sb_publishable_|eyJ/.test(js)
  const hasEmptyEnv = /supabaseUrl:""|supabaseAnonKey:""/.test(js)

  if (!hasSupabaseUrl || !hasPublishableKey || hasEmptyEnv) {
    throw new Error('Production bundle is missing Supabase env values')
  }

  log(`Verified production bundle: ${scriptUrl.pathname}`)
}

async function main() {
  log('Checking local Git state')
  await assertCleanGit()

  log('Checking Vercel login')
  await assertVercelLogin()

  log('Reading local .env')
  const env = await readDotEnv()

  log('Syncing Vercel production/preview env')
  await syncVercelEnv(env)

  log('Running local production build')
  await stream(bins.npm, ['run', 'build'])

  log('Deploying to Vercel production')
  await stream(bins.vercel, ['--prod', '--yes'])

  log('Verifying production URL')
  await verifyProductionBundle()

  log(`Done: ${PROD_URL}`)
}

main().catch(error => {
  console.error(`[deploy] ${error.message}`)
  if (error.stderr) console.error(error.stderr)
  process.exit(1)
})
