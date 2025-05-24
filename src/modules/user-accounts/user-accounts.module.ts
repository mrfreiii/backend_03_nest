import { config } from "dotenv";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule, JwtService } from "@nestjs/jwt";

import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from "./constants/auth-tokens.inject-constants";
import { User, UserSchema } from "./users/domain/user.entity";
import { AuthController } from "./auth/api/auth.controller";
import { UsersController } from "./users/api/users.controller";
import { AuthService } from "./auth/application/auth.service";
import { UsersService } from "./users/application/users.service";
import { CryptoService } from "./users/application/crypto.service";
import { UsersExternalService } from "./users/application/users.external-service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { AuthQueryRepository } from "./auth/infrastructure/query/auth.query-repository";
import { UsersQueryRepository } from "./users/infrastructure/query/users.query-repository";
import { UsersExternalQueryRepository } from "./users/infrastructure/external-query/users.external-query-repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { JwtStrategy } from "./guards/bearer/jwt.strategy";
import { LocalStrategy } from "./guards/local/local.strategy";

config();

const services = [
  AuthService,
  UsersService,
  CryptoService,
  UsersExternalService,
  {
    provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (): JwtService => {
      return new JwtService({
        secret: process.env?.ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: "5m" },
      });
    },
    inject: [
      /*TODO: inject configService. will be in the following lessons*/
    ],
  },
  {
    provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (): JwtService => {
      return new JwtService({
        secret: process.env?.REFRESH_TOKEN_SECRET,
        signOptions: { expiresIn: "24h" },
      });
    },
    inject: [
      /*TODO: inject configService. will be in the following lessons*/
    ],
  },
];
const repos = [
  UsersRepository,
  UsersQueryRepository,
  AuthQueryRepository,
  UsersExternalQueryRepository,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [...services, ...repos, LocalStrategy, JwtStrategy],
  exports: [UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
