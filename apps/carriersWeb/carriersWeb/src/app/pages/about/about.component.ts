import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { WhoAreWeComponent } from './who-are-we/who-are-we.component';
import { GridComponent } from './grid/grid.component';
import { InvestorsComponent } from './investors/investors.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    imports: [LottieComponent, WhoAreWeComponent, GridComponent, InvestorsComponent, FooterComponent]
})
export class AboutComponent implements OnInit {
  mapOptions: AnimationOptions = {
    path: '/assets/lottie/trajectories.json'
  };

  constructor() {}

  ngOnInit(): void {}

  mapCreated(animationItem: AnimationItem): void {}
}
