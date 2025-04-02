import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BegoModalModule } from '@begomx/ui-components';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ShareReportModalComponent } from './share-report-modal.component';

@NgModule({
  declarations: [ShareReportModalComponent],
  imports: [CommonModule, BegoModalModule, ReactiveFormsModule, TranslatePipe],
  exports: [ShareReportModalComponent],
})
export class ShareReportModalModule {}
