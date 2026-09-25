import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';

// Tags are per-user: tags.userId is NOT NULL with a CASCADE FK to users, so
// every query here is scoped to the caller.
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto, userId: string): Promise<Tag> {
    await this.assertNameIsFree(createTagDto.name, userId);

    const tag = this.tagRepository.create({ ...createTagDto, userId });

    return await this.tagRepository.save(tag);
  }

  async findAll(userId: string): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id, userId } });

    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found or unauthorized`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto, userId: string): Promise<Tag> {
    const tag = await this.findOne(id, userId);

    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      await this.assertNameIsFree(updateTagDto.name, userId, id);
    }

    Object.assign(tag, updateTagDto);

    return await this.tagRepository.save(tag);
  }

  async remove(id: string, userId: string): Promise<void> {
    const tag = await this.findOne(id, userId);

    // book_tags.tagId cascades, so the tag's book associations go with it.
    await this.tagRepository.remove(tag);
  }

  // Two identically named tags belonging to one user are indistinguishable in a
  // UI. Enforced in application code; there is no unique index on (userId, name).
  private async assertNameIsFree(
    name: string,
    userId: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.tagRepository.findOne({
      where: excludeId
        ? { name, userId, id: Not(excludeId) }
        : { name, userId },
    });

    if (existing) {
      throw new ConflictException(`A tag named "${name}" already exists`);
    }
  }
}
