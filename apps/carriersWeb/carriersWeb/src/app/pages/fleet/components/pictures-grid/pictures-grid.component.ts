import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UploadFilesComponent, UploadFilesProps } from '../upload-files/upload-files.component';

export interface ReceviedPicture {
  file: File;
  //index of file in picture list
  i: number;
  //the dialog of the uplaodFiles component
  dialog?: any;
}

@Component({
    selector: 'app-pictures-grid',
    templateUrl: './pictures-grid.component.html',
    styleUrls: ['./pictures-grid.component.scss'],
    standalone: false
})
export class PicturesGridComponent implements OnInit {
  @Input() pictures: File[];
  @Input() obligatoryImgs: number;
  @Output() onFileInput = new EventEmitter<ReceviedPicture>();

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  openFileEditor(flag: boolean) {
    if (!flag) return;
    const dialog = this.matDialog.open<UploadFilesComponent, UploadFilesProps>(UploadFilesComponent, {
      data: {
        places: 5,
        obligatoryImages: this.obligatoryImgs,
        files: this.pictures as any[],
        handleFileInput: (receivedPicture) => {
          this.onFileInput.emit({ ...receivedPicture, dialog });
        }
      },
      backdropClass: ['brand-dialog-1', 'no-padding']
    });
  }
}
