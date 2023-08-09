import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Check if the application is in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Allow all origins in development mode
    app.enableCors();
  } else {
    // Allow only https://www.trade-hub.fr/ in deployment mode
    app.enableCors({
      origin: 'https://www.trade-hub.fr',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  }

  await app.listen(8000);
}
bootstrap();
