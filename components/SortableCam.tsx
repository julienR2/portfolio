import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionIcon, Card, Grid, Group, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import React from 'react'

import { DatabaseRow } from '@/types/utils'

import VideoJS from './VideoJS'

type SortableCamProps = {
  cam: DatabaseRow<'beach_cam'>
  onDelete: (cameId: string) => () => void
}

const SortableCam = ({ cam, onDelete }: SortableCamProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cam.id })

  const style = React.useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: 'manipulation',
    }),
    [transform, transition],
  )

  return (
    <Grid.Col
      xs={12}
      sm={6}
      key={cam.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
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
  )
}

export default React.memo(SortableCam)
