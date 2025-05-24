import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateCommentDto } from "../dto/comment.dto";
import { Comment, CommentModelType } from "../domain/comment.entity";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { UsersExternalQueryRepository } from "../../../user-accounts/users/infrastructure/external-query/users.external-query-repository";
import { UpdateCommentInputDto } from "../api/input-dto/update-comment.input-dto";
import { DomainException } from "../../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../../core/exceptions/domain-exception-codes";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private usersExternalQueryRepository: UsersExternalQueryRepository,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<string> {
    const user = await this.usersExternalQueryRepository.getByIdOrNotFoundFail(
      dto.userId,
    );

    const comment = this.CommentModel.createInstance({
      postId: dto.postId,
      content: dto.content,
      commentatorInfo: {
        userId: dto.userId,
        userLogin: user?.login,
      },
    });

    await this.commentsRepository.save(comment);

    return comment._id.toString();
  }

  async updateComment({
    userId,
    commentId,
    dto,
  }: {
    userId: string;
    commentId: string;
    dto: UpdateCommentInputDto;
  }): Promise<void> {
    const comment =
      await this.commentsRepository.getByIdOrNotFoundFail(commentId);

    if (comment.commentatorInfo.userId !== userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: "Forbidden to edit another user's comment",
        extensions: [
          {
            field: "",
            message: "Forbidden to edit another user's comment",
          },
        ],
      });
    }

    comment.updateContent(dto.content);

    await this.commentsRepository.save(comment);
  }

  async deleteComment({
    userId,
    commentId,
  }: {
    userId: string;
    commentId: string;
  }): Promise<void> {
    const comment =
      await this.commentsRepository.getByIdOrNotFoundFail(commentId);

    if (comment.commentatorInfo.userId !== userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: "Forbidden to delete another user's comment",
        extensions: [
          {
            field: "",
            message: "Forbidden to delete another user's comment",
          },
        ],
      });
    }

    comment.makeDeleted();

    await this.commentsRepository.save(comment);
  }
}
