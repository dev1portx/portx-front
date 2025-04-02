import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoColorPicker } from './color-picker.component';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [BegoColorPicker],
  imports: [
    CommonModule,
    TranslatePipe
  ],
  exports: [BegoColorPicker]
})
export class BegoColorPickerModule { }

