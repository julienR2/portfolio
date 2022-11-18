import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

import { generateNumberId } from '../../utils'
import { supabaseService } from '../../utils/supabase'
import {
  ACCOUNT,
  ACTIVOBANK_ARCHIVES_PATH,
  ACTIVOBANK_DATA_PATH,
} from './constants'

type Transaction = {
  date: string
  description: string
  amount: string
  balance: string
}

export const parseTransactions = async () => {
  const files = fs.readdirSync(ACTIVOBANK_DATA_PATH)

  if (!files.length) {
    console.log('ActivoBank - 🤷‍♂️ No file to parse')
    return
  }

  const filePath = path.join(ACTIVOBANK_DATA_PATH, files[0])

  let lastBalance: number = 0

  const extract = XLSX.readFile(filePath)

  const cells = extract.Sheets[extract.SheetNames[0]]
  const transactions = XLSX.utils
    .sheet_to_json<Transaction>(cells, {
      raw: false,
      header: ['_', 'date', 'description', 'amount', 'balance'],
    })
    .filter(({ date, amount }) => amount && date.split('/').length > 1)
    .map(({ date, description, amount, balance }) => {
      const [day, month, year] = date.split('/')

      lastBalance = Number(balance)

      return {
        id: Number(
          generateNumberId(`${date}${description}${amount}${balance}`),
        ),
        date: `${year}-${month}-${day}`,
        amount: Number(amount),
        description,
        account: ACCOUNT.id,
      }
    })

  console.log('ActivoBank - ⏳ Updating account')

  const accountResponse = await supabaseService
    .from('Accounts')
    .upsert({ ...ACCOUNT, balance: lastBalance })

  if (accountResponse.error) {
    console.log('ActivoBank - ❌ Error updating account', accountResponse.error)
  } else {
    console.log('ActivoBank - ✅ Account updated')
  }

  console.log('ActivoBank - ⏳ Adding new transactions')

  const response = await supabaseService
    .from('Transactions')
    .upsert(transactions)

  if (response.error) {
    console.log('ActivoBank - ❌ Error adding new transactions', response.error)
  } else {
    console.log('ActivoBank - ✅ Transactions added')
  }

  fs.renameSync(filePath, path.join(ACTIVOBANK_ARCHIVES_PATH, files[0]))
}
