import React from 'react'
import { Text } from '@mantine/core'

import { loggedPage } from '@/utils/loggedPage'
import AppLayout from '@/layouts/AppLayout'

export default function Index() {
  return (
    <AppLayout>
      <Text>Resize app to see responsive navbar in action</Text>
    </AppLayout>
  )
}

export const getServerSideProps = loggedPage
