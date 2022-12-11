import { Script } from '../types'

import { getTransactions } from './crawler'
import { parseTransactions } from './parser'

export const run = async () => {
  await getTransactions()
  await parseTransactions()
}

const activobankScript: Script = {
  id: 'activobank',
  name: 'ActivoBank',
  description: 'Crawl ActivoBank for new transactions',
  run: async () => {
    await getTransactions()
    await parseTransactions()
  },
}

export default activobankScript
