import { CqrsModule } from "@nestjs/cqrs";
import { Global, Module } from "@nestjs/common";

import { CoreConfig } from "./config/core.config";
import { AuthConfig } from "../modules/user-accounts/auth/config/auth.config";
import { UsersConfig } from "../modules/user-accounts/users/config/users.config";
import { NotificationsConfig } from "../modules/notifications/config/notifications.config";

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  imports: [CqrsModule],
  exports: [
    CqrsModule,
    CoreConfig,
    NotificationsConfig,
    UsersConfig,
    AuthConfig,
  ],
  providers: [CoreConfig, NotificationsConfig, UsersConfig, AuthConfig],
})
export class CoreModule {}
