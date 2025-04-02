import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import AOS from 'aos';
import { Observable } from 'rxjs';
import { LanguageService } from './shared/services/language.service';
import { AlertService } from './shared/services/alert.service';
import { ProfileInfoService } from './pages/profile/services/profile-info.service';
import { CommonModule, Location } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavigationModule } from './shared/components/navigation/navigation.module';
import { MenuModule } from './shared/components/menu/menu.module';

import { BegoAlertModule } from './shared/components/bego-alert/bego-alert.module';
import { CalendarModule } from './pages/calendar/calendar.module';
import { SharedModule } from './shared/shared.module';
import { AppMaterialModule } from './material';
import { BegoModule } from '@begomx/ui-components';
import { SmallResolutionModalComponent } from './shared/components/small-resolution-modal/small-resolution-modal.component';

interface IncompatibleBrowserVersion {
  /**
   * The name of the navigator that is not compatible
   */
  navigator: String;
  /**
   * Min browser version accepted
   */
  minVersion?: number;
  /**
   * Max browser version accepted
   */
  maxVersion?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    AppMaterialModule,
    NavigationModule,
    MenuModule,
    BegoAlertModule,
    CalendarModule,
    SharedModule,
    BegoModule,
    SmallResolutionModalComponent,
  ],
})
export class AppComponent {
  public title = 'carriersDashboard';

  public alert$: Observable<any>;

  public showSmallResolutionModal: boolean = false;
  public incompatibleBrowsers: IncompatibleBrowserVersion[] = [
    {
      navigator: 'msie',
      minVersion: 11,
    },
  ];
  public showIncompatibleBrowserModal: boolean = false;

  public minWidthResolution = 1024;

  public currentPath: string = '';

  constructor(
    private alertService: AlertService,
    private location: Location,
    public router: Router,
    languageService: LanguageService,
    profileInfoService: ProfileInfoService
  ) {
    this.alert$ = this.alertService.alert$;

    languageService.setInitialLanguage();
    profileInfoService.getProfilePic();

    this.showSmallResolutionModal = window.innerWidth < this.minWidthResolution;
    window.addEventListener('resize', () => {
      this.showSmallResolutionModal =
        window.innerWidth < this.minWidthResolution;
    });

    // var ua=navigator.userAgent,tem;
    const webBrowserInfo =
      navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
    const browser = webBrowserInfo[1];
    const browserVersion = parseInt(webBrowserInfo[2]);

    this.incompatibleBrowsers.some((e: IncompatibleBrowserVersion) => {
      //if version not between accepted versions, then show modal
      if (
        e.navigator == browser &&
        (browserVersion < (e.minVersion || browserVersion) ||
          browserVersion > (e.maxVersion || browserVersion))
      ) {
        this.showIncompatibleBrowserModal = true;
      }
      return this.showIncompatibleBrowserModal;
    });
  }

  public ngOnInit(): void {
    AOS.init({
      duration: 1200,
    });

    this.currentPath = this.location.path();

    window.addEventListener('load', AOS.refresh);

    (window as any).placeholder = (img: HTMLImageElement) =>
      (img.src = '/assets/images/invoice/logo-placeholder.png');

    (window as any).blank = (img: HTMLImageElement) =>
      (img.src =
        'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  }
}
