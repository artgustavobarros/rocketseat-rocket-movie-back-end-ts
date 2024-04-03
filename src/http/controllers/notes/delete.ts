import { PrismaNotesRepository } from '@/repositories/in-prisma-repositories/in-prisma-notes-repository'
import { DeleteNoteUseCase } from '@/use-cases/notes/delete'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteNote(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  try {
    const repository = new PrismaNotesRepository()
    const useCase = new DeleteNoteUseCase(repository)

    await useCase.execute({ id })

    return reply.status(202).send({ message: 'note deleted' })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
