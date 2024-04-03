import { TMP_FOLDER, UPLOAD_FOLDER } from '@/utils/storage'
import fs from 'fs'
import path from 'path'

export class DiskStorageRepository {
  async saveFile(file: string) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER, file),
    )

    return file
  }

  async deleteFile(file: string) {
    const filePath = path.resolve(UPLOAD_FOLDER, file)
    try {
      await fs.promises.stat(filePath)
    } catch {}

    await fs.promises.unlink(filePath)
  }
}
