import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BasketPageRoutingModule } from './basket-routing.module';
import { BasketPage } from './basket.page';
import { ProductModule } from '../../../components/product/product.module';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';
import { PageFooterModule } from 'src/app/components/page-footer/page-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    BasketPageRoutingModule,
    ProductModule,
    PageFooterModule
  ],
  declarations: [BasketPage]
})
export class BasketPageModule {}
