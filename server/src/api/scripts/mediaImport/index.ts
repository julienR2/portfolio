import { Script } from '../types'

import run from './run'

const importMediaScript: Script = {
  id: 'mediaImport',
  name: 'Media import',
  description: 'Import new media set in Import folder',
  run,
}

export default importMediaScript
