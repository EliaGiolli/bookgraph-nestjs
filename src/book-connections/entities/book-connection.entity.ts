import * as typeorm from 'typeorm';
import { Book } from '../../books/entities/books.entity.js';

// Canonical mapping for the `book_connections` table. A second class used to be
// mapped to the same table from src/books/entities; only this one carries the
// `userId` the service and graph layers filter on.
@typeorm.Entity('book_connections')
export class BookConnection {
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  // Ownership is enforced per-resource: every read and delete filters on this.
  @typeorm.Column({ type: 'uuid' })
  userId: string;

  @typeorm.Column({ type: 'uuid' })
  sourceBookId: string;

  @typeorm.ManyToOne(() => Book, (book) => book.sourceConnections, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn({ name: 'sourceBookId' })
  sourceBook: typeorm.Relation<Book>;

  @typeorm.Column({ type: 'uuid' })
  discoveredBookId: string;

  @typeorm.ManyToOne(() => Book, (book) => book.discoveredConnections, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn({ name: 'discoveredBookId' })
  discoveredBook: typeorm.Relation<Book>;

  // Why the two books are linked. GraphService maps this onto the edge label.
  @typeorm.Column({ type: 'varchar', length: 100, nullable: true })
  description?: string;

  @typeorm.CreateDateColumn()
  createdAt: Date;
}
