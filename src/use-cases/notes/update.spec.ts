import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { UpdateNotesUseCase } from './update'

let usersUseCase: InMemoryUsersRepository
let notesUseCase: InMemoryNotesRepository
let sut: UpdateNotesUseCase

describe('Update Note Use Case', () => {
  beforeEach(() => {
    usersUseCase = new InMemoryUsersRepository()
    notesUseCase = new InMemoryNotesRepository()
    sut = new UpdateNotesUseCase(notesUseCase)
  })

  it('should be able to change a note', async () => {
    const user = await usersUseCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const note = await notesUseCase.create({
      user_id: user.id,
      title: 'Test title',
      description: 'Test description',
      rating: 4,
      arr_tags: ['test_tag_1', 'test_tag_2'],
    })

    await sut.execute({
      id: note.id,
      title: 'changed title',
    })

    expect(note.title).toEqual('changed title')
  })
})
