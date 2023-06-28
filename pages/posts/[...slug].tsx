import { Box, Skeleton, Title, TypographyStylesProvider } from '@mantine/core'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { marked } from 'marked'
import { GetServerSideProps } from 'next'

import About from '@/components/About'
import AppLayout from '@/layouts/AppLayout'
import { Database } from '@/types/supabase'

type PostProps = {
  post: Database['public']['Tables']['post']['Row'] | null
}

export default function Post({ post }: PostProps) {
  return (
    <AppLayout>
      <Box mt="xl" mb="xl">
        {post ? (
          <Title>{post.title}</Title>
        ) : (
          <Skeleton height={28} my={8} w={500} />
        )}
      </Box>
      <Box my="xl">
        <TypographyStylesProvider variant="post">
          <Skeleton visible={!post}>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(post?.markdown || ''),
              }}
            />
          </Skeleton>
        </TypographyStylesProvider>
      </Box>
      <Box mt="xl">
        <About />
      </Box>
    </AppLayout>
  )
}

export const getServerSideProps: GetServerSideProps<PostProps> = async (
  ctx,
) => {
  const { slug } = ctx.query
  const supabase = createServerSupabaseClient<Database>(ctx)

  const { data: post } = await supabase
    .from('post')
    .select('*')
    .eq('slug', slug)
    .single()

  return {
    props: {
      post,
    },
  }
}
