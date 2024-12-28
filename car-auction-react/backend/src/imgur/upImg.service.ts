// // src/imgur/imgur.service.ts
// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class ImgurService {
//   private readonly clientId = 'e9b4649e59093f7'; // Thay bằng Client ID của bạn

//   async uploadImage(file: Express.Multer.File): Promise<string> {
//     const formData = new FormData();
//     formData.append('image', file.buffer.toString('base64'));

//     try {
//       const response = await axios.post(
//         'https://api.imgur.com/3/image',
//         formData,
//         {
//           headers: {
//             Authorization: `Client-Secret ${this.clientId}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       return response.data.data.link; // Trả về link ảnh từ Imgur
//     } catch (error) {
//       console.error('Lỗi upload ảnh:', error);
//       throw error; // Hoặc xử lý lỗi theo cách khác
//     }
//   }
// }



import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
  async getImagesInFolder(folderName: string): Promise<any[]> {
    try {
      const results = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName, // Lọc theo tên folder
        max_results: 500, // Số lượng ảnh tối đa trả về (tuỳ chỉnh)
      });

      return results.resources;
    } catch (error) {
      console.error('Lỗi khi lấy ảnh:', error);
      throw error; // Xử lý lỗi theo nhu cầu của bạn
    }
  }
}