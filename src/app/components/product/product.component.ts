import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductModel } from 'src/app/definitions/models/Entities.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() productInfo: ProductModel = new ProductModel();
  @Output() addToBasket = new EventEmitter();
  @Output() removeFromBasket = new EventEmitter();
  @Output() addItem = new EventEmitter();
  @Output() removeItem = new EventEmitter();

  isModalOpen = false;

  constructor() {}

  ngOnInit() {
  }

  onClick(action: string, product: any) {
    switch (action) {
      case 'add':
        this.addToBasket.emit(product);
        this.productInfo.Quantity = 1;
        break;
      case 'remove':
        this.removeFromBasket.emit(product);
        this.productInfo.Quantity = 0;
        break;
      case 'inc':
        this.addItem.emit(product);
        this.productInfo.Quantity++;
        break;
      case 'dec':
        this.removeItem.emit(product);
        this.productInfo.Quantity--;
        break;
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
