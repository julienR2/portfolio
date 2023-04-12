import { Asset } from 'expo-media-library'
import React from 'react'

import Image from '../../../components/Image'
import { useDimensions } from '../../../hooks/useDimensions'
import { NB_COLUMNS, MEDIA_MARGIN } from '../constants'

type MediaProps = {
  asset: Asset
  index: number
}

const Media = ({ asset, index }: MediaProps) => {
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

  return (
    <Image
      style={style}
      source={{
        uri: asset.uri,
        priority: Image.priority.normal,
      }}
      resizeMode={Image.resizeMode.cover}
    />
  )
}

export default React.memo(Media)
