import { IsString, Length } from "class-validator";

export class CreateBlogInputDto {
  @IsString()
  @Length(1, 15)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  @Length(1, 100)
  websiteUrl: string;
}
