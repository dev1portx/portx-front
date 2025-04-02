import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FleetService } from 'src/app/shared/services/fleet.service';
import { routes } from '../../consts';

@Component({
    selector: 'app-trailer-card',
    templateUrl: './trailer-card.component.html',
    styleUrls: ['./trailer-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TrailerCardComponent implements OnInit, OnChanges, AfterViewInit {
  public routes: typeof routes = routes;

  @Input()
  data: any;

  @Output()
  deleted = new EventEmitter<string>();

  constructor(private translateService: TranslateService, public fleetService: FleetService) {}

  ngOnInit() {}

  ngOnChanges() {}

  ngAfterViewInit() {}

  delete() {
    this.fleetService.delete(['trailers', this.data.id_fleet, this.data._id]).subscribe(() => this.deleted.emit(this.data._id));
  }
}
