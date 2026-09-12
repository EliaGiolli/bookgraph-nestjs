import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Author } from '../../author/entities/author.entity.js';
import { BookRole } from '../../common/types/enums/book-role.enum.js';
import { BookTag } from './book-tag.entity.js';
import { BookConnection } from './book-connection.entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre?: string;

  @Column({ type: 'varchar', nullable: true })
  coverImg?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  isbn?: string;

  @Column({
    type: 'enum',
    enum: BookRole,
    default: BookRole.WISHLIST,
  })
  status: BookRole;

  // Relazioni
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @OneToMany(() => BookTag, (bookTag) => bookTag.book)
  bookTags: BookTag[];

  // Connessioni del Grafo (Self-Referential)
  @OneToMany(() => BookConnection, (conn) => conn.sourceBook)
  sourceConnections: BookConnection[];

  @OneToMany(() => BookConnection, (conn) => conn.discoveredBook)
  discoveredConnections: BookConnection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}