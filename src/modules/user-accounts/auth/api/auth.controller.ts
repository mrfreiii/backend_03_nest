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
}
