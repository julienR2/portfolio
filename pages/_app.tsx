import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import Metadata from '@/components/Metadata'
import { Database } from '@/types/supabase'

const supabaseClient = createBrowserSupabaseClient<Database>()

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light')

  const toggleColorScheme = React.useCallback(
    (value?: ColorScheme) =>
      setColorScheme(
        (prevScheme) => value || (prevScheme === 'dark' ? 'light' : 'dark'),
      ),
    [],
  )

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
    }
  }, [])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
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
    </ColorSchemeProvider>
  )
}
