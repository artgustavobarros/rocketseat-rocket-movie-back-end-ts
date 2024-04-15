import { prisma } from '@/lib'
import { DiskStorageRepository } from '@/repositories/in-disk-storage-repositories/disk-storage'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function addUsersAvatar(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestFileParas = z.object({
    filename: z.string(),
  })

  const { filename } = requestFileParas.parse(request.file)

  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
    })

    if (!user) {
      throw new InvalidCredentialError()
    }

    const diskStorage = new DiskStorageRepository()

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const avatar = await diskStorage.saveFile(filename)
    const updatedAt = new Date()

    await prisma.user.update({
      where: { id: request.user.sub },
      data: { avatar, updated_at: updatedAt },
    })

    return reply.status(200).send({ user })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
