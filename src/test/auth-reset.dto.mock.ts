import { AuthResetDTO } from "../auth/dto/auth-reset.dto";
import { forgetToken } from "./jwt-forget-token.mock";

export const authResetDTO: AuthResetDTO = {
  password: "12345",
  token: forgetToken,
};
