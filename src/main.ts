import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger init
  const config = new DocumentBuilder()
    .setTitle('Zenith-Dashboard-Websocket')
    .setDescription('This API grants live stream of data for the application')
    .setVersion('1.0')
    .addTag('websockets')
    .build()
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  // It registers global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // it transforms incoming data types
      transform: true,
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
