import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoPhoneInputComponent } from './bego-phone-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AppMaterialModule } from 'src/app/material';
import { NgxMaskDirective } from 'ngx-mask';

@NgModule({
  declarations: [BegoPhoneInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe, FormsModule, AppMaterialModule, NgxMaskDirective],
  exports: [BegoPhoneInputComponent]
})
export class BegoPhoneInputModule {}
