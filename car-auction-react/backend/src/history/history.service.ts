import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { addDoc, getDocs } from '@firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { History } from './schemas/history.schema';
import { Product } from 'src/product/schemas/product.schema';

@Injectable()
export class HistoryService {

  constructor(private firebaseService: FirebaseService) {
  
    }
  async create(createHistoryDto: CreateHistoryDto) {
    try {
          const docref = await addDoc(this.firebaseService.historyCollection, createHistoryDto);
          return docref.id;
        } catch (error) {
          return error;
        }
  }

  async findAll() {
     try {
          const snapshot = await getDocs(this.firebaseService.historyCollection);
          const historys: History[] = [];
          snapshot.forEach((doc) => {
            historys.push({ ...doc.data(), id: doc.id } as History);
          })
          return historys;
        } catch (error) {
          return error;
        }
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
