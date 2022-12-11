import jwt from 'jsonwebtoken'

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || '', {
    expiresIn: '5m',
  })
}

const generateRefreshToken = (userId: string, jti: string) => {
  return jwt.sign(
    {
      userId,
      jti,
    },
    process.env.JWT_REFRESH_SECRET || '',
    {
      expiresIn: '4h',
    },
  )
}

export const generateTokens = (userId: string, jti: string) => {
  const accessToken = generateAccessToken(userId)
  const refreshToken = generateRefreshToken(userId, jti)

  return {
    accessToken,
    refreshToken,
  }
}
