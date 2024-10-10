import { Component, OnInit } from '@angular/core';
import { BookService } from '../../shared/services/book.service';
import {
  AuthorDto,
  BookDto,
  CategoryDto,
} from '../../shared/models/DTO/BookDto';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WiewBookComponent } from '../book/modals/wiew-book/wiew-book.component';

@Component({
  selector: 'app-book-home',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule],
  templateUrl: './book-home.component.html',
  styleUrl: './book-home.component.css',
})
export class BookHomeComponent implements OnInit {
  bookListOriginal: BookDto[] = [];
  bookListTemp: BookDto[] = [];
  search: string = '';
  initDate: any;
  endDate: any;
  DateFilterApplied: boolean = false;
  /**
   *
   */
  constructor(private bookService: BookService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.getAllBook();
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
              item.namesAuthors = this.getNamesAuthor(item.authors);
              item.namesCategories = this.getNamesCategory(item.categories);
              return item;
            });
            this.bookListOriginal = newData;
            this.bookListTemp = newData;
          }
        } else {
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  openDetail(book: BookDto) {
    this.dialog.open(WiewBookComponent, { width: '750px', data: book });
  }
  get filteredBooks() {
    return this.bookListTemp.filter((book: BookDto) => {
      const normalizedText = this.normalizeText(this.search);
      return (
        book.title.toLowerCase().includes(normalizedText) ||
        book.namesCategories!.toLowerCase().includes(normalizedText) ||
        book.namesAuthors!.toLowerCase().includes(normalizedText) ||
        book.description.toLowerCase().includes(normalizedText) ||
        book.publicationDate.toLowerCase().includes(normalizedText)
      );
    });
  }
  removeFilterByDate() {
    this.bookListTemp = this.bookListOriginal;
    this.initDate = null;
    this.endDate = null;
    this.DateFilterApplied = false;
  }
  filterByDate() {
    this.bookListTemp = this.bookListTemp.filter((x) => {
      const publicationDate = new Date(x.publicationDate);
      const fechaInicio = new Date(this.initDate);
      const fechaFin = new Date(this.endDate);
      return publicationDate >= fechaInicio && publicationDate <= fechaFin;
    });
    this.DateFilterApplied = true;
    //console.log(this.bookListTemp);
  }
  normalizeText(texto: string): string {
    return texto
      ? texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';
  }
  searchbarInput(ev: any) {
    this.search = ev.target.value;
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
  formatPublicationDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
