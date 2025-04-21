import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { GLOBAL_PREFIX } from './global-prefix.setup';

export function swaggerSetup(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('API title')
        .addBearerAuth()
        .setVersion('1.999')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
        customSiteTitle: 'Swagger title',
    });
}