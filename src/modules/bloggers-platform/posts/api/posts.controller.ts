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
} from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";

import { SETTINGS } from "../../../../settings";
import { PostsService } from "../application/posts.service";
import { PostsQueryRepository } from "../infrastructure/query/posts.query-repository";
import { PostViewDto } from "./view-dto/posts.view-dto";
import { CreatePostInputDto } from "./input-dto/posts.input-dto";
import { UpdatePostInputDto } from "./input-dto/update-post.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { GetPostsQueryParams } from "./input-dto/get-posts-query-params.input-dto";

@Controller(SETTINGS.PATH.POSTS)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

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

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param("id") id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<PostViewDto> {
    const postId = await this.postsService.updatePost({ id, dto: body });

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @ApiParam({ name: "id" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
