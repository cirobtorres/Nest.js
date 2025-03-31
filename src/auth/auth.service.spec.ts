import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { usersRepositoryMock } from "../test/user-repository.mock";
import { jwtServiceMock } from "../test/jwt-service.mock";
import { userServiceMock } from "../test/user-service.mock";
import { mailerServiceMock } from "../test/mailer-service.mock";
import { userEntityList } from "../test/user-entity-list.mock";
import { accessToken } from "../test/jwt-access-token.mock";
import { jwtPayload } from "../test/jwt-payload.mock";
import { forgetToken } from "../test/jwt-forget-token.mock";
import { authRegisterDTO } from "../test/auth-register.dto.mock";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        usersRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  test("Validates database instantiation", () => {
    expect(authService).toBeDefined();
  });

  describe("Token", () => {
    test("createToken method", async () => {
      const result = await authService.createToken(userEntityList[3]);
      expect(result).toEqual({ accessToken });
    });

    test("checkToken method", () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });

    test("isValidToken method", () => {
      const result = authService.isValidToken(accessToken);
      expect(result).toEqual(true);
    });
  });

  describe("Authentication", () => {
    test("login method", async () => {
      const result = await authService.login("naida@email.com", "1aB@56");
      expect(result).toEqual({ accessToken });
    });

    test("forget method", async () => {
      const result = await authService.forget("naida@email.com");
      expect(result).toEqual({ success: true });
    });

    test("reset method", async () => {
      const result = await authService.reset("1aB@00", forgetToken);
      expect(result).toEqual({ accessToken });
    });

    test("register method", async () => {
      const result = await authService.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});
