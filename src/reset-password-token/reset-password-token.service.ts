import { Injectable } from '@nestjs/common';
import { CreateResetPasswordTokenDto } from './dto/create-reset-password-token.dto';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordTokenEntity } from './entities/reset-password-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    @InjectRepository(ResetPasswordTokenEntity)
    private resetPasswordTokenRepository: Repository<ResetPasswordTokenEntity>,
    private usersService: UsersService,
  ) {}

  async create(createResetPasswordTokenDto: CreateResetPasswordTokenDto) {
    const findUser = await this.usersService.findOne(
      createResetPasswordTokenDto.email,
    );

    if (!findUser) {
      throw new HttpException('User not found', 400);
    }

    const findToken = await this.findOneByEmail(
      createResetPasswordTokenDto.email,
    );

    if (findToken) {
      return findToken;
    }

    const token = uuidv4();

    const newToken = await this.resetPasswordTokenRepository.create({
      token,
      user: findUser,
    });
    return this.resetPasswordTokenRepository.save(newToken);
  }

  async findOneByEmail(email: string) {
    const findUser = await this.usersService.findOne(email);

    if (!findUser) {
      throw new HttpException('User not found', 400);
    }

    const token = await this.resetPasswordTokenRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('user.email = :email', { email })
      .getOne();

    return token;
  }

  async findOne(token: string) {
    const findToken = await this.resetPasswordTokenRepository
      .createQueryBuilder('resetPasswordToken')
      .leftJoinAndSelect('resetPasswordToken.user', 'user')
      .where('resetPasswordToken.token = :token', { token })
      .getOne();
    return findToken;
  }

  remove(id: number) {
    return this.resetPasswordTokenRepository.delete(id);
  }
}
