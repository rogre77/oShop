import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/firestore';

@Injectable()
export class CategoryService {
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  ctgy: any;

  //constructor(private db: AngularFireDatabase) { }
  constructor(private db: AngularFireDatabase) { 
    this.itemsRef = db.list('/categories');
    console.log('ITEMSREF', this.itemsRef);
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );   
    this.items.subscribe(aa => console.log('ITEMS', aa));

  }

  getCategories() {
    //console.log('TEST', this.items);
    //return this.db.list('/categories').valueChanges();
    return this.items;
  }
}
