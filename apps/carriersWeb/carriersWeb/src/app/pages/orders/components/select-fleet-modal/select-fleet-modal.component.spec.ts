import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT__DIALOG_DATA, DialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

import { SelectFleetModalComponent } from './select-fleet-modal.component';

describe('SelectFleetModalComponent', () => {
  let component: SelectFleetModalComponent;
  let fixture: ComponentFixture<SelectFleetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFleetModalComponent],
      imports: [HttpClientModule, TranslatePipe.forRoot()],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: MAT__DIALOG_DATA, useValue: {} }, // Mock vacío para DialogRef
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFleetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
