// import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImgurService } from './imgur.service';
// import {Express} from 'express'
// @Controller('files')
// export class FilesController {
//   constructor(private readonly imgurService: ImgurService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
//     const url = await this.imgurService.uploadImage(file);
//     return { url };
//   }
// }
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './upImg.service';

@Controller('cloudinary')
export class FilesController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file',{limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  }}))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
    const result = await this.cloudinaryService.uploadImage(file, 'ImageNFT');
    return result;
  }

  @Get(':folderName')
  async getImages(@Param('folderName') folderName: string) {
    const images = await this.cloudinaryService.getImagesInFolder(folderName);
    return images;
  }
  
}