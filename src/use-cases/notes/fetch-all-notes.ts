import { NoteRepository } from '@/repositories/interfaces/notes-repository'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'
import { Note } from '@prisma/client'

interface FetchAllNotesRequest {
  user_id: string
}

interface FetchAllNotesReply {
  notes: Note[]
}

export class FetchAllNotes {
  constructor(private notesRepository: NoteRepository) {}

  async execute({
    user_id,
  }: FetchAllNotesRequest): Promise<FetchAllNotesReply> {
    const notes = await this.notesRepository.fetchAll(user_id)

    if (!notes) {
      throw new ContentNotFoundError()
    }

    return { notes }
  }
}
