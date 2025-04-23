import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { LikeStatusEnum } from "../../dto/likes.dto";
import { NewestLikes, NewestLikesSchema } from "./newestLikes";

@Schema({
  _id: false,
})
export class ExtendedLikesInfo {
  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: false })
  dislikesCount: number;

  @Prop({ type: String, enum: LikeStatusEnum, required: false })
  myStatus: LikeStatusEnum;

  @Prop({ type: Array<typeof NewestLikesSchema> })
  newestLikes: NewestLikes[];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);
