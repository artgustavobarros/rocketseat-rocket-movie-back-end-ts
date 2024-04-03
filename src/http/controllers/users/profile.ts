import { PrismaUsersRepository } from '@/repositories/in-prisma-repositories/in-prisma-users-repository'
import { ProfileUserUseCase } from '@/use-cases/users/profile'
import { UserNotFoundError } from '@/utils/errors/user-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profileUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const repository = new PrismaUsersRepository()
    const useCase = new ProfileUserUseCase(repository)

    const { user } = await useCase.execute({
      id: request.user.sub,
    })

    return reply.status(200).send({ user: { ...user, password: '*****' } })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
