import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as semver from 'semver';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiVersion = semver.valid(configService.get('API_VERSION'));
  const majorVersion = semver.major(apiVersion);
  app.enableVersioning();
  app.setGlobalPrefix(`v${majorVersion}`);
  const port = configService.get('PORT');
  const config = new DocumentBuilder()
    .setTitle('Mavarick Machine Metrics API')
    .setVersion(apiVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('help', app, document);
  await app.listen(port);
}
bootstrap();
