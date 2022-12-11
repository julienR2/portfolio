import { hashToken } from '../../utils'
import { prisma } from '../../utils/database'

type RefreshTokenParams = {
  jti: string
  refreshToken: string
  userId: string
}

export const addRefreshTokenToWhitelist = ({
  jti,
  refreshToken,
  userId,
}: RefreshTokenParams) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  })
}

export const findRefreshTokenById = (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  })
}

export const deleteRefreshToken = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  })
}

export const revokeTokens = (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  })
}
