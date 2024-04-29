import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AudioRecorderComponent } from 'src/app/components/audio-recorder/audio-recorder.component';
import { FileMessageComponent } from 'src/app/components/file-message/file-message.component';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';
import { ShoppingPageRoutingModule } from './shopping-routing.module';
import { ShoppingPage } from './shopping.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingPageRoutingModule,
    PageHeaderModule,
    RouterModule,
  ],
  declarations: [ShoppingPage, AudioRecorderComponent, FileMessageComponent ]
})
export class ShoppingPageModule {}
