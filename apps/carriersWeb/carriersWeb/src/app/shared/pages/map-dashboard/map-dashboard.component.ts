import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BegoPolygonsMap } from '@begomx/ui-components';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/shared/services/auth.service';
import { MapDashboardService } from './map-dashboard.service';
import { HeaderService } from 'src/app/pages/home/services/header.service';
import { NotificationsService } from '../../services/notifications.service';
import { ShareReportModalComponent } from 'src/app/pages/home/components/share-report-modal/share-report-modal.component';
import { PrimeService } from '../../services/prime.service';

declare var google: any;
const LIMIT = 6;
const DAY = 86_399_000;

@Component({
    selector: 'app-map-dashboard',
    templateUrl: './map-dashboard.component.html',
    styleUrls: ['./map-dashboard.component.scss'],
    providers: [MapDashboardService],
    standalone: false
})
export class MapDashboardComponent {
  @ViewChild('map', { read: ElementRef, static: false }) public mapRef!: ElementRef;

  public subscriptions = new Subscription();

  /* New Variables */
  // drivers: any = [];
  public options = {
    drivers: [],
    tags: [],
    polygons: [],
    start_date: null,
    end_date: null,
    date: null,
    heatmap: false,
  };

  public lang = {
    btnFilter: '',
    filter: {
      title: '',
      column: {
        drivers: '',
        polygons: '',
        tags: '',
        empty: '',
        search: '',
      },
      date: '',
      heatmap: {
        title: '',
        yes: '',
        no: '',
      },
      actions: {
        clear: '',
        cancel: '',
        apply: '',
      },
    },
    cluster: {
      init: '',
      type: '',
    },
  };

  public search: Record<string, string | null> = {
    drivers: '',
    polygons: '',
    tags: '',
  };

  constructor(
    public mapDashboardService: MapDashboardService,
    public router: Router,
    public apiRestService: AuthService,
    public headerService: HeaderService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private matDialog: MatDialog,
    public readonly primeService: PrimeService,
  ) {
    this.headerService.changeHeader(true);
  }

  public async ngOnInit() {
    this.setPolygonsMapLang();
    this.translateService.onLangChange.subscribe(async () => {
      this.setPolygonsMapLang();
    });

    this.subscriptions.add(
      this.router.events.subscribe((res) => {
        if (!(res instanceof NavigationEnd)) return;

        if (['/home', '/fleet'].includes(res.url)) {
          this.headerService.changeHeader(true);
          this.mapDashboardService.showPolygons = true;
          this.mapDashboardService.showFleetMap = true;
        }
      }),
    );

    this.subscriptions.add(this.mapDashboardService.clearMap.subscribe(() => this.clearMap()));

    this.subscriptions.add(
      this.mapDashboardService.getFleetDetails.subscribe((cleanRefresh) => this.getFleetDetails(cleanRefresh)),
    );

    this.subscriptions.add(
      this.mapDashboardService.clearFilter.subscribe(() => this.selectedAction({ action: 'clear' })),
    );

    // await this.getFleetDetails(false);

    await this.getDrivers();
    await this.getPolygons();
    await this.getTags();
  }

  public ngOnDestroy() {
    this.headerService.changeHeader(false);
    this.subscriptions.unsubscribe();
  }

  public async getFleetDetails(cleanRefresh: boolean) {
    if (!this.mapDashboardService.showFleetMap || this.mapDashboardService.userRole === 1) return;

    (
      await this.apiRestService.apiRest('', 'carriers/home', {
        loader: cleanRefresh,
      })
    )
      .pipe(catchError(() => of({})))
      .subscribe((res) => {
        if (res.status === 200 && res.result) {
          // When members exist on the fleet, it saves them on this array

          this.drivers = [
            ...res.result.members.map((member) => ({
              ...member,
              state: !member?.connected
                ? 'inactive'
                : member?.availability === 1
                ? 'available'
                : member?.availability === 2
                ? 'unavailable'
                : 'unavailable',
            })),
          ];

          this.mapDashboardService.haveNotFleetMembers = !res.result.trailers || !res.result.trucks;

          if (res.result.hasOwnProperty('errors') && res.result.errors.length > 0) {
            this.mapDashboardService.haveFleetMembersErrors = res.result.errors;
          }
        }

        const userRole = res.result.role;

        this.mapDashboardService.userRole = userRole;
        this.mapDashboardService.showFleetMap = !!userRole && !!this.drivers.length;
      });
  }

