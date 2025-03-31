import { JwtService } from "@nestjs/jwt";
import { accessToken } from "./jwt-access-token.mock";
import { jwtPayload } from "./jwt-payload.mock";

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue(accessToken),
    verify: jest.fn().mockReturnValue(jwtPayload),
  },
};
