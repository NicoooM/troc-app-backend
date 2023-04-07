import { Injectable } from '@nestjs/common';
import { CreateConnectedUserDto } from './dto/create-connected-user.dto';
import { UpdateConnectedUserDto } from './dto/update-connected-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUsersService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(createConnectedUserDto: CreateConnectedUserDto) {
    const connectedUser = await this.connectedUserRepository.save(
      createConnectedUserDto,
    );
    return connectedUser;
  }

  findAll() {
    return this.connectedUserRepository.find();
  }

  findOne(id: number) {
    return this.connectedUserRepository.findOneBy({ id });
  }

  async update(id: number, updateConnectedUserDto: UpdateConnectedUserDto) {
    const connectedUser = await this.connectedUserRepository.findOneBy({ id });
    return this.connectedUserRepository.save({
      ...connectedUser,
      ...updateConnectedUserDto,
    });
  }

  async remove(socketId: string) {
    const connectedUser = await this.connectedUserRepository.findOneBy({
      socketId,
    });
    return await this.connectedUserRepository.delete(connectedUser);
  }
}
