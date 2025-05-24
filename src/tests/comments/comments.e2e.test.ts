import { SETTINGS } from "../../settings";
import { createTestComments, TestCommentDataType } from "./helpers";
import { connectToTestDBAndClearRepositories, req } from "../helpers";
import { createTestUsers, getUsersJwtTokens } from "../users/helpers";
import {
  CreateCommentByPostIdInputDto,
} from "../../modules/bloggers-platform/posts/api/input-dto/posts.input-dto";

describe("get comment by id /comments/:id", () => {
  connectToTestDBAndClearRepositories();

  it("should return 404 for non existent comment", async () => {
    await req.get(`${SETTINGS.PATH.COMMENTS}/777777`).expect(404);
  });

  it("should get not empty array", async () => {
    const createdComment = (await createTestComments()).comments[0];

    const res = await req
      .get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
      .expect(200);

    expect(res.body).toEqual(createdComment);
  });
});

describe("update comment by id /comments/:id", () => {
  connectToTestDBAndClearRepositories();

  let commentData: TestCommentDataType;
  let user2Token: string;

  beforeAll(async () => {
    commentData = await createTestComments();

    const user2 = (await createTestUsers({}))[0];
    user2Token = (await getUsersJwtTokens([user2]))[0];
  });

  it("should return 401 for unauthorized user", async () => {
    await req.put(`${SETTINGS.PATH.COMMENTS}/777777`).expect(401);
  });

  it("should return 400 for invalid values", async () => {
    const newComment: CreateCommentByPostIdInputDto = {
      content: "test content",
    };

    const res = await req
      .put(`${SETTINGS.PATH.COMMENTS}/777777`)
      .set("Authorization", `Bearer ${commentData.userToken}`)
      .send(newComment)
      .expect(400);

    expect(res.body.errorsMessages[0]).toEqual({
      field: "content",
      message: "content must be longer than or equal to 20 characters; Received value: test content",
    });
  });

  it("should return 404 for non existent comment", async () => {
    const newComment: CreateCommentByPostIdInputDto = {
      content: "12345678901234567890 test content",
    };

    const res = await req
      .put(`${SETTINGS.PATH.COMMENTS}/777777`)
      .set("Authorization", `Bearer ${commentData.userToken}`)
      .send(newComment)
      .expect(404);

    expect(res.body.errorsMessages[0]).toEqual({
      field: "",
      message: "Comment not found",
    });
  });

  it("should return 403 for editing comment of another user", async () => {
    const newComment: CreateCommentByPostIdInputDto = {
      content: "12345678901234567890 test content",
    };

    const res = await req
      .put(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send(newComment)
      .expect(403);

    expect(res.body.errorsMessages[0]).toEqual({
      field: "",
      message: "Forbidden to edit another user's comment",
    });
  });

  it("should update comment", async () => {
    const newComment: CreateCommentByPostIdInputDto = {
      content: "12345678901234567890 updated value",
    };

    await req
      .put(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .set("Authorization", `Bearer ${commentData.userToken}`)
      .send(newComment)
      .expect(204);

    const checkRes = await req
      .get(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .expect(200);

    expect(checkRes.body).toEqual({
      ...commentData.comments[0],
      content: newComment.content
    });
  });
});

describe("delete comment by id /comments/:id", () => {
  connectToTestDBAndClearRepositories();

  let commentData: TestCommentDataType;
  let user2Token: string;

  beforeAll(async () => {
    commentData = await createTestComments();

    const user2 = (await createTestUsers({}))[0];
    user2Token = (await getUsersJwtTokens([user2]))[0];
  });

  it("should return 401 for unauthorized user", async () => {
    await req.delete(`${SETTINGS.PATH.COMMENTS}/777777`).expect(401);
  });

  it("should return 404 for non existent comment", async () => {
    const res = await req
      .delete(`${SETTINGS.PATH.COMMENTS}/777777`)
      .set("Authorization", `Bearer ${commentData.userToken}`)
      .expect(404);

    expect(res.body.errorsMessages[0]).toEqual({
      field: "",
      message: "Comment not found",
    });
  });

  it("should return 403 for comment deletion of another user", async () => {
    const res = await req
      .delete(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .expect(403);

    expect(res.body.errorsMessages[0]).toEqual({
      field: "",
      message: "Forbidden to delete another user's comment",
    });
  });

  it("should delete comment", async () => {
    await req
      .delete(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .set("Authorization", `Bearer ${commentData.userToken}`)
      .expect(204);

    const checkRes = await req
      .get(`${SETTINGS.PATH.COMMENTS}/${commentData.comments[0].id}`)
      .expect(404);

    expect(checkRes.body.errorsMessages[0]).toEqual({
      field: "",
      message: "Comment not found",
    });
  });
});
