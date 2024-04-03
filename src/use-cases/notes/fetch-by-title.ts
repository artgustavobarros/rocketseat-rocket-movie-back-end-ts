import { NotesRepository } from '@/repositories/interfaces/notes-repository'
import { Notes } from '@prisma/client'

interface FetchNotesByTitleUseCaseRequest {
  title: string
}

interface FetchNotesByTitleUseCaseReply {
  notes: Notes[]
}

export class FetchNotesByTitleUseCase {
  constructor(private notesRepository: NotesRepository) {}

  async execute({
    title,
  }: FetchNotesByTitleUseCaseRequest): Promise<FetchNotesByTitleUseCaseReply> {
    const notes = await this.notesRepository.findByTitle(title)

    return { notes }
  }
}
