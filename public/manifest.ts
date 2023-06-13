import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query
  console.log('query', query)

  res.status(200).json({
    short_name: 'Nowmad',
    name: 'Nowmad',
    description: "Julien's blog",
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    id: '/',
    start_url: '/',
    scope: '/',
    background_color: '#1A1B1E',
    theme_color: '#1A1B1E',
    display: 'standalone',
  })
}
