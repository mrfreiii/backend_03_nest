import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  _id: false,
})
export class NewestLikes {
  @Prop({ type: Date, required: true })
  addedAt: Date;

  @Prop({ type: String, required: false })
  userId: string;

  @Prop({ type: String, required: false })
  login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);
