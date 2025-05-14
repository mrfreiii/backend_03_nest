import { Strategy } from "passport-local";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { UserContextDto } from "../dto/user-context.dto";
import { AuthService } from "../../auth/application/auth.service";
import { DomainException } from "../../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../../core/exceptions/domain-exception-codes";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "loginOrEmail" });
  }

  //validate возвращает то, что впоследствии будет записано в req.user
  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto> {
    // if (typeof loginOrEmail !== "string") {
    //   throw new DomainException({
    //     code: DomainExceptionCode.Unauthorized,
    //     message: "Value of loginOrEmail must be string",
    //   });
    // }
    //
    // if (typeof password !== "string") {
    //   throw new DomainException({
    //     code: DomainExceptionCode.Unauthorized,
    //     message: "Value of password must be string",
    //   });
    // }
    const user = await this.authService.validateUser({
      loginOrEmail,
      password,
    });
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: "Invalid username or password",
        extensions: [
          {
            field: "",
            message: "Invalid username or password",
          },
        ],
      });
    }

    return user;
  }
}
