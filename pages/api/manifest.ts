import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { icon_path, title, url } = req.query

  res.status(200).json({
    short_name: title,
    name: title,
    description: "Julien's corner",
    icons: [
      {
        src: icon_path + '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: icon_path + '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    id: url,
    start_url: url,
    scope: url,
    background_color: '#1A1B1E',
    theme_color: '#1A1B1E',
    display: 'standalone',
  })
}
