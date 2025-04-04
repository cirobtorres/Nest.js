import { IsJWT, IsString, IsStrongPassword } from "class-validator";

export class AuthResetDTO {
  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsString()
  @IsJWT()
  token: string;
}
