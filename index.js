import { registerRootComponent } from 'expo'
import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { Platform } from 'react-native'

import Index from './client'

// @see https://github.com/expo/expo/issues/18485
if ('web' === Platform.OS) {
  const rootTag = createRoot(
    document.getElementById('root') ?? document.getElementById('main'),
  )
  rootTag.render(createElement(Index))
} else {
  registerRootComponent(Index)
}
