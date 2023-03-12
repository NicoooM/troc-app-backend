import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createItemDto: CreateItemDto,
    @User() user,
    @UploadedFiles() files,
  ) {
    return this.itemsService.create(createItemDto, user, files);
  }

  @Get()
  findAll(@Query() queries) {
    return this.itemsService.findAll(queries);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.itemsService.findOne(slug);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @User() user,
    @UploadedFiles() files,
  ) {
    return this.itemsService.update(+id, updateItemDto, user, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @User() user) {
    return this.itemsService.remove(+id, user);
  }
}
