import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const findUser = await this.usersService.findOne(createUserDto.email);
    if (findUser) {
      throw new HttpException('User already exists', 400);
    }

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email } = loginDto;
    const user: UserEntity = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Invalid credentials', 400);
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    return { token };
  }
}
