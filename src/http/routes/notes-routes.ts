import { FastifyInstance } from 'fastify'
import { registerNotes } from '../controllers/notes/register'
import { findNoteById } from '../controllers/notes/find-by-id'
import { findNoteByTitle } from '../controllers/notes/fetch-by-title'
import { deleteNote } from '../controllers/notes/delete'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function notesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/register', registerNotes)
  app.get('/findbyid', findNoteById)
  app.get('/findbytitle', findNoteByTitle)
  app.delete('/:id', deleteNote)
}
