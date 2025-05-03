import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./users/domain/user.entity";
import { AuthController } from "./users/api/auth.controller";
import { UsersController } from "./users/api/users.controller";
import { SecurityDevicesController } from "./users/api/security-devices.controller";
import { UsersService } from "./users/application/users.service";
import { UsersExternalService } from "./users/application/users.external-service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { AuthQueryRepository } from "./users/infrastructure/query/auth.query-repository";
import { UsersQueryRepository } from "./users/infrastructure/query/users.query-repository";
import { SecurityDevicesQueryRepository } from "./users/infrastructure/query/security-devices.query-repository";
import { UsersExternalQueryRepository } from "./users/infrastructure/external-query/users.external-query-repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    SecurityDevicesQueryRepository,
    UsersExternalService,
    UsersExternalQueryRepository,
  ],
  exports: [UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
