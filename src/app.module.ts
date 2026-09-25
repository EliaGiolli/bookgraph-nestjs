import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AppController } from './app.controller.js';
import { BooksModule } from './books/books.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
//Entities
import { User } from './users/entities/user.entity.js';
import { Book } from './books/entities/books.entity.js';
import { Author } from './author/entities/author.entity.js';
import { BookTag } from './books/entities/book-tag.entity.js';
import { Tag } from './tags/entities/tag.entity.js';
import { BookConnection } from './book-connections/entities/book-connection.entity.js';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { TagsModule } from './tags/tags.module.js';
import { AuthorModule } from './author/author.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EnvSchema } from './lib/schemas/env.schema.js';
import { BookConnectionsModule } from './book-connections/book-connections.module.js';
import { GraphModule } from './graph/graph.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // validates the Zod schema when the server starts
      validate: (config) => EnvSchema.parse(config)
    }),
    AuthModule,
    BooksModule,
    UsersModule,
    TagsModule,
    AuthorModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // EnvSchema has already validated these and defaulted host/port, so no
        // inline fallbacks belong here. The three required vars use getOrThrow
        // rather than silently connecting as some made-up default user.
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        entities: [User, Author, Tag, BookTag, BookConnection, Book],
        synchronize: false, // schema changes go through migrations
        // SQL logging is useful in development and noisy (and a disclosure risk)
        // in production.
        logging: configService.get<string>('NODE_ENV') !== 'production',
      })

    }),
    // The ThrottlerModule helps the app with rate limiting
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl: 6000,
          limit: 10, // The maximum number of request within the time-to-live
        }
      ]
    }),
    BookConnectionsModule,
    GraphModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
