import { Injectable } from '@angular/core';
import { Account, Auth } from '../models/Users/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponse } from '../models/IResponse';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.api + '/Auth';
  constructor(private http: HttpClient, private router: Router) {}

  getLogin(auth: Auth): Observable<IResponse<Account>> {
    return this.http.post<IResponse<Account>>(`${this.api}/login`, auth);
  }

  startLogin(auth: Auth) {
    this.getLogin(auth).subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.alert(`¡Hola, ${result.singleData.name}!`, 'success');
          this.setLocalStorage(result.singleData);
          this.router.navigate(['/home']);
        } else {
          this.alert(`${result.message}`, 'error');
        }
      },
    });
  }

  getLocalStorage(): Account | null {
    if (localStorage.getItem('__user__')) {
      return JSON.parse(localStorage.getItem('__user__')!);
    } else {
      return null;
    }
  }
  setLocalStorage(user: Account) {
    if (localStorage.getItem('__user__')!) {
      localStorage.removeItem('__user__');
      localStorage.setItem('__user__', JSON.stringify(user));
    } else {
      localStorage.setItem('__user__', JSON.stringify(user));
    }
  }
  refreshToken(token: string) {
    // console.log(token);
    return this.http.get<IResponse<string>>(
      `${this.api}/refresh-token?token=${token}`
    );
  }
  logout() {
    // console.log(2);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          'text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
        cancelButton:
          'text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Seguro?',
        text: '¿Estás seguro de que quieres salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Si, salir!',
        cancelButtonText: '¡No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('__user__');
          this.router.navigate(['/login']);
        }
      });
  }

  alert(message: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icon,
      title: message,
    });
  }
}
