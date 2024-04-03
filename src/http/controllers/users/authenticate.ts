import { PrismaUsersRepository } from '@/repositories/in-prisma-repositories/in-prisma-users-repository'
import { AuthenticateUserUseCase } from '@/use-cases/users/authenticate'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = requestBodySchema.parse(request.body)

  try {
    const repository = new PrismaUsersRepository()
    const useCase = new AuthenticateUserUseCase(repository)

    const { user } = await useCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
