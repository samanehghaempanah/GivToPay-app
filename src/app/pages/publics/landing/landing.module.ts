import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LandingPageRoutingModule } from './landing-routing.module';
import { LandingPage } from './landing.page';
import { PageHeaderModule } from 'src/app/components/page-header/page-header.module';
import { FormatTimePipe } from 'src/app/definitions/pipe/timer.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    PageHeaderModule
  ],
  declarations: [LandingPage , FormatTimePipe]
})
export class LandingPageModule {}
