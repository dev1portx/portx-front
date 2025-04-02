import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BegoPhoneInputModule } from 'src/app/shared/components/bego-phone-input/bego-phone-input.module';
import { TranslatePipe } from '@ngx-translate/core';
import { HistoryComponent } from './history.component';
import { BegoAlertModule } from 'src/app/shared/components/bego-alert/bego-alert.module';
import { BegoAddressAutocompleteModule } from 'src/app/shared/components/bego-address-autocomplete/bego-address-autocomplete.module';
import { HistoryModule as HistoryModule1 } from 'src/app/pages/history/history.module';
import { AppMaterialModule } from 'src/app/material';
import { TagsModule } from 'src/app/pages/tags/tags.module';

// import { VerificationModalComponent } from '../verification-modal/verification-modal.component';

@NgModule({
  declarations: [
    HistoryComponent
    // VerificationModalComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BegoPhoneInputModule,
    TranslatePipe,
    BegoAlertModule,
    BegoAddressAutocompleteModule,
    HistoryModule1,
    AppMaterialModule,
    TagsModule
  ]
})
export class HistoryModule {}
