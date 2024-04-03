import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { ProfileUserUseCase } from './profile'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserNotFoundError } from '@/utils/errors/user-not-found-error'

let useCase: InMemoryUsersRepository
let sut: ProfileUserUseCase

describe('Profile User Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryUsersRepository()
    sut = new ProfileUserUseCase(useCase)
  })

  it('should able to find a user by id', async () => {
    const newUser = await useCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const { user } = await sut.execute({
      id: newUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not able to find a user by wrong id', async () => {
    await useCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        id: 'wrong_id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
