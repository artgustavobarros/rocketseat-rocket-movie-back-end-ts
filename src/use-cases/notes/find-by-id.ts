import { NoteRepository } from '@/repositories/interfaces/notes-repository'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'
import { Note } from '@prisma/client'

interface FindNotesByIdRequest {
  id: string
}

interface FindNotesByIdReply {
  note: Note
}

export class FindNotesById {
  constructor(private notesRepository: NoteRepository) {}

  async execute({ id }: FindNotesByIdRequest): Promise<FindNotesByIdReply> {
    const note = await this.notesRepository.findById(id)

    if (!note) {
      throw new ContentNotFoundError()
    }

    return { note }
  }
}
