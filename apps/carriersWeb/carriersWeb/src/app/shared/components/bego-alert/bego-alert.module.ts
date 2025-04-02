import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoAlertComponent } from './bego-alert.component';
import { TranslatePipe } from '@ngx-translate/core';



@NgModule({
  declarations: [
    BegoAlertComponent,
  ],
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  exports: [
    BegoAlertComponent,
  ]
})
export class BegoAlertModule { }
