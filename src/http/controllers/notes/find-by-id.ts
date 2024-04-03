import { PrismaNotesRepository } from '@/repositories/in-prisma-repositories/in-prisma-notes-repository'
import { FindNotesById } from '@/use-cases/notes/find-by-id'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function findNoteById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    id: z.string(),
  })

  const { id } = requestQuerySchema.parse(request.query)

  try {
    const repository = new PrismaNotesRepository()
    const useCase = new FindNotesById(repository)

    const { note } = await useCase.execute({ id })

    return reply.status(200).send({ note })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
