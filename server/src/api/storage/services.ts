import { Media } from '@prisma/client'

import { prisma } from '../../utils/database'

export const createOrUpdateMedia = (media: Omit<Media, 'id'>) =>
  prisma.media.upsert({
    where: {
      path: media.path,
    },
    create: media,
    update: media,
  })
