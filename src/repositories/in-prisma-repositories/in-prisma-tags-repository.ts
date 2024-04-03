import { Prisma } from '@prisma/client'
import { TagsRepository } from '../interfaces/tags-repository'
import { prisma } from '@/lib'

export class PrismaTagsRepository implements TagsRepository {
  async create(data: Prisma.TagsUncheckedCreateInput) {
    const tag = await prisma.tags.create({ data })

    return tag
  }
}
