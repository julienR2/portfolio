import { Anchor, Box, Stack, Text, Title } from '@mantine/core'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'

import About from '@/components/About'
import AppLayout from '@/layouts/AppLayout'
import { Database } from '@/types/supabase'
import { IS_DEV } from '@/utils/constants'
import { formatDate } from '@/utils/date'

type IndexProps = {
  posts: Omit<Database['public']['Tables']['post']['Row'], 'markdown'>[] | null
}

export default function Index({ posts }: IndexProps) {
  return (
    <AppLayout>
      <Box mb="xl">
        <About />
      </Box>
      <Stack mt="xl" spacing="xl">
        {posts?.map((post) => (
          <Box key={post.id}>
            <Anchor href={`/posts/${post.slug}`} c="teal">
              <Title>{post.title}</Title>
            </Anchor>
            <Text c="dimmed" fz="sm">
              {formatDate(post.created_at)}
            </Text>
          </Box>
        ))}
      </Stack>
    </AppLayout>
  )
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  ctx,
) => {
  const supabase = createServerSupabaseClient<Database>(ctx)

  const { data: posts } = await supabase
    .from('post')
    .select('id,title,created_at,slug,draft')
    .order('created_at', { ascending: false })
    .eq(IS_DEV ? '' : 'draft', false)

  return {
    props: {
      posts,
    },
  }
}
