import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'

let useCase: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(useCase)
  })

  it('should be able to authenticate a user', async () => {
    await useCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with a wrong email', async () => {
    await useCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'wrongemail@email.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    await useCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        email: 'johndoe@email.com',
        password: 'wrongpassword',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
