import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../models/IResponse';
import { BookDto } from '../models/DTO/BookDto';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  api = environment.api + '/Book';
  constructor(private http: HttpClient) {}

  getAllBook(): Observable<IResponse<BookDto>> {
    return this.http.get<IResponse<BookDto>>(this.api);
  }
}
