import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceDetailsComponent } from './price-details.component';
import { TranslatePipe } from '@ngx-translate/core';



@NgModule({
  declarations: [
    PriceDetailsComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  exports: [
    PriceDetailsComponent
  ]
})
export class PriceDetailsModule { }
