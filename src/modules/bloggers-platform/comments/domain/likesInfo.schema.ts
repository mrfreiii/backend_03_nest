import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatusEnum } from "../../dto/likes.dto";

@Schema({
  _id: false,
})
export class LikesInfo {
  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: true })
  dislikesCount: number;

  @Prop({ type: String, enum: LikeStatusEnum, required: true })
  myStatus: LikeStatusEnum;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);
