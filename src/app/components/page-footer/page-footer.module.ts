import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PageFooterComponent } from './page-footer.component';

@NgModule({
  declarations: [PageFooterComponent],
  imports: [CommonModule, IonicModule],
  exports: [PageFooterComponent],
})
export class PageFooterModule {}