import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT__DIALOG_DATA, Dialog, DialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PaymentsUploadModalComponent } from './payments-upload-modal.component';

describe('PaymentsUploadModalComponent', () => {
  let component: PaymentsUploadModalComponent;
  let fixture: ComponentFixture<PaymentsUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsUploadModalComponent],
      imports: [HttpClientModule, TranslatePipe.forRoot(), MatSnackBarModule],
      providers: [
        { provide: MAT__DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: {} },
        { provide: Dialog, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
