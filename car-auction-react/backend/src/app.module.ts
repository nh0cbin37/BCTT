import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import {ConfigModule} from '@nestjs/config'
import { ProductModule } from './product/product.module';
import {  UpImgModule } from './imgur/upImg.module';
// import { Nftmodule } from './NFT/nft.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [AuthModule, FirebaseModule,ConfigModule.forRoot(), ProductModule,UpImgModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
