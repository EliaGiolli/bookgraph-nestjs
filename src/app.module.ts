import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

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
        entities: [],
        synchronize: true // change to 'false' in production
      })

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
