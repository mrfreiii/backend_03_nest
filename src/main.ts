import { NestFactory } from "@nestjs/core";

import { appSetup } from "./setup/app.setup";
import { initAppModule } from "./init-app-module";
import { CoreConfig } from "./core/config/core.config";

async function bootstrap() {
  const DynamicAppModule = await initAppModule();
  // создаём на основе донастроенного модуля наше приложение
  const app = await NestFactory.create(DynamicAppModule);
  app.enableCors();

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  appSetup({ app });
  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
}
bootstrap();
