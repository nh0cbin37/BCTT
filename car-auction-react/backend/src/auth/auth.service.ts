import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IUser } from 'src/model/user.model';
import { addDoc, collection, Firestore, getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { query } from 'express';

@Injectable()
export class AuthService {
  private db: Firestore;
  constructor(private firebaseService: FirebaseService) {

  }
  async createUserOrLogin(userData: IUser) {
    const userExists = await this.firebaseService.userExists(userData.Address);
    if (!userExists) {
      await this.firebaseService.createUser(userData);
      return { message: 'User created successfully!' };
    } else {
      return { message: 'User with this address already exists.' };
    }
  }
  
}
