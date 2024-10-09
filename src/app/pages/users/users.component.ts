import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Users } from '../../shared/models/Users/users';
import { UsersService } from '../../shared/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
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
  // openAddBook() {
  //   this.dialog.open(AddBookComponent, { width: '900px' });
  // }
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
