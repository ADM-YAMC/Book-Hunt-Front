import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Users } from '../../shared/models/Users/users';
import { UsersService } from '../../shared/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { UsersSettingsComponent } from './users-settings/users-settings.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  usersListOriginal: Users[] = [];
  usersListTemp: Users[] = [];
  usersPaginator: Users[] = [];
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
    { id: 4, buscar: 'Buscar por correo...' },
    { id: 5, buscar: 'Buscar por rol...' },
    { id: 6, buscar: 'Buscar por estado...' },
  ];
  searchPlaceholderSelected: any;
  /**
   *
   */
  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  onChangeSelect(event: any) {
    //console.log(event.value);
    this.usersListTemp = this.usersListOriginal;
    this.buscarV = '';
    this.searchPlaceholderSelected = this.searchPlaceholder.find(
      (x) => x.id == event.value
    );
    this.placeholder = this.searchPlaceholderSelected?.buscar;
  }
  openAddUsers(user: Users | null, window: number) {
    this.dialog
      .open(UsersSettingsComponent, { width: '800px', data: { user, window } })
      .afterClosed()
      .subscribe((res: boolean) => {
        this.getAllUsers();
      });
  }
  buscar() {
    const query = this.buscarV.trim().toLowerCase();

    if (query && this.searchPlaceholderSelected?.id) {
      const filterById: { [key: number]: (x: any) => boolean } = {
        1: (x) => x.id === parseInt(query),
        2: (x) => x.name.toLowerCase().includes(query),
        3: (x) => x.lastName.toLowerCase().includes(query),
        4: (x) => x.email.toLowerCase().includes(query),
        5: (x) => x.role.roleName.toLowerCase().includes(query),
      };

      const filter = filterById[this.searchPlaceholderSelected.id];
      this.usersListTemp = filter
        ? this.usersListOriginal.filter(filter)
        : this.usersListOriginal;
    } else {
      this.usersListTemp = this.usersListOriginal;
    }
  }
  onChangeValueStatus(event: any) {
    if (this.searchPlaceholderSelected?.id === 6) {
      this.usersListTemp = this.usersListOriginal.filter(
        (x) => x.isActive === (event.value == 1)
      );
    }
  }
  getAllUsers() {
    this.usersService.getAllUser().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.usersListTemp =
            result.dataList.length > 0 ? result.dataList : [];
          this.usersListOriginal = result.dataList;
        } else {
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  getPaginatedRecords(event: any) {
    this.usersPaginator = event.formattedRecords[event.selectedPage - 1]
      ? event.formattedRecords[event.selectedPage - 1].records
      : [];
  }
}
