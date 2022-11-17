import fs from 'fs'
import puppeteer from 'puppeteer'
import { ACTIVOBANK_DATA_PATH, PASSWORD, USERNAME } from './constants'

const waitUntilFileExist = (path: string) =>
  new Promise<string>((resolve) => {
    function wait() {
      if (!fs.existsSync(path)) {
        setTimeout(wait, 1000)
      } else {
        const content = fs.readFileSync(path, 'utf-8')
        fs.unlinkSync(path)

        resolve(content)
      }
    }

    wait()
  })

export const getTransactions = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  )

  await page.goto(
    'https://ind.activobank.pt/_loginV2/BlueMainLoginCdm.aspx?ReturnUrl=https%3a%2f%2find.activobank.pt%2fpt%2fprivate%2fdia-a-dia%2fPages%2fdia-a-dia.aspx%3fLanguage%3dpt',
  )

  await page.waitForSelector('#divUserName input')

  await page.type('#divUserName input', USERNAME)
  await page.click('#lnkBtnShort')

  await page.waitForTimeout(1000)

  await page.$$eval(
    '.multiChannelPosition li',
    (lis, password) =>
      lis.map((li) => {
        const span = li.querySelector('span')
        const input = li.querySelector('input')

        if (!span || !input) return

        const number = Number(span.innerHTML[0])
        input.value = password[number - 1]
      }),
    PASSWORD,
  )

  console.log('ActivoBank - 👤 Logging in')
  try {
    await page.click('#lnkBtnLogOn')
  } catch (error) {
    await page.click('#BlueMainLoginControlCdm1_btnSendSms')
    await page.waitForTimeout(1000)
    const smsCode = await waitUntilFileExist('./sms')
    await page.type('#BlueMainLoginControlCdm1__txbxSms', smsCode)
    await page.click('#lnkBtnLogOn')
  }
  await page.waitForTimeout(5000)
  await page.click('#_lnkBtnConfirm')
  await page.waitForSelector('.excelTools a')

  console.log('ActivoBank - ✅ Login successful')

  const client = await page.target().createCDPSession()

  console.log('ActivoBank - ⬇️ Downloading last transactions')

  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: ACTIVOBANK_DATA_PATH,
  })
  await page.click('.excelTools a')
  await page.waitForTimeout(2000)

  console.log('ActivoBank - ✅ Last transactions downloaded')

  await browser.close()
}
