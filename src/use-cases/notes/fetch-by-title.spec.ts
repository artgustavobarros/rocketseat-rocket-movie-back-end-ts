import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { FetchNotesByTitleUseCase } from './fetch-by-title'

let useCase: InMemoryNotesRepository
let sut: FetchNotesByTitleUseCase

describe('Fetch Notes By Title Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryNotesRepository()
    sut = new FetchNotesByTitleUseCase(useCase)
  })

  it('should be able to fetch notes by title', async () => {
    const createUser = new InMemoryUsersRepository()

    const user = await createUser.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    for (let i = 1; i <= 10; i++) {
      await useCase.create({
        user_id: user.id,
        title: `test_title_${Math.floor(i / 2)}`,
        description: 'test description',
        rating: 4,
        arr_tags: ['tag_1', 'tag_2'],
      })
    }

    const { notes } = await sut.execute({
      title: 'test_title_0',
    })

    expect(notes).toHaveLength(1)
  })
})
