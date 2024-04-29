import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { OrderStatus, OrderType } from 'src/app/definitions/models/DataTypes.model';
import {
  ProductModel,
  orderModel,
} from 'src/app/definitions/models/Entities.model';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
  OrderStatus = OrderStatus;
  orderId = '';
  orderInfo: orderModel = new orderModel();
  selectedProducts: ProductModel[] = [];
  basket: any[] = [];
  validationError = false;
  isAlertOpen = false;

  PageData = { PaymentURL: null as any | null };

  public alertButtons = ['OK'];

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public storageService: StorageService,
    public orderService: OrderService,
    private appComponent: AppComponent,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.orderId = this.route.snapshot.paramMap.get('ordernumber') ?? '';
    this.PageData.PaymentURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://mvppay.giv2pay.com/?giv_id=' + this.orderId + '&userToken=' + this.storageService.Token);

    this.loadData();

    this.subscriptions.add(this.appComponent.ChatHUB.onOrderChanged$.subscribe((data: any) => { this.onOrderChanged(data); }));

  }

  ngOnDestroy() { this.subscriptions.unsubscribe(); }

  onOrderChanged(data: any) {
    if (data.OrderNumber === this.orderId) {

      if (data.Status === OrderStatus.Paid) { this.router.navigate(['./history']); }

      else { this.setData(data); }
    }
  }

  async loadData() {
    this.setData(await this.orderService.Get(this.orderId));
  }

  setData(data: any) {
    if (data) {
      this.orderInfo = data;

      if (data) {
        if (data.Status === OrderStatus.Draft) { this.navCtrl.navigateRoot('shopping/' + data.OrderNumber); }
        else if (data.Status === OrderStatus.InProgress) {
          if (data.Type === OrderType.Buy) { this.navCtrl.navigateRoot('order/' + data.OrderNumber); }
          else { this.navCtrl.navigateRoot('suggestion/' + data.OrderNumber); }
        }
        else if (data.Status === OrderStatus.Ready) { }
        else { this.navCtrl.navigateRoot('history'); }
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

  async updateAddress(address: string) {
    if (address) {
      const body = {
        OrderNumber: this.orderId,
        Address: address,
      };
      let result = await this.orderService.Address(this.orderId, body);
      if (result) {
        console.log('updateAddress > OrderNumber:', result.OrderNumber);
        console.log('updateAddress > Address:', result.Address);
        console.log('updateAddress > this.orderInfo:', this.orderInfo);
      }
    }
  }

  onClick(action: string, product: any) {
    switch (action) {
      case 'remove':
        this.updateProduct(product, 0);
        break;
      case 'inc':
        this.updateProduct(product, product.Quantity + 1);
        break;
      case 'dec':
        this.updateProduct(product, product.Quantity - 1);
        break;
    }
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  async inprogressOrder() {
    try {
      await this.orderService.InProgress(this.orderId);

      if (this.orderInfo.Type === OrderType.Buy) { this.navCtrl.navigateRoot('order/' + this.orderInfo.OrderNumber); }
      else { this.navCtrl.navigateRoot('suggestion/' + this.orderInfo.OrderNumber); }
    }
    catch { }
  }

  goToVeiw() {
    this.storageService.Basket = this.basket;
    if (this.orderInfo.Address === '' || this.orderInfo.Address === null) {
      this.setOpen(true);
      this.validationError = true;
    } else {
      this.router.navigate(['./history']);
    }
  }
}
