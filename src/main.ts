import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'express';
import { OpenAPI } from './openapi'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	SwaggerModule.setup('api', app, OpenAPI)

	await app.listen(3000);
}

bootstrap();