import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoSelectComponent } from './bego-select.component';
import { TranslatePipe } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BegoSelectComponent,
  ],
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  exports: [
    BegoSelectComponent,
  ]
})
export class BegoSelectModule { }
