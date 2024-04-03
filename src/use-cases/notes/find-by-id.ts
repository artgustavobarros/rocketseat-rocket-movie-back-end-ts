import { NotesRepository } from '@/repositories/interfaces/notes-repository'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'
import { Notes } from '@prisma/client'

interface FindNotesByIdRequest {
  id: string
}

interface FindNotesByIdReply {
  note: Notes
}

export class FindNotesById {
  constructor(private notesRepository: NotesRepository) {}

  async execute({ id }: FindNotesByIdRequest): Promise<FindNotesByIdReply> {
    const note = await this.notesRepository.findById(id)

    if (!note) {
      throw new ContentNotFoundError()
    }

    return { note }
  }
}
