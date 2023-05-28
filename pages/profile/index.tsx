import { User } from '@supabase/supabase-js'
import { Text } from '@mantine/core'

import { protectedPageProps } from '@/utils/protectedPage'
import AppLayout from '@/layouts/AppLayout'

export default function Profile({ user }: { user: User }) {
  return (
    <AppLayout>
      <Text>Profile page of user {user.email}</Text>
    </AppLayout>
  )
}

export const getServerSideProps = protectedPageProps
