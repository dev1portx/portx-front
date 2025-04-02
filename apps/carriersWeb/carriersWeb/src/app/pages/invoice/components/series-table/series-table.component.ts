import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { SerieAttributesInterface } from '../../models/invoice/series';
import { SeriesNewComponent } from '../series-new/series-new.component';

@Component({
    selector: 'app-series-table',
    templateUrl: './series-table.component.html',
    styleUrls: ['./series-table.component.scss'],
    standalone: false
})
export class SeriesTableComponent implements OnInit {
  @ViewChild(MatTable) public table: MatTable<SerieAttributesInterface>;
  @Input() public seriesTableData: SerieAttributesInterface[];

  @Input() public readonly: boolean = false;

  public dataSource: MatTableDataSource<SerieAttributesInterface>;
  public displayedColumns: string[];

  @Output() public refresh: EventEmitter<void> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private notificationsService: NotificationsService,
    private apiRestService: AuthService,
    private translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    this.displayedColumns = ['serie', 'comprobante', 'folio', 'use_for_automatic_stamp', 'color', 'logo'].concat(
      this.readonly ? [] : ['actions'],
    );
  }

  public ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<SerieAttributesInterface>(this.seriesTableData);
  }

  public editSerie(serie: any): void {
    const dialogRef = this.dialog.open(SeriesNewComponent, {
      data: serie,
      restoreFocus: false,
      autoFocus: false,
      backdropClass: ['brand-dialog-1'],
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.message != '') {
        this.notificationsService[result.success ? 'showSuccessToastr' : 'showErrorToastr'](result.message);

        if (result.success) this.refresh.emit();
      }
    });
  }

  public async deleteSerie(serie: string) {
    let requestJson = {
      _id: serie,
    };
    (await this.apiRestService.apiRest(JSON.stringify(requestJson), `invoice/series/delete`)).subscribe(
      (res) => {
        this.notificationsService.showErrorToastr(this.translateService.instant('invoice.serie-table.save-error'));
        this.refresh.emit();
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
