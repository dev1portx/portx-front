import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';

import { SatCertificateRoutingModule } from './sat-certificate-routing.module';
import { SatCertificateComponent } from './sat-certificate.component';
import { DragFileBarModule } from 'src/app/shared/components/drag-file-bar/drag-file-bar.module';

import { FiscalDocumentCardComponent } from './components/fiscal-document-card/fiscal-document-card.component';

import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslatePipe } from '@ngx-translate/core';
import { BegoAlertModule } from 'src/app/shared/components/bego-alert/bego-alert.module';
import { AppMaterialModule } from 'src/app/material';
import { LottieComponent } from 'ngx-lottie';

@NgModule({
  declarations: [SatCertificateComponent, FiscalDocumentCardComponent],
  imports: [
    CommonModule,
    SatCertificateRoutingModule,
    ButtonModule,
    BegoAlertModule,
    TranslatePipe,
    DragFileBarModule,
    ObserversModule,
    ReactiveFormsModule,
    AppMaterialModule,
    LottieComponent,
  ],
  exports: []
})
export class SatCertificateModule {}
