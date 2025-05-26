import { CqrsModule } from "@nestjs/cqrs";
import { Global, Module } from "@nestjs/common";

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  imports: [CqrsModule],
  exports: [CqrsModule],
  providers: [],
})
export class CoreModule {}
