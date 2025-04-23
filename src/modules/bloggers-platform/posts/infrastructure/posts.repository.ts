import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Post, PostDocument, PostModelType } from "../domain/post.entity";

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async save(post: PostDocument) {
    await post.save();
  }

  async findById(id: string): Promise<PostDocument | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId) {
      throw new NotFoundException("post not found");
    }

    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);

    if (!post) {
      //TODO: replace with domain exception
      throw new NotFoundException("post not found");
    }

    return post;
  }
}
