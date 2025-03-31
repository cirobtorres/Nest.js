import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { AuthMeDTO } from "./dto/auth-me.dto";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../decorators/user.decorator";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
import { FileService } from "../file/file.service";
import { UserEntity } from "../user/entity/user.entity";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post("register")
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post("login")
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post("forget")
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post("reset")
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post("me")
  async me(@User() user: UserEntity) {
    return user;
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  @Post("file")
  async uploadFile(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: "image/jpg" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 80 }),
        ],
      })
    )
    photo: Express.Multer.File
  ) {
    const filename = `photo-${user.id}.jpg`;
    try {
      await this.fileService.upload(photo, filename);
    } catch (error) {
      throw new BadRequestException(error);
    }
    // return { success: true };
    return photo;
  }

  @UseInterceptors(FilesInterceptor("files"))
  @UseGuards(AuthGuard)
  @Post("files")
  async uploadFiles(
    @User() user: UserEntity,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return files;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "documents",
        maxCount: 10,
      },
    ])
  )
  @UseGuards(AuthGuard)
  @Post("files-fields")
  async uploadFilesFields(
    @User() user: UserEntity,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] }
  ) {
    return { files };
  }
}
