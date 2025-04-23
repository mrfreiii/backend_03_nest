import mongoose from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";

import { Blog, BlogModelType } from "../../domain/blog.entity";
import { BlogExternalDto } from "./external-dto/blogs.external-dto";

@Injectable()
export class BlogsExternalQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getByIdOrNotFoundFail(id: string): Promise<BlogExternalDto> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId) {
      throw new NotFoundException("blog not found");
    }

    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!blog) {
      throw new NotFoundException("blog not found");
    }

    return BlogExternalDto.mapToView(blog);
  }
}
