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

// This file is consumed by the TypeORM CLI, outside the Nest application
// context, so it cannot use ConfigService or the Zod schema. The defaults below
// must therefore mirror src/lib/schemas/env.schema.ts exactly: host and port
// have defaults there, the rest are required. Falling back to a made-up
// 'bookgraph' user hid missing configuration and pointed migrations at the
// wrong database.
function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is required. See .env.example and src/lib/schemas/env.schema.ts.`,
    );
  }

  return value;
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),
  entities: [User, Author, Book, Tag, BookTag, BookConnection],
  migrations: ['dist/migrations/*.js'], // The path where migrations will be compiled into
  synchronize: false, // CRUCIAL: migrations require synchronize:false
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;