import { ActionIcon, Code, Group, Overlay, Stack, Title } from '@mantine/core'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import React from 'react'

import { protectedPageProps } from '@/helpers/protectedPage'
import AppLayout from '@/layouts/AppLayout'

const JOBS = [
  {
    name: 'Populate BeachCam',
    url: '/api/populate-beaches',
  },
]

export default function Profile() {
  const [results, setResults] = React.useState<{
    [key: string]: { error?: any; success?: any; loading?: boolean }
  }>({})

  const onRun = React.useCallback(
    (job: (typeof JOBS)[0]) => async () => {
      setResults((prevResults) => ({
        ...prevResults,
        [job.name]: { ...(prevResults[job.name] || {}), loading: true },
      }))

      try {
        const rawData = await fetch(job.url)
        const data = await rawData.json()

        if (data.error) throw data.error

        setResults((prevResults) => ({
          ...prevResults,
          [job.name]: {
            ...prevResults[job.name],
            loading: false,
            success: data,
            error: undefined,
          },
        }))
      } catch (error) {
        setResults((prevResults) => ({
          ...prevResults,
          [job.name]: {
            ...prevResults[job.name],
            loading: false,
            success: undefined,
            error,
          },
        }))
      }
    },
    [],
  )

  return (
    <AppLayout>
      <Title>Jobs</Title>
      {JOBS.map((job) => (
        <Stack key={job.name} w="100%">
          <Group position="apart">
            <Title order={3}>{job.name}</Title>
            <ActionIcon
              onClick={onRun(job)}
              loading={results[job.name]?.loading}>
              <IconPlayerPlayFilled size="1.12rem" />
            </ActionIcon>
          </Group>
          {(results[job.name]?.success || results[job.name]?.error) && (
            <Code
              pos="relative"
              block
              color={results[job.name].success ? 'green' : 'red'}
              mah={200}>
              {results[job.name].loading && <Overlay blur={1} center />}
              {JSON.stringify(
                results[job.name].success || results[job.name].error,
                undefined,
                2,
              )}
            </Code>
          )}
        </Stack>
      ))}
    </AppLayout>
  )
}

export const getServerSideProps = protectedPageProps
