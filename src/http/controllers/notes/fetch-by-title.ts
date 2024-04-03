import { PrismaNotesRepository } from '@/repositories/in-prisma-repositories/in-prisma-notes-repository'
import { FetchNotesByTitleUseCase } from '@/use-cases/notes/fetch-by-title'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function findNoteByTitle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    title: z.string(),
  })

  const { title } = requestQuerySchema.parse(request.query)

  try {
    const repository = new PrismaNotesRepository()
    const useCase = new FetchNotesByTitleUseCase(repository)

    const { notes } = await useCase.execute({ title })

    return reply.status(200).send({ notes })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
