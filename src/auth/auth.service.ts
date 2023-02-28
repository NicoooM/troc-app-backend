import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async register(createUserDto: CreateUserDto) {
  //   const { email, username } = createUserDto;

  //   const findUsername = await this.userRepository.findOneBy({ username });
  //   if (findUsername) {
  //     throw new HttpException('Username already exists', 400);
  //   }

  //   const findUser = await this.userRepository.findOneBy({ email });
  //   if (findUser) {
  //     throw new HttpException('Email already exists', 400);
  //   }

  //   const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  //   const user = await this.usersService.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });
  //   return user;
  // }

  // async login(loginDto: LoginDto) {
  //   const { email } = loginDto;
  //   const user: UserEntity = await this.userRepository.findOneBy({ email });
  //   if (!user) {
  //     throw new HttpException('User not found', 404);
  //   }

  //   const isPasswordMatching = await bcrypt.compare(
  //     loginDto.password,
  //     user.password,
  //   );

  //   if (!isPasswordMatching) {
  //     throw new HttpException('Invalid credentials', 400);
  //   }

  //   const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  //   return { token };
  // }

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const payload = {
      email: user.email,
      id: user.id,
    };

    return { access_token: this.generateJwtToken(payload) };
  }

  generateJwtToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
