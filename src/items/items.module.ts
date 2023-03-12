import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { UploadFileModule } from 'src/upload-file/upload-file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity]), UploadFileModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
