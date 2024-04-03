import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryNotesRepository } from '@/repositories/in-memory-repositories/in-memory-notes-repository'
import { DeleteNoteUseCase } from './delete'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repositories/in-memory-users-repository'
import { hash } from 'bcryptjs'

let useCase: InMemoryNotesRepository
let sut: DeleteNoteUseCase

describe('Fetch Notes By Title Use Case', () => {
  beforeEach(() => {
    useCase = new InMemoryNotesRepository()
    sut = new DeleteNoteUseCase(useCase)
  })

  it('should be able to delete a note', async () => {
    const userUseCase = new InMemoryUsersRepository()

    const user = await userUseCase.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    for (let i = 1; i <= 5; i++) {
      await useCase.create({
        id: `${i}`,
        user_id: user.id,
        title: `test${i}`,
        description: 'Test description',
        rating: 4,
        arr_tags: ['test_tag_1', 'test_tag_2'],
      })
    }

    await sut.execute({ id: '1' })

    const allNotes = useCase.items.length

    expect(allNotes).toBe(4)
  })
})
