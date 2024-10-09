import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../shared/models/Category/category';
import { CategoryService } from '../../shared/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategorySettingsComponent } from './category-settings/category-settings.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PaginatorComponent, CommonModule],
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
