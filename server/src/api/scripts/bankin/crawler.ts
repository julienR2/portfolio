import { executablePath } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

import { DatabaseRow } from '../../../../../types/utils'

import { EMAIL, PASSWORD } from './constants'

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'e1ccffaf8ca3bb5f46f35f02ea030baa',
    },
    visualFeedback: true,
  }),
)

export const getTransactions = async () => {
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  )

  await page.goto('https://app2.bankin.com/signin')

  await page.type('#signin_email', EMAIL)
  await page.type('#signin_password', PASSWORD)

  console.log('Bankin - 👤 Logging in')

  await page.click('button[type="submit"')
  await page.waitForTimeout(1000)
  await page.solveRecaptchas()
  await page.click('button[type="submit"')
  await page.waitForNavigation()

  console.log('Bankin - ✅ Login successful')

  const { accounts, transactions } = await page.evaluate(async () => {
    const bankinApi = async (url: string) => {
      try {
        const response = await fetch(`https://sync.bankin.com/v2/${url}`, {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
            'bankin-version': '2019-08-22',
            'client-id': 'f8d39787dbdd491bb11924891241c97c',
            'client-secret':
              'HzUGKTc7JVY7yys7IGi67jJBkzfoT4bNUIIk2odAmDDlHjaHoPSL05FnXSuAqp1q',
          },
        })
        const data = await response.json()

        console.log('Bankin - ☑️ Fetching success')

        return data
      } catch (error) {
        console.log('Bankin - ❌ Fetching error', error)
      }
    }

    async function getAccountTransactions(
      accountId: number,
      params = 'limit=200',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
      const { pagination, resources } = await bankinApi(
        `accounts/${accountId}/transactions?${params}`,
      )

      if (pagination.next_uri) {
        const nextData = await getAccountTransactions(
          accountId,
          pagination.next_uri.split('?')[1],
        )

        return [...resources, ...nextData]
      }

      return resources
    }

    const { resources } = (await bankinApi('accounts')) as {
      resources: DatabaseRow<'Accounts'>[]
    }

    const accounts = resources.map(({ id, name, balance }) => ({
      id,
      name,
      balance,
    })) as DatabaseRow<'Accounts'>[]

    const transactions: DatabaseRow<'Transactions'>[] = []

    for (const item of accounts) {
      const rawTransactions = (await getAccountTransactions(item.id)) as (Pick<
        DatabaseRow<'Transactions'>,
        'id' | 'description' | 'amount' | 'date'
      > & { category: { id: number }; account: { id: number } })[]

      if (!rawTransactions.length) continue

      const accountTransactions = rawTransactions.map(
        ({ id, description, amount, date, category, account }) => ({
          id,
          description,
          amount,
          date,
          category: category.id,
          account: account.id,
        }),
      )

      transactions.push(...accountTransactions)
    }

    return { accounts, transactions }
  })

  await browser.close()

  return { accounts, transactions }
}
