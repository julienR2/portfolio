export type JwtPayload = {
  jti: string
  userId: string
}

declare global {
  namespace Express {
    export interface Request {
      payload?: JwtPayload
    }
  }
}
