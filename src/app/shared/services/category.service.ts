import { Injectable } from '@angular/core';
import { Category } from '../models/Category/category';
import { IResponse } from '../models/IResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  api = environment.api + '/Category';
  constructor(private http: HttpClient) {}

  getAllCategory(): Observable<IResponse<Category>> {
    return this.http.get<IResponse<Category>>(this.api);
  }
}
