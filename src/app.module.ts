import { config } from "dotenv";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { CoreModule } from "./core/core.module";
import { TestingModule } from "./modules/testing/testing.module";
import { UserAccountsModule } from "./modules/user-accounts/user-accounts.module";
import { BloggersPlatformModule } from "./modules/bloggers-platform/bloggers-platform.module";
import { AllHttpExceptionsFilter } from "./core/exceptions/filters/all-exception.filter";
import { DomainHttpExceptionsFilter } from "./core/exceptions/filters/domain-exception.filter";

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
  providers: [
    //Первым сработает DomainHttpExceptionsFilter
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
