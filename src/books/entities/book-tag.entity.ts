import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Book } from './books.entity.js';
import { Tag } from '../../tags/entities/tag.entity.js';

@Entity('book_tags')
export class BookTag {
  @PrimaryColumn({ type: 'uuid' })
  bookId: string;

  @PrimaryColumn({ type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Book, (book) => book.bookTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Tag, (tag) => tag.bookTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @CreateDateColumn()
  createdAt: Date;
}