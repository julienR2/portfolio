import { DatabaseRow } from '../../../../types/utils'
import { supabase } from '../../utils/supabase'

type ParseTransactionsParams = {
  accounts: DatabaseRow<'Accounts'>[]
  transactions: DatabaseRow<'Transactions'>[]
}

export const parseTransactions = async ({
  accounts,
  transactions,
}: ParseTransactionsParams) => {
  console.log('🔄 Updating Accounts')

  const accountsResponse = await supabase.from('Accounts').upsert(accounts)

  if (accountsResponse.error) {
    console.log('❌ Error updating accounts', accountsResponse.error)
  } else {
    console.log('✅ Accounts updated')
  }

  console.log('🔄 Updating Transactions')

  const transactionsResponse = await supabase
    .from('Transactions')
    .upsert(transactions)

  if (transactionsResponse.error) {
    console.log('❌ Error updating transactions', transactionsResponse.error)
  } else {
    console.log('✅ Transactions updated')
  }
}
