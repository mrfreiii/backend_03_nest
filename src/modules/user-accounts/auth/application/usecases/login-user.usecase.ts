import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from "../../../constants/auth-tokens.inject-constants";
import { LoginUserOutputDto } from "../dto/login-user.output-dto";
import { UserContextDto } from "../../../guards/dto/user-context.dto";

export class LoginUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, LoginUserOutputDto>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute({ userId }: LoginUserCommand): Promise<LoginUserOutputDto> {
    const accessToken = this.accessTokenContext.sign({
      id: userId,
    } as UserContextDto);

    const refreshToken = this.refreshTokenContext.sign({
      id: userId,
      deviceId: "deviceId",
    });

    return Promise.resolve({
      accessToken,
      refreshToken,
    });
  }
}
