import { ActionIcon, Button, Card, Grid, Group, Text } from '@mantine/core'
import {
  SpotlightAction,
  SpotlightProvider,
  spotlight,
} from '@mantine/spotlight'
import { IconSearch, IconVideo, IconX } from '@tabler/icons-react'
import React from 'react'

import VideoJS from '@/components/VideoJS'
import AppLayout from '@/layouts/AppLayout'
import { DatabaseRow } from '@/types/utils'
import { createStore, useStoreItem } from '@/utils/hooks/useStore'
import { useSupabaseSelect } from '@/utils/hooks/useSupabase'

const DEFAULT_CAM_IDS = [
  'carcavelos',
  'costacaparicasaojoao',
  'bcsupertubosfixa',
]

const store = createStore('beachcam', {
  selectedCams: null as DatabaseRow<'beach_cams'>[] | null,
})

export default function Projects() {
  const { data: availableCams } = useSupabaseSelect('beach_cams')

  const [selectedCams, setSelectedCams] = useStoreItem(store, 'selectedCams')

  const defaultCams = React.useMemo(
    () => availableCams?.filter(({ id }) => DEFAULT_CAM_IDS.includes(id)) || [],
    [availableCams],
  )

  const onSelectCam = React.useCallback(
    (cam: DatabaseRow<'beach_cams'>) => () => {
      setSelectedCams((prevCams) => [...(prevCams || defaultCams), cam])
    },
    [defaultCams, setSelectedCams],
  )

  const actions = React.useMemo<SpotlightAction[]>(
    () =>
      (availableCams || defaultCams || [])
        .filter(
          (cam) =>
            !selectedCams?.find((selectedCam) => selectedCam.id === cam.id),
        )
        .map((cam) => ({
          id: cam.id,
          title: cam.name || '',
          group: cam.location || '',
          onTrigger: onSelectCam(cam),
        })),
    [availableCams, onSelectCam, selectedCams, defaultCams],
  )

  const onDelete = React.useCallback(
    (camId: string) => () =>
      setSelectedCams((prevCams) =>
        (prevCams?.length ? prevCams : defaultCams).filter(
          ({ id }) => id !== camId,
        ),
      ),
    [setSelectedCams, defaultCams],
  )

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
        {(selectedCams || defaultCams).map((cam) => (
          <Grid.Col xs={6} sm={6} key={cam.id}>
            <Text weight={500} lineClamp={1}>
              <Group align="center" mb="sm" position="apart">
                {cam.name}
                <ActionIcon
                  radius="sm"
                  size="sm"
                  color="red"
                  onClick={onDelete(cam.id)}>
                  <IconX size="1rem" color="gray" />
                </ActionIcon>
              </Group>
            </Text>
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
