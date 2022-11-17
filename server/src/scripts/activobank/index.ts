import { getTransactions } from './crawler'
import { parseTransactions } from './parser'

export const run = async () => {
  await getTransactions()
  await parseTransactions()
}
