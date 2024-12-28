
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { query, addDoc, collection, doc, DocumentReference, Firestore, getDoc, getDocs, getFirestore, limit, orderBy, QuerySnapshot, where, updateDoc } from '@firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Product } from './schemas/product.schema';
import { AuthError } from 'firebase/auth';
// import * as admin from 'firebase-admin';
// admin.initializeApp();


// const db = getFirestore();
@Injectable()
export class ProductService {

  constructor(private firebaseService: FirebaseService) {

  }
  async create(createProductDto: CreateProductDto) {
    try {
      const docref = await addDoc(this.firebaseService.productCollection, createProductDto);
      return docref.id;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const snapshot = await getDocs(this.firebaseService.productCollection);
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id } as Product);
      })
      return products;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    const productCollection = collection(this.firebaseService.firestore, 'products');
    const q = query(productCollection, where("nftTokenId", "==", id));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {
      const productCollection = collection(this.firebaseService.firestore, 'products');
      const productRef = doc(productCollection, id);
      //check available
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        throw new Error('Product not found'); // Hoặc xử lý lỗi theo cách khác
      }
      // update product
      await updateDoc(productRef, { ...updateProductDto });

    } catch (error) {
      const errorStatus = error as AuthError
      return errorStatus;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
  async findMaxValue() {

    try {
      const productCollection = collection(this.firebaseService.firestore, 'products');
      const q = query(productCollection, orderBy('nftTokenId', 'desc'), limit(1));

      const snapshot = await getDocs(q);
      // console.log("Acticve")
      if (snapshot.empty) {
        return 0; // return 0 if not avaible item product 
      }
      const maxDoc = snapshot.docs[0].data();
      return this.handleNftTokenId(maxDoc.nftTokenId);
    } catch (error) {
      return error;
    }
  }

  private handleNftTokenId(nftTokenId: any): number | Error {
    if (typeof nftTokenId === 'number') {
      return nftTokenId;
    } else if (typeof nftTokenId === 'string') {
      const parsedId = parseInt(nftTokenId, 10);
      if (!isNaN(parsedId)) {
        return parsedId;
      } else {
        console.error("Error: nftTokenId is a string but cannot be parsed as a number:", nftTokenId);
        return 0; // Hoặc throw new Error(...)
      }
    } else {
      console.error("Error: nftTokenId is neither a number nor a string:", nftTokenId);
      return 0; // Hoặc throw new Error(...)
    }
  }
}
