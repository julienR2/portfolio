import { getTransactions } from './crawler'
import { parseTransactions } from './parser'

export const run = async () => {
  const info = await getTransactions()
  await parseTransactions(info)
}
