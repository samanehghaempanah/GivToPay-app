import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservePageRoutingModule } from './reserve-routing.module';

import { ReservePage } from './reserve.page';
import { PageHeaderModule } from 'src/app/components/page-header/page-header.module';
import { PageFooterModule } from 'src/app/components/page-footer/page-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    PageFooterModule,
    ReservePageRoutingModule,
  ],
  declarations: [ReservePage]
})
export class ReservePageModule {}
