import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const julien = await prisma.user.upsert({
    where: { email: 'julien.rougeron@gmail.com' },
    update: {},
    create: {
      id: 'fbf7b2ec-ec2a-46a3-9be7-812d6b9e9c26',
      email: 'julien.rougeron@gmail.com',
      password: bcrypt.hashSync('Nowmad2106', 12),
    },
  })
  const shandra = await prisma.user.upsert({
    where: { email: 'shandra.aich@gmail.com' },
    update: {},
    create: {
      id: 'dd56bd21-e87f-4e88-b181-b4fb7e1abde3',
      email: 'shandra.aich@gmail.com',
      password: bcrypt.hashSync('Nowmad2106', 12),
    },
  })
  console.log({ julien, shandra })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
