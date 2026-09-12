import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './books.entity.js';

@Entity('book_connections')
export class BookConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sourceBookId: string;

  @ManyToOne(() => Book, (book) => book.sourceConnections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceBookId' })
  sourceBook: Book;

  @Column({ type: 'uuid' })
  discoveredBookId: string;

  @ManyToOne(() => Book, (book) => book.discoveredConnections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'discoveredBookId' })
  discoveredBook: Book;

  @Column({ type: 'varchar', length: 100, nullable: true })
  discoveryMethod?: string; // Es. "Cited in Chapter 3", "Recommended by Author"

  @Column({ type: 'varchar', length: 100, nullable: true })
  suggestedBy?: string;

  @CreateDateColumn()
  createdAt: Date;
}