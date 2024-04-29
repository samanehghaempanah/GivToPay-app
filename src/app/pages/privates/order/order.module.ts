import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderPageRoutingModule } from './order-routing.module';
import { OrderPage } from './order.page';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';
import { PageFooterModule } from 'src/app/components/page-footer/page-footer.module';
import { ProductModule } from '../../../components/product/product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    OrderPageRoutingModule,
    PageFooterModule,
    ProductModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
