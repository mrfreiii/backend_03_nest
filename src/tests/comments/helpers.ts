import { req } from "../helpers";
import { SETTINGS } from "../../settings";
import { createTestPosts } from "../posts/helpers";
import { createTestBlogs } from "../blogs/helpers";
import { CommentViewDto } from "../../modules/bloggers-platform/comments/api/view-dto/comments.view-dto";
import { CreateCommentByPostIdInputDto } from "../../modules/bloggers-platform/posts/api/input-dto/posts.input-dto";

export const createTestComments = async (
  count: number = 1,
): Promise<{ comments: CommentViewDto[]; createdPostId: string }> => {
  const commentsList: CommentViewDto[] = [];

  const createdBlog = (await createTestBlogs())[0];
  const createdPost = (await createTestPosts({ blogId: createdBlog.id }))[0];

  for (let i = 0; i < count; i++) {
    const comment: CreateCommentByPostIdInputDto = {
      content: `comment content is ${i + 1}`,
    };

    const res = await req
      .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
      .send(comment)
      .expect(201);

    commentsList.push(res.body);
  }

  return {
    comments: commentsList,
    createdPostId: createdPost.id,
  };
};
