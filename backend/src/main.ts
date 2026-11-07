import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsDir = process.env.VERCEL
    ? join('/tmp', 'uploads')
    : join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('SOLE Backend API')
    .setDescription('Premium Shoes E-Commerce Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS â€” allow localhost, 127.0.0.1, LAN IPs (192.168.*, etc.)
  app.enableCors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!requestOrigin) return callback(null, true);
      // Allow localhost, 127.0.0.1, and private/LAN IP addresses (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
          requestOrigin,
        )
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(
    `ðŸš€ Backend listening on http://${host}:${port} (Local: http://127.0.0.1:${port}, Network: http://192.168.2.4:${port})`,
  );
}
bootstrap();

