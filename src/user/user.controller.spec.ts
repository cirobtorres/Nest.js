import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { userServiceMock } from "../test/user-service.mock";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../test/guard.mock";
import { RoleGuard } from "../guards/role.guard";
import { UserService } from "./user.service";
import { createUserDTO } from "../test/user-create-dto.mock";
import { userEntityList } from "../test/user-entity-list.mock";
import { updateUserDTO } from "../test/user-update-put-dto.mock";
import { updatePartialUserDTO } from "../test/user-update-patch-dto.mock";

let userController: UserController;
let userService: UserService;

describe("UserController", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();
    // The guards were overwritten to always return true
    // All we need to know is if the guards are being correctly used (on that order)

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test("Validates database instantiation", () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe("Guards", () => {
    test("guards not missing", () => {
      const guards = Reflect.getMetadata("__guards__", UserController);
      expect(guards.length).toEqual(2); // Both guards
      expect(new guards[0]()).toBeInstanceOf(AuthGuard); // AuthGuard is the first
      expect(new guards[1]()).toBeInstanceOf(RoleGuard); // RoleGuard is the second
    });
  });

  describe("Create", () => {
    test("create method", async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[3]);
    });
  });

  describe("Read", () => {
    test("retrieve method", async () => {
      const result = await userController.retrieve(1);
      expect(result).toEqual(userEntityList[3]);
    });

    test("list method", async () => {
      const result = await userController.list();
      expect(result).toEqual(userEntityList);
    });
  });

  describe("Update", () => {
    test("update method", async () => {
      const result = await userController.update(updateUserDTO, 1);
      expect(result).toEqual(userEntityList[3]);
    });

    test("partialUpdate method", async () => {
      const result = await userController.partialUpdate(
        updatePartialUserDTO,
        1
      );
      expect(result).toEqual(userEntityList[3]);
    });
  });

  describe("Delete", () => {
    test("delete method", async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({ success: true });
    });
  });
});
