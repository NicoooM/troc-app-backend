import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  create(createItemDto: CreateItemDto) {
    const createdAt = new Date();
    const isAvailable = true;
    return this.itemRepository.save({
      ...createItemDto,
      createdAt,
      isAvailable,
    });
  }

  findAll() {
    return this.itemRepository.find({ relations: ['category', 'user'] });
  }

  findOne(id: number) {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemRepository.update(id, updateItemDto);
  }

  remove(id: number) {
    return this.itemRepository.delete(id);
  }
}
