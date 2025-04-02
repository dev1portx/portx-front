import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoAddressAutocompleteComponent } from './bego-address-autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AppMaterialModule } from 'src/app/material';

@NgModule({
  declarations: [BegoAddressAutocompleteComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe, AppMaterialModule],
  exports: [BegoAddressAutocompleteComponent]
})
export class BegoAddressAutocompleteModule {}
