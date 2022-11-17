import React from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts'
import { groupBy } from 'lodash'
import { Container, useTheme } from 'native-base'

import { DatabaseRow } from '../../types/utils'
import { supabase } from '../../utils/supabase'

function Budget() {
  const { colors } = useTheme()
  const [transactions, setTransactions] = React.useState<
    DatabaseRow<'Transactions'>[] | null
  >(null)

  React.useEffect(() => {
    async function fetchTransactions() {
      const { data } = await supabase
        .from('Transactions')
        .select('*')
        .order('date', { ascending: false })

      setTransactions(data)
    }

    fetchTransactions()
  }, [])

  const transactionsPerMonth = React.useMemo(
    () =>
      groupBy(transactions, (transaction) => {
        const date = new Date(transaction.date)
        const year = date.toLocaleDateString('en-GB', { year: '2-digit' })
        const month = date.toLocaleDateString('en-GB', { month: '2-digit' })
        const monthName = date.toLocaleDateString('en-GB', { month: 'short' })
        return `${year}-${month}-${monthName}`
      }),
    [transactions],
  )
  console.log('transactionsPerMonth', transactionsPerMonth)

  const expenses = React.useMemo(
    () =>
      Object.keys(transactionsPerMonth)
        .sort()
        .map((key) => {
          const { debit, credit } = transactionsPerMonth[key].reduce(
            (acc, { amount }) => {
              const type = amount > 0 ? 'credit' : 'debit'
              return { ...acc, [type]: acc[type] + Math.abs(amount) }
            },
            { credit: 0, debit: 0 },
          )
          return {
            name: key,
            debit,
            credit,
            diff: credit - debit,
          }
        }),
    [transactionsPerMonth],
  )

  console.log('expenses', expenses)

  return (
    <Container style={{ width: '100%', height: 600 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart width={500} height={300} data={expenses}>
          <XAxis dataKey='name' />
          <YAxis yAxisId='left' orientation='left' />
          <YAxis yAxisId='right' orientation='right' />
          <Tooltip />
          <Legend />
          <Bar yAxisId='left' dataKey='credit' fill={colors.success[100]} />
          <Bar yAxisId='left' dataKey='debit' fill={colors.error[100]} />
          <Line
            type='monotone'
            yAxisId='right'
            dataKey='diff'
            fill={colors.error[100]}
          />
          <ReferenceLine yAxisId='right' y={0} stroke='white' label='' />
        </ComposedChart>
      </ResponsiveContainer>
    </Container>
  )
}

export default Budget
