import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { NativeBaseProvider } from 'native-base'
import * as SplashScreen from 'expo-splash-screen'

import { RootStackParamList, SCREENS } from './screens'
import { useStore, useStoreItem } from './hooks/useStore'
import { useStoreHydrated } from './hooks/useStoreHydrated'

SplashScreen.preventAutoHideAsync()

const SCREENS_KEYS = Object.keys(SCREENS)

const linking = {
  prefixes: [],
  config: {
    screens: SCREENS_KEYS.reduce(
      (acc, key: keyof typeof SCREENS) => ({
        ...acc,
        [key]: SCREENS[key].path,
      }),
      {},
    ),
  },
}

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  const { isHydrated } = useStoreHydrated({ store: useStore })
  const [token] = useStoreItem('token')

  React.useLayoutEffect(() => {
    if (!isHydrated) return

    SplashScreen.hideAsync()
  }, [isHydrated])

  if (!isHydrated) return null
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}>
          {SCREENS_KEYS.map((key: keyof typeof SCREENS) => (
            <Stack.Screen
              key={key}
              name={key}
              component={SCREENS[key].component}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
