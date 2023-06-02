import React from 'react'
import { Text } from '@mantine/core'

import AppLayout from '@/layouts/AppLayout'
import About from '@/components/About'

export default function Index() {
  return (
    <AppLayout>
      <About />

      <Text>Resize app to see responsive navbar in action</Text>
    </AppLayout>
  )
}
