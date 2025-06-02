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
import { CryptoService } from "./users/application/crypto.service";
import { UsersExternalService } from "./users/application/users.external-service";
import { UsersRepository } from "./users/infrastructure/users.repository";
import { AuthQueryRepository } from "./auth/infrastructure/query/auth.query-repository";
import { UsersQueryRepository } from "./users/infrastructure/query/users.query-repository";
import { UsersExternalQueryRepository } from "./users/infrastructure/external-query/users.external-query-repository";
import { NotificationsModule } from "../notifications/notifications.module";
import { JwtStrategy } from "./guards/bearer/jwt.strategy";
import { LocalStrategy } from "./guards/local/local.strategy";
import { LoginUserCommandHandler } from "./auth/application/usecases/login-user.usecase";
import { ValidateUserCommandHandler } from "./auth/application/usecases/validate-user.usecase";
import { CreateUserCommandHandler } from "./users/application/usecases/create-user.usecase";
import {
  DeleteUserCommandHandler
} from "./users/application/usecases/delete-user.usecase";
import {
  RegisterUserCommandHandler
} from "./users/application/usecases/register-user.usecase";
import {
  ConfirmUserRegistrationCommandHandler
} from "./users/application/usecases/confirm-user-registration.usecase";
import {
  ResendUserRegistrationEmailCommandHandler
} from "./users/application/usecases/resend-user-registration-email.usecase";
import {
  SendUserPasswordRecoveryCodeCommandHandler
} from "./users/application/usecases/send-user-password-recovery-code.usecase";
import {
  UpdateUserPasswordCommandHandler
} from "./users/application/usecases/update-user-password.usecase";

config();

const commandHandlers = [
  ValidateUserCommandHandler,
  LoginUserCommandHandler,
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  RegisterUserCommandHandler,
  UpdateUserPasswordCommandHandler,
  ConfirmUserRegistrationCommandHandler,
  ResendUserRegistrationEmailCommandHandler,
  SendUserPasswordRecoveryCodeCommandHandler,
];

const services = [
  CryptoService,
  UsersExternalService,
  {
    provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
    useFactory: (): JwtService => {
      return new JwtService({
        secret: process.env?.ACCESS_TOKEN_SECRET,
        signOptions: { expiresIn: "10s" },
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
        signOptions: { expiresIn: "20s" },
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
  providers: [
    ...commandHandlers,
    ...services,
    ...repos,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
