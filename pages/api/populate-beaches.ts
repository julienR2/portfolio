import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { JSDOM } from 'jsdom'

import { Database } from '@/types/supabase'
import { DatabaseRow } from '@/types/utils'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  })
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser()

  if (!user) return res.status(404).send('')

  try {
    const response = await fetch('https://beachcam.meo.pt/livecams/')
    const html = await response.text()
    const { document } = new JSDOM(html).window

    const rawLinks = await Promise.all(
      [...document.querySelectorAll('.tab-content .beachesContainer')].map(
        (el) => {
          const location =
            el.previousElementSibling?.textContent
              ?.replaceAll('\n', '')
              .replaceAll(/(^ *)|( *$)|\n/g, '') || ''

          return Promise.all(
            [...el.querySelectorAll('a')].map((el) =>
              fetch('https://beachcam.meo.pt' + el.href)
                .then((res) => res.text())
                .then((html): DatabaseRow<'beach_cam'> => {
                  const beachName =
                    html.match(/var name = '(?<beachName>.*?)';/)?.groups
                      ?.beachName || ''

                  return {
                    id: beachName,
                    name: el.text,
                    url: 'https://beachcam.meo.pt' + el.href,
                    video_url:
                      'https://video-auth1.iol.pt/beachcam/' +
                      html.match(/var name = '(?<beachName>.*?)';/)?.groups
                        ?.beachName +
                      '/playlist.m3u8',
                    location,
                  }
                }),
            ),
          )
        },
      ),
    )

    const links: DatabaseRow<'beach_cam'>[] = rawLinks.flat()

    const { data, error } = await supabaseServerClient
      .from('beach_cams')
      .upsert(links)
      .select()

    if (error) throw error

    return res.status(200).send({ data })
  } catch (error) {
    return res.status(500).send({ error })
  }
}
