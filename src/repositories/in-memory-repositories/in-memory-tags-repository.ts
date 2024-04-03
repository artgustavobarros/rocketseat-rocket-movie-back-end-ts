import { Prisma, Tag } from '@prisma/client'
import { TagsRepository } from '../interfaces/tags-repository'
import { randomUUID } from 'crypto'

export class InMemoryTagsRepository implements TagsRepository {
  public items: Tag[] = []

  async create(data: Prisma.TagUncheckedCreateInput) {
    const tag = {
      id: data.id ?? randomUUID(),
      name: data.name,
      notes_id: data.notes_id,
      user_id: data.user_id,
    }

    this.items.push(tag)

    return tag
  }
}
