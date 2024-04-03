import { prisma } from '@/lib'
import { PrismaUsersRepository } from '@/repositories/in-prisma-repositories/in-prisma-users-repository'
import { UpdateUserUseCase } from '@/use-cases/users/update'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    old_password: z.string().optional(),
    new_password: z.string().optional(),
  })

  const { name, email, old_password, new_password } = requestBodySchema.parse(
    request.body,
  )

  try {
    const repository = new PrismaUsersRepository()
    const useCase = new UpdateUserUseCase(repository)

    const { user } = await useCase.execute({
      id: request.user.sub,
      name,
      email,
      old_password,
      new_password,
    })

    await prisma.user.update({
      where: { id: request.user.sub },
      data: { name: user.name, email: user.email, password: user.password },
    })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send({ message: 'Users updated' })
}
