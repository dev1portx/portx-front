import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-continue-modal',
    templateUrl: './continue-modal.component.html',
    styleUrls: ['./continue-modal.component.scss'],
    standalone: false
})
export class ContinueModalComponent implements OnInit {
  public title;
  public items: string[] = [];

  public translateList = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data, translateService: TranslateService) {
    this.translateList = translateService.instant('orders.continue-modal-list');
  }

  public ngOnInit(): void {
    this.title = this.data.title;

    if (this.data.list?.length > 0) {
      for (const field of this.data.list) {
        this.items.push(this.translateList[field]);
      }
    }
  }
}
