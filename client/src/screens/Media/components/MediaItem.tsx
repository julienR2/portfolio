import { Asset } from 'expo-media-library'
import React from 'react'

import Image from '../../../components/Image'
import { useDimensions } from '../../../hooks/useDimensions'
import { NB_COLUMNS, MEDIA_MARGIN } from '../constants'
import { DatabaseRow } from '../../../../../types/utils'
import { getUriFromPath } from '../utils'
import { supabase } from '../../../libs/supabase'
import { useStoreItemValue } from '../../../hooks/useStore'

type MediaProps = {
  item: Asset | DatabaseRow<'Media'>
  index: number
}

const Media = ({ item, index }: MediaProps) => {
  const accessToken = useStoreItemValue('accessToken')
  const { window } = useDimensions()

  const size = React.useMemo(
    () => Math.floor((window.width - (NB_COLUMNS - 1) * MEDIA_MARGIN) / 3),
    [window.width],
  )

  const style = React.useMemo(
    () => ({
      width: size,
      height: size,
      marginRight: index !== NB_COLUMNS ? MEDIA_MARGIN : 0,
    }),
    [index, size],
  )

  const uri = React.useMemo(
    () =>
      (__DEV__
        ? item.uri.replace('nowmad.io', 'dev.nowmad.io')
        : item.uri
      ).toLocaleLowerCase(),
    [item.uri],
  )

  return (
    <Image
      style={style}
      source={{
        uri,
        priority: Image.priority.normal,
        headers: { Authorization: `Bearer ${accessToken}` },
      }}
      resizeMode={Image.resizeMode.cover}
      onError={() => {
        console.log('error ?')
      }}
    />
  )
}

export default React.memo(Media)
