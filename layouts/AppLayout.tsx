import { Anchor, Container, Group, Stack, Title } from '@mantine/core'
import { useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import UserMenu from '@/components/UserMenu'

type AppLAyoutProps = {
  title?: string
  children: React.ReactNode
}

export default function AppLayout({ title, children }: AppLAyoutProps) {
  const user = useUser()
  const router = useRouter()

  const pageTitle = `${title ? `${title} - ` : ''}Nowmad`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Container size="sm">
        <Stack h="100vh">
          <Group position="apart" py="xl">
            <Title weight={900}>{title || 'Nowmad'}</Title>
            <Group>
              <Anchor
                component={Link}
                href="/"
                color={router.pathname === '/' ? 'white' : 'dimmed'}
                style={{
                  textDecoration:
                    router.pathname !== '/' ? 'underline' : 'unset',
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
          <Stack style={{ flex: 1 }} align="flex-start">
            {children}
          </Stack>
          <Group position="center" py="lg">
            <Anchor
              href="https://github.com/julienr2"
              target="_blank"
              color="dimmed"
              mx="xs">
              Github
            </Anchor>
            <Anchor
              href="https://www.linkedin.com/in/julien-rougeron-60044a3b/"
              target="_blank"
              color="dimmed"
              mx="xs">
              LinkedIn
            </Anchor>
            <Anchor
              href="https://twitter.com/julien_r2"
              target="_blank"
              color="dimmed"
              mx="xs">
              Twitter
            </Anchor>
          </Group>
        </Stack>
      </Container>
    </>
  )
}
