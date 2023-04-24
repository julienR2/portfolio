import path from 'path'
import fs from 'fs'
import { spawnSync } from 'child_process'

import { DatabaseInsert } from '../../../../types/utils'
import { getExtension } from '..'

const dateRegex = /([0-9]+?):([0-9]+?):([0-9]+?) (.*)/

// Non valid date can be '       ' or '0000:00:00 00:00:00'
const valideDate = (date?: string) =>
  date?.startsWith('0000') || !date?.match(dateRegex) ? undefined : date

const convertDMStoDD = (dms: string) => {
  const [degrees, minutes, seconds, direction] = dms
    .replace('deg', '°')
    .split(/[^\d\w.]+/)

  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1
  }

  return dd
}

export const getExifData = (
  filePath: string,
): Omit<DatabaseInsert<'Media'>, 'id' | 'owner'> => {
  const { error, output } = spawnSync(
    path.join(__dirname, './lib/exiftool'),
    ['-j', filePath],
    { stdio: 'pipe', encoding: 'utf-8' },
  )

  const birthtime = fs.statSync(filePath).birthtime.toISOString()

  const defaultMetada = {
    creationTime: birthtime,
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

    const parsedDateTimeOriginal = (
      valideDate(metadata.DateTimeOriginal) ||
      valideDate(metadata.CreateDate) ||
      valideDate(metadata.FileModifyDate)
    )?.replace(dateRegex, '$1-$2-$3 $4')

    const creationTime = new Date(
      parsedDateTimeOriginal || birthtime,
    ).toISOString()

    return {
      creationTime,
      extension: metadata.FileTypeExtension as string,
      latitude,
      longitude,
      path: filePath,
      description: metadata.Description,
    }
  } catch (error) {
    return defaultMetada
  }
}
