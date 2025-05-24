import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import {
  CommentsQueryRepository,
} from "../infrastructure/query/comments.query-repository";
import { SETTINGS } from "../../../../settings";
import { CommentViewDto } from "./view-dto/comments.view-dto";
import { CommentsService } from "../application/comments.service";
import { UpdateCommentInputDto } from "./input-dto/update-comment.input-dto";
import { UserContextDto } from "../../../user-accounts/guards/dto/user-context.dto";
import { JwtAuthGuard } from "../../../user-accounts/guards/bearer/jwt-auth.guard";
import {
  ExtractUserFromRequest,
} from "../../../user-accounts/guards/decorators/param/extract-user-from-request.decorator";

@Controller(SETTINGS.PATH.COMMENTS)
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  // @Get()
  // async getAll(
  //   @Query() query: GetCommentsQueryParams,
  // ): Promise<PaginatedViewDto<CommentViewDto[]>> {
  //   return this.commentsQueryRepository.getAll({ query });
  // }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(":commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentById(
    @Param("commentId") commentId: string,
    @Body() body: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commentsService.updateComment({
      userId: user.id,
      commentId,
      dto: body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":commentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCommentById(
    @Param("commentId") commentId: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commentsService.deleteComment({
      userId: user.id,
      commentId,
    });
  }
}
