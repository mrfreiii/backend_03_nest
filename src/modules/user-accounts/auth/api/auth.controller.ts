import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";

import { SETTINGS } from "../../../../settings";
import { UsersService } from "../../users/application/users.service";
import { RegisterUserInputDto } from "./input-dto/register-user.input-dto";
import { ConfirmUserRegistrationInputDto } from "./input-dto/confirm-user-registration.input-dto";
import { ResendUserRegistrationEmailInputDto } from "./input-dto/resend-user-registration-email.input-dto";
import { SendPasswordRecoveryCodeInputDto } from "./input-dto/send-password-recovery-code.input-dto";

@Controller(SETTINGS.PATH.AUTH)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Req() req: Request, @Body() body: RegisterUserInputDto) {
    return this.usersService.registerUser({
      dto: body,
      currentURL: `${req.protocol + "://" + req.get("host")}`,
    });
  }

  @Post("registration-confirmation")
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() body: ConfirmUserRegistrationInputDto) {
    return this.usersService.confirmUserRegistration(body.code);
  }

  @Post("registration-email-resending")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendRegistrationEmail(
    @Req() req: Request,
    @Body() body: ResendUserRegistrationEmailInputDto,
  ) {
    return this.usersService.resendRegistrationEmail({
      email: body.email,
      currentURL: `${req.protocol + "://" + req.get("host")}`,
    });
  }

  @Post("password-recovery")
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendPasswordRecoveryCode(
    @Req() req: Request,
    @Body() body: SendPasswordRecoveryCodeInputDto,
  ) {
    return this.usersService.sendPasswordRecoveryCode({
      email: body.email,
      currentURL: `${req.protocol + "://" + req.get("host")}`,
    });
  }
}
