import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.ts';

const options = new DocumentBuilder()
	.setTitle('Trello API')
	.setVersion('1.0')
	.setDescription('Trying to build an API for Trello clone')
	.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Authorization')
	.build();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.setGlobalPrefix('api');
	const document = SwaggerModule.createDocument(app, options);

	SwaggerModule.setup('docs', app, document);
	await app.listen(3000);
}
bootstrap();
