import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BookDto } from '../../shared/models/DTO/BookDto';
import { BookService } from '../../shared/services/book.service';
import { IResponse } from '../../shared/models/IResponse';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
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
    private bookService: BookService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    this.getAllBook();
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
