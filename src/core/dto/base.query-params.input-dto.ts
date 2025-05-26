import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export class BaseQueryParams {
  @Type(() => Number)
  @IsNumber()
  pageNumber: number = 1;

  @IsNumber()
  @Type(() => Number)
  pageSize: number = 10;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
