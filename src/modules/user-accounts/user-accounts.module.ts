import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";

import { User, UserSchema } from "./users/domain/user.entity";
import { AuthController } from "./auth/api/auth.controller";
import { UsersController } from "./users/api/users.controller";
import { SecurityDevicesController } from "./users/api/security-devices.controller";
import { UsersService } from "./users/application/users.service";
import { CryptoService } from "./users/application/crypto.service";
import { UsersExternalService } from "./users/application/users.external-service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { UsersQueryRepository } from "./users/infrastructure/query/users.query-repository";
import { UsersExternalQueryRepository } from "./users/infrastructure/external-query/users.external-query-repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { SETTINGS } from "../../settings";
import { AuthService } from "./auth/application/auth.service";
import { LocalStrategy } from "./guards/local/local.strategy";
import { JwtStrategy } from "./guards/bearer/jwt.strategy";
import { AuthQueryRepository } from "./auth/infrastructure/query/auth.query-repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
    JwtModule.register({
      secret: SETTINGS.JWT_SECRET,
      signOptions: { expiresIn: "5m" },
    }),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    AuthService,
    UsersService,
    CryptoService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    // SecurityDevicesQueryRepository,
    UsersExternalService,
    UsersExternalQueryRepository,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
