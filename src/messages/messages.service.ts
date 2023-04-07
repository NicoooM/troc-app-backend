import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.messageRepository.save(createMessageDto);
    return message;
  }

  findAll() {
    return this.messageRepository.find();
  }

  findOne(id: number) {
    return this.messageRepository.findOneBy({ id });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    return await this.messageRepository.update(id, updateMessageDto);
  }

  remove(id: number) {
    return this.messageRepository.softDelete(id);
  }
}
