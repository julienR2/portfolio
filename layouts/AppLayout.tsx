import React from 'react'
import {
  AppShell,
  Header,
  Text,
  Container,
  Flex,
  Button,
  Title,
  NavLink,
  Anchor,
  Group,
  Stack,
} from '@mantine/core'
import Link from 'next/link'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

import UserMenu from '@/components/UserMenu'

type AppLAyoutProps = {
  children: React.ReactNode
}

export default function AppLayout(props: AppLAyoutProps) {
  const user = useUser()
  const router = useRouter()

  return (
    <Container size="sm">
      <Stack h="100vh">
        <Group position="apart" py="md">
          <Title weight={900}>Nowmad</Title>
          <Group>
            <Anchor
              component={Link}
              href="/"
              color={router.pathname === '/' ? 'white' : 'dimmed'}
              style={{
                textDecoration: router.pathname !== '/' ? 'underline' : 'unset',
              }}
              underline>
              Blog
            </Anchor>
            <Anchor
              component={Link}
              href="/projects"
              color={router.pathname === '/projects' ? 'white' : 'dimmed'}
              style={{
                textDecoration:
                  router.pathname !== '/projects' ? 'underline' : 'unset',
              }}>
              Projects
            </Anchor>
            {user && <UserMenu />}
          </Group>
        </Group>
        <Group style={{ flex: 1 }} align="flex-start">
          {props.children}
        </Group>
        <Group position="center" py="sm">
          <Anchor href="https://mantine.dev/" target="_blank" c="dimmed">
            Github
          </Anchor>
          <Anchor href="https://mantine.dev/" target="_blank" color="dimmed">
            LinkedIn
          </Anchor>
          <Anchor href="https://mantine.dev/" target="_blank" color="dimmed">
            Twitter
          </Anchor>
        </Group>
      </Stack>
    </Container>
  )
}
//   <Container p={0} size="sm">

//     <Flex
//       direction="row"
//       align="center"
//       justify="space-between"
//       >
//       <Title weight={900}>Nowmad</Title>
//       <Group>
//         <Anchor
//           component={Link}
//           href="/"
//           color={router.pathname === '/' ? 'white' : 'dimmed'}
//           style={{
//             textDecoration: router.pathname !== '/' ? 'underline' : 'unset',
//           }}
//           underline>
//           Blog
//         </Anchor>
//         <Anchor
//           component={Link}
//           href="/projects"
//           color={router.pathname === '/projects' ? 'white' : 'dimmed'}
//           style={{
//             textDecoration:
//               router.pathname !== '/projects' ? 'underline' : 'unset',
//           }}>
//           Projects
//         </Anchor>
//         {user && <UserMenu />}
//       </Group>
//     </Flex>
//   </Container>
//   <Flex direction="column">

//   <Container size="sm" display="flex" >
//     {props.children}
//   </Container>
//   </Flex>
//   <Container size="sm">Footer</Container>
// </Container>
