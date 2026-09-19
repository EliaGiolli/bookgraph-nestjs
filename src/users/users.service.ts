import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// The entity as it may safely leave the service: the hash is never part of a
// response body.
export type SafeUser = Omit<User, 'hashedPassword'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private readonly saltRounds = 10;

  // Hashing lives here so that every route creating a user — /auth/register and
  // the ADMIN-only POST /users — goes through the same bcrypt path and no caller
  // can supply a pre-computed hash.
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { password, ...userData } = createUserDto;

    const existingUser = await this.findByUsername(userData.username);
    if (existingUser) {
      throw new ConflictException('Lo username esiste già');
    }

    const newUser = this.usersRepository.create({
      ...userData,
      hashedPassword: await bcrypt.hash(password, this.saltRounds),
    });

    const { hashedPassword: _hashedPassword, ...savedUser } =
      await this.usersRepository.save(newUser);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  // `hashedPassword` is `select: false` on the entity, so a plain findOne never
  // returns it. Credential checks need it explicitly re-selected — this is the
  // only method that does, and it must not be used to build a response.
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.hashedPassword')
      .where('user.username = :username', { username })
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await this.usersRepository.remove(user);
  }
}
