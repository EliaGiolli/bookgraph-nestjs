import * as typeorm from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Author } from '../../author/entities/author.entity.js';
import { BookRole } from '../../common/types/enums/book-role.enum.js';
import { BookTag } from './book-tag.entity.js';
import { BookConnection } from '../../book-connections/entities/book-connection.entity.js';

@typeorm.Entity('books')
export class Book {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'varchar', length: 255 })
  title: string;

  @typeorm.Column({ type: 'text', nullable: true })
  description?: string;

  @typeorm.Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @typeorm.Column({ type: 'varchar', length: 100, nullable: true })
  genre?: string;

  @typeorm.Column({ type: 'varchar', nullable: true })
  coverImg?: string;

  @typeorm.Column({ type: 'varchar', length: 20, nullable: true })
  isbn?: string;

  @typeorm.Column({
    type: 'enum',
    enum: BookRole,
    default: BookRole.WISHLIST,
  })
  status: BookRole;

  // Relazioni
  @typeorm.Column({ type: 'uuid' })
  userId: string;

  @typeorm.ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'userId' })
  user: typeorm.Relation<User>;

  @typeorm.Column({ type: 'uuid' })
  authorId: string;

  @typeorm.ManyToOne(() => Author, (author) => author.books, { onDelete: 'RESTRICT' })
  @typeorm.JoinColumn({ name: 'authorId' })
  author: typeorm.Relation<Author>;

  @typeorm.OneToMany(() => BookTag, (bookTag) => bookTag.book)
  bookTags: typeorm.Relation<BookTag[]>;

  // Graph connections (Self-Referential)
  @typeorm.OneToMany(() => BookConnection, (conn) => conn.sourceBook)
  sourceConnections: typeorm.Relation<BookConnection[]>;

  @typeorm.OneToMany(() => BookConnection, (conn) => conn.discoveredBook)
  discoveredConnections: typeorm.Relation<BookConnection[]>;

  @typeorm.CreateDateColumn()
  createdAt: Date;

  @typeorm.UpdateDateColumn()
  updatedAt: Date;
}