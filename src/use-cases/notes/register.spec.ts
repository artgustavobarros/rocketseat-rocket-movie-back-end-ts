import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { RegisterNoteUseCase } from './register'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'

let usersUseCase: InMemoryUsersRepository
let notesUseCase: InMemoryNotesRepository
let sut: RegisterNoteUseCase

describe('Register Note Use Case', () => {
  beforeEach(() => {
    usersUseCase = new InMemoryUsersRepository()
    notesUseCase = new InMemoryNotesRepository()
    sut = new RegisterNoteUseCase(notesUseCase, usersUseCase)
  })

  it('should be able to user create a note', async () => {
    const user = await usersUseCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const { note } = await sut.execute({
      user_id: user.id,
      title: 'Test title',
      description: 'Test description',
      rating: 4,
      arr_tags: ['test_tag_1', 'test_tag_2'],
    })

    expect(note.id).toEqual(expect.any(String))
  })
})
