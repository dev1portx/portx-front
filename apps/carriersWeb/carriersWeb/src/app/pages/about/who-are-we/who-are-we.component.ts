import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-who-are-we',
    templateUrl: './who-are-we.component.html',
    styleUrls: ['./who-are-we.component.scss'],
    imports: [TranslatePipe]
})
export class WhoAreWeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
