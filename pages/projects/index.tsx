import {
  Anchor,
  Card,
  Grid,
  Image,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { sortBy } from 'lodash'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { IS_DEV } from '@/helpers/constants'
import AppLayout from '@/layouts/AppLayout'
import { Database } from '@/types/supabase'

type ProjectsProps = {
  projects: Database['public']['Tables']['project']['Row'][] | null
}

export default function Projects({ projects }: ProjectsProps) {
  const { colorScheme } = useMantineColorScheme()

  return (
    <AppLayout>
      <Grid gutter="xl">
        {sortBy(projects, 'position').map((project) => (
          <Grid.Col span={6} md={6} key={project.id}>
            <Anchor
              href={project.link}
              component={Link}
              underline={false}
              target={project.link.startsWith('http') ? '_blank' : '_self'}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                sx={(theme) => ({
                  '&:hover': {
                    boxShadow: theme.shadows.xl,
                    borderColor:
                      theme.colors.gray[colorScheme === 'dark' ? 7 : 4],
                  },
                })}>
                <Image
                  src={project.image}
                  height={80}
                  alt={`Preview of ${project.name}`}
                  fit="contain"
                />
                <Text weight={500} mt="md" mb="xs" lineClamp={1}>
                  {project.name}
                </Text>
                <Text size="sm" color="dimmed" lineClamp={2}>
                  {project.description}
                </Text>
              </Card>
            </Anchor>
          </Grid.Col>
        ))}
      </Grid>
    </AppLayout>
  )
}

export const getServerSideProps: GetServerSideProps<ProjectsProps> = async (
  ctx,
) => {
  const supabase = createServerSupabaseClient<Database>(ctx)

  const { data: projects } = await supabase
    .from('project')
    .select('*')
    .eq(IS_DEV ? '' : 'draft', false)

  return {
    props: {
      projects,
    },
  }
}
