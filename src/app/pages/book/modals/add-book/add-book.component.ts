import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Category } from '../../../../shared/models/Category/category';
import { Author } from '../../../../shared/models/Author/author';
import { AuthorService } from '../../../../shared/services/author.service';
import { CategoryService } from '../../../../shared/services/category.service';
@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [NgMultiSelectDropDownModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css',
})
export class AddBookComponent implements OnInit {
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  //dropdownSettings!: IDropdownSettings;
  categoryList: Category[] = [];
  authorList: Author[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddBookComponent>,
    private changeDetecter: ChangeDetectorRef,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
    ];
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
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  dropdownSettings(idField: string, textField: string): IDropdownSettings {
    return {
      singleSelection: false,
      idField,
      textField,
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 3,
      maxHeight: 110,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Datos no disponibles.',
    };
  }
}
