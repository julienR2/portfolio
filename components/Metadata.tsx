import { useMantineTheme } from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type MetadataProps = {
  title?: string
}

const Metadata = ({ title }: MetadataProps) => {
  const router = useRouter()
  const theme = useMantineTheme()
  const pageTitle = `${title ? `${title} - ` : ''}Nowmad`
  const path = !title
    ? ''
    : '/' + title.toLowerCase().replace(' ', '-').replace('!', '')

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        key="viewport"
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <link
        key="apple-touch-icon"
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/favicon${path}/apple-touch-icon.png`}
      />
      <link
        key="shortcut icon"
        rel="shortcut icon"
        href={`/favicon${path}/favicon.ico`}
      />
      <link
        key="icon32"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/favicon${path}/favicon-32x32.png`}
      />
      <link
        key="icon13"
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/favicon${path}/favicon-16x16.png`}
      />
      <link
        key="mask-icon"
        rel="mask-icon"
        href={`/favicon${path}/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta
        key="msapplication-TileColor"
        name="msapplication-TileColor"
        content="#ffffff"
      />
      <link
        key="manifest"
        rel="manifest"
        href={`/api/manifest?icon_path=/favicon${path}&title=${pageTitle}&url=${router.route}`}
      />
      <meta
        key="theme-color"
        name="theme-color"
        content={theme.colors.dark[7]}
      />
    </Head>
  )
}

export default React.memo(Metadata)
