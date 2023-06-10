import { ActionIcon, Button, Card, Grid, Group, Text } from '@mantine/core'
import {
  SpotlightAction,
  SpotlightProvider,
  spotlight,
} from '@mantine/spotlight'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { IconSearch, IconVideo, IconX } from '@tabler/icons-react'
import React from 'react'

import VideoJS from '@/components/VideoJS'
import AppLayout from '@/layouts/AppLayout'
import { Database } from '@/types/supabase'
import { DatabaseRow } from '@/types/utils'

export default function Projects() {
  const [availableCams, setAvailableCams] = React.useState<
    DatabaseRow<'beach_cams'>[]
  >([])
  const [selectedCams, setSelectedCams] = React.useState<
    DatabaseRow<'beach_cams'>[]
  >([])
  const [defaultCams, setDefaultCams] = React.useState<
    DatabaseRow<'beach_cams'>[]
  >([])

  const supasbaseClient = useSupabaseClient<Database>()

  const onSelectCam = React.useCallback(
    (cam: DatabaseRow<'beach_cams'>) => () => {
      setSelectedCams((prevCams) => [
        ...(!prevCams.length ? defaultCams : prevCams),
        cam,
      ])
    },
    [defaultCams],
  )

  const actions = React.useMemo<SpotlightAction[]>(
    () =>
      availableCams.map((cam) => ({
        id: cam.id,
        title: cam.name || '',
        group: cam.location || '',
        onTrigger: onSelectCam(cam),
      })),
    [availableCams, onSelectCam],
  )

  React.useEffect(() => {
    function getSelectedCams() {
      const cams = window.localStorage.getItem('selected-cams')

      if (!cams) return

      setSelectedCams(JSON.parse(cams))
    }

    getSelectedCams()
  }, [])

  React.useEffect(() => {
    async function getAvailableCams() {
      const { data } = await supasbaseClient.from('beach_cams').select()

      if (!data) return

      setAvailableCams(data)

      setDefaultCams(
        data.filter(({ id }) =>
          ['carcavelos', 'costacaparicasaojoao', 'bcsupertubosfixa'].includes(
            id,
          ),
        ),
      )
    }

    getAvailableCams()
  }, [supasbaseClient])

  React.useEffect(() => {
    if (!selectedCams.length) return

    window.localStorage.setItem('selected-cams', JSON.stringify(selectedCams))
  }, [selectedCams])

  return (
    <AppLayout title="BeachCam">
      <SpotlightProvider
        actions={actions}
        searchIcon={<IconSearch size="1.2rem" />}
        searchPlaceholder="Search cameras..."
        shortcut="mod + shift + 1"
        nothingFoundMessage="Nothing found...">
        <Group position="center" mb="xl" w="100%">
          <Button
            color="blue"
            onClick={() => spotlight.open()}
            leftIcon={<IconVideo size="1.2rem" />}>
            Add Cameras
          </Button>
        </Group>
      </SpotlightProvider>
      <Grid w="100%" gutter="xl">
        {(selectedCams.length ? selectedCams : defaultCams).map((cam) => (
          <Grid.Col span={6} key={cam.id}>
            <Group align="center" mb="sm" position="apart">
              <Text weight={500}>{cam.name}</Text>
              <ActionIcon radius="sm" size="sm" color="red">
                <IconX size="1rem" color="gray" />
              </ActionIcon>
            </Group>
            <Card
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
              sx={(theme) => ({
                '&:hover': {
                  boxShadow: theme.shadows.xl,
                  borderColor: theme.colors.gray[7],
                },
              })}>
              <Card.Section>
                <VideoJS src={cam.video_url || ''} autoplay muted />
              </Card.Section>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </AppLayout>
  )
}
