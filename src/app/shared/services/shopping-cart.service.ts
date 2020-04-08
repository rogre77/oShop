import { Injectable } from '@angular/core';
// import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from 'shared/models/product';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';
import 'rxjs/add/operator/take';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // item$: AngularFireDatabase;
  item: any;

  constructor(
    private db: AngularFireDatabase
    ) { }

    async getCart(): Promise<Observable<ShoppingCart>> {
      const cartId = await this.getOrCreateCartId();
      const itm =  this.db.object('shopping-carts/' + cartId).snapshotChanges()
      .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)));
      // console.log('ITM:', itm);
      /*
      let itm = this.db.object('shopping-carts/' + cartId).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
      */
      return itm;
      }
    /*
      let item$ = this.db.object('/shopping-cart/' + cartId + '/items' + product.$key).snapshotChanges()
      .pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
    */

    async addToCart(product: Product) {
      this.updateItemQuantity(product, 1);
    }

    async removeFromCart(product: Product) {
      this.updateItemQuantity(product, -1);
    }

    async clearCart() {
      const cartId = await this.getOrCreateCartId();
      this.db.object('/shopping-carts/' + cartId + '/items').remove();
    }

    private async getOrCreateCartId(): Promise<string> {
      const cartId = localStorage.getItem('cartId');
      if (cartId) { return cartId; }

      const result = await this.create();
      localStorage.setItem('cartId', result.key);
      return result.key;
    }

    private async updateItemQuantity(product: Product, change: number) {
      const cartId = await this.getOrCreateCartId();
      const item$ = this.getItem(cartId, product.key);
      item$.valueChanges().take(1).subscribe(item => {
        // if (item) item$.update({ quantity: item.quantity + 1});
        if (item) {
          this.item = item;
          // console.log('qnty', this.item.quantity);
          item$.update({ quantity: this.item.quantity + change});
          if (this.item.quantity + change === 0) { item$.remove(); }
        } else { item$.set({
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: 1
        });
        }
      });
    }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

}