  public clearMap(): void {
    this.drivers = [];
  }

  // #region polygons
  public heatmap: boolean = false;

  public clearedFilter() {
    this.mapDashboardService.clearedFilter.next();
  }

  // #endregion

  /* New Functions for uiComponent Polygon Map */
  @ViewChild(BegoPolygonsMap) public polygonsMap: BegoPolygonsMap;

  public filter = {
    drivers: {
      loading: false,
      options: [],
      scrolleable: true,
    },
    polygons: {
      loading: false,
      options: [],
      scrolleable: true,
    },
    tags: {
      loading: false,
      options: [],
      scrolleable: true,
    },
  };

  public heatmaps = [];
  public polygons = [];
  public drivers = [];
  public filterPages = {
    drivers: { actual: 0, total: 0 },
    polygons: { actual: 0, total: 0 },
    tags: { actual: 0, total: 0 },
  };

  public tooltip = {
    loading: false,
    data: {},
  };

  public reloadData: any;

  public loading: boolean = false;
  public activeDrivers: boolean = false;
  public saveActiveDrivers: boolean = false;

  public activeShare: boolean = false;
  public activeModal: boolean = false;

  public heatmapSelection(status: boolean) {
    this.heatmap = status;
  }

  public async getDrivers(page: number = 1) {
    if (this.filter.drivers.loading) return;

    this.filter.drivers.loading = true;

    const queryParams = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (this.search.drivers) queryParams.append('search', this.search.drivers);

    (
      await this.apiRestService.apiRestGet(`carriers/get_drivers?${queryParams.toString()}`, {
        apiVersion: 'v1.1',
        loader: false,
      })
    ).subscribe({
      next: ({ result: { result, pages } }) => {
        if (page === 1) {
          this.filterPages.drivers.total = pages;
          this.filterPages.drivers.actual = 1;
        }

        result = result.map((driver) => ({ ...driver, avatar: driver.thumbnail, name: driver.nickname }));

        this.filter.drivers = {
          loading: false,
          options: page === 1 ? result : [...this.filter.drivers.options, ...result],
          scrolleable: page < pages,
        };
      },
      error: (err) => {
        console.error(err);
        this.filter.drivers.loading = false;
      },
      complete: () => {
        this.filter.drivers.loading = false;
      },
    });
  }

  public async getPolygons(page: number = 1) {
    if (this.filter.polygons.loading) return;

    this.filter.polygons.loading = true;

    const queryParams = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (this.search.polygons) queryParams.append('search', this.search.polygons);

    (
      await this.apiRestService.apiRestGet(`polygons?${queryParams.toString()}`, {
        apiVersion: 'v1.1',
        loader: false,
      })
    ).subscribe({
      next: ({ result: { result, pages } }) => {
        if (page === 1) {
          this.filterPages.polygons.total = pages;
          this.filterPages.polygons.actual = 1;
        }

        this.filter.polygons = {
          loading: false,
          options: page === 1 ? result : [...this.filter.polygons.options, ...result],
          scrolleable: page < pages,
        };
      },
      error: (err) => {
        console.error(err);
        this.filter.polygons.loading = false;
      },
      complete: () => {
        this.filter.polygons.loading = false;
      },
    });
  }

  public async getTags(page: number = 1) {
    if (this.filter.tags.loading) return;

    this.filter.tags.loading = true;

    const queryParams = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (this.search.tags) queryParams.append('search', this.search.tags);

    (
      await this.apiRestService.apiRestGet(`managers_tags?${queryParams.toString()}`, {
        apiVersion: 'v1.1',
        loader: false,
      })
    ).subscribe({
      next: ({ result: { result, pages } }) => {
        if (page === 1) {
          this.filterPages.tags.total = pages;
          this.filterPages.tags.actual = 1;
        }

        this.filter.tags = {
          loading: false,
          options: page === 1 ? result : [...this.filter.tags.options, ...result],
          scrolleable: page < pages,
        };
      },
      error: (err) => {
        console.error(err);
        this.filter.tags.loading = false;
      },
      complete: () => {
        this.filter.tags.loading = false;
      },
    });
  }

