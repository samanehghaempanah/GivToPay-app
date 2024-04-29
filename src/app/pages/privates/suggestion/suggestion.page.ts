import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { ItemStatus, OrderStatus, OrderType } from 'src/app/definitions/models/DataTypes.model';
import { ProductModel, orderModel } from 'src/app/definitions/models/Entities.model';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {
  OrderStatus = OrderStatus;
  orderId = '';
  orderInfo: orderModel = new orderModel();
  selectedProducts: ProductModel[] = [];
  basket: any[] = [];
  itemStatus = ItemStatus;

  private subscriptions = new Subscription();


  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public storageService: StorageService,
    public orderService: OrderService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('ordernumber') ?? '';
    this.loadData();

    this.subscriptions.add(
      this.appComponent.ChatHUB.onOrderChanged$.subscribe((data: any) => {
        if (data.OrderNumber === this.orderId) { this.setData(data); }
      })
    );
  }

  ngOnDestroy() { this.subscriptions.unsubscribe(); }

  async loadData() {
    this.setData(await this.orderService.Get(this.orderId));    
  }

  setData(data: any) {
    if (data) {
      this.orderInfo = data;
      this.selectedProducts = data.SelectedProducts;

      if (data) {
        if (data.Status === OrderStatus.Draft) { this.navCtrl.navigateRoot('shopping/' + data.OrderNumber); }  
        else if (data.Status === OrderStatus.InProgress) {  
          if (data.Type === OrderType.Buy) { this.navCtrl.navigateRoot('order/' + data.OrderNumber); }  
         else { }
        }  
        else if (data.Status === OrderStatus.Ready) { this.navCtrl.navigateRoot('basket/' + data.OrderNumber); }  
        else { this.navCtrl.navigateRoot('history/'); }
      }

      this.selectedProducts = data.SelectedProducts;
      console.log('loadData > orderInfo:', this.orderInfo);
      console.log('loadData > selectedProducts:', this.selectedProducts);
      this.storageService.Basket = this.orderInfo;
    }
  }


  async updateProduct(product: ProductModel, quantity: number) {
    let result = await this.orderService.Product_POST(product.Id, quantity);
    if (result) {
      this.orderInfo = result;
      this.selectedProducts = result.SelectedProducts;
      console.log('updateProduct > orderInfo:', this.orderInfo);
      console.log('updateProduct > selectedProducts:', this.selectedProducts);
      this.storageService.Basket = this.orderInfo;
    }
  }

  add(product: ProductModel) {
    this.updateProduct(product, 1);
  }

  remove(product: ProductModel) {
    this.updateProduct(product, 0);
  }

  inc(product: ProductModel) {
    this.updateProduct(product, product.Quantity + 1);
  }

  dec(product: ProductModel) {
    this.updateProduct(product, product.Quantity - 1);
  }

  async goToVeiw() {
    try {

      await this.orderService.Ready(this.orderId);

      this.storageService.Basket = this.basket;
      this.router.navigate(['./basket', this.orderId]);
    }
    catch { }
  }
}
