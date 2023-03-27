import { SCRIPTS } from '.'

export const runScript = async (scriptId: string) => {
  const script = SCRIPTS[scriptId]

  if (!script) return

  script.logs = ''
  script.isRunning = true

  const old_write = process.stdout.write

  process.stdout.write = (message) => {
    script.logs += `\n${message}`
    return true
  }

  try {
    console.log('🚀 Start running', script.name)
    await script.run()
    console.log('🎉 Script ran with success')
  } catch (error) {
    console.log('❌ Error running script', error)
  }

  process.stdout.write = old_write

  script.isRunning = false
}
