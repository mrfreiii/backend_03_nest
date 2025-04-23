import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateCommentDto } from "../dto/comment.dto";
import { Comment, CommentModelType } from "../domain/comment.entity";
import { CommentsRepository } from "../infrastructure/comments.repository";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<string> {
    const comment = this.CommentModel.createInstance({
      postId: dto.postId,
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: "fake login from comment service", // need to get user from userRepository
      },
    });

    await this.commentsRepository.save(comment);

    return comment._id.toString();
  }
}
