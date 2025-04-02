import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FleetService } from 'src/app/shared/services/fleet.service';

@Component({
    selector: 'app-prime-list',
    templateUrl: './prime-list.component.html',
    styleUrls: ['./prime-list.component.scss'],
    standalone: false
})
export class PrimeListComponent {
  @Input() data = [];
  @Output() changeSelected = new EventEmitter();
  @Output() editCategory = new EventEmitter();
  @Output() deleted = new EventEmitter();

  lang = 'en';
  selected = '';

  defaultCover = '/assets/images/truck.svg';

  constructor(private translateService: TranslateService, private fleetService: FleetService) {
    this.lang = this.translateService.currentLang;
  }

  select(data: any) {
    this.selected = data._id;
    this.changeSelected.emit(this.selected);
  }

  edit(data: any) {
    this.editCategory.emit(data);
  }

  delete(data: any) {
    const id = data._id;
    this.fleetService.delete(['primeList', null, id]).subscribe(() => this.deleted.emit(id));
  }

  setDefaultImg(img: HTMLImageElement) {
    img.src = this.defaultCover;
    img.classList.add('default');
  }
}
