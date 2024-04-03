import { PrismaUsersRepository } from '@/repositories/in-prisma-repositories/in-prisma-users-repository'
import { RegisterUserUseCase } from '@/use-cases/users/register'
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const registerUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    const repository = new PrismaUsersRepository()
    const useCase = new RegisterUserUseCase(repository)

    await useCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  return reply.status(201).send({ message: 'Sucessfully registred' })
}
