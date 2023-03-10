import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { ResetPasswordTokenService } from '../reset-password-token/reset-password-token.service';
import { CreateResetPasswordTokenDto } from 'src/reset-password-token/dto/create-reset-password-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private resetPasswordTokenService: ResetPasswordTokenService,
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

  async forgotPassword(
    createResetPasswordTokenDto: CreateResetPasswordTokenDto,
  ) {
    const token = await this.resetPasswordTokenService.create(
      createResetPasswordTokenDto,
    );

    return token;
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const findToken = await this.resetPasswordTokenService.findOne(token);

    if (!findToken) {
      throw new HttpException('Token not found', 400);
    }

    const user = await this.usersService.findOne(findToken.user.email);

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const updatedUser = await this.usersService.updatePassword(
      resetPasswordDto.password,
      user,
    );

    await this.resetPasswordTokenService.remove(findToken.id);

    return updatedUser;
  }
}
