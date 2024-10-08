import { Injectable } from '@angular/core';
import { Author } from '../models/Author/author';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/IResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  api = environment.api + '/Author';
  constructor(private http: HttpClient) {}

  getAllAuthor(): Observable<IResponse<Author>> {
    return this.http.get<IResponse<Author>>(this.api);
  }
}
