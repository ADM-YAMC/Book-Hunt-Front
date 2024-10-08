import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { CaptionEventModel } from '../../shared/models/CaptionEventModel';
import { CaptionOptions } from '../../shared/enums/CaptionOptions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  imports: [FormsModule],
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnChanges {
  @Input() registerQuantity!: number;
  @Input() records!: any[];
  @Input() originalRecordsLength!: number;
  @Input() listedRecordsLength!: number;
  pageModel: { count: number; offset?: number; prev?: boolean; last?: any } = {
    count: environment.register_per_page,
    offset: 0,
  };
  @Input() registerPerPage: number = environment.register_per_page;
  selectedPage = 1;
  firstPage = 1;
  lastPage!: number;
  @Output() onChage = new EventEmitter<CaptionEventModel>();
  pagesOptions: { page?: number; records?: any[] }[] = [];
  minPageQuantityWithoutSpread = 5;
  middlePageQuantity = 3;
  initialMiddlePages = [2, 3, 4];

  ngOnChanges(): void {
    this.pagesOptions = [];
    this.generatePageOptions();
  }

  generatePageOptions() {
    const pagesQuantity = Math.ceil(
      (this.registerQuantity > 0 ? (this.registerQuantity as number) : 1) /
        this.registerPerPage
    );

    if (this.registerQuantity > 0) {
      for (let page = 1; page <= pagesQuantity; page++) {
        this.pagesOptions.push({
          page: page,
          records: this.records.slice(
            (page - 1) * this.registerPerPage,
            page * this.registerPerPage
          ),
        });
      }
    }

    this.lastPage = this.pagesOptions.length;
    this.emitChange(CaptionOptions.ChangeRegisterPerPage);
  }

  nextPageCaption() {
    this.selectedPage++;
    this.emitChange(CaptionOptions.NextPage);
  }

  previousPageCaption() {
    this.selectedPage--;
    this.emitChange(CaptionOptions.PreviousPage);
  }

  getMidlePages(): Array<number> {
    if (this.selectedPage === this.lastPage - 1) {
      return [this.selectedPage - 2, this.selectedPage - 1, this.selectedPage];
    }

    if (this.selectedPage === this.firstPage + 1) {
      return this.initialMiddlePages;
    }

    if (
      this.selectedPage > this.firstPage &&
      this.selectedPage < this.lastPage
    ) {
      return [this.selectedPage - 1, this.selectedPage, this.selectedPage + 1];
    }

    if (this.selectedPage === this.lastPage) {
      return [
        this.selectedPage - 3,
        this.selectedPage - 2,
        this.selectedPage - 1,
      ];
    }

    return this.initialMiddlePages;
  }

  emitChange(option: string) {
    const emitter: CaptionEventModel = {
      registersPerPage: +this.registerPerPage,
      option,
      formattedRecords: this.pagesOptions,
      selectedPage: this.selectedPage,
    };
    this.onChage.emit(emitter);
  }

  chageRegisterPerPage(registerPerPage: any) {
    this.selectedPage = this.firstPage;
    this.registerPerPage = registerPerPage.value;
    this.pagesOptions = [];
    this.generatePageOptions();
    this.emitChange(CaptionOptions.ChangeRegisterPerPage);
  }

  // changeRegisterPerPage(registerPerPage: number): void {
  //   this.pageModel = {
  //     count: registerPerPage,
  //     offset:0
  //   };

  //   this.registerPerPage = registerPerPage;

  //   // this.getRecords();
  // }

  nextPage(registerPerPage: number): void {
    this.pageModel = {
      prev: false,
      last: this.pagesOptions[this.pagesOptions.length - 1].toString(),
      count: registerPerPage,
      offset: this.pageModel.offset! + registerPerPage,
    };
    //this.records[this.records.length - 1];

    // this.getRecords();
  }

  previousPage(registerPerPage: number): void {
    const firstPosition = 0;
    this.pageModel = {
      prev: true,
      last: this.pagesOptions[firstPosition].toString(),
      count: registerPerPage,
      offset: this.pageModel.offset! - registerPerPage,
    };

    // this.getRecords();
  }
}
