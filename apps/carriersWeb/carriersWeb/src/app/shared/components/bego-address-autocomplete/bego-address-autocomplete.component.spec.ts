import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { BegoAddressAutocompleteComponent } from './bego-address-autocomplete.component';

declare global {
  interface Window {
    google: any;
  }
}

window.google = {
  maps: {
    places: {
      AutocompleteService: class {
        public getPlacePredictions = jest.fn();
      },
    },
  },
};

describe('BegoAddressAutocompleteComponent', () => {
  let component: BegoAddressAutocompleteComponent;
  let fixture: ComponentFixture<BegoAddressAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BegoAddressAutocompleteComponent],
      imports: [TranslatePipe.forRoot(), MatAutocompleteModule],
      providers: [{ provide: Dialog, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BegoAddressAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
