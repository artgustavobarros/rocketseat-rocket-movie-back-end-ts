import fastify from 'fastify'
import multer from 'fastify-multer'
import { userRoutes } from './http/routes/users-routes'
import { notesRoutes } from './http/routes/notes-routes'
import fastifyStatic from '@fastify/static'
import { UPLOAD_FOLDER } from './utils/storage'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'

export const app = fastify()

app.register(multer.contentParser)
app.register(fastifyStatic, {
  root: UPLOAD_FOLDER,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '1d' },
  cookie: { cookieName: 'refreshToken', signed: false },
})

app.register(fastifyCookie)

app.register(userRoutes, { prefix: '/users' })
app.register(notesRoutes, { prefix: '/notes' })

app.register(cors)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
