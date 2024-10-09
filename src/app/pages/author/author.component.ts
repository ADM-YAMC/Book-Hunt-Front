import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { MatDialog } from '@angular/material/dialog';
import { Author } from '../../shared/models/Author/author';
import { AuthorService } from '../../shared/services/author.service';
import { CommonModule } from '@angular/common';
import { AutorSettingsComponent } from './autor-settings/autor-settings.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [PaginatorComponent, CommonModule, FormsModule],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
})
export class AuthorComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  authorListOriginal: Author[] = [];
  authorListTemp: Author[] = [];
  authorPaginator: Author[] = [];
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
    { id: 3, buscar: 'Buscar por apellido...' },
    { id: 4, buscar: 'Buscar por estado...' },
  ];
  searchPlaceholderSelected: any;
  /**
   *
   */
  constructor(
    private dialog: MatDialog,
    private authorService: AuthorService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    this.getAllAuthor();
  }
  onChangeSelect(event: any) {
    //console.log(event.value);
    this.authorListTemp = this.authorListOriginal;
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
        1: (x) => x.authorId === parseInt(query),
        2: (x) => x.name.toLowerCase().includes(query),
        3: (x) => x.lastName.toLowerCase().includes(query),
      };

      const filter = filterById[this.searchPlaceholderSelected.id];
      this.authorListTemp = filter
        ? this.authorListOriginal.filter(filter)
        : this.authorListOriginal;
    } else {
      this.authorListTemp = this.authorListOriginal;
    }
  }
  onChangeValueStatus(event: any) {
    if (this.searchPlaceholderSelected?.id === 4) {
      this.authorListTemp = this.authorListOriginal.filter(
        (x) => x.isActive === (event.value == 1)
      );
    }
  }

  getAllAuthor() {
    this.authorService.getAllAuthor().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.authorListTemp =
            result.dataList.length > 0 ? result.dataList : [];
          this.authorListOriginal = result.dataList;
        } else {
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  openAuthorSettings(data: Author | null, window: number) {
    this.dialog
      .open(AutorSettingsComponent, {
        width: '500px',
        data: {
          data,
          window,
        },
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllAuthor();
        }
      });
  }
  getPaginatedRecords(event: any) {
    this.authorPaginator = event.formattedRecords[event.selectedPage - 1]
      ? event.formattedRecords[event.selectedPage - 1].records
      : [];
  }
}
