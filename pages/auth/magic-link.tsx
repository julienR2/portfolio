import {
  TextInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  useMantineTheme,
  Group,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { IconCircleCheck } from '@tabler/icons-react'
import React, { FormEvent } from 'react'

import { publicPageProps } from '@/utils/publicPage'

export default function Login() {
  const [email, setEmail] = useInputState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const theme = useMantineTheme()

  const supabaseClient = useSupabaseClient()

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setLoading(true)

      try {
        let { error } = await supabaseClient.auth.signInWithOtp({ email })

        if (error) throw error

        setSuccess(true)
      } catch (error) {
        console.error('Error during magic link', error)
        setLoading(false)
      }
    },
    [supabaseClient, email],
  )
  console.log('theme.colors.green', theme.colors.green)
  return (
    <Container size={420} my={40}>
      <Title align='center'>Welcome back!</Title>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        {success ? (
          <Group>
            <IconCircleCheck size={24} color={theme.colors.green[9]} />
            <Text>We sent you a magic link by mail</Text>
          </Group>
        ) : (
          <form onSubmit={onSubmit}>
            <TextInput
              label='Email'
              placeholder='you@mantine.dev'
              required
              value={email}
              onChange={setEmail}
              disabled={loading}
            />
            <Button fullWidth mt='xl' type='submit' loading={loading}>
              Send me a magic link
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  )
}

export const getServerSideProps = publicPageProps
