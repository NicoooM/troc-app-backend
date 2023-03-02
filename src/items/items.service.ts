import { HttpException, Injectable } from '@nestjs/common';
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
    const slugString = `${createItemDto.title} ${formatDate}`;
    const slug = slugify(slugString, {
      lower: true,
      strict: true,
    });
    return this.itemRepository.save({
      ...createItemDto,
      user,
      slug,
    });
  }

  findAll(queries: any) {
    let { limit, page } = queries;
    const { category, againstCategory, search, userId } = queries;

    if (!limit) {
      limit = 3;
    }

    if (!page) {
      page = 1;
    }

    const posts = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoin('item.user', 'user')
      .leftJoinAndSelect('item.againstCategory', 'againstCategory')
      .orderBy('item.createdAt', 'DESC');

    if (category) {
      posts.andWhere('item.category.id = :category', { category });
    }

    if (againstCategory) {
      posts.andWhere('item.againstCategory.id = :againstCategory', {
        againstCategory,
      });
    }

    if (search) {
      posts.andWhere('LOWER(item.title) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (userId) {
      posts.andWhere('item.user.id = :userId', { userId });
    }

    posts.take(limit).skip((page - 1) * limit);

    return posts.getMany();
  }

  findOne(slug: string) {
    return this.itemRepository.findOne({
      where: { slug },
      relations: ['category', 'user', 'againstCategory'],
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto, user: UserEntity) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new HttpException('Item not found', 400);
    }

    if (item.user.id !== user.id) {
      throw new HttpException('You are not the owner', 400);
    }
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

  async remove(id: number, user: UserEntity) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new HttpException('Item not found', 400);
    }

    if (item.user.id !== user.id) {
      throw new HttpException('You are not the owner', 400);
    }

    return this.itemRepository.softDelete(id);
  }
}
