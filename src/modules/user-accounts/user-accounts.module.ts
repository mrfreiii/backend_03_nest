import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./domain/user.entity";
import { AuthController } from "./api/auth.controller";
import { UsersController } from "./api/users.controller";
import { SecurityDevicesController } from "./api/security-devices.controller";
import { UsersService } from "./application/users.service";
import { UsersExternalService } from "./application/users.external-service";
import { UsersRepository } from "./infrastructure/users.repository";
import { AuthQueryRepository } from "./infrastructure/query/auth.query-repository";
import { UsersQueryRepository } from "./infrastructure/query/users.query-repository";
import { SecurityDevicesQueryRepository } from "./infrastructure/query/security-devices.query-repository";
import { UsersExternalQueryRepository } from "./infrastructure/external-query/users.external-query-repository";

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
