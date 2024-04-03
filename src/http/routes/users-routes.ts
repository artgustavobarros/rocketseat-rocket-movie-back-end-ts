import { FastifyInstance } from 'fastify'
import { registerUser } from '../controllers/users/register'
import { authenticateUser } from '../controllers/users/authenticate'
import { updateUser } from '../controllers/users/update'
import { profileUser } from '../controllers/users/profile'
import { upload } from '@/utils/storage'
import { showAvatar } from '../controllers/users/show-avatar'
import { addUsersAvatar } from '../controllers/users/avatar'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', registerUser)
  app.post('/login', authenticateUser)
  app.post('/update', { onRequest: verifyJWT }, updateUser)
  app.get('/profile', { onRequest: verifyJWT }, profileUser)
  app.patch(
    '/avatar',
    { onRequest: verifyJWT, preHandler: upload.single('avatar') },
    addUsersAvatar,
  )
  app.get('/img/:filename', showAvatar)
}
