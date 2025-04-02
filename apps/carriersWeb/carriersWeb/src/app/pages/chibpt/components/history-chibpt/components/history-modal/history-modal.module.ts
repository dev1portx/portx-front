import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryModalComponent } from './history-modal.component';
import { BegoModalModule } from '@begomx/ui-components';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
@NgModule({
  declarations: [HistoryModalComponent],
  imports: [CommonModule, BegoModalModule, ReactiveFormsModule, TranslatePipe],
  exports: [HistoryModalComponent]
})
export class HistoryModalModule {}
