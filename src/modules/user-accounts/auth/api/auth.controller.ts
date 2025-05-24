import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SETTINGS } from "../../../../settings";
import { AuthService } from "../application/auth.service";
import { UsersService } from "../../users/application/users.service";
import { LocalAuthGuard } from "../../guards/local/local-auth.guard";
import { UserContextDto } from "../../guards/dto/user-context.dto";
import { RegisterUserInputDto } from "./input-dto/register-user.input-dto";
import { UpdatePasswordInputDto } from "./input-dto/update-password.input-dto";
import { ConfirmUserRegistrationInputDto } from "./input-dto/confirm-user-registration.input-dto";
import { SendPasswordRecoveryCodeInputDto } from "./input-dto/send-password-recovery-code.input-dto";
import { ResendUserRegistrationEmailInputDto } from "./input-dto/resend-user-registration-email.input-dto";
import { ExtractUserFromRequest } from "../../guards/decorators/param/extract-user-from-request.decorator";
import { JwtAuthGuard } from "../../guards/bearer/jwt-auth.guard";
import { MeViewDto } from "../../users/api/view-dto/users.view-dto";
import { AuthQueryRepository } from "../infrastructure/query/auth.query-repository";

@Controller(SETTINGS.PATH.AUTH)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

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

  @Post("new-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() body: UpdatePasswordInputDto) {
    return this.usersService.updatePassword(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  loginUser(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res({ passthrough: true }) response: Response,
  ): {
    accessToken: string;
  } {
    const result = this.authService.login(user.id);

    response.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: result.accessToken };
  }

  @ApiBearerAuth()
  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
