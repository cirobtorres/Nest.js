import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async create(data: CreateUserDTO) {
    if (await this.usersRepository.exists({ where: { email: data.email } }))
      throw new BadRequestException("E-mail já cadastrado");
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user); // Saves all at once
  }

  async list() {
    return this.usersRepository.find();
  }

  async retrieve(id: number) {
    await this.exists(id);
    return this.usersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO
  ) {
    await this.exists(id);
    if (!birthAt) birthAt = null;
    if (!!birthAt) birthAt = this.convertToISOString(birthAt);
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    await this.usersRepository.update(id, {
      email,
      name,
      password,
      birthAt,
      role,
    });
    return this.retrieve(id);
  }

  async partialUpdate(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    if (data.birthAt) data.birthAt = this.convertToISOString(data.birthAt);
    if (data.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }
    await this.usersRepository.update(id, data);
    return this.retrieve(id);
  }

  async delete(id: number) {
    await this.exists(id);
    await this.usersRepository.delete(id);
    return true;
  }

  async exists(id: number) {
    if (
      !(await this.usersRepository.exists({
        where: {
          id,
        },
      }))
    )
      throw new NotFoundException("User does not exist");
  }

  convertToISOString(birthAt: string) {
    const [year, month, day] = birthAt.split("-").map((value) => Number(value));
    return new Date(year, month, day).toISOString();
  }
}
