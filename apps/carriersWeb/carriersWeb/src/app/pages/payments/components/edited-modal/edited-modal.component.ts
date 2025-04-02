import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface AlertLang {
  title: string;
  subtitle: string;
}

@Component({
    selector: 'app-edited-modal',
    templateUrl: './edited-modal.component.html',
    styleUrls: ['./edited-modal.component.scss'],
    standalone: false
})
export class EditedModalComponent implements OnInit {
  alertLang: AlertLang = { title: '', subtitle: '' };

  constructor(@Inject(MAT_DIALOG_DATA) alertLang: AlertLang, public dialogRef: MatDialogRef<EditedModalComponent>) {
    this.alertLang = alertLang;
  }

  ngOnInit(): void {}

  closeEmitter(type: 'ok' | 'cancel') {
    if (type === 'ok') this.done();
    else this.close();
  }

  done() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
