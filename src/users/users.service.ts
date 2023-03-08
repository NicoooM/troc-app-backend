import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;
    const findUserUsername = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {
        username,
      })
      .getOne();

    const findUserEmail = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .getOne();

    if (findUserUsername) {
      throw new HttpException('Username already exists', 400);
    }

    if (findUserEmail) {
      throw new HttpException('Email already exists', 400);
    }

    const { password } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, 10);

    return await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(emailOrUsername: string): Promise<UserEntity | undefined> {
    const user: UserEntity = await this.userRepository
      .createQueryBuilder('user')
      .where(
        'user.email = :emailOrUsername OR user.username = :emailOrUsername',
        { emailOrUsername },
      )
      .getOne();

    if (!user) {
      throw new HttpException('Incorrect password or email', 400);
    }

    return user;
  }

  async update(updateUserDto: UpdateUserDto, user: UserEntity) {
    const { username, postalCode, city } = updateUserDto;
    const findUser = await this.userRepository.findOneBy({ username });

    if (findUser && findUser.id !== user.id) {
      throw new HttpException('Username already exists', 400);
    }

    return await this.userRepository.save({
      ...user,
      username,
      postalCode,
      city,
    });
  }

  async remove(id: number) {
    return await this.userRepository.softDelete(id);
  }

  async getMe(user: UserEntity): Promise<UserEntity | undefined> {
    const email = user.email;
    const findUser = await this.userRepository.findOneBy({ email });
    return findUser;
  }
}
