import * as typeorm from 'typeorm';
import { Book } from './books.entity.js';

@typeorm.Entity('book_connections')
export class BookConnection {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  @typeorm.Column({ type: 'uuid' })
  sourceBookId: string;

  @typeorm.ManyToOne(() => Book, (book) => book.sourceConnections, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'sourceBookId' })
  sourceBook: typeorm.Relation<Book>;

  @typeorm.Column({ type: 'uuid' })
  discoveredBookId: string;

  @typeorm.ManyToOne(() => Book, (book) => book.discoveredConnections, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'discoveredBookId' })
  discoveredBook: typeorm.Relation<Book>;

  @typeorm.Column({ type: 'varchar', length: 100, nullable: true })
  discoveryMethod?: string; // Es. "Cited in Chapter 3", "Recommended by Author"

  @typeorm.Column({ type: 'varchar', length: 100, nullable: true })
  suggestedBy?: string;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}