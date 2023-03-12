import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ItemEntity } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { UploadFileEntity } from './entities/upload-file.entity';

@Injectable()
export class UploadFileService {
  private s3;
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

  checkFiles(files: any[]) {
    if (files.length > 6) {
      files = files.slice(0, 6);
    }

    files.forEach((file) => {
      this.checkFile(file);
    });
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
    const file = await this.uploadFileAws(user, filesData);
    const uploadFile = await this.uploadFileRepository.create({
      ...file,
      item,
    });
    return await this.uploadFileRepository.save(uploadFile);
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

  remove(id: number) {
    return `This action removes a #${id} uploadFile`;
  }
}
