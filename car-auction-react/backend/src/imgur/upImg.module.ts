import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FilesController } from './upImg.controller';
import { CloudinaryService } from './upImg.service';
import { ConfigModule } from '@nestjs/config';
import { v2 as cloudinary, config } from 'cloudinary';

@Module({
    // imports: [ConfigModule],
    controllers: [FilesController],
    providers: [
        CloudinaryService,
        {
            provide: 'CLOUDINARY',
            useFactory: (): typeof cloudinary => {
                return config({
                    cloud_name:'djit2fyvr',
                    api_key: '442357156712943',
                    api_secret: 'kD5Lmxy-WzIcuCjljoIpkQZcaX4',
                });
            },
        },
    ],
    exports: [CloudinaryService],
})

export class UpImgModule { }
