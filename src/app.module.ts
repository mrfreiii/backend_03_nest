import { config } from "dotenv";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { CoreModule } from "./core/core.module";
import { TestingModule } from "./modules/testing/testing.module";
import { UserAccountsModule } from "./modules/user-accounts/user-accounts.module";
import { BloggersPlatformModule } from "./modules/bloggers-platform/bloggers-platform.module";

config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: process.env?.MONGO_DB_NAME,
    }),
    CoreModule,
    TestingModule,
    UserAccountsModule,
    BloggersPlatformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
