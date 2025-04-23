import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Blog, BlogDocument, BlogModelType } from "../domain/blog.entity";

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(blog: BlogDocument) {
    await blog.save();
  }

  async findById(id: string): Promise<BlogDocument | null> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId) {
      throw new NotFoundException("blog not found");
    }

    return this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async findOrNotFoundFail(id: string): Promise<BlogDocument> {
    const blog = await this.findById(id);

    if (!blog) {
      //TODO: replace with domain exception
      throw new NotFoundException("blog not found");
    }

    return blog;
  }
}
