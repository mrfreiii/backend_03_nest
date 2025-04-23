import { CommentsSortBy } from "./comments-sort-by";
import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto";

export class GetCommentsQueryParams extends BaseQueryParams {
  sortBy = CommentsSortBy.CreatedAt;
}
