import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragFileBarComponent } from './drag-file-bar.component';
import { TranslatePipe } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DragFileBarComponent,
  ],
  imports: [
    CommonModule,
    TranslatePipe,
  ],
  exports: [
    DragFileBarComponent,
  ]
})
export class DragFileBarModule { }
