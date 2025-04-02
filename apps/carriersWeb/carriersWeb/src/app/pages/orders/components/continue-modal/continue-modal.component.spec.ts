import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT__DIALOG_DATA, DialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { ContinueModalComponent } from './continue-modal.component';

describe('ContinueModalComponent', () => {
  let component: ContinueModalComponent;
  let fixture: ComponentFixture<ContinueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContinueModalComponent],
      imports: [TranslatePipe.forRoot()],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: MAT__DIALOG_DATA, useValue: {} }, // Mock vacío para DialogRef
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
