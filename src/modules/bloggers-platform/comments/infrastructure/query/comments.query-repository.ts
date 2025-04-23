import mongoose, { FilterQuery } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import {
  GetCommentsQueryParams
} from "../../api/input-dto/get-comments-query-params.input-dto";
import { CommentViewDto } from "../../api/view-dto/comments.view-dto";
import { Comment, CommentModelType } from "../../domain/comment.entity";
import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto";

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async getAll({
    query,
    postId,
  }: {
    query: GetCommentsQueryParams;
    postId?: string;
  }): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Comment> = {};

    if (postId) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        postId: { $regex: postId, $options: "i" },
      });
    }

    const comments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.CommentModel.countDocuments(filter);

    const items = comments.map(CommentViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId) {
      throw new NotFoundException("comment not found");
    }

    const comment = await this.CommentModel.findOne({
      _id: id,
    });

    if (!comment) {
      throw new NotFoundException("comment not found");
    }

    return CommentViewDto.mapToView(comment);
  }
}
