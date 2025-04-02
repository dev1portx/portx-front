import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { TranslatePipe } from '@ngx-translate/core';



@NgModule({
  declarations: [ColorPickerComponent],
  imports: [
    CommonModule,
    TranslatePipe
  ],
  exports: [ColorPickerComponent]
})
export class ColorPickerModule { }
