import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { FindNotesById } from './find-by-id'
import { ContentNotFoundError } from '@/utils/errors/content-not-found'

let useCase: InMemoryNotesRepository
let sut: FindNotesById

describe('Found Note By Title Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryNotesRepository()
    sut = new FindNotesById(useCase)
  })

  it('should be able to find note by id', async () => {
    const createUser = new InMemoryUsersRepository()

    const user = await createUser.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    await useCase.create({
      id: '1',
      user_id: user.id,
      title: 'test_title_1',
      description: 'test description',
      rating: 4,
      arr_tags: ['tag_1', 'tag_2'],
    })

    const { note } = await sut.execute({ id: '1' })

    expect(note).toEqual(
      expect.objectContaining({
        id: '1',
        user_id: user.id,
        title: 'test_title_1',
        description: 'test description',
        rating: 4,
        arr_tags: ['tag_1', 'tag_2'],
      }),
    )
  })

  it('should not be able to find note by inexistent id', async () => {
    const createUser = new InMemoryUsersRepository()

    const user = await createUser.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    await useCase.create({
      id: '1',
      user_id: user.id,
      title: 'test_title_1',
      description: 'test description',
      rating: 4,
      arr_tags: ['tag_1', 'tag_2'],
    })

    expect(async () => {
      await sut.execute({ id: 'inexistent_id' })
    }).rejects.toBeInstanceOf(ContentNotFoundError)
  })
})
