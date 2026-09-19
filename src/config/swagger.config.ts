import { DocumentBuilder } from "@nestjs/swagger";

// SWAGGER
export const config = new DocumentBuilder()
    .setTitle('BookGraph API')
    .setDescription('This API grants live stream of data for the application')
    .setVersion('1.0')
    .addTag('API endpoints')
    // Registers the security scheme the @ApiBearerAuth() decorators refer to.
    // Without it the Authorize button never appears in the UI.
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Paste the access_token returned by POST /auth/login',
        },
    )
    .build()
