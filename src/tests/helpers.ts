import request from "supertest";
import { App } from "supertest/types";
import TestAgent from "supertest/lib/agent";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";

import { SETTINGS } from "../settings";
import { AppModule } from "../app.module";
import { appSetup } from "../setup/app.setup";
import { EmailServiceMock } from "./mock/email-service.mock";
import { EmailService } from "../modules/notifications/email.service";

export let req: InstanceType<typeof TestAgent>;

// const userCredentials = `${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`;
// const encodedUserCredentials = Buffer.from(userCredentials, 'utf8').toString(
//   'base64',
// );
// export const validAuthHeader = `Basic ${encodedUserCredentials}`;
// export const emailServiceMock = new EmailServiceMock();
export const emailServiceMock = new EmailServiceMock({} as MailerService);

export const connectToTestDBAndClearRepositories = () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useClass(EmailServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    appSetup({ app, env: "e2e_tests" });

    await app.init();

    req = request(app.getHttpServer());
    await req.delete(`${SETTINGS.PATH.TESTING}/all-data`).expect(204);
    // req.set("Authorization", "");

    emailServiceMock.sendEmailWithConfirmationCode = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    emailServiceMock.sendEmailWithPasswordRecoveryCode = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
  });

  afterAll(async () => {
    await app.close();
  });
};

export const RealDate = Date;
export const mockDate = (isoDate: string) => {
  class MockDate extends RealDate {
    constructor() {
      super();
      return new RealDate(isoDate);
    }

    static now() {
      return new RealDate(isoDate).getTime();
    }
  }

  // @ts-expect-error: some error
  global.Date = MockDate;
};

// export const delayInSec = (delay: number) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({});
//     }, delay * 1000);
//   });
// };
