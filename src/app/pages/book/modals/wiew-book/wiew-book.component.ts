import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wiew-book',
  standalone: true,
  imports: [],
  templateUrl: './wiew-book.component.html',
  styleUrl: './wiew-book.component.css',
})
export class WiewBookComponent {
  constructor(
    public dialogRef: MatDialogRef<WiewBookComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }
}
