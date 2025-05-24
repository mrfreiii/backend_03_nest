import { IsEnum, IsOptional, IsString } from "class-validator";

import { BlogsSortBy } from "./blogs-sort-by";
import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto";

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
