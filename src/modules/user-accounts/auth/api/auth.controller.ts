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

@Controller(SETTINGS.PATH.AUTH)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(
    @Req() req: Request,
    @Body() body: RegisterUserInputDto,
  ): Promise<void> {
    return this.usersService.registerUser({
      dto: body,
      currentURL: `${req.protocol + "://" + req.get("host")}`,
    });
  }
}
