import { UsersRepository } from '@/repositories/interfaces/user-repository'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'

interface UpdateUserUseCaseRequest {
  id: string
  name?: string
  email?: string
  old_password?: string
  new_password?: string
}
interface UpdateUserUseCaseReply {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    old_password,
    new_password,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseReply> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new InvalidCredentialError()
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (old_password && new_password) {
      const passwordMatches = await compare(old_password, user.password)

      if (!passwordMatches) {
        throw new InvalidCredentialError()
      }

      const newPasswordHashed = await hash(new_password, 6)

      user.password = newPasswordHashed
    }

    user.updated_at = new Date()
    return { user }
  }
}
