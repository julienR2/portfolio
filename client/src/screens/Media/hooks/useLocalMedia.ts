import * as MediaLibrary from 'expo-media-library'
import React from 'react'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'

export const useLocalMedia = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
  const [media, setMedia] = React.useState<MediaLibrary.Asset[]>([])
  const [loading, setLoading] = React.useState(!isWeb)

  React.useEffect(() => {
    if (isWeb) return

    async function fetchPhotos() {
      if (!permissionResponse?.granted && permissionResponse?.canAskAgain) {
        await requestPermission()
        return
      }

      const albums = await MediaLibrary.getAlbumsAsync()
      const cameraAlbum = albums.find(({ title }) => title === 'Camera')

      const { assets } = await MediaLibrary.getAssetsAsync({
        album: cameraAlbum,
        first: cameraAlbum?.assetCount,
        mediaType: ['photo', 'video'],
        sortBy: [['creationTime', false]],
      })

      setMedia(assets)

      setLoading(false)
    }

    fetchPhotos()
  }, [permissionResponse, requestPermission])

  return { media, loading }
}
