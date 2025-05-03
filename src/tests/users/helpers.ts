import { req } from "../helpers";
import { SETTINGS } from "../../settings";
import { UserViewDto } from "../../modules/user-accounts/users/api/view-dto/users.view-dto";
import { CreateUserInputDto } from "../../modules/user-accounts/users/api/input-dto/users.input-dto";

const DEFAULT_USER_PASSWORD = "qwerty12345";

export const createTestUsers = async ({
  password,
  count = 1,
}: {
  password?: string;
  count?: number;
}): Promise<UserViewDto[]> => {
  const result: UserViewDto[] = [];

  for (let i = 0; i < count; i++) {
    const uniqueId = Number(Date.now()).toString().substring(8);

    const user: CreateUserInputDto = {
      login: `user${i + 1}${uniqueId}`,
      password: password ?? DEFAULT_USER_PASSWORD,
      email: `email${uniqueId}@test.com`,
    };

    const res = await req.post(SETTINGS.PATH.USERS).send(user).expect(201);
    result.push(res.body);
  }

  return result;
};
