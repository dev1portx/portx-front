import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT__DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CargoWeightComponent } from './cargo-weight.component';

describe('CargoWeightComponent', () => {
  let component: CargoWeightComponent;
  let fixture: ComponentFixture<CargoWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargoWeightComponent],
      imports: [MatDialogModule, TranslatePipe.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT__DIALOG_DATA, useValue: {} }, // Mock vacío para DialogRef
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
