import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Category } from '../../../../shared/models/Category/category';
import { Author } from '../../../../shared/models/Author/author';
import { AuthorService } from '../../../../shared/services/author.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../../../shared/services/utility.service';
import { BookService } from '../../../../shared/services/book.service';
import { AuthorDto, CategoryDto } from '../../../../shared/models/DTO/BookDto';
@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css',
})
export class AddBookComponent implements OnInit {
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  //dropdownSettings!: IDropdownSettings;
  categoryList: Category[] = [];
  authorList: Author[] = [];
  authorListTemp: Author[] = [];
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  constructor(
    public dialogRef: MatDialogRef<AddBookComponent>,
    private changeDetecter: ChangeDetectorRef,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private utility: UtilityService,
    private bookService: BookService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.form = fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      publicationDate: ['', [Validators.required]],
      urlImageBook: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
      authorIds: ['', [Validators.required]],
      categoryIds: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    this.getAuthor();
    this.getCategory();
    if (this.data.window !== 1) {
      //console.log(this.data.data);
      const authors = this.data.data.authors.map((item: any) => {
        item.fullName = item.name;
        return item;
      });
      this.form.patchValue({
        ...this.data.data,
        authorIds: authors,
        publicationDate: this.formatPublicationDate(
          this.data.data.publicationDate
        ),
        categoryIds: this.data.data.categories,
      });
    }
    if (this.data.window === 3) {
      this.form.get('title')?.disable();
      this.form.get('description')?.disable();
      this.form.get('publicationDate')?.disable();
      this.form.get('urlImageBook')?.disable();
      this.form.get('isActive')?.disable();
      // this.form.get('categoryIds')?.disable();
      // this.form.get('categoryIds')?.disable();
    }
  }
  formatPublicationDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getCategory() {
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.categoryList = result.dataList.length > 0 ? result.dataList : [];
        }
      },
    });
  }
  getAuthor() {
    this.authorService.getAllAuthor().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.authorList = result.dataList.length > 0 ? result.dataList : [];
          this.authorListTemp = this.authorList.map((item: any) => {
            item.fullName = `${item.name} ${item.lastName}`;
            return item;
          });
          //console.log(this.authorListTemp);
        }
      },
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.data.window === 1) {
      this.setBook();
    } else {
      this.putBook();
    }
  }
  setBook() {
    this.formSubmitAttempt = true;
    const book = this.form.value;
    const transformedBook = {
      ...book,
      authorIds: book.authorIds.map((item: any) => item.authorId),
      categoryIds: book.categoryIds.map((item: any) => item.categoryId),
    };
    this.bookService.setBook(transformedBook).subscribe({
      next: (result) => {
        this.utility.alert(
          result.message,
          `${!result.thereIsError && result.successful ? 'success' : 'error'}`
        );
        if (!result.thereIsError && result.successful) {
          this.dialogRef.close(true);
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  putBook() {
    const book = this.form.value;
    const transformedBook = {
      ...book,
      authorIds: book.authorIds.map((item: any) => item.authorId),
      categoryIds: book.categoryIds.map((item: any) => item.categoryId),
    };

    // this.formSubmitAttempt = true;
    this.bookService.putBook(transformedBook, this.data.data.bookId).subscribe({
      next: (result) => {
        this.utility.alert(
          result.message,
          `${!result.thereIsError && result.successful ? 'success' : 'error'}`
        );
        if (!result.thereIsError && result.successful) {
          this.dialogRef.close(true);
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  dropdownSettings(
    idField: string,
    textField: string,
    itemsShowLimit: number
  ): IDropdownSettings {
    return {
      singleSelection: false,
      idField,
      textField,
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit,
      maxHeight: 110,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Datos no disponibles.',
    };
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)!.valid && this.form.get(field)!.touched) ||
      (this.form.get(field)!.untouched && this.formSubmitAttempt)
    );
  }
}
