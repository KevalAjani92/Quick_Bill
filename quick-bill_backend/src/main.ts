import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS for frontend dev server
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://quick-bill-sandy.vercel.app',
    ],
    credentials: true,
  });

  // Global validation pipe — transforms and validates DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 QuickBill API running on http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
