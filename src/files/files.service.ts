import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}
  private async createFile(dto: CreateFileDto): Promise<File> {
    const createdFile = await this.fileRepo.create(dto);

    await this.fileRepo.save(createdFile);

    return createdFile;
  }
  async uploadPostFile(file: UploadFileDto): Promise<File> {
    const { originalname, size, mimetype, buffer } = file;
    const params = {
      Bucket: 'hobos/image',
      Key: originalname,
      Body: buffer,
    };
    const { Location, ETag, Key } = await this.uploadS3(params);
    const uploadFileDto = {
      url: Location,
      eTag: ETag,
      key: Key,
      size,
      type: mimetype,
    };

    const createdFile = await this.createFile(uploadFileDto);

    return createdFile;
  }
  private async uploadS3(
    params: S3.Types.PutObjectRequest,
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = this.getS3();

    return await s3.upload(params).promise();
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
  }
}
export class UploadFileDto {
  originalname: string;
  size: number;
  mimetype: string;
  buffer: Buffer;
}
