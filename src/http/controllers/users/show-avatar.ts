import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function showAvatar(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    filename: z.string(),
  })

  const { filename } = requestParamsSchema.parse(request.params)

  try {
    return reply.sendFile(filename)
  } catch (err) {}
}
