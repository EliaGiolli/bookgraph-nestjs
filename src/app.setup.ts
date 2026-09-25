import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

// Global middleware and pipes shared by main.ts and the e2e suite, so tests
// exercise the same request pipeline as the running server.
export function configureApp(app: INestApplication): void {
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      // it transforms incoming data types
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}
