import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { NativeBaseProvider } from 'native-base'

import { RootStackParamList, SCREENS } from './screens'

const SCREENS_KEYS = Object.keys(SCREENS)

const linking = {
  prefixes: [],
  config: {
    screens: SCREENS_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: SCREENS[key].path }),
      {},
    ),
  },
}

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        >
          {SCREENS_KEYS.map((key: keyof typeof SCREENS) => (
            <Stack.Screen name={key} component={SCREENS[key].component} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
