import { Asset } from 'expo-media-library'
import { chunk, groupBy, orderBy } from 'lodash'
import React from 'react'

import { useLocalMedia } from './useLocalMedia'

export const useMedia = () => {
  const { media: localMedia, loading: localLoading } = useLocalMedia()
  const loading = localLoading

  const media = React.useMemo(() => {
    const sortedMedia = orderBy(localMedia, ['creationTime'], ['desc'])
    const groupedMedia = groupBy(
      sortedMedia,
      (item) => new Date(item.creationTime).toISOString().split('T')[0],
    )

    return Object.keys(groupedMedia).reduce(
      (acc, key) => [...acc, key, ...chunk(groupedMedia[key], 3)],
      [] as (string | Asset[])[],
    )
  }, [localMedia])

  const headerIndexes = React.useMemo(
    () =>
      media
        .map((item, index) => {
          if (typeof item === 'string') {
            return index
          } else {
            return null
          }
        })
        .filter((item) => item !== null) as number[],
    [media],
  )

  return { media, headerIndexes, loading }
}
