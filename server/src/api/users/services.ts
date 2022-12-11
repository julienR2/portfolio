import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

import { prisma } from '../../utils/database'

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  })

export const createUserByEmailAndPassword = (
  user: Pick<User, 'email' | 'password'>,
) => {
  user.password = bcrypt.hashSync(user.password, 12)

  return prisma.user.create({
    data: user,
  })
}

export const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: {
      id,
    },
  })
