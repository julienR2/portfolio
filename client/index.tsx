import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { Provider as PaperProvider, useTheme } from 'react-native-paper'

import { useStore, useStoreItem } from './hooks/useStore'
import { useStoreHydrated } from './hooks/useStoreHydrated'
import Apps from './screens/Apps'
import Login from './screens/Login'

SplashScreen.preventAutoHideAsync()

const Main = () => {
  const theme = useTheme()
  const { isHydrated } = useStoreHydrated({ store: useStore })
  const [accessToken] = useStoreItem('accessToken')

  React.useLayoutEffect(() => {
    if (!isHydrated) return

    SplashScreen.hideAsync()
  }, [isHydrated])

  if (!isHydrated) return null

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {!accessToken ? <Login /> : <Apps />}
      </View>
    </PaperProvider>
  )
}

const Index = () => (
  <PaperProvider>
    <StatusBar />
    <Main />
  </PaperProvider>
)

export default Index
