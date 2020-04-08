import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.css']
})
export class ShoppingCartSummaryComponent {
  @Input('cart') cart: ShoppingCart;

  /*
  constructor() {}

ngOnInit() {
  console.log("CART", this.cart);
  let x = this.cart.items;
  console.log("CARTitems", x);

}

*/
}
