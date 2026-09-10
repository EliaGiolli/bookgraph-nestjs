import { NestFactory } from '@nestjs/core';
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

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
