import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserContextDto } from "../../guards/dto/user-context.dto";
import { CryptoService } from "../../users/application/crypto.service";
import { LoginUserInputDto } from "../api/input-dto/login -user.input-dto";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from "../../constants/auth-tokens.inject-constants";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async validateUser(dto: LoginUserInputDto): Promise<UserContextDto | null> {
    const user = await this.usersRepository.findByLoginOrEmail({
      login: dto.loginOrEmail,
      email: dto.loginOrEmail,
    });
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password: dto.password,
      hash: user.passwordHash,
    });
    if (!isPasswordValid) {
      return null;
    }

    return { id: user.id.toString() };
  }

  login(userId: string) {
    const accessToken = this.accessTokenContext.sign({
      id: userId,
    } as UserContextDto);

    const refreshToken = this.refreshTokenContext.sign({
      id: userId,
      deviceId: "deviceId",
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
