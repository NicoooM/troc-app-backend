import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ItemEntity } from 'src/items/entities/item.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { UploadFileEntity } from './entities/upload-file.entity';

@Injectable()
export class UploadFileService {
  private s3: S3;
  private bucketName;

  constructor(
    @InjectRepository(UploadFileEntity)
    private uploadFileRepository: Repository<UploadFileEntity>,
  ) {
    this.s3 = new S3({
      region: process.env.APP_AWS_BUCKET_REGION,
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
    });
    this.bucketName = process.env.APP_AWS_BUCKET_NAME;
  }

  checkFiles(files: object[], totalFiles?: number) {
    if (typeof totalFiles !== 'undefined' && files.length > totalFiles) {
      throw new HttpException('You can upload only 6 files', 400);
    } else if (files.length > 6) {
      throw new HttpException('You can upload only 6 files', 400);
    }

    files.forEach((file) => {
      this.checkFile(file);
    });
    return files;
  }

  checkFile(fileData) {
    if (fileData.size > 3000000) {
      throw new HttpException('File size must be less than 3MB', 400);
    }

    if (
      fileData.mimetype !== 'image/png' &&
      fileData.mimetype !== 'image/jpeg' &&
      fileData.mimetype !== 'image/jpg'
    ) {
      throw new HttpException('File must be png or jpeg or jpg', 400);
    }
  }

  async create(filesData, user, item: ItemEntity) {
    try {
      const file = await this.uploadFileAws(user, filesData);
      const uploadFile = await this.uploadFileRepository.create({
        ...file,
        item,
      });
      return await this.uploadFileRepository.save(uploadFile);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async uploadFileAws(user, fileData) {
    const fileName = `${Date.now()}.${fileData.originalname.split('.').pop()}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileData.buffer,
      Key: `${user.id}/${fileName}`,
    };

    return this.s3.upload(uploadParams).promise();
  }

  async remove(id: number) {
    const file = await this.uploadFileRepository.findOneBy({ id });
    if (!file) {
      throw new HttpException(`File with ID ${id} not found`, 404);
    }

    const deleteParams = {
      Bucket: this.bucketName,
      Key: file.Key,
    };

    try {
      await this.s3.deleteObject(deleteParams).promise();
      await this.uploadFileRepository.delete(id);
    } catch (error) {
      throw new HttpException(`Failed to delete file with ID ${id}`, 500);
    }
  }
}
