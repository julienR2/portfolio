import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent } from 'react'

import { publicPageProps } from '@/helpers/publicPage'

export default function Register() {
  const [email, setEmail] = useInputState('')
  const [password, setPassword] = useInputState('')
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const supabaseClient = useSupabaseClient()

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      setLoading(true)
      try {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        router.replace('/')
      } catch (error) {
        console.error('Error while registering', error)
        setLoading(false)
      }
    },
    [supabaseClient, email, password, router],
  )

  return (
    <Container size={420} my={40}>
      <Title align="center">Welcome!</Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{' '}
        <Link href="/auth/login">
          <Anchor size="sm" component="button">
            Login
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            value={email}
            onChange={setEmail}
            disabled={loading}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={setPassword}
            disabled={loading}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export const getServerSideProps = publicPageProps
