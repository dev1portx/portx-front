import { Route } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const appRoutes: Route[] = [
  {
    path: 'home',
    data: {
      breadcrumb: 'Home',
    },
    loadChildren: () =>
      import('./shared/pages/map-dashboard/map-dashboard.module').then(
        (m) => m.MapDashboardModule
      ),
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./pages/calendar/calendar.module').then((m) => m.CalendarModule),
  },
  {
    path: 'fleet',
    loadChildren: () =>
      import('./shared/pages/map-dashboard/map-dashboard.module').then(
        (m) => m.MapDashboardModule
      ),
  },
  /* {
    path: 'shippers',
    component: ShippersComponent,
    data: { animationState: 'Section' }
  },
  {
    path: 'carriers',
    component: CarriersComponent,
    data: { animationState: 'Section' }
  }, */
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'faq',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'drafts',
    loadChildren: () =>
      import('./pages/drafts/drafts.module').then((m) => m.DraftsModule),
  },
  {
    path: 'polygons',
    data: {
      breadcrumb: 'Polygons',
    },
    loadChildren: () =>
      import('./pages/polygons/polygons.module').then((m) => m.PolygonsModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'personal-info',
    //     pathMatch: 'full'
    //   },
    //   {
    //     path: 'personal-info',
    //     component: PersonalInfoComponent
    //   },
    //   {
    //     path: 'fiscal-documents',
    //     component: UploadFiscalDocsComponent
    //   }
    // ]
  },
  {
    path: 'contact-support',
    loadChildren: () =>
      import('./pages/contact-support/contact-support.module').then(
        (m) => m.ContactSupportModule
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'history',
    loadChildren: () =>
      import('./pages/history/history.module').then((m) => m.HistoryModule),
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./pages/payments/payments.module').then((m) => m.PaymentsModule),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./pages/orders/components/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
  {
    path: 'tracking',
    loadChildren: () =>
      import('./pages/tracking/tracking.module').then((m) => m.TrackingModule),
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('./pages/invoice/invoice.module').then((m) => m.InvoiceModule),
  },
  {
    path: 'tags',
    loadChildren: () =>
      import('./pages/tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'chibpt',
    loadChildren: () =>
      import('./pages/chibpt/chibpt.module').then((m) => m.ChibptModule),
  },
];
