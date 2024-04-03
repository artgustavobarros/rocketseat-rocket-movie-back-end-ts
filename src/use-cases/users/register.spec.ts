import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { RegisterUserUseCase } from './register'
import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/utils/errors/user-already-exists'

let useCase: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(useCase)
  })

  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to hash a password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to create a user with same email then another', async () => {
    const email = 'johndoe@email.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
