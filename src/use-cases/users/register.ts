import { UsersRepository } from '@/repositories/interfaces/user-repository'
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserUseCaseReply {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseReply> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHashed = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHashed,
    })

    return { user }
  }
}
