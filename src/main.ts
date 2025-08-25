import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/handlers/http.handler';

async function bootstrap() {
  dotenv.config();
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({ origin: true });

  app.setGlobalPrefix('/api/v1');

  const config = new DocumentBuilder()
    .setTitle('Assosa Shop API')
    .setDescription('API documentation for Assosa Shop')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/v1/docs', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT;
  await app.listen(port || 4000);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
