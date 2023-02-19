import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import slugify from 'slugify';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  create(createItemDto: CreateItemDto, user: UserEntity) {
    const createdAt = new Date();
    const formatDate = createdAt.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const isAvailable = true;
    const slugString = `${createItemDto.title} ${formatDate}`;
    const slug = slugify(slugString, {
      lower: true,
      strict: true,
    });
    return this.itemRepository.save({
      ...createItemDto,
      createdAt,
      isAvailable,
      user,
      slug,
    });
  }

  findAll() {
    return this.itemRepository.find({
      relations: ['category', 'user', 'againstCategory'],
    });
  }

  findOne(slug: string) {
    return this.itemRepository.findOne({
      where: { slug },
      relations: ['category', 'user', 'againstCategory'],
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    if (updateItemDto.title) {
      const item = await this.itemRepository.findOneBy({ id });
      const formatDate = item.createdAt.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const newSlug = `${updateItemDto.title} ${formatDate}`;
      updateItemDto.slug = slugify(newSlug, {
        lower: true,
        strict: true,
      });
    }
    return this.itemRepository.update(id, updateItemDto);
  }

  remove(id: number) {
    return this.itemRepository.delete(id);
  }
}
