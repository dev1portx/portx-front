import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmitterAttributesInterface } from '../../models/invoice/emisores';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';

import { MatDialog } from '@angular/material/dialog';

import { FacturaEmitterComponent } from '../../components/factura-emitter/factura-emitter.component';
import { Router } from '@angular/router';
import { routes } from '../../consts';

@Component({
    selector: 'app-emisores-table',
    templateUrl: './emisores-table.component.html',
    styleUrls: ['./emisores-table.component.scss'],
    standalone: false
})
export class EmisoresTableComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<EmitterAttributesInterface>;
  @Input() emisoresTableData: EmitterAttributesInterface[];
  @Input() regimenFiscal: any;
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  public routes: typeof routes = routes;
  public dataSource: MatTableDataSource<EmitterAttributesInterface>;
  displayedColumns: string[] = [
    // "rfcPadre",
    'emisor',
    'nombre',
    'regimenFiscal',
    'email',
    'validado',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    private notificationsService: NotificationsService,
    private router: Router,
    private apiRestService: AuthService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<EmitterAttributesInterface>(this.emisoresTableData);
  }

  editEmisor(emisor: any): void {
    const dialogRef = this.dialog.open(FacturaEmitterComponent, {
      data: emisor,
      restoreFocus: false,
      autoFocus: false,
      backdropClass: ['brand-dialog-1']
    });
    dialogRef.afterClosed().subscribe((result?) => {
      if (result?.success === true) {
        this.refresh.emit();
        this.table.renderRows();
      }
    });
  }

  public async deleteEmisor(id: string) {
    let requestJson = {
      _id: id
    };

    (await this.apiRestService.apiRest(JSON.stringify(requestJson), `invoice/emitters/delete`)).subscribe(
      (res) => {
        this.notificationsService.showErrorToastr(this.translateService.instant('invoice.emisor-table.delete-success'));
        this.refresh.emit();
        this.table.renderRows();
      },
      (err) => {
        this.notificationsService.showErrorToastr(this.translateService.instant('invoice.emisor-table.delete-error'));
        console.log(err);
      }
    );
  }

  getSeries(id_emisor: string): void {
    this.router.navigate([routes.SERIES, { id: id_emisor }]);
  }

  async setDefault(id: string) {
    (await this.apiRestService.apiRest(JSON.stringify({ id }), 'invoice/emitters/set-default')).subscribe(
      (res) => {
        this.notificationsService.showErrorToastr(this.translateService.instant('invoice.emisor-table.set-default-success'));

        this.refresh.emit();
        this.table.renderRows();
      },
      (err) => {
        this.notificationsService.showErrorToastr(this.translateService.instant('invoice.emisor-table.set-default-error'));
        console.log(err);
      }
    );
  }

  gotoNewInvoice(emisor) {
    this.router.navigate([
      routes.NEW_FACTURA,
      {
        template: encodeURIComponent(
          JSON.stringify({
            emisor: {
              _id: emisor?._id,
              rfc: emisor?.rfc,
              nombre: emisor?.nombre,
              regimen_fiscal: emisor?.regimen_fiscal
            }
          })
        )
      }
    ]);
  }
}
