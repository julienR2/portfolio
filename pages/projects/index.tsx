import { Anchor, Card, Grid, Image, Text } from '@mantine/core'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { sortBy } from 'lodash'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

import AppLayout from '@/layouts/AppLayout'
import { Database } from '@/types/supabase'
import { IS_DEV } from '@/utils/constants'

type ProjectsProps = {
  projects: Database['public']['Tables']['project']['Row'][]
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <AppLayout>
      <Grid w="100%" gutter="xl">
        {sortBy(projects, '').map((project) => (
          <Grid.Col span={6} key={project.id}>
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
                    borderColor: theme.colors.gray[7],
                  },
                })}>
                <Card.Section>
                  <Image
                    src={project.image}
                    height={160}
                    alt={`Preview of ${project.name}`}
                    imageProps={{ style: { objectPosition: 'top' } }}
                  />
                </Card.Section>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient<Database>(ctx)

  const { data: projects } = await supabase
    .from('project')
    .select('*')
    .eq(IS_DEV ? '' : 'wip', false)

  return {
    props: {
      projects,
    },
  }
}
