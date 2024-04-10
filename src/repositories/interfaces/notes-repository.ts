import { Note, Prisma } from '@prisma/client'

export interface NoteRepository {
  create(data: Prisma.NoteUncheckedCreateInput): Promise<Note>
  fetchAll(user_id: string): Promise<Note[] | null>
  findByTitle(title: string): Promise<Note[]>
  findById(id: string): Promise<Note | null>
  delete(id: string): Promise<void>
}
