import { HydratedDocument, Model } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { LikeStatusEnum } from "../../dto/likes.dto";
import { LikesInfo, LikesInfoSchema } from "./likesInfo.schema";
import { CreateCommentDomainDto } from "./dto/create-comment.domain.dto";
import {
  CommentatorInfo,
  CommentatorInfoSchema,
} from "./commentatorInfo.schema";

//флаг timestamp автоматичеки добавляет поля updatedAt и createdAt
/**
 * Comment Entity Schema
 * This class represents the schema and behavior of a Comment entity.
 */
@Schema({ timestamps: true })
export class Comment {
  /**
   * Post id
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  postId: string;

  /**
   * Content
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
   * @type {Date}
   */
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: LikesInfoSchema })
  likesInfo: LikesInfo;

  /**
   * Factory method to create a Comment instance
   * @param {CreateCommentDomainDto} dto - The data transfer object for post creation
   * @returns {PostDocument} The created post document
   */
  static createInstance(dto: CreateCommentDomainDto): CommentDocument {
    const comment = new this();

    comment.postId = dto.postId;
    comment.content = dto.content;
    comment.commentatorInfo = dto.commentatorInfo;
    comment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
    };

    return comment as CommentDocument;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

//регистрирует методы сущности в схеме
CommentSchema.loadClass(Comment);

//Типизация документа
export type CommentDocument = HydratedDocument<Comment>;

//Типизация модели + статические методы
export type CommentModelType = Model<CommentDocument> & typeof Comment;
