import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import PlausibleProvider from 'next-plausible'
import { AppContext, AppProps } from 'next/app'
import { IBM_Plex_Sans, Lato } from 'next/font/google'
import React from 'react'

import Metadata from '@/components/Metadata'
import { Database } from '@/types/supabase'

const supabaseClient = createBrowserSupabaseClient<Database>()

const imbFont = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

const latoFont = Lato({ weight: ['700', '900'], subsets: ['latin'] })

export default function _App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(
    pageProps.theme || 'dark',
  )

  const toggleColorScheme = React.useCallback(
    (value?: ColorScheme) =>
      setColorScheme((prevScheme) => {
        const newValue = value || (prevScheme === 'dark' ? 'light' : 'dark')

        document.cookie = `theme=${newValue}`

        return newValue
      }),

    [],
  )

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${imbFont.style.fontFamily};
          font-family: ${latoFont.style.fontFamily};
        }
      `}</style>
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
              fontFamily: imbFont.style.fontFamily,
              headings: { fontFamily: latoFont.style.fontFamily },
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

_App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const theme = (ctx.req as any).cookies?.theme

  return { Component, pageProps: { theme } }
}
