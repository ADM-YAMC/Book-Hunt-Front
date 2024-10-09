import { Injectable } from '@angular/core';
import { Users } from '../models/Users/users';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/IResponse';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  api = environment.api + '/Users';
  constructor(private http: HttpClient) {}

  getAllUser(): Observable<IResponse<Users>> {
    return this.http.get<IResponse<Users>>(this.api);
  }
}
