import { IsString, Length } from "class-validator";

export class CreatePostInputDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}

export class CreateCommentByPostIdInputDto {
  @IsString()
  @Length(20, 300)
  content: string;
}
