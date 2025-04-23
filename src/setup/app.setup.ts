import { INestApplication } from "@nestjs/common";

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
      break;
    case "e2e_tests":
      pipesSetup(app);
      break;
  }
}
