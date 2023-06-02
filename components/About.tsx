import {
  Avatar,
  Group,
  Image,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconPower, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const About = () => {
  return (
    <Group align="center">
      <Image
        maw={56}
        mx="auto"
        radius="xl"
        src="/images/profile.jpg"
        alt="Profile picture"
      />
      <Stack justify="center">
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
