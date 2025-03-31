import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "../interceptors/log.interceptor";
import { ParamId } from "../decorators/param-id.decorator";
import { Roles } from "../decorators/role.decorator";
import { Role } from "../enums/role.enum";
import { RoleGuard } from "../guards/role.guard";
import { AuthGuard } from "../guards/auth.guard";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @SkipThrottle()
  @Get()
  async list() {
    return this.userService.list();
  }

  @Throttle({ default: { ttl: 6000, limit: 10 } }) // Override default rate limit from app.module.ts
  @Get(":id")
  async retrieve(@ParamId() id: number) {
    return this.userService.retrieve(id);
  }

  @Put(":id")
  async update(
    @Body() data: UpdatePutUserDTO,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.userService.update(id, data);
  }

  @Patch(":id")
  async partialUpdate(
    @Body() data: UpdatePatchUserDTO,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.userService.partialUpdate(id, data);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return {
      success: await this.userService.delete(id),
    };
  }
}
