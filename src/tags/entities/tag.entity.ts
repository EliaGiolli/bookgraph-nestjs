import * as typeorm from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { BookTag } from '../../books/entities/book-tag.entity.js';

@typeorm.Entity('tags')
export class Tag {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'varchar', length: 50 })
  name: string;

  @typeorm.Column({ type: 'uuid' })
  userId: string;

  @typeorm.ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'userId' })
  user: typeorm.Relation<User>;

  @typeorm.OneToMany(() => BookTag, (bookTag) => bookTag.tag)
  bookTags: typeorm.Relation<BookTag[]>;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}