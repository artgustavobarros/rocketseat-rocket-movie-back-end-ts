import { NotesRepository } from '@/repositories/interfaces/notes-repository'
import { UsersRepository } from '@/repositories/interfaces/user-repository'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { Notes } from '@prisma/client'

interface RegisterNoteUseCaseRequest {
  user_id: string
  title: string
  description?: string
  rating: number
  arr_tags: string[]
}

interface RegisterNoteUseCaseReply {
  note: Notes
}

export class RegisterNoteUseCase {
  constructor(
    private notesRepository: NotesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    user_id,
    title,
    description,
    rating,
    arr_tags,
  }: RegisterNoteUseCaseRequest): Promise<RegisterNoteUseCaseReply> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new InvalidCredentialError()
    }

    const note = await this.notesRepository.create({
      title,
      description,
      rating,
      arr_tags,
      user_id: user.id,
    })

    return { note }
  }
}
