import { SETTINGS } from "../../settings";
import { createTestComments } from "./helpers";
import { connectToTestDBAndClearRepositories, req } from "../helpers";

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
