import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../test/guard.mock";
import { authServiceMock } from "../test/auth-service.mock";
import { fileServiceMock } from "../test/file-service.mock";
import { authLoginDTO } from "../test/auth-login.dto.mock";
import { accessToken } from "../test/jwt-access-token.mock";
import { authRegisterDTO } from "../test/auth-register.dto.mock";
import { authForgetDTO } from "../test/auth-forget.dto.mock";
import { authResetDTO } from "../test/auth-reset.dto.mock";
import { userEntityList } from "../test/user-entity-list.mock";
import { getFile } from "../test/file-get-file.mock";

let authController: AuthController;

describe("AuthController", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  test("Validates database instantiation", () => {
    expect(authController).toBeDefined();
  });

  describe("Authentication", () => {
    test("login method", async () => {
      const result = await authController.login(authLoginDTO);
      expect(result).toEqual({ accessToken });
    });

    test("register method", async () => {
      const result = await authController.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });

    test("forget method", async () => {
      const result = await authController.forget(authForgetDTO);
      expect(result).toEqual({ success: true });
    });

    test("reset method", async () => {
      const result = await authController.reset(authResetDTO);
      expect(result).toEqual({ accessToken });
    });
  });

  describe("Authenticated Routes", () => {
    test("me method", async () => {
      const result = await authController.me(userEntityList[0]);
      expect(result).toEqual(userEntityList[0]);
    });

    test("uploadFile method", async () => {
      const file = await getFile();
      const result = await authController.uploadFile(userEntityList[0], file);
      expect(result).toEqual(file);
    });
  });
});