  public async loadMoreData(column: string) {
    this.filterPages[column].actual += 1;
    if (column === 'drivers') this.getDrivers(this.filterPages.drivers.actual);
    if (column === 'polygons') this.getPolygons(this.filterPages.polygons.actual);
    if (column === 'tags') this.getTags(this.filterPages.tags.actual);
  }

  public async selectedTooltip(userId: string) {
    this.tooltip = {
      loading: true,
      data: {},
    };
    const URL = `carriers/information?user_id=${userId}`;

    (await this.apiRestService.apiRestGet(URL, { loader: 'false' })).subscribe({
      next: ({ result }) => {
        this.tooltip = {
          loading: false,
          data: {
            username: result?.raw_nickname,
            email: result?.email,
            lastDate: result?.location_updated_at,
            location: result?.location,
            speed: result?.speed_kms_ph,
            battery: result?.device_battery,
          },
        };
      },
      error: (err) => {
        console.error(err);
        this.polygonsMap.closeTooltip();
        this.notificationsService.showErrorToastr('There was an error, try again later', 10000);
      },
    });
  }

  public reloadMap() {
    if (this.reloadData) this.selectedAction(this.reloadData);
    else this.polygonsMap.centerMap();
  }

  public async selectedAction(event: any) {
    console.log('selected action: ', event);
    const { action, heatmap } = event;

    switch (action) {
      case 'apply':
        if (this.loading) break;
        this.loading = true;

        this.heatmap = heatmap;
        this.reloadData = event;
        console.log('selected action: ', this.reloadData);
        if (heatmap) await this.getHeatmap(event);
        else await this.getDispersion(event);
        this.mapDashboardService.getCoordinates.next();
        break;

      case 'cancel':
        this.activeDrivers = this.saveActiveDrivers;
        if (this.options.start_date) this.heatmap = this.options.heatmap;
        else this.heatmap = false;
        this.polygonsMap.activeFilter = false;
        break;

      case 'clear':
        this.activeDrivers = false;
        this.saveActiveDrivers = false;
        this.heatmap = false;
        if (!this.options.start_date) break;
        if (this.polygonsMap.isTrafficActive) this.polygonsMap.toggleTraffic();
        this.clearFilters();
        this.getFleetDetails(false);
        break;

      default:
        break;
    }
  }

