import { Script } from '../types'

import { getTransactions } from './crawler'
import { parseTransactions } from './parser'

const bankinScript: Script = {
  id: 'bankin',
  name: 'Bankin',
  description: 'Crawl Banking for new transaction',
  run: async () => {
    const info = await getTransactions()
    await parseTransactions(info)
  },
}

export default bankinScript
