import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WebMenuComponent } from './web-menu/web-menu.component';
import { WebMenuButtonComponent } from './web-menu-button/web-menu-button.component';
import { NavigationComponent } from './navigation.component';
import { LottieComponent } from 'ngx-lottie';

@NgModule({
  declarations: [
    NavigationComponent,
    WebMenuComponent,
    WebMenuButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    LottieComponent
  ],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
