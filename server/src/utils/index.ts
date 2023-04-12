import path from 'path'

import { Request } from 'express'

export const generateStringId = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)
}

export const generateNumberId = (str: string) => {
  let hash = 0,
    i = 0
  const len = str.length

  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0
  }
  return hash + 2147483647 + 1
}

export const getRequestUrl = (req: Request) =>
  req.protocol + '://' + req.get('host') + req.originalUrl

export const urlJoin = (...fragments: string[]) =>
  fragments.map((fragment) => fragment.replace(/\/$/, '')).join('/')

export const getExtension = (filePath: string) =>
  path.parse(filePath).ext.slice(1).toLowerCase()
