import { randomUUID } from 'crypto'
import multer from 'fastify-multer'
import path from 'path'

export const TMP_FOLDER = path.resolve(__dirname, '..', 'temp')
export const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

export const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const filehash = randomUUID()
      const filename = `${filehash}-${file.originalname}`

      return callback(null, filename)
    },
  }),
}

export const upload = multer(MULTER)
