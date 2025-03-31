import { UserService } from "../user/user.service";
import { userEntityList } from "./user-entity-list.mock";

export const userServiceMock = {
  provide: UserService,
  useValue: {
    retrieve: jest.fn().mockResolvedValue(userEntityList[3]),
    create: jest.fn().mockResolvedValue(userEntityList[3]),
    list: jest.fn().mockResolvedValue(userEntityList),
    update: jest.fn().mockResolvedValue(userEntityList[3]),
    partialUpdate: jest.fn().mockResolvedValue(userEntityList[3]),
    delete: jest.fn().mockResolvedValue(true),
    exists: jest.fn().mockResolvedValue(true),
  },
};
