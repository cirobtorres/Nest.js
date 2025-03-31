import { Role } from "../enums/role.enum";
import { CreateUserDTO } from "../user/dto/create-user.dto";

export const createUserDTO: CreateUserDTO = {
  name: "John Doe",
  email: "johndoe@email.com",
  password: "1aB@56",
  birthAt: "2001-01-01",
  role: Role.Admin,
};
