import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    imports: [TranslatePipe]
})
export class GridComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
