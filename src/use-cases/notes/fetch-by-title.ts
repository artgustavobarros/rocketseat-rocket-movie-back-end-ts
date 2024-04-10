import { NoteRepository } from '@/repositories/interfaces/notes-repository'
import { Note } from '@prisma/client'

interface FetchNotesByTitleUseCaseRequest {
  title: string
}

interface FetchNotesByTitleUseCaseReply {
  notes: Note[]
}

export class FetchNotesByTitleUseCase {
  constructor(private notesRepository: NoteRepository) {}

  async execute({
    title,
  }: FetchNotesByTitleUseCaseRequest): Promise<FetchNotesByTitleUseCaseReply> {
    const notes = await this.notesRepository.findByTitle(title)

    return { notes }
  }
}
