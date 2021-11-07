import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService, // private readonly awsService: AwsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.upload(file);
  }
}
