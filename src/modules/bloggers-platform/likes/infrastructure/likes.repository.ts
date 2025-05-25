import { ObjectId } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Like, LikeDocument, LikeModelType } from "../domain/like.entity";

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

  async save(like: LikeDocument) {
    await like.save();
  }

  async getLikeByUserIdAndEntityId({
    userId,
    entityId,
  }: {
    userId: string;
    entityId: string;
  }): Promise<LikeDocument | null> {
    return this.LikeModel.findOne({
      userId,
      entityId,
    });
  }

  async deleteLike(likeId: ObjectId): Promise<void> {
    await this.LikeModel.deleteOne({ _id: likeId });
  }
}
