import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity.js';
import { Author } from '../author/entities/author.entity.js';
import { Book } from '../books/entities/books.entity.js';
import { Tag } from '../tags/entities/tag.entity.js';
import { BookTag } from '../books/entities/book-tag.entity.js';
import { BookConnection } from '../book-connections/entities/book-connection.entity.js';

// Loads envs directly form the .env file inside the root
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'bookgraph',
  password: String(process.env.DB_PASSWORD || 'bookgraph'),
  database: process.env.DB_NAME || 'bookgraph',
  entities: [User, Author, Book, Tag, BookTag, BookConnection],
  migrations: ['dist/migrations/*.js'], // The path where migrations will be compiled into
  synchronize: false, // CRUCIAL: migrations require synchronize:false
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;