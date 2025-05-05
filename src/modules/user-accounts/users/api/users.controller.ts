import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";

import { SETTINGS } from "../../../../settings";
import { UserViewDto } from "./view-dto/users.view-dto";
import { UsersService } from "../application/users.service";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { GetUsersQueryParams } from "./input-dto/get-users-query-params.input-dto";
import { UsersQueryRepository } from "../infrastructure/query/users.query-repository";

@Controller(SETTINGS.PATH.USERS)
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body);

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @ApiParam({ name: "id" }) //для сваггера
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param("id") id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
