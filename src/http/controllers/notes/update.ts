import { prisma } from '@/lib'
import { PrismaNotesRepository } from '@/repositories/in-prisma-repositories/in-prisma-notes-repository'
import { UpdateNotesUseCase } from '@/use-cases/notes/update'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateNote(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    rating: z.coerce.number().optional(),
    arr_tags: z.array(z.string()).optional(),
  })

  const requestParamsSchema = z.object({
    id: z.string(),
  })

  const { title, description, rating, arr_tags } = requestBodySchema.parse(
    request.body,
  )

  const { id } = requestParamsSchema.parse(request.params)

  try {
    const repository = new PrismaNotesRepository()
    const useCase = new UpdateNotesUseCase(repository)

    const { note } = await useCase.execute({
      id,
      title,
      description,
      rating,
      arr_tags,
    })

    await prisma.note.update({
      where: { id },
      data: { title, description, rating, arr_tags },
    })

    return reply.status(200).send({ note })
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
