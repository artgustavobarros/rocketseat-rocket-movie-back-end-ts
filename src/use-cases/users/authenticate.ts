import { UsersRepository } from '@/repositories/interfaces/user-repository'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUserUseCaseReply {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseReply> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialError()
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      throw new InvalidCredentialError()
    }

    return { user }
  }
}
