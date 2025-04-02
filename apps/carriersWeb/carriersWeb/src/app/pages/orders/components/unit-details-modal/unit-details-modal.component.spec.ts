import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT__DIALOG_DATA, DialogModule, DialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UnitDetailsModalComponent } from './unit-details-modal.component';

describe('UnitDetailsModalComponent', () => {
  let component: UnitDetailsModalComponent;
  let fixture: ComponentFixture<UnitDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitDetailsModalComponent],
      imports: [DialogModule, ReactiveFormsModule, HttpClientModule, TranslatePipe.forRoot()],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: MAT__DIALOG_DATA, useValue: {} }, // Mock vacío para DialogRef
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
