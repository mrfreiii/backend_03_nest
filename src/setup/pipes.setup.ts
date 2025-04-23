import { INestApplication, ValidationPipe } from "@nestjs/common";

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
}
