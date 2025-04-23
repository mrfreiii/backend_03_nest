import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User, UserDocument, UserModelType } from "../domain/user.entity";

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
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
      //TODO: replace with domain exception
      throw new NotFoundException("user not found");
    }

    return user;
  }
}
