// import React from 'react'

// import * as MediaLibrary from 'expo-media-library'
// import { Platform } from 'react-native'

// export const useLocalMedia = ({}) => {
//   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
//   const [cameraAssets, setCameraAssets] =
//     React.useState<MediaLibrary.PagedInfo<MediaLibrary.Asset>>()

//   React.useEffect(() => {
//     if (Platform.OS === 'web') return

//     async function fetchPhotos() {
//       if (!permissionResponse?.granted && permissionResponse?.canAskAgain) {
//         await requestPermission()
//         return
//       }

//       const albums = await MediaLibrary.getAlbumsAsync()
//       const cameraAlbum = albums.find(({ title }) => title === 'Camera')

//       const assets = await MediaLibrary.getAssetsAsync({
//         album: cameraAlbum,
//         first: cameraAlbum?.assetCount,
//       })

//       setCameraAssets(assets)
//     }

//     fetchPhotos()
//   }, [permissionResponse])

//   return cameraAssets
// }
