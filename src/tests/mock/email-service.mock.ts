import { EmailService } from "../../modules/notifications/email.service";

export class EmailServiceMock extends EmailService {
  async sendEmailWithConfirmationCode({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    email,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confirmationCode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentURL,
  }: {
    email: string;
    confirmationCode: string;
    currentURL: string;
  }): Promise<void> {
    await Promise.resolve();
  }
}
