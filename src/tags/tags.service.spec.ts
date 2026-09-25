import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service.js';
import { Tag } from './entities/tag.entity.js';

const TAG_ID = 'd3b07384-d113-424a-a521-30596287f391';
const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const OTHER_USER = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

describe('TagsService', () => {
  let service: TagsService;
  let tagRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    tagRepository = {
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: TAG_ID, ...data })),
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getRepositoryToken(Tag), useValue: tagRepository },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('stamps the tag with the calling user', async () => {
      // The userId column existed but nothing ever set it.
      await service.create({ name: 'Cyberpunk' }, USER_ID);

      expect(tagRepository.create).toHaveBeenCalledWith({
        name: 'Cyberpunk',
        userId: USER_ID,
      });
    });

    it('rejects a duplicate name for the same user', async () => {
      tagRepository.findOne.mockResolvedValue({ id: 'existing', name: 'Cyberpunk' });

      await expect(service.create({ name: 'Cyberpunk' }, USER_ID)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(tagRepository.save).not.toHaveBeenCalled();
    });

    it('scopes the duplicate check to the owner, so two users may share a name', async () => {
      await service.create({ name: 'Cyberpunk' }, USER_ID);

      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Cyberpunk', userId: USER_ID },
      });
    });
  });

  describe('findAll', () => {
    it("returns only the caller's tags", async () => {
      await service.findAll(USER_ID);

      expect(tagRepository.find).toHaveBeenCalledWith({
        where: { userId: USER_ID },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('scopes the lookup by owner', async () => {
      tagRepository.findOne.mockResolvedValue({ id: TAG_ID, userId: USER_ID });

      await service.findOne(TAG_ID, USER_ID);

      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { id: TAG_ID, userId: USER_ID },
      });
    });

    it("throws NotFoundException for another user's tag", async () => {
      tagRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(TAG_ID, OTHER_USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('renames a tag the caller owns', async () => {
      tagRepository.findOne.mockResolvedValueOnce({
        id: TAG_ID,
        name: 'Old',
        userId: USER_ID,
      });

      await service.update(TAG_ID, { name: 'New' }, USER_ID);

      expect(tagRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: TAG_ID, name: 'New' }),
      );
    });

    it("refuses to update another user's tag", async () => {
      tagRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(TAG_ID, { name: 'New' }, OTHER_USER),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(tagRepository.save).not.toHaveBeenCalled();
    });

    it('rejects renaming onto another existing tag name', async () => {
      tagRepository.findOne
        .mockResolvedValueOnce({ id: TAG_ID, name: 'Old', userId: USER_ID })
        .mockResolvedValueOnce({ id: 'other-tag', name: 'Taken' });

      await expect(
        service.update(TAG_ID, { name: 'Taken' }, USER_ID),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('allows saving a tag without changing its name', async () => {
      tagRepository.findOne.mockResolvedValueOnce({
        id: TAG_ID,
        name: 'Same',
        userId: USER_ID,
      });

      await service.update(TAG_ID, { name: 'Same' }, USER_ID);

      // Only the ownership lookup should have run, not a duplicate-name check.
      expect(tagRepository.findOne).toHaveBeenCalledTimes(1);
      expect(tagRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes a tag the caller owns', async () => {
      const tag = { id: TAG_ID, userId: USER_ID };
      tagRepository.findOne.mockResolvedValue(tag);

      await service.remove(TAG_ID, USER_ID);

      expect(tagRepository.remove).toHaveBeenCalledWith(tag);
    });

    it("refuses to delete another user's tag", async () => {
      tagRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(TAG_ID, OTHER_USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(tagRepository.remove).not.toHaveBeenCalled();
    });
  });
});
