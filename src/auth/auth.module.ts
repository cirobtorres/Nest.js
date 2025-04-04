import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { FileModule } from "../file/file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";

@Module({
  imports: [
    JwtModule.register({
      secret: String(process.env.JWT_SECRET_KEY),
    }),
    forwardRef(() => UserModule),
    FileModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
