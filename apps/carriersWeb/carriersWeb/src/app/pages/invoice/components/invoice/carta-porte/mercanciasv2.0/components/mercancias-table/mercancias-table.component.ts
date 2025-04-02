import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BegoChibiAlert, BegoDialogService, ApiRestService } from '@begomx/ui-components';

import { Paginator } from 'src/app/pages/invoice/models';
import { CartaPorteInfoService } from '../../../services/carta-porte-info.service';
import { generateUUID } from 'src/app/pages/invoice/containers/factura-edit-page/factura.core';
import { ImportMerchandiseComponent } from './components/import-merchandise/import-merchandise.component';

@Component({
    selector: 'app-mercancias-table',
    templateUrl: './mercancias-table.component.html',
    styleUrls: ['./mercancias-table.component.scss'],
    standalone: false
})
export class MercanciasTableComponent implements OnInit {
  @Input() public voucherType: string = '';
  @Output() public pageChange: EventEmitter<Paginator> = new EventEmitter();
  @Output() public editRecord: EventEmitter<string> = new EventEmitter();
  @Output() public dataChanged: EventEmitter<any> = new EventEmitter();

  public page: Paginator;
  // TODO: TYPE COMMODITIES
  public commoditiesTable: any;

  constructor(
    public consignmentNoteService: CartaPorteInfoService,
    private readonly matDialog: MatDialog,
    private readonly cd: ChangeDetectorRef,
    private readonly begoDialog: BegoDialogService,
    private readonly api: ApiRestService,
  ) {}

  private filter: any = {};

  public ngOnInit(): void {
    this.page = {
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 1,
      pageSearch: '',
    };

    this._initTable()._initializeData().handleUpdate();
  }

  private _initTable(): MercanciasTableComponent {
    this.commoditiesTable = {
      loading: false,
      columns: [
        { id: 'line', label: 'Línea', filter: 'input' },
        { id: 'bienes_transp', label: 'Bienes transportados' },
        { id: 'descripcion', label: 'Descripción' },
        { id: 'cantidad', label: 'Cantidad' },
        { id: 'clave_unidad', label: 'Clave Unidad' },
        { id: 'peso_en_kg', label: 'Peso' },
        { id: 'material_peligroso', label: 'Material peligroso' },
      ],
      values: [], //this.commodities,
      actions: [
        { id: 'edit', label: 'Editar', translate: 'edit-commodity', icon: 'edit' },
        { id: 'remove', label: 'Eliminar', translate: 'remove-commodity', icon: 'trash' },
      ],
      pageUI: {
        index: this.page.pageIndex,
        total: this.page.total,
        size: this.page.pageSize,
      },
      selectRow: {
        showColumnSelection: false,
        selectionLimit: 0,
        keyPrimaryRow: 'id',
      },
      changingPage: ({ index, size }: any): void => {
        this.page.pageIndex = index;
        this.commoditiesTable.pageUI.index = index;
        if (this.commoditiesTable.pageUI.size !== size) {
          this.page.pageIndex = 1;
          this.commoditiesTable.pageUI.index = 1;
        }
        this.page.pageSize = size;
        this.pageChange.emit(this.page);
        this.cd.markForCheck();
      },
      rowSelected: ($event: any): void => {
        console.log($event);
      },
      selectingAction: ({ type, data }: any) => {
        switch (type) {
          case 'edit':
            this.editRecord.emit(data.id);
            break;
          case 'remove':
            this.begoDialog.open({
              title: 'Eliminar mercancia...',
              content: 'Esta acción no podrá deshacerse, ¿desea continuar?',
              type: 'action',
              iconComponent: BegoChibiAlert,
              btnCopies: {
                confirm: 'Ok',
                cancel: 'Cancelar',
              },
              handleAction: (action: string): void => {
                if (action === 'confirm')
                  this.api
                    .request(
                      'DELETE',
                      `v1.0/consignment-note/merchandise/${this.consignmentNoteService.invoice_id}/${data._id}`,
                    )
                    .subscribe((response) => {
                      const { num_total_mercancias, peso_bruto_total } = response.result;
                      this.reloadData();

                      this.consignmentNoteService.addRecoletedInfoMercancias({
                        num_total_mercancias,
                        peso_bruto_total,
                      });
                      this.cd.markForCheck();
                    });
              },
            });
            break;
          default:
            break;
        }
      },
    };

    return this;
  }

