import { SETTINGS } from "../../settings";
import { createTestBlogs } from "./helpers";
import { createTestPosts } from "../posts/helpers";
import { connectToTestDBAndClearRepositories, req } from "../helpers";
import { SortDirection } from "../../core/dto/base.query-params.input-dto";
import { convertObjectToQueryString } from "../../utils/convertObjectToQueryString";
import { BlogViewDto } from "../../modules/bloggers-platform/blogs/api/view-dto/blogs.view-dto";
import { CreatePostInputDto } from "../../modules/bloggers-platform/posts/api/input-dto/posts.input-dto";
import { CreateBlogInputDto } from "../../modules/bloggers-platform/blogs/api/input-dto/blogs.input-dto";
import { GetBlogsQueryParams } from "../../modules/bloggers-platform/blogs/api/input-dto/get-blogs-query-params.input-dto";

describe("create blog /blogs", () => {
  connectToTestDBAndClearRepositories();

  it("should create a blog", async () => {
    const newBlog: CreateBlogInputDto = {
      name: "test name",
      description: "test description",
      websiteUrl: "https://mytestsite.com",
    };

    const res = await req.post(SETTINGS.PATH.BLOGS).send(newBlog).expect(201);

    expect(res.body).toEqual({
      ...newBlog,
      isMembership: false,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});

describe("get all blogs /blogs", () => {
  connectToTestDBAndClearRepositories();

  let createdBlogs: BlogViewDto[] = [];

  it("should get empty array", async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.pagesCount).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(0);
    expect(res.body.items.length).toBe(0);
  });

  it("should get not empty array without query params", async () => {
    createdBlogs = await createTestBlogs(2);

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(res.body.pagesCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items.length).toBe(2);

    expect(res.body.items).toEqual([createdBlogs[1], createdBlogs[0]]);
  });

  it("should get 2 blogs with searchName query", async () => {
    const query: Partial<GetBlogsQueryParams> = {
      searchNameTerm: "og",
    };
    const queryString = convertObjectToQueryString(query);

    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}${queryString}`)
      .expect(200);

    expect(res.body.pagesCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items.length).toBe(2);

    expect(res.body.items).toEqual([createdBlogs[1], createdBlogs[0]]);
  });

  it("should get 2 blogs with sortDirection asc", async () => {
    const query: Partial<GetBlogsQueryParams> = {
      sortDirection: SortDirection.Asc,
    };
    const queryString = convertObjectToQueryString(query);

    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}${queryString}`)
      .expect(200);

    expect(res.body.pagesCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items.length).toBe(2);

    expect(res.body.items).toEqual([createdBlogs[0], createdBlogs[1]]);
  });

  it("should get 2 blogs with page number and page size", async () => {
    const query: Partial<GetBlogsQueryParams> = {
      pageNumber: 2,
      pageSize: 1,
    };
    const queryString = convertObjectToQueryString(query);

    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}${queryString}`)
      .expect(200);

    expect(res.body.pagesCount).toBe(2);
    expect(res.body.page).toBe(2);
    expect(res.body.pageSize).toBe(1);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items.length).toBe(1);

    expect(res.body.items[0]).toEqual(createdBlogs[0]);
  });
});

describe("get blog by id /blogs/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should get not empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];

    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
      .expect(200);

    expect(res.body).toEqual(createdBlog);
  });
});

describe("update blog by id /blogs/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for non existent blog", async () => {
    await req.put(`${SETTINGS.PATH.BLOGS}/777777`).send({}).expect(404);
  });

  it("should update a blog", async () => {
    const createdBlog = (await createTestBlogs())[0];

    const updatedBlog: CreateBlogInputDto = {
      name: "test name 2",
      description: "test description 2",
      websiteUrl: "https://mytestsite2.com",
    };

    await req
      .put(`${SETTINGS.PATH.BLOGS}/${createdBlog?.id}`)
      .send(updatedBlog)
      .expect(204);

    const checkRes = await req
      .get(`${SETTINGS.PATH.BLOGS}/${createdBlog?.id}`)
      .expect(200);

    expect(checkRes.body).toEqual({
      ...updatedBlog,
      isMembership: false,
      id: createdBlog.id,
      createdAt: createdBlog.createdAt,
    });
  });
});

describe("delete blog by id /blogs/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for non existent blog", async () => {
    await req.delete(`${SETTINGS.PATH.BLOGS}/77777`).expect(404);
  });

  it("should delete blog and get empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];

    await req.delete(`${SETTINGS.PATH.BLOGS}/${createdBlog?.id}`).expect(204);

    const checkRes = await req.get(SETTINGS.PATH.BLOGS).expect(200);

    expect(checkRes.body.pagesCount).toBe(0);
    expect(checkRes.body.page).toBe(1);
    expect(checkRes.body.pageSize).toBe(10);
    expect(checkRes.body.totalCount).toBe(0);
    expect(checkRes.body.items.length).toBe(0);
  });
});

describe("get posts by blogId /blogs/:id/posts", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for non existent blog", async () => {
    await req.get(`${SETTINGS.PATH.BLOGS}/123777/posts`).expect(404);
  });

  it("should get not empty array", async () => {
    const createdBlog = (await createTestBlogs())[0];
    const createdPosts = await createTestPosts({
      blogId: createdBlog.id,
      count: 2,
    });

    const res = await req
      .get(`${SETTINGS.PATH.BLOGS}/${createdBlog?.id}/posts`)
      .expect(200);

    expect(res.body.pagesCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items.length).toBe(2);

    expect(res.body.items).toEqual([createdPosts[1], createdPosts[0]]);
  });
});

describe("create post by blogId /blogs/:id/posts", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for non existent blog", async () => {
    await req.post(`${SETTINGS.PATH.BLOGS}/123777/posts`).send({}).expect(404);
  });

  it("should create a post", async () => {
    const createdBlog = (await createTestBlogs())[0];

    const newPost: Omit<CreatePostInputDto, "blogId"> = {
      title: "title1",
      shortDescription: "shortDescription1",
      content: "content1",
    };

    const res = await req
      .post(`${SETTINGS.PATH.BLOGS}/${createdBlog?.id}/posts`)
      .send(newPost)
      .expect(201);

    expect(res.body).toEqual({
      ...newPost,
      id: expect.any(String),
      blogId: createdBlog?.id,
      blogName: createdBlog?.name,
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
