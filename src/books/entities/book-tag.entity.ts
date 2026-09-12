import * as typeorm from 'typeorm';
import { Book } from './books.entity.js';
import { Tag } from '../../tags/entities/tag.entity.js';

@typeorm.Entity('book_tags')
export class BookTag {
  @typeorm.PrimaryColumn({ type: 'uuid' })
  bookId: string;

  @typeorm.PrimaryColumn({ type: 'uuid' })
  tagId: string;

  @typeorm.ManyToOne(() => Book, (book) => book.bookTags, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'bookId' })
  book: typeorm.Relation<Book>;

  @typeorm.ManyToOne(() => Tag, (tag) => tag.bookTags, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'tagId' })
  tag: typeorm.Relation<Tag>;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}