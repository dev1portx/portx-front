import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadFiscalDocsRoutingModule } from './upload-fiscal-docs-routing.module';
import { DragFileBarModule } from 'src/app/shared/components/drag-file-bar/drag-file-bar.module';
import { FiscalDocumentCardComponent } from './components/fiscal-document-card/fiscal-document-card.component';
import { UploadFiscalDocsComponent } from './upload-fiscal-docs.component';

import { ClickStopPropagationDirective } from '../../../../shared/directives/click-stop-propagation.directive';

import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FiscalDocumentItemComponent } from './components/fiscal-document-item/fiscal-document-item.component';
import { BegoAlertModule } from 'src/app/shared/components/bego-alert/bego-alert.module';
import { AppMaterialModule } from 'src/app/material';
import { LottieComponent } from 'ngx-lottie';

@NgModule({
  declarations: [FiscalDocumentCardComponent, FiscalDocumentItemComponent, UploadFiscalDocsComponent, ClickStopPropagationDirective],
  imports: [
    CommonModule,
    UploadFiscalDocsRoutingModule,
    ButtonModule,
    BegoAlertModule,
    TranslatePipe,
    DragFileBarModule,
    AppMaterialModule,
    LottieComponent,
  ],
  exports: []
})
export class UploadFiscalDocsModule {}
