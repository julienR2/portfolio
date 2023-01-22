import { Media } from '@prisma/client'

import { prisma } from '../../utils/database'

export const createMedia = (media: Media, tags?: string[]) =>
  prisma.media.create({
    data: {
      ...media,
      tags: {
        connectOrCreate: tags?.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  })
