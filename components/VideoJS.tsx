import { Box } from '@mantine/core'
import React from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

type VideoJSProps = Partial<HTMLMediaElement> & {
  onReady?: (player: Player) => void
}

export const VideoJS = ({ onReady, src, autoplay, muted }: VideoJSProps) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null)
  const playerRef = React.useRef<Player | null>(null)

  const options = React.useMemo(
    () => ({
      autoplay,
      muted,
      sources: [{ src, type: 'application/x-mpegURL' }],
      fluid: true,
    }),
    [autoplay, muted, src],
  )

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')

      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady?.(player)
      }))
    } else {
      playerRef.current.options(options)
    }
  }, [options, onReady])

  React.useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  const onFullScreen = React.useCallback(() => {
    videoRef.current?.requestFullscreen()
  }, [])

  return (
    <Box
      data-vjs-player
      onClick={onFullScreen}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
      }}>
      <div ref={videoRef} />
    </Box>
  )
}

export default VideoJS
