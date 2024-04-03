import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { UpdateUserUseCase } from './update'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUserUseCase } from './authenticate'
import { InvalidCredentialError } from '@/utils/errors/invalid-credentials-error'

let useCase: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(useCase)
  })

  it('should be able to change users name', async () => {
    await useCase.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      id: '1',
      name: 'Changed Name',
    })

    expect(user.name).toBe('Changed Name')
  })

  it('should be able to change users email', async () => {
    await useCase.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      id: '1',
      email: 'changedemail@email.com',
    })

    expect(user.email).toBe('changedemail@email.com')
  })

  it('should be able to change users password', async () => {
    const authenticate = new AuthenticateUserUseCase(useCase)

    await useCase.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    await sut.execute({
      id: '1',
      old_password: '123456',
      new_password: 'changed_password',
    })

    expect(async () => {
      await authenticate.execute({
        email: 'johndoe@email.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to change users credentials with invalid id', async () => {
    await useCase.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    expect(async () => {
      await sut.execute({
        id: 'invalid id',
        email: 'changedemail@email.com',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
