import { SETTINGS } from "../../settings";
import { createTestPosts } from "./helpers";
import { createTestBlogs } from "../blogs/helpers";
import { connectToTestDBAndClearRepositories, req } from "../helpers";
import { PostViewDto } from "../../modules/bloggers-platform/posts/api/view-dto/posts.view-dto";
import {
  CreateCommentByPostIdInputDto,
  CreatePostInputDto,
} from "../../modules/bloggers-platform/posts/api/input-dto/posts.input-dto";
import { createTestComments } from "../comments/helpers";

describe("create post /posts", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for blog with blogId no exist", async () => {
    const newPost: CreatePostInputDto = {
      title: "title",
      shortDescription: "shortDescription",
      content: "content",
      blogId: "123",
    };

    await req.post(SETTINGS.PATH.POSTS).send(newPost).expect(404);
  });

  it("should create a post", async () => {
    const createdBlog = (await createTestBlogs())[0];

    const newPost: CreatePostInputDto = {
      title: "title1",
      shortDescription: "shortDescription1",
      content: "content1",
      blogId: createdBlog.id,
    };

    const postRes = await req
      .post(SETTINGS.PATH.POSTS)
      .send(newPost)
      .expect(201);

    expect(postRes.body).toEqual({
      ...newPost,
      id: expect.any(String),
      blogName: createdBlog.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
        newestLikes: [],
      },
    });
  });
});

describe("get all /posts", () => {
  connectToTestDBAndClearRepositories();

  it("should get empty array", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);

    expect(res.body.items.length).toBe(0);
  });

  it("should get not empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];
    const createdPost = (await createTestPosts({ blogId: createdBlog.id }))[0];

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200);

    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0]).toEqual({
      ...createdPost,
      blogName: createdBlog.name,
    });
  });
});

describe("get post by id /posts/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should get not empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];
    const createdPost = (await createTestPosts({ blogId: createdBlog.id }))[0];

    const res = await req
      .get(`${SETTINGS.PATH.POSTS}/${createdPost?.id}`)
      .expect(200);

    expect(res.body).toEqual({
      ...createdPost,
      blogName: createdBlog.name,
    });
  });
});

describe("update post by id /posts/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should update a post", async () => {
    const createdBlogs = await createTestBlogs(2);
    const createdPost = (
      await createTestPosts({ blogId: createdBlogs[0].id })
    )[0];

    const updatedPost: CreatePostInputDto = {
      title: "new title",
      shortDescription: "new description",
      content: "new content",
      blogId: createdBlogs[1]?.id,
    };

    await req
      .put(`${SETTINGS.PATH.POSTS}/${createdPost?.id}`)
      .send(updatedPost)
      .expect(204);

    const res = await req
      .get(`${SETTINGS.PATH.POSTS}/${createdPost?.id}`)
      .expect(200);

    expect(res.body).toEqual({
      ...updatedPost,
      id: createdPost?.id,
      blogName: createdBlogs[1].name,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
        newestLikes: [],
      },
    });
  });
});

describe("delete post by id /posts/:id", () => {
  connectToTestDBAndClearRepositories();

  let postForDeletion: PostViewDto;

  it("should return not empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];
    postForDeletion = (await createTestPosts({ blogId: createdBlog.id }))[0];

    const checkRes = await req.get(SETTINGS.PATH.POSTS).expect(200);

    expect(checkRes.body.items.length).toBe(1);
    expect(checkRes.body.items[0]).toEqual(postForDeletion);
  });

  it("should return 404 for non existent post", async () => {
    await req.delete(`${SETTINGS.PATH.POSTS}/7777`).expect(404);
  });

  it("should return empty array", async () => {
    await req
      .delete(`${SETTINGS.PATH.POSTS}/${postForDeletion?.id}`)
      .expect(204);

    const checkRes = await req.get(SETTINGS.PATH.POSTS).expect(200);

    expect(checkRes.body.items.length).toBe(0);
  });
});

describe("create comment by post id /posts/:id/comments", () => {
  connectToTestDBAndClearRepositories();

  let createdPost: PostViewDto;

  beforeAll(async () => {
    const createdBlog = (await createTestBlogs())[0];
    createdPost = (await createTestPosts({ blogId: createdBlog.id }))[0];
  });

  it("should return 404 for non existent post", async () => {
    await req
      .post(`${SETTINGS.PATH.POSTS}/777777/comments`)
      .send({})
      .expect(404);
  });

  it("should create a comment", async () => {
    const newComment: CreateCommentByPostIdInputDto = {
      content: "comment content bla-bla",
    };

    const res = await req
      .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
      .send(newComment)
      .expect(201);

    expect(res.body).toEqual({
      ...newComment,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String),
      },
      id: expect.any(String),
      createdAt: expect.any(String),
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
      },
    });
  });
});

describe("get comments by postId /posts", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 if post does not exist", async () => {
    await req.get(`${SETTINGS.PATH.POSTS}/777777/comments`).expect(404);
  });

  it("should get not empty array", async () => {
    const createdCommentsData = await createTestComments();

    const res = await req
      .get(
        `${SETTINGS.PATH.POSTS}/${createdCommentsData.createdPostId}/comments`,
      )
      .expect(200);

    expect(res.body.pagesCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(1);
    expect(res.body.items.length).toBe(1);

    expect(res.body.items[0]).toEqual(createdCommentsData.comments[0]);
  });
});
