import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { usersRepositoryMock } from "../test/user-repository.mock";
import { userEntityList } from "../test/user-entity-list.mock";
import { createUserDTO } from "../test/user-create-dto.mock";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { updateUserDTO } from "../test/user-update-put-dto.mock";
import { updatePartialUserDTO } from "../test/user-update-patch-dto.mock";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, usersRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  test("Validates database instantiation", () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe("Create", () => {
    test("method create", async () => {
      jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);
      const result = await userService.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe("Read", () => {
    test("method list", async () => {
      const result = await userService.list();
      expect(result).toEqual(userEntityList);
    });

    test("method retrieve", async () => {
      const result = await userService.retrieve(1);
      expect(result).toEqual(userEntityList[1]);
    });
  });
  describe("Update", () => {
    test("method update", async () => {
      const result = await userService.update(1, updateUserDTO);
      expect(result).toEqual(userEntityList[1]);
    });

    test("method updatePartial", async () => {
      const result = await userService.partialUpdate(1, updatePartialUserDTO);
      expect(result).toEqual(userEntityList[1]);
    });
  });
  describe("Delete", () => {
    test("method delete", async () => {
      const result = await userService.delete(1);
      expect(result).toEqual(true);
    });
  });
});
