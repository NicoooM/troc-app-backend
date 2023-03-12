import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFileEntity } from './entities/upload-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFileEntity])],
  controllers: [UploadFileController],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
