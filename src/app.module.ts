import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';

//Entities
import { User } from './users/entities/user.entity.js';
import { Book } from './books/entities/books.entity.js';
import { Author } from './author/entities/author.entity.js';
import { BookTag } from './books/entities/book-tag.entity.js';
import { Tag } from './tags/entities/tag.entity.js';
import { BookConnection } from './books/entities/book-connection.entity.js';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { TagsModule } from './tags/tags.module.js';
import { AuthorModule } from './author/author.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    BooksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'bookgraph'),
        password: String(configService.get<string>('DB_PASSWORD')),
        database: configService.get<string>('DB_NAME', 'bookgraph'),
        entities: [User, Author, Tag, BookTag, BookConnection, Book],
        synchronize: true, // change to 'false' in production
        logging: true
      })

    }),
    UsersModule,
    TagsModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
