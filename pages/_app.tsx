import { MantineProvider } from '@mantine/core'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import Metadata from '@/components/Metadata'
import { Database } from '@/types/supabase'

const supabaseClient = createBrowserSupabaseClient<Database>()

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
    }
  }, [])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
        primaryColor: 'green',
        fontFamily: 'system-ui',
      }}>
      <Head>
        <script
          defer
          data-domain="nowmad.io"
          src="https://analytics.nowmad.io/js/script.js"
        />
      </Head>
      <Metadata />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </MantineProvider>
  )
}
