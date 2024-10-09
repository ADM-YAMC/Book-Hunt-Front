import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../shared/models/Category/category';
import { CategoryService } from '../../shared/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategorySettingsComponent } from './category-settings/category-settings.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PaginatorComponent, CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  categoryListOriginal: Category[] = [];
  categoryListTemp: Category[] = [];
  categoryPaginator: Category[] = [];
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
    { id: 2, buscar: 'Buscar por nombre...' },
    { id: 3, buscar: 'Buscar por estado...' },
  ];
  searchPlaceholderSelected: any;
  /**
   *
   */
  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    this.getAllCategory();
  }
  onChangeSelect(event: any) {
    //console.log(event.value);
    this.categoryListTemp = this.categoryListOriginal;
    this.buscarV = '';
    this.searchPlaceholderSelected = this.searchPlaceholder.find(
      (x) => x.id == event.value
    );
    this.placeholder = this.searchPlaceholderSelected?.buscar;
  }
  buscar() {
    const query = this.buscarV.trim().toLowerCase();

    if (query && this.searchPlaceholderSelected?.id) {
      const filterById: { [key: number]: (x: any) => boolean } = {
        1: (x) => x.categoryId === parseInt(query),
        2: (x) => x.name.toLowerCase().includes(query),
      };

      const filter = filterById[this.searchPlaceholderSelected.id];
      this.categoryListTemp = filter
        ? this.categoryListOriginal.filter(filter)
        : this.categoryListOriginal;
    } else {
      this.categoryListTemp = this.categoryListOriginal;
    }
  }
  onChangeValueStatus(event: any) {
    if (this.searchPlaceholderSelected?.id === 3) {
      this.categoryListTemp = this.categoryListOriginal.filter(
        (x) => x.isActive === (event.value == 1)
      );
    }
  }
  getAllCategory() {
    this.categoryService.getAllCategory().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.categoryListTemp =
            result.dataList.length > 0 ? result.dataList : [];
          this.categoryListOriginal = result.dataList;
        } else {
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  openCategorySettings(data: Category | null, window: number) {
    this.dialog
      .open(CategorySettingsComponent, {
        width: '500px',
        data: {
          data,
          window,
        },
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllCategory();
        }
      });
  }
  getPaginatedRecords(event: any) {
    this.categoryPaginator = event.formattedRecords[event.selectedPage - 1]
      ? event.formattedRecords[event.selectedPage - 1].records
      : [];
  }
}
