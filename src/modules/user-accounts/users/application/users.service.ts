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
      });
    }

    const userWithTheSameEmail = await this.usersRepository.findByEmail(
      dto.email,
    );
    if (userWithTheSameEmail) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "User with the same email already exists",
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

  async deleteUser(id: string) {
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
  }) {
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
}
