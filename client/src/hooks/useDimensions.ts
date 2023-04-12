import React from 'react'
import { Dimensions } from 'react-native'

export const useDimensions = () => {
  const [dimensions, setDimensions] = React.useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  })

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen })
      },
    )

    return () => subscription?.remove()
  })

  return dimensions
}
