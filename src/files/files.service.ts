import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import axios, { AxiosResponse } from 'axios';
import { PassThrough } from 'stream';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}
  async createFile(dto: CreateFileDto): Promise<File> {
    const createdFile = await this.fileRepo.create(dto);
    await this.fileRepo.save(createdFile);

    return createdFile;
  }
  async upload(file): Promise<File> {
    const { originalname } = file;
    const bucketS3 = 'movement-seoul';
    const { Location, ETag, Key } = await this.uploadS3(
      file.buffer,
      bucketS3,
      originalname,
    );
    const uploadFileDto = {
      url: Location,
      eTag: ETag,
      key: Key,
      size: file.size,
      type: file.type,
    };
    const createdFile = await this.createFile(uploadFileDto);

    return createdFile;
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    return await s3.upload(params).promise();
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
  }

  uploadFromStream(
    fileResponse: AxiosResponse,
    fileName: string,
    bucket: string,
  ): {
    passThrough: PassThrough;
    promise: Promise<S3.ManagedUpload.SendData>;
  } {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
    const passThrough = new PassThrough();
    const promise = s3
      .upload({
        Bucket: bucket,
        Key: fileName,
        ContentType: fileResponse.headers['content-type'],
        ContentLength: fileResponse.headers['content-length'],
        Body: passThrough,
      })
      .promise();

    return { passThrough, promise };
  }
  async downloadFile(downloadUrl: string): Promise<any> {
    return axios.get(downloadUrl, {
      responseType: 'stream',
    });
  }

  async imageToAws(event): Promise<string> {
    const responseStream = await this.downloadFile(event.fileUrl);

    const { passThrough, promise } = this.uploadFromStream(
      responseStream,
      event.fileName,
      'movement-seoul',
    );
    responseStream.data.pipe(passThrough);

    return promise
      .then((result) => {
        console.log(result);
        return result.Location;
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  }
}
