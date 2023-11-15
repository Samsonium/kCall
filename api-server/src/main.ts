import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const documentSetup = new DocumentBuilder()
        .setTitle('kCall API')
        .setVersion('2.0.0')
        .build()
    const document = SwaggerModule.createDocument(app, documentSetup);
    SwaggerModule.setup('docs', app, document);

    await app.listen(7000);
}

bootstrap().then();
