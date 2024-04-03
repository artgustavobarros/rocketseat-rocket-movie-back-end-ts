import { UsersRepository } from '@/repositories/interfaces/user-repository'
import { UserNotFoundError } from '@/utils/errors/user-not-found-error'
import { User } from '@prisma/client'

interface ProfileUserUseCaseRequest {
  id: string
}
interface ProfileUserUseCaseReply {
  user: User
}

export class ProfileUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: ProfileUserUseCaseRequest): Promise<ProfileUserUseCaseReply> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return { user }
  }
}
