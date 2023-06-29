import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Button, Grid, Group } from '@mantine/core'
import {
  SpotlightAction,
  SpotlightProvider,
  spotlight,
} from '@mantine/spotlight'
import { IconSearch, IconVideo } from '@tabler/icons-react'
import React from 'react'

import SortableCam from '@/components/SortableCam'
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
  selectedCams: null as DatabaseRow<'beach_cam'>[] | null,
})

export default function Projects() {
  const { data: availableCams } = useSupabaseSelect('beach_cam')

  const [selectedCams, setSelectedCams] = useStoreItem(store, 'selectedCams')

  const defaultCams = React.useMemo(
    () => availableCams?.filter(({ id }) => DEFAULT_CAM_IDS.includes(id)) || [],
    [availableCams],
  )

  const onSelectCam = React.useCallback(
    (cam: DatabaseRow<'beach_cam'>) => () => {
      setSelectedCams((prevCams) => [cam, ...(prevCams || defaultCams)])
    },
    [defaultCams, setSelectedCams],
  )

  const actions = React.useMemo<SpotlightAction[]>(
    () =>
      (availableCams || [])
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
    [availableCams, onSelectCam, selectedCams],
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

  const items = selectedCams || defaultCams

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        setSelectedCams((prevCams) => {
          if (!prevCams) return prevCams

          const oldIndex = prevCams.findIndex(({ id }) => id === active.id)
          const newIndex = prevCams.findIndex(({ id }) => id === over?.id)

          return arrayMove(prevCams, oldIndex, newIndex)
        })
      }
    },
    [setSelectedCams],
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
        <Group position="center" mb="sm" w="100%">
          <Button
            onClick={() => spotlight.open()}
            leftIcon={<IconVideo size="1.2rem" />}>
            Add Cameras
          </Button>
        </Group>
      </SpotlightProvider>
      <Grid gutter="xl" mt="xs">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={selectedCams || defaultCams}
            strategy={rectSortingStrategy}>
            {items.map((cam) => (
              <SortableCam key={cam.id} cam={cam} onDelete={onDelete} />
            ))}
          </SortableContext>
        </DndContext>
      </Grid>
    </AppLayout>
  )
}
