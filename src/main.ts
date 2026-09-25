import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
// Modules & Services
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './app.setup.js';
// Swagger
import { SwaggerModule } from '@nestjs/swagger';
// Config
import { config } from './config/index.js';


async function bootstrap() {

  const logger = new Logger('BootstrapDebug');

  try{
    
    const app = await NestFactory.create(AppModule, {
      // Activates each and every NestJS's log messages
      logger: ['error', 'debug', 'verbose', 'log', 'warn', 'fatal']
    });

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    // Cookie parser + global ValidationPipe
    configureApp(app);
  
    // Swagger init
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    // Type-safe variable
    await app.listen(port);
  } catch(err){
    logger.error('=== DETAILED INITIALIZING ERROR ===');
    console.error(err);
    process.exit(1);
  }
}
await bootstrap();
