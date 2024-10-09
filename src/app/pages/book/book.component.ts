import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  AuthorDto,
  BookDto,
  CategoryDto,
} from '../../shared/models/DTO/BookDto';
import { BookService } from '../../shared/services/book.service';
import { CommonModule } from '@angular/common';
import { AddBookComponent } from './modals/add-book/add-book.component';
import { FormsModule } from '@angular/forms';
interface SearchPlaceholder {
  id: number;
}
@Component({
  selector: 'books',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, MatDialogModule, FormsModule],
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
  buscarV: string = '';
  statusValue!: number;
  placeholder: string | undefined = 'Seleccione una opción para buscar...';
  searchPlaceholder = [
    { id: 0, buscar: 'Seleccione una opción para buscar...' },
    { id: 1, buscar: 'Buscar por código...' },
    { id: 2, buscar: 'Buscar por título...' },
    { id: 3, buscar: 'Buscar por descripción...' },
    { id: 4, buscar: 'Buscar por fecha de publicación...' },
    { id: 5, buscar: 'Buscar por autor...' },
    { id: 6, buscar: 'Buscar por categoría...' },
    { id: 7, buscar: 'Buscar por estado...' },
  ];
  searchPlaceholderSelected: any;
  initDate: any;
  endDate: any;
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
    // console.log(this.searchPlaceholderSelected);
  }
  onChangeSelect(event: any) {
    //console.log(event.value);
    this.bookListTemp = this.bookListOriginal;
    this.buscarV = '';
    this.searchPlaceholderSelected = this.searchPlaceholder.find(
      (x) => x.id == event.value
    );
    this.placeholder = this.searchPlaceholderSelected?.buscar;
  }
  openAddBook(data: BookDto | null, window: number) {
    this.dialog
      .open(AddBookComponent, {
        width: '900px',
        data: {
          data,
          window,
        },
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllBook();
        }
      });
  }

  buscar() {
    const query = this.buscarV.trim().toLowerCase();

    if (
      (query && this.searchPlaceholderSelected?.id) ||
      this.searchPlaceholderSelected?.id === 4
    ) {
      console.log(1);
      const filterById: { [key: number]: (x: any) => boolean } = {
        1: (x) => x.bookId === parseInt(query),
        2: (x) => x.title.toLowerCase() === query,
        3: (x) => x.description.toLowerCase() === query,
        4: (x) => {
          const publicationDate = new Date(x.publicationDate);
          const fechaInicio = new Date(this.initDate);
          const fechaFin = new Date(this.endDate);
          return publicationDate >= fechaInicio && publicationDate <= fechaFin;
        },
        5: (x) => this.getNamesAuthor(x.authors).toLowerCase().includes(query),
        6: (x) =>
          this.getNamesCategory(x.categories).toLowerCase().includes(query),
      };

      const filter = filterById[this.searchPlaceholderSelected.id];
      this.bookListTemp = filter
        ? this.bookListOriginal.filter(filter)
        : this.bookListOriginal;
    } else {
      this.bookListTemp = this.bookListOriginal;
    }
  }

  formatPublicationDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  onChangeValueStatus(event: any) {
    if (this.searchPlaceholderSelected?.id === 7) {
      this.bookListTemp = this.bookListOriginal.filter(
        (x) => x.isActive === (event.value == 1)
      );
    }
  }
  getNamesCategory(category: CategoryDto[]): string {
    const categoryNames: string[] = [];
    category.forEach((category) => {
      categoryNames.push(category.name);
    });
    return `${categoryNames.join(', ')}`;
  }
  getNamesAuthor(author: AuthorDto[]): string {
    const authorNames: string[] = [];
    author.forEach((author) => {
      authorNames.push(author.name);
    });

    return `${authorNames.join(', ')}`;
  }
  getAllBook() {
    this.bookService.getAllBook().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          const data = result.dataList.length > 0 ? result.dataList : [];
          if (data.length > 0) {
            let newData = data.map((item: BookDto) => {
              item.publicationDate = this.formatPublicationDate(
                item.publicationDate
              );
              return item;
            });
            this.bookListOriginal = newData;
            this.bookListTemp = newData;
          }

          console.log(this.bookListOriginal);
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
