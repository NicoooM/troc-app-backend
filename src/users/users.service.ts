import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private commentRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdAt = new Date();
    return this.commentRepository.save({ ...createUserDto, createdAt });
  }

  findAll() {
    return this.commentRepository.find();
  }

  findOne(id: number) {
    return this.commentRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.commentRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
