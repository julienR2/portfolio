import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import PlausibleProvider from 'next-plausible'
import { AppProps } from 'next/app'
import { IBM_Plex_Sans, Lato } from 'next/font/google'
import Head from 'next/head'
import React from 'react'

import Metadata from '@/components/Metadata'
import { Database } from '@/types/supabase'

const supabaseClient = createBrowserSupabaseClient<Database>()

const imbFonts = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

const latoFonts = Lato({ weight: ['700', '900'], subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('dark')

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
    <>
      <Head>
        <style jsx global>{`
          html {
            font-family: ${imbFonts.style.fontFamily};
            font-family: ${latoFonts.style.fontFamily};
          }
        `}</style>
      </Head>
      <PlausibleProvider
        domain="nowmad.io"
        customDomain="https://analytics.nowmad.io"
        trackOutboundLinks
        selfHosted>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
              primaryColor: 'teal',
              fontFamily: imbFonts.style.fontFamily,
              headings: { fontFamily: latoFonts.style.fontFamily },
              components: {
                TypographyStylesProvider: {
                  variants: {
                    post: () => ({
                      root: {
                        fontSize: '1.2em',
                        lineHeight: '1.6em',
                      },
                    }),
                  },
                },
              },
            }}>
            <Metadata />
            <SessionContextProvider
              supabaseClient={supabaseClient}
              initialSession={pageProps.initialSession}>
              <Component {...pageProps} />
            </SessionContextProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </PlausibleProvider>
    </>
  )
}
