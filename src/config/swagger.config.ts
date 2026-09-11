import { DocumentBuilder } from "@nestjs/swagger";

// SWAGGER
export const config = new DocumentBuilder()
    .setTitle('Zenith-Dashboard-Websocket')
    .setDescription('This API grants live stream of data for the application')
    .setVersion('1.0')
    .addTag('websockets')
    .build()