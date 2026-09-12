import * as typeorm from 'typeorm';
import { Book } from '../../books/entities/books.entity.js';
import { UserRole } from '../../common/types/enums/user-role.enum.js';
import { Tag } from '../../tags/entities/tag.entity.js';

@typeorm.Entity('users')
export class User {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'varchar', length: 100 })
  name: string;

  @typeorm.Column({ type: 'varchar', length: 100 })
  lastName: string;

  @typeorm.Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @typeorm.Column({ type: 'varchar', select: false }) // Nasconde l'hash dalle query standard per sicurezza
  hashedPassword: string;

  @typeorm.Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @typeorm.OneToMany(() => Book, (book) => book.user)
  books: typeorm.Relation<Book[]>;

  @typeorm.OneToMany(() => Tag, (tag) => tag.user)
  tags: typeorm.Relation<Tag[]>;

  @typeorm.CreateDateColumn()
  createdAt: Date;

  @typeorm.UpdateDateColumn()
  updatedAt: Date;
}