  private _initializeData(): MercanciasTableComponent {
    this.consignmentNoteService.getMerchandise(this, this.page, this.filter);
    return this;
  }

  public reloadData(): void {
    this._initializeData().handleUpdate();
  }

  public handleUpdate(): MercanciasTableComponent {
    // ensure to update data before revalidate table rows and avoid delay
    this.cd.markForCheck();

    //this.consignmentNoteService.addRecoletedInfoMercancias({});
    this._toggleLoading();

    let line = 1;
    this.commoditiesTable.values = this.consignmentNoteService.commodities?.map((commodity) => {
      if (!commodity.id) commodity.id = generateUUID();

      const row = {
        line: 0,
        ...commodity,
        actions: { enabled: true, options: { edit: true, remove: true } },
        selection_check: false,
      };

      if (!this.consignmentNoteService.invoice_id) row.line = line++;

      return row;
    });

    this.commoditiesTable.pageUI = {
      ...this.commoditiesTable.pageUI,
      total: this.consignmentNoteService.commodities.length,
      size: this.page.pageSize,
    };

    this._toggleLoading();

    this.dataChanged.emit();
    return this;
  }

  private _toggleLoading(): void {
    this.commoditiesTable = { ...this.commoditiesTable, loading: !this.commoditiesTable.loading };
  }

  public _getTableCSSClass(): string {
    return this.consignmentNoteService.invoice_id ? '' : 'hide-refresh-button';
  }

  public filterChanged($event: any): void {
    this.filter = $event;
    this.reloadData();
  }

  public canSearchLocal(): boolean {
    return this.consignmentNoteService.invoice_id ? false : true;
  }

  private _validateInvoiceDataRequiredToImportFile(): string {
    const message: string[] = [];

    this.consignmentNoteService.infoRecolector.next(null);
    const locations = this.consignmentNoteService.info.ubicaciones;

    const _hasOriginAndDestinationIds = (): boolean => {
      this.cd.markForCheck();
      return (
        locations.some((location: any) => location.id_ubicacion.substring(0, 2) === 'OR') &&
        locations.some((location: any) => location.id_ubicacion.substring(0, 2) === 'DE')
      );
    };

    if (!this.consignmentNoteService.invoice_id) message.push('- Debe guardar la factura primero.');

    if (!this.voucherType || this.voucherType === '')
      message.push('- Debe capturar el tipo de comprobante de la factura.');

    if (!_hasOriginAndDestinationIds())
      message.push('- Debe capturar al menos un id de origen y uno de destino (ID Origen (OR...)/ID Destino (DE...)).');

    return message.length ? message.join('\n') : null;
  }

  public openImportMerchandiseDialog(): void {
    const errorMessage = this._validateInvoiceDataRequiredToImportFile();
    if (errorMessage) {
      this.begoDialog.open({
        title: 'Antes de realizar una importación...',
        content: errorMessage,
        type: 'informative',
        iconComponent: BegoChibiAlert,
        btnCopies: {
          confirm: 'Ok',
        },
      });
    } else {
      const data: { invoice_id: string } = { invoice_id: '' };
      const config = new MatDialogConfig();
      config.data = data;
      config.disableClose = true;
      config.autoFocus = true;

      const dialogRef = this.matDialog.open(ImportMerchandiseComponent, config);

      dialogRef.afterClosed().subscribe((success: boolean = false) => {
        if (success) this.reloadData();
      });
    }
  }
}
