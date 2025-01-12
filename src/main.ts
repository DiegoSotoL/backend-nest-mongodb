import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as open from 'open'; // Importa correctamente

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('API para gestionar libros y autores')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = 3000;

  await app.listen(PORT);

  // Abre Swagger en el navegador
  open.default(`http://localhost:${PORT}/api`);
}

bootstrap();
