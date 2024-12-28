import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports:[FirebaseModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
