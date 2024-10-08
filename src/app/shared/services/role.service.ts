import { Injectable } from '@angular/core';
import { Role } from '../models/Roles/roles';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/IResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  api = environment.api + '/Role';
  constructor(private http: HttpClient) {}

  getAllRole(): Observable<IResponse<Role>> {
    return this.http.get<IResponse<Role>>(this.api);
  }
}
