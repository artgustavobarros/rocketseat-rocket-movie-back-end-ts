import { NoteRepository } from '@/repositories/interfaces/notes-repository'

interface DeleteNoteUseCaseRequest {
  id: string
}

export class DeleteNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute({ id }: DeleteNoteUseCaseRequest): Promise<void> {
    await this.noteRepository.delete(id)
  }
}
