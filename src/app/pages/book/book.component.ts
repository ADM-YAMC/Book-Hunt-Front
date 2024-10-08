import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDto } from '../../shared/models/DTO/BookDto';
import { BookService } from '../../shared/services/book.service';
import { CommonModule } from '@angular/common';
import { AddBookComponent } from './modals/add-book/add-book.component';

@Component({
  selector: 'books',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, MatDialogModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  bookListOriginal: BookDto[] = [];
  bookListTemp: BookDto[] = [];
  bookPaginator: BookDto[] = [];
  filteredList: { records: any[]; enable: boolean } = {
    records: [],
    enable: false,
  };
  /**
   *
   */
  constructor(
    private dialog: MatDialog,
    private bookService: BookService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    this.getAllBook();
  }
  openAddBook() {
    this.dialog.open(AddBookComponent, { width: '900px' });
  }
  getAllBook() {
    this.bookService.getAllBook().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.bookListTemp = result.dataList.length > 0 ? result.dataList : [];
          this.bookListOriginal = result.dataList;
        } else {
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  getPaginatedRecords(event: any) {
    this.bookPaginator = event.formattedRecords[event.selectedPage - 1]
      ? event.formattedRecords[event.selectedPage - 1].records
      : [];
  }
}
