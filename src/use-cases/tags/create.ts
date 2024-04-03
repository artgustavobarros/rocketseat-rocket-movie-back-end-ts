import { TagsRepository } from '@/repositories/interfaces/tags-repository'
import { Tags } from '@prisma/client'

interface CreateTagUserCaseRequest {
  name: string
  user_id: string
  notes_id: string
}

interface CreateTagUserCaseReply {
  tag: Tags
}

export class CreateTagUserCase {
  constructor(private tagsRepository: TagsRepository) {}

  async execute({
    name,
    user_id,
    notes_id,
  }: CreateTagUserCaseRequest): Promise<CreateTagUserCaseReply> {
    const tag = await this.tagsRepository.create({
      name,
      user_id,
      notes_id,
    })

    return { tag }
  }
}
