import { config } from "dotenv";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { EmailService } from "./email.service";

config();

@Module({
  imports: [
    MailerModule.forRoot({
      // Work option #1:
      // transport: {
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_ACCOUNT,
      //     pass: process.env.EMAIL_ACCOUNT_PASSWORD,
      //   },
      // },
      // Work option #2:
      transport: `smtps://${process.env.EMAIL_ACCOUNT}:${process.env.EMAIL_ACCOUNT_PASSWORD}@smtp.gmail.com`,
      defaults: {
        from: "Backend_03 <modules@nestjs.com>",
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
