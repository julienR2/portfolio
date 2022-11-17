import * as React from 'react'
import { useTheme } from 'native-base'
import Svg, { SvgProps, Path } from 'react-native-svg'

type MakeIconParams = {
  path: React.ReactNode
  viewBox?: string
}

type LogoProps = {
  size?: number
} & Omit<SvgProps, 'width' | 'height'>

const makeIcon = ({ viewBox = '0 0 60 60', path }: MakeIconParams) =>
  React.memo(({ size = 60, color, ...props }: LogoProps) => {
    const { colors } = useTheme()
    return (
      <Svg
        width={size}
        height={size}
        viewBox={viewBox}
        color={color || colors.gray[100]}
        {...props}
      >
        {path}
      </Svg>
    )
  })

export const Logout = makeIcon({
  viewBox: '0 0 512 512',
  path: (
    <Path
      fill='currentColor'
      d='M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z'
    />
  ),
})

export const Close = makeIcon({
  viewBox: '0 0 320 512',
  path: (
    <Path
      fill='currentColor'
      d='M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z'
    />
  ),
})

export const Check = makeIcon({
  viewBox: '0 0 512 512',
  path: (
    <Path
      fill='currentColor'
      d='M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'
    />
  ),
})
