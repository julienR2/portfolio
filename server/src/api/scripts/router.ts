import express, { Request, Response } from 'express'

import { getRequestUrl, urlJoin } from '../../utils'

import { runScript } from './utils'

import { SCRIPTS } from '.'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const scripts = Object.keys(SCRIPTS).map((id) => ({
    name: SCRIPTS[id].name,
    description: SCRIPTS[id].description,
    url: urlJoin(getRequestUrl(req), id),
  }))

  console.log('scripts', scripts)

  res.json(scripts)
})

router.get('/:scriptId*', async (req: Request, res: Response) => {
  const scriptId = req.params.scriptId
  const action = req.params[0].replace('/', '')

  if (!scriptId || !SCRIPTS[scriptId]) {
    res.sendStatus(404)
    return
  }

  const { run, ...script } = SCRIPTS[scriptId]

  const runAction = action === 'run'

  if (!script.isRunning && runAction) {
    runScript(scriptId)
  }

  res.json({
    ...script,
    ...(!runAction ? { run: urlJoin(getRequestUrl(req), 'run') } : {}),
  })
})

export default router
