import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import { Database } from '@/types/supabase'

const supabaseClient = createBrowserSupabaseClient<Database>()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nowmad</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="manifest" href="/favicon/manifest.json" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          primaryColor: 'green',
          fontFamily: 'system-ui',
          colors: {
            dark: [
              '#f3f4f6',
              '#e5e7eb',
              '#d1d5db',
              '#9ca3af',
              '#6b7280',
              '#4b5563',
              '#374151',
              '#1f2937',
              '#111827',
              '#030712',
            ],
          },
        }}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}>
          <Component {...pageProps} />
        </SessionContextProvider>
      </MantineProvider>
    </>
  )
}
