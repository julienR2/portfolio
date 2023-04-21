import { Asset } from 'expo-media-library'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { MEDIA_MARGIN } from '../constants'
import { DatabaseRow } from '../../../../../types/utils'

import MediaItem from './MediaItem'

type RowProps = {
  row: (Asset | DatabaseRow<'Media'>)[]
}

const Row = ({ row }: RowProps) => (
  <View style={styles.row}>
    {row.map((item, index) => (
      <MediaItem key={item.id} item={item} index={index} />
    ))}
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: MEDIA_MARGIN / 2,
  },
})

export default React.memo(Row)
