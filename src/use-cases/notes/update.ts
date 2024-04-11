import { NoteRepository } from '@/repositories/interfaces/notes-repository'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'
import { Note } from '@prisma/client'

interface UpdateNotesUseCaseRequest {
  id: string
  title?: string
  description?: string
  rating?: number
  arr_tags?: string[]
}

interface UpdateNotesUseCaseReply {
  note: Note
}

export class UpdateNotesUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute({
    id,
    title,
    description,
    rating,
    arr_tags,
  }: UpdateNotesUseCaseRequest): Promise<UpdateNotesUseCaseReply> {
    const note = await this.noteRepository.findById(id)

    if (!note) {
      throw new ContentNotFoundError()
    }

    note.title = title ?? note.title
    note.description = description ?? note.description
    note.rating = rating ?? note.rating
    note.arr_tags = arr_tags ?? note.arr_tags

    note.updated_at = new Date()

    return { note }
  }
}
