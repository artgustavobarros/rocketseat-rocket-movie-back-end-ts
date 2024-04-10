import { PrismaNotesRepository } from '@/repositories/in-prisma-repositories/in-prisma-notes-repository'
import { FetchAllNotes } from '@/use-cases/notes/fetch-all-notes'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchNotesByUserId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const repository = new PrismaNotesRepository()
    const useCase = new FetchAllNotes(repository)

    const { notes } = await useCase.execute({ user_id: request.user.sub })

    return reply.status(200).send({ notes })
  } catch (err) {
    if (err instanceof ContentNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
