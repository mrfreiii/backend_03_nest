import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { User, UserDocument, UserModelType } from "../domain/user.entity";
import { DomainException } from "../../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../../core/exceptions/domain-exception-codes";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async save(user: UserDocument) {
    await user.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId) {
      throw new NotFoundException("user not found");
    }

    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: "User not found",
      });
    }

    return user;
  }

  findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ login });
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ email });
  }

  findByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({ confirmationCode });
  }
}
