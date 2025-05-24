import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBasicAuth, ApiParam } from "@nestjs/swagger";

import { SETTINGS } from "../../../../settings";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../infrastructure/query/posts.query-repository";
import { PostViewDto } from "./view-dto/posts.view-dto";
import {
  CreateCommentByPostIdInputDto,
  CreatePostInputDto,
} from "./input-dto/posts.input-dto";
import { UpdatePostInputDto } from "./input-dto/update-post.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { GetPostsQueryParams } from "./input-dto/get-posts-query-params.input-dto";
import { CommentViewDto } from "../../comments/api/view-dto/comments.view-dto";
import { CommentsService } from "../../comments/application/comments.service";
import { CommentsQueryRepository } from "../../comments/infrastructure/query/comments.query-repository";
import { GetCommentsQueryParams } from "../../comments/api/input-dto/get-comments-query-params.input-dto";
import { BasicAuthGuard } from "../../../user-accounts/guards/basic/basic-auth.guard";

@Controller(SETTINGS.PATH.POSTS)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll({ query });
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth("basicAuth")
  @Post()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @ApiParam({ name: "id" })
  @Get(":id")
  async getById(@Param("id") id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth("basicAuth")
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param("id") id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<PostViewDto> {
    const postId = await this.postsService.updatePost({ id, dto: body });

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth("basicAuth")
  @ApiParam({ name: "id" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }

  @Post(":id/comments")
  async createCommentByPostId(
    @Param("id") id: string,
    @Body() body: CreateCommentByPostIdInputDto,
  ): Promise<CommentViewDto> {
    await this.postsQueryRepository.getByIdOrNotFoundFail(id);

    const commentId = await this.commentsService.createComment({
      content: body.content,
      postId: id,
      userId: "fake user id from post controller", // need to get from middleware
    });

    return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
  }

  @Get(":id/comments")
  async getCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param("id") id: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    await this.postsQueryRepository.getByIdOrNotFoundFail(id);

    return this.commentsQueryRepository.getAll({ query, postId: id });
  }
}
