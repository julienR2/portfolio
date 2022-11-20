import React from 'react'
import { Platform, View, TouchableOpacity } from 'react-native'
import { useLinkProps } from '@react-navigation/native'
import { Text } from 'native-base'

type LinkProps = Parameters<typeof useLinkProps>[0] & {
  children: React.ReactNode
  className?: string
}

const Link = ({ to, action, children, ...rest }: LinkProps) => {
  const { onPress, ...props } = useLinkProps({ to, action })

  const [isHovered, setIsHovered] = React.useState(false)

  if (Platform.OS === 'web') {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <View
        // @ts-ignore
        onClick={onPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ opacity: isHovered ? 0.5 : 1 }}
        {...props}
        {...rest}>
        <Text>{children}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} {...props} {...rest}>
      <Text>{children}</Text>
    </TouchableOpacity>
  )
}

export default Link
