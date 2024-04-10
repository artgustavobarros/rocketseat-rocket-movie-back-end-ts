import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { FetchAllNotes } from './fetch-all-notes'

let useCase: InMemoryNotesRepository
let sut: FetchAllNotes

describe('Fetch All Notes Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryNotesRepository()
    sut = new FetchAllNotes(useCase)
  })

  it('should be able to fetch all notes by user id', async () => {
    const createUser = new InMemoryUsersRepository()

    const user = await createUser.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    for (let i = 1; i <= 5; i++) {
      await useCase.create({
        user_id: user.id,
        title: 'test title',
        description: 'test description',
        rating: 4,
        arr_tags: ['tag_1', 'tag_2'],
      })
    }

    const { notes } = await sut.execute({ user_id: user.id })

    expect(notes).toHaveLength(5)
  })
})
