import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HistoryModalComponent } from './components/history-modal/history-modal.component';
import { DateTime } from 'luxon';
import { ChibiptService } from 'src/app/shared/services/chibipt.service';
import { Subscription } from 'rxjs';

interface History {
  _id: string;
  title: string;
  created: string;
  rename?: boolean;
  selected?: boolean;
}

type DateType = 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'previous';

@Component({
    selector: 'app-history-chibpt',
    templateUrl: './history-chibpt.component.html',
    styleUrls: ['./history-chibpt.component.scss'],
    standalone: false
})
export class HistoryChibptComponent implements OnInit, OnDestroy {
  @ViewChild('scrollHistory') scrollHistory!: ElementRef;
  @Output() selectedHistoryEmitter = new EventEmitter<string>();
  @Input() openHistoryChat: boolean = false;
  @ViewChild('renameInput') renameInput: ElementRef;
  public lang: string = 'en';

  public histories: { [key in DateType]: History[] } = {
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    previous: []
  };

  public selectedIndices: { [key in DateType]: number | null } = {
    today: null,
    yesterday: null, 
    last7Days: null, 
    last30Days: null, 
    previous: null
  };

  dates: string[] = ['today', 'yesterday', 'last7Days', 'last30Days', 'previous'];

  public loading: boolean = false;

  pages = {
    actual: 1,
    total: 0,
    scrolleable: true
  };

  auxName: string = '';
  getNewHistorySub: Subscription;

  selectedButtonIndex: { date: DateType, index: number } | null = null;

  constructor(
    private translateService: TranslateService,
    private apiRestService: AuthService,
    private matDialog: MatDialog,
    public chibiptService: ChibiptService
  ) {
    this.lang = this.translateService.currentLang;
  }

  public async ngOnInit() {
    await this.getHistoryChat();
    this.getNewHistorySub = this.chibiptService.sendNewHistorySub$.subscribe((history: History) => {
      this.unselectHistoryTitle();
      this.histories.today.unshift(history);
    });
  }

  createNewChat() {
    if (this.chibiptService.sendingMessage) return;
    this.unselectHistoryTitle();
    this.chibiptService.createNewChat();
  }

  async getHistoryChat() {
    this.loading = true;
    const url = `assistant?limit=30&page=${this.pages.actual}`;

    (await this.apiRestService.apiRestGet(url, { apiVersion: 'v1.1', loader: false })).subscribe({
      next: ({ result }) => {
        if (this.pages.actual === 1) this.pages.total = result.pages;
        if (result?.result?.length) this.organizeHistories(result.result);
        this.pages.scrolleable = result.pages > this.pages.actual;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  async renameHistory(_id: string, index: number, date: DateType) {
    const requestJson = JSON.stringify({ name: this.auxName });

    (await this.apiRestService.apiRestPut(requestJson, `assistant/rename/${_id}`, { apiVersion: 'v1.1' })).subscribe({
      next: () => {
        this.histories[date][index].title = this.auxName;
        this.histories[date][index].rename = false;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    });
  }

  selectButton(index: number, event: Event, date: DateType) {
    event.stopPropagation(); 
    this.selectedButtonIndex = { date, index };
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    this.selectedButtonIndex = null;
  }

  cancelRename(index: number, date: DateType) {
    this.histories[date][index].rename = false;
    this.auxName = '';
  }

  activeRename(index: number, date: DateType) {
    this.histories[date].forEach((history) => (history['rename'] = false));
    this.histories[date][index]['rename'] = true;
    this.auxName = this.histories[date][index].title;
    window.requestAnimationFrame(() => {
      this.renameInput.nativeElement.focus();
    });
  }

  unselectHistoryTitle() {
    for (const date in this.histories) {
      this.histories[date].forEach((history) => (history['selected'] = false));
      this.selectedIndices[date] = null;
    }
  }

  selectedHistoryTitle({ _id, selected }: History, index: number, date: DateType) {
    if (selected || this.chibiptService.sendingMessage) return;

    this.unselectHistoryTitle();
    this.histories[date][index]['selected'] = true;
    this.selectedHistoryEmitter.emit(_id);
  }

  openCloseModal(history: History, index: number, date: DateType) {
    if (history?.selected && this.chibiptService.sendingMessage) return;

    const dialogRef = this.matDialog.open(HistoryModalComponent, {
      data: history,
      restoreFocus: false,
      backdropClass: ['brand-ui-dialog-2']
    });

    dialogRef.afterClosed().subscribe((deleted?) => {
      if (deleted) {
        if (history?.selected) this.chibiptService.createNewChat();
        this.histories[date].splice(index, 1);
      }
    });
  }

  @HostListener('scroll', ['$event.target'])
  public onScroll(): void {
    if (!this.scrollHistory.nativeElement) return;

    const { scrollTop, scrollHeight, clientHeight } = this.scrollHistory.nativeElement;

    const scroll = scrollHeight - scrollTop === clientHeight;

    if (!this.pages.scrolleable || this.loading || !scroll) return;

    this.pages.actual += 1;
    this.getHistoryChat();
  }

  private organizeHistories(histories: History[]) {
    const now = DateTime.local();
    const today = now.startOf('day');
    const yesterday = today.minus({ days: 1 });
    const last7Days = today.minus({ days: 7 });
    const last30Days = today.minus({ days: 30 });

    histories.forEach((history: History) => {
      const historyDate = DateTime.fromFormat(history.created, 'dd/MM/yy');

      switch (true) {
        case historyDate >= today:
          this.histories.today.push(history);
          break;
        case historyDate >= yesterday:
          this.histories.yesterday.push(history);
          break;
        case historyDate >= last7Days:
          this.histories.last7Days.push(history);
          break;
        case historyDate >= last30Days:
          this.histories.last30Days.push(history);
          break;

        default:
          this.histories.previous.push(history);
          break;
      }
    });
  }

  ngOnDestroy() {
    this.getNewHistorySub.unsubscribe();
  }
}
