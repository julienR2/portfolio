import { Script } from '../types'

import run from './run'

const importScript: Script = {
  id: 'Import',
  name: 'Import files',
  description: 'Import new files set in Import folder',
  run,
}

export default importScript
