import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BegoInvoiceAddressModule } from '@begomx/ui-components';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslatePipe, BegoInvoiceAddressModule],
  exports: []
})
export class SavedLocationsModule {}
