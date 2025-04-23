import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreatePostDto } from "../dto/post.dto";
import { UpdatePostInputDto } from "../api/input-dto/update-post.input-dto";
import { Post, PostModelType } from "../domain/post.entity";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsExternalQueryRepository } from "../../blogs/infrastructure/external-query/blogs.external-query-repository";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsExternalRepository: BlogsExternalQueryRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsExternalRepository.getByIdOrNotFoundFail(
      dto.blogId,
    );

    const post = this.PostModel.createInstance({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async updatePost({
    id,
    dto,
  }: {
    id: string;
    dto: UpdatePostInputDto;
  }): Promise<string> {
    const blog = await this.blogsExternalRepository.getByIdOrNotFoundFail(dto.blogId);

    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.update({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
