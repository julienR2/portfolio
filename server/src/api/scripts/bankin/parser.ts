import { DatabaseRow } from '../../../../../types/utils'
import { supabaseService } from '../../../utils/supabase'

type ParseTransactionsParams = {
  accounts: DatabaseRow<'Accounts'>[]
  transactions: DatabaseRow<'Transactions'>[]
}

export const parseTransactions = async ({
  accounts,
  transactions,
}: ParseTransactionsParams) => {
  console.log('Bankin - 🔄 Updating Accounts')

  const accountsResponse = await supabaseService
    .from('Accounts')
    .upsert(accounts)

  if (accountsResponse.error) {
    console.log('Bankin - ❌ Error updating accounts', accountsResponse.error)
  } else {
    console.log('Bankin - ✅ Accounts updated')
  }

  console.log('Bankin - 🔄 Updating Transactions')

  const transactionsResponse = await supabaseService
    .from('Transactions')
    .upsert(transactions)

  if (transactionsResponse.error) {
    console.log(
      'Bankin - ❌ Error updating transactions',
      transactionsResponse.error,
    )
  } else {
    console.log('Bankin - ✅ Transactions updated')
  }
}
