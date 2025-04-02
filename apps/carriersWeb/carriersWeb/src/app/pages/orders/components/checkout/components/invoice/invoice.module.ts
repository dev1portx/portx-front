import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { BegoTicketModule } from 'src/app/shared/components/bego-ticket/bego-ticket.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BegoPhoneInputModule } from 'src/app/shared/components/bego-phone-input/bego-phone-input.module';
import { BegoAddressAutocompleteModule } from 'src/app/shared/components/bego-address-autocomplete/bego-address-autocomplete.module';
import { AppMaterialModule } from 'src/app/material';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    BegoTicketModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    BegoPhoneInputModule,
    BegoAddressAutocompleteModule,
    AppMaterialModule
  ],
  exports: [InvoiceComponent]
})
export class InvoiceModule {}
