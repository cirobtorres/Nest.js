import { Role } from "../enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@email.com",
    password: "$2b$10$OKS/R8aEpQ58bfgMLme3HO15xY1YTeQJctATkpSKuFh2zvxXnq/Fe",
    birthAt: "2001-01-01",
    role: Role.Admin,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
  {
    id: 2,
    name: "Mary Sue",
    email: "marysue@email.com",
    password: "$2b$10$OKS/R8aEpQ58bfgMLme3HO15xY1YTeQJctATkpSKuFh2zvxXnq/Fe",
    birthAt: "2001-01-01",
    role: Role.User,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
  {
    id: 3,
    name: "Yuri Nator",
    email: "yurinator@email.com",
    password: "$2b$10$OKS/R8aEpQ58bfgMLme3HO15xY1YTeQJctATkpSKuFh2zvxXnq/Fe",
    birthAt: "2001-01-01",
    role: Role.User,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
  {
    id: 4,
    name: "Naida Navolta",
    email: "naida@email.com",
    password: "$2b$10$OKS/R8aEpQ58bfgMLme3HO15xY1YTeQJctATkpSKuFh2zvxXnq/Fe",
    birthAt: null,
    role: Role.User,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  },
];
