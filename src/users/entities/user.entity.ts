import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Book } from '../../books/entities/books.entity.js';
import { UserRole } from '../../common/types/enums/user-role.enum.js';
import { Tag } from '../../tags/entities/tag.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', select: false }) // Nasconde l'hash dalle query standard per sicurezza
  hashedPassword: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
