import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OrderStatus, OrderType } from 'src/app/definitions/models/DataTypes.model';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  orders: any[] = [];
  orderStatus = OrderStatus;
  isAlertOpen = false;
  public alertButtons = ['No', 'Yes'];

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public storageService: StorageService,
    public orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    let result = await this.orderService.GET();
    if (result) {
      this.orders = result.Items;
      console.log('this.orders:', this.orders);
    }
  }

  async newOrder() {
    let result = await this.orderService.POST();
    if (result) {
      this.router.navigate(['./shopping', result.OrderNumber])
    }
  }

  setOpen(isOpen: boolean) { this.isAlertOpen = isOpen; }

  goToVeiw(orderNumber: string) { this.router.navigate(['./basket/', orderNumber]); }
}
