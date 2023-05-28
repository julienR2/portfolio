import React from 'react'
import { AppShell, Header, Text, Container, Flex, Button } from '@mantine/core'
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

  React.useEffect(() => {
    if (user || router.pathname === '/') return

    router.replace('/')
  }, [user, router])

  return (
    <AppShell
      navbarOffsetBreakpoint='sm'
      header={
        <Header height={70} p='md'>
          <Container size='xl' h='100%'>
            <Flex
              direction='row'
              align='center'
              h='100%'
              justify='space-between'
              style={{ flex: 1 }}
            >
              <Text>Application header</Text>
              {user ? (
                <UserMenu />
              ) : (
                <Link href='/auth/login'>
                  <Button>Login</Button>
                </Link>
              )}
            </Flex>
          </Container>
        </Header>
      }
    >
      <Container size='xl'>{props.children}</Container>
    </AppShell>
  )
}
