import { Component, OnInit, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [TranslatePipe]
})
export class FooterComponent implements OnInit {
  @Input() animationOffset!: number;

  website_url = environment.website_url;

  constructor() {}

  ngOnInit(): void {}
}
