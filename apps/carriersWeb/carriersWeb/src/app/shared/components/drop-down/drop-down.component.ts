import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-drop-down',
    templateUrl: './drop-down.component.html',
    styleUrls: ['./drop-down.component.scss'],
    standalone: false
})
export class DropDownComponent implements OnInit {

  @Input() title: string = '';
  @Input() showRadioButton: boolean = false;
  @Input() validateData: boolean = false;
  @Input() panelExpanded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
