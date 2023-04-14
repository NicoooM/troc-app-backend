import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(createRoomDto: CreateRoomDto, user: UserEntity) {
    createRoomDto.firstUser = user;
    return await this.roomRepository.save(createRoomDto);
  }

  async findAll(user: UserEntity) {
    const { id: userId } = user;

    const roomsQuery = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.firstUser', 'firstUser')
      .leftJoinAndSelect('room.secondUser', 'secondUser')
      .where('room.firstUser = :userId', { userId })
      .orWhere('room.secondUser = :userId', { userId });

    const rooms = await roomsQuery.getMany();

    const formatRooms = rooms.map(async (room) => {
      const otherUser =
        room.firstUser.id === userId ? room.secondUser : room.firstUser;

      const latestMessageQuery = this.messageRepository
        .createQueryBuilder('message')
        .where('message.room = :roomId', { roomId: room.id })
        .orderBy('message.createdAt', 'DESC')
        .limit(1);

      const latestMessage = await latestMessageQuery.getOne();

      delete room.firstUser;
      delete room.secondUser;
      return { ...room, latestMessage, otherUser };
    });

    const formatRoomsResult = await Promise.all(formatRooms);

    return formatRoomsResult;
  }

  async findOne(user: UserEntity, query: any) {
    const { id: userId } = user;

    const { receiverId } = query;

    let room = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.firstUser', 'firstUser')
      .leftJoinAndSelect('room.secondUser', 'secondUser')
      .where('room.firstUser = :userId', { userId })
      .andWhere('room.secondUser = :receiverId', { receiverId })
      .getOne();

    if (!room) {
      room = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.firstUser', 'firstUser')
        .leftJoinAndSelect('room.secondUser', 'secondUser')
        .where('room.firstUser = :receiverId', { receiverId })
        .andWhere('room.secondUser = :userId', { userId })
        .getOne();
    }

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.firstUser.id !== userId && room.secondUser.id !== userId) {
      throw new HttpException('Unauthorized', 401);
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.room.id = :roomId', { roomId: room.id })
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    const roomData = { ...room, messages };

    return roomData;
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return this.roomRepository.update(id, updateRoomDto);
  // }

  remove(id: number) {
    return this.roomRepository.softDelete(id);
  }
}
