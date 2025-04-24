import { config } from "dotenv";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { CoreModule } from "./core/core.module";
import { TestingModule } from "./modules/testing/testing.module";
import { UserAccountsModule } from "./modules/user-accounts/user-accounts.module";
import { BloggersPlatformModule } from "./modules/bloggers-platform/bloggers-platform.module";

config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: process.env?.MONGO_DB_NAME,
    }),
    CoreModule,
    TestingModule,
    UserAccountsModule,
    BloggersPlatformModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
