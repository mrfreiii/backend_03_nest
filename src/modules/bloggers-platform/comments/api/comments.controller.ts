import { Controller, Get, Param, Query } from "@nestjs/common";

import { SETTINGS } from "../../../../settings";
import { CommentViewDto } from "./view-dto/comments.view-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { GetCommentsQueryParams } from "./input-dto/get-comments-query-params.input-dto";
import { CommentsQueryRepository } from "../infrastructure/query/comments.query-repository";

@Controller(SETTINGS.PATH.COMMENTS)
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get()
  async getAll(
    @Query() query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAll({ query });
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }
}
