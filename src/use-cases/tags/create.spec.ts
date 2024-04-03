import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { InMemoryTagsRepository } from '@/repositories/in-memory-repositories/in-memory-tags-repository'
import { CreateTagUserCase } from './create'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'

let usersUseCase: InMemoryUsersRepository
let tagsUseCase: InMemoryTagsRepository
let notesUseCase: InMemoryNotesRepository
let sut: CreateTagUserCase

describe('Create Tag Use Case', () => {
  beforeEach(() => {
    usersUseCase = new InMemoryUsersRepository()
    tagsUseCase = new InMemoryTagsRepository()
    notesUseCase = new InMemoryNotesRepository()
    sut = new CreateTagUserCase(tagsUseCase)
  })

  it('should be able to user create a tag', async () => {
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

    const tags = note.arr_tags.map(async (item) => {
      const { tag } = await sut.execute({
        name: item,
        user_id: user.id,
        notes_id: note.id,
      })
      expect(tag.id).toEqual(expect.any(String))
      return tag
    })

    expect(tags).toHaveLength(2)
  })
})
