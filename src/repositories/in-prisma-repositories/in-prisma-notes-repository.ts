import { Prisma } from '@prisma/client'
import { NoteRepository } from '../interfaces/notes-repository'
import { prisma } from '@/lib'

export class PrismaNotesRepository implements NoteRepository {
  async create(data: Prisma.NoteUncheckedCreateInput) {
    const note = await prisma.note.create({ data })

    return note
  }

  async findByTitle(title: string) {
    const notes = await prisma.note.findMany({ where: { title } })

    return notes
  }

  async findById(id: string) {
    const note = await prisma.note.findUnique({ where: { id } })

    return note
  }

  async delete(id: string) {
    await prisma.note.delete({ where: { id } })
  }
}
