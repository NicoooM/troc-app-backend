import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async create(createRoomDto: CreateRoomDto, user: UserEntity) {
    createRoomDto.firstUser = user;
    return await this.roomRepository.save(createRoomDto);
  }

  findAll(user: UserEntity) {
    const { id: userId } = user;

    const rooms = this.roomRepository
      .createQueryBuilder('room')
      .where('room.firstUser = :userId', { userId })
      .orWhere('room.secondUser = :userId', { userId });

    return rooms.getMany();
  }

  findOne(id: number) {
    return this.roomRepository.findOneBy({ id });
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return this.roomRepository.update(id, updateRoomDto);
  // }

  remove(id: number) {
    return this.roomRepository.softDelete(id);
  }
}
