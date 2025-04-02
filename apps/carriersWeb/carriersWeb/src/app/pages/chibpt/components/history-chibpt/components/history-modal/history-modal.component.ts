import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';

interface Data {
  _id: string;
  title: string;
  created: string;
}

@Component({
    selector: 'app-history-modal',
    templateUrl: './history-modal.component.html',
    styleUrls: ['./history-modal.component.scss'],
    standalone: false
})
export class HistoryModalComponent {
  title: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<HistoryModalComponent>,
    private apiRestService: AuthService
  ) {
    this.title = this.data.title.length > 144 ? this.data.title.slice(0, 144) + '...' : this.data.title;
    this.title = `"${this.title}"`;
  }

  async deleteHistory() {
    (
      await this.apiRestService.apiRestDelete(`assistant/${this.data._id}`, {
        apiVersion: 'v1.1'
      })
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => console.error(err)
    });
  }

  async actions(action: string) {
    if (action === 'done') this.deleteHistory();
    else this.back();
  }

  back() {
    this.dialogRef.close();
  }
}
