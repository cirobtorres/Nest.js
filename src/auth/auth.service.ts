import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { UserEntity } from "../user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  private issuer = "login";
  private audience = "users";

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService
  ) {}

  async createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
        },
        {
          expiresIn: "7 days",
          issuer: this.issuer,
          audience: this.audience,
        }
      ),
    };
  }

  checkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return payload;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new UnauthorizedException("E-mail or password incorrects");
    if (!(await bcrypt.compare(password, user.password)))
      throw new NotFoundException("E-mail or password incorrects");
    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException("E-mail incorrect");
    }
    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: "7 days",
        issuer: "forget",
        audience: "users",
      }
    );
    await this.mailer.sendMail({
      subject: "Password Reset",
      to: user.email, // MAIL DESTINATION: Test hardcoded here if you need it!
      template: "forget",
      context: {
        name: user.name,
        token: token,
      },
    });
    return { success: true };
  }

  async reset(new_password: string, token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: "forget",
        audience: "users",
      });

      if (isNaN(data.id)) throw new BadRequestException("Invalid token");

      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(new_password, salt);

      await this.usersRepository.update(Number(data.id), {
        password,
      });

      const user = await this.userService.retrieve(Number(data.id));

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async register(data: AuthRegisterDTO) {
    delete data.role; // Security
    const user = await this.userService.create(data as CreateUserDTO);
    return this.createToken(user);
  }
}
