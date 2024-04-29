import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SuggestionPageRoutingModule } from './suggestion-routing.module';
import { SuggestionPage } from './suggestion.page';
import { ProductModule } from '../../../components/product/product.module';
import { PageHeaderModule } from '../../../components/page-header/page-header.module';
import { PageFooterModule } from 'src/app/components/page-footer/page-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    SuggestionPageRoutingModule,
    ProductModule,
    PageFooterModule
  ],
  declarations: [SuggestionPage]
})
export class SuggestionPageModule {}
