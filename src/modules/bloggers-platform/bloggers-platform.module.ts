import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserAccountsModule } from "../user-accounts/user-accounts.module";

import { Blog, BlogSchema } from "./blogs/domain/blog.entity";
import { BlogsController } from "./blogs/api/blogs.controller";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsRepository } from "./blogs/infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./blogs/infrastructure/query/blogs.query-repository";
import { BlogsExternalQueryRepository } from "./blogs/infrastructure/external-query/blogs.external-query-repository";

import { Post, PostSchema } from "./posts/domain/post.entity";
import { PostsController } from "./posts/api/posts.controller";
import { PostsService } from "./posts/application/posts.service";
import { PostsRepository } from "./posts/infrastructure/posts.repository";
import { PostsQueryRepository } from "./posts/infrastructure/query/posts.query-repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsExternalQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
