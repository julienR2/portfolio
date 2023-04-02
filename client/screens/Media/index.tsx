import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Appbar } from 'react-native-paper'

import Header from './components/Header'
import Row from './components/Row'
import { ESTIMATED_MEDIA_HEIGHT } from './constants'
import { useMedia } from './hooks/useMedia'

const Media = () => {
  const { media, headerIndexes, loading } = useMedia()

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof media)[0] }) =>
      typeof item === 'string' ? <Header date={item} /> : <Row row={item} />,
    [],
  )

  const getItemType = React.useCallback(
    (item: (typeof media)[0]) =>
      typeof item === 'string' ? 'sectionHeader' : 'row',
    [],
  )

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Media" />
      </Appbar.Header>
      <FlashList
        data={media}
        renderItem={renderItem}
        stickyHeaderIndices={headerIndexes}
        getItemType={getItemType}
        estimatedItemSize={ESTIMATED_MEDIA_HEIGHT}
        refreshing={loading}
      />
    </>
  )
}

export default React.memo(Media)
