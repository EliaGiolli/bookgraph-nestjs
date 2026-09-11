import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

// Swagger
import { SwaggerModule } from '@nestjs/swagger';
// Config
import { config, env } from './config/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger init
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  // It registers global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // it transforms incoming data types
      transform: true,
    })
  )
  // Type-safe variable
  await app.listen(env.PORT);
}
await bootstrap();
