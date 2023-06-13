import { Group, Image, Stack, Text } from '@mantine/core'
import React from 'react'

const About = () => {
  return (
    <Group align="center" position="left">
      <Image
        maw={56}
        mx="auto"
        radius="xl"
        src="/images/profile.jpg"
        alt="Profile picture"
      />
      <Stack justify="center" sx={{ flex: 1 }}>
        <Text>
          Hey ! I&apos;m Julien.
          <br />
          Here I wander through thoughts and code
        </Text>
      </Stack>
    </Group>
  )
}

export default React.memo(About)
