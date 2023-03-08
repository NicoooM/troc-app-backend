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

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);

    if (!user) {
      throw new HttpException('Incorrect password or email', 400);
    }

    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new HttpException('Incorrect password or email', 400);
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
