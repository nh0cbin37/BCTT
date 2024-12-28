import { query, addDoc, collection, CollectionReference, doc, Firestore, getDoc, getDocs, getFirestore, limit, QuerySnapshot, setDoc, where } from '@firebase/firestore';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { IUser } from 'src/model/user.model';
@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public firestore: Firestore;
  //collection 
  public userCollection: CollectionReference;
  public productCollection: CollectionReference;
  public historyCollection: CollectionReference;
  constructor(private configService: ConfigService) {
    this.app = initializeApp({
      apiKey: configService.get<string>('apiKey'),
      authDomain: configService.get<string>('authDomain'),
      projectId: configService.get<string>('projectId'),
      storageBucket: configService.get<string>('storageBucket'),
      messagingSenderId: configService.get<string>('messagingSenderId'),
      appId: configService.get<string>('appId'),

    });
    this.auth = getAuth(this.app);
    this.firestore = getFirestore();
    this._createCollection();

  }

  private _createCollection() {
    this.historyCollection = collection(this.firestore,'historys');
    this.productCollection = collection(this.firestore, 'products');
  }
 

  async userExists(address: string): Promise<boolean> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where("Address", "==", address));
      const querySnapshot: QuerySnapshot = await getDocs(q);
      // console.log(querySnapshot);
      return !querySnapshot.empty; //true if at least one document exists with that address
    } catch (error) {
      console.error("Error checking address field:", error);
      throw error;
    }
  }

  async createUser(userData: IUser): Promise<{ id: string }> {
    const usersCollection = collection(this.firestore, 'users');
    try {
      const docRef = await addDoc(usersCollection, {
        ...userData,
        createdAt: Date(),
      });
      console.log('User created successfully!');
      return { id: docRef.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }


}
