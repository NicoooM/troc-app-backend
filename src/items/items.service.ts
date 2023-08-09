import { HttpException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import slugify from 'slugify';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(createItemDto: CreateItemDto, user: UserEntity, files) {
    this.uploadFileService.checkFiles(files);
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
    const item = await this.itemRepository.save({
      ...createItemDto,
      user,
      slug,
    });
    files.forEach(async (file) => {
      await this.uploadFileService.create(file, user, item);
    });
    return item;
  }

  async findAll(queries) {
    let { limit, page } = queries;
    const { category, againstCategory, search, userId, exclude, isAvailable } =
      queries;

    if (!limit) limit = 3;

    if (!page) page = 1;

    const posts = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoin('item.user', 'user')
      .leftJoinAndSelect('item.files', 'files')
      .leftJoinAndSelect('item.againstCategory', 'againstCategory')
      .orderBy('item.createdAt', 'DESC');

    if (category) posts.andWhere('item.category.id = :category', { category });

    if (againstCategory)
      posts.andWhere('item.againstCategory.id = :againstCategory', {
        againstCategory,
      });

    if (search)
      posts.andWhere('LOWER(item.title) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });

    if (userId) posts.andWhere('item.user.id = :userId', { userId });

    if (exclude) posts.andWhere('item.id != :exclude', { exclude });

    if (isAvailable)
      posts.andWhere('item.isAvailable = :isAvailable', { isAvailable });

    const total = await posts.getCount();

    posts.take(limit).skip((page - 1) * limit);

    const hasMore = page * limit < total;
    const items = await posts.getMany();

    const result = {
      items,
      total,
      hasMore,
    };

    return result;
  }

  findOne(slug: string) {
    return this.itemRepository.findOne({
      where: { slug },
      relations: ['category', 'user', 'againstCategory', 'files'],
    });
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    user: UserEntity,
    files,
  ) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['user', 'files'],
    });

    if (!item) {
      throw new HttpException('Item not found', 400);
    }

    if (item.user.id !== user.id) {
      throw new HttpException('You are not the owner', 400);
    }
    if (updateItemDto.title) {
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

    const filesToDeleteLength = updateItemDto?.filesToDelete?.length ?? 0;

    const filesAvailable = 6 - item.files.length + filesToDeleteLength;

    if (files) {
      files = this.uploadFileService.checkFiles(
        files,
        filesAvailable > 0 ? filesAvailable : 0,
      );
    }

    if (updateItemDto.filesToDelete) {
      if (Array.isArray(updateItemDto.filesToDelete)) {
        updateItemDto.filesToDelete.forEach((fileId) => {
          this.uploadFileService.remove(Number(fileId));
        });
      } else {
        this.uploadFileService.remove(Number(updateItemDto.filesToDelete));
      }
    }

    if (files) {
      files.forEach(async (file) => {
        await this.uploadFileService.create(file, user, item);
      });
    }

    delete updateItemDto.filesToDelete;

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
