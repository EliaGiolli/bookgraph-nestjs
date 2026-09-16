import { NestFactory } from '@nestjs/core';
import { 
  ValidationPipe, 
  Logger 
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
// Modules & Services
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
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

    app.use(cookieParser());
  
    // Swagger init
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  
  
    // It registers global Pipes
    app.useGlobalPipes(
      new ValidationPipe({
        // it transforms incoming data types
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    // Type-safe variable
    await app.listen(port);
  } catch(err){
    logger.error('=== DETAILED INITIALIZING ERROR ===');
    console.error(err);
    process.exit(1);
  }
}
await bootstrap();
