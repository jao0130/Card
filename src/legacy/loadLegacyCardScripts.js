const legacyScripts = ['js/config.js', 'js/effects.js', 'js/app.js']

function appendClassicScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[data-legacy-src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `/${src}`
    script.dataset.legacySrc = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Unable to load legacy script: ${src}`))
    document.body.appendChild(script)
  })
}

export async function loadLegacyCardScripts() {
  for (const src of legacyScripts) {
    await appendClassicScript(src)
  }
}
