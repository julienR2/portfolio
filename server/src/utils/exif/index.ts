import path from 'path'
import { spawnSync } from 'child_process'
import fs from 'fs'
import { Media } from '@prisma/client'

import { getExtension } from '..'

const convertDMStoDD = (dms: string) => {
  const [degrees, minutes, seconds, direction] = dms
    .replace('deg', '°')
    .split(/[^\d\w]+/)

  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

  if (direction == 'S' || direction == 'W') {
    dd = dd * -1
  }

  return dd
}

export const getExifData = (
  filePath: string,
): Omit<Media, 'id' | 'ownerId'> => {
  const { error, output } = spawnSync(
    path.join(__dirname, './lib/exiftool'),
    ['-j', filePath],
    { stdio: 'pipe', encoding: 'utf-8' },
  )

  const parsedFile = path.parse(filePath)
  const creationTime = fs.statSync(filePath).birthtime.toISOString()

  const defaultMetada = {
    creationTime,
    filename: parsedFile.name,
    extension: getExtension(filePath),
    path: filePath,
    longitude: null,
    latitude: null,
  }

  if (error || !output[1]) return defaultMetada

  try {
    const metadata = JSON.parse(output[1])[0]

    const latitude = metadata.GPSLatitude
      ? convertDMStoDD(metadata.GPSLatitude)
      : null
    const longitude = metadata.GPSLongitude
      ? convertDMStoDD(metadata.GPSLongitude)
      : null

    return {
      creationTime: (metadata.DateTimeOriginal as string) || creationTime,
      filename: parsedFile.name,
      extension: metadata.FileTypeExtension as string,
      latitude,
      longitude,
      path: filePath,
    }
  } catch (error) {
    return defaultMetada
  }
}
