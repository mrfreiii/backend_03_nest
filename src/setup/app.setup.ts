import { INestApplication } from "@nestjs/common";
import cookieParser from "cookie-parser";

import { pipesSetup } from "./pipes.setup";
import { swaggerSetup } from "./swagger.setup";
import { globalPrefixSetup } from "./global-prefix.setup";

export function appSetup({
  app,
  env = "common",
}: {
  app: INestApplication;
  env?: "e2e_tests" | "common";
}) {
  switch (env) {
    case "common":
      pipesSetup(app);
      globalPrefixSetup(app);
      swaggerSetup(app);

      app.enableCors();
      app.use(cookieParser());
      break;
    case "e2e_tests":
      pipesSetup(app);

      app.enableCors();
      app.use(cookieParser());
      break;
  }
}
