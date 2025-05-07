import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CryptoService } from "./crypto.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { User, UserModelType } from "../domain/user.entity";
import { EmailService } from "../../../notifications/email.service";
import { UsersRepository } from "../infrastructure/users.repository";
import { DomainException } from "../../../../core/exceptions/domain-exceptions";
import { RegisterUserInputDto } from "../../auth/api/input-dto/register-user.input-dto";
import { DomainExceptionCode } from "../../../../core/exceptions/domain-exception-codes";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const userWithTheSameLogin = await this.usersRepository.findByLogin(
      dto.login,
    );
    if (userWithTheSameLogin) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "User with the same login already exists",
        extensions: [
          {
            field: "login",
            message: "User with the same login already exists",
          },
        ],
      });
    }

    const userWithTheSameEmail = await this.usersRepository.findByEmail(
      dto.email,
    );
    if (userWithTheSameEmail) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "User with the same email already exists",
        extensions: [
          {
            field: "email",
            message: "User with the same email already exists",
          },
        ],
      });
    }

    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }

  async registerUser({
    dto,
    currentURL,
  }: {
    dto: RegisterUserInputDto;
    currentURL: string;
  }): Promise<void> {
    const createdUserId = await this.createUser(dto);
    const user = await this.usersRepository.findOrNotFoundFail(createdUserId);

    const confirmationCode = user.setConfirmationCode();
    await this.usersRepository.save(user);

    this.emailService
      .sendEmailWithConfirmationCode({
        email: user.email,
        confirmationCode,
        currentURL,
      })
      .catch(console.error);
  }

  async confirmUserRegistration(code: string): Promise<void> {
    const user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "Invalid confirmation code",
        extensions: [
          {
            field: "code",
            message: "Invalid confirmation code",
          },
        ],
      });
    }

    if (user.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "User registration already confirmed",
        extensions: [
          {
            field: "code",
            message: "User already confirmed",
          },
        ],
      });
    }

    if (user.confirmationCodeExpirationDate < new Date().getTime()) {
      throw new DomainException({
        code: DomainExceptionCode.ConfirmationCodeExpired,
        message: "Confirmation code expired",
        extensions: [
          {
            field: "code",
            message: "Confirmation code expired",
          },
        ],
      });
    }

    user.confirmRegistration();
    await this.usersRepository.save(user);
  }

  async resendRegistrationEmail({
    email,
    currentURL,
  }: {
    email: string;
    currentURL: string;
  }): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "User not found",
        extensions: [
          {
            field: "email",
            message: "User not found",
          },
        ],
      });
    }

    if (user.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "Email already confirmed",
        extensions: [
          {
            field: "email",
            message: "Email already confirmed",
          },
        ],
      });
    }

    const confirmationCode = user.setConfirmationCode();
    await this.usersRepository.save(user);

    this.emailService
      .sendEmailWithConfirmationCode({
        email: user.email,
        confirmationCode,
        currentURL,
      })
      .catch(console.error);
  }
}
