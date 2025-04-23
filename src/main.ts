import { NestFactory } from "@nestjs/core";

import { SETTINGS } from "./settings";
import { AppModule } from "./app.module";
import { appSetup } from "./setup/app.setup";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  appSetup({ app });
  const PORT = SETTINGS.PORT;

  await app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}
bootstrap();
