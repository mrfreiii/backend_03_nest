export class CreatePostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class CreateCommentByPostIdInputDto {
  content: string;
}