  public async getHeatmap(options: any) {
    this.activeShare = false;
    const queryParams = new URLSearchParams({
      drivers: JSON.stringify(options.drivers.map(({ _id }) => _id)),
      tags: JSON.stringify(options.tags.map(({ _id }) => _id)),
      polygons: JSON.stringify(options.polygons.map(({ _id }) => _id)),
      start_date: options.start_date,
      end_date: options.end_date + DAY,
    }).toString();
    (
      await this.apiRestService.apiRestGet(`polygons/heatmaps?${queryParams}`, {
        apiVersion: 'v1.1',
        getLoader: 'true',
        timeout: '90000',
      })
    ).subscribe({
      next: ({ result }) => {
        this.options = options;
        this.activeDrivers = false;
        this.polygonsMap.activeFilter = false;

        if (result?.locations?.length) this.activeShare = true;
        else
          this.notificationsService.showErrorToastr(
            this.translateService.instant('home.polygon-filter.filter.no-results.heatmap'),
            5000,
            'brand-snackbar-2',
          );

        this.polygons = [...result.geometry.features];
        this.heatmaps = [...result.locations];
        this.polygonsMap.activeFilter = false;
        this.loading = false;
      },
      error: ({ error }) => {
        console.error(error);
        this.loading = false;
        this.notificationsService.showErrorToastr(
          this.translateService.instant('home.polygon-filter.filter.error'),
          5000,
          'brand-snackbar-2',
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public async getDispersion(options: any) {
    this.activeShare = false;

    const newOptions = {
      drivers: JSON.stringify(options.drivers.map(({ _id }) => _id)),
      tags: JSON.stringify(options.tags.map(({ _id }) => _id)),
      polygons: JSON.stringify(options.polygons.map(({ _id }) => _id)),
      date: options.start_date + DAY,
      include_older_locations: JSON.stringify(!this.activeDrivers),
    };

    const queryParams = new URLSearchParams(newOptions).toString();

    (
      await this.apiRestService.apiRestGet(`polygons/dispersion?${queryParams}`, {
        apiVersion: 'v1.1',
        getLoader: 'true',
        timeout: '90000',
      })
    ).subscribe({
      next: ({ result }) => {
        this.options = options;
        this.polygonsMap.activeFilter = false;
        this.saveActiveDrivers = this.activeDrivers;

        if (result?.members?.length) this.activeShare = true;
        else
          this.notificationsService.showErrorToastr(
            this.translateService.instant('home.polygon-filter.filter.no-results.dispersion'),
            5000,
            'brand-snackbar-2',
          );

        this.polygons = [...result.geometry.features];
        this.drivers = [...result.members];
        this.loading = false;
        this.saveActiveDrivers = this.activeDrivers;
        this.polygonsMap.activeFilter = false;
      },
      error: ({ error }) => {
        console.error(error);
        this.loading = false;
        this.notificationsService.showErrorToastr(
          this.translateService.instant('home.polygon-filter.filter.error'),
          5000,
          'brand-snackbar-2',
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public openShareModal() {
    if (!this.activeShare || !!!this.options.start_date) return;

    const options = {
      ...this.options,
      drivers: this.options.drivers.map(({ _id }) => _id),
      polygons: this.options.polygons.map(({ _id }) => _id),
      tags: this.options.tags.map(({ _id }) => _id),
    };

    this.activeModal = true;
    const dialogRef = this.matDialog.open(ShareReportModalComponent, {
      data: {
        options,
        heatmap: this.heatmap,
        activeDrivers: !this.activeDrivers,
      },
      restoreFocus: false,
      backdropClass: ['brand-ui-dialog-2'],
    });

    dialogRef.afterClosed().subscribe(() => {
      this.activeModal = false;
    });
  }

  public openFilter() {
    if (!this.polygonsMap.activeFilter && !this.options?.start_date) this.polygonsMap.polygonFilter.useAction('clear');

    if (this.polygonsMap.activeFilter) {
      this.polygonsMap.polygonFilter?.loadState();
      this.heatmap = this.options.heatmap;
      this.activeDrivers = this.saveActiveDrivers;
    }
  }

  public checkedActive() {
    if (this.polygonsMap.activeFilter || !this.options?.start_date) return;
    this.getDispersion(this.options);
  }

  public clearFilters() {
    this.drivers = [];
    this.polygons = [];
    this.heatmaps = [];
    this.options = {
      drivers: [],
      tags: [],
      polygons: [],
      start_date: null,
      end_date: null,
      date: null,
      heatmap: false,
    };
    this.reloadData = null;
    this.mapDashboardService.clearedFilter.next();
  }

  public setPolygonsMapLang() {
    const path = 'home.polygon-filter.';

    this.lang = {
      btnFilter: this.translateService.instant(path + 'btn-filter'),
      filter: {
        title: this.translateService.instant(path + 'filter.title'),
        column: {
          drivers: this.translateService.instant(path + 'filter.column.drivers'),
          polygons: this.translateService.instant(path + 'filter.column.polygons'),
          tags: this.translateService.instant(path + 'filter.column.tags'),
          empty: '',
          search: this.translateService.instant(path + 'filter.column.search'),
        },
        date: this.translateService.instant(path + 'filter.date'),
        heatmap: {
          title: this.translateService.instant(path + 'filter.heatmap.title'),
          yes: this.translateService.instant(path + 'filter.heatmap.yes'),
          no: this.translateService.instant(path + 'filter.heatmap.no'),
        },
        actions: {
          clear: this.translateService.instant(path + 'filter.actions.clear'),
          cancel: this.translateService.instant(path + 'filter.actions.cancel'),
          apply: this.translateService.instant(path + 'filter.actions.apply'),
        },
      },
      cluster: {
        init: this.translateService.instant(path + 'filter.cluster.init'),
        type: this.translateService.instant(path + 'filter.cluster.type'),
      },
    };

    this.drivers = [...this.drivers];
  }
  public searchPolygons({ type, value }: { type: 'drivers' | 'polygons' | 'tags'; value: string }): void {
    this.search[type] = value;

    if (type === 'drivers') {
      this.search.drivers = value ? JSON.stringify({ nickname: value }) : null;
      this.getDrivers(1);
    } else if (type === 'polygons') {
      this.getPolygons(1);
    } else if (type === 'tags') {
      this.getTags(1);
    }
  }
}
